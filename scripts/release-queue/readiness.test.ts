import assert from 'node:assert/strict';
import { describe, it, type TestContext } from 'node:test';
import { setImmediate } from 'node:timers/promises';
import { CHECK_STATES } from '../lib/github/checks.ts';
import { REVIEW_STATES } from '../lib/github/repository.ts';
import { REFUSAL_REASONS } from './decision.ts';
import {
	buildPullRequest,
	buildReadyState,
	buildReview,
	FakeRepository,
	MAINTAINER,
} from './fake-repository.ts';
import { findReadinessProblems, readReadiness, type Readiness } from './readiness.ts';

const READY: Readiness = {
	isDraft: false,
	isApprovedByMaintainer: true,
	hasChangesRequestedByMaintainer: false,
	isMergeable: true,
	hasFailingChecks: false,
	hasPendingChecks: false,
};

const OUTSIDER = 'example-outsider';
const JOB_NAME = 'release-queue';

/** Reads the readiness of PR #1, approved and with passing checks unless `changes` say otherwise. */
async function readReadinessWith(changes: Partial<ReturnType<typeof buildReadyState>> = {}) {
	const pullRequest = buildPullRequest({ number: 1 });
	const docs = new FakeRepository({ ...buildReadyState(pullRequest), ...changes });
	return readReadiness({ docs, jobName: JOB_NAME }, pullRequest);
}

/** Runs `operation` while answering each timer it sets, until it settles. */
async function runWithTimers<T>(t: TestContext, operation: () => Promise<T>): Promise<T> {
	t.mock.timers.enable({ apis: ['setTimeout'] });
	let isSettled = false;
	const promise = operation().finally(() => {
		isSettled = true;
	});
	while (!isSettled) {
		await setImmediate();
		t.mock.timers.runAll();
	}
	return promise;
}

describe('findReadinessProblems', () => {
	it('should find no problem in a PR ready to join', () => {
		assert.deepEqual(findReadinessProblems(READY), []);
	});

	it('should find every problem of a PR', () => {
		const problems = findReadinessProblems({
			isDraft: true,
			isApprovedByMaintainer: false,
			hasChangesRequestedByMaintainer: true,
			isMergeable: false,
			hasFailingChecks: true,
			hasPendingChecks: true,
		});

		assert.deepEqual(problems, [
			REFUSAL_REASONS.draft,
			REFUSAL_REASONS.changesRequested,
			REFUSAL_REASONS.missingApproval,
			REFUSAL_REASONS.mergeConflict,
			REFUSAL_REASONS.failingChecks,
			REFUSAL_REASONS.pendingChecks,
		]);
	});

	it('should refuse a PR whose mergeability is still unknown', () => {
		const problems = findReadinessProblems({ ...READY, isMergeable: null });

		assert.deepEqual(problems, [REFUSAL_REASONS.unknownMergeability]);
	});
});

