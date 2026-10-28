import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildPullRequest, FAKE_REPOSITORY_NAME } from './fake-repository.ts';
import {
	getUmbrellaBaseBranch,
	getUmbrellaBranch,
	isUmbrellaPullRequest,
	renderUmbrellaTitle,
} from './umbrella.ts';

describe('getUmbrellaBranch', () => {
	it('should reserve one umbrella branch per base branch', () => {
		assert.equal(getUmbrellaBranch('main'), 'release-queue/main');
		assert.equal(getUmbrellaBranch('cloudflare-next'), 'release-queue/cloudflare-next');
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

describe('renderUmbrellaTitle', () => {
	it('should follow the convention of the framework release PRs, with the base branch', () => {
		assert.equal(renderUmbrellaTitle('main'), '[ci] release main docs');
	});
});
