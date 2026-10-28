import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES } from './config.ts';
import { buildPullRequest, FakeRepository } from './fake-repository.ts';
import { readFrameworkReleases } from './release.ts';

const PRE_MODE_FILE = 'next:.changeset/pre.json';

/** A body shaped like the ones Changesets writes, with one section per released package. */
function buildReleaseBody(...versions: string[]) {
	const sections = versions.map(
		(version) => `## ${version}\n\n### Patch Changes\n\n- [#1](https://example.com) Fixes a bug`
	);
	return `This PR was opened by the Changesets release GitHub action.\n\n# Releases\n\n${sections.join('\n\n')}\n`;
}

function buildStableReleasePullRequest(...versions: string[]) {
	return buildPullRequest({
		number: 100,
		headBranch: 'changeset-release/main',
		body: buildReleaseBody(...versions),
	});
}

function buildPrereleasePullRequest(...versions: string[]) {
	return buildPullRequest({
		number: 200,
		headBranch: 'changeset-release/next',
		body: buildReleaseBody(...versions),
	});
}

async function readStableRelease(...versions: string[]) {
	const framework = new FakeRepository({
		pullRequests: [buildStableReleasePullRequest(...versions)],
	});
	const { stable } = await readFrameworkReleases(framework);
	return stable;
}

describe('readFrameworkReleases', () => {
	describe('stable release', () => {
		it('should read the released packages, in order, and the type of the astro release', async () => {
			const release = await readStableRelease('astro@7.4.1', '@astrojs/node@10.0.1');

			assert.deepEqual(release, {
				prNumber: 100,
				packages: [
					{ name: 'astro', version: '7.4.1' },
					{ name: '@astrojs/node', version: '10.0.1' },
				],
				type: RELEASE_TYPES.patch,
			});
		});

		it('should read a minor or a major release of astro', async () => {
			assert.equal((await readStableRelease('astro@7.5.0'))?.type, RELEASE_TYPES.minor);
			assert.equal((await readStableRelease('astro@8.0.0'))?.type, RELEASE_TYPES.major);
		});

		it('should read a release without astro as a patch release', async () => {
			const release = await readStableRelease('@astrojs/vercel@11.0.14');

			assert.equal(release?.type, RELEASE_TYPES.patch);
		});

		it('should not mistake another package ending with "astro" for astro', async () => {
			const release = await readStableRelease('create-astro@5.0.0');

			assert.equal(release?.type, RELEASE_TYPES.patch);
		});

		it('should return null between releases', async () => {
			const framework = new FakeRepository({ pullRequests: [buildPrereleasePullRequest()] });

			const { stable } = await readFrameworkReleases(framework);

			assert.equal(stable, null);
		});
	});

	describe('prerelease', () => {
		it('should read the release of the prerelease line in pre mode', async () => {
			const framework = new FakeRepository({
				pullRequests: [
					buildStableReleasePullRequest('astro@7.4.1'),
					buildPrereleasePullRequest('@astrojs/cloudflare@15.0.0-beta.2'),
				],
				files: { [PRE_MODE_FILE]: '{ "mode": "pre", "tag": "beta" }' },
			});

			const { prerelease } = await readFrameworkReleases(framework);

			assert.equal(prerelease?.prNumber, 200);
			assert.deepEqual(prerelease?.packages, [
				{ name: '@astrojs/cloudflare', version: '15.0.0-beta.2' },
			]);
		});

		it('should read the stable release once the prerelease line left pre mode', async () => {
			const framework = new FakeRepository({
				pullRequests: [buildStableReleasePullRequest('astro@8.0.0')],
				files: { [PRE_MODE_FILE]: '{ "mode": "exit", "tag": "beta" }' },
			});

			const { prerelease } = await readFrameworkReleases(framework);

			assert.equal(prerelease?.prNumber, 100);
		});

		it('should read the stable release without a pre mode file', async () => {
			const framework = new FakeRepository({
				pullRequests: [buildStableReleasePullRequest('astro@8.0.0')],
			});

			const { prerelease } = await readFrameworkReleases(framework);

			assert.equal(prerelease?.prNumber, 100);
		});

		it('should throw when the pre mode file is not valid JSON', async () => {
			const framework = new FakeRepository({ files: { [PRE_MODE_FILE]: '{ "mode": ' } });

			await assert.rejects(readFrameworkReleases(framework), /\.changeset\/pre\.json/);
		});

		it('should throw when the pre mode file has no mode', async () => {
			const framework = new FakeRepository({ files: { [PRE_MODE_FILE]: '{ "tag": "beta" }' } });

			await assert.rejects(
				readFrameworkReleases(framework),
				(error) =>
					error instanceof Error && String(error.cause).includes('`mode` should be a string')
			);
		});
	});
});
