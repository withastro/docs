import { DOCS_STABLE_BRANCH, UMBRELLA_BRANCH_PREFIX } from '../config.ts';
import type { FrameworkRelease, FrameworkReleases } from '../framework-release.ts';
import type { PullRequest } from '../github/repository.ts';

/** Records the release PR in the umbrella description. */
export const RELEASE_PR_MARKER_NAME = 'release-assistant:release-pr';

/** The head and base branches of an umbrella PR. */
export type UmbrellaBranches = { head: string; base: string };

/**
 * Gets the branches of the umbrella of a base branch.
 *
 * @param {string} baseBranch - The branch the umbrella PR merges into.
 * @returns {UmbrellaBranches} The head branch reserved for that umbrella, and the base branch.
 */
export function getUmbrellaBranches(baseBranch: string): UmbrellaBranches {
	return { head: `${UMBRELLA_BRANCH_PREFIX}${baseBranch}`, base: baseBranch };
}

/**
 * Gets the branch an umbrella branch merges into.
 *
 * @param {string} branch - Any branch name.
 * @returns {string | null} The base branch, or `null` when `branch` is not an umbrella branch.
 */
export function getUmbrellaBaseBranch(branch: string): string | null {
	return branch.startsWith(UMBRELLA_BRANCH_PREFIX)
		? branch.slice(UMBRELLA_BRANCH_PREFIX.length)
		: null;
}

/** Tells whether a docs branch documents the stable releases. */
export function isStableBranch(branch: string): boolean {
	return branch === DOCS_STABLE_BRANCH;
}

/**
 * Tells whether the head of a pull request is an umbrella branch of the
 * repository.
 *
 * @param {Pick<PullRequest, 'head'>} pullRequest - Any pull request.
 * @param {string} repositoryFullName - The repository holding the umbrella branches, as `owner/repo`.
 * @returns {boolean} `false` for a fork branch with an umbrella branch name.
 */
export function isUmbrellaPullRequest(
	pullRequest: Pick<PullRequest, 'head'>,
	repositoryFullName: string
): boolean {
	const { ref, repo } = pullRequest.head;
	return repo?.full_name === repositoryFullName && getUmbrellaBaseBranch(ref) !== null;
}

/**
 * Chooses the release an umbrella PR ships with: the stable release for the
 * stable branch, the prerelease for any other branch.
 *
 * @param {FrameworkReleases} releases - The open releases of the framework.
 * @param {string} baseBranch - The branch the umbrella PR merges into.
 * @returns {FrameworkRelease | null} The release, or `null` when none is open.
 */
export function getUmbrellaRelease(
	releases: FrameworkReleases,
	baseBranch: string
): FrameworkRelease | null {
	return isStableBranch(baseBranch) ? releases.stable : releases.prerelease;
}
