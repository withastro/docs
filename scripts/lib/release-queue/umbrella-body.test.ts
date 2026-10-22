import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	formatUmbrellaBody,
	parseReleaseMarker,
	selectIncludedPullRequests,
} from './umbrella-body.ts';

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

describe('formatUmbrellaBody', () => {
	const included = [
		{ number: 14580, title: 'Document remote image fetch retries' },
		{ number: 14581, title: 'Fix a typo' },
	];

	it('links the release PR of the main umbrella, and lists the included PRs', () => {
		assert.equal(
			formatUmbrellaBody('main', { releasePullRequest: 18459, included }),
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
		const body = formatUmbrellaBody('main', { included });
		assert.match(
			body,
			/^Ships with the next release of `withastro\/astro`, once its `\[ci\] release` PR is open\. This includes:/
		);
		assert.equal(parseReleaseMarker(body), undefined);
	});

	it('links the release PR of a prerelease umbrella, with a marker', () => {
		const body = formatUmbrellaBody('cloudflare-next', { releasePullRequest: 18269, included });
		assert.match(body, /^Ships with withastro\/astro#18269\. This includes:/);
		assert.equal(parseReleaseMarker(body), 18269);
	});

	it('says when no prerelease PR is open', () => {
		assert.match(
			formatUmbrellaBody('cloudflare-next', { included }),
			/^Ships with the next prerelease of `withastro\/astro`, once its `\[ci\] release` PR is open\. This includes:/
		);
	});

	it('says when no PR is included yet', () => {
		assert.match(
			formatUmbrellaBody('main', { releasePullRequest: 18459, included: [] }),
			/^Ships with withastro\/astro#18459\. No docs PR is included yet\.\n\n<sub>/
		);
	});
});

describe('parseReleaseMarker', () => {
	it('reads the release PR from the body the bot wrote', () => {
		const body = formatUmbrellaBody('main', { releasePullRequest: 18405, included: [] });
		assert.equal(parseReleaseMarker(body), 18405);
	});

	it('finds no release PR in a body without a marker', () => {
		assert.equal(parseReleaseMarker('Release umbrella for `main`.'), undefined);
	});
});
