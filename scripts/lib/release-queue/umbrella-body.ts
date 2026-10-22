import { FRAMEWORK_REPO, MAIN_BRANCH, RELEASE_TITLE_PREFIX } from './config.ts';
import { formatFrameworkReference } from './github-links.ts';

/** A docs PR merged into an umbrella branch. */
export interface IncludedPullRequest {
	number: number;
	title: string;
}

/**
 * Keeps the PRs whose squash commit is on the umbrella branch, in the order of
 * the commits. The branch name comes back each release, so PRs of earlier
 * releases have the same base.
 */
export function selectIncludedPullRequests(
	closed: (IncludedPullRequest & { mergeCommitSha: string | null })[],
	umbrellaCommits: string[]
): IncludedPullRequest[] {
	const byCommit = new Map(closed.map((pr) => [pr.mergeCommitSha, pr]));
	return umbrellaCommits.flatMap((sha) => {
		const pr = byCommit.get(sha);
		return pr ? [{ number: pr.number, title: pr.title }] : [];
	});
}

/** Writes the hidden marker that keeps the release PR an umbrella links. */
function formatReleaseMarker(releasePullRequest: number | string): string {
	return `<!-- release-queue:release-pr=${releasePullRequest} -->`;
}

// Its characters outside the number match themselves in a regular expression.
const RELEASE_MARKER = new RegExp(formatReleaseMarker('(\\d+)'));

/** Reads the release PR an umbrella links, from the marker in its body. */
export function parseReleaseMarker(body: string): number | undefined {
	const match = body.match(RELEASE_MARKER);
	return match ? Number(match[1]) : undefined;
}

/**
 * Writes the description of the umbrella PR merging into `target`: what it
 * ships with, and the docs PRs it includes. A linked release PR is also kept
 * in a hidden marker, as the refresh needs it.
 */
export function formatUmbrellaBody(
	target: string,
	{
		releasePullRequest,
		included,
	}: { releasePullRequest?: number | undefined; included: IncludedPullRequest[] }
): string {
	const summary = `${describeShipping(target, releasePullRequest)} ${describeIncluded(included)}`;
	const footer =
		'<sub>Managed by the release queue: the bot rewrites this description after each join.</sub>';
	const marker = releasePullRequest === undefined ? [] : [formatReleaseMarker(releasePullRequest)];
	return [`${summary}\n\n${footer}`, ...marker].join('\n');
}

function describeIncluded(included: IncludedPullRequest[]): string {
	if (included.length === 0) return 'No docs PR is included yet.';
	const list = included.map(({ number, title }) => `- ${title} (#${number})`).join('\n');
	return `This includes:\n\n${list}`;
}

function describeShipping(target: string, releasePullRequest: number | undefined): string {
	if (releasePullRequest !== undefined)
		return `Ships with ${formatFrameworkReference(releasePullRequest)}.`;
	const release = target === MAIN_BRANCH ? 'release' : 'prerelease';
	return `Ships with the next ${release} of \`${FRAMEWORK_REPO}\`, once its \`${RELEASE_TITLE_PREFIX}\` PR is open.`;
}
