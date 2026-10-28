import type { GitHubRepository, PullRequest } from '../lib/github/repository.ts';
import { GitHubError } from '../lib/github/request.ts';
import {
	describeReleases,
	readFrameworkReleases,
	type FrameworkReleases,
	type FrameworkRepository,
} from './release.ts';
import { findUmbrellas } from './umbrella.ts';

type DocsRepository = Pick<
	GitHubRepository,
	| 'fullName'
	| 'getOpenPullRequests'
	| 'getOpenPullRequestsFromBranch'
	| 'getPullRequest'
	| 'getReviews'
	| 'hasWriteAccess'
	| 'getChecks'
	| 'compare'
	| 'getBranchSha'
	| 'createBranch'
	| 'createPullRequest'
	| 'updatePullRequest'
	| 'mergePullRequest'
	| 'addLabels'
	| 'removeLabel'
	| 'createComment'
>;

type RunFrameworkRepository = FrameworkRepository & Pick<GitHubRepository, 'getPullRequest'>;

/** The repositories a run works with, and where it reports. */
export type ReleaseQueueContext = {
	/** The docs repository, through the bot account that merges PRs and opens umbrellas. */
	docs: DocsRepository;
	/** The framework repository, read for its release PRs. */
	astro: RunFrameworkRepository;
	/** The docs repository through another account than `docs`, to review the umbrellas it opens. */
	reviewer: Pick<GitHubRepository, 'getReviews' | 'requestChanges' | 'updateReview'>;
	/** Where the run reports what it does, one line at a time. */
	log: (message: string) => void;
	/** The job running the release queue, from `GITHUB_JOB`. `null` outside GitHub Actions. */
	jobName: string | null;
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

/** What a run knows when it starts. */
export type RunState = ReleaseState & {
	/** The open PRs of the docs repository, umbrellas included. */
	openPullRequests: PullRequest[];
};

/** A run of the release queue: its context, and what was true when it started. */
export type ReleaseQueueRun = ReleaseQueueContext & { state: RunState };

type RunStateContext = Pick<ReleaseQueueContext, 'docs' | 'astro'>;

/**
 * Starts a run: reads what is true when it starts.
 *
 * @param {T} context - The repositories to read, and what the run passes on.
 * @returns {Promise<T & { state: RunState }>} The context, with the state of the run.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When the framework's release PR or pre mode file can't be read.
 */
export async function startRun<T extends RunStateContext>(
	context: T
): Promise<T & { state: RunState }> {
	const [releases, openPullRequests] = await Promise.all([
		readFrameworkReleases(context.astro),
		context.docs.getOpenPullRequests(),
	]);
	const settledBaseBranches = await readSettledBaseBranches(context, openPullRequests);
	return { ...context, state: { releases, openPullRequests, settledBaseBranches } };
}

/**
 * Describes what a run knows about the releases, for the logs.
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

/**
 * Tells whether the umbrella of a base branch is settled: its release PR is merged, and it waits
 * for a maintainer to merge it.
 *
 * @param {{ settledBaseBranches: readonly string[] }} state - What the run knows about the
 * releases.
 * @param {string} baseBranch - The branch the umbrella merges into.
 * @returns {boolean} `false` for a branch without an open umbrella.
 */
export function isSettled(
	{ settledBaseBranches }: { settledBaseBranches: readonly string[] },
	baseBranch: string
): boolean {
	return settledBaseBranches.includes(baseBranch);
}

async function readSettledBaseBranches(
	{ docs, astro }: RunStateContext,
	openPullRequests: PullRequest[]
) {
	const umbrellas = findUmbrellas(openPullRequests, docs.fullName);
	const settledFlags = await Promise.all(
		umbrellas.map(({ releasePrNumber }) => isReleaseMerged(astro, releasePrNumber))
	);
	return umbrellas.filter((_, index) => settledFlags[index]).map(({ branches }) => branches.base);
}

/**
 * Tells whether the release PR recorded by an umbrella is merged. A recorded PR that does not
 * exist, after a hand edit, counts as not merged, so it does not stop every run.
 */
async function isReleaseMerged(astro: RunFrameworkRepository, releasePrNumber: number | null) {
	if (releasePrNumber === null) return false;

	try {
		return (await astro.getPullRequest(releasePrNumber)).merged;
	} catch (error) {
		if (error instanceof GitHubError && error.isNotFound) return false;
		throw error;
	}
}
