import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PullRequestDetails } from '../lib/github/repository.ts';
import { GitHubError } from '../lib/github/request.ts';
import {
	renderDryRunComment,
	renderJoinedComment,
	renderMergeFailureComment,
	renderRefusalComment,
	renderUmbrellaFailureComment,
} from './comments.ts';
import { OUTCOMES, REFUSAL_REASONS, type Decision } from './decision.ts';
import {
	buildPullRequest,
	buildReadyState,
	CREATED_PR_NUMBER,
	FakeRepository,
} from './fake-repository.ts';
import { joinAcceptedPullRequests, previewJoin } from './join.ts';
import { renderUmbrellaBody } from './umbrella.ts';

const MAIN_ROUTE = { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' };

function createContext(docs: FakeRepository, astro = new FakeRepository({})) {
	const logs: string[] = [];
	const log = (message: string) => logs.push(message);
	return { context: { docs, astro, log, jobName: 'release-queue' }, logs };
}

function buildComment(prNumber: number, decision: Decision) {
	return { method: 'createComment', args: [prNumber, renderDryRunComment(decision)] };
}

describe('previewJoin', () => {
	it('should comment with the umbrella a ready PR would join', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			buildComment(7, {
				outcome: OUTCOMES.join,
				route: { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' },
			}),
		]);
		assert.deepEqual(logs, [
			'Releases: stable none open, prerelease the same.',
			'Dry run: #7 would join release-queue/main.',
		]);
	});

	it('should comment that a PR for the stable umbrella would wait for the major release', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const releasePullRequest = buildPullRequest({
			number: 100,
			headBranch: 'changeset-release/main',
			body: '# Releases\n\n## astro@8.0.0\n\n### Major Changes\n',
		});
		const astro = new FakeRepository({ pullRequests: [releasePullRequest] });
		const { context, logs } = createContext(docs, astro);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			buildComment(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.majorReleasePending],
			}),
		]);
		assert.equal(
			logs[0],
			`Releases: stable ${astro.fullName}#100 (astro@8.0.0, major), prerelease the same.`
		);
	});

	it('should comment with the reason a PR with the wrong labels would be refused', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const { context } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			buildComment(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.missingReleaseLabel],
			}),
		]);
	});

	it('should comment with the reasons a PR not ready to merge would be refused', async () => {
		const pullRequest = buildPullRequest({
			number: 7,
			labels: ['accepted', 'minor-release'],
			isDraft: true,
		});
		const docs = new FakeRepository({ pullRequests: [pullRequest] });
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			buildComment(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.draft, REFUSAL_REASONS.missingApproval],
			}),
		]);
		assert.equal(
			logs.at(-1),
			`Dry run: #7 would be refused (${REFUSAL_REASONS.draft}, ${REFUSAL_REASONS.missingApproval}).`
		);
	});

	it('should skip a PR that no longer has the accepted label', async () => {
		const docs = new FakeRepository({
			pullRequests: [buildPullRequest({ number: 7, labels: ['minor-release'] })],
		});
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, []);
		assert.match(logs.join('\n'), /^#7 skipped:/m);
	});

	it('should skip an umbrella PR', async () => {
		const umbrella = buildPullRequest({
			number: 7,
			headBranch: 'release-queue/main',
			labels: ['accepted', 'minor-release'],
		});
		const docs = new FakeRepository({ pullRequests: [umbrella] });
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, []);
		assert.match(logs.join('\n'), /^#7 skipped:/m);
	});
});

/** Builds a repository where every given PR is approved by a maintainer, with passing checks. */
function buildReadyRepository(
	pullRequests: PullRequestDetails[],
	branchShas: Record<string, string> = { main: 'sha-main' }
) {
	const states = pullRequests.map(buildReadyState);
	return new FakeRepository({
		pullRequests,
		reviewsByPrNumber: Object.assign({}, ...states.map((state) => state.reviewsByPrNumber)),
		checksByRef: Object.assign({}, ...states.map((state) => state.checksByRef)),
		branchShas,
	});
}

function buildAcceptedPullRequest(number: number, baseBranch = 'main') {
	return buildPullRequest({ number, baseBranch, labels: ['accepted', 'minor-release'] });
}

function buildUmbrellaPullRequest(number: number) {
	return buildPullRequest({
		number,
		headBranch: 'release-queue/main',
		labels: ['merge-on-release'],
	});
}

