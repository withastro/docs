import type { Comparison, PullRequest } from '../lib/github/repository.ts';
import {
	DOCS_STABLE_BRANCH,
	FRAMEWORK_PACKAGE,
	FRAMEWORK_REPOSITORY,
	RELEASE_LABELS,
	RELEASE_TYPES,
	UMBRELLA_BRANCH_PREFIX,
	UMBRELLA_LABEL,
	type ReleaseType,
} from './config.ts';
import type { FrameworkRelease, FrameworkReleases } from './release.ts';

/** Names the hidden line recording the release PR an umbrella ships with, in its description. */
const RELEASE_PR_MARKER_NAME = 'release-queue:release-pr';
const RELEASE_PR_MARKER = new RegExp(`^<!-- ${RELEASE_PR_MARKER_NAME}=(\\d+) -->$`, 'm');
/** The end of the subject of a squash commit, such as `Fix a typo (#123)`. */
const SQUASH_COMMIT_PR_NUMBER = /\(#(\d+)\)$/;

/** Where a docs PR goes: an umbrella branch, and the branch its umbrella PR merges into. */
export type Route = {
	umbrellaBranch: string;
	umbrellaBaseBranch: string;
};

export type UmbrellaUpdate = {
	title: string;
	body: string;
	labelsToAdd: string[];
	labelsToRemove: string[];
};

type UmbrellaBodyContent = {
	route: Route;
	/** The framework release PR the umbrella ships with, or `null` when none is known. */
	releasePrNumber: number | null;
	includedPrNumbers: number[];
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
 * Plans the title, the description, and the labels of an umbrella PR from the release it ships
 * with and the PRs it includes.
 *
 * Without a release, keeps the title, the release label, and the linked release PR, since nothing
 * tells what the next release is.
 *
 * @param {Pick<PullRequest, 'title' | 'body' | 'labels' | 'base'>} umbrella - The umbrella PR.
 * @param {FrameworkReleases} releases - The open releases of the framework.
 * @param {number[]} includedPrNumbers - The docs PRs merged into the umbrella branch.
 * @returns {UmbrellaUpdate} The title, the description, and the labels to add and to remove.
 */
export function planUmbrellaUpdate(
	umbrella: Pick<PullRequest, 'title' | 'body' | 'labels' | 'base'>,
	releases: FrameworkReleases,
	includedPrNumbers: number[]
): UmbrellaUpdate {
	const baseBranch = umbrella.base.ref;
	const release = getUmbrellaRelease(releases, baseBranch);
	const route = { umbrellaBranch: getUmbrellaBranch(baseBranch), umbrellaBaseBranch: baseBranch };
	const releasePrNumber = release?.prNumber ?? readReleasePrMarker(umbrella.body);

	return {
		title: release ? renderUmbrellaTitle(baseBranch, release) : umbrella.title,
		body: renderUmbrellaBody({ route, releasePrNumber, includedPrNumbers }),
		...planReleaseLabels(umbrella, getUmbrellaReleaseType(baseBranch, release)),
	};
}

function readReleasePrMarker(body: string | null) {
	const match = body?.match(RELEASE_PR_MARKER);
	return match ? Number(match[1]) : null;
}

/** Plans the umbrella label and the label of the release type, when it is known. */
function planReleaseLabels(
	{ labels }: Pick<PullRequest, 'labels'>,
	releaseType: ReleaseType | null
): Pick<UmbrellaUpdate, 'labelsToAdd' | 'labelsToRemove'> {
	const currentLabels = labels.map(({ name }) => name);
	const expectedLabels = releaseType
		? [UMBRELLA_LABEL, RELEASE_LABELS[releaseType]]
		: [UMBRELLA_LABEL];
	const staleLabels = releaseType
		? Object.values(RELEASE_LABELS).filter((label) => label !== RELEASE_LABELS[releaseType])
		: [];

	return {
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
 * Renders the description of an umbrella PR: the release PR it ships with, and the docs PRs it
 * includes.
 *
 * @param {UmbrellaBodyContent} content - The umbrella branch, the release PR, and the included PRs.
 * @returns {string} The description, in Markdown.
 */
export function renderUmbrellaBody({
	route,
	releasePrNumber,
	includedPrNumbers,
}: UmbrellaBodyContent): string {
	const marker =
		releasePrNumber === null ? '' : `<!-- ${RELEASE_PR_MARKER_NAME}=${releasePrNumber} -->\n`;
	const release =
		releasePrNumber === null
			? 'no release PR is open yet.'
			: `${FRAMEWORK_REPOSITORY}#${releasePrNumber}`;
	const includedPrList =
		includedPrNumbers.length > 0
			? includedPrNumbers.map((prNumber) => `- #${prNumber}`).join('\n')
			: 'None yet.';

	return `${marker}The docs for the next release into \`${route.umbrellaBaseBranch}\`, collected in \`${route.umbrellaBranch}\`. The release queue keeps this description and the title up to date: edits to them are overwritten.\n\n**Ships with:** ${release}\n\n## Included PRs\n\n${includedPrList}\n`;
}

/**
 * Renders the title of the squash commit of a docs PR merged into an umbrella.
 *
 * @param {Pick<PullRequest, 'number' | 'title'>} pullRequest - The docs PR.
 * @returns {string} The title, ending with the PR number, as the umbrella lists its PRs from it.
 */
export function renderSquashCommitTitle({ number, title }: Pick<PullRequest, 'number' | 'title'>) {
	return `${title} (#${number})`;
}

/**
 * Gets the docs PRs merged into an umbrella branch, from the subjects of their squash commits.
 *
 * @param {Pick<Comparison, 'commits'>} comparison - The commits of the umbrella branch that its
 * base lacks.
 * @returns {number[]} The PR numbers, once each, in the order of the commits.
 */
export function getIncludedPrNumbers({ commits }: Pick<Comparison, 'commits'>): number[] {
	const prNumbers = commits.flatMap(({ commit }) => {
		const [subject] = commit.message.split('\n');
		const match = subject.match(SQUASH_COMMIT_PR_NUMBER);
		return match ? [Number(match[1])] : [];
	});
	return [...new Set(prNumbers)];
}
