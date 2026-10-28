import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES } from './config.ts';
import { buildPullRequest, FakeRepository } from './fake-repository.ts';
import { readStableRelease } from './release.ts';

/** A body shaped like the ones Changesets writes, with one section per released package. */
function buildReleaseBody(...versions: string[]) {
	const sections = versions.map(
		(version) => `## ${version}\n\n### Patch Changes\n\n- [#1](https://example.com) Fixes a bug`
	);
	return `This PR was opened by the Changesets release GitHub action.\n\n# Releases\n\n${sections.join('\n\n')}\n`;
}

function buildReleasePullRequest(body: string, headBranch = 'changeset-release/main') {
	return buildPullRequest({ number: 100, headBranch, body });
}

async function readStableReleaseOf(...pullRequests: ReturnType<typeof buildPullRequest>[]) {
	return readStableRelease(new FakeRepository({ pullRequests }));
}

describe('readStableRelease', () => {
	it('should read a patch release of astro', async () => {
		const release = await readStableReleaseOf(
			buildReleasePullRequest(buildReleaseBody('@astrojs/node@10.0.1', 'astro@7.4.1'))
		);

		assert.deepEqual(release, {
			prNumber: 100,
			astroVersion: '7.4.1',
			type: RELEASE_TYPES.patch,
		});
	});

	it('should read a minor release of astro', async () => {
		const release = await readStableReleaseOf(
			buildReleasePullRequest(buildReleaseBody('astro@7.5.0'))
		);

		assert.equal(release?.type, RELEASE_TYPES.minor);
	});

	it('should read a major release of astro', async () => {
		const release = await readStableReleaseOf(
			buildReleasePullRequest(buildReleaseBody('astro@8.0.0'))
		);

		assert.equal(release?.type, RELEASE_TYPES.major);
	});

	it('should read a release without astro as a patch release', async () => {
		const release = await readStableReleaseOf(
			buildReleasePullRequest(buildReleaseBody('@astrojs/vercel@11.0.14'))
		);

		assert.deepEqual(release, { prNumber: 100, astroVersion: null, type: RELEASE_TYPES.patch });
	});

	it('should not mistake another package ending with "astro" for astro', async () => {
		const release = await readStableReleaseOf(
			buildReleasePullRequest(buildReleaseBody('create-astro@5.0.0'))
		);

		assert.equal(release?.astroVersion, null);
	});

	it('should ignore the release PR of the prerelease branch', async () => {
		const release = await readStableReleaseOf(
			buildReleasePullRequest(buildReleaseBody('astro@8.0.0-beta.1'), 'changeset-release/next')
		);

		assert.equal(release, null);
	});

	it('should return null between releases', async () => {
		assert.equal(await readStableReleaseOf(buildPullRequest({ number: 1 })), null);
	});
});
