import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CHECK_STATES, toChecks } from './checks.ts';

function checkRun(name: string, status: string, conclusion: string | null) {
	return { name, status, conclusion };
}

const noStatuses = { total_count: 0, statuses: [] };

describe('toChecks', () => {
	it('should reduce the check runs, then the commit statuses, to their outcome', () => {
		const checkRunList = {
			total_count: 4,
			check_runs: [
				checkRun('build', 'completed', 'success'),
				checkRun('lint', 'completed', 'skipped'),
				checkRun('test', 'completed', 'failure'),
				checkRun('deploy', 'in_progress', null),
			],
		};
		const combinedStatus = {
			total_count: 3,
			statuses: [
				{ context: 'preview', state: 'success' as const },
				{ context: 'license', state: 'error' as const },
				{ context: 'review', state: 'pending' as const },
			],
		};

		const checks = toChecks(checkRunList, combinedStatus);

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

	it('should count a conclusion GitHub adds later as a failure', () => {
		const checkRunList = { total_count: 1, check_runs: [checkRun('build', 'completed', 'new')] };

		const checks = toChecks(checkRunList, noStatuses);

		assert.deepEqual(checks, [{ name: 'build', state: CHECK_STATES.failure }]);
	});
});
