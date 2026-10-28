import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildPullRequest, FakeRepository } from './fake-repository.ts';
import { readReleaseState } from './state.ts';
import { renderUmbrellaBody } from './umbrella.ts';

function buildUmbrella(number: number, baseBranch: string, releasePrNumber: number | null) {
	const umbrellaBranch = `release-queue/${baseBranch}`;
	return buildPullRequest({
		number,
		baseBranch,
		headBranch: umbrellaBranch,
		body: renderUmbrellaBody({
			route: { umbrellaBranch, umbrellaBaseBranch: baseBranch },
			releasePrNumber,
			includedPrNumbers: [],
		}),
	});
}

describe('readReleaseState', () => {
	it('should read the releases of the framework', async () => {
		const releasePullRequest = buildPullRequest({
			number: 100,
			headBranch: 'changeset-release/main',
			body: '## astro@7.4.1\n',
		});
		const docs = new FakeRepository({});
		const astro = new FakeRepository({ pullRequests: [releasePullRequest] });

		const { releases } = await readReleaseState({ docs, astro });

		assert.equal(releases.stable?.prNumber, 100);
	});

	it('should find the umbrellas whose release PR is merged', async () => {
		const docs = new FakeRepository({
			pullRequests: [
				buildUmbrella(50, 'main', 100),
				buildUmbrella(60, 'cloudflare-next', 200),
				buildUmbrella(70, 'v8', null),
				{
					...buildPullRequest({ number: 7 }),
					body: renderUmbrellaBody({
						route: { umbrellaBranch: 'release-queue/v9', umbrellaBaseBranch: 'v9' },
						releasePrNumber: 100,
						includedPrNumbers: [],
					}),
				},
			],
		});
		const astro = new FakeRepository({
			pullRequests: [
				buildPullRequest({ number: 100, isMerged: true }),
				buildPullRequest({ number: 200 }),
			],
		});

		const { settledBaseBranches } = await readReleaseState({ docs, astro });

		assert.deepEqual(settledBaseBranches, ['main']);
	});

	it('should not count an umbrella whose marker names a release PR that does not exist', async () => {
		const docs = new FakeRepository({ pullRequests: [buildUmbrella(50, 'main', 404)] });
		const astro = new FakeRepository({});

		const { settledBaseBranches } = await readReleaseState({ docs, astro });

		assert.deepEqual(settledBaseBranches, []);
	});
});
