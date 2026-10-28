import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PullRequestDetails } from '../lib/github/repository.ts';
import { RELEASE_TYPES } from './config.ts';
import { buildPullRequest, buildRelease, FakeRepository } from './fake-repository.ts';
import { refreshOpenUmbrellas } from './refresh.ts';
import type { ReleaseState } from './run.ts';
import { renderUmbrella } from './umbrella-update.ts';

const RELEASES = {
	stable: {
		prNumber: 100,
		packages: [{ name: 'astro', version: '7.5.0' }],
		type: RELEASE_TYPES.minor,
	},
	prerelease: null,
};

const EXPECTED_TITLE = '[ci] release astro@7.5.0 docs';
const EXPECTED_BODY = renderUmbrella({
	branches: { head: 'release-queue/main', base: 'main' },
	release: buildRelease({ prNumber: 100 }),
	includedPrNumbers: [7],
}).body;

function buildUmbrella(labels: string[], changes: Partial<PullRequestDetails> = {}) {
	return {
		...buildPullRequest({ number: 50, headBranch: 'release-queue/main', labels }),
		...changes,
	};
}

async function refresh(...pullRequests: PullRequestDetails[]) {
	return refreshWithState({ releases: RELEASES, settledBaseBranches: [] }, ...pullRequests);
}

async function refreshWithState(state: ReleaseState, ...pullRequests: PullRequestDetails[]) {
	const docs = new FakeRepository({
		pullRequests,
		comparisons: {
			'main...release-queue/main': {
				ahead_by: 1,
				commits: [{ sha: 'sha-7', commit: { message: 'Document feature 7 (#7)' } }],
			},
		},
	});
	const reviewer = new FakeRepository({});
	const logs: string[] = [];
	const log = (message: string) => logs.push(message);
	await refreshOpenUmbrellas({
		docs,
		reviewer,
		log,
		state: { ...state, openPullRequests: [] },
	});
	return { writes: docs.writes, reviews: reviewer.writes, logs };
}

describe('refreshOpenUmbrellas', () => {
	it('should update the title, the description, and the labels of an umbrella', async () => {
		const { writes, logs } = await refresh(buildUmbrella(['patch-release']));

		assert.deepEqual(writes, [
			{ method: 'updatePullRequest', args: [50, { title: EXPECTED_TITLE, body: EXPECTED_BODY }] },
			{ method: 'addLabels', args: [50, ['merge-on-release', 'minor-release']] },
			{ method: 'removeLabel', args: [50, 'patch-release'] },
		]);
		assert.deepEqual(logs, [
			'Open umbrellas: #50.',
			'Umbrella #50 refreshed.',
			'Umbrella #50: merge blocked by a review.',
		]);
	});

	it('should only send what changed', async () => {
		const umbrella = buildUmbrella(['merge-on-release', 'minor-release'], {
			title: EXPECTED_TITLE,
		});

		const { writes } = await refresh(umbrella);

		assert.deepEqual(writes, [
			{ method: 'updatePullRequest', args: [50, { body: EXPECTED_BODY }] },
		]);
	});

	it('should not write to an umbrella that is up to date', async () => {
		const umbrella = buildUmbrella(['merge-on-release', 'minor-release'], {
			title: EXPECTED_TITLE,
			body: EXPECTED_BODY,
		});

		const { writes, logs } = await refresh(umbrella);

		assert.deepEqual(writes, []);
		assert.equal(logs[1], 'Umbrella #50 is up to date.');
	});

	it('should refresh every open umbrella, and only umbrellas', async () => {
		const { writes, logs } = await refresh(
			buildPullRequest({ number: 7, labels: ['accepted', 'minor-release'] }),
			buildUmbrella([]),
			buildPullRequest({ number: 60, headBranch: 'release-queue/v8', baseBranch: 'v8' })
		);

		const refreshedPrNumbers = new Set(writes.map(({ args }) => args[0]));
		assert.deepEqual([...refreshedPrNumbers], [50, 60]);
		assert.equal(logs[0], 'Open umbrellas: #50, #60.');
	});

	it('should only update the included PRs of a settled umbrella', async () => {
		const settledBody = renderUmbrella({
			branches: { head: 'release-queue/main', base: 'main' },
			release: buildRelease({ prNumber: 90 }),
			includedPrNumbers: [],
		}).body;
		const umbrella = buildUmbrella(['merge-on-release', 'patch-release'], {
			title: '[ci] release astro@7.4.9 docs',
			body: settledBody,
		});

		const { writes } = await refreshWithState(
			{ releases: RELEASES, settledBaseBranches: ['main'] },
			umbrella
		);

		assert.deepEqual(writes, [
			{
				method: 'updatePullRequest',
				args: [
					50,
					{
						body: renderUmbrella({
							branches: { head: 'release-queue/main', base: 'main' },
							release: buildRelease({ prNumber: 90 }),
							includedPrNumbers: [7],
						}).body,
					},
				],
			},
		]);
	});

	it('should leave the stable umbrella to maintainers while a major release is pending', async () => {
		const majorRelease = { ...RELEASES.stable, type: RELEASE_TYPES.major };

		const { writes, logs } = await refreshWithState(
			{ releases: { stable: majorRelease, prerelease: null }, settledBaseBranches: [] },
			buildUmbrella([])
		);

		assert.deepEqual(writes, []);
		assert.match(logs.at(-1) ?? '', /^Umbrella #50 skipped: /);
	});

	it('should fill the merge checklist of each umbrella', async () => {
		const { reviews } = await refreshWithState(
			{ releases: RELEASES, settledBaseBranches: ['main'] },
			buildUmbrella([], {
				body: renderUmbrella({
					branches: { head: 'release-queue/main', base: 'main' },
					release: buildRelease({ prNumber: 100 }),
					includedPrNumbers: [],
				}).body,
			}),
			buildPullRequest({ number: 11, baseBranch: 'release-queue/main' })
		);

		assert.equal(reviews.length, 1);
		const [checklist] = reviews.map(({ args }) => String(args[1]));
		assert.match(checklist, /covered-prs=7 -->/);
		assert.match(checklist, /- \[x\] withastro\/astro#100, /);
		assert.match(checklist, /Still open: #11\./);
	});
});
