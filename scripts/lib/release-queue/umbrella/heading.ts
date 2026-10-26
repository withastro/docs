import {
	FRAMEWORK_CORE_PACKAGE,
	RELEASE_LABELS,
	RELEASE_TITLE_PREFIX,
	DOCS_STABLE_BRANCH,
	type ReleaseLabel,
} from '../config.ts';
import type { StableRelease } from '../release/release.ts';

/**
 * Gets the title of the umbrella PR merging into a branch.
 *
 * The stable umbrella is named after the version of the core package or, if
 * unavailable, the stable branch. A prerelease umbrella is always named after
 * its branch.
 *
 * @param {string} umbrellaBase - The branch the umbrella PR merges into.
 * @param {StableRelease} release - The next release from the stable branch.
 * @returns {string} The title of the umbrella PR.
 */
export function getUmbrellaTitle(umbrellaBase: string, release: StableRelease): string {
	if (umbrellaBase !== DOCS_STABLE_BRANCH) return formatUmbrellaTitle(umbrellaBase);
	return formatUmbrellaTitle(
		release.frameworkVersion
			? `${FRAMEWORK_CORE_PACKAGE}@${release.frameworkVersion}`
			: DOCS_STABLE_BRANCH
	);
}

function formatUmbrellaTitle(name: string): string {
	return `${RELEASE_TITLE_PREFIX} ${name} docs`;
}

/**
 * Gets the release label of the umbrella PR merging into a branch.
 *
 * @param {string} umbrellaBase - The branch the umbrella PR merges into.
 * @param {StableRelease} release - The next release from the stable branch.
 *   Expected not to be a major for the stable umbrella.
 * @returns {ReleaseLabel} The label of the release type for the stable
 *   umbrella, and the major label for a prerelease umbrella.
 */
export function getUmbrellaReleaseLabel(
	umbrellaBase: string,
	release: StableRelease
): ReleaseLabel {
	return umbrellaBase === DOCS_STABLE_BRANCH ? RELEASE_LABELS[release.type] : RELEASE_LABELS.major;
}
