import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES } from './config.ts';
import { buildPullRequest, FAKE_REPOSITORY_NAME } from './fake-repository.ts';
import type { FrameworkRelease } from './release.ts';
import {
	getUmbrellaBaseBranch,
	getUmbrellaBranch,
	isUmbrellaPullRequest,
	planUmbrellaUpdate,
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

function buildRelease(versions: string[], type: FrameworkRelease['type']): FrameworkRelease {
	const packages = versions.map((packageVersion) => {
		const [name, version] = packageVersion.split(/(?<!^)@/);
		return { name, version };
	});
	return { prNumber: 100, packages, type };
}

describe('renderUmbrellaTitle', () => {
	it('should name the astro version when astro is in the release', () => {
		const release = buildRelease(['@astrojs/node@10.0.1', 'astro@7.4.1'], RELEASE_TYPES.patch);

		assert.equal(renderUmbrellaTitle('main', release), '[ci] release astro@7.4.1 docs');
	});

	it('should name the only package of a release without astro', () => {
		const release = buildRelease(['@astrojs/vercel@11.0.14'], RELEASE_TYPES.patch);

		assert.equal(renderUmbrellaTitle('main', release), '[ci] release @astrojs/vercel@11.0.14 docs');
	});

	it('should name the base branch for several packages without astro', () => {
		const release = buildRelease(
			['@astrojs/cloudflare@15.0.0-beta.2', '@astrojs/vercel@11.0.15-beta.0'],
			RELEASE_TYPES.patch
		);

		assert.equal(
			renderUmbrellaTitle('cloudflare-next', release),
			'[ci] release cloudflare-next docs'
		);
	});

	it('should name the base branch without a release', () => {
		assert.equal(renderUmbrellaTitle('main', null), '[ci] release main docs');
	});
});

describe('planUmbrellaUpdate', () => {
	const stable = buildRelease(['astro@7.5.0'], RELEASE_TYPES.minor);
	const prerelease = buildRelease(['astro@8.0.0-beta.1'], RELEASE_TYPES.patch);

	function buildUmbrella(baseBranch: string, labels: string[], title = 'Umbrella') {
		return { ...buildPullRequest({ baseBranch, labels }), title };
	}

	it('should title and label the stable umbrella after the stable release', () => {
		const umbrella = buildUmbrella('main', ['patch-release', 'i18n']);

		assert.deepEqual(planUmbrellaUpdate(umbrella, { stable, prerelease }), {
			title: '[ci] release astro@7.5.0 docs',
			labelsToAdd: ['merge-on-release', 'minor-release'],
			labelsToRemove: ['patch-release'],
		});
	});

	it('should keep the title and the release label of the stable umbrella without a release', () => {
		const umbrella = buildUmbrella('main', ['merge-on-release', 'patch-release']);

		assert.deepEqual(planUmbrellaUpdate(umbrella, { stable: null, prerelease: null }), {
			title: 'Umbrella',
			labelsToAdd: [],
			labelsToRemove: [],
		});
	});

	it('should title a prerelease umbrella after the prerelease, and label it as a major', () => {
		const umbrella = buildUmbrella('v8', ['minor-release']);

		assert.deepEqual(planUmbrellaUpdate(umbrella, { stable, prerelease }), {
			title: '[ci] release astro@8.0.0-beta.1 docs',
			labelsToAdd: ['merge-on-release', 'major-release'],
			labelsToRemove: ['minor-release'],
		});
	});

	it('should label a prerelease umbrella as a major without a release', () => {
		const umbrella = buildUmbrella('v8', ['merge-on-release']);

		assert.deepEqual(planUmbrellaUpdate(umbrella, { stable: null, prerelease: null }), {
			title: 'Umbrella',
			labelsToAdd: ['major-release'],
			labelsToRemove: [],
		});
	});

	it('should change nothing on an umbrella that is up to date', () => {
		const umbrella = buildUmbrella(
			'main',
			['merge-on-release', 'minor-release'],
			'[ci] release astro@7.5.0 docs'
		);

		assert.deepEqual(planUmbrellaUpdate(umbrella, { stable, prerelease }), {
			title: '[ci] release astro@7.5.0 docs',
			labelsToAdd: [],
			labelsToRemove: [],
		});
	});
});
