import type { MainRelease } from './release.ts';
import { MAIN_BRANCH, RELEASE_LABELS, type ReleaseLabel } from './routing.ts';

/** Marks umbrella PRs, so they can be found in the PR list. */
export const MERGE_ON_RELEASE_LABEL = 'merge-on-release';

/** The label of a release whose type isn't known yet. */
const FALLBACK_RELEASE_LABEL: ReleaseLabel = 'patch-release';

/**
 * An umbrella PR: an open one, or the one a join creates, named by its title.
 * The title also stands for an umbrella whose creation was only printed.
 */
export type Umbrella = { number: number } | { title: string };

/** What an umbrella PR takes from the release it ships with. */
export interface UmbrellaHeading {
	title: string;
	releaseLabel: ReleaseLabel;
}

/**
 * Gets what the umbrella PR merging into `target` takes from the next release
 * from `main`. The `main` umbrella is named after the `astro` version, as
 * merged PRs are posted to Discord. On `main`, anything but a minor is a
 * patch, including a release without `astro`. A major never gets here:
 * `decide` refuses `main` PRs before one. A prerelease umbrella uses its
 * branch name, which says what it is for, and is a major.
 */
export function getUmbrellaHeading(target: string, release: MainRelease): UmbrellaHeading {
	if (target !== MAIN_BRANCH) {
		return { title: `[ci] release ${target} docs`, releaseLabel: 'major-release' };
	}
	const name = release.astroVersion ? `astro@${release.astroVersion}` : target;
	return {
		title: `[ci] release ${name} docs`,
		releaseLabel: release.type === 'minor' ? 'minor-release' : FALLBACK_RELEASE_LABEL,
	};
}

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
	merged: (IncludedPullRequest & { mergeCommitSha: string | null })[],
	umbrellaCommits: string[]
): IncludedPullRequest[] {
	const byCommit = new Map(merged.map((pr) => [pr.mergeCommitSha, pr]));
	return umbrellaCommits.flatMap((sha) => {
		const pr = byCommit.get(sha);
		return pr ? [{ number: pr.number, title: pr.title }] : [];
	});
}

const RELEASE_MARKER = /<!-- release-queue:release-pr=(\d+) -->/;

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
export function getUmbrellaBody(
	target: string,
	{
		releasePullRequest,
		included,
	}: { releasePullRequest?: number | undefined; included: IncludedPullRequest[] }
): string {
	const contents =
		included.length > 0
			? `This includes:\n\n${included.map(({ number, title }) => `- ${title} (#${number})`).join('\n')}`
			: 'No docs PR is included yet.';
	const marker =
		releasePullRequest === undefined
			? ''
			: `\n<!-- release-queue:release-pr=${releasePullRequest} -->`;
	return `${describeShipping(target, releasePullRequest)} ${contents}\n\n<sub>Managed by the release queue: the bot rewrites this description after each join.</sub>${marker}`;
}

function describeShipping(target: string, releasePullRequest: number | undefined): string {
	if (releasePullRequest !== undefined) return `Ships with withastro/astro#${releasePullRequest}.`;
	const release = target === MAIN_BRANCH ? 'release' : 'prerelease';
	return `Ships with the next ${release} of \`withastro/astro\`, once its \`[ci] release\` PR is open.`;
}

/**
 * Gets the label changes that give an umbrella PR `merge-on-release` and its
 * release label. Other labels, like `i18n`, stay.
 */
export function getLabelChanges(current: string[], releaseLabel: ReleaseLabel) {
	const wanted = [MERGE_ON_RELEASE_LABEL, releaseLabel];
	return {
		toAdd: wanted.filter((label) => !current.includes(label)),
		toRemove: RELEASE_LABELS.filter((label) => label !== releaseLabel && current.includes(label)),
	};
}

/**
 * Gets the label changes of an umbrella whose release can't be followed: it
 * keeps its release label, and gets the fallback one only if it has none.
 */
export function getKeptLabelChanges(current: string[]) {
	const hasReleaseLabel = RELEASE_LABELS.some((label) => current.includes(label));
	return {
		toAdd: [
			...(current.includes(MERGE_ON_RELEASE_LABEL) ? [] : [MERGE_ON_RELEASE_LABEL]),
			...(hasReleaseLabel ? [] : [FALLBACK_RELEASE_LABEL]),
		],
		toRemove: [],
	};
}
