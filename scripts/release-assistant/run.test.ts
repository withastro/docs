import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildReadyState, createContext, MAIN_BRANCHES } from './fixtures.ts';
import { buildPullRequest, FakeRepository } from './github/fake-repository.ts';
import { renderAcceptedUmbrellaComment, renderDryRunComment } from './join/comments.ts';
import { OUTCOMES, REFUSAL_REASONS, type Decision } from './join/decision.ts';
import { runDryRun, runLiveMode } from './run.ts';

function buildDocs() {
	const accepted = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
	const umbrella = buildPullRequest({ number: 50, headBranch: 'umbrella/main' });
	return new FakeRepository({
		...buildReadyState(accepted),
		pullRequests: [accepted, umbrella],
		branchShas: { main: 'sha-main', 'umbrella/main': 'sha-umbrella' },
	});
}

describe('runLiveMode', () => {
	it('should join the accepted PRs, then refresh the open umbrellas', async () => {
		const docs = buildDocs();
		const { context, logs } = createContext(docs);

		await runLiveMode(context);

		const methods = docs.writes.map(({ method }) => method);
		assert.ok(methods.indexOf('squashMergePullRequest') < methods.indexOf('addLabels'));
		assert.ok(docs.writes.some(({ method, args }) => method === 'addLabels' && args[0] === 50));
		assert.equal(logs[0], 'Releases: stable none open, prerelease the same.');
	});

	it('should refresh the open umbrellas when a join fails, then fail', async (t) => {
		const docs = buildDocs();
		t.mock.method(docs, 'squashMergePullRequest', async () => {
			throw new Error('Network error');
		});
		const { context } = createContext(docs);

		await assert.rejects(runLiveMode(context), AggregateError);

		assert.ok(docs.writes.some(({ method, args }) => method === 'addLabels' && args[0] === 50));
	});

	it('should fail with both errors when the joins and the refresh fail', async (t) => {
		const docs = buildDocs();
		const joinError = new Error('Network error while joining');
		const refreshError = new Error('Network error while refreshing');
		t.mock.method(docs, 'squashMergePullRequest', async () => {
			throw joinError;
		});
		t.mock.method(docs, 'compare', async () => {
			throw refreshError;
		});
		const { context } = createContext(docs);

		await assert.rejects(runLiveMode(context), ({ errors }: AggregateError) => {
			assert.deepEqual(
				errors.map(({ message }: Error) => message),
				[
					'#7 failed: Network error while joining',
					'Umbrella #50 failed: Network error while refreshing',
				]
			);
			assert.equal(errors[0].cause, joinError);
			assert.equal(errors[1].cause, refreshError);
			return true;
		});
	});
});

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
		assert.deepEqual(logs, [
			'Releases: stable none open, prerelease the same.',
			'Accepted PRs: #7.',
			'Dry run: #7 would join umbrella/main.',
		]);
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

	it('should comment that a PR for the stable umbrella would wait for the major release', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const releasePullRequest = buildPullRequest({
			number: 100,
			headBranch: 'changeset-release/main',
			body: '# Releases\n\n## astro@8.0.0\n\n### Major Changes\n',
		});
		const astro = new FakeRepository({ pullRequests: [releasePullRequest] });
		const { context, logs } = createContext(docs, astro);

		await runDryRun(context);

		assert.deepEqual(
			docs.writes,
			buildDryRunWrites(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.majorReleasePending],
				branches: MAIN_BRANCHES,
			})
		);
		assert.equal(
			logs[0],
			'Releases: stable withastro/astro#100 (astro@8.0.0, major), prerelease the same.'
		);
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
