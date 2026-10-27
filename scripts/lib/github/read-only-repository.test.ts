import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { jsonResponse, mockFetch } from './fetch-mock.ts';
import { ReadOnlyRepository } from './read-only-repository.ts';
import { GitHubRepository } from './repository.ts';

/**
 * The client methods that only read. Every other method counts as a write that
 * must be overridden. A new method fails the test until it is listed here or
 * overridden.
 */
const READ_METHODS = [
	'getReviews',
	'getOpenPullRequests',
	'getPullRequest',
	'getChecks',
	'compare',
	'hasWriteAccess',
	'getFileContent',
];

function getMethodNames(prototype: object) {
	return Object.getOwnPropertyNames(prototype).filter((name) => name !== 'constructor');
}

function createRepository() {
	const logs: string[] = [];
	const repository = new ReadOnlyRepository({
		fullName: 'example-org/example-repo',
		token: 'test-token',
		log: (message) => logs.push(message),
	});
	return { repository, logs };
}

describe('ReadOnlyRepository', () => {
	it('should override every write method of the client', () => {
		const writeMethods = getMethodNames(GitHubRepository.prototype).filter(
			(name) => !READ_METHODS.includes(name)
		);

		assert.deepEqual(
			getMethodNames(ReadOnlyRepository.prototype).toSorted(),
			writeMethods.toSorted()
		);
	});

	it('should log a write instead of sending it', async (t) => {
		mockFetch(t);
		const { repository, logs } = createRepository();

		await repository.createComment(7, 'Thanks!');

		assert.deepEqual(logs, ['Read-only: createComment [7,"Thanks!"]']);
	});

	it('should return a pull request numbered 0 instead of creating one', async (t) => {
		mockFetch(t);
		const { repository } = createRepository();

		const created = await repository.createPullRequest({
			title: 'Fix a typo',
			head: 'fix-typo',
			base: 'main',
			body: '',
		});

		assert.deepEqual(created, { number: 0, html_url: '' });
	});

	it('should still send reads', async (t) => {
		const fetchMock = mockFetch(t, jsonResponse([]));
		const { repository } = createRepository();

		assert.deepEqual(await repository.getReviews(7), []);
		assert.equal(fetchMock.mock.callCount(), 1);
	});
});
