import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderDryRunComment } from './comments.ts';
import { routePullRequest } from './decision.ts';
import { buildPullRequest, FakeRepository } from './fake-repository.ts';
import { previewJoin } from './join.ts';

function createContext(docs: FakeRepository) {
	const logs: string[] = [];
	return { context: { docs, log: (message: string) => logs.push(message) }, logs };
}

describe('previewJoin', () => {
	it('should comment with the umbrella an accepted PR would join', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
		const docs = new FakeRepository([pullRequest]);
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			{ method: 'createComment', args: [7, renderDryRunComment(routePullRequest(pullRequest))] },
		]);
		assert.deepEqual(logs, ['Dry run: #7 would join release-queue/main.']);
	});

	it('should comment with the reason an accepted PR would be refused', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted'] });
		const docs = new FakeRepository([pullRequest]);
		const { context } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			{ method: 'createComment', args: [7, renderDryRunComment(routePullRequest(pullRequest))] },
		]);
	});

	it('should skip a PR that no longer has the accepted label', async () => {
		const docs = new FakeRepository([buildPullRequest({ number: 7, labels: ['minor-release'] })]);
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, []);
		assert.match(logs.join('\n'), /^#7 skipped:/);
	});

	it('should skip an umbrella PR', async () => {
		const umbrella = buildPullRequest({
			number: 7,
			headBranch: 'release-queue/main',
			labels: ['accepted', 'minor-release'],
		});
		const docs = new FakeRepository([umbrella]);
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, []);
		assert.match(logs.join('\n'), /^#7 skipped:/);
	});
});
