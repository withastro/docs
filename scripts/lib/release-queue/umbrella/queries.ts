import { normalizeLineEndings } from '../formats/markdown.ts';
import type { Repository } from '../github/repository.ts';
import type { PullRequestResponse } from '../github/types.ts';
import { getUmbrellaBase, isUmbrellaBranch } from './branch.ts';

/** The title GitHub gives a squash commit: the PR title, then its number. */
const SQUASH_TITLE = / \(#(\d+)\)$/;

export interface UmbrellaPullRequest {
	number: number;
	title: string;
	body: string;
	labels: string[];
	base: string;
	branch: string;
}

/** Whether a PR is an umbrella PR of the repository. */
function isUmbrellaPullRequest({ base, head }: PullRequestResponse, repo: Repository): boolean {
	return (
		isUmbrellaBranch(head.ref) &&
		head.repo?.full_name === repo.name &&
		getUmbrellaBase(head.ref) === base.ref
	);
}

function toUmbrellaPullRequest(data: PullRequestResponse): UmbrellaPullRequest {
	return {
		number: data.number,
		title: data.title,
		body: normalizeLineEndings(data.body ?? ''),
		labels: data.labels.map((label) => label.name),
		base: data.base.ref,
		branch: data.head.ref,
	};
}

/**
 * Gets an umbrella PR, open or not.
 *
 * @param {Repository} repo - The docs repository.
 * @param {number} umbrellaNumber - The number of the umbrella PR.
 * @returns {Promise<UmbrellaPullRequest>} The umbrella PR.
 */
export async function getUmbrella(
	repo: Repository,
	umbrellaNumber: number
): Promise<UmbrellaPullRequest> {
	return toUmbrellaPullRequest(await repo.get<PullRequestResponse>(`pulls/${umbrellaNumber}`));
}

/**
 * Finds the open umbrella PR of an umbrella branch.
 *
 * @param {Repository} repo - The docs repository.
 * @param {string} branch - The umbrella branch.
 * @returns {Promise<UmbrellaPullRequest | undefined>} The open umbrella PR, or
 *   `undefined` when none is open.
 */
export async function findOpenUmbrella(
	repo: Repository,
	branch: string
): Promise<UmbrellaPullRequest | undefined> {
	const pullRequests = await repo.listOpenPullRequests({ head: branch });
	const umbrella = pullRequests.find((pr) => isUmbrellaPullRequest(pr, repo));
	return umbrella && toUmbrellaPullRequest(umbrella);
}

/**
 * Lists the open umbrella PRs.
 *
 * @param {Repository} repo - The docs repository.
 * @returns {Promise<UmbrellaPullRequest[]>} The open umbrella PRs.
 */
export async function listOpenUmbrellas(repo: Repository): Promise<UmbrellaPullRequest[]> {
	const pullRequests = await repo.listOpenPullRequests();
	return pullRequests.filter((pr) => isUmbrellaPullRequest(pr, repo)).map(toUmbrellaPullRequest);
}

/**
 * Lists the docs PRs merged into an umbrella branch.
 *
 * Reads the PR number at the end of each commit title, which a rebase of the
 * branch keeps. A commit without one, such as a merge of the base, is skipped.
 *
 * @param {Repository} repo - The docs repository.
 * @param {UmbrellaPullRequest} umbrella - The umbrella PR.
 * @returns {Promise<number[]>} The numbers of the included PRs, in the order
 *   of the commits.
 */
export async function listIncludedPullRequests(
	repo: Repository,
	{ base, branch }: UmbrellaPullRequest
): Promise<number[]> {
	const { commits } = await repo.compareBranches(base, branch);
	return commits.flatMap(({ commit }) => {
		const [commitTitle = ''] = commit.message.split('\n', 1);
		const match = commitTitle.match(SQUASH_TITLE);
		return match ? [Number(match[1])] : [];
	});
}
