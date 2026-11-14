import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildReadyState, createContext, MAIN_BRANCHES } from '../fixtures.ts';
import { GitHubError } from '../github/errors.ts';
import { buildPullRequest, CREATED_PR_NUMBER, FakeRepository } from '../github/fake-repository.ts';
import type { PullRequestDetails } from '../github/repository.ts';
import { renderUmbrella } from '../umbrella/content.ts';
import { joinAcceptedPullRequests } from './accepted-prs.ts';
import {
	renderAcceptedUmbrellaComment,
	renderJoinedComment,
	renderMergeFailureComment,
	renderRefusalComment,
	renderUmbrellaFailureComment,
} from './comments.ts';
import { REFUSAL_REASONS } from './decision.ts';

const NO_RELEASES = { stable: null, prerelease: null };

/** Builds the state of a run starting with the open PRs of the fake repository. */
async function buildState(docs: FakeRepository) {
	return { releases: NO_RELEASES, openPullRequests: await docs.getOpenPullRequests() };
}

/**
 * Builds a repository where every given PR is approved by a maintainer, with
 * passing checks.
 */
function buildReadyRepository(
	pullRequests: PullRequestDetails[],
	branchShas: Record<string, string> = { main: 'sha-main' }
) {
	const states = pullRequests.map(buildReadyState);
	return new FakeRepository({
		pullRequests,
		reviewStatesByPrNumber: Object.assign(
			{},
			...states.map((state) => state.reviewStatesByPrNumber)
		),
		checksByRef: Object.assign({}, ...states.map((state) => state.checksByRef)),
		branchShas,
	});
}

