import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Readiness } from './readiness.ts';
import {
	decideJoin,
	getUmbrellaBase,
	type DecisionContext,
	type Decision,
	type DocsPullRequest,
	wouldRetargetFromStable,
} from './routing.ts';

const pr = (overrides: Partial<DocsPullRequest> = {}): DocsPullRequest => ({
	state: 'open',
	isDraft: false,
	base: 'main',
	head: 'feat/docs',
	labels: ['accepted', 'patch-release'],
	...overrides,
});

const ready: Readiness = {
	isApproved: true,
	changesRequestedBy: [],
	failingChecks: [],
	pendingChecks: [],
	missingChecks: [],
	isMergeable: true,
};

const patch: DecisionContext = { release: { type: 'patch', frameworkVersion: '7.4.1' } };
const major: DecisionContext = { release: { type: 'major', frameworkVersion: '8.0.0' } };
/** The `main` umbrella #42 ships with a merged release PR. */
const settled: DecisionContext = {
	...patch,
	settledStableUmbrella: { number: 42, releasePrNumber: 18405 },
};

const refusalsOf = (decision: Decision) => (decision.status === 'refuse' ? decision.refusals : []);

describe('decideJoin', () => {
	describe('routes a ready docs PR', () => {
		for (const label of ['patch-release', 'minor-release']) {
			it(`to the main umbrella with ${label}`, () => {
				assert.deepEqual(decideJoin(pr({ labels: [label] }), ready, patch), {
					status: 'join',
					route: {
						umbrellaBase: 'main',
						umbrellaBranch: 'release-queue/main',
						label,
						shouldRetarget: true,
					},
				});
			});
		}

		it('to a prerelease umbrella with major-release', () => {
			const decision = decideJoin(
				pr({ base: 'cloudflare-next', labels: ['major-release'] }),
				ready,
				major
			);
			assert.deepEqual(decision, {
				status: 'join',
				route: {
					umbrellaBase: 'cloudflare-next',
					umbrellaBranch: 'release-queue/cloudflare-next',
					label: 'major-release',
					shouldRetarget: true,
				},
			});
		});

		it('to the umbrella it already targets, without retargeting', () => {
			assert.deepEqual(decideJoin(pr({ base: 'release-queue/main' }), ready, patch), {
				status: 'join',
				route: {
					umbrellaBase: 'main',
					umbrellaBranch: 'release-queue/main',
					label: 'patch-release',
					shouldRetarget: false,
				},
			});
		});
	});

	describe('refuses', () => {
		it('a closed PR, and nothing else', () => {
			const decision = decideJoin(pr({ state: 'closed', isDraft: true }), ready, patch);
			assert.deepEqual(decision, { status: 'refuse', refusals: [{ code: 'closed' }] });
		});

		it('an umbrella PR, and nothing else', () => {
			const decision = decideJoin(pr({ head: 'release-queue/main' }), ready, patch);
			assert.deepEqual(decision, { status: 'refuse', refusals: [{ code: 'umbrella' }] });
		});

		it('a draft PR', () => {
			assert.deepEqual(refusalsOf(decideJoin(pr({ isDraft: true }), ready, patch)), [
				{ code: 'draft' },
			]);
		});

		it('a PR without a release label', () => {
			const decision = decideJoin(pr({ labels: ['accepted'] }), ready, patch);
			assert.deepEqual(decision, { status: 'refuse', refusals: [{ code: 'no-release-label' }] });
		});

		it('a PR with several release labels', () => {
			const decision = decideJoin(pr({ labels: ['minor-release', 'patch-release'] }), ready, patch);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'several-release-labels', labels: ['patch-release', 'minor-release'] },
			]);
		});

		it('a major-release PR against main', () => {
			const decision = decideJoin(pr({ labels: ['major-release'] }), ready, patch);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'mismatch', base: 'main', label: 'major-release' },
			]);
		});

		it('a minor-release PR against a prerelease branch', () => {
			const decision = decideJoin(pr({ base: 'v8', labels: ['minor-release'] }), ready, patch);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'mismatch', base: 'v8', label: 'minor-release' },
			]);
		});

		it('a major-release PR against the main umbrella branch', () => {
			const decision = decideJoin(
				pr({ base: 'release-queue/main', labels: ['major-release'] }),
				ready,
				patch
			);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'mismatch', base: 'release-queue/main', label: 'major-release' },
			]);
		});

		it('a main PR when the next astro release from main is a major', () => {
			const decision = decideJoin(pr(), ready, major);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'major-on-stable', frameworkVersion: '8.0.0' },
			]);
		});

		it('a PR that is not ready, with every reason', () => {
			const decision = decideJoin(
				pr(),
				{
					isApproved: false,
					changesRequestedBy: ['alice'],
					failingChecks: ['links'],
					pendingChecks: ['check'],
					missingChecks: ['zizmor'],
					isMergeable: false,
				},
				patch
			);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'not-approved' },
				{ code: 'changes-requested', reviewers: ['alice'] },
				{ code: 'failing-checks', checks: ['links'] },
				{ code: 'pending-checks', checks: ['check'] },
				{ code: 'missing-checks', checks: ['zizmor'] },
				{ code: 'conflict' },
			]);
		});

		it('a PR with both a routing and a readiness problem, with both reasons', () => {
			const decision = decideJoin(pr({ labels: [] }), { ...ready, isApproved: false }, patch);
			assert.deepEqual(decision, {
				status: 'refuse',
				refusals: [{ code: 'no-release-label' }, { code: 'not-approved' }],
			});
		});

		it('a main PR while the main umbrella is settled', () => {
			assert.deepEqual(refusalsOf(decideJoin(pr(), ready, settled)), [
				{ code: 'settled-umbrella', number: 42, releasePrNumber: 18405 },
			]);
		});

		it('a routed PR that is not ready, keeping its route', () => {
			const decision = decideJoin(pr(), { ...ready, isApproved: false }, patch);
			assert.equal(decision.status, 'refuse');
			assert.equal(decision.route?.umbrellaBranch, 'release-queue/main');
		});
	});

	it('routes a PR against the settled umbrella branch, which says where it belongs', () => {
		assert.equal(decideJoin(pr({ base: 'release-queue/main' }), ready, settled).status, 'join');
	});

	it('routes a prerelease PR while the main umbrella is settled', () => {
		const prerelease = pr({ base: 'cloudflare-next', labels: ['major-release'] });
		assert.equal(decideJoin(prerelease, ready, settled).status, 'join');
	});

	it('lets the merge decide while mergeability is unknown', () => {
		assert.equal(decideJoin(pr(), { ...ready, isMergeable: null }, patch).status, 'join');
	});
});

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

describe('wouldRetargetFromStable', () => {
	it('applies to an open PR against main', () => {
		assert.equal(wouldRetargetFromStable(pr()), true);
	});

	it("doesn't apply to a PR against the umbrella branch, a prerelease, or a closed PR", () => {
		assert.equal(wouldRetargetFromStable(pr({ base: 'release-queue/main' })), false);
		assert.equal(wouldRetargetFromStable(pr({ base: 'cloudflare-next' })), false);
		assert.equal(wouldRetargetFromStable(pr({ state: 'closed' })), false);
	});
});
