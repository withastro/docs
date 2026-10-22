import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chooseAction, parseEvent } from './cli.ts';

describe('chooseAction', () => {
	it('handles the PR of the event', () => {
		assert.deepEqual(chooseAction({ eventName: 'pull_request_target', eventPullRequest: 7 }), {
			type: 'handle',
			prNumber: 7,
		});
	});

	it('handles the PR passed with --pr', () => {
		assert.deepEqual(chooseAction({ pr: '14580' }), { type: 'handle', prNumber: 14580 });
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

describe('parseEvent', () => {
	const path = '/tmp/event.json';

	it('reads the PR number and the sender of a labeled event', () => {
		const event = {
			action: 'labeled',
			pull_request: { number: 7 },
			sender: { login: 'maintainer' },
		};
		assert.deepEqual(parseEvent(JSON.stringify(event), path), {
			pullRequest: 7,
			sender: 'maintainer',
		});
	});

	it('reads neither from a workflow_dispatch event', () => {
		assert.deepEqual(parseEvent('{"inputs":{}}', path), {
			pullRequest: undefined,
			sender: undefined,
		});
	});

	it('names the file and the field of an unexpected event', () => {
		assert.throws(
			() => parseEvent('not json', path),
			/The event in \/tmp\/event\.json isn't valid JSON/
		);
		assert.throws(() => parseEvent('[]', path), /isn't an object/);
		assert.throws(
			() => parseEvent('{"pull_request":{"number":"7"}}', path),
			/has no number in `pull_request`/
		);
		assert.throws(() => parseEvent('{"sender":{}}', path), /has no login in `sender`/);
	});
});
