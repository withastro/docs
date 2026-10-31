import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CHECK_STATES } from '../lib/github/checks.ts';
import { REVIEW_STATES } from '../lib/github/repository.ts';
import {
	buildPullRequest,
	buildReadyState,
	FakeRepository,
	JOB_NAME,
	MAINTAINER,
} from './fake-repository.ts';
import { readReadiness, type Readiness } from './readiness.ts';

const READY: Readiness = {
	isDraft: false,
	isApprovedByMaintainer: true,
	hasChangesRequestedByMaintainer: false,
	isMergeable: true,
	hasFailingChecks: false,
	hasPendingChecks: false,
};

const OUTSIDER = 'example-outsider';

/** Reads the readiness of PR #1, approved and with passing checks unless `changes` say otherwise. */
async function readReadinessWith(changes: Partial<ReturnType<typeof buildReadyState>> = {}) {
	const pullRequest = buildPullRequest({ number: 1 });
	const docs = new FakeRepository({ ...buildReadyState(pullRequest), ...changes });
	return readReadiness({ docs, jobName: JOB_NAME }, pullRequest);
}

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
				reviewStatesByPrNumber: {
					1: {
						[OUTSIDER]: REVIEW_STATES.approved,
						'example-other-outsider': REVIEW_STATES.changesRequested,
					},
				},
			});

			assert.equal(readiness.isApprovedByMaintainer, false);
			assert.equal(readiness.hasChangesRequestedByMaintainer, false);
		});

		it('should count a request for changes from one maintainer next to an approval', async () => {
			const otherMaintainer = 'example-other-maintainer';
			const readiness = await readReadinessWith({
				maintainers: [MAINTAINER, otherMaintainer],
				reviewStatesByPrNumber: {
					1: {
						[MAINTAINER]: REVIEW_STATES.approved,
						[otherMaintainer]: REVIEW_STATES.changesRequested,
					},
				},
			});

			assert.equal(readiness.isApprovedByMaintainer, true);
			assert.equal(readiness.hasChangesRequestedByMaintainer, true);
		});

		it('should not count a dismissed review', async () => {
			const readiness = await readReadinessWith({
				reviewStatesByPrNumber: { 1: { [MAINTAINER]: REVIEW_STATES.dismissed } },
			});

			assert.equal(readiness.isApprovedByMaintainer, false);
			assert.equal(readiness.hasChangesRequestedByMaintainer, false);
		});
	});

	describe('mergeability', () => {
		it('should take the mergeability GitHub gives once it has checked for conflicts', async () => {
			const pullRequest = buildPullRequest({ number: 1, mergeable: null });
			const checkedPullRequest = { ...pullRequest, mergeable: false };
			const docs = new FakeRepository(buildReadyState(checkedPullRequest));

			const readiness = await readReadiness({ docs, jobName: JOB_NAME }, pullRequest);

			assert.equal(readiness.isMergeable, false);
		});

		it('should give no mergeability when GitHub takes too long to check for conflicts', async () => {
			const pullRequest = buildPullRequest({ number: 1, mergeable: null });
			const docs = new FakeRepository(buildReadyState(pullRequest));

			const readiness = await readReadiness({ docs, jobName: JOB_NAME }, pullRequest);

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

		it('should ignore the job running the release assistant', async () => {
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
