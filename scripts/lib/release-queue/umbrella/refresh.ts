import { DOCS_STABLE_BRANCH, RELEASE_TYPES, type ReleaseLabel } from '../config.ts';
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
 * What an umbrella PR shows of its release: its title, its release label, and
 * the release PR it links. Without a label, it keeps the one it has.
 */
interface ShownRelease {
	title: string;
	releaseLabel?: ReleaseLabel | undefined;
	releasePrNumber?: number | undefined;
}

/** Brings the umbrella PRs of a run up to date. */
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
		const releaseState = await getReleaseState(umbrella, this.#releases);
		const isFollowing = releaseState.status === 'follows';
		if (isFollowing && isBeforeMajor(umbrella, this.#releases.stable)) {
			console.info(`Skipped #${umbrella.number}: the next stable release is a major.`);
			return umbrella;
		}

		// An umbrella that doesn't follow keeps its title and release label.
		const shown: ShownRelease = isFollowing
			? await this.#getFollowedRelease(umbrella)
			: { title: umbrella.title, releasePrNumber: releaseState.releasePrNumber };
		const text = await this.#writeText(umbrella, shown);
		const labels = await this.#writeLabels(umbrella, shown.releaseLabel);
		return { ...umbrella, ...text, labels };
	}

	/** Gets what an umbrella that follows its release shows. */
	async #getFollowedRelease(umbrella: UmbrellaPullRequest): Promise<ShownRelease> {
		const { stable } = this.#releases;
		const releasePullRequest =
			umbrella.base === DOCS_STABLE_BRANCH
				? stable.pullRequest
				: await this.#releases.getPrereleasePullRequest();
		return {
			title: getUmbrellaTitle(umbrella.base, stable),
			releaseLabel: getUmbrellaReleaseLabel(umbrella.base, stable),
			releasePrNumber: releasePullRequest?.number,
		};
	}

	/**
	 * Writes the title and the body of an umbrella PR when they changed, and
	 * returns them.
	 */
	async #writeText(
		umbrella: UmbrellaPullRequest,
		{ title, releasePrNumber }: ShownRelease
	): Promise<{ title: string; body: string }> {
		const docs = this.#run.bot;
		const included = await listIncludedPullRequests(docs, umbrella);
		const text = { title, body: formatUmbrellaBody(umbrella.base, { releasePrNumber, included }) };
		const textChanges = getTextChanges(umbrella, text);
		if (Object.keys(textChanges).length > 0) {
			await docs.write('PATCH', `pulls/${umbrella.number}`, textChanges);
		}
		return text;
	}

	/**
	 * Gives an umbrella PR its release label, or keeps its own without one, and
	 * returns its labels after.
	 */
	async #writeLabels(
		umbrella: UmbrellaPullRequest,
		releaseLabel: ReleaseLabel | undefined
	): Promise<string[]> {
		const labelChanges = releaseLabel
			? getLabelChanges(umbrella.labels, releaseLabel)
			: getKeptLabelChanges(umbrella.labels);
		await this.#run.bot.updateLabels(umbrella.number, labelChanges);
		return applyToLabels(umbrella.labels, labelChanges);
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