function buildMergeWrite(prNumber: number) {
	return {
		method: 'squashMergePullRequest',
		args: [
			prNumber,
			{
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
		headBranch: 'umbrella/main',
		labels: ['merge-on-release'],
	});
}

describe('joinAcceptedPullRequests', () => {
	it('should create the umbrella, then merge the PR into it', async () => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7)]);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'createBranch', args: ['umbrella/main', 'sha-main'] },
			{ method: 'updatePullRequest', args: [7, { base: 'umbrella/main' }] },
			buildMergeWrite(7),
			{
				method: 'createPullRequest',
				args: [
					{
						title: '[ci] release main docs',
						head: 'umbrella/main',
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
			'umbrella/main': 'sha-umbrella',
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'updatePullRequest', args: [7, { base: 'umbrella/main' }] },
			buildMergeWrite(7),
			{ method: 'createComment', args: [7, renderJoinedComment(MAIN_BRANCHES, 50)] },
		]);
	});

	it('should keep the base of a PR based on the umbrella branch', async () => {
		const docs = buildReadyRepository(
			[buildAcceptedPullRequest(7, 'umbrella/main'), buildUmbrellaPullRequest(50)],
			{ main: 'sha-main', 'umbrella/main': 'sha-umbrella' }
		);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(
			docs.writes.map(({ method }) => method),
			['squashMergePullRequest', 'createComment']
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
			'umbrella/main': 'sha-umbrella',
		});
		t.mock.method(docs, 'squashMergePullRequest', async () => {
			throw new GitHubError({
				message:
					'PUT /repos/example-org/docs/pulls/7/merge failed with 405: Pull Request is not mergeable',
				status: 405,
				apiMessage: 'Pull Request is not mergeable',
			});
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'updatePullRequest', args: [7, { base: 'umbrella/main' }] },
			{ method: 'updatePullRequest', args: [7, { base: 'main' }] },
			{ method: 'removeLabel', args: [7, 'accepted'] },
			{
				method: 'createComment',
				args: [7, renderMergeFailureComment(MAIN_BRANCHES, 'Pull Request is not mergeable')],
			},
		]);
	});

	it('should refuse a PR whose base GitHub refuses to change, without merging it', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7), buildUmbrellaPullRequest(50)], {
			main: 'sha-main',
			'umbrella/main': 'sha-umbrella',
		});
		t.mock.method(docs, 'updatePullRequest', async () => {
			throw new GitHubError({
				message: 'PATCH /repos/example-org/docs/pulls/7 failed with 422: Validation Failed',
				status: 422,
				apiMessage: 'Validation Failed',
			});
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'removeLabel', args: [7, 'accepted'] },
			{
				method: 'createComment',
				args: [7, renderMergeFailureComment(MAIN_BRANCHES, 'Validation Failed')],
			},
		]);
	});

	it('should fail with both errors when the base cannot be changed back', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7), buildUmbrellaPullRequest(50)], {
			main: 'sha-main',
			'umbrella/main': 'sha-umbrella',
		});
		const mergeError = new GitHubError({
			message:
				'PUT /repos/example-org/docs/pulls/7/merge failed with 405: Pull Request is not mergeable',
			status: 405,
			apiMessage: 'Pull Request is not mergeable',
		});
		const restoreError = new Error('Network error');
		t.mock.method(docs, 'squashMergePullRequest', async () => {
			throw mergeError;
		});
		const updatePullRequest = t.mock.method(docs, 'updatePullRequest');
		updatePullRequest.mock.mockImplementationOnce(async () => {
			throw restoreError;
		}, 1);
		const { context } = createContext(docs);

		const join = joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		await assert.rejects(join, ({ errors: [error] }: AggregateError) => {
			assert.equal(
				error.message,
				'#7 failed: Could not merge #7, then could not change its base back to main: PUT /repos/example-org/docs/pulls/7/merge failed with 405: Pull Request is not mergeable; Network error'
			);
			assert.ok(error.cause instanceof AggregateError);
			assert.match(error.cause.message, /^Could not merge #7, then could not change its base back/);
			assert.deepEqual(error.cause.errors, [mergeError, restoreError]);
			return true;
		});
		assert.ok(!docs.writes.some(({ method }) => method === 'createComment'));
	});

	it('should comment on the merged PR when the umbrella PR cannot be opened', async (t) => {
		const reason = 'Validation Failed; No commits between main and umbrella/main';
		const docs = buildReadyRepository([buildAcceptedPullRequest(7)]);
		t.mock.method(docs, 'createPullRequest', async () => {
			throw new GitHubError({
				message: `POST /repos/example-org/docs/pulls failed with 422: ${reason}`,
				status: 422,
				apiMessage: 'Validation Failed',
				reason,
			});
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes.at(-1), {
			method: 'createComment',
			args: [7, renderUmbrellaFailureComment(MAIN_BRANCHES, reason)],
		});
	});

	it('should take the accepted PRs from the state of the run, without listing them again', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7)]);
		const state = await buildState(docs);
		t.mock.method(docs, 'getOpenPullRequests', async () => {
			throw new Error('Listed the open PRs again.');
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state });

		assert.ok(docs.writes.some(({ method }) => method === 'squashMergePullRequest'));
	});

	it('should handle every accepted PR, oldest first, and skip the others', async () => {
		const docs = buildReadyRepository(
			[
				buildAcceptedPullRequest(9),
				buildPullRequest({ number: 8, labels: ['minor-release'] }),
				buildAcceptedPullRequest(7),
			],
			{ main: 'sha-main', 'umbrella/main': 'sha-umbrella' }
		);
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		const mergedPrNumbers = docs.writes
			.filter(({ method }) => method === 'squashMergePullRequest')
			.map(({ args }) => args[0]);
		assert.deepEqual(mergedPrNumbers, [7, 9]);
	});

	it('should remove the accepted label from an umbrella PR, with a comment', async () => {
		const acceptedUmbrella = { ...buildUmbrellaPullRequest(50), labels: [{ name: 'accepted' }] };
		const docs = buildReadyRepository([acceptedUmbrella], {
			main: 'sha-main',
			'umbrella/main': 'sha-umbrella',
		});
		const { context } = createContext(docs);

		await joinAcceptedPullRequests({ ...context, state: await buildState(docs) });

		assert.deepEqual(docs.writes, [
			{ method: 'removeLabel', args: [50, 'accepted'] },
			{ method: 'createComment', args: [50, renderAcceptedUmbrellaComment()] },
		]);
	});

	it('should handle the other PRs when one fails, then fail', async (t) => {
		const docs = buildReadyRepository([buildAcceptedPullRequest(7), buildAcceptedPullRequest(9)], {
			main: 'sha-main',
			'umbrella/main': 'sha-umbrella',
		});
		const getPullRequest = docs.getPullRequest.bind(docs);
		t.mock.method(docs, 'getPullRequest', async (prNumber: number) => {
			if (prNumber === 7) throw new Error('Network error');
			return getPullRequest(prNumber);
		});
		const { context } = createContext(docs);

		await assert.rejects(
			joinAcceptedPullRequests({ ...context, state: await buildState(docs) }),
			({ errors }: AggregateError) => {
				assert.equal(errors.length, 1);
				assert.equal(errors[0].message, '#7 failed: Network error');
				assert.equal(errors[0].cause.message, 'Network error');
				return true;
			}
		);

		assert.ok(
			docs.writes.some(({ method, args }) => method === 'squashMergePullRequest' && args[0] === 9)
		);
	});
});
