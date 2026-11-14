import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES } from '../config.ts';
import { buildRelease, MAIN_BRANCHES } from '../fixtures.ts';
import { buildPullRequest, FakeRepository } from '../github/fake-repository.ts';
import type { PullRequestDetails } from '../github/repository.ts';
import type { ReleaseState } from '../run.ts';
import { renderUmbrella } from './content.ts';
import { refreshOpenUmbrellas } from './refresh.ts';

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
	branches: MAIN_BRANCHES,
	release: buildRelease({ prNumber: 100 }),
	includedPrNumbers: [7],
}).body;

function buildUmbrella(labels: string[], changes: Partial<PullRequestDetails> = {}) {
	return {
		...buildPullRequest({ number: 50, headBranch: 'umbrella/main', labels }),
		...changes,
	};
}

async function refresh(...pullRequests: PullRequestDetails[]) {
	return refreshWithState({ releases: RELEASES }, ...pullRequests);
}

async function refreshWithState(state: ReleaseState, ...pullRequests: PullRequestDetails[]) {
	const docs = new FakeRepository({
		pullRequests,
		comparisons: {
			'main...umbrella/main': {
				commits: [{ sha: 'sha-7', commit: { message: 'Document feature 7 (#7)' } }],
			},
		},
	});
	const logs: string[] = [];
	const log = (message: string) => logs.push(message);
	await refreshOpenUmbrellas({ docs, log, state: { ...state, openPullRequests: [] } });
	return { writes: docs.writes, logs };
}

describe('refreshOpenUmbrellas', () => {
	it('should refresh the other umbrellas when one fails, then fail', async (t) => {
		const docs = new FakeRepository({
			pullRequests: [
				buildUmbrella([]),
				buildPullRequest({ number: 60, headBranch: 'umbrella/v8', baseBranch: 'v8' }),
			],
		});
		const compare = docs.compare.bind(docs);
		const refreshError = new Error('Network error');
		t.mock.method(docs, 'compare', async (base: string, head: string) => {
			if (base === 'main') throw refreshError;
			return compare(base, head);
		});
		const state = { releases: RELEASES, openPullRequests: [] };

		await assert.rejects(
			refreshOpenUmbrellas({ docs, log: () => {}, state }),
			({ errors }: AggregateError) => {
				assert.equal(errors.length, 1);
				assert.equal(errors[0].message, 'Umbrella #50 failed: Network error');
				assert.equal(errors[0].cause, refreshError);
				return true;
			}
		);

		assert.ok(docs.writes.some(({ args }) => args[0] === 60));
	});

	it('should update the title, the description, and the labels of an umbrella', async () => {
		const { writes, logs } = await refresh(buildUmbrella(['patch-release']));

		assert.deepEqual(writes, [
			{ method: 'updatePullRequest', args: [50, { title: EXPECTED_TITLE, body: EXPECTED_BODY }] },
			{ method: 'addLabels', args: [50, ['merge-on-release', 'minor-release']] },
			{ method: 'removeLabel', args: [50, 'patch-release'] },
		]);
		assert.deepEqual(logs, ['Open umbrellas: #50.', 'Umbrella #50 refreshed.']);
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
			buildPullRequest({ number: 60, headBranch: 'umbrella/v8', baseBranch: 'v8' })
		);

		const refreshedPrNumbers = new Set(writes.map(({ args }) => args[0]));
		assert.deepEqual([...refreshedPrNumbers], [50, 60]);
		assert.equal(logs[0], 'Open umbrellas: #50, #60.');
	});

	it('should leave the stable umbrella to maintainers while a major release is pending', async () => {
		const majorRelease = { ...RELEASES.stable, type: RELEASE_TYPES.major };

		const { writes, logs } = await refreshWithState(
			{ releases: { stable: majorRelease, prerelease: null } },
			buildUmbrella([])
		);

		assert.deepEqual(writes, []);
		assert.match(logs.at(-1) ?? '', /^Umbrella #50 skipped: /);
	});
});
