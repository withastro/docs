import { compareBranches, type Repository } from '../github/repository.ts';
import type { PullRequestResponse, ReviewResponse } from '../github/types.ts';
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

/** A review of an umbrella PR, with its body. */
export interface SubmittedReview extends ReviewResponse {
	id: number;
	body: string;
}

/** Whether a PR is an umbrella PR of the repository. */
function isUmbrellaPullRequest({ base, head }: PullRequestResponse, repo: Repository): boolean {
	return (
		isUmbrellaBranch(head.ref) &&
		head.repo?.full_name === repo.name &&
		getUmbrellaBase(head.ref) === base.ref
	);
}

/**
 * Replaces the `\r\n` line endings GitHub keeps from a description or review
 * edited in the browser with `\n`.
 *
 * @param {string} text - A description or a review body read from GitHub.
 * @returns {string} The text with `\n` line endings only.
 */
function normalizeLineEndings(text: string): string {
	return text.replaceAll('\r\n', '\n');
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
	const pullRequests = await repo.get<PullRequestResponse[]>(
		`pulls?state=open&head=${repo.owner}:${branch}`
	);
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
	const pullRequests = await repo.getAll<PullRequestResponse>(`pulls?state=open`);
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
	const { commits } = await compareBranches(repo, base, branch);
	return commits.flatMap(({ commit }) => {
		const [commitTitle = ''] = commit.message.split('\n', 1);
		const match = commitTitle.match(SQUASH_TITLE);
		return match ? [Number(match[1])] : [];
	});
}

/**
 * Lists the reviews of an umbrella PR.
 *
 * @param {Repository} repo - The docs repository.
 * @param {number} umbrellaNumber - The number of the umbrella PR.
 * @returns {Promise<SubmittedReview[]>} The reviews in chronological order,
 *   with `\n` line endings in their bodies.
 */
export async function listUmbrellaReviews(
	repo: Repository,
	umbrellaNumber: number
): Promise<SubmittedReview[]> {
	const reviews = await repo.getAll<SubmittedReview>(`pulls/${umbrellaNumber}/reviews`);
	return reviews.map((review) => ({ ...review, body: normalizeLineEndings(review.body) }));
}

/**
 * Lists the open PRs that target a branch.
 *
 * @param {Repository} repo - The docs repository.
 * @param {string} branch - The base of the PRs, such as an umbrella branch.
 * @returns {Promise<number[]>} The numbers of the open PRs.
 */
export async function listOpenPullRequestsTargeting(
	repo: Repository,
	branch: string
): Promise<number[]> {
	const pullRequests = await repo.getAll<{ number: number }>(`pulls?state=open&base=${branch}`);
	return pullRequests.map(({ number }) => number);
}
