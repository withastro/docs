import type { PullRequest } from '../lib/github/repository.ts';
import { UMBRELLA_BRANCH_PREFIX } from './config.ts';

/**
 * Gets the name of the umbrella branch for a base branch.
 *
 * @param {string} baseBranch - The branch the umbrella PR merges into.
 * @returns {string} The umbrella branch.
 */
export function getUmbrellaBranch(baseBranch: string): string {
	return `${UMBRELLA_BRANCH_PREFIX}${baseBranch}`;
}

/**
 * Gets the base branch of an umbrella branch.
 *
 * @param {string} branch - Any branch name.
 * @returns {string | null} The branch the umbrella PR merges into, or `null` when `branch` is not an umbrella branch.
 */
export function getUmbrellaBaseBranch(branch: string): string | null {
	return branch.startsWith(UMBRELLA_BRANCH_PREFIX)
		? branch.slice(UMBRELLA_BRANCH_PREFIX.length)
		: null;
}

/**
 * Tells whether a pull request is an umbrella PR: its head is an umbrella
 * branch of the repository.
 *
 * @param {Pick<PullRequest, 'head'>} pullRequest - The pull request.
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
