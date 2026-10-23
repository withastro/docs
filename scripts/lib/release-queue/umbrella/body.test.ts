import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatUmbrellaBody, parseReleaseMarker } from './body.ts';

describe('formatUmbrellaBody', () => {
	const included = [14580, 14581];

	it('links the release PR of the main umbrella, and lists the included PRs', () => {
		assert.equal(
			formatUmbrellaBody('main', { releasePrNumber: 18459, included }),
			[
				'Ships with withastro/astro#18459. This includes:',
				'',
				'- #14580',
				'- #14581',
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

	it('reads only the marker at the end of the body', () => {
		const body = formatUmbrellaBody('main', { releasePrNumber: 18405, included: [] });
		assert.equal(parseReleaseMarker(`<!-- release-queue:release-pr=1 -->\n${body}`), 18405);
		assert.equal(parseReleaseMarker(`${body}\nEdited after the marker.`), undefined);
	});
});
