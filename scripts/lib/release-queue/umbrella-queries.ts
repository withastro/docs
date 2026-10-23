import type { Repository } from './repository.ts';
import type { PullRequestResponse } from './github-types.ts';
import { getUmbrellaBase, isUmbrellaBranch } from './routing.ts';
import { normalizeLineEndings } from './github-text.ts';

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
