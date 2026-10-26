import { DOCS_STABLE_BRANCH, RELEASE_TYPES } from '../config.ts';
import type { Repository } from '../github/repository.ts';
import type { FrameworkReleases } from '../release/queries.ts';
import type { StableRelease } from '../release/release.ts';
import type { RunContext } from '../run-context.ts';
import { formatUmbrellaBody } from './body.ts';
import { getUmbrellaReleaseLabel, getUmbrellaTitle } from './heading.ts';
import { applyToLabels, getKeptLabelChanges, getLabelChanges } from './labels.ts';
import { syncMergeBlockReview } from './merge-block.ts';
import { listIncludedPullRequests, type UmbrellaPullRequest } from './queries.ts';
import { getReleaseState } from './state.ts';

/**
 * Brings an umbrella PR up to date with its release and its included PRs,
 * then its merge-block review.
 *
 * @param {RunContext} run - The repositories of the run.
 * @param {UmbrellaPullRequest} umbrella - The umbrella PR to refresh.
 * @param {object} options - What the umbrella follows, and when to block its
 *   merge.
 * @param {FrameworkReleases} options.releases - The releases of the
 *   framework.
 * @param {boolean} options.shouldBlock - Whether to submit a merge-block
 *   review when none is active.
 */
export async function refreshUmbrella(
	{ actions, bot }: RunContext,
	umbrella: UmbrellaPullRequest,
	{ releases, shouldBlock }: { releases: FrameworkReleases; shouldBlock: boolean }
) {
	const refreshed = await refreshTitleBodyAndLabels(bot, umbrella, releases);
	await syncMergeBlockReview(actions, refreshed, { shouldBlock });
}

/**
 * Writes what changed in the title, body and labels of an umbrella PR, and
 * returns the umbrella as it is after.
 */
async function refreshTitleBodyAndLabels(
	docs: Repository,
	umbrella: UmbrellaPullRequest,
	releases: FrameworkReleases
): Promise<UmbrellaPullRequest> {
	const releaseState = await getReleaseState(umbrella, releases);
	const isFollowing = releaseState.status === 'follows';
	if (isFollowing && isBeforeMajor(umbrella, releases.stable)) {
		console.info(`Skipped #${umbrella.number}: the next stable release is a major.`);
		return umbrella;
	}

	const linkedReleasePrNumber = isFollowing
		? await getFollowedReleasePrNumber(umbrella, releases)
		: releaseState.releasePrNumber;
	const wantedText = {
		title: isFollowing ? getUmbrellaTitle(umbrella.base, releases.stable) : umbrella.title,
		body: formatUmbrellaBody(umbrella.base, {
			releasePrNumber: linkedReleasePrNumber,
			included: await listIncludedPullRequests(docs, umbrella),
		}),
	};
	const textChanges = getTextChanges(umbrella, wantedText);
	if (Object.keys(textChanges).length > 0) {
		await docs.write('PATCH', `pulls/${umbrella.number}`, textChanges);
	}

	const labelChanges = isFollowing
		? getLabelChanges(umbrella.labels, getUmbrellaReleaseLabel(umbrella.base, releases.stable))
		: getKeptLabelChanges(umbrella.labels);
	await docs.updateLabels(umbrella.number, labelChanges);
	return { ...umbrella, ...textChanges, labels: applyToLabels(umbrella.labels, labelChanges) };
}

/**
 * Whether the stable umbrella waits for a major: the bot leaves it to a
 * maintainer, who moves it to the prerelease branch.
 */
function isBeforeMajor(umbrella: UmbrellaPullRequest, release: StableRelease): boolean {
	return umbrella.base === DOCS_STABLE_BRANCH && release.type === RELEASE_TYPES.major;
}

/**
 * Gets the release PR an umbrella that follows its release links: the open
 * release PR of the stable branch, or of the prerelease of a prerelease
 * umbrella.
 */
async function getFollowedReleasePrNumber(
	umbrella: UmbrellaPullRequest,
	releases: FrameworkReleases
): Promise<number | undefined> {
	const releasePullRequest =
		umbrella.base === DOCS_STABLE_BRANCH
			? releases.stable.pullRequest
			: await releases.getPrereleasePullRequest();
	return releasePullRequest?.number;
}

/** Gets the title and body of `wantedText` that differ from the umbrella's. */
function getTextChanges(
	umbrella: UmbrellaPullRequest,
	wantedText: { title: string; body: string }
): { title?: string; body?: string } {
	return {
		...(wantedText.title === umbrella.title ? {} : { title: wantedText.title }),
		...(wantedText.body === umbrella.body ? {} : { body: wantedText.body }),
	};
}
