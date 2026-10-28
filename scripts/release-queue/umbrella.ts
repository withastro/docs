import type { PullRequest } from '../lib/github/repository.ts';
import {
	DOCS_STABLE_BRANCH,
	FRAMEWORK_PACKAGE,
	RELEASE_LABELS,
	RELEASE_TYPES,
	UMBRELLA_BRANCH_PREFIX,
	UMBRELLA_LABEL,
	type ReleaseType,
} from './config.ts';
import type { FrameworkRelease, FrameworkReleases } from './release.ts';

/** Where a docs PR goes: an umbrella branch, and the branch its umbrella PR merges into. */
export type Route = {
	umbrellaBranch: string;
	umbrellaBaseBranch: string;
};

export type UmbrellaUpdate = {
	title: string;
	labelsToAdd: string[];
	labelsToRemove: string[];
};

/**
 * Gets the name of the umbrella branch for a base branch.
 *
 * @param {string} baseBranch - The branch the umbrella PR merges into.
 * @returns {string} The umbrella branch.
 */
export function getUmbrellaBranch(baseBranch: string): string {
	return `${UMBRELLA_BRANCH_PREFIX}${baseBranch}`;
}

/**
 * Gets the base branch of an umbrella branch.
 *
 * @param {string} branch - Any branch name.
 * @returns {string | null} The branch the umbrella PR merges into, or `null` when `branch` is not an umbrella branch.
 */
export function getUmbrellaBaseBranch(branch: string): string | null {
	return branch.startsWith(UMBRELLA_BRANCH_PREFIX)
		? branch.slice(UMBRELLA_BRANCH_PREFIX.length)
		: null;
}

/**
 * Tells whether a pull request is an umbrella PR: its head is an umbrella
 * branch of the repository.
 *
 * @param {Pick<PullRequest, 'head'>} pullRequest - The pull request.
 * @param {string} repositoryFullName - The repository holding the umbrella branches, as `owner/repo`.
 * @returns {boolean} `false` for a fork branch with an umbrella branch name.
 */
export function isUmbrellaPullRequest(
	pullRequest: Pick<PullRequest, 'head'>,
	repositoryFullName: string
): boolean {
	const { ref, repo } = pullRequest.head;
	return repo?.full_name === repositoryFullName && getUmbrellaBaseBranch(ref) !== null;
}

/**
 * Renders the title of an umbrella PR, after the framework's `[ci] release` PRs.
 *
 * Names the `astro` version when the release includes `astro`, or else its only package. Names
 * the base branch otherwise, since one package out of several could be the wrong one.
 *
 * @param {string} baseBranch - The branch the umbrella PR merges into.
 * @param {Pick<FrameworkRelease, 'packages'> | null} release - The release the umbrella ships
 * with, or `null` when none is open.
 * @returns {string} The title.
 */
export function renderUmbrellaTitle(
	baseBranch: string,
	release: Pick<FrameworkRelease, 'packages'> | null
): string {
	const packages = release?.packages ?? [];
	const namedPackage =
		packages.find(({ name }) => name === FRAMEWORK_PACKAGE) ??
		(packages.length === 1 ? packages[0] : null);
	const subject = namedPackage ? `${namedPackage.name}@${namedPackage.version}` : baseBranch;
	return `[ci] release ${subject} docs`;
}

/**
 * Gets the release an umbrella PR ships with.
 *
 * @param {FrameworkReleases} releases - The open releases of the framework.
 * @param {string} baseBranch - The branch the umbrella PR merges into.
 * @returns {FrameworkRelease | null} The release, or `null` when none is open.
 */
export function getUmbrellaRelease(
	releases: FrameworkReleases,
	baseBranch: string
): FrameworkRelease | null {
	return baseBranch === DOCS_STABLE_BRANCH ? releases.stable : releases.prerelease;
}

/**
 * Plans the title and the labels of an umbrella PR from the release it ships with.
 *
 * Without a release, keeps the title and the release label, since nothing tells what the next
 * release is.
 *
 * @param {Pick<PullRequest, 'title' | 'labels' | 'base'>} umbrella - The umbrella PR.
 * @param {FrameworkReleases} releases - The open releases of the framework.
 * @returns {UmbrellaUpdate} The title, and the labels to add and to remove.
 */
export function planUmbrellaUpdate(
	umbrella: Pick<PullRequest, 'title' | 'labels' | 'base'>,
	releases: FrameworkReleases
): UmbrellaUpdate {
	const baseBranch = umbrella.base.ref;
	const release = getUmbrellaRelease(releases, baseBranch);
	const releaseType = getUmbrellaReleaseType(baseBranch, release);
	const currentLabels = umbrella.labels.map(({ name }) => name);
	const expectedLabels = releaseType
		? [UMBRELLA_LABEL, RELEASE_LABELS[releaseType]]
		: [UMBRELLA_LABEL];
	const staleLabels = releaseType
		? Object.values(RELEASE_LABELS).filter((label) => label !== RELEASE_LABELS[releaseType])
		: [];

	return {
		title: release ? renderUmbrellaTitle(baseBranch, release) : umbrella.title,
		labelsToAdd: expectedLabels.filter((label) => !currentLabels.includes(label)),
		labelsToRemove: staleLabels.filter((label) => currentLabels.includes(label)),
	};
}

/** Prerelease umbrellas are always majors. Returns `null` when nothing tells the type. */
function getUmbrellaReleaseType(
	baseBranch: string,
	release: FrameworkRelease | null
): ReleaseType | null {
	if (baseBranch !== DOCS_STABLE_BRANCH) return RELEASE_TYPES.major;
	return release?.type ?? null;
}

/**
 * Renders the description of an umbrella PR.
 *
 * @param {Route} route - The umbrella branch and its base branch.
 * @returns {string} The description, in Markdown.
 */
export function renderUmbrellaBody({ umbrellaBranch, umbrellaBaseBranch }: Route): string {
	return `This PR collects the docs PRs for the next release into \`${umbrellaBaseBranch}\`. The release queue merges them into \`${umbrellaBranch}\` and keeps this PR up to date.`;
}
