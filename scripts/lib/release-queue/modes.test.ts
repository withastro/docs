import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isLiveFor, needsBotToken, parseMode } from './modes.ts';

describe('parseMode', () => {
	it('defaults to a dry run', () => {
		assert.equal(parseMode(), 'dry-run');
	});

	it('reads a known mode, and refuses an unknown one', () => {
		assert.equal(parseMode('main-only'), 'main-only');
		assert.throws(() => parseMode('main'), /Unknown MODE: main\. Expected one of: dry-run/);
	});
});

describe('isLiveFor', () => {
	it('acts on main only in main-only mode', () => {
		assert.equal(isLiveFor('main-only', 'main'), true);
		assert.equal(isLiveFor('main-only', 'cloudflare-next'), false);
	});

	it('acts on every target in all mode, and none in a dry run', () => {
		assert.equal(isLiveFor('all', 'cloudflare-next'), true);
		assert.equal(isLiveFor('dry-run', 'main'), false);
	});
});

describe('needsBotToken', () => {
	it('is required to write in a live mode', () => {
		assert.equal(needsBotToken('main-only', true), true);
		assert.equal(needsBotToken('all', true), true);
	});

	it('is not required in a dry run, or when writes are only printed', () => {
		assert.equal(needsBotToken('dry-run', true), false);
		assert.equal(needsBotToken('all', false), false);
	});
});
