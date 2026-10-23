import { FRAMEWORK_REPO, RELEASE_TITLE_PREFIX, STABLE_BRANCH } from '../config.ts';
import { formatFrameworkReference } from '../release/release.ts';

/** The title GitHub gives a squash commit: the PR title, then its number. */
const SQUASH_TITLE = /^(.*) \(#(\d+)\)$/;

/** A docs PR merged into an umbrella branch. */
export interface IncludedPullRequest {
	number: number;
	title: string;
}

/**
 * Writes the title of the squash commit of a docs PR, as GitHub does.
 *
 * @param {IncludedPullRequest} pr - The docs PR to merge.
 * @returns {string} The PR title, followed by its number.
 */
export function formatSquashTitle({ number, title }: IncludedPullRequest): string {
	return `${title} (#${number})`;
}

/**
 * Reads the docs PRs an umbrella branch includes, from the titles of its
 * commits.
 *
 * The titles hold the PR numbers, unlike the commit SHAs, which a rebase of
 * the branch changes. A commit without a PR number, such as a merge of the
 * base, is skipped.
 *
 * @param {string[]} commitTitles - The titles of the commits of the branch.
 * @returns {IncludedPullRequest[]} The included PRs, in the order of the
 *   commits.
 */
export function parseIncludedPullRequests(commitTitles: string[]): IncludedPullRequest[] {
	return commitTitles.flatMap((commitTitle) => {
		const match = commitTitle.match(SQUASH_TITLE);
		return match ? [{ number: Number(match[2]), title: match[1] }] : [];
	});
}

/** Writes the hidden marker that keeps the release PR an umbrella links. */
function formatReleaseMarker(releasePrNumber: number | string): string {
	return `<!-- release-queue:release-pr=${releasePrNumber} -->`;
}

// Its characters outside the number match themselves in a regular expression.
// Anchored to the end of the body, as a PR title above it can hold a marker.
const RELEASE_MARKER = new RegExp(`${formatReleaseMarker('(\\d+)')}\\s*$`);

/**
 * Reads the release PR an umbrella links, from the marker at the end of its
 * body.
 *
 * @param {string} body - The description of the umbrella PR.
 * @returns {number | undefined} The number of the release PR, or `undefined`
 *   without a marker.
 */
export function parseReleaseMarker(body: string): number | undefined {
	const match = body.match(RELEASE_MARKER);
	return match ? Number(match[1]) : undefined;
}

/**
 * Writes the description of an umbrella PR: what it ships with, and the docs
 * PRs it includes.
 *
 * A linked release PR is also kept in a hidden marker at the end, as the
 * refresh needs it.
 *
 * @param {string} umbrellaBase - The branch the umbrella PR merges into.
 * @param {object} content - What the description says.
 * @param {number} [content.releasePrNumber] - The release PR to link.
 * @param {IncludedPullRequest[]} content.included - The included docs PRs.
 * @returns {string} The description, in Markdown.
 */
export function formatUmbrellaBody(
	umbrellaBase: string,
	{
		releasePrNumber,
		included,
	}: { releasePrNumber?: number | undefined; included: IncludedPullRequest[] }
): string {
	const summary = `${describeShipping(umbrellaBase, releasePrNumber)} ${describeIncluded(included)}`;
	const footer =
		'<sub>Managed by the release queue: the bot rewrites this description after each join and each manual run.</sub>';
	const marker = releasePrNumber === undefined ? [] : [formatReleaseMarker(releasePrNumber)];
	return [`${summary}\n\n${footer}`, ...marker].join('\n');
}

function describeIncluded(included: IncludedPullRequest[]): string {
	if (included.length === 0) return 'No docs PR is included yet.';
	const list = included.map(({ number, title }) => `- ${title} (#${number})`).join('\n');
	return `This includes:\n\n${list}`;
}

function describeShipping(umbrellaBase: string, releasePrNumber: number | undefined): string {
	if (releasePrNumber !== undefined) {
		return `Ships with ${formatFrameworkReference(releasePrNumber)}.`;
	}
	const release = umbrellaBase === STABLE_BRANCH ? 'release' : 'prerelease';
	return `Ships with the next ${release} of \`${FRAMEWORK_REPO}\`, once its \`${RELEASE_TITLE_PREFIX}\` PR is open.`;
}
