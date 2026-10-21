import { setTimeout } from 'node:timers/promises';
import { GitHubError, type GitHubClient } from './github.ts';
import {
	getLatestReviewStates,
	summarizeChecks,
	summarizeReviews,
	type CheckRun,
	type CommitStatus,
	type Readiness,
} from './readiness.ts';
import { parseReleaseVersions, type PackageVersion } from './release.ts';
import type { DocsPullRequest } from './routing.ts';

const FRAMEWORK_REPO = 'withastro/astro';
const MERGEABILITY_ATTEMPTS = 5;
const MERGEABILITY_DELAY_MS = 2000;

export interface PullRequest extends DocsPullRequest {
	number: number;
	url: string;
	headSha: string;
	isMergeable: boolean | null;
}

export interface ReleasePullRequest {
	number: number;
	url: string;
	versions: PackageVersion[];
}

// The fields the bot reads from GitHub API responses.

interface PullRequestResponse {
	number: number;
	html_url: string;
	state: string;
	draft: boolean;
	mergeable: boolean | null;
	base: { ref: string };
	head: { ref: string; sha: string };
	labels: { name: string }[];
	body: string | null;
}

interface ReviewResponse {
	/** `null` for a deleted account. */
	user: { login: string } | null;
	state: string;
}

interface RuleResponse {
	type: string;
	parameters?: { required_status_checks?: { context: string }[] };
}

export async function getPullRequest(
	gh: GitHubClient,
	repo: string,
	number: number
): Promise<PullRequest> {
	const data = await getPullRequestWithMergeability(gh, repo, number);
	return {
		number: data.number,
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
async function getPullRequestWithMergeability(gh: GitHubClient, repo: string, number: number) {
	for (let attempt = 1; ; attempt++) {
		const data = await gh.get<PullRequestResponse>(`repos/${repo}/pulls/${number}`);
		const isKnown = data.state !== 'open' || data.mergeable !== null;
		if (isKnown || attempt === MERGEABILITY_ATTEMPTS) return data;
		await setTimeout(MERGEABILITY_DELAY_MS);
	}
}

/** Finds the open PR whose head is `branch`, such as an umbrella PR. */
export async function findOpenPullRequest(gh: GitHubClient, repo: string, branch: string) {
	const [owner] = repo.split('/');
	const [pr] = await gh.get<PullRequestResponse[]>(
		`repos/${repo}/pulls?state=open&head=${owner}:${branch}`
	);
	return pr ? { number: pr.number, url: pr.html_url } : undefined;
}

export async function canWrite(gh: GitHubClient, repo: string, user: string): Promise<boolean> {
	try {
		const { permission } = await gh.get<{ permission: string }>(
			`repos/${repo}/collaborators/${user}/permission`
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
 * Gets what decides whether a PR is ready to merge, with the rules of the
 * `main` ruleset: only reviewers with write access count, and only the checks
 * required on `main`.
 */
export async function getReadiness(
	gh: GitHubClient,
	repo: string,
	pr: PullRequest
): Promise<Readiness> {
	const [reviews, checkRuns, combinedStatus, required] = await Promise.all([
		gh.getAll<ReviewResponse>(`repos/${repo}/pulls/${pr.number}/reviews`),
		gh.getAll<CheckRun, { check_runs: CheckRun[] }>(
			`repos/${repo}/commits/${pr.headSha}/check-runs`,
			(data) => data.check_runs
		),
		gh.get<{ statuses: CommitStatus[] }>(`repos/${repo}/commits/${pr.headSha}/status`),
		getRequiredChecks(gh, repo),
	]);

	const states = getLatestReviewStates(
		reviews.flatMap(({ user, state }) => (user ? [{ user: user.login, state }] : []))
	);
	const writers = new Set<string>();
	await Promise.all(
		[...states.keys()].map(async (user) => {
			if (await canWrite(gh, repo, user)) writers.add(user);
		})
	);

	const checks = summarizeChecks(required, checkRuns, combinedStatus.statuses);

	return {
		...summarizeReviews(states, writers),
		failingChecks: checks.failing,
		pendingChecks: checks.pending,
		missingChecks: checks.missing,
		isMergeable: pr.isMergeable,
	};
}

/** Gets the checks required to merge into `main`. */
async function getRequiredChecks(gh: GitHubClient, repo: string): Promise<string[]> {
	const rules = await gh.getAll<RuleResponse>(`repos/${repo}/rules/branches/main`);
	return rules
		.filter((rule) => rule.type === 'required_status_checks')
		.flatMap((rule) => rule.parameters?.required_status_checks ?? [])
		.map((check) => check.context);
}

/** Gets the open `[ci] release` PR of `main` in `withastro/astro`. */
export async function getReleasePullRequest(
	gh: GitHubClient
): Promise<ReleasePullRequest | undefined> {
	const [owner] = FRAMEWORK_REPO.split('/');
	const [pr] = await gh.get<PullRequestResponse[]>(
		`repos/${FRAMEWORK_REPO}/pulls?state=open&head=${owner}:changeset-release/main`
	);
	if (!pr) return undefined;
	return { number: pr.number, url: pr.html_url, versions: parseReleaseVersions(pr.body ?? '') };
}
