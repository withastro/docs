import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderDryRunComment } from './comments.ts';
import { OUTCOMES, REFUSAL_REASONS, type Decision } from './decision.ts';
import { buildPullRequest, buildReadyState, FakeRepository } from './fake-repository.ts';
import { previewJoin } from './join.ts';

function createContext(docs: FakeRepository) {
	const logs: string[] = [];
	const log = (message: string) => logs.push(message);
	return { context: { docs, log, jobName: 'release-queue' }, logs };
}

function buildComment(prNumber: number, decision: Decision) {
	return { method: 'createComment', args: [prNumber, renderDryRunComment(decision)] };
}

describe('previewJoin', () => {
	it('should comment with the umbrella a ready PR would join', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			buildComment(7, {
				outcome: OUTCOMES.join,
				route: { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' },
			}),
		]);
		assert.deepEqual(logs, ['Dry run: #7 would join release-queue/main.']);
	});

	it('should comment with the reason a PR with the wrong labels would be refused', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const { context } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			buildComment(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.missingReleaseLabel],
			}),
		]);
	});

	it('should comment with the reasons a PR not ready to merge would be refused', async () => {
		const pullRequest = buildPullRequest({
			number: 7,
			labels: ['accepted', 'minor-release'],
			isDraft: true,
		});
		const docs = new FakeRepository({ pullRequests: [pullRequest] });
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, [
			buildComment(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.draft, REFUSAL_REASONS.missingApproval],
			}),
		]);
		assert.deepEqual(logs, [
			`Dry run: #7 would be refused (${REFUSAL_REASONS.draft}, ${REFUSAL_REASONS.missingApproval}).`,
		]);
	});

	it('should skip a PR that no longer has the accepted label', async () => {
		const docs = new FakeRepository({
			pullRequests: [buildPullRequest({ number: 7, labels: ['minor-release'] })],
		});
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
		const docs = new FakeRepository({ pullRequests: [umbrella] });
		const { context, logs } = createContext(docs);

		await previewJoin(context, 7);

		assert.deepEqual(docs.writes, []);
		assert.match(logs.join('\n'), /^#7 skipped:/);
	});
});
