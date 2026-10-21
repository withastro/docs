import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getLatestReviewStates, summarizeChecks, summarizeReviews } from './readiness.ts';

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

describe('summarizeReviews', () => {
	it('counts the approval of a reviewer with write access', () => {
		const states = new Map([['alice', 'APPROVED' as const]]);
		assert.deepEqual(summarizeReviews(states, new Set(['alice'])), {
			isApproved: true,
			changesRequestedBy: [],
		});
	});

	it("doesn't count the approval of a reviewer without write access", () => {
		const states = new Map([['bob', 'APPROVED' as const]]);
		assert.deepEqual(summarizeReviews(states, new Set()), {
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
		assert.deepEqual(summarizeReviews(states, new Set(['alice', 'carol'])), {
			isApproved: true,
			changesRequestedBy: ['alice'],
		});
	});
});

describe('summarizeChecks', () => {
	const required = ['eslint', 'lint-ja', 'links', 'check', 'deploy', 'external', 'zizmor'];

	it('lists unfinished and unsuccessful required check runs and statuses', () => {
		const summary = summarizeChecks(
			required,
			[
				{ name: 'eslint', status: 'completed', conclusion: 'success' },
				{ name: 'lint-ja', status: 'completed', conclusion: 'skipped' },
				{ name: 'links', status: 'completed', conclusion: 'failure' },
				{ name: 'check', status: 'in_progress', conclusion: null },
				{ name: 'zizmor', status: 'completed', conclusion: 'neutral' },
			],
			[
				{ context: 'deploy', state: 'pending' },
				{ context: 'external', state: 'error' },
			]
		);
		assert.deepEqual(summary, {
			failing: ['links', 'external'],
			pending: ['check', 'deploy'],
			missing: [],
		});
	});

	it('ignores checks that are not required', () => {
		const summary = summarizeChecks(
			['eslint'],
			[
				{ name: 'eslint', status: 'completed', conclusion: 'success' },
				{ name: 'triage', status: 'in_progress', conclusion: null },
				{ name: 'Generate Lunaria Overview', status: 'completed', conclusion: 'failure' },
			],
			[]
		);
		assert.deepEqual(summary, { failing: [], pending: [], missing: [] });
	});

	it('lists required checks that are not reported', () => {
		assert.deepEqual(summarizeChecks(['eslint'], [], []), {
			failing: [],
			pending: [],
			missing: ['eslint'],
		});
	});

	it('accepts a commit when no check is required', () => {
		assert.deepEqual(summarizeChecks([], [], []), { failing: [], pending: [], missing: [] });
	});
});
