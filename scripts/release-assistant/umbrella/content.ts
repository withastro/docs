import { FRAMEWORK_REPOSITORY_NAME } from '../config.ts';
import { findFrameworkPackage, type FrameworkRelease } from '../framework-release.ts';
import type { PullRequest } from '../github/repository.ts';
import { renderMarker } from './markers.ts';
import { RELEASE_PR_MARKER_NAME, type UmbrellaBranches } from './umbrella.ts';

type UmbrellaContent = {
	branches: UmbrellaBranches;
	/** The release the umbrella ships with, or `null` when none is open. */
	release: FrameworkRelease | null;
	includedPrNumbers: number[];
};

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
		body: renderUmbrellaBody({ releasePrNumber: release?.prNumber ?? null, includedPrNumbers }),
	};
}

/**
 * Renders the title of the squash commit of a docs PR merged into an umbrella.
 *
 * @param {Pick<PullRequest, 'number' | 'title'>} pullRequest - The docs PR.
 * @returns {string} The title, ending with `(#<number>)`.
 */
export function renderSquashCommitTitle({
	number,
	title,
}: Pick<PullRequest, 'number' | 'title'>): string {
	return `${title} (#${number})`;
}

/** Renders an umbrella PR title, named like the framework's `[ci] release` PRs. */
function renderUmbrellaTitle(baseBranch: string, release: FrameworkRelease | null) {
	const titlePackage = release ? findTitlePackage(release) : undefined;
	const subject = titlePackage ? `${titlePackage.name}@${titlePackage.version}` : baseBranch;
	return `[ci] release ${subject} docs`;
}

/** Finds the framework package of a release, or else its only package. */
function findTitlePackage(release: FrameworkRelease) {
	const { packages } = release;
	return findFrameworkPackage(release) ?? (packages.length === 1 ? packages[0] : undefined);
}

/** Renders the description of an umbrella PR: the release PR it ships with, and its docs PRs. */
function renderUmbrellaBody({
	releasePrNumber,
	includedPrNumbers,
}: Pick<UmbrellaContent, 'includedPrNumbers'> & { releasePrNumber: number | null }) {
	const release =
		releasePrNumber === null
			? `The docs for the next release. No release PR is open in \`${FRAMEWORK_REPOSITORY_NAME}\` yet.`
			: `${renderMarker(RELEASE_PR_MARKER_NAME, String(releasePrNumber))}\nThe docs for the next release: ${FRAMEWORK_REPOSITORY_NAME}#${releasePrNumber}`;
	const includedPrs =
		includedPrNumbers.length > 0
			? `This includes:\n\n${includedPrNumbers.map((prNumber) => `- #${prNumber}`).join('\n')}`
			: 'This includes no docs PRs yet.';

	const paragraphs = [
		release,
		includedPrs,
		'A maintainer will merge this umbrella PR once the release is out.',
		'_Managed by the release assistant. Do not make manual edits to its title and description._',
	];
	return `${paragraphs.join('\n\n')}\n`;
}
