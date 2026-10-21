import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chooseAction } from './cli.ts';

describe('chooseAction', () => {
	it('handles the PR of the event', () => {
		assert.deepEqual(chooseAction({ eventName: 'pull_request_target', eventPullRequest: 7 }), {
			type: 'handle',
			number: 7,
		});
	});

	it('handles the PR passed with --pr', () => {
		assert.deepEqual(chooseAction({ pr: '14580' }), { type: 'handle', number: 14580 });
	});

	it('refreshes on a workflow_dispatch, or with --refresh', () => {
		assert.deepEqual(chooseAction({ eventName: 'workflow_dispatch' }), { type: 'refresh' });
		assert.deepEqual(chooseAction({ refresh: true }), { type: 'refresh' });
	});

	it('refuses a missing PR number, instead of refreshing', () => {
		assert.throws(() => chooseAction({}), /^Error: No PR to handle: pass --pr <number>\.$/);
	});

	it('refuses anything but the digits of a PR number', () => {
		for (const pr of ['abc', '1O3', '0', '-3', '7.5', '1e3', '0x10', ' 7 ', '']) {
			assert.throws(() => chooseAction({ pr }), /^Error: Invalid PR number: .*\. Pass --pr/, pr);
		}
	});

	it('refuses --refresh with --pr', () => {
		assert.throws(() => chooseAction({ pr: '7', refresh: true }), /not both/);
	});
});
