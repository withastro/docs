import type { GitHubClient } from './github.ts';
import { listCommitsAhead, type PullRequestResponse } from './queries.ts';
import { getTarget, isUmbrellaBranch } from './routing.ts';

/** An open umbrella PR, as the refresh reads it. */
export interface OpenUmbrella {
	number: number;
	title: string;
	body: string;
	labels: string[];
	/** The branch the umbrella PR merges into. */
	target: string;
	branch: string;
}

/** A PR merged into an umbrella branch, in this release or an earlier one. */
export interface MergedPullRequest {
	number: number;
	title: string;
	mergeCommitSha: string | null;
}

/**
 * Whether a PR is an umbrella PR: from an umbrella branch of `repo` into the
 * branch the name implies.
 */
function isUmbrellaPullRequest({ base, head }: PullRequestResponse, repo: string): boolean {
	return (
		isUmbrellaBranch(head.ref) && head.repo?.full_name === repo && getTarget(head.ref) === base.ref
	);
}

function toOpenUmbrella(data: PullRequestResponse): OpenUmbrella {
	return {
		number: data.number,
		title: data.title,
		body: data.body ?? '',
		labels: data.labels.map((label) => label.name),
		target: data.base.ref,
		branch: data.head.ref,
	};
}

export async function getUmbrella(gh: GitHubClient, repo: string, number: number) {
	return toOpenUmbrella(await gh.get<PullRequestResponse>(`repos/${repo}/pulls/${number}`));
}

/** Finds the open umbrella PR of `branch`, if any. */
export async function findOpenUmbrella(
	gh: GitHubClient,
	repo: string,
	branch: string
): Promise<OpenUmbrella | undefined> {
	const [owner] = repo.split('/');
	const pullRequests = await gh.get<PullRequestResponse[]>(
		`repos/${repo}/pulls?state=open&head=${owner}:${branch}`
	);
	const umbrella = pullRequests.find((pr) => isUmbrellaPullRequest(pr, repo));
	return umbrella && toOpenUmbrella(umbrella);
}

/**
 * Lists the open umbrella PRs: PRs from an umbrella branch of `repo` into
 * the branch it names.
 */
export async function listOpenUmbrellas(gh: GitHubClient, repo: string): Promise<OpenUmbrella[]> {
	const pullRequests = await gh.getAll<PullRequestResponse>(`repos/${repo}/pulls?state=open`);
	return pullRequests.filter((pr) => isUmbrellaPullRequest(pr, repo)).map(toOpenUmbrella);
}

/**
 * Gets what makes up an umbrella: the commits of its branch, and the PRs ever
 * merged into that branch. The closed PRs of the branch build up over the
 * releases, about one page of 100 for 100 merged PRs.
 */
export async function getUmbrellaHistory(
	gh: GitHubClient,
	repo: string,
	{ target, branch }: OpenUmbrella
): Promise<{ commits: string[]; merged: MergedPullRequest[] }> {
	const [commits, closed] = await Promise.all([
		listCommitsAhead(gh, repo, target, branch),
		gh.getAll<PullRequestResponse>(`repos/${repo}/pulls?state=closed&base=${branch}`),
	]);
	const merged = closed.map(({ number, title, merge_commit_sha }) => ({
		number,
		title,
		mergeCommitSha: merge_commit_sha,
	}));
	return { commits, merged };
}
