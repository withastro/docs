import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildPullRequest, buildRelease, FAKE_REPOSITORY_NAME } from './fake-repository.ts';
import { renderMarker } from './markers.ts';
import { renderUmbrella } from './umbrella-update.ts';
import {
	findUmbrellas,
	getUmbrellaBaseBranch,
	getUmbrellaBranches,
	isUmbrellaPullRequest,
	RELEASE_PR_MARKER_NAME,
} from './umbrella.ts';

describe('getUmbrellaBranches', () => {
	it('should reserve one umbrella branch per base branch', () => {
		assert.deepEqual(getUmbrellaBranches('main'), {
			head: 'release-queue/main',
			base: 'main',
		});
		assert.deepEqual(getUmbrellaBranches('cloudflare-next'), {
			head: 'release-queue/cloudflare-next',
			base: 'cloudflare-next',
		});
	});
});

describe('getUmbrellaBaseBranch', () => {
	it('should get the base branch of an umbrella branch', () => {
		assert.equal(getUmbrellaBaseBranch('release-queue/cloudflare-next'), 'cloudflare-next');
	});

	it('should return null for a branch that is not an umbrella branch', () => {
		assert.equal(getUmbrellaBaseBranch('cloudflare-next'), null);
	});
});

describe('isUmbrellaPullRequest', () => {
	it('should accept a PR from an umbrella branch of the repository', () => {
		const umbrella = buildPullRequest({ headBranch: 'release-queue/main' });

		assert.equal(isUmbrellaPullRequest(umbrella, FAKE_REPOSITORY_NAME), true);
	});

	it('should refuse a PR from a fork branch named like an umbrella branch', () => {
		const fromFork = buildPullRequest({
			headBranch: 'release-queue/main',
			headRepository: 'example-user/docs',
		});
		const fromDeletedFork = buildPullRequest({
			headBranch: 'release-queue/main',
			headRepository: null,
		});

		assert.equal(isUmbrellaPullRequest(fromFork, FAKE_REPOSITORY_NAME), false);
		assert.equal(isUmbrellaPullRequest(fromDeletedFork, FAKE_REPOSITORY_NAME), false);
	});

	it('should refuse a PR from another branch of the repository', () => {
		const docsPullRequest = buildPullRequest({ headBranch: 'docs-feature' });

		assert.equal(isUmbrellaPullRequest(docsPullRequest, FAKE_REPOSITORY_NAME), false);
	});
});

describe('findUmbrellas', () => {
	it('should read the branches and the recorded release PR of each umbrella', () => {
		const branches = getUmbrellaBranches('main');
		const { body } = renderUmbrella({
			branches,
			release: buildRelease({ prNumber: 100 }),
			includedPrNumbers: [],
		});
		const pullRequests = [
			buildPullRequest({ number: 7 }),
			buildPullRequest({
				number: 50,
				headBranch: branches.head,
				labels: ['merge-on-release'],
				body,
			}),
			buildPullRequest({ number: 60, headBranch: 'release-queue/v8', baseBranch: 'v8' }),
		];

		const umbrellas = findUmbrellas(pullRequests, FAKE_REPOSITORY_NAME);

		assert.deepEqual(
			umbrellas.map(({ number, branches, releasePrNumber, labels }) => ({
				number,
				branches,
				releasePrNumber,
				labels,
			})),
			[
				{ number: 50, branches, releasePrNumber: 100, labels: [{ name: 'merge-on-release' }] },
				{
					number: 60,
					branches: getUmbrellaBranches('v8'),
					releasePrNumber: null,
					labels: [],
				},
			]
		);
	});

	it('should read a release PR marker that is not a PR number as no release PR', () => {
		const pullRequests = ['', 'abc', '0', '-1', '1.5'].map((value, index) =>
			buildPullRequest({
				number: 50 + index,
				headBranch: 'release-queue/main',
				body: renderMarker(RELEASE_PR_MARKER_NAME, value),
			})
		);

		const umbrellas = findUmbrellas(pullRequests, FAKE_REPOSITORY_NAME);

		assert.deepEqual(
			umbrellas.map(({ releasePrNumber }) => releasePrNumber),
			[null, null, null, null, null]
		);
	});
});
