import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PullRequestDetails } from '../lib/github/repository.ts';
import { RELEASE_TYPES } from './config.ts';
import { buildPullRequest, FakeRepository } from './fake-repository.ts';
import { refreshOpenUmbrellas } from './refresh.ts';
import { renderUmbrellaBody } from './umbrella.ts';

const RELEASES = {
	stable: {
		prNumber: 100,
		packages: [{ name: 'astro', version: '7.5.0' }],
		type: RELEASE_TYPES.minor,
	},
	prerelease: null,
};

const EXPECTED_TITLE = '[ci] release astro@7.5.0 docs';
const EXPECTED_BODY = renderUmbrellaBody({
	route: { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' },
	releasePrNumber: 100,
	includedPrNumbers: [7],
});

function buildUmbrella(labels: string[], changes: Partial<PullRequestDetails> = {}) {
	return {
		...buildPullRequest({ number: 50, headBranch: 'release-queue/main', labels }),
		...changes,
	};
}

async function refresh(...pullRequests: PullRequestDetails[]) {
	const docs = new FakeRepository({
		pullRequests,
		comparisons: {
			'main...release-queue/main': {
				ahead_by: 1,
				commits: [{ sha: 'sha-7', commit: { message: 'Document feature 7 (#7)' } }],
			},
		},
	});
	const logs: string[] = [];
	await refreshOpenUmbrellas({ docs, log: (message) => logs.push(message) }, RELEASES);
	return { writes: docs.writes, logs };
}

describe('refreshOpenUmbrellas', () => {
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
		assert.equal(logs.at(-1), 'Umbrella #50 is up to date.');
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
});
