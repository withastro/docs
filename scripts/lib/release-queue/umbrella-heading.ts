import {
	FALLBACK_RELEASE_LABEL,
	FRAMEWORK_PACKAGE,
	MAIN_BRANCH,
	RELEASE_LABELS,
	RELEASE_TITLE_PREFIX,
	type ReleaseLabel,
} from './config.ts';
import type { MainRelease } from './release.ts';

/**
 * An umbrella PR: an open one, or a planned one that a join would create,
 * named by its title. An umbrella whose creation was only printed stays
 * planned.
 */
export type Umbrella = { status: 'open'; number: number } | { status: 'planned'; title: string };

/** What an umbrella PR takes from the release it ships with. */
export interface UmbrellaHeading {
	title: string;
	releaseLabel: ReleaseLabel;
}

/**
 * Gets what the umbrella PR merging into `target` takes from the next release
 * from `main`. The `main` umbrella is named after the `astro` version, as
 * merged PRs are posted to Discord. On `main`, anything but a minor is a
 * patch, including a release without `astro`. A major never gets here:
 * `decideJoin` refuses `main` PRs before one. A prerelease umbrella uses its
 * branch name, which says what it is for, and is a major.
 */
export function getUmbrellaHeading(target: string, release: MainRelease): UmbrellaHeading {
	if (target !== MAIN_BRANCH) {
		return { title: `${RELEASE_TITLE_PREFIX} ${target} docs`, releaseLabel: RELEASE_LABELS.major };
	}
	const name = release.astroVersion ? `${FRAMEWORK_PACKAGE}@${release.astroVersion}` : target;
	return {
		title: `${RELEASE_TITLE_PREFIX} ${name} docs`,
		releaseLabel: release.type === 'minor' ? RELEASE_LABELS.minor : FALLBACK_RELEASE_LABEL,
	};
}
