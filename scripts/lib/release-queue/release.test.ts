import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getMainRelease, parseReleaseVersions } from './release.ts';

const body = `This PR was opened by the [Changesets release](https://github.com/changesets/action) GitHub action.

# Releases
## astro@7.4.1

### Patch Changes

- [#18339](https://github.com/withastro/astro/pull/18339) Fixes a bug with \`astro@7.4.0\`

## @astrojs/vercel@11.0.14\r

### Patch Changes

## @astrojs/cloudflare@15.0.0-beta.2
`;

describe('parseReleaseVersions', () => {
	it('reads every package heading, including scoped packages and prereleases', () => {
		assert.deepEqual(parseReleaseVersions(body), [
			{ name: 'astro', version: '7.4.1' },
			{ name: '@astrojs/vercel', version: '11.0.14' },
			{ name: '@astrojs/cloudflare', version: '15.0.0-beta.2' },
		]);
	});

	it('returns no versions for a body without release headings', () => {
		assert.deepEqual(parseReleaseVersions('No releases.'), []);
	});
});

describe('getMainRelease', () => {
	const pullRequest = (versions: { name: string; version: string }[]) => ({
		number: 18459,
		versions,
	});

	it('takes the version of the astro package by its exact name', () => {
		const release = getMainRelease(pullRequest(parseReleaseVersions(body)));
		assert.equal(release.astroVersion, '7.4.1');
	});

	for (const [version, type] of [
		['7.4.1', 'patch'],
		['7.4.0', 'minor'],
		['8.0.0', 'major'],
		['8.0.0-beta.1', 'patch'],
		['7.5.0-alpha.0', 'patch'],
	] as const) {
		it(`reads astro@${version} as a ${type} release`, () => {
			assert.equal(getMainRelease(pullRequest([{ name: 'astro', version }])).type, type);
		});
	}

	it('reads a patch when there is no release PR', () => {
		assert.deepEqual(getMainRelease(), {
			type: 'patch',
			astroVersion: undefined,
			pullRequest: undefined,
		});
	});

	it('reads a patch when astro is not released', () => {
		const release = getMainRelease(pullRequest([{ name: '@astrojs/vercel', version: '11.1.0' }]));
		assert.equal(release.type, 'patch');
		assert.equal(release.astroVersion, undefined);
	});

	it('reads the release type from the astro version, and keeps the PR', () => {
		const minor = pullRequest([{ name: 'astro', version: '7.5.0' }]);
		assert.deepEqual(getMainRelease(minor), {
			type: 'minor',
			astroVersion: '7.5.0',
			pullRequest: minor,
		});
		assert.equal(getMainRelease(pullRequest([{ name: 'astro', version: '8.0.0' }])).type, 'major');
	});
});
