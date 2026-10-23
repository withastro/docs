import {
	FRAMEWORK_PACKAGE,
	RELEASE_LABELS,
	RELEASE_TITLE_PREFIX,
	STABLE_BRANCH,
	type ReleaseLabel,
} from './config.ts';
import type { StableRelease } from './release.ts';

/** What an umbrella PR takes from the release it ships with. */
export interface UmbrellaHeading {
	title: string;
	releaseLabel: ReleaseLabel;
}

/**
 * Gets the title and release label of the umbrella PR merging into
 * `umbrellaBase`.
 *
 * @param {string} umbrellaBase - The branch the umbrella PR merges into.
 * @param {StableRelease} release - The next release from the stable branch.
 * @returns {UmbrellaHeading} The heading of the stable umbrella, or of a
 *   prerelease umbrella for any other base.
 */
export function getUmbrellaHeading(umbrellaBase: string, release: StableRelease): UmbrellaHeading {
	return umbrellaBase === STABLE_BRANCH
		? getStableUmbrellaHeading(release)
		: getPrereleaseUmbrellaHeading(umbrellaBase);
}

/**
 * Names the stable umbrella after the version of the framework package, as
 * merged PRs are posted to Discord. Expects a release that isn't a major.
 */
function getStableUmbrellaHeading(release: StableRelease): UmbrellaHeading {
	const name = release.frameworkVersion
		? `${FRAMEWORK_PACKAGE}@${release.frameworkVersion}`
		: STABLE_BRANCH;
	return {
		title: `${RELEASE_TITLE_PREFIX} ${name} docs`,
		releaseLabel: RELEASE_LABELS[release.type],
	};
}

/** Names a prerelease umbrella after its branch, which says what it is for. */
function getPrereleaseUmbrellaHeading(umbrellaBase: string): UmbrellaHeading {
	return {
		title: `${RELEASE_TITLE_PREFIX} ${umbrellaBase} docs`,
		releaseLabel: RELEASE_LABELS.major,
	};
}
