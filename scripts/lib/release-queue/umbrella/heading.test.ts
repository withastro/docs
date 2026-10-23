import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getStableRelease } from '../release/release.ts';
import { getUmbrellaReleaseLabel, getUmbrellaTitle } from './heading.ts';

const releasePullRequest = (frameworkVersion?: string) => ({
	number: 18459,
	versions: frameworkVersion ? [{ name: 'astro', version: frameworkVersion }] : [],
});

describe('getUmbrellaTitle', () => {
	it('names the main umbrella after the astro version', () => {
		const release = getStableRelease(releasePullRequest('7.4.1'));
		assert.equal(getUmbrellaTitle('main', release), '[ci] release astro@7.4.1 docs');
	});

	it('falls back to the branch name when astro is not released', () => {
		const release = getStableRelease(releasePullRequest());
		assert.equal(getUmbrellaTitle('main', release), '[ci] release main docs');
	});

	it('names a prerelease umbrella after its branch', () => {
		const release = getStableRelease(releasePullRequest('7.4.1'));
		assert.equal(getUmbrellaTitle('cloudflare-next', release), '[ci] release cloudflare-next docs');
	});
});

describe('getUmbrellaReleaseLabel', () => {
	it('labels the main umbrella after the release type', () => {
		const patch = getStableRelease(releasePullRequest('7.4.1'));
		const minor = getStableRelease(releasePullRequest('7.5.0'));
		assert.equal(getUmbrellaReleaseLabel('main', patch), 'patch-release');
		assert.equal(getUmbrellaReleaseLabel('main', minor), 'minor-release');
	});

	it('labels the main umbrella as a patch when astro is not released', () => {
		const release = getStableRelease(releasePullRequest());
		assert.equal(getUmbrellaReleaseLabel('main', release), 'patch-release');
	});

	it('labels a prerelease umbrella as a major', () => {
		const release = getStableRelease(releasePullRequest('7.4.1'));
		assert.equal(getUmbrellaReleaseLabel('cloudflare-next', release), 'major-release');
	});
});
