import { GitHubError, type GitHubClient } from './github.ts';
import {
	getLatestReviewStates,
	summarizeChecks,
	summarizeReviews,
	type CheckRun,
	type CommitStatus,
	type Readiness,
} from './readiness.ts';
import { parseReleaseVersions, type ReleasePullRequest } from './release.ts';
import { MAIN_BRANCH, type DocsPullRequest } from './routing.ts';

const FRAMEWORK_REPO = 'withastro/astro';
const MERGEABILITY_ATTEMPTS = 5;

export interface PullRequest extends DocsPullRequest {
	number: number;
	title: string;
	url: string;
	headSha: string;
	isMergeable: boolean | null;
}

// The fields the bot reads from GitHub API responses.

export interface PullRequestResponse {
	number: number;
	title: string;
	html_url: string;
	state: string;
	draft: boolean;
	mergeable: boolean | null;
	merge_commit_sha: string | null;
	base: { ref: string };
	/** `repo` is `null` when the fork was deleted. */
	head: { ref: string; sha: string; repo?: { full_name: string } | null };
	labels: { name: string }[];
	body: string | null;
	merged?: boolean;
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
function getPullRequestWithMergeability(gh: GitHubClient, repo: string, number: number) {
	return gh.poll<PullRequestResponse>(`repos/${repo}/pulls/${number}`, {
		isReady: (data) => data.state !== 'open' || data.mergeable !== null,
		attempts: MERGEABILITY_ATTEMPTS,
	});
}

/** Gets the commit a branch points to, or `undefined` if it doesn't exist. */
export async function getBranchSha(
	gh: GitHubClient,
	repo: string,
	branch: string
): Promise<string | undefined> {
	try {
		const { object } = await gh.get<{ object: { sha: string } }>(
			`repos/${repo}/git/ref/heads/${branch}`
		);
		return object.sha;
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return undefined;
		throw error;
	}
}

/** Counts the commits of `head` that aren't in `base`. */
export async function countCommitsAhead(
	gh: GitHubClient,
	repo: string,
	base: string,
	head: string
) {
	const { ahead_by } = await compare(gh, repo, base, head);
	return ahead_by;
}

/** Lists the commits of `head` that aren't in `base`, oldest first. */
export async function listCommitsAhead(
	gh: GitHubClient,
	repo: string,
	base: string,
	head: string
): Promise<string[]> {
	const { commits } = await compare(gh, repo, base, head);
	return commits.map(({ sha }) => sha);
}

function compare(gh: GitHubClient, repo: string, base: string, head: string) {
	return gh.get<{ ahead_by: number; commits: { sha: string }[] }>(
		`repos/${repo}/compare/${base}...${head}`
	);
}

export async function postComment(gh: GitHubClient, repo: string, number: number, body: string) {
	await gh.write('POST', `repos/${repo}/issues/${number}/comments`, { body });
}

/** Removes a label from a PR. A label that is already gone is fine. */
export async function removeLabel(gh: GitHubClient, repo: string, number: number, label: string) {
	try {
		await gh.write('DELETE', `repos/${repo}/issues/${number}/labels/${label}`);
	} catch (error) {
		if (!(error instanceof GitHubError && error.status === 404)) throw error;
	}
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
	const rules = await gh.getAll<RuleResponse>(`repos/${repo}/rules/branches/${MAIN_BRANCH}`);
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
	return { number: pr.number, versions: parseReleaseVersions(pr.body ?? '') };
}

/**
 * Whether a PR of `withastro/astro`, such as a release PR, is merged. A PR
 * that doesn't exist, for example from an edited marker, isn't.
 */
export async function isFrameworkPullRequestMerged(gh: GitHubClient, number: number) {
	try {
		const { merged } = await gh.get<PullRequestResponse>(`repos/${FRAMEWORK_REPO}/pulls/${number}`);
		return merged === true;
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return false;
		throw error;
	}
}
