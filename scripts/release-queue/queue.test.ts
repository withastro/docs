import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	buildPullRequest,
	buildReadyState,
	createContext,
	FakeRepository,
} from './fake-repository.ts';
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

describe('runReleaseQueue', () => {
	it('should join the accepted PRs, then refresh the open umbrellas', async () => {
		const docs = buildDocs();
		const { context, logs } = createContext(docs);

		await runReleaseQueue(context);

		const methods = docs.writes.map(({ method }) => method);
		assert.ok(methods.indexOf('mergePullRequest') < methods.indexOf('addLabels'));
		assert.ok(docs.writes.some(({ method, args }) => method === 'addLabels' && args[0] === 50));
		assert.equal(
			logs[0],
			'Releases: stable none open, prerelease the same. Settled umbrellas: none.'
		);
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

	it('should fail with both errors when the joins and the refresh fail', async (t) => {
		const docs = buildDocs();
		const joinError = new Error('Network error while joining');
		const refreshError = new Error('Network error while refreshing');
		t.mock.method(docs, 'mergePullRequest', async () => {
			throw joinError;
		});
		t.mock.method(docs, 'compare', async () => {
			throw refreshError;
		});
		const { context } = createContext(docs);

		await assert.rejects(runReleaseQueue(context), ({ errors }: AggregateError) => {
			assert.equal(errors.length, 2);
			assert.ok(errors[0] instanceof AggregateError);
			assert.equal(errors[1], refreshError);
			return true;
		});
	});
});
