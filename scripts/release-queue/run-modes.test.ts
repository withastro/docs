import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderDryRunComment } from './comments.ts';
import {
	buildPullRequest,
	buildReadyState,
	buildRelease,
	createContext,
	FakeRepository,
	MAIN_BRANCHES,
} from './fake-repository.ts';
import { OUTCOMES, REFUSAL_REASONS, type Decision } from './join-decision.ts';
import { runDryRun, runLiveMode } from './run-modes.ts';
import { renderUmbrella } from './umbrella-content.ts';

function buildDocs() {
	const accepted = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
	const umbrella = buildPullRequest({ number: 50, headBranch: 'release-queue/main' });
	return new FakeRepository({
		...buildReadyState(accepted),
		pullRequests: [accepted, umbrella],
		branchShas: { main: 'sha-main', 'release-queue/main': 'sha-umbrella' },
	});
}

describe('runLiveMode', () => {
	it('should join the accepted PRs, then refresh the open umbrellas', async () => {
		const docs = buildDocs();
		const { context, logs } = createContext(docs);

		await runLiveMode(context);

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

		await assert.rejects(runLiveMode(context), AggregateError);

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

		await assert.rejects(runLiveMode(context), ({ errors }: AggregateError) => {
			assert.equal(errors.length, 2);
			assert.ok(errors[0] instanceof AggregateError);
			assert.equal(errors[1], refreshError);
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

		await runDryRun(context, 7);

		assert.deepEqual(
			docs.writes,
			buildDryRunWrites(7, {
				outcome: OUTCOMES.join,
				branches: MAIN_BRANCHES,
			})
		);
		assert.deepEqual(logs, [
			'Releases: stable none open, prerelease the same. Settled umbrellas: none.',
			'Dry run: #7 would join release-queue/main.',
		]);
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

		await runDryRun(context, 7);

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
			'Releases: stable withastro/astro#100 (astro@8.0.0, major), prerelease the same. Settled umbrellas: none.'
		);
	});

	it('should comment with the reason a PR with the wrong labels would be refused', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted'] });
		const docs = new FakeRepository(buildReadyState(pullRequest));
		const { context } = createContext(docs);

		await runDryRun(context, 7);

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

		await runDryRun(context, 7);

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

	it('should comment that a PR would wait for its settled umbrella to be merged', async () => {
		const pullRequest = buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] });
		const settledUmbrella = buildPullRequest({
			number: 50,
			headBranch: 'release-queue/main',
			body: renderUmbrella({
				branches: MAIN_BRANCHES,
				release: buildRelease({ prNumber: 100 }),
				includedPrNumbers: [],
			}).body,
		});
		const docs = new FakeRepository({
			...buildReadyState(pullRequest),
			pullRequests: [pullRequest, settledUmbrella],
		});
		const astro = new FakeRepository({
			pullRequests: [buildPullRequest({ number: 100, isMerged: true })],
		});
		const { context } = createContext(docs, astro);

		await runDryRun(context, 7);

		assert.deepEqual(
			docs.writes,
			buildDryRunWrites(7, {
				outcome: OUTCOMES.refuse,
				reasons: [REFUSAL_REASONS.settledUmbrella],
				branches: MAIN_BRANCHES,
			})
		);
	});

	it('should skip a PR that no longer has the accepted label', async () => {
		const docs = new FakeRepository({
			pullRequests: [buildPullRequest({ number: 7, labels: ['minor-release'] })],
		});
		const { context, logs } = createContext(docs);

		await runDryRun(context, 7);

		assert.deepEqual(docs.writes, []);
		assert.match(logs.join('\n'), /^#7 skipped:/m);
	});

	it('should skip an umbrella PR', async () => {
		const umbrella = buildPullRequest({
			number: 7,
			headBranch: 'release-queue/main',
			labels: ['accepted', 'minor-release'],
		});
		const docs = new FakeRepository({ pullRequests: [umbrella] });
		const { context, logs } = createContext(docs);

		await runDryRun(context, 7);

		assert.deepEqual(docs.writes, []);
		assert.match(logs.join('\n'), /^#7 skipped:/m);
	});
});
