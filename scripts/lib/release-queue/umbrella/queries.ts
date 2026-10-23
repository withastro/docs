import { compareBranches, type Repository } from '../github/repository.ts';
import type { PullRequestResponse, ReviewResponse } from '../github/types.ts';
import { getUmbrellaBase, isUmbrellaBranch } from './branch.ts';

/** An umbrella PR, with what the refresh reads from it. */
export interface UmbrellaPullRequest {
	number: number;
	title: string;
	body: string;
	labels: string[];
	base: string;
	branch: string;
}

/**
 * An umbrella PR: an open one, or a planned one that a join would create,
 * named by its title. An umbrella whose creation was only printed stays
 * planned.
 */
export type Umbrella = { status: 'open'; number: number } | { status: 'planned'; title: string };

/** A review of an umbrella PR, with its body. */
export interface SubmittedReview extends ReviewResponse {
	id: number;
	body: string;
}

/**
 * Whether a PR is an umbrella PR: from an umbrella branch of `repo` into the
 * branch the name implies.
 */
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
 * Lists the open umbrella PRs: PRs from an umbrella branch of the repository
 * into the branch it names.
 *
 * @param {Repository} repo - The docs repository.
 * @returns {Promise<UmbrellaPullRequest[]>} The open umbrella PRs. A PR from a
 *   fork or into another base isn't one.
 */
export async function listOpenUmbrellas(repo: Repository): Promise<UmbrellaPullRequest[]> {
	const pullRequests = await repo.getAll<PullRequestResponse>(`pulls?state=open`);
	return pullRequests.filter((pr) => isUmbrellaPullRequest(pr, repo)).map(toUmbrellaPullRequest);
}

/**
 * Lists the titles of the commits of a branch that aren't in another.
 *
 * @param {Repository} repo - The repository of both branches.
 * @param {string} base - The branch to compare with.
 * @param {string} head - The branch whose commits are listed.
 * @returns {Promise<string[]>} The first line of the message of each commit
 *   of `head` missing in `base`, oldest first.
 */
export async function listCommitTitlesAhead(
	repo: Repository,
	base: string,
	head: string
): Promise<string[]> {
	const { commits } = await compareBranches(repo, base, head);
	return commits.map(({ commit }) => commit.message.split('\n', 1)[0] ?? '');
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
