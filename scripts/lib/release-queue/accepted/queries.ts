import { STABLE_BRANCH } from '../config.ts';
import { GitHubError } from '../github/error.ts';
import { compareBranches, type Repository } from '../github/repository.ts';
import type {
	CheckRunResponse,
	CommitStatusResponse,
	PullRequestResponse,
	ReviewResponse,
	RuleResponse,
} from '../github/types.ts';
import {
	classifyChecks,
	classifyReviewers,
	getLatestReviewStates,
	type Readiness,
	type Review,
} from './readiness.ts';
import type { DocsPullRequest } from './routing.ts';

const MERGEABILITY_ATTEMPTS = 5;

export interface PullRequest extends DocsPullRequest {
	number: number;
	title: string;
	url: string;
	headSha: string;
	isMergeable: boolean | null;
}

/**
 * Gets a docs PR for routing, once GitHub knows if it's mergeable.
 *
 * @param {Repository} repo - The docs repository.
 * @param {number} prNumber - The number of the docs PR.
 * @returns {Promise<PullRequest>} The PR. Its mergeability stays `null` when
 *   GitHub hasn't computed it after a few attempts.
 */
export async function getPullRequest(repo: Repository, prNumber: number): Promise<PullRequest> {
	const data = await getPullRequestWithMergeability(repo, prNumber);
	return {
		number: data.number,
		title: data.title,
		url: data.html_url,
		state: data.state,
		isDraft: data.draft,
		base: data.base.ref,
		head: data.head.ref,
		headSha: data.head.sha,
		labels: data.labels.map((label) => label.name),
		isMergeable: data.mergeable,
	};
}

/**
 * Gets a PR once GitHub has computed its mergeability. The first request
 * starts the computation.
 */
function getPullRequestWithMergeability(repo: Repository, prNumber: number) {
	return repo.poll<PullRequestResponse>(`pulls/${prNumber}`, {
		isReady: (data) => data.state !== 'open' || data.mergeable !== null,
		attempts: MERGEABILITY_ATTEMPTS,
	});
}

/**
 * Gets the commit a branch points to.
 *
 * @param {Repository} repo - The repository of the branch.
 * @param {string} branch - The branch name.
 * @returns {Promise<string | undefined>} The commit SHA, or `undefined` when
 *   the branch doesn't exist.
 */
export async function getBranchSha(repo: Repository, branch: string): Promise<string | undefined> {
	try {
		const { object } = await repo.get<{ object: { sha: string } }>(`git/ref/heads/${branch}`);
		return object.sha;
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return undefined;
		throw error;
	}
}

/**
 * Counts the commits of a branch that aren't in another.
 *
 * @param {Repository} repo - The repository of both branches.
 * @param {string} base - The branch to compare with.
 * @param {string} head - The branch whose commits are counted.
 * @returns {Promise<number>} The number of commits of `head` missing in `base`.
 */
export async function countCommitsAhead(
	repo: Repository,
	base: string,
	head: string
): Promise<number> {
	const { ahead_by } = await compareBranches(repo, base, head);
	return ahead_by;
}

/**
 * Comments on a PR.
 *
 * @param {Repository} repo - The repository of the PR.
 * @param {number} prNumber - The number of the PR.
 * @param {string} body - The comment, in Markdown.
 */
export async function postComment(repo: Repository, prNumber: number, body: string) {
	await repo.write('POST', `issues/${prNumber}/comments`, { body });
}

/**
 * Whether a user can write to the repository, from their permission on it.
 *
 * @param {Repository} repo - The repository.
 * @param {string} user - The login of the user.
 * @returns {Promise<boolean>} `true` for the admin, maintain and write
 *   permissions. `false` for a user who isn't a collaborator.
 */
export async function canWrite(repo: Repository, user: string): Promise<boolean> {
	try {
		const { permission } = await repo.get<{ permission: string }>(
			`collaborators/${user}/permission`
		);
		// The legacy `permission` field maps `maintain` to `write`,
		// and `triage` to `read`.
		return permission === 'admin' || permission === 'write';
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return false;
		throw error;
	}
}

/**
 * Gets what decides whether a docs PR is ready to merge, with the rules of
 * the ruleset of the stable branch.
 *
 * Only reviewers with write access count, and only the checks the ruleset
 * requires.
 *
 * @param {Repository} repo - The docs repository.
 * @param {PullRequest} pr - The docs PR.
 * @returns {Promise<Readiness>} Its reviews, checks, and mergeability.
 */
export async function getReadiness(repo: Repository, pr: PullRequest): Promise<Readiness> {
	const [reviews, checkRuns, statuses, required] = await Promise.all([
		repo.getAll<ReviewResponse>(`pulls/${pr.number}/reviews`),
		repo.getAll<CheckRunResponse, { check_runs: CheckRunResponse[] }>(
			`commits/${pr.headSha}/check-runs`,
			(data) => data.check_runs
		),
		repo.getAll<CommitStatusResponse, { statuses: CommitStatusResponse[] }>(
			`commits/${pr.headSha}/status`,
			(data) => data.statuses
		),
		getRequiredChecks(repo),
	]);

	const states = getLatestReviewStates(toReviews(reviews));
	const writers = await getWriters(repo, [...states.keys()]);
	return {
		...classifyReviewers(states, writers),
		...classifyChecks(required, checkRuns, statuses),
		isMergeable: pr.isMergeable,
	};
}

/** Keeps the reviews whose author still has an account. */
function toReviews(responses: ReviewResponse[]): Review[] {
	return responses.flatMap(({ user, state }) => (user ? [{ user: user.login, state }] : []));
}

/** Gets the users who can write to the repository among `users`. */
async function getWriters(repo: Repository, users: string[]): Promise<Set<string>> {
	const canEachWrite = await Promise.all(users.map((user) => canWrite(repo, user)));
	return new Set(users.filter((_, index) => canEachWrite[index]));
}

/**
 * Gets the checks the ruleset of the stable branch requires. They apply to
 * every docs PR, whatever its base.
 */
async function getRequiredChecks(repo: Repository): Promise<string[]> {
	const rules = await repo.getAll<RuleResponse>(`rules/branches/${STABLE_BRANCH}`);
	return rules
		.filter((rule) => rule.type === 'required_status_checks')
		.flatMap((rule) => rule.parameters?.required_status_checks ?? [])
		.map((check) => check.context);
}
