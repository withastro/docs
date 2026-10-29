import type { Comparison, PullRequest, PullRequestChanges } from '../lib/github/repository.ts';
import {
	FRAMEWORK_REPOSITORY,
	RELEASE_LABELS,
	RELEASE_TYPES,
	UMBRELLA_LABEL,
	type ReleaseType,
} from './config.ts';
import { renderMarker } from './markers.ts';
import { findFrameworkPackage, type FrameworkRelease } from './release.ts';
import {
	isStableBranch,
	RELEASE_PR_MARKER,
	type Umbrella,
	type UmbrellaBranches,
} from './umbrella.ts';

/** The end of the subject of a squash commit, such as `Fix a typo (#123)`. */
const SQUASH_COMMIT_PR_NUMBER = /\(#(\d+)\)$/;

/** What a refresh changes on an umbrella PR. */
export type UmbrellaChanges = {
	prNumber: number;
	/** Only the fields that differ from the umbrella PR. */
	fields: PullRequestChanges;
	labelsToAdd: string[];
	labelsToRemove: string[];
};

type UmbrellaContent = {
	branches: UmbrellaBranches;
	/** The release the umbrella ships with, or `null` when none is open. */
	release: FrameworkRelease | null;
	includedPrNumbers: number[];
};

type UmbrellaUpdateInputs = Omit<UmbrellaContent, 'branches'>;

/**
 * Renders the title and the description of an umbrella PR.
 *
 * @param {UmbrellaContent} content - The umbrella to render.
 * @returns {{ title: string; body: string }} The title, and the description in Markdown.
 */
export function renderUmbrella({ branches, release, includedPrNumbers }: UmbrellaContent): {
	title: string;
	body: string;
} {
	return {
		title: renderUmbrellaTitle(branches.base, release),
		body: renderUmbrellaBody(branches, release?.prNumber ?? null, includedPrNumbers),
	};
}

/**
 * Gets the release PR an umbrella ships with.
 *
 * @param {Pick<Umbrella, 'releasePrNumber'>} umbrella - The umbrella PR.
 * @param {Pick<FrameworkRelease, 'prNumber'> | null} release - The release to apply, or `null`
 * to keep the recorded one.
 * @returns {number | null} The release's PR, or the recorded one, or `null` when neither exists.
 */
export function getUmbrellaReleasePrNumber(
	umbrella: Pick<Umbrella, 'releasePrNumber'>,
	release: Pick<FrameworkRelease, 'prNumber'> | null
): number | null {
	return release?.prNumber ?? umbrella.releasePrNumber;
}

/**
 * Plans what a refresh changes on an umbrella PR: its title, its description, and its labels.
 *
 * Without a release, keeps the title, the release label, and the recorded release PR.
 *
 * @param {Umbrella} umbrella - The umbrella PR.
 * @param {UmbrellaUpdateInputs} inputs - The release to apply, or `null` to keep the current one,
 * and the docs PRs merged into the umbrella branch.
 * @returns {UmbrellaChanges} Only what differs from the umbrella PR.
 */
export function planUmbrellaUpdate(
	umbrella: Umbrella,
	{ release, includedPrNumbers }: UmbrellaUpdateInputs
): UmbrellaChanges {
	const { branches } = umbrella;
	const title = release ? renderUmbrellaTitle(branches.base, release) : umbrella.title;
	const releasePrNumber = getUmbrellaReleasePrNumber(umbrella, release);
	const body = renderUmbrellaBody(branches, releasePrNumber, includedPrNumbers);

	return {
		prNumber: umbrella.number,
		fields: {
			...(title !== umbrella.title && { title }),
			...(body !== umbrella.body && { body }),
		},
		...planReleaseLabels(umbrella, getUmbrellaReleaseType(branches.base, release)),
	};
}

/**
 * Tells whether a refresh changes anything on an umbrella PR.
 *
 * @param {UmbrellaChanges} changes - The planned changes.
 * @returns {boolean} `false` when the umbrella PR is up to date.
 */
export function hasUmbrellaChanges({
	fields,
	labelsToAdd,
	labelsToRemove,
}: UmbrellaChanges): boolean {
	return Object.keys(fields).length > 0 || labelsToAdd.length > 0 || labelsToRemove.length > 0;
}

/**
 * Renders the title of the squash commit of a docs PR merged into an umbrella.
 *
 * @param {Pick<PullRequest, 'number' | 'title'>} pullRequest - The docs PR.
 * @returns {string} The title, ending with the PR number, as the umbrella lists its PRs from it.
 */
export function renderSquashCommitTitle({
	number,
	title,
}: Pick<PullRequest, 'number' | 'title'>): string {
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

/** Renders the title of an umbrella PR, named like the framework's `[ci] release` PRs. */
function renderUmbrellaTitle(baseBranch: string, release: FrameworkRelease | null) {
	const titlePackage = release ? findTitlePackage(release) : undefined;
	const subject = titlePackage ? `${titlePackage.name}@${titlePackage.version}` : baseBranch;
	return `[ci] release ${subject} docs`;
}

/**
 * Finds the package an umbrella title names: the framework package, or else the only package of
 * the release. Finds none when the release has several packages without the framework one, since
 * naming one of them could be wrong.
 */
function findTitlePackage(release: FrameworkRelease) {
	const { packages } = release;
	return findFrameworkPackage(release) ?? (packages.length === 1 ? packages[0] : undefined);
}

/** Renders the description of an umbrella PR: the release PR it ships with, and its docs PRs. */
function renderUmbrellaBody(
	branches: UmbrellaBranches,
	releasePrNumber: number | null,
	includedPrNumbers: number[]
) {
	const marker =
		releasePrNumber === null ? '' : `${renderMarker(RELEASE_PR_MARKER, String(releasePrNumber))}\n`;
	const release =
		releasePrNumber === null
			? 'no release PR is open yet.'
			: `${FRAMEWORK_REPOSITORY}#${releasePrNumber}`;
	const includedPrList =
		includedPrNumbers.length > 0
			? includedPrNumbers.map((prNumber) => `- #${prNumber}`).join('\n')
			: 'None yet.';

	const paragraphs = [
		`${marker}The docs for the next release into \`${branches.base}\`, collected in \`${branches.head}\`.` +
			' The release queue keeps this description and the title up to date: edits to them are overwritten.',
		`**Ships with:** ${release}`,
		'## Included PRs',
		includedPrList,
	];
	return `${paragraphs.join('\n\n')}\n`;
}

/** Plans the umbrella label and the label of the release type, when it is known. */
function planReleaseLabels(
	{ labels }: Pick<PullRequest, 'labels'>,
	releaseType: ReleaseType | null
): Pick<UmbrellaChanges, 'labelsToAdd' | 'labelsToRemove'> {
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
	if (!isStableBranch(baseBranch)) return RELEASE_TYPES.major;
	return release?.type ?? null;
}
