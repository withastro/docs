import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getMainRelease } from './release.ts';
import {
	getKeptLabelChanges,
	getLabelChanges,
	getUmbrellaBody,
	getUmbrellaHeading,
	parseReleaseMarker,
	selectIncludedPullRequests,
} from './umbrella.ts';

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

describe('selectIncludedPullRequests', () => {
	it('keeps the PRs whose squash commit is on the branch, in commit order', () => {
		const included = selectIncludedPullRequests(
			[
				{ number: 3, title: 'Third', mergeCommitSha: 'c' },
				{ number: 1, title: 'First', mergeCommitSha: 'a' },
				{ number: 9, title: 'From an earlier release', mergeCommitSha: 'old' },
				{ number: 5, title: 'Closed without merging', mergeCommitSha: null },
			],
			['a', 'main-merge', 'c']
		);
		assert.deepEqual(included, [
			{ number: 1, title: 'First' },
			{ number: 3, title: 'Third' },
		]);
	});
});

describe('getUmbrellaBody', () => {
	const included = [
		{ number: 14580, title: 'Document remote image fetch retries' },
		{ number: 14581, title: 'Fix a typo' },
	];

	it('links the release PR of the main umbrella, and lists the included PRs', () => {
		assert.equal(
			getUmbrellaBody('main', { releasePullRequest: 18459, included }),
			[
				'Ships with withastro/astro#18459. This includes:',
				'',
				'- Document remote image fetch retries (#14580)',
				'- Fix a typo (#14581)',
				'',
				'<sub>Managed by the release queue: the bot rewrites this description after each join.</sub>',
				'<!-- release-queue:release-pr=18459 -->',
			].join('\n')
		);
	});

	it('says when no release PR is linked, without a marker', () => {
		const body = getUmbrellaBody('main', { included });
		assert.match(
			body,
			/^Ships with the next release of `withastro\/astro`, once its `\[ci\] release` PR is open\. This includes:/
		);
		assert.equal(parseReleaseMarker(body), undefined);
	});

	it('links the release PR of a prerelease umbrella, with a marker', () => {
		const body = getUmbrellaBody('cloudflare-next', { releasePullRequest: 18269, included });
		assert.match(body, /^Ships with withastro\/astro#18269\. This includes:/);
		assert.equal(parseReleaseMarker(body), 18269);
	});

	it('says when no prerelease PR is open', () => {
		assert.match(
			getUmbrellaBody('cloudflare-next', { included }),
			/^Ships with the next prerelease of `withastro\/astro`, once its `\[ci\] release` PR is open\. This includes:/
		);
	});

	it('says when no PR is included yet', () => {
		assert.match(
			getUmbrellaBody('main', { releasePullRequest: 18459, included: [] }),
			/^Ships with withastro\/astro#18459\. No docs PR is included yet\.\n\n<sub>/
		);
	});
});

describe('parseReleaseMarker', () => {
	it('reads the release PR from the body the bot wrote', () => {
		const body = getUmbrellaBody('main', { releasePullRequest: 18405, included: [] });
		assert.equal(parseReleaseMarker(body), 18405);
	});

	it('finds no release PR in a body without a marker', () => {
		assert.equal(parseReleaseMarker('Release umbrella for `main`.'), undefined);
	});
});

describe('getLabelChanges', () => {
	it('adds merge-on-release and the release label', () => {
		assert.deepEqual(getLabelChanges(['i18n'], 'patch-release'), {
			toAdd: ['merge-on-release', 'patch-release'],
			toRemove: [],
		});
	});

	it('replaces another release label, and keeps the other labels', () => {
		assert.deepEqual(
			getLabelChanges(['merge-on-release', 'patch-release', 'i18n'], 'minor-release'),
			{ toAdd: ['minor-release'], toRemove: ['patch-release'] }
		);
	});

	it('changes nothing on an up-to-date umbrella', () => {
		assert.deepEqual(getLabelChanges(['merge-on-release', 'minor-release'], 'minor-release'), {
			toAdd: [],
			toRemove: [],
		});
	});
});

describe('getKeptLabelChanges', () => {
	it('keeps the release label an umbrella has', () => {
		assert.deepEqual(getKeptLabelChanges(['merge-on-release', 'minor-release']), {
			toAdd: [],
			toRemove: [],
		});
	});

	it('gives a new umbrella merge-on-release and the fallback release label', () => {
		assert.deepEqual(getKeptLabelChanges(['i18n']), {
			toAdd: ['merge-on-release', 'patch-release'],
			toRemove: [],
		});
	});
});
