import { FRAMEWORK_STABLE_BRANCH, RELEASE_TYPES, DOCS_STABLE_BRANCH } from '../config.ts';
import { removeLabel, type Repository } from '../github/repository.ts';
import { canActOn } from '../modes.ts';
import { getPrereleasePullRequest, getReleasePullRequest } from '../release/queries.ts';
import { getStableRelease, type StableRelease } from '../release/release.ts';
import type { Repositories, RunContext } from '../run-context.ts';
import { formatUmbrellaBody } from './body.ts';
import { getUmbrellaReleaseLabel, getUmbrellaTitle } from './heading.ts';
import {
	applyToLabels,
	getKeptLabelChanges,
	getLabelChanges,
	type LabelChanges,
} from './labels.ts';
import { syncMergeBlockReview } from './merge-block.ts';
import {
	listIncludedPullRequests,
	listOpenUmbrellas,
	type UmbrellaPullRequest,
} from './queries.ts';
import { getReleaseState } from './state.ts';

/**
 * Brings an umbrella PR up to date with its release and its included PRs,
 * then its merge-block review.
 *
 * @param {RunContext} run - The repositories of the run.
 * @param {UmbrellaPullRequest} umbrella - The umbrella PR to refresh.
 * @param {object} options - What the umbrella follows, and when to block its
 *   merge.
 * @param {StableRelease} options.release - The next release from the stable
 *   branch.
 * @param {boolean} options.shouldBlock - Whether to submit a merge-block
 *   review when none is active.
 */
export async function refreshUmbrella(
	{ actions, bot, framework }: RunContext,
	umbrella: UmbrellaPullRequest,
	{ release, shouldBlock }: { release: StableRelease; shouldBlock: boolean }
) {
	const refreshed = await refreshTitleBodyAndLabels({ docs: bot, framework }, umbrella, release);
	await syncMergeBlockReview(actions, refreshed, { shouldBlock });
}

/**
 * Writes what changed in the title, body and labels of an umbrella PR, and
 * returns the umbrella as it is after.
 */
async function refreshTitleBodyAndLabels(
	{ docs, framework }: Repositories,
	umbrella: UmbrellaPullRequest,
	release: StableRelease
): Promise<UmbrellaPullRequest> {
	const releaseState = await getReleaseState(framework, umbrella, release);
	const isFollowing = releaseState.status === 'follows';
	if (isFollowing && isBeforeMajor(umbrella, release)) {
		console.info(`Skipped #${umbrella.number}: the next stable release is a major.`);
		return umbrella;
	}

	const linkedReleasePrNumber = isFollowing
		? await getFollowedReleasePrNumber(framework, umbrella, release)
		: releaseState.releasePrNumber;
	const wantedText = {
		title: isFollowing ? getUmbrellaTitle(umbrella.base, release) : umbrella.title,
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
		? getLabelChanges(umbrella.labels, getUmbrellaReleaseLabel(umbrella.base, release))
		: getKeptLabelChanges(umbrella.labels);
	await applyLabelChanges(docs, umbrella.number, labelChanges);
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
	framework: Repository,
	umbrella: UmbrellaPullRequest,
	release: StableRelease
): Promise<number | undefined> {
	const releasePullRequest =
		umbrella.base === DOCS_STABLE_BRANCH
			? release.pullRequest
			: await getPrereleasePullRequest(framework, release.pullRequest);
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

async function applyLabelChanges(docs: Repository, umbrellaNumber: number, changes: LabelChanges) {
	if (changes.toAdd.length > 0) {
		await docs.write('POST', `issues/${umbrellaNumber}/labels`, { labels: changes.toAdd });
	}
	await Promise.all(changes.toRemove.map((label) => removeLabel(docs, umbrellaNumber, label)));
}

/**
 * Refreshes every open umbrella PR the mode acts on, for example after a
 * change to a release PR.
 *
 * @param {RunContext} run - The repositories and the mode of the run.
 * @throws {AggregateError} Once every umbrella was tried, when some of them
 *   couldn't be refreshed.
 */
export async function refreshOpenUmbrellas(run: RunContext) {
	const { actions, framework, mode } = run;
	const [umbrellas, releasePullRequest] = await Promise.all([
		listOpenUmbrellas(actions),
		getReleasePullRequest(framework, FRAMEWORK_STABLE_BRANCH),
	]);
	const release = getStableRelease(releasePullRequest);
	const numbers = umbrellas.map(({ number }) => `#${number}`).join(', ');
	console.info(`Open umbrellas: ${numbers || 'none'}.`);

	const { live: liveUmbrellas = [], skipped = [] } = Object.groupBy(umbrellas, (umbrella) =>
		canActOn(mode, umbrella.base) ? 'live' : 'skipped'
	);
	for (const umbrella of skipped) {
		console.info(`Skipped #${umbrella.number}: dry run for ${umbrella.base}.`);
	}
	const failures: Error[] = [];
	// One after the other, as GitHub advises for writes: concurrent ones can
	// hit its secondary rate limits.
	for (const umbrella of liveUmbrellas) {
		const failure = await tryRefreshUmbrella(run, umbrella, release);
		if (failure) failures.push(failure);
	}
	if (failures.length > 0) {
		throw new AggregateError(
			failures,
			`Couldn't refresh ${failures.length} of ${liveUmbrellas.length} umbrella PRs.`
		);
	}
}

/**
 * Refreshes an umbrella PR without a join. Catches a failure, so the other
 * umbrellas still get refreshed.
 */
async function tryRefreshUmbrella(
	run: RunContext,
	umbrella: UmbrellaPullRequest,
	release: StableRelease
): Promise<Error | undefined> {
	try {
		// Without a join, a dismissed review still covers the included PRs.
		await refreshUmbrella(run, umbrella, { release, shouldBlock: false });
		return undefined;
	} catch (error) {
		return new Error(`Couldn't refresh #${umbrella.number}.`, { cause: error });
	}
}
