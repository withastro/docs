import type { Repository } from './repository.ts';
import type { PullRequestResponse } from './github-types.ts';
import { listCommitsAhead } from './queries.ts';
import { getTarget, isUmbrellaBranch } from './routing.ts';
import { normalizeLineEndings } from './text.ts';

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

/**
 * A PR closed on an umbrella branch, in this release or an earlier one. Only
 * a merged PR has a squash commit on the branch.
 */
export interface ClosedPullRequest {
	number: number;
	title: string;
	mergeCommitSha: string | null;
}

/**
 * Whether a PR is an umbrella PR: from an umbrella branch of `repo` into the
 * branch the name implies.
 */
function isUmbrellaPullRequest({ base, head }: PullRequestResponse, repo: Repository): boolean {
	return (
		isUmbrellaBranch(head.ref) &&
		head.repo?.full_name === repo.name &&
		getTarget(head.ref) === base.ref
	);
}

function toOpenUmbrella(data: PullRequestResponse): OpenUmbrella {
	return {
		number: data.number,
		title: data.title,
		body: normalizeLineEndings(data.body ?? ''),
		labels: data.labels.map((label) => label.name),
		target: data.base.ref,
		branch: data.head.ref,
	};
}

/** Gets the umbrella PR `umbrellaNumber`, open or not. */
export async function getUmbrella(repo: Repository, umbrellaNumber: number) {
	return toOpenUmbrella(await repo.get<PullRequestResponse>(`pulls/${umbrellaNumber}`));
}

/** Finds the open umbrella PR of `branch`, if any. */
export async function findOpenUmbrella(
	repo: Repository,
	branch: string
): Promise<OpenUmbrella | undefined> {
	const pullRequests = await repo.get<PullRequestResponse[]>(
		`pulls?state=open&head=${repo.owner}:${branch}`
	);
	const umbrella = pullRequests.find((pr) => isUmbrellaPullRequest(pr, repo));
	return umbrella && toOpenUmbrella(umbrella);
}

/**
 * Lists the open umbrella PRs: PRs from an umbrella branch of `repo` into
 * the branch it names.
 */
export async function listOpenUmbrellas(repo: Repository): Promise<OpenUmbrella[]> {
	const pullRequests = await repo.getAll<PullRequestResponse>(`pulls?state=open`);
	return pullRequests.filter((pr) => isUmbrellaPullRequest(pr, repo)).map(toOpenUmbrella);
}

/**
 * Gets what makes up an umbrella: the commits of its branch, and the PRs ever
 * closed on that branch. The closed PRs of the branch build up over the
 * releases, about one page of 100 for 100 merged PRs.
 */
export async function getUmbrellaHistory(
	repo: Repository,
	{ target, branch }: OpenUmbrella
): Promise<{ commits: string[]; closed: ClosedPullRequest[] }> {
	const [commits, closedResponses] = await Promise.all([
		listCommitsAhead(repo, target, branch),
		repo.getAll<PullRequestResponse>(`pulls?state=closed&base=${branch}`),
	]);
	const closed = closedResponses.map(({ number, title, merge_commit_sha }) => ({
		number,
		title,
		mergeCommitSha: merge_commit_sha,
	}));
	return { commits, closed };
}
