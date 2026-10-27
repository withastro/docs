import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CHECK_STATES } from './checks.ts';
import { jsonResponse, mockFetch } from './fetch-mock.ts';
import { GitHubRepository, MERGE_METHODS, REVIEW_STATES } from './repository.ts';

const REPOSITORY_URL = 'https://api.github.com/repos/example-org/example-repo';

function createRepository() {
	return new GitHubRepository({ fullName: 'example-org/example-repo', token: 'test-token' });
}

function getRequestedUrls(fetchMock: ReturnType<typeof mockFetch>) {
	return fetchMock.mock.calls.map((call) => call.arguments[0]);
}

/** Gets the URL, the method, and the parsed body of the only request sent. */
function getSentRequest(fetchMock: ReturnType<typeof mockFetch>) {
	assert.equal(fetchMock.mock.callCount(), 1);
	const [url, init] = fetchMock.mock.calls[0].arguments;
	const body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
	return { url, method: init?.method, body };
}

const review = {
	id: 1,
	user: { login: 'example-user' },
	state: REVIEW_STATES.approved,
	commit_id: 'abc123',
};

/** A review as GitHub sends it, with fields the client does not read. */
const reviewResponse = { ...review, node_id: 'R_1', user: { ...review.user, id: 1 } };

const pullRequest = {
	number: 7,
	title: 'Fix a typo',
	body: null,
	html_url: 'https://github.com/example-org/example-repo/pull/7',
	draft: false,
	user: { login: 'example-user' },
	head: { ref: 'fix-typo', sha: 'abc123', repo: { full_name: 'example-user/example-repo' } },
	base: { ref: 'main' },
	labels: [{ name: 'i18n' }],
};

/** A pull request as GitHub sends it, with fields the client does not read. */
const pullRequestResponse = {
	...pullRequest,
	node_id: 'PR_7',
	user: { ...pullRequest.user, id: 1 },
	head: {
		...pullRequest.head,
		label: 'example-user:fix-typo',
		repo: { ...pullRequest.head.repo, id: 2 },
	},
	base: { ...pullRequest.base, label: 'example-org:main' },
	labels: [{ name: 'i18n', color: 'ffffff' }],
};

