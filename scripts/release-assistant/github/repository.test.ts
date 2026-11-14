import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GitHubError } from './errors.ts';
import { createFakeOctokit } from './fake-octokit.ts';
import { GitHubRepository } from './repository.ts';

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
