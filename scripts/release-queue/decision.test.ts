import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES, type ReleaseType } from './config.ts';
import { decideJoin, OUTCOMES, REFUSAL_REASONS } from './decision.ts';
import { buildPullRequest } from './fake-repository.ts';
import type { Readiness } from './readiness.ts';

const READY: Readiness = {
	isDraft: false,
	isApprovedByMaintainer: true,
	hasChangesRequestedByMaintainer: false,
	isMergeable: true,
	hasFailingChecks: false,
	hasPendingChecks: false,
};

type RoutingStateFixture = {
	stableReleaseType?: ReleaseType;
	settledBaseBranches?: string[];
	readiness?: Readiness;
};

/** Decides for a PR ready to merge, unless the fixture says otherwise. */
function route(
	baseBranch: string,
	labels: string[],
	{ stableReleaseType, settledBaseBranches = [], readiness = READY }: RoutingStateFixture = {}
) {
	const stable = stableReleaseType ? { type: stableReleaseType } : null;
	return decideJoin(buildPullRequest({ baseBranch, labels }), {
		state: { releases: { stable }, settledBaseBranches },
		readiness,
	});
}

describe('decideJoin', () => {
	it('should route a patch or minor PR based on main to the main umbrella', () => {
		const expected = {
			outcome: OUTCOMES.join,
			branches: { head: 'release-queue/main', base: 'main' },
		};

		assert.deepEqual(route('main', ['patch-release']), expected);
		assert.deepEqual(route('main', ['minor-release', 'i18n']), expected);
	});

	it('should route a major PR based on a prerelease branch to the umbrella of that branch', () => {
		assert.deepEqual(route('cloudflare-next', ['major-release']), {
			outcome: OUTCOMES.join,
			branches: {
				head: 'release-queue/cloudflare-next',
				base: 'cloudflare-next',
			},
		});
	});

	it('should route a PR based on an umbrella branch to that umbrella', () => {
		assert.deepEqual(route('release-queue/main', ['minor-release']), {
			outcome: OUTCOMES.join,
			branches: { head: 'release-queue/main', base: 'main' },
		});
		assert.deepEqual(route('release-queue/v8', ['major-release']), {
			outcome: OUTCOMES.join,
			branches: { head: 'release-queue/v8', base: 'v8' },
		});
	});

	it('should refuse a PR without a release label', () => {
		assert.deepEqual(route('main', ['accepted']), {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.missingReleaseLabel],
		});
	});

	it('should refuse a PR with several release labels', () => {
		assert.deepEqual(route('main', ['patch-release', 'minor-release']), {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.severalReleaseLabels],
		});
	});

	it('should refuse a major PR based on the stable branch or its umbrella', () => {
		const expected = {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.majorReleaseOnStableBranch],
		};

		assert.deepEqual(route('main', ['major-release']), expected);
		assert.deepEqual(route('release-queue/main', ['major-release']), expected);
	});

	it('should refuse a patch or minor PR based on a prerelease branch or its umbrella', () => {
		const expected = {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.stableReleaseOnPrereleaseBranch],
		};

		assert.deepEqual(route('cloudflare-next', ['minor-release']), expected);
		assert.deepEqual(route('release-queue/cloudflare-next', ['patch-release']), expected);
	});

	it('should refuse a PR for the stable umbrella while a major release is pending', () => {
		const expected = {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.majorReleasePending],
		};

		const state = { stableReleaseType: RELEASE_TYPES.major };
		assert.deepEqual(route('main', ['minor-release'], state), expected);
		assert.deepEqual(route('release-queue/main', ['patch-release'], state), expected);
	});

	it('should route a PR for the stable umbrella during a patch or minor release', () => {
		const patch = { stableReleaseType: RELEASE_TYPES.patch };
		const minor = { stableReleaseType: RELEASE_TYPES.minor };
		assert.equal(route('main', ['patch-release'], patch).outcome, OUTCOMES.join);
		assert.equal(route('main', ['patch-release'], minor).outcome, OUTCOMES.join);
	});

	it('should route a PR for a prerelease umbrella while a major release is pending', () => {
		const decision = route('cloudflare-next', ['major-release'], {
			stableReleaseType: RELEASE_TYPES.major,
		});

		assert.equal(decision.outcome, OUTCOMES.join);
	});

	it('should refuse a PR it would move into a settled umbrella', () => {
		const expected = { outcome: OUTCOMES.refuse, reasons: [REFUSAL_REASONS.settledUmbrella] };
		const state = { settledBaseBranches: ['main', 'cloudflare-next'] };

		assert.deepEqual(route('main', ['minor-release'], state), expected);
		assert.deepEqual(route('cloudflare-next', ['major-release'], state), expected);
	});

	it('should route a PR based on the branch of a settled umbrella', () => {
		const state = { settledBaseBranches: ['main', 'cloudflare-next'] };

		assert.equal(route('release-queue/main', ['minor-release'], state).outcome, OUTCOMES.join);
		assert.equal(
			route('release-queue/cloudflare-next', ['major-release'], state).outcome,
			OUTCOMES.join
		);
	});

	it('should give every routing reason at once', () => {
		const decision = route('main', [], { stableReleaseType: RELEASE_TYPES.major });

		assert.deepEqual(decision, {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.missingReleaseLabel, REFUSAL_REASONS.majorReleasePending],
		});
	});

	it('should skip the checks on the base branch without a single release label', () => {
		assert.deepEqual(route('cloudflare-next', ['patch-release', 'minor-release']), {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.severalReleaseLabels],
		});
	});

	it('should give the routing reasons, then the readiness reasons', () => {
		const decision = route('main', [], { readiness: { ...READY, isDraft: true } });

		assert.deepEqual(decision, {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.missingReleaseLabel, REFUSAL_REASONS.draft],
		});
	});

	it('should give every readiness reason of a PR', () => {
		const decision = route('main', ['minor-release'], {
			readiness: {
				isDraft: true,
				isApprovedByMaintainer: false,
				hasChangesRequestedByMaintainer: true,
				isMergeable: false,
				hasFailingChecks: true,
				hasPendingChecks: true,
			},
		});

		assert.deepEqual(decision, {
			outcome: OUTCOMES.refuse,
			reasons: [
				REFUSAL_REASONS.draft,
				REFUSAL_REASONS.changesRequested,
				REFUSAL_REASONS.missingApproval,
				REFUSAL_REASONS.mergeConflict,
				REFUSAL_REASONS.failingChecks,
				REFUSAL_REASONS.pendingChecks,
			],
		});
	});

	it('should refuse a PR whose mergeability is still unknown', () => {
		const decision = route('main', ['minor-release'], {
			readiness: { ...READY, isMergeable: null },
		});

		assert.deepEqual(decision, {
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.unknownMergeability],
		});
	});
});
