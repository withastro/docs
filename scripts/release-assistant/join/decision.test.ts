import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MAIN_BRANCHES } from '../fixtures.ts';
import { buildPullRequest } from '../github/fake-repository.ts';
import { getUmbrellaBranches } from '../umbrella/umbrella.ts';
import { decideJoin, OUTCOMES, REFUSAL_REASONS } from './decision.ts';

const CLOUDFLARE_NEXT_BRANCHES = getUmbrellaBranches('cloudflare-next');

function route(baseBranch: string, labels: string[]) {
	return decideJoin(buildPullRequest({ baseBranch, labels }));
}

describe('decideJoin', () => {
	it('should route a patch or minor PR based on main to the main umbrella', () => {
		const expected = {
			outcome: OUTCOMES.join,
			branches: MAIN_BRANCHES,
		};

		assert.deepEqual(route('main', ['patch-release']), expected);
		assert.deepEqual(route('main', ['minor-release', 'i18n']), expected);
	});

	it('should route a major PR based on a prerelease branch to the umbrella of that branch', () => {
		assert.deepEqual(route('cloudflare-next', ['major-release']), {
			outcome: OUTCOMES.join,
			branches: {
				head: 'umbrella/cloudflare-next',
				base: 'cloudflare-next',
			},
		});
	});

	it('should route a PR based on an umbrella branch to that umbrella', () => {
		assert.deepEqual(route('umbrella/main', ['minor-release']), {
			outcome: OUTCOMES.join,
			branches: MAIN_BRANCHES,
		});
		assert.deepEqual(route('umbrella/v8', ['major-release']), {
			outcome: OUTCOMES.join,
			branches: { head: 'umbrella/v8', base: 'v8' },
		});
	});

	it('should refuse a PR without a release label', () => {
		assert.deepEqual(route('main', ['accepted']), {
			outcome: OUTCOMES.refuse,
			branches: MAIN_BRANCHES,
			reasons: [REFUSAL_REASONS.missingReleaseLabel],
		});
	});

	it('should refuse a PR with several release labels', () => {
		assert.deepEqual(route('main', ['patch-release', 'minor-release']), {
			outcome: OUTCOMES.refuse,
			branches: MAIN_BRANCHES,
			reasons: [REFUSAL_REASONS.severalReleaseLabels],
		});
	});

	it('should refuse a major PR based on the stable branch or its umbrella', () => {
		const expected = {
			outcome: OUTCOMES.refuse,
			branches: MAIN_BRANCHES,
			reasons: [REFUSAL_REASONS.majorReleaseOnStableBranch],
		};

		assert.deepEqual(route('main', ['major-release']), expected);
		assert.deepEqual(route('umbrella/main', ['major-release']), expected);
	});

	it('should refuse a patch or minor PR based on a prerelease branch or its umbrella', () => {
		const expected = {
			outcome: OUTCOMES.refuse,
			branches: CLOUDFLARE_NEXT_BRANCHES,
			reasons: [REFUSAL_REASONS.stableReleaseOnPrereleaseBranch],
		};

		assert.deepEqual(route('cloudflare-next', ['minor-release']), expected);
		assert.deepEqual(route('umbrella/cloudflare-next', ['patch-release']), expected);
	});

	it('should skip the checks on the base branch without a single release label', () => {
		assert.deepEqual(route('cloudflare-next', ['patch-release', 'minor-release']), {
			outcome: OUTCOMES.refuse,
			branches: CLOUDFLARE_NEXT_BRANCHES,
			reasons: [REFUSAL_REASONS.severalReleaseLabels],
		});
	});
});