describe('joinAcceptedPullRequests', () => {
	it('should create the umbrella, then merge the PR into it', async () => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7)]);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests(context);

		assert.deepEqual(docs.writes, [
			{ method: 'createBranch', args: ['release-queue/main', 'sha-main'] },
			{ method: 'updatePullRequest', args: [7, { base: 'release-queue/main' }] },
			{ method: 'mergePullRequest', args: [7, { method: 'squash', expectedHeadSha: 'sha-7' }] },
			{
				method: 'createPullRequest',
				args: [
					{
						title: '[ci] release main docs',
						head: 'release-queue/main',
						base: 'main',
						body: renderUmbrellaBody(MAIN_ROUTE),
					},
				],
			},
			{ method: 'createComment', args: [7, renderJoinedComment(MAIN_ROUTE, CREATED_PR_NUMBER)] },
			{ method: 'addLabels', args: [CREATED_PR_NUMBER, ['merge-on-release']] },
		]);
	});

	it('should merge the PR into the open umbrella', async () => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7), buildUmbrellaPullRequest(50)], {
			main: 'sha-main',
			'release-queue/main': 'sha-umbrella',
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests(context);

		assert.deepEqual(docs.writes, [
			{ method: 'updatePullRequest', args: [7, { base: 'release-queue/main' }] },
			{ method: 'mergePullRequest', args: [7, { method: 'squash', expectedHeadSha: 'sha-7' }] },
			{ method: 'createComment', args: [7, renderJoinedComment(MAIN_ROUTE, 50)] },
		]);
	});

	it('should keep the base of a PR based on the umbrella branch', async () => {
		const docs = buildReadyRepository(
			[buildAcceptedPullRequest(7, 'release-queue/main'), buildUmbrellaPullRequest(50)],
			{ main: 'sha-main', 'release-queue/main': 'sha-umbrella' }
		);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests(context);

		assert.deepEqual(
			docs.writes.map(({ method }) => method),
			['mergePullRequest', 'createComment']
		);
	});

	it('should remove the accepted label, then comment, when refusing a PR', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted'] });
		const docs = buildReadyRepository([pullRequest]);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests(context);

		assert.deepEqual(docs.writes, [
			{ method: 'removeLabel', args: [7, 'accepted'] },
			{
				method: 'createComment',
				args: [7, renderRefusalComment([REFUSAL_REASONS.missingReleaseLabel])],
			},
		]);
	});

	it('should restore the base of a PR GitHub refuses to merge, then refuse it', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7), buildUmbrellaPullRequest(50)], {
			main: 'sha-main',
			'release-queue/main': 'sha-umbrella',
		});
		t.mock.method(docs, 'mergePullRequest', async () => {
			throw new GitHubError({
				message: 'PUT /merge failed with 405: Pull Request is not mergeable',
				status: 405,
				apiMessage: 'Pull Request is not mergeable',
			});
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests(context);

		assert.deepEqual(docs.writes, [
			{ method: 'updatePullRequest', args: [7, { base: 'release-queue/main' }] },
			{ method: 'updatePullRequest', args: [7, { base: 'main' }] },
			{ method: 'removeLabel', args: [7, 'accepted'] },
			{
				method: 'createComment',
				args: [7, renderMergeFailureComment(MAIN_ROUTE, 'Pull Request is not mergeable')],
			},
		]);
	});

	it('should comment on the merged PR when the umbrella PR cannot be opened', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7)]);
		t.mock.method(docs, 'createPullRequest', async () => {
			throw new GitHubError({
				message: 'POST /pulls failed with 422: Validation Failed',
				status: 422,
				apiMessage: 'Validation Failed',
			});
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests(context);

		assert.deepEqual(docs.writes.at(-1), {
			method: 'createComment',
			args: [7, renderUmbrellaFailureComment(MAIN_ROUTE, 'Validation Failed')],
		});
		assert.ok(!docs.writes.some(({ method }) => method === 'addLabels'));
	});

	it('should handle every accepted PR, oldest first, and skip the others', async () => {
		const acceptedUmbrella = { ...buildUmbrellaPullRequest(50), labels: [{ name: 'accepted' }] };
		const docs = buildReadyRepository(
			[
				buildAcceptedPullRequest(9),
				buildPullRequest({ number: 8, labels: ['minor-release'] }),
				buildAcceptedPullRequest(7),
				acceptedUmbrella,
			],
			{ main: 'sha-main', 'release-queue/main': 'sha-umbrella' }
		);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests(context);

		const mergedPrNumbers = docs.writes
			.filter(({ method }) => method === 'mergePullRequest')
			.map(({ args }) => args[0]);
		assert.deepEqual(mergedPrNumbers, [7, 9]);
	});

	it('should handle the other PRs when one fails, then fail', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7), buildAcceptedPullRequest(9)], {
			main: 'sha-main',
			'release-queue/main': 'sha-umbrella',
		});
		const getPullRequest = docs.getPullRequest.bind(docs);
		t.mock.method(docs, 'getPullRequest', async (prNumber: number) => {
			if (prNumber === 7) throw new Error('Network error');
			return getPullRequest(prNumber);
		});
		const { context, logs } = createContext(docs);

		await assert.rejects(joinAcceptedPullRequests(context), AggregateError);

		assert.ok(
			docs.writes.some(({ method, args }) => method === 'mergePullRequest' && args[0] === 9)
		);
		assert.ok(logs.includes('#7 failed: Network error'));
	});
});
