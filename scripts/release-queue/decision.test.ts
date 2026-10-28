import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES, type ReleaseType } from './config.ts';
import { routePullRequest, OUTCOMES, REFUSAL_REASONS } from './decision.ts';
import { buildPullRequest } from './fake-repository.ts';

function route(baseBranch: string, labels: string[], stableReleaseType?: ReleaseType) {
	const stableRelease = stableReleaseType ? { type: stableReleaseType } : null;
	return routePullRequest(buildPullRequest({ baseBranch, labels }), stableRelease);
}

describe('routePullRequest', () => {
	it('should route a patch or minor PR based on main to the main umbrella', () => {
		const expected = {
			outcome: OUTCOMES.join,
			route: { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' },
		};

		assert.deepEqual(route('main', ['patch-release']), expected);
		assert.deepEqual(route('main', ['minor-release', 'i18n']), expected);
	});

	it('should route a major PR based on a prerelease branch to the umbrella of that branch', () => {
		assert.deepEqual(route('cloudflare-next', ['major-release']), {
			outcome: OUTCOMES.join,
			route: {
				umbrellaBranch: 'release-queue/cloudflare-next',
				umbrellaBaseBranch: 'cloudflare-next',
			},
		});
	});

	it('should route a PR based on an umbrella branch to that umbrella', () => {
		assert.deepEqual(route('release-queue/main', ['minor-release']), {
			outcome: OUTCOMES.join,
			route: { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' },
		});
		assert.deepEqual(route('release-queue/v8', ['major-release']), {
			outcome: OUTCOMES.join,
			route: { umbrellaBranch: 'release-queue/v8', umbrellaBaseBranch: 'v8' },
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

		assert.deepEqual(route('main', ['minor-release'], RELEASE_TYPES.major), expected);
		assert.deepEqual(route('release-queue/main', ['patch-release'], RELEASE_TYPES.major), expected);
	});

	it('should route a PR for the stable umbrella during a patch or minor release', () => {
		assert.equal(route('main', ['patch-release'], RELEASE_TYPES.patch).outcome, OUTCOMES.join);
		assert.equal(route('main', ['patch-release'], RELEASE_TYPES.minor).outcome, OUTCOMES.join);
	});

	it('should route a PR for a prerelease umbrella while a major release is pending', () => {
		const decision = route('cloudflare-next', ['major-release'], RELEASE_TYPES.major);

		assert.equal(decision.outcome, OUTCOMES.join);
	});
});
