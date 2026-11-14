import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildReadyState, createContext, MAIN_BRANCHES } from './fixtures.ts';
import { buildPullRequest, FakeRepository } from './github/fake-repository.ts';
import { renderAcceptedUmbrellaComment, renderDryRunComment } from './join/comments.ts';
import { OUTCOMES, REFUSAL_REASONS, type Decision } from './join/decision.ts';
import { runDryRun } from './run.ts';

function buildDryRunWrites(prNumber: number, decision: Decision) {
	return [
		{ method: 'removeLabel', args: [prNumber, 'accepted'] },
		{ method: 'createComment', args: [prNumber, renderDryRunComment(decision)] },
	];
}

describe('runDryRun', () => {
	it('should comment with the umbrella a ready PR would join', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const { context, logs } = createContext(docs);

		await runDryRun(context);

		assert.deepEqual(
			docs.writes,
			buildDryRunWrites(7, {
				outcome: OUTCOMES.join,
				branches: MAIN_BRANCHES,
			})
		);
		assert.deepEqual(logs, ['Accepted PRs: #7.', 'Dry run: #7 would join umbrella/main.']);
	});

	it('should comment on every accepted PR, oldest first, and on no other PR', async () => {
		const pullRequests = [
			buildPullRequest({ number: 9, labels: ['accepted', 'minor-release'] }),
			buildPullRequest({ number: 8, labels: ['minor-release'] }),
			buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] }),
		];
		const docs = new FakeRepository({ ...buildReadyState(pullRequests[0]), pullRequests });
		const { context } = createContext(docs);

		await runDryRun(context);

		const commentedPrNumbers = docs.writes
			.filter(({ method }) => method === 'createComment')
			.map(({ args }) => args[0]);
		assert.deepEqual(commentedPrNumbers, [7, 9]);
	});

	it('should comment with the reason a PR with the wrong labels would be refused', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const { context } = createContext(docs);

		await runDryRun(context);

		assert.deepEqual(
			docs.writes,
			buildDryRunWrites(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.missingReleaseLabel],
				branches: MAIN_BRANCHES,
			})
		);
	});

	it('should comment with the reasons a PR not ready to merge would be refused', async () => {
		const pullRequest = buildPullRequest({
			number: 7,
			labels: ['accepted', 'minor-release'],
			isDraft: true,
		});
		const docs = new FakeRepository({ pullRequests: [pullRequest] });
		const { context, logs } = createContext(docs);

		await runDryRun(context);

		assert.deepEqual(
			docs.writes,
			buildDryRunWrites(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.draft, REFUSAL_REASONS.missingApproval],
				branches: MAIN_BRANCHES,
			})
		);
		assert.equal(
			logs.at(-1),
			`Dry run: #7 would be refused (${REFUSAL_REASONS.draft}, ${REFUSAL_REASONS.missingApproval}).`
		);
	});

	it('should skip a PR that lost the accepted label since the start of the run', async (t) => {
		const docs = new FakeRepository({
			pullRequests: [buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] })],
		});
		t.mock.method(docs, 'getPullRequest', async () =>
			buildPullRequest({ number: 7, labels: ['minor-release'] })
		);
		const { context, logs } = createContext(docs);

		await runDryRun(context);

		assert.deepEqual(docs.writes, []);
		assert.match(logs.join('\n'), /^#7 skipped:/m);
	});

	it('should remove the accepted label from an umbrella PR, with a comment', async () => {
		const umbrella = buildPullRequest({
			number: 7,
			headBranch: 'umbrella/main',
			labels: ['accepted', 'minor-release'],
		});
		const docs = new FakeRepository({ pullRequests: [umbrella] });
		const { context, logs } = createContext(docs);

		await runDryRun(context);

		assert.deepEqual(docs.writes, [
			{ method: 'removeLabel', args: [7, 'accepted'] },
			{ method: 'createComment', args: [7, renderAcceptedUmbrellaComment()] },
		]);
		assert.equal(logs.at(-1), '#7 refused (umbrella PR).');
	});
});
