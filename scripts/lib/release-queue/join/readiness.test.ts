import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	classifyChecks,
	classifyReviewers,
	getLatestReviewStates,
	readCheckRun,
	readCommitStatus,
} from './readiness.ts';

describe('getLatestReviewStates', () => {
	it('keeps the latest approval or change request of each reviewer', () => {
		const states = getLatestReviewStates([
			{ user: 'alice', state: 'CHANGES_REQUESTED' },
			{ user: 'bob', state: 'APPROVED' },
			{ user: 'alice', state: 'APPROVED' },
			{ user: 'bob', state: 'CHANGES_REQUESTED' },
		]);
		assert.deepEqual(Object.fromEntries(states), { alice: 'APPROVED', bob: 'CHANGES_REQUESTED' });
	});

	it('ignores comments after an approval', () => {
		const states = getLatestReviewStates([
			{ user: 'alice', state: 'APPROVED' },
			{ user: 'alice', state: 'COMMENTED' },
		]);
		assert.deepEqual(Object.fromEntries(states), { alice: 'APPROVED' });
	});

	it('ignores a dismissed review', () => {
		const states = getLatestReviewStates([{ user: 'alice', state: 'DISMISSED' }]);
		assert.equal(states.size, 0);
	});

	it("doesn't count an earlier review again after a dismissal", () => {
		const states = getLatestReviewStates([
			{ user: 'alice', state: 'APPROVED' },
			{ user: 'alice', state: 'DISMISSED' },
		]);
		assert.equal(states.size, 0);
	});
});

describe('classifyReviewers', () => {
	it('counts the approval of a reviewer with write access', () => {
		const states = new Map([['alice', 'APPROVED' as const]]);
		assert.deepEqual(classifyReviewers(states, new Set(['alice'])), {
			isApproved: true,
			changesRequestedBy: [],
		});
	});

	it("doesn't count the approval of a reviewer without write access", () => {
		const states = new Map([['bob', 'APPROVED' as const]]);
		assert.deepEqual(classifyReviewers(states, new Set()), {
			isApproved: false,
			changesRequestedBy: [],
		});
	});

	it('lists change requests from reviewers with write access only', () => {
		const states = new Map([
			['alice', 'CHANGES_REQUESTED' as const],
			['bob', 'CHANGES_REQUESTED' as const],
			['carol', 'APPROVED' as const],
		]);
		assert.deepEqual(classifyReviewers(states, new Set(['alice', 'carol'])), {
			isApproved: true,
			changesRequestedBy: ['alice'],
		});
	});
});

describe('readCheckRun', () => {
	it('passes a successful, neutral or skipped run', () => {
		for (const conclusion of ['success', 'neutral', 'skipped'] as const) {
			const check = readCheckRun({ name: 'eslint', status: 'completed', conclusion });
			assert.deepEqual(check, { name: 'eslint', state: 'passing' });
		}
	});

	it('fails a completed run with any other conclusion, or none', () => {
		for (const conclusion of ['failure', 'cancelled', 'timed_out', null] as const) {
			const check = readCheckRun({ name: 'links', status: 'completed', conclusion });
			assert.deepEqual(check, { name: 'links', state: 'failing' });
		}
	});

	it('keeps an unfinished run pending', () => {
		const check = readCheckRun({ name: 'check', status: 'in_progress', conclusion: null });
		assert.deepEqual(check, { name: 'check', state: 'pending' });
	});
});

describe('readCommitStatus', () => {
	it('reads a status by its context', () => {
		assert.deepEqual(readCommitStatus({ context: 'deploy', state: 'pending' }), {
			name: 'deploy',
			state: 'pending',
		});
		assert.deepEqual(readCommitStatus({ context: 'deploy', state: 'success' }), {
			name: 'deploy',
			state: 'passing',
		});
	});

	it('fails an error, like a failure', () => {
		for (const state of ['error', 'failure'] as const) {
			assert.equal(readCommitStatus({ context: 'external', state }).state, 'failing');
		}
	});
});

describe('classifyChecks', () => {
	const required = ['eslint', 'links', 'check', 'deploy', 'external'];

	it('lists the failing and pending required checks', () => {
		const checks = classifyChecks(required, [
			{ name: 'eslint', state: 'passing' },
			{ name: 'links', state: 'failing' },
			{ name: 'check', state: 'pending' },
			{ name: 'deploy', state: 'pending' },
			{ name: 'external', state: 'failing' },
		]);
		assert.deepEqual(checks, {
			failingChecks: ['links', 'external'],
			pendingChecks: ['check', 'deploy'],
			missingChecks: [],
		});
	});

	it('ignores checks that are not required', () => {
		const checks = classifyChecks(
			['eslint'],
			[
				{ name: 'eslint', state: 'passing' },
				{ name: 'triage', state: 'pending' },
				{ name: 'Generate Lunaria Overview', state: 'failing' },
			]
		);
		assert.deepEqual(checks, { failingChecks: [], pendingChecks: [], missingChecks: [] });
	});

	it('lists required checks that are not reported', () => {
		assert.deepEqual(classifyChecks(['eslint'], []), {
			failingChecks: [],
			pendingChecks: [],
			missingChecks: ['eslint'],
		});
	});

	it('accepts a commit when no check is required', () => {
		assert.deepEqual(classifyChecks([], []), {
			failingChecks: [],
			pendingChecks: [],
			missingChecks: [],
		});
	});
});
