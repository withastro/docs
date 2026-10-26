import { FRAMEWORK_REPO, RELEASE_TITLE_PREFIX, DOCS_STABLE_BRANCH } from '../config.ts';
import { wrapInCode } from '../formats/markdown.ts';
import { formatFrameworkReference } from '../release/release.ts';

/** Writes the hidden marker that keeps the release PR an umbrella links. */
function formatReleaseMarker(releasePrNumber: number | string): string {
	return `<!-- release-queue:release-pr=${releasePrNumber} -->`;
}

// Its characters outside the number match themselves in a regular expression.
// Anchored to the end of the body, as an edit above it could add a marker.
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
 * A linked release PR is also kept in a hidden marker at the end, for the
 * refresh to read it back.
 *
 * @param {string} umbrellaBase - The branch the umbrella PR merges into.
 * @param {object} content - What the description says.
 * @param {number} [content.releasePrNumber] - The release PR to link.
 * @param {number[]} content.included - The numbers of the included docs PRs.
 * @returns {string} The description, in Markdown.
 */
export function formatUmbrellaBody(
	umbrellaBase: string,
	{ releasePrNumber, included }: { releasePrNumber?: number | undefined; included: number[] }
): string {
	const summary = `${describeShipping(umbrellaBase, releasePrNumber)} ${describeIncluded(included)}`;
	const footer =
		'<sub>Managed by the release queue: the bot rewrites this description after each join and each manual run.</sub>';
	const marker = releasePrNumber === undefined ? [] : [formatReleaseMarker(releasePrNumber)];
	return [`${summary}\n\n${footer}`, ...marker].join('\n');
}

function describeIncluded(included: number[]): string {
	if (included.length === 0) return 'No docs PR is included yet.';
	// GitHub shows the title of a PR referenced alone in a list item.
	const list = included.map((prNumber) => `- #${prNumber}`).join('\n');
	return `This includes:\n\n${list}`;
}

function describeShipping(umbrellaBase: string, releasePrNumber: number | undefined): string {
	if (releasePrNumber !== undefined) {
		return `Ships with ${formatFrameworkReference(releasePrNumber)}.`;
	}
	const release = umbrellaBase === DOCS_STABLE_BRANCH ? 'release' : 'prerelease';
	return `Ships with the next ${release} of ${wrapInCode(FRAMEWORK_REPO)}, once its ${wrapInCode(RELEASE_TITLE_PREFIX)} PR is open.`;
}
