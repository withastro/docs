import type { ReleaseType } from './release.ts';
import { MAIN_BRANCH, type ReleaseLabel } from './routing.ts';

/**
 * An umbrella PR: an open one, or the one a join creates, named by its title.
 * The title also stands for an umbrella whose creation was only printed.
 */
export type Umbrella = { number: number } | { title: string };

/**
 * Gets the title of the umbrella PR merging into `target`, after the
 * `[ci] release` PRs of `withastro/astro`. The `main` umbrella uses the
 * `astro` version when there is one, as merged PRs are posted to Discord.
 * A prerelease umbrella uses its branch name, which says what it is for.
 */
export function getUmbrellaTitle(target: string, astroVersion?: string): string {
	const release = target === MAIN_BRANCH && astroVersion ? `astro@${astroVersion}` : target;
	return `[ci] release ${release} docs`;
}

/**
 * Gets the release label of the umbrella PR merging into `target`. On `main`,
 * anything but a minor is a patch, including a release without `astro`. A
 * major never gets here: `decide` refuses `main` PRs before a major.
 */
export function getUmbrellaReleaseLabel(
	target: string,
	mainReleaseType: ReleaseType
): ReleaseLabel {
	if (target !== MAIN_BRANCH) return 'major-release';
	return mainReleaseType === 'minor' ? 'minor-release' : 'patch-release';
}
