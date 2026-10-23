import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canActOn, isDryRun, parseMode } from './modes.ts';

describe('parseMode', () => {
	it('defaults to a dry run', () => {
		assert.equal(parseMode(), 'dry-run');
	});

	it('reads a known mode, and refuses an unknown one', () => {
		assert.equal(parseMode('stable-only'), 'stable-only');
		assert.throws(() => parseMode('main'), /Unknown MODE: main\. Expected one of: dry-run/);
	});
});

describe('canActOn', () => {
	it('acts on the stable branch only in stable-only mode', () => {
		assert.equal(canActOn('stable-only', 'main'), true);
		assert.equal(canActOn('stable-only', 'cloudflare-next'), false);
	});

	it('acts on every umbrella base in all mode, and none in a dry run', () => {
		assert.equal(canActOn('all', 'cloudflare-next'), true);
		assert.equal(canActOn('dry-run', 'main'), false);
	});
});

describe('isDryRun', () => {
	it('tells a dry run from the live modes', () => {
		assert.equal(isDryRun('dry-run'), true);
		assert.equal(isDryRun('stable-only'), false);
		assert.equal(isDryRun('all'), false);
	});
});