describe('readReadiness', () => {
	it('should read a PR ready to join', async () => {
		assert.deepEqual(await readReadinessWith(), READY);
	});

	it('should read a draft', async () => {
		const pullRequest = buildPullRequest({ number: 1, isDraft: true });
		const docs = new FakeRepository(buildReadyState(pullRequest));

		const readiness = await readReadiness({ docs, jobName: JOB_NAME }, pullRequest);

		assert.equal(readiness.isDraft, true);
	});

	describe('reviews', () => {
		it('should only count the reviews of maintainers', async () => {
			const readiness = await readReadinessWith({
				reviewsByPrNumber: {
					1: [
						buildReview(OUTSIDER, REVIEW_STATES.approved),
						buildReview(OUTSIDER, REVIEW_STATES.changesRequested),
					],
				},
			});

			assert.equal(readiness.isApprovedByMaintainer, false);
			assert.equal(readiness.hasChangesRequestedByMaintainer, false);
		});

		it("should count each maintainer's latest approval or request for changes", async () => {
			const readiness = await readReadinessWith({
				reviewsByPrNumber: {
					1: [
						buildReview(MAINTAINER, REVIEW_STATES.changesRequested),
						buildReview(MAINTAINER, REVIEW_STATES.approved),
						buildReview(MAINTAINER, REVIEW_STATES.commented),
					],
				},
			});

			assert.equal(readiness.isApprovedByMaintainer, true);
			assert.equal(readiness.hasChangesRequestedByMaintainer, false);
		});

		it('should count a request for changes from one maintainer next to an approval', async () => {
			const otherMaintainer = 'example-other-maintainer';
			const readiness = await readReadinessWith({
				maintainers: [MAINTAINER, otherMaintainer],
				reviewsByPrNumber: {
					1: [
						buildReview(MAINTAINER, REVIEW_STATES.approved),
						buildReview(otherMaintainer, REVIEW_STATES.changesRequested),
					],
				},
			});

			assert.equal(readiness.isApprovedByMaintainer, true);
			assert.equal(readiness.hasChangesRequestedByMaintainer, true);
		});

		it('should not count a dismissed review', async () => {
			const readiness = await readReadinessWith({
				reviewsByPrNumber: {
					1: [
						buildReview(MAINTAINER, REVIEW_STATES.changesRequested),
						buildReview(MAINTAINER, REVIEW_STATES.dismissed),
					],
				},
			});

			assert.equal(readiness.hasChangesRequestedByMaintainer, false);
		});

		it('should skip the reviews of deleted accounts', async () => {
			const readiness = await readReadinessWith({
				reviewsByPrNumber: { 1: [buildReview(null, REVIEW_STATES.approved)] },
			});

			assert.equal(readiness.isApprovedByMaintainer, false);
		});
	});

	describe('mergeability', () => {
		it('should ask again while GitHub checks for conflicts', async (t) => {
			const pullRequest = buildPullRequest({ number: 1, mergeable: null });
			const docs = new FakeRepository(buildReadyState(pullRequest));
			const getPullRequest = t.mock.method(docs, 'getPullRequest');
			getPullRequest.mock.mockImplementationOnce(async () => pullRequest, 0);
			getPullRequest.mock.mockImplementationOnce(
				async () => ({ ...pullRequest, mergeable: false }),
				1
			);

			const readiness = await runWithTimers(t, () =>
				readReadiness({ docs, jobName: JOB_NAME }, pullRequest)
			);

			assert.equal(readiness.isMergeable, false);
			assert.equal(getPullRequest.mock.callCount(), 2);
		});

		it('should give up when GitHub takes too long to check for conflicts', async (t) => {
			const pullRequest = buildPullRequest({ number: 1, mergeable: null });
			const docs = new FakeRepository(buildReadyState(pullRequest));

			const readiness = await runWithTimers(t, () =>
				readReadiness({ docs, jobName: JOB_NAME }, pullRequest)
			);

			assert.equal(readiness.isMergeable, null);
		});
	});

	describe('checks', () => {
		it('should read failing and pending checks', async () => {
			const readiness = await readReadinessWith({
				checksByRef: {
					'sha-1': [
						{ name: 'build', state: CHECK_STATES.failure },
						{ name: 'deploy', state: CHECK_STATES.pending },
					],
				},
			});

			assert.equal(readiness.hasFailingChecks, true);
			assert.equal(readiness.hasPendingChecks, true);
		});

		it('should ignore the job running the release queue', async () => {
			const readiness = await readReadinessWith({
				checksByRef: {
					'sha-1': [
						{ name: JOB_NAME, state: CHECK_STATES.pending },
						{ name: JOB_NAME, state: CHECK_STATES.failure },
					],
				},
			});

			assert.equal(readiness.hasFailingChecks, false);
			assert.equal(readiness.hasPendingChecks, false);
		});

		it('should count every check outside GitHub Actions', async () => {
			const pullRequest = buildPullRequest({ number: 1 });
			const docs = new FakeRepository({
				...buildReadyState(pullRequest),
				checksByRef: { 'sha-1': [{ name: JOB_NAME, state: CHECK_STATES.pending }] },
			});

			const readiness = await readReadiness({ docs, jobName: null }, pullRequest);

			assert.equal(readiness.hasPendingChecks, true);
		});
	});
});
