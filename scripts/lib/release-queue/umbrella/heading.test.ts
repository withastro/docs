import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getStableRelease } from '../release/release.ts';
import { getUmbrellaHeading } from './heading.ts';

const releasePullRequest = (frameworkVersion?: string) => ({
	number: 18459,
	versions: frameworkVersion ? [{ name: 'astro', version: frameworkVersion }] : [],
});

describe('getUmbrellaHeading', () => {
	it('names the main umbrella after the astro version', () => {
		assert.deepEqual(getUmbrellaHeading('main', getStableRelease(releasePullRequest('7.4.1'))), {
			title: '[ci] release astro@7.4.1 docs',
			releaseLabel: 'patch-release',
		});
	});

	it('labels the main umbrella of a minor release', () => {
		const heading = getUmbrellaHeading('main', getStableRelease(releasePullRequest('7.5.0')));
		assert.equal(heading.releaseLabel, 'minor-release');
	});

	it('falls back to the branch name and a patch when astro is not released', () => {
		assert.deepEqual(getUmbrellaHeading('main', getStableRelease(releasePullRequest())), {
			title: '[ci] release main docs',
			releaseLabel: 'patch-release',
		});
	});

	it('names a prerelease umbrella after its branch, as a major', () => {
		const release = getStableRelease(releasePullRequest('7.4.1'));
		assert.deepEqual(getUmbrellaHeading('cloudflare-next', release), {
			title: '[ci] release cloudflare-next docs',
			releaseLabel: 'major-release',
		});
	});
});
