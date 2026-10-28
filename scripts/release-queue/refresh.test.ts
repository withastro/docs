import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES } from './config.ts';
import { buildPullRequest, FakeRepository } from './fake-repository.ts';
import { refreshUmbrella } from './refresh.ts';
import { renderUmbrellaBody } from './umbrella.ts';

const RELEASES = {
	stable: {
		prNumber: 100,
		packages: [{ name: 'astro', version: '7.5.0' }],
		type: RELEASE_TYPES.minor,
	},
	prerelease: null,
};

const ROUTE = { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' };
const EXPECTED_BODY = renderUmbrellaBody({
	route: ROUTE,
	releasePrNumber: 100,
	includedPrNumbers: [7],
});

function createContext() {
	const docs = new FakeRepository({
		comparisons: {
			'main...release-queue/main': {
				ahead_by: 1,
				commits: [{ sha: 'sha-7', commit: { message: 'Document feature 7 (#7)' } }],
			},
		},
	});
	const logs: string[] = [];
	return { docs, context: { docs, log: (message: string) => logs.push(message) }, logs };
}

describe('refreshUmbrella', () => {
	it('should update the title, the description, and the labels of an umbrella', async () => {
		const umbrella = buildPullRequest({ number: 50, labels: ['patch-release'] });
		const { docs, context, logs } = createContext();

		await refreshUmbrella(context, umbrella, RELEASES);

		assert.deepEqual(docs.writes, [
			{
				method: 'updatePullRequest',
				args: [50, { title: '[ci] release astro@7.5.0 docs', body: EXPECTED_BODY }],
			},
			{ method: 'addLabels', args: [50, ['merge-on-release', 'minor-release']] },
			{ method: 'removeLabel', args: [50, 'patch-release'] },
		]);
		assert.deepEqual(logs, ['Umbrella #50 refreshed.']);
	});

	it('should only send what changed', async () => {
		const umbrella = {
			...buildPullRequest({ number: 50, labels: ['merge-on-release', 'minor-release'] }),
			title: '[ci] release astro@7.5.0 docs',
		};
		const { docs, context } = createContext();

		await refreshUmbrella(context, umbrella, RELEASES);

		assert.deepEqual(docs.writes, [
			{ method: 'updatePullRequest', args: [50, { body: EXPECTED_BODY }] },
		]);
	});

	it('should not write to an umbrella that is up to date', async () => {
		const umbrella = {
			...buildPullRequest({ number: 50, labels: ['merge-on-release', 'minor-release'] }),
			title: '[ci] release astro@7.5.0 docs',
			body: EXPECTED_BODY,
		};
		const { docs, context, logs } = createContext();

		await refreshUmbrella(context, umbrella, RELEASES);

		assert.deepEqual(docs.writes, []);
		assert.deepEqual(logs, ['Umbrella #50 is up to date.']);
	});
});
