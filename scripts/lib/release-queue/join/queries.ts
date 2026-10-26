import { DOCS_STABLE_BRANCH } from '../config.ts';
import type { Repository } from '../github/repository.ts';
import type {
	CheckRunResponse,
	CommitStatusResponse,
	PullRequestResponse,
	PullRequestState,
	ReviewResponse,
	RuleResponse,
} from '../github/types.ts';
import {
	classifyChecks,
	classifyReviewers,
	getLatestReviewStates,
	readCheckRun,
	readCommitStatus,
	type Readiness,
	type Review,
} from './readiness.ts';

const MERGEABILITY_ATTEMPTS = 5;

/** What routing reads from a docs PR. */
export interface DocsPullRequest {
	state: PullRequestState;
	isDraft: boolean;
	base: string;
	head: string;
	labels: string[];
	/** `null` while GitHub hasn't computed it yet. */
	isMergeable: boolean | null;
}

export interface PullRequest extends DocsPullRequest {
	number: number;
	title: string;
	url: string;
	headSha: string;
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
 * Gets what decides whether a docs PR is ready to merge, with the rules of
 * the ruleset of the stable branch.
 *
 * Only reviewers with write access count, and only the checks the ruleset
 * requires.
 *
 * @param {Repository} repo - The docs repository.
 * @param {PullRequest} pr - The docs PR.
 * @returns {Promise<Readiness>} Its reviews and checks.
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
		...classifyChecks(required, [
			...checkRuns.map(readCheckRun),
			...statuses.map(readCommitStatus),
		]),
	};
}

/** Keeps the reviews whose author still has an account. */
function toReviews(responses: ReviewResponse[]): Review[] {
	return responses.flatMap(({ user, state }) => (user ? [{ user: user.login, state }] : []));
}

/** Gets the users who can write to the repository among `users`. */
async function getWriters(repo: Repository, users: string[]): Promise<Set<string>> {
	const canEachWrite = await Promise.all(users.map((user) => repo.canWrite(user)));
	return new Set(users.filter((_, index) => canEachWrite[index]));
}

/**
 * Gets the checks the ruleset of the stable branch requires. They apply to
 * every docs PR, whatever its base.
 */
async function getRequiredChecks(repo: Repository): Promise<string[]> {
	const rules = await repo.getAll<RuleResponse>(`rules/branches/${DOCS_STABLE_BRANCH}`);
	return rules
		.filter((rule) => rule.type === 'required_status_checks')
		.flatMap((rule) => rule.parameters?.required_status_checks ?? [])
		.map((check) => check.context);
}
