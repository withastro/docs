import type { PullRequest } from '../lib/github/repository.ts';
import { UMBRELLA_BRANCH_PREFIX } from './config.ts';

/** Where a docs PR goes: an umbrella branch, and the branch its umbrella PR merges into. */
export type Route = {
	umbrellaBranch: string;
	umbrellaBaseBranch: string;
};

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

/**
 * Renders the title of an umbrella PR, after the framework's `[ci] release` PRs.
 *
 * @param {string} baseBranch - The branch the umbrella PR merges into.
 * @returns {string} The title.
 */
export function renderUmbrellaTitle(baseBranch: string): string {
	return `[ci] release ${baseBranch} docs`;
}

/**
 * Renders the description of an umbrella PR.
 *
 * @param {Route} route - The umbrella branch and its base branch.
 * @returns {string} The description, in Markdown.
 */
export function renderUmbrellaBody({ umbrellaBranch, umbrellaBaseBranch }: Route): string {
	return `This PR collects the docs PRs for the next release into \`${umbrellaBaseBranch}\`. The release queue merges them into \`${umbrellaBranch}\` and keeps this PR up to date.`;
}
