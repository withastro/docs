import type { PullRequest } from '../lib/github/repository.ts';
import { DOCS_STABLE_BRANCH, UMBRELLA_BRANCH_PREFIX } from './config.ts';
import type { FrameworkRelease, FrameworkReleases } from './framework-release.ts';
import { readMarker } from './markers.ts';

/** In the umbrella description. */
export const RELEASE_PR_MARKER_NAME = 'release-queue:release-pr';

/** The reserved umbrella PR's head branch and the base it merges into. */
export type UmbrellaBranches = { head: string; base: string };

/** An open umbrella PR, with its branches and the release PR it records. */
export type Umbrella = Pick<PullRequest, 'number' | 'title' | 'body' | 'labels'> & {
	branches: UmbrellaBranches;
	/** The framework release PR recorded in the description, or `null` when there is none yet. */
	releasePrNumber: number | null;
};

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
 * Tells whether a pull request is an umbrella PR: its head is an umbrella
 * branch of the repository.
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
 * Finds the umbrella PRs among pull requests, and reads them.
 *
 * @param {PullRequest[]} pullRequests - Any pull requests.
 * @param {string} repositoryFullName - The repository holding the umbrella branches, as
 * `owner/repo`.
 * @returns {Umbrella[]} The umbrellas, in the order of the pull requests.
 */
export function findUmbrellas(pullRequests: PullRequest[], repositoryFullName: string): Umbrella[] {
	return pullRequests
		.filter((pullRequest) => isUmbrellaPullRequest(pullRequest, repositoryFullName))
		.map(({ number, title, body, labels, base }) => ({
			number,
			title,
			body,
			labels,
			branches: getUmbrellaBranches(base.ref),
			releasePrNumber: readReleasePrNumber(body),
		}));
}

/**
 * Reads the release PR recorded in an umbrella description. A value that is
 * not a PR number (e.g. after a marker hand edit) counts as no release PR.
 */
function readReleasePrNumber(body: string | null) {
	const value = readMarker(RELEASE_PR_MARKER_NAME, body);
	const prNumber = Number(value);
	return value !== null && Number.isSafeInteger(prNumber) && prNumber > 0 ? prNumber : null;
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