describe('GitHubRepository', () => {
	it('should refuse a name that is not "owner/repo"', () => {
		const token = 'test-token';

		assert.throws(() => new GitHubRepository({ fullName: 'example-repo', token }), /owner\/repo/);
		assert.throws(() => new GitHubRepository({ fullName: '../..', token }), /owner\/repo/);
	});

	it('should refuse an empty token', () => {
		const fullName = 'example-org/example-repo';

		assert.throws(() => new GitHubRepository({ fullName, token: '' }), /needs a token/);
	});

	describe('getReviews', () => {
		it('should get the reviews of a pull request', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse([reviewResponse]));

			const reviews = await createRepository().getReviews(7);

			assert.deepEqual(reviews, [review]);
			assert.deepEqual(getRequestedUrls(fetchMock), [
				`${REPOSITORY_URL}/pulls/7/reviews?per_page=100`,
			]);
		});

		it('should throw when a review does not have the expected shape', async (t) => {
			mockFetch(t, jsonResponse([{ ...review, state: 'UNKNOWN' }]));

			await assert.rejects(createRepository().getReviews(7), /pulls\/7\/reviews/);
		});
	});

	describe('getOpenPullRequests', () => {
		it('should get the open pull requests', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse([pullRequestResponse]));

			const pullRequests = await createRepository().getOpenPullRequests();

			assert.deepEqual(pullRequests, [pullRequest]);
			assert.deepEqual(getRequestedUrls(fetchMock), [
				`${REPOSITORY_URL}/pulls?state=open&per_page=100`,
			]);
		});
	});

	describe('getPullRequest', () => {
		it('should get a pull request', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse(pullRequestResponse));

			const result = await createRepository().getPullRequest(7);

			assert.deepEqual(result, pullRequest);
			assert.deepEqual(getRequestedUrls(fetchMock), [`${REPOSITORY_URL}/pulls/7`]);
		});

		it('should accept a pull request whose head repository was deleted', async (t) => {
			const fromDeletedFork = { ...pullRequest, head: { ...pullRequest.head, repo: null } };
			mockFetch(t, jsonResponse(fromDeletedFork));

			const result = await createRepository().getPullRequest(7);

			assert.deepEqual(result, fromDeletedFork);
		});

		it('should throw when the pull request does not have the expected shape', async (t) => {
			mockFetch(t, jsonResponse({ ...pullRequest, labels: null }));

			await assert.rejects(createRepository().getPullRequest(7), /pulls\/7/);
		});
	});

	describe('getChecks', () => {
		it('should get the check runs, then the commit statuses, of a commit', async (t) => {
			const fetchMock = mockFetch(
				t,
				jsonResponse({
					total_count: 1,
					check_runs: [{ name: 'build', status: 'completed', conclusion: 'success' }],
				}),
				jsonResponse({
					state: 'pending',
					total_count: 1,
					statuses: [{ context: 'preview', state: 'pending' }],
				})
			);

			const checks = await createRepository().getChecks('abc123');

			assert.deepEqual(checks, [
				{ name: 'build', state: CHECK_STATES.success },
				{ name: 'preview', state: CHECK_STATES.pending },
			]);
			assert.deepEqual(getRequestedUrls(fetchMock), [
				`${REPOSITORY_URL}/commits/abc123/check-runs?per_page=100`,
				`${REPOSITORY_URL}/commits/abc123/status?per_page=100`,
			]);
		});

		it('should encode the ref in the URL', async (t) => {
			const fetchMock = mockFetch(
				t,
				jsonResponse({ total_count: 0, check_runs: [] }),
				jsonResponse({ total_count: 0, statuses: [] })
			);

			await createRepository().getChecks('fix#12');

			assert.deepEqual(getRequestedUrls(fetchMock), [
				`${REPOSITORY_URL}/commits/fix%2312/check-runs?per_page=100`,
				`${REPOSITORY_URL}/commits/fix%2312/status?per_page=100`,
			]);
		});

		it('should throw when a check does not have the expected shape', async (t) => {
			mockFetch(
				t,
				jsonResponse({ total_count: 1, check_runs: [{ name: 'build' }] }),
				jsonResponse({ total_count: 0, statuses: [] })
			);

			await assert.rejects(createRepository().getChecks('abc123'), /check-runs/);
		});
	});

	describe('compare', () => {
		it('should get the commits of head missing in base', async (t) => {
			const comparison = {
				ahead_by: 1,
				commits: [{ sha: 'abc123', commit: { message: 'Fix a typo' } }],
			};
			const fetchMock = mockFetch(
				t,
				jsonResponse({
					...comparison,
					files: [],
					commits: [{ ...comparison.commits[0], commit: { message: 'Fix a typo', tree: {} } }],
				})
			);

			const result = await createRepository().compare('main', 'release/v6');

			assert.deepEqual(result, comparison);
			assert.deepEqual(getRequestedUrls(fetchMock), [
				`${REPOSITORY_URL}/compare/main...release/v6`,
			]);
		});

		it('should encode each part of the branch names in the URL', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse({ ahead_by: 0, commits: [] }));

			await createRepository().compare('main', 'fix#12/%2e%2e');

			assert.deepEqual(getRequestedUrls(fetchMock), [
				`${REPOSITORY_URL}/compare/main...fix%2312/%252e%252e`,
			]);
		});

		it('should refuse a branch name with a "." or ".." segment, without a request', async (t) => {
			mockFetch(t);

			await assert.rejects(createRepository().compare('main', 'x/..'), /"\.\."/);
			await assert.rejects(createRepository().compare('./main', 'x'), /"\."/);
		});

		it('should refuse a branch name with an empty segment, without a request', async (t) => {
			mockFetch(t);

			await assert.rejects(createRepository().compare('main', 'x//y'), /Cannot use ""/);
			await assert.rejects(createRepository().compare('', 'x'), /Cannot use ""/);
		});
	});

	describe('hasWriteAccess', () => {
		it('should be true for a user with the write or admin permission', async (t) => {
			const fetchMock = mockFetch(
				t,
				jsonResponse({ permission: 'write', role_name: 'maintain' }),
				jsonResponse({ permission: 'admin', role_name: 'admin' })
			);
			const repository = createRepository();

			assert.equal(await repository.hasWriteAccess('example-user'), true);
			assert.equal(await repository.hasWriteAccess('example-admin'), true);
			assert.equal(
				getRequestedUrls(fetchMock)[0],
				`${REPOSITORY_URL}/collaborators/example-user/permission`
			);
		});

		it('should be false for a user with the read permission', async (t) => {
			mockFetch(t, jsonResponse({ permission: 'read', role_name: 'triage' }));

			assert.equal(await createRepository().hasWriteAccess('example-user'), false);
		});

		it('should be false for a user GitHub does not find', async (t) => {
			mockFetch(t, jsonResponse({ message: 'Not Found' }, { status: 404 }));

			assert.equal(await createRepository().hasWriteAccess('example-ghost'), false);
		});

		it('should throw on other errors', async (t) => {
			mockFetch(t, jsonResponse({ message: 'Bad credentials' }, { status: 401 }));

			await assert.rejects(createRepository().hasWriteAccess('example-user'), /Bad credentials/);
		});

		it('should refuse ".." as a login, without a request', async (t) => {
			mockFetch(t);

			await assert.rejects(createRepository().hasWriteAccess('..'), /"\.\."/);
		});

		it('should refuse an empty login, without a request', async (t) => {
			mockFetch(t);

			await assert.rejects(createRepository().hasWriteAccess(''), /Cannot use ""/);
		});
	});

	describe('createPullRequest', () => {
		it('should create a pull request and return its number and URL', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse(pullRequestResponse, { status: 201 }));
			const newPullRequest = { title: 'Fix a typo', head: 'fix-typo', base: 'main', body: '' };

			const created = await createRepository().createPullRequest(newPullRequest);

			assert.deepEqual(created, { number: pullRequest.number, html_url: pullRequest.html_url });
			assert.deepEqual(getSentRequest(fetchMock), {
				url: `${REPOSITORY_URL}/pulls`,
				method: 'POST',
				body: newPullRequest,
			});
		});

		it('should throw when the created pull request does not have the expected shape', async (t) => {
			mockFetch(t, jsonResponse({ number: '7' }, { status: 201 }));
			const newPullRequest = { title: 'Fix a typo', head: 'fix-typo', base: 'main', body: '' };

			await assert.rejects(
				createRepository().createPullRequest(newPullRequest),
				/Unexpected response from POST \/repos\/example-org\/example-repo\/pulls\./
			);
		});
	});

	describe('addLabels', () => {
		it('should add labels to a pull request', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse([{ name: 'i18n' }, { name: 'merge-queue' }]));

			await createRepository().addLabels(7, ['i18n', 'merge-queue']);

			assert.deepEqual(getSentRequest(fetchMock), {
				url: `${REPOSITORY_URL}/issues/7/labels`,
				method: 'POST',
				body: { labels: ['i18n', 'merge-queue'] },
			});
		});
	});

	describe('removeLabel', () => {
		it('should remove a label from a pull request', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse([]));

			await createRepository().removeLabel(7, 'i18n: fr');

			assert.deepEqual(getSentRequest(fetchMock), {
				url: `${REPOSITORY_URL}/issues/7/labels/i18n%3A%20fr`,
				method: 'DELETE',
				body: undefined,
			});
		});

		it('should succeed when the pull request does not have the label', async (t) => {
			mockFetch(t, jsonResponse({ message: 'Label does not exist' }, { status: 404 }));

			await createRepository().removeLabel(7, 'i18n');
		});

		it('should refuse ".." as a label, without a request', async (t) => {
			mockFetch(t);

			await assert.rejects(createRepository().removeLabel(7, '..'), /"\.\."/);
		});

		it('should refuse an empty label, without a request', async (t) => {
			mockFetch(t);

			await assert.rejects(createRepository().removeLabel(7, ''), /Cannot use ""/);
		});

		it('should throw when the pull request does not exist', async (t) => {
			mockFetch(t, jsonResponse({ message: 'Not Found' }, { status: 404 }));

			await assert.rejects(createRepository().removeLabel(7, 'i18n'), /Not Found/);
		});

		it('should throw on other errors', async (t) => {
			mockFetch(t, jsonResponse({ message: 'Bad credentials' }, { status: 401 }));

			await assert.rejects(createRepository().removeLabel(7, 'i18n'), /Bad credentials/);
		});
	});

	describe('updatePullRequest', () => {
		it('should change the base branch and the description of a pull request', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse(pullRequest));

			await createRepository().updatePullRequest(7, { base: 'release/v6', body: 'Updated' });

			assert.deepEqual(getSentRequest(fetchMock), {
				url: `${REPOSITORY_URL}/pulls/7`,
				method: 'PATCH',
				body: { base: 'release/v6', body: 'Updated' },
			});
		});
	});

	describe('mergePullRequest', () => {
		it('should merge a pull request at the given head', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse({ merged: true, sha: 'def456', message: '' }));

			await createRepository().mergePullRequest(7, {
				method: MERGE_METHODS.squash,
				expectedHeadSha: 'abc123',
			});

			assert.deepEqual(getSentRequest(fetchMock), {
				url: `${REPOSITORY_URL}/pulls/7/merge`,
				method: 'PUT',
				body: { merge_method: 'squash', sha: 'abc123' },
			});
		});

		it('should throw when GitHub refuses the merge', async (t) => {
			mockFetch(
				t,
				jsonResponse(
					{ message: 'Head branch was modified' },
					{ status: 409, statusText: 'Conflict' }
				)
			);

			const merge = createRepository().mergePullRequest(7, {
				method: MERGE_METHODS.squash,
				expectedHeadSha: 'abc123',
			});

			await assert.rejects(merge, /Head branch was modified/);
		});
	});

	describe('createComment', () => {
		it('should comment on a pull request', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse({ id: 1 }, { status: 201 }));

			await createRepository().createComment(7, 'Thanks!');

			assert.deepEqual(getSentRequest(fetchMock), {
				url: `${REPOSITORY_URL}/issues/7/comments`,
				method: 'POST',
				body: { body: 'Thanks!' },
			});
		});
	});

	describe('requestChanges', () => {
		it('should submit a review requesting changes', async (t) => {
			const fetchMock = mockFetch(t, jsonResponse({ ...review, state: 'CHANGES_REQUESTED' }));

			await createRepository().requestChanges(7, 'Wait for the release.');

			assert.deepEqual(getSentRequest(fetchMock), {
				url: `${REPOSITORY_URL}/pulls/7/reviews`,
				method: 'POST',
				body: { event: 'REQUEST_CHANGES', body: 'Wait for the release.' },
			});
		});
	});
});
