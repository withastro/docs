import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getUmbrellaTitle } from './umbrella.ts';

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
