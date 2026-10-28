import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hasLabel, type PullRequestDetails } from '../lib/github/repository.ts';
import { GitHubError } from '../lib/github/request.ts';
import {
	renderJoinedComment,
	renderMergeFailureComment,
	renderRefusalComment,
	renderUmbrellaFailureComment,
} from './comments.ts';
import {
	buildPullRequest,
	buildReadyState,
	createContext,
	CREATED_PR_NUMBER,
	FakeRepository,
	MAIN_BRANCHES,
} from './fake-repository.ts';
import { REFUSAL_REASONS } from './join-decision.ts';
import { renderUmbrella } from './umbrella-content.ts';
import { joinAcceptedPullRequests } from './umbrella-join.ts';

const NO_RELEASES = { stable: null, prerelease: null };

/** Builds the state of a run starting with the open PRs of the fake repository. */
async function buildState(docs: FakeRepository) {
	return {
		releases: NO_RELEASES,
		settledBaseBranches: [],
		openPullRequests: await docs.getOpenPullRequests(),
	};
}

/**
 * Builds a repository where every given PR is approved by a maintainer, with
 * passing checks. The main umbrella branch has a squash commit for each
 * accepted PR, as after the joins.
 */
function buildReadyRepository(
	pullRequests: PullRequestDetails[],
	branchShas: Record<string, string> = { main: 'sha-main' }
) {
	const states = pullRequests.map(buildReadyState);
	const commits = pullRequests
		.filter((pullRequest) => hasLabel(pullRequest, 'accepted'))
		.map(({ number, title }) => ({
			sha: `sha-${number}`,
			commit: { message: `${title} (#${number})` },
		}));
	return new FakeRepository({
		pullRequests,
		reviewStatesByPrNumber: Object.assign(
			{},
			...states.map((state) => state.reviewStatesByPrNumber)
		),
		checksByRef: Object.assign({}, ...states.map((state) => state.checksByRef)),
		branchShas,
		comparisons: { 'main...release-queue/main': { ahead_by: commits.length, commits } },
	});
}

function buildMergeWrite(prNumber: number) {
	return {
		method: 'mergePullRequest',
		args: [
			prNumber,
			{
				method: 'squash',
				expectedHeadSha: `sha-${prNumber}`,
				commitTitle: `Document feature ${prNumber} (#${prNumber})`,
			},
		],
	};
}

function buildMainUmbrellaBody(includedPrNumbers: number[]) {
	return renderUmbrella({ branches: MAIN_BRANCHES, release: null, includedPrNumbers }).body;
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

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'createBranch', args: ['release-queue/main', 'sha-main'] },
			{ method: 'updatePullRequest', args: [7, { base: 'release-queue/main' }] },
			buildMergeWrite(7),
			{
				method: 'createPullRequest',
				args: [
					{
						title: '[ci] release main docs',
						head: 'release-queue/main',
						base: 'main',
						body: buildMainUmbrellaBody([7]),
					},
				],
			},
			{ method: 'createComment', args: [7, renderJoinedComment(MAIN_BRANCHES, CREATED_PR_NUMBER)] },
		]);
	});

	it('should merge the PR into the open umbrella', async () => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7), buildUmbrellaPullRequest(50)], {
			main: 'sha-main',
			'release-queue/main': 'sha-umbrella',
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'updatePullRequest', args: [7, { base: 'release-queue/main' }] },
			buildMergeWrite(7),
			{ method: 'createComment', args: [7, renderJoinedComment(MAIN_BRANCHES, 50)] },
		]);
	});

	it('should keep the base of a PR based on the umbrella branch', async () => {
		const docs = buildReadyRepository(
			[buildAcceptedPullRequest(7, 'release-queue/main'), buildUmbrellaPullRequest(50)],
			{ main: 'sha-main', 'release-queue/main': 'sha-umbrella' }
		);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(
			docs.writes.map(({ method }) => method),
			['mergePullRequest', 'createComment']
		);
	});

	it('should remove the accepted label, then comment, when refusing a PR', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted'] });
		const docs = buildReadyRepository([pullRequest]);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'removeLabel', args: [7, 'accepted'] },
			{
				method: 'createComment',
				args: [
					7,
					renderRefusalComment({
						reasons: [REFUSAL_REASONS.missingReleaseLabel],
						branches: MAIN_BRANCHES,
					}),
				],
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

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'updatePullRequest', args: [7, { base: 'release-queue/main' }] },
			{ method: 'updatePullRequest', args: [7, { base: 'main' }] },
			{ method: 'removeLabel', args: [7, 'accepted'] },
			{
				method: 'createComment',
				args: [7, renderMergeFailureComment(MAIN_BRANCHES, 'Pull Request is not mergeable')],
			},
		]);
	});

	it('should fail with both errors when the base cannot be changed back', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7), buildUmbrellaPullRequest(50)], {
			main: 'sha-main',
			'release-queue/main': 'sha-umbrella',
		});
		const mergeError = new GitHubError({
			message: 'PUT /merge failed with 405: Pull Request is not mergeable',
			status: 405,
			apiMessage: 'Pull Request is not mergeable',
		});
		const restoreError = new Error('Network error');
		t.mock.method(docs, 'mergePullRequest', async () => {
			throw mergeError;
		});
		const updatePullRequest = t.mock.method(docs, 'updatePullRequest');
		updatePullRequest.mock.mockImplementationOnce(async () => {
			throw restoreError;
		}, 1);
		const { context, logs } = createContext(docs);

		const join = joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		await assert.rejects(join, ({ errors: [error] }: AggregateError) => {
			assert.ok(error instanceof AggregateError);
			assert.deepEqual(error.errors, [mergeError, restoreError]);
			return true;
		});
		assert.ok(!docs.writes.some(({ method }) => method === 'createComment'));
		assert.match(
			logs.join('\n'),
			/^#7 failed: Could not merge #7, then could not change its base back/m
		);
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

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes.at(-1), {
			method: 'createComment',
			args: [7, renderUmbrellaFailureComment(MAIN_BRANCHES, 'Validation Failed')],
		});
		assert.ok(!docs.writes.some(({ method }) => method === 'addLabels'));
	});

	it('should take the accepted PRs from the state of the run, without listing them again', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7)]);
		const state = await buildState(docs);
		t.mock.method(docs, 'getOpenPullRequests', async () => {
			throw new Error('Listed the open PRs again.');
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state });

		assert.ok(docs.writes.some(({ method }) => method === 'mergePullRequest'));
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

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

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

		await assert.rejects(
			joinAcceptedPullRequests({ ...context, state: await buildState(docs) }),
			AggregateError
		);

		assert.ok(
			docs.writes.some(({ method, args }) => method === 'mergePullRequest' && args[0] === 9)
		);
		assert.ok(logs.includes('#7 failed: Network error'));
	});
});
