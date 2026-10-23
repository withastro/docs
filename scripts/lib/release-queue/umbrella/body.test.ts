import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatUmbrellaBody, parseIncludedPullRequests, parseReleaseMarker } from './body.ts';

describe('parseIncludedPullRequests', () => {
	it('reads the PR of each squash commit, in commit order', () => {
		const included = parseIncludedPullRequests([
			'Document the new option (#7)',
			"Merge branch 'main' into release-queue/main",
			'Fix (a typo) in the guide (#3)',
			'Revert the option (#12) (#15)',
		]);
		assert.deepEqual(included, [
			{ number: 7, title: 'Document the new option' },
			{ number: 3, title: 'Fix (a typo) in the guide' },
			{ number: 15, title: 'Revert the option (#12)' },
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
			formatUmbrellaBody('main', { releasePrNumber: 18459, included }),
			[
				'Ships with withastro/astro#18459. This includes:',
				'',
				'- Document remote image fetch retries (#14580)',
				'- Fix a typo (#14581)',
				'',
				'<sub>Managed by the release queue: the bot rewrites this description after each join and each manual run.</sub>',
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
		const body = formatUmbrellaBody('cloudflare-next', { releasePrNumber: 18269, included });
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
			formatUmbrellaBody('main', { releasePrNumber: 18459, included: [] }),
			/^Ships with withastro\/astro#18459\. No docs PR is included yet\.\n\n<sub>/
		);
	});
});

describe('parseReleaseMarker', () => {
	it('reads the release PR from the body the bot wrote', () => {
		const body = formatUmbrellaBody('main', { releasePrNumber: 18405, included: [] });
		assert.equal(parseReleaseMarker(body), 18405);
	});

	it('finds no release PR in a body without a marker', () => {
		assert.equal(parseReleaseMarker('Release umbrella for `main`.'), undefined);
	});

	describe('ignores a marker in the title of an included PR', () => {
		const included = [{ number: 7, title: 'Fix <!-- release-queue:release-pr=1 -->' }];

		it('when the umbrella links a release PR', () => {
			const body = formatUmbrellaBody('main', { releasePrNumber: 18405, included });
			assert.equal(parseReleaseMarker(body), 18405);
		});

		it("when the umbrella doesn't link one", () => {
			assert.equal(parseReleaseMarker(formatUmbrellaBody('main', { included })), undefined);
		});
	});
});
