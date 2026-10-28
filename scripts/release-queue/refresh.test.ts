import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES } from './config.ts';
import { buildPullRequest, FakeRepository } from './fake-repository.ts';
import { refreshUmbrella } from './refresh.ts';

const RELEASES = {
	stable: {
		prNumber: 100,
		packages: [{ name: 'astro', version: '7.5.0' }],
		type: RELEASE_TYPES.minor,
	},
	prerelease: null,
};

function createContext(docs: FakeRepository) {
	const logs: string[] = [];
	return { context: { docs, log: (message: string) => logs.push(message) }, logs };
}

describe('refreshUmbrella', () => {
	it('should update the title and the labels of an umbrella', async () => {
		const umbrella = buildPullRequest({ number: 50, labels: ['patch-release'] });
		const docs = new FakeRepository({});
		const { context, logs } = createContext(docs);

		await refreshUmbrella(context, umbrella, RELEASES);

		assert.deepEqual(docs.writes, [
			{ method: 'updatePullRequest', args: [50, { title: '[ci] release astro@7.5.0 docs' }] },
			{ method: 'addLabels', args: [50, ['merge-on-release', 'minor-release']] },
			{ method: 'removeLabel', args: [50, 'patch-release'] },
		]);
		assert.deepEqual(logs, ['Umbrella #50 refreshed.']);
	});

	it('should not write to an umbrella that is up to date', async () => {
		const umbrella = {
			...buildPullRequest({ number: 50, labels: ['merge-on-release', 'minor-release'] }),
			title: '[ci] release astro@7.5.0 docs',
		};
		const docs = new FakeRepository({});
		const { context, logs } = createContext(docs);

		await refreshUmbrella(context, umbrella, RELEASES);

		assert.deepEqual(docs.writes, []);
		assert.deepEqual(logs, ['Umbrella #50 is up to date.']);
	});
});
