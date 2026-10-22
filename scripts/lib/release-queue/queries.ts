import { FRAMEWORK_PRERELEASE_BRANCH, MAIN_BRANCH } from './config.ts';
import { GitHubError } from './github-error.ts';
import type {
	CheckRunResponse,
	CommitStatusResponse,
	PullRequestResponse,
	ReviewResponse,
	RuleResponse,
} from './github-types.ts';
import { isRecord, parseJson } from './json.ts';
import {
	classifyChecks,
	classifyReviewers,
	getLatestReviewStates,
	type Readiness,
	type Review,
} from './readiness.ts';
import { parseReleaseVersions, type ReleasePullRequest } from './release.ts';
import type { Repository } from './repository.ts';
import type { DocsPullRequest } from './routing.ts';

/** The branch prefix of the release PRs that changesets opens. */
const RELEASE_BRANCH_PREFIX = 'changeset-release/';
/** The changesets file that holds the prerelease mode of a branch. */
const PRE_STATE_PATH = '.changeset/pre.json';

const MERGEABILITY_ATTEMPTS = 5;

export interface PullRequest extends DocsPullRequest {
	number: number;
	title: string;
	url: string;
	headSha: string;
	isMergeable: boolean | null;
}

/** Gets a docs PR for routing, once GitHub knows if it's mergeable. */
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

/** Gets the commit a branch points to, or `undefined` if it doesn't exist. */
export async function getBranchSha(repo: Repository, branch: string): Promise<string | undefined> {
	try {
		const { object } = await repo.get<{ object: { sha: string } }>(`git/ref/heads/${branch}`);
		return object.sha;
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return undefined;
		throw error;
	}
}

/** Counts the commits of `head` that aren't in `base`. */
export async function countCommitsAhead(repo: Repository, base: string, head: string) {
	const { ahead_by } = await compare(repo, base, head);
	return ahead_by;
}

/** Lists the commits of `head` that aren't in `base`, oldest first. */
export async function listCommitsAhead(
	repo: Repository,
	base: string,
	head: string
): Promise<string[]> {
	const { commits } = await compare(repo, base, head);
	return commits.map(({ sha }) => sha);
}

function compare(repo: Repository, base: string, head: string) {
	return repo.get<{ ahead_by: number; commits: { sha: string }[] }>(`compare/${base}...${head}`);
}

/** Comments on a PR. */
export async function postComment(repo: Repository, prNumber: number, body: string) {
	await repo.write('POST', `issues/${prNumber}/comments`, { body });
}

/** Removes a label from a PR. A label that is already gone is fine. */
export async function removeLabel(repo: Repository, prNumber: number, label: string) {
	try {
		await repo.write('DELETE', `issues/${prNumber}/labels/${label}`);
	} catch (error) {
		if (!(error instanceof GitHubError && error.status === 404)) throw error;
	}
}

/** Whether `user` can write to the repository, from their permission on it. */
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
 * Gets what decides whether a PR is ready to merge, with the rules of the
 * `main` ruleset: only reviewers with write access count, and only the checks
 * required on `main`.
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
 * Gets the checks the ruleset of `main` requires. They apply to every docs
 * PR, whatever its base.
 */
async function getRequiredChecks(repo: Repository): Promise<string[]> {
	const rules = await repo.getAll<RuleResponse>(`rules/branches/${MAIN_BRANCH}`);
	return rules
		.filter((rule) => rule.type === 'required_status_checks')
		.flatMap((rule) => rule.parameters?.required_status_checks ?? [])
		.map((check) => check.context);
}

/**
 * Gets the open `[ci] release` PR of a branch of `withastro/astro`: `main`, or
 * `next` for its alpha and beta releases.
 */
export async function getReleasePullRequest(
	framework: Repository,
	branch: string
): Promise<ReleasePullRequest | undefined> {
	const [pr] = await framework.get<PullRequestResponse[]>(
		`pulls?state=open&head=${framework.owner}:${RELEASE_BRANCH_PREFIX}${branch}`
	);
	if (!pr) return undefined;
	return { number: pr.number, versions: parseReleaseVersions(pr.body ?? '') };
}

/** Whether `next` in `withastro/astro` is in changesets prerelease mode. */
async function isNextInPreMode(framework: Repository): Promise<boolean> {
	try {
		const { content } = await framework.get<{ content: string }>(
			`contents/${PRE_STATE_PATH}?ref=${FRAMEWORK_PRERELEASE_BRANCH}`
		);
		// `exit` means the prerelease ends: `next` is then merged into `main`.
		return readPreMode(Buffer.from(content, 'base64').toString()) === 'pre';
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return false;
		throw error;
	}
}

/** Reads the `mode` of the `.changeset/pre.json` of `next`. */
function readPreMode(json: string): string {
	const source = `The \`${PRE_STATE_PATH}\` of \`${FRAMEWORK_PRERELEASE_BRANCH}\``;
	const preState = parseJson(json, source);
	if (!isPreState(preState)) throw new Error(`${source} has no \`mode\`.`);
	return preState.mode;
}

function isPreState(value: unknown): value is { mode: string } {
	return isRecord(value) && typeof value.mode === 'string';
}

/**
 * Gets the release PR a prerelease umbrella ships with: the alpha or beta
 * release PR of `next` while it's in prerelease mode, then the release PR of
 * `main`, which `next` was merged into.
 */
export async function getPrereleasePullRequest(
	framework: Repository,
	mainPullRequest: ReleasePullRequest | undefined
): Promise<ReleasePullRequest | undefined> {
	return (await isNextInPreMode(framework))
		? getReleasePullRequest(framework, FRAMEWORK_PRERELEASE_BRANCH)
		: mainPullRequest;
}

/**
 * Whether a PR of `withastro/astro`, such as a release PR, is merged. A PR
 * that doesn't exist, for example from an edited marker, isn't.
 */
export async function isFrameworkPullRequestMerged(framework: Repository, prNumber: number) {
	try {
		const { merged } = await framework.get<PullRequestResponse>(`pulls/${prNumber}`);
		return merged === true;
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return false;
		throw error;
	}
}
