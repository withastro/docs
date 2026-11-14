import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildPullRequest, FAKE_REPOSITORY_NAME } from '../github/fake-repository.ts';
import { getUmbrellaBaseBranch, getUmbrellaBranches, isUmbrellaPullRequest } from './umbrella.ts';

describe('getUmbrellaBranches', () => {
	it('should reserve one umbrella branch per base branch', () => {
		assert.deepEqual(getUmbrellaBranches('main'), {
			head: 'umbrella/main',
			base: 'main',
		});
		assert.deepEqual(getUmbrellaBranches('cloudflare-next'), {
			head: 'umbrella/cloudflare-next',
			base: 'cloudflare-next',
		});
	});
});

describe('getUmbrellaBaseBranch', () => {
	it('should get the base branch of an umbrella branch', () => {
		assert.equal(getUmbrellaBaseBranch('umbrella/cloudflare-next'), 'cloudflare-next');
	});

	it('should return null for a branch that is not an umbrella branch', () => {
		assert.equal(getUmbrellaBaseBranch('cloudflare-next'), null);
	});
});

describe('isUmbrellaPullRequest', () => {
	it('should accept a PR from an umbrella branch of the repository', () => {
		const umbrella = buildPullRequest({ headBranch: 'umbrella/main' });

		assert.equal(isUmbrellaPullRequest(umbrella, FAKE_REPOSITORY_NAME), true);
	});

	it('should refuse a PR from a fork branch named like an umbrella branch', () => {
		const fromFork = buildPullRequest({
			headBranch: 'umbrella/main',
			headRepository: 'example-user/docs',
		});
		const fromDeletedFork = buildPullRequest({
			headBranch: 'umbrella/main',
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
