import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Readiness } from './readiness.ts';
import type { MainRelease } from './release.ts';
import { decide, getTarget, type Decision, type DocsPullRequest } from './routing.ts';

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

const patch: MainRelease = { type: 'patch', astroVersion: '7.4.1' };

const refusalsOf = (decision: Decision) => (decision.status === 'refuse' ? decision.refusals : []);

describe('decide', () => {
	describe('routes a ready docs PR', () => {
		for (const label of ['patch-release', 'minor-release']) {
			it(`to the main umbrella with ${label}`, () => {
				assert.deepEqual(decide(pr({ labels: [label] }), ready, patch), {
					status: 'join',
					route: {
						target: 'main',
						umbrellaBranch: 'release-queue/main',
						label,
						shouldRetarget: true,
					},
				});
			});
		}

		it('to a prerelease umbrella with major-release', () => {
			const decision = decide(pr({ base: 'cloudflare-next', labels: ['major-release'] }), ready, {
				type: 'major',
				astroVersion: '8.0.0',
			});
			assert.deepEqual(decision, {
				status: 'join',
				route: {
					target: 'cloudflare-next',
					umbrellaBranch: 'release-queue/cloudflare-next',
					label: 'major-release',
					shouldRetarget: true,
				},
			});
		});

		it('to the umbrella it already targets, without retargeting', () => {
			assert.deepEqual(decide(pr({ base: 'release-queue/main' }), ready, patch), {
				status: 'join',
				route: {
					target: 'main',
					umbrellaBranch: 'release-queue/main',
					label: 'patch-release',
					shouldRetarget: false,
				},
			});
		});
	});

	describe('refuses', () => {
		it('a closed PR, and nothing else', () => {
			const decision = decide(pr({ state: 'closed', isDraft: true }), ready, patch);
			assert.deepEqual(decision, { status: 'refuse', refusals: [{ code: 'closed' }] });
		});

		it('an umbrella PR, and nothing else', () => {
			const decision = decide(pr({ head: 'release-queue/main' }), ready, patch);
			assert.deepEqual(decision, { status: 'refuse', refusals: [{ code: 'umbrella' }] });
		});

		it('a draft PR', () => {
			assert.deepEqual(refusalsOf(decide(pr({ isDraft: true }), ready, patch)), [
				{ code: 'draft' },
			]);
		});

		it('a PR without a release label', () => {
			const decision = decide(pr({ labels: ['accepted'] }), ready, patch);
			assert.deepEqual(decision, { status: 'refuse', refusals: [{ code: 'no-release-label' }] });
		});

		it('a PR with several release labels', () => {
			const decision = decide(pr({ labels: ['minor-release', 'patch-release'] }), ready, patch);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'several-release-labels', labels: ['patch-release', 'minor-release'] },
			]);
		});

		it('a major-release PR against main', () => {
			const decision = decide(pr({ labels: ['major-release'] }), ready, patch);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'mismatch', base: 'main', label: 'major-release' },
			]);
		});

		it('a minor-release PR against a prerelease branch', () => {
			const decision = decide(pr({ base: 'v8', labels: ['minor-release'] }), ready, patch);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'mismatch', base: 'v8', label: 'minor-release' },
			]);
		});

		it('a major-release PR against the main umbrella branch', () => {
			const decision = decide(
				pr({ base: 'release-queue/main', labels: ['major-release'] }),
				ready,
				patch
			);
			assert.deepEqual(refusalsOf(decision), [
				{ code: 'mismatch', base: 'release-queue/main', label: 'major-release' },
			]);
		});

		it('a main PR when the next astro release from main is a major', () => {
			const decision = decide(pr(), ready, { type: 'major', astroVersion: '8.0.0' });
			assert.deepEqual(refusalsOf(decision), [{ code: 'major-on-main', astroVersion: '8.0.0' }]);
		});

		it('a PR that is not ready, with every reason', () => {
			const decision = decide(
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
			const decision = decide(pr({ labels: [] }), { ...ready, isApproved: false }, patch);
			assert.deepEqual(decision, {
				status: 'refuse',
				refusals: [{ code: 'no-release-label' }, { code: 'not-approved' }],
			});
		});

		it('a routed PR that is not ready, keeping its route', () => {
			const decision = decide(pr(), { ...ready, isApproved: false }, patch);
			assert.equal(decision.status, 'refuse');
			assert.equal(decision.route?.umbrellaBranch, 'release-queue/main');
		});
	});

	it('lets the merge decide while mergeability is unknown', () => {
		assert.equal(decide(pr(), { ...ready, isMergeable: null }, patch).status, 'join');
	});
});

describe('getTarget', () => {
	it('is the base of a PR against a branch', () => {
		assert.equal(getTarget('main'), 'main');
		assert.equal(getTarget('cloudflare-next'), 'cloudflare-next');
	});

	it('is the base of the umbrella for a PR against an umbrella branch', () => {
		assert.equal(getTarget('release-queue/main'), 'main');
		assert.equal(getTarget('release-queue/cloudflare-next'), 'cloudflare-next');
	});
});
