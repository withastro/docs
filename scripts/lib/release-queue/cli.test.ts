import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chooseAction, parseEvent } from './cli.ts';

describe('chooseAction', () => {
	it('handles the PR of the event', () => {
		const action = chooseAction({
			eventName: 'pull_request_target',
			eventPullRequest: 7,
			eventSender: 'maintainer',
		});
		assert.deepEqual(action, { type: 'handle', prNumber: 7, labelSender: 'maintainer' });
	});

	it('handles the PR passed with --pr, labeled by --sender', () => {
		assert.deepEqual(chooseAction({ pr: '14580', sender: 'maintainer' }), {
			type: 'handle',
			prNumber: 14580,
			labelSender: 'maintainer',
		});
	});

	it('handles a PR without a sender in a local run', () => {
		assert.deepEqual(chooseAction({ pr: '14580' }), {
			type: 'handle',
			prNumber: 14580,
			labelSender: undefined,
		});
	});

	it('refuses a PR without a sender when the write access check must run', () => {
		assert.throws(
			() => chooseAction({ eventPullRequest: 7, isSenderRequired: true }),
			/^Error: The event has no sender: the write access check needs one\.$/
		);
	});

	it('refreshes on a workflow_dispatch, or with --preview-refresh', () => {
		assert.deepEqual(chooseAction({ eventName: 'workflow_dispatch' }), { type: 'refresh' });
		assert.deepEqual(chooseAction({ isRefreshRequested: true }), { type: 'refresh' });
	});

	it('refuses a missing PR number, instead of refreshing', () => {
		assert.throws(() => chooseAction({}), /^Error: No PR to handle: pass --pr <number>\.$/);
	});

	it('refuses anything but the digits of a PR number', () => {
		for (const pr of ['abc', '1O3', '0', '-3', '7.5', '1e3', '0x10', ' 7 ', '']) {
			assert.throws(() => chooseAction({ pr }), /^Error: Invalid PR number: .*\. Pass --pr/, pr);
		}
	});

	it('refuses --preview-refresh with --pr', () => {
		assert.throws(() => chooseAction({ pr: '7', isRefreshRequested: true }), /not both/);
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
			labelSender: 'maintainer',
		});
	});

	it('reads neither from a workflow_dispatch event', () => {
		assert.deepEqual(parseEvent('{"inputs":{}}', path), {
			pullRequest: undefined,
			labelSender: undefined,
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
