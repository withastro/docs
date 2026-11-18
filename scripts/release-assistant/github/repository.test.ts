import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CHECK_STATES } from './checks.ts';
import { GitHubError } from './errors.ts';
import { createFakeOctokit } from './fake-octokit.ts';
import { GitHubRepository } from './repository.ts';
import { REVIEW_STATES } from './reviews.ts';

const NAME = { owner: 'example-org', repo: 'docs' };

/** A pull request as GitHub sends it, with fields the release assistant doesn't read. */
const PULL_REQUEST_DATA = {
	id: 123456,
	number: 7,
	title: 'Document feature 7',
	body: null,
	html_url: 'https://github.com/example-org/docs/pull/7',
	user: { login: 'example-user', id: 1 },
	head: { ref: 'docs-feature', sha: 'sha-7', repo: { full_name: 'example-org/docs', id: 2 } },
	base: { ref: 'main', sha: 'sha-main' },
	labels: [{ id: 3, name: 'accepted', color: 'ffffff' }],
	mergeable: null,
	merged: false,
};

describe('GitHubRepository', () => {
	it('should name the repository as owner/repo', () => {
		const { octokit } = createFakeOctokit({});

		assert.equal(new GitHubRepository(octokit, NAME).fullName, 'example-org/docs');
	});

	describe('getPullRequest', () => {
		it('should get the pull request as GitHub sends it', async () => {
			const { octokit } = createFakeOctokit({
				'GET /repos/example-org/docs/pulls/7': { status: 200, body: PULL_REQUEST_DATA },
			});

			const pullRequest = await new GitHubRepository(octokit, NAME).getPullRequest(7);

			assert.deepEqual(pullRequest, PULL_REQUEST_DATA);
		});

		it("should throw a GitHubError with the request and GitHub's message on an error status", async () => {
			const { octokit } = createFakeOctokit({});

			await assert.rejects(new GitHubRepository(octokit, NAME).getPullRequest(7), (error) => {
				assert.ok(error instanceof GitHubError);
				assert.equal(
					error.message,
					'GET /repos/example-org/docs/pulls/7 failed with 404: Not Found'
				);
				assert.equal(error.status, 404);
				assert.equal(error.apiMessage, 'Not Found');
				assert.equal(error.isNotFound, true);
				return true;
			});
		});
	});

	describe('getOpenPullRequests', () => {
		it('should get the open pull requests', async () => {
			const { octokit } = createFakeOctokit({
				'GET /repos/example-org/docs/pulls?state=open&per_page=100': {
					status: 200,
					body: [PULL_REQUEST_DATA],
				},
			});

			const pullRequests = await new GitHubRepository(octokit, NAME).getOpenPullRequests();

			assert.deepEqual(
				pullRequests.map(({ number }) => number),
				[7]
			);
		});
	});

	describe('getOpenPullRequestsFromBranch', () => {
		it('should filter the open pull requests by a branch of the owner', async () => {
			const { octokit } = createFakeOctokit({
				'GET /repos/example-org/docs/pulls?state=open&head=example-org%3Achangeset-release%2Fmain&per_page=100':
					{ status: 200, body: [PULL_REQUEST_DATA] },
			});

			const pullRequests = await new GitHubRepository(octokit, NAME).getOpenPullRequestsFromBranch(
				'changeset-release/main'
			);

			assert.deepEqual(
				pullRequests.map(({ number }) => number),
				[7]
			);
		});

		it('should encode the branch name in the query', async () => {
			const { octokit, requests } = createFakeOctokit({});

			await assert.rejects(
				new GitHubRepository(octokit, NAME).getOpenPullRequestsFromBranch('fix#12&base=main')
			);

			assert.deepEqual(
				requests.map(({ route }) => route),
				[
					'GET /repos/example-org/docs/pulls?state=open&head=example-org%3Afix%2312%26base%3Dmain&per_page=100',
				]
			);
		});
	});

	describe('waitForMergeability', () => {
		const ROUTE = 'GET /repos/example-org/docs/pulls/7';

		function mergeabilityResponse(mergeable: boolean | null) {
			return { status: 200, body: { ...PULL_REQUEST_DATA, mergeable } };
		}

		/** A repository whose waits resolve at once, recording each delay. */
		function createWaitingRepository(responses: Parameters<typeof createFakeOctokit>[0]) {
			const { octokit, requests } = createFakeOctokit(responses);
			const delaysMs: number[] = [];
			const wait = async (delayMs: number) => {
				delaysMs.push(delayMs);
			};
			return { repository: new GitHubRepository(octokit, NAME, { wait }), requests, delaysMs };
		}

		it('should answer at once when the mergeability is known', async () => {
			const { repository, requests, delaysMs } = createWaitingRepository({});

			assert.equal(await repository.waitForMergeability({ number: 7, mergeable: false }), false);
			assert.deepEqual(requests, []);
			assert.deepEqual(delaysMs, []);
		});

		it('should ask again until GitHub has checked for conflicts', async () => {
			const { repository, requests, delaysMs } = createWaitingRepository({
				[ROUTE]: [mergeabilityResponse(null), mergeabilityResponse(true)],
			});

			assert.equal(await repository.waitForMergeability({ number: 7, mergeable: null }), true);
			assert.deepEqual(delaysMs, [2000, 2000]);
			assert.equal(requests.length, 2);
		});

		it('should return null when GitHub takes too long', async () => {
			const { repository, delaysMs } = createWaitingRepository({
				[ROUTE]: mergeabilityResponse(null),
			});

			assert.equal(await repository.waitForMergeability({ number: 7, mergeable: null }), null);
			assert.equal(delaysMs.length, 5);
		});

		it('should throw on an error', async () => {
			const { repository } = createWaitingRepository({
				[ROUTE]: { status: 401, body: { message: 'Bad credentials' } },
			});

			await assert.rejects(
				repository.waitForMergeability({ number: 7, mergeable: null }),
				/Bad credentials/
			);
		});
	});

	describe('getLatestReviewStates', () => {
		const ROUTE = 'GET /repos/example-org/docs/pulls/7/reviews?per_page=100';

		function reviewBy(login: string | null, state: string) {
			return { id: 1, user: login === null ? null : { login }, state, body: '' };
		}

		async function getLatestReviewStates(reviews: ReturnType<typeof reviewBy>[]) {
			const { octokit } = createFakeOctokit({ [ROUTE]: { status: 200, body: reviews } });
			return new GitHubRepository(octokit, NAME).getLatestReviewStates(7);
		}

		it('should keep the latest approval, change request, or dismissal of each reviewer', async () => {
			const states = await getLatestReviewStates([
				reviewBy('reviewer-a', REVIEW_STATES.changesRequested),
				reviewBy('reviewer-b', REVIEW_STATES.approved),
				reviewBy('reviewer-a', REVIEW_STATES.approved),
				reviewBy('reviewer-b', REVIEW_STATES.dismissed),
			]);

			assert.deepEqual(
				states,
				new Map([
					['reviewer-a', REVIEW_STATES.approved],
					['reviewer-b', REVIEW_STATES.dismissed],
				])
			);
		});

		it('should not let a comment or a pending review replace a state', async () => {
			const states = await getLatestReviewStates([
				reviewBy('reviewer-a', REVIEW_STATES.changesRequested),
				reviewBy('reviewer-a', REVIEW_STATES.commented),
				reviewBy('reviewer-a', REVIEW_STATES.pending),
				reviewBy('reviewer-b', REVIEW_STATES.commented),
			]);

			assert.deepEqual(states, new Map([['reviewer-a', REVIEW_STATES.changesRequested]]));
		});

		it('should skip the reviews of a deleted account', async () => {
			const states = await getLatestReviewStates([reviewBy(null, REVIEW_STATES.approved)]);

			assert.deepEqual(states, new Map());
		});

		it('should read every page', async () => {
			const nextPage = 'https://api.github.com/repositories/1/pulls/7/reviews?per_page=100&page=2';
			const { octokit } = createFakeOctokit({
				[ROUTE]: {
					status: 200,
					body: [reviewBy('reviewer-a', REVIEW_STATES.approved)],
					headers: { link: `<${nextPage}>; rel="next"` },
				},
				'GET /repositories/1/pulls/7/reviews?per_page=100&page=2': {
					status: 200,
					body: [reviewBy('reviewer-b', REVIEW_STATES.changesRequested)],
				},
			});

			const states = await new GitHubRepository(octokit, NAME).getLatestReviewStates(7);

			assert.deepEqual(
				states,
				new Map([
					['reviewer-a', REVIEW_STATES.approved],
					['reviewer-b', REVIEW_STATES.changesRequested],
				])
			);
		});
	});

	describe('hasWriteAccess', () => {
		const ROUTE = 'GET /repos/example-org/docs/collaborators/example-user/permission';

		async function hasWriteAccess(response: { status: number; body: unknown }) {
			const { octokit } = createFakeOctokit({ [ROUTE]: response });
			return new GitHubRepository(octokit, NAME).hasWriteAccess('example-user');
		}

		it('should be true for a user with the write or admin permission', async () => {
			assert.equal(
				await hasWriteAccess({ status: 200, body: { permission: 'write', role_name: 'maintain' } }),
				true
			);
			assert.equal(
				await hasWriteAccess({ status: 200, body: { permission: 'admin', role_name: 'admin' } }),
				true
			);
		});

		it('should be false for a user with the read permission', async () => {
			assert.equal(
				await hasWriteAccess({ status: 200, body: { permission: 'read', role_name: 'triage' } }),
				false
			);
		});

		it('should be false for a user GitHub does not find', async () => {
			assert.equal(await hasWriteAccess({ status: 404, body: { message: 'Not Found' } }), false);
		});

		it('should throw on other errors', async () => {
			await assert.rejects(
				hasWriteAccess({ status: 401, body: { message: 'Bad credentials' } }),
				/Bad credentials/
			);
		});
	});

	describe('getChecks', () => {
		const CHECK_RUNS_ROUTE = 'GET /repos/example-org/docs/commits/abc123/check-runs?per_page=100';
		const STATUS_ROUTE = 'GET /repos/example-org/docs/commits/abc123/status?per_page=100';
		const WAITING_RUNS_ROUTE =
			'GET /repos/example-org/docs/actions/runs?head_sha=abc123&status=action_required&per_page=100';

		it('should get the check runs, the commit statuses, then the workflow runs waiting for approval', async () => {
			const { octokit } = createFakeOctokit({
				[CHECK_RUNS_ROUTE]: {
					status: 200,
					body: {
						total_count: 1,
						check_runs: [{ name: 'build', status: 'completed', conclusion: 'success' }],
					},
				},
				[STATUS_ROUTE]: {
					status: 200,
					body: {
						state: 'pending',
						total_count: 1,
						statuses: [{ context: 'preview', state: 'pending' }],
					},
				},
				[WAITING_RUNS_ROUTE]: {
					status: 200,
					body: {
						total_count: 1,
						workflow_runs: [{ name: 'CI', path: '.github/workflows/ci.yml' }],
					},
				},
			});

			const checks = await new GitHubRepository(octokit, NAME).getChecks('abc123');

			assert.deepEqual(checks, [
				{ name: 'build', state: CHECK_STATES.success },
				{ name: 'preview', state: CHECK_STATES.pending },
				{ name: 'CI', state: CHECK_STATES.awaitingApproval },
			]);
		});

		it('should throw when the commit has more statuses than one page', async () => {
			const { octokit } = createFakeOctokit({
				[CHECK_RUNS_ROUTE]: { status: 200, body: { total_count: 0, check_runs: [] } },
				[STATUS_ROUTE]: {
					status: 200,
					body: { total_count: 101, statuses: [{ context: 'preview', state: 'success' }] },
				},
				[WAITING_RUNS_ROUTE]: { status: 200, body: { total_count: 0, workflow_runs: [] } },
			});

			await assert.rejects(
				new GitHubRepository(octokit, NAME).getChecks('abc123'),
				/Could not read every status of abc123 in example-org\/docs: 101 statuses, 100 per page\.$/
			);
		});
	});

	describe('getFileContent', () => {
		const ROUTE = 'GET /repos/example-org/docs/contents/.changeset/pre.json?ref=next';

		async function getFileContent(response: { status: number; body: unknown }) {
			const { octokit } = createFakeOctokit({ [ROUTE]: response });
			return new GitHubRepository(octokit, NAME).getFileContent('.changeset/pre.json', 'next');
		}

		function fileResponse(content: string, encoding = 'base64') {
			return { status: 200, body: { type: 'file', encoding, content, sha: 'abc123' } };
		}

		it('should get the text of a file on a branch', async () => {
			const content = Buffer.from('{ "mode": "pre" }\n').toString('base64');

			assert.equal(await getFileContent(fileResponse(content)), '{ "mode": "pre" }\n');
		});

		it('should decode content wrapped in lines, as GitHub sends it', async () => {
			const text = '{ "mode": "pre", "tag": "beta", "initialVersions": {} }\n';
			const wrapped = Buffer.from(text).toString('base64').replace(/.{60}/g, '$&\n');

			assert.equal(await getFileContent(fileResponse(wrapped)), text);
		});

		it('should return null when the file or the ref does not exist', async () => {
			assert.equal(await getFileContent({ status: 404, body: { message: 'Not Found' } }), null);
		});

		it('should throw on other errors', async () => {
			await assert.rejects(
				getFileContent({ status: 401, body: { message: 'Bad credentials' } }),
				/Bad credentials/
			);
		});

		it('should throw for a directory', async () => {
			await assert.rejects(
				getFileContent({ status: 200, body: [{ type: 'file', name: 'pre.json' }] }),
				/is not a file/
			);
		});

		it('should throw for a file too large to be sent in base64', async () => {
			await assert.rejects(getFileContent(fileResponse('', 'none')), /too large/);
		});
	});

	describe('getBranchSha', () => {
		it('should get the SHA of the commit at the head of a branch', async () => {
			const { octokit } = createFakeOctokit({
				'GET /repos/example-org/docs/git/ref/heads/umbrella/main': {
					status: 200,
					body: {
						ref: 'refs/heads/umbrella/main',
						object: { sha: 'sha-umbrella', type: 'commit' },
					},
				},
			});

			assert.equal(
				await new GitHubRepository(octokit, NAME).getBranchSha('umbrella/main'),
				'sha-umbrella'
			);
		});

		it('should return null for a branch that does not exist', async () => {
			const { octokit } = createFakeOctokit({});

			assert.equal(await new GitHubRepository(octokit, NAME).getBranchSha('umbrella/main'), null);
		});

		it('should throw on other errors', async () => {
			const { octokit } = createFakeOctokit({
				'GET /repos/example-org/docs/git/ref/heads/umbrella/main': {
					status: 401,
					body: { message: 'Bad credentials' },
				},
			});

			await assert.rejects(
				new GitHubRepository(octokit, NAME).getBranchSha('umbrella/main'),
				/Bad credentials/
			);
		});
	});

	describe('createBranch', () => {
		it('should create the branch at a commit', async () => {
			const { octokit, requests } = createFakeOctokit({
				'POST /repos/example-org/docs/git/refs': { status: 201, body: {} },
			});

			await new GitHubRepository(octokit, NAME).createBranch('umbrella/main', 'sha-main');

			assert.deepEqual(requests, [
				{
					route: 'POST /repos/example-org/docs/git/refs',
					body: { ref: 'refs/heads/umbrella/main', sha: 'sha-main' },
				},
			]);
		});
	});

	describe('createPullRequest', () => {
		it('should open a pull request and return its number', async () => {
			const { octokit, requests } = createFakeOctokit({
				'POST /repos/example-org/docs/pulls': {
					status: 201,
					body: { ...PULL_REQUEST_DATA, number: 50, html_url: 'https://example.com/50' },
				},
			});
			const pullRequest = { title: 'Umbrella', head: 'umbrella/main', base: 'main', body: 'Docs' };

			const created = await new GitHubRepository(octokit, NAME).createPullRequest(pullRequest);

			assert.equal(created.number, 50);
			assert.deepEqual(requests[0].body, pullRequest);
		});

		it('should give the reason of each error GitHub lists', async () => {
			const { octokit } = createFakeOctokit({
				'POST /repos/example-org/docs/pulls': {
					status: 422,
					body: {
						message: 'Validation Failed',
						errors: [
							{
								resource: 'PullRequest',
								code: 'custom',
								message: 'A pull request already exists for example-org:umbrella/main.',
							},
							{ resource: 'PullRequest', field: 'head', code: 'invalid' },
						],
					},
				},
			});
			const pullRequest = { title: 'Umbrella', head: 'umbrella/main', base: 'main', body: 'Docs' };

			await assert.rejects(
				new GitHubRepository(octokit, NAME).createPullRequest(pullRequest),
				(error) => {
					assert.ok(error instanceof GitHubError);
					assert.equal(error.apiMessage, 'Validation Failed');
					assert.equal(
						error.reason,
						'Validation Failed; A pull request already exists for example-org:umbrella/main.; {"resource":"PullRequest","field":"head","code":"invalid"}'
					);
					assert.equal(
						error.message,
						`POST /repos/example-org/docs/pulls failed with 422: ${error.reason}`
					);
					return true;
				}
			);
		});
	});

	describe('updatePullRequest', () => {
		it('should send only the fields to change', async () => {
			const { octokit, requests } = createFakeOctokit({
				'PATCH /repos/example-org/docs/pulls/7': { status: 200, body: PULL_REQUEST_DATA },
			});

			await new GitHubRepository(octokit, NAME).updatePullRequest(7, { base: 'umbrella/main' });

			assert.deepEqual(requests[0].body, { base: 'umbrella/main' });
		});
	});

	describe('squashMergePullRequest', () => {
		const ROUTE = 'PUT /repos/example-org/docs/pulls/7/merge';

		it('should squash-merge the expected head with the commit title', async () => {
			const { octokit, requests } = createFakeOctokit({
				[ROUTE]: { status: 200, body: { merged: true } },
			});

			await new GitHubRepository(octokit, NAME).squashMergePullRequest(7, {
				expectedHeadSha: 'sha-7',
				commitTitle: 'Document feature 7 (#7)',
			});

			assert.deepEqual(requests[0].body, {
				merge_method: 'squash',
				sha: 'sha-7',
				commit_title: 'Document feature 7 (#7)',
			});
		});

		it("should throw a GitHubError with GitHub's reason when GitHub refuses", async () => {
			const { octokit } = createFakeOctokit({
				[ROUTE]: { status: 409, body: { message: 'Head branch was modified.' } },
			});

			await assert.rejects(
				new GitHubRepository(octokit, NAME).squashMergePullRequest(7, { expectedHeadSha: 'sha-7' }),
				(error) => error instanceof GitHubError && error.apiMessage === 'Head branch was modified.'
			);
		});
	});

	describe('removeLabel', () => {
		it('should remove the label', async () => {
			const { octokit, requests } = createFakeOctokit({
				'DELETE /repos/example-org/docs/issues/7/labels/accepted': { status: 200, body: [] },
			});

			await new GitHubRepository(octokit, NAME).removeLabel(7, 'accepted');

			assert.deepEqual(
				requests.map(({ route }) => route),
				['DELETE /repos/example-org/docs/issues/7/labels/accepted']
			);
		});

		it('should succeed when the pull request does not have the label', async () => {
			const { octokit } = createFakeOctokit({
				'DELETE /repos/example-org/docs/issues/7/labels/accepted': {
					status: 404,
					body: { message: 'Label does not exist' },
				},
			});

			await new GitHubRepository(octokit, NAME).removeLabel(7, 'accepted');
		});

		it('should throw when the pull request does not exist', async () => {
			const { octokit } = createFakeOctokit({});

			await assert.rejects(
				new GitHubRepository(octokit, NAME).removeLabel(7, 'accepted'),
				GitHubError
			);
		});
	});

	describe('createComment', () => {
		it('should comment on the pull request', async () => {
			const { octokit, requests } = createFakeOctokit({
				'POST /repos/example-org/docs/issues/7/comments': { status: 201, body: { id: 1 } },
			});

			await new GitHubRepository(octokit, NAME).createComment(7, 'Hello');

			assert.deepEqual(requests, [
				{ route: 'POST /repos/example-org/docs/issues/7/comments', body: { body: 'Hello' } },
			]);
		});
	});
});
