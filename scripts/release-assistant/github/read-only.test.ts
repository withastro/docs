import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createFakeOctokit } from './fake-octokit.ts';
import { addReadOnlyHook } from './read-only.ts';

describe('addReadOnlyHook', () => {
	it('should send reads', async () => {
		const { octokit, requests } = createFakeOctokit({
			'GET /repos/example-org/docs/pulls/7': { status: 200, body: { number: 7 } },
		});
		addReadOnlyHook(octokit, () => {});

		const { data } = await octokit.rest.pulls.get({
			owner: 'example-org',
			repo: 'docs',
			pull_number: 7,
		});

		assert.deepEqual(data, { number: 7 });
		assert.equal(requests.length, 1);
	});

	it('should log writes instead of sending them', async () => {
		const { octokit, requests } = createFakeOctokit({});
		const logs: string[] = [];
		addReadOnlyHook(octokit, (message) => logs.push(message));

		await octokit.rest.issues.createComment({
			owner: 'example-org',
			repo: 'docs',
			issue_number: 7,
			body: 'Hello',
		});
		await octokit.rest.issues.removeLabel({
			owner: 'example-org',
			repo: 'docs',
			issue_number: 7,
			name: 'accepted',
		});

		assert.deepEqual(requests, []);
		assert.deepEqual(logs, [
			'Read-only: POST /repos/example-org/docs/issues/7/comments {"body":"Hello"}',
			'Read-only: DELETE /repos/example-org/docs/issues/7/labels/accepted null',
		]);
	});
});
