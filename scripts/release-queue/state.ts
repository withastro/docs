import type { GitHubRepository } from '../lib/github/repository.ts';
import { GitHubError } from '../lib/github/request.ts';
import {
	describeReleases,
	readFrameworkReleases,
	type FrameworkReleases,
	type FrameworkRepository,
} from './release.ts';
import { isUmbrellaPullRequest, readReleasePrMarker } from './umbrella.ts';

export type StateFrameworkRepository = FrameworkRepository &
	Pick<GitHubRepository, 'getPullRequest'>;

type StateContext = {
	docs: Pick<GitHubRepository, 'fullName' | 'getOpenPullRequests'>;
	astro: StateFrameworkRepository;
};

/** What a run knows about the releases: the open release PRs, and the settled umbrellas. */
export type ReleaseState = {
	releases: FrameworkReleases;
	/**
	 * The base branches of the umbrellas whose release PR is merged. Such an umbrella waits for a
	 * maintainer to merge it, and ships with no other release.
	 */
	settledBaseBranches: string[];
};

/**
 * Reads the open release PRs of the framework, and which open umbrellas are settled.
 *
 * @param {StateContext} context - The docs and framework repositories.
 * @returns {Promise<ReleaseState>} The releases, and the base branches of the settled umbrellas.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When the pre mode file of the framework is not valid JSON.
 */
export async function readReleaseState(context: StateContext): Promise<ReleaseState> {
	const [releases, settledBaseBranches] = await Promise.all([
		readFrameworkReleases(context.astro),
		readSettledBaseBranches(context),
	]);
	return { releases, settledBaseBranches };
}

/**
 * Describes the release state, for the logs.
 *
 * @param {ReleaseState} state - The open releases, and the settled umbrellas.
 * @param {string} frameworkFullName - The framework repository, as `owner/repo`.
 * @returns {string} The release PR of each line, and the base branches of the settled umbrellas.
 */
export function describeReleaseState(
	{ releases, settledBaseBranches }: ReleaseState,
	frameworkFullName: string
): string {
	const settled = settledBaseBranches.join(', ') || 'none';
	return `Releases: ${describeReleases(releases, frameworkFullName)}. Settled umbrellas: ${settled}.`;
}

async function readSettledBaseBranches({ docs, astro }: StateContext) {
	const pullRequests = await docs.getOpenPullRequests();
	const umbrellas = pullRequests.filter((pullRequest) =>
		isUmbrellaPullRequest(pullRequest, docs.fullName)
	);
	const settledFlags = await Promise.all(
		umbrellas.map(({ body }) => isMarkedReleaseMerged(astro, body))
	);
	return umbrellas.filter((_, index) => settledFlags[index]).map(({ base }) => base.ref);
}

/**
 * Tells whether the release PR in the marker of an umbrella is merged. A marker naming a PR that
 * does not exist, after a hand edit, counts as not merged, so it does not stop every run.
 */
async function isMarkedReleaseMerged(astro: StateFrameworkRepository, body: string | null) {
	const releasePrNumber = readReleasePrMarker(body);
	if (releasePrNumber === null) return false;

	try {
		return (await astro.getPullRequest(releasePrNumber)).merged;
	} catch (error) {
		if (error instanceof GitHubError && error.isNotFound) return false;
		throw error;
	}
}
