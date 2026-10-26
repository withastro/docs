import { DOCS_STABLE_BRANCH, RELEASE_TYPES } from '../config.ts';
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
 * Brings umbrella PRs up to date in a run: their title, body and labels with
 * the releases of the framework and their included PRs, then their
 * merge-block review.
 */
export class UmbrellaRefresher {
	#run: RunContext;
	#releases: FrameworkReleases;

	/**
	 * Prepares the refreshes of a run.
	 *
	 * @param {RunContext} run - The repositories of the run.
	 * @param {FrameworkReleases} releases - The releases of the framework.
	 */
	constructor(run: RunContext, releases: FrameworkReleases) {
		this.#run = run;
		this.#releases = releases;
	}

	/**
	 * Brings an umbrella PR up to date with its release and its included PRs,
	 * then its merge-block review.
	 *
	 * @param {UmbrellaPullRequest} umbrella - The umbrella PR to refresh.
	 * @param {object} options - When to block its merge.
	 * @param {boolean} options.shouldBlock - Whether to submit a merge-block
	 *   review when none is active.
	 */
	async refresh(umbrella: UmbrellaPullRequest, { shouldBlock }: { shouldBlock: boolean }) {
		const refreshed = await this.#refreshTitleBodyAndLabels(umbrella);
		await syncMergeBlockReview(this.#run.actions, refreshed, { shouldBlock });
	}

	/**
	 * Writes what changed in the title, body and labels of an umbrella PR, and
	 * returns the umbrella as it is after.
	 */
	async #refreshTitleBodyAndLabels(umbrella: UmbrellaPullRequest): Promise<UmbrellaPullRequest> {
		const docs = this.#run.bot;
		const { stable } = this.#releases;
		const releaseState = await getReleaseState(umbrella, this.#releases);
		const isFollowing = releaseState.status === 'follows';
		if (isFollowing && isBeforeMajor(umbrella, stable)) {
			console.info(`Skipped #${umbrella.number}: the next stable release is a major.`);
			return umbrella;
		}

		const linkedReleasePrNumber = isFollowing
			? await this.#getFollowedReleasePrNumber(umbrella)
			: releaseState.releasePrNumber;
		const wantedText = {
			title: isFollowing ? getUmbrellaTitle(umbrella.base, stable) : umbrella.title,
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
			? getLabelChanges(umbrella.labels, getUmbrellaReleaseLabel(umbrella.base, stable))
			: getKeptLabelChanges(umbrella.labels);
		await docs.updateLabels(umbrella.number, labelChanges);
		return { ...umbrella, ...textChanges, labels: applyToLabels(umbrella.labels, labelChanges) };
	}

	/**
	 * Gets the release PR an umbrella that follows its release links: the open
	 * release PR of the stable branch, or of the prerelease of a prerelease
	 * umbrella.
	 */
	async #getFollowedReleasePrNumber(umbrella: UmbrellaPullRequest): Promise<number | undefined> {
		const releasePullRequest =
			umbrella.base === DOCS_STABLE_BRANCH
				? this.#releases.stable.pullRequest
				: await this.#releases.getPrereleasePullRequest();
		return releasePullRequest?.number;
	}
}

/**
 * Whether the stable umbrella waits for a major: the bot leaves it to a
 * maintainer, who moves it to the prerelease branch.
 */
function isBeforeMajor(umbrella: UmbrellaPullRequest, release: StableRelease): boolean {
	return umbrella.base === DOCS_STABLE_BRANCH && release.type === RELEASE_TYPES.major;
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
