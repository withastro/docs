import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getUmbrellaBase } from './branch.ts';

describe('getUmbrellaBase', () => {
	it('is the base of a PR against a branch', () => {
		assert.equal(getUmbrellaBase('main'), 'main');
		assert.equal(getUmbrellaBase('cloudflare-next'), 'cloudflare-next');
	});

	it('is the base of the umbrella for a PR against an umbrella branch', () => {
		assert.equal(getUmbrellaBase('release-queue/main'), 'main');
		assert.equal(getUmbrellaBase('release-queue/cloudflare-next'), 'cloudflare-next');
	});
});
