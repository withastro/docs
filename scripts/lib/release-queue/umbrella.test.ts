import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getUmbrellaReleaseLabel, getUmbrellaTitle } from './umbrella.ts';

describe('getUmbrellaTitle', () => {
	it('uses the astro version for the main umbrella', () => {
		assert.equal(getUmbrellaTitle('main', '7.4.1'), '[ci] release astro@7.4.1 docs');
	});

	it('falls back to the branch name when astro is not released', () => {
		assert.equal(getUmbrellaTitle('main'), '[ci] release main docs');
	});

	it('uses the branch name for a prerelease umbrella', () => {
		assert.equal(
			getUmbrellaTitle('cloudflare-next', '7.4.0-beta.1'),
			'[ci] release cloudflare-next docs'
		);
	});
});

describe('getUmbrellaReleaseLabel', () => {
	it('labels the main umbrella from the astro release type', () => {
		assert.equal(getUmbrellaReleaseLabel('main', 'minor'), 'minor-release');
		assert.equal(getUmbrellaReleaseLabel('main', 'patch'), 'patch-release');
	});

	it('labels a prerelease umbrella as a major release', () => {
		assert.equal(getUmbrellaReleaseLabel('v8', 'patch'), 'major-release');
	});
});
