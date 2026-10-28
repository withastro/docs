import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildPullRequest, buildReadyState, FakeRepository } from './fake-repository.ts';
import { runReleaseQueue } from './queue.ts';

function buildDocs() {
	const accepted = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
	const umbrella = buildPullRequest({ number: 50, headBranch: 'release-queue/main' });
	return new FakeRepository({
		...buildReadyState(accepted),
		pullRequests: [accepted, umbrella],
		branchShas: { main: 'sha-main', 'release-queue/main': 'sha-umbrella' },
	});
}

function createContext(docs: FakeRepository) {
	const logs: string[] = [];
	const log = (message: string) => logs.push(message);
	return { context: { docs, astro: new FakeRepository({}), log, jobName: null }, logs };
}

describe('runReleaseQueue', () => {
	it('should join the accepted PRs, then refresh the open umbrellas', async () => {
		const docs = buildDocs();
		const { context, logs } = createContext(docs);

		await runReleaseQueue(context);

		const methods = docs.writes.map(({ method }) => method);
		assert.ok(methods.indexOf('mergePullRequest') < methods.indexOf('addLabels'));
		assert.ok(docs.writes.some(({ method, args }) => method === 'addLabels' && args[0] === 50));
		assert.equal(logs[0], 'Releases: stable none open, prerelease the same.');
	});

	it('should refresh the open umbrellas when a join fails, then fail', async (t) => {
		const docs = buildDocs();
		t.mock.method(docs, 'mergePullRequest', async () => {
			throw new Error('Network error');
		});
		const { context } = createContext(docs);

		await assert.rejects(runReleaseQueue(context), AggregateError);

		assert.ok(docs.writes.some(({ method, args }) => method === 'addLabels' && args[0] === 50));
	});
});
