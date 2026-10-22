import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getMainRelease } from './release.ts';
import { getUmbrellaHeading } from './umbrella-heading.ts';

const releasePullRequest = (astroVersion?: string) => ({
	number: 18459,
	versions: astroVersion ? [{ name: 'astro', version: astroVersion }] : [],
});

describe('getUmbrellaHeading', () => {
	it('names the main umbrella after the astro version', () => {
		assert.deepEqual(getUmbrellaHeading('main', getMainRelease(releasePullRequest('7.4.1'))), {
			title: '[ci] release astro@7.4.1 docs',
			releaseLabel: 'patch-release',
		});
	});

	it('labels the main umbrella of a minor release', () => {
		const heading = getUmbrellaHeading('main', getMainRelease(releasePullRequest('7.5.0')));
		assert.equal(heading.releaseLabel, 'minor-release');
	});

	it('falls back to the branch name and a patch when astro is not released', () => {
		assert.deepEqual(getUmbrellaHeading('main', getMainRelease(releasePullRequest())), {
			title: '[ci] release main docs',
			releaseLabel: 'patch-release',
		});
	});

	it('names a prerelease umbrella after its branch, as a major', () => {
		const release = getMainRelease(releasePullRequest('7.4.1'));
		assert.deepEqual(getUmbrellaHeading('cloudflare-next', release), {
			title: '[ci] release cloudflare-next docs',
			releaseLabel: 'major-release',
		});
	});
});
