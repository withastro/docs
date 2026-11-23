import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CHECK_STATES, toChecks } from './checks.ts';

function checkRun(name: string, status: string, conclusion: string | null) {
	return { name, status, conclusion };
}

describe('toChecks', () => {
	it('should reduce the check runs, then the commit statuses, to their outcome', () => {
		const checkRuns = [
			checkRun('build', 'completed', 'success'),
			checkRun('lint', 'completed', 'skipped'),
			checkRun('test', 'completed', 'failure'),
			checkRun('deploy', 'in_progress', null),
		];
		const statuses = [
			{ context: 'preview', state: 'success' },
			{ context: 'license', state: 'error' },
			{ context: 'review', state: 'pending' },
		];

		const checks = toChecks(checkRuns, statuses, []);

		assert.deepEqual(checks, [
			{ name: 'build', state: CHECK_STATES.success },
			{ name: 'lint', state: CHECK_STATES.success },
			{ name: 'test', state: CHECK_STATES.failure },
			{ name: 'deploy', state: CHECK_STATES.pending },
			{ name: 'preview', state: CHECK_STATES.success },
			{ name: 'license', state: CHECK_STATES.failure },
			{ name: 'review', state: CHECK_STATES.pending },
		]);
	});

	it('should count a conclusion or a state GitHub adds later as a failure', () => {
		const checks = toChecks(
			[checkRun('build', 'completed', 'new')],
			[{ context: 'preview', state: 'new' }],
			[]
		);

		assert.deepEqual(checks, [
			{ name: 'build', state: CHECK_STATES.failure },
			{ name: 'preview', state: CHECK_STATES.failure },
		]);
	});

	it('should count each workflow run waiting for approval, named after its workflow', () => {
		const waitingRuns = [
			{ name: 'CI', path: '.github/workflows/ci.yml' },
			{ name: null, path: '.github/workflows/deploy.yml' },
		];

		const checks = toChecks([], [], waitingRuns);

		assert.deepEqual(checks, [
			{ name: 'CI', state: CHECK_STATES.awaitingApproval },
			{ name: '.github/workflows/deploy.yml', state: CHECK_STATES.awaitingApproval },
		]);
	});
});
