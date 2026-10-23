import { FRAMEWORK_STABLE_BRANCH, STABLE_BRANCH } from '../config.ts';
import { removeLabel, type Repository } from '../github/repository.ts';
import { isLiveFor } from '../modes.ts';
import { getPrereleasePullRequest, getReleasePullRequest } from '../release/queries.ts';
import { getStableRelease, RELEASE_TYPES, type StableRelease } from '../release/release.ts';
import type { Repositories, RunContext } from '../run-context.ts';
import { formatUmbrellaBody, parseIncludedPullRequests } from './body.ts';
import { getUmbrellaHeading } from './heading.ts';
import {
	applyToLabels,
	getKeptLabelChanges,
	getLabelChanges,
	type LabelChanges,
} from './labels.ts';
import { syncMergeBlockReview } from './merge-block.ts';
import { listCommitTitlesAhead, listOpenUmbrellas, type UmbrellaPullRequest } from './queries.ts';
import { getReleaseState, type ReleaseState } from './state.ts';

/**
 * Brings an umbrella PR up to date with its release and its included PRs,
 * writing only what changed.
 *
 * @param {Repositories} repositories - The docs repository to write, and the
 *   framework repository.
 * @param {UmbrellaPullRequest} umbrella - The umbrella PR to refresh.
 * @param {StableRelease} release - The next release from the stable branch.
 * @returns {Promise<UmbrellaPullRequest>} The umbrella PR after the refresh.
 */
export async function refreshUmbrella(
	{ docs, framework }: Repositories,
	umbrella: UmbrellaPullRequest,
	release: StableRelease
): Promise<UmbrellaPullRequest> {
	const state = await getReleaseState(framework, umbrella, release);
	if (state.status === 'follows' && isBeforeMajor(umbrella, release)) {
		console.info(`Skipped #${umbrella.number}: the next stable release is a major.`);
		return umbrella;
	}

	const heading = getUmbrellaHeading(umbrella.base, release);
	const linkedReleasePrNumber = await getLinkedReleasePrNumber(framework, umbrella, {
		state,
		release,
	});
	const wanted = await getWantedText(docs, umbrella, {
		title: state.status === 'follows' ? heading.title : umbrella.title,
		linkedReleasePrNumber,
	});
	const textChanges = getTextChanges(umbrella, wanted);
	if (Object.keys(textChanges).length > 0) {
		await docs.write('PATCH', `pulls/${umbrella.number}`, textChanges);
	}

	const labelChanges =
		state.status === 'follows'
			? getLabelChanges(umbrella.labels, heading.releaseLabel)
			: getKeptLabelChanges(umbrella.labels);
	await applyLabelChanges(docs, umbrella.number, labelChanges);
	return { ...umbrella, ...textChanges, labels: applyToLabels(umbrella.labels, labelChanges) };
}

/**
 * Whether the stable umbrella waits for a major: the bot leaves it to a
 * maintainer, who moves it to the prerelease branch.
 */
function isBeforeMajor(umbrella: UmbrellaPullRequest, release: StableRelease): boolean {
	return umbrella.base === STABLE_BRANCH && release.type === RELEASE_TYPES.major;
}

/**
 * Gets the release PR to link in an umbrella: the open one when it follows
 * its release, or the one it already links.
 */
async function getLinkedReleasePrNumber(
	framework: Repository,
	umbrella: UmbrellaPullRequest,
	{ state, release }: { state: ReleaseState; release: StableRelease }
): Promise<number | undefined> {
	if (state.status !== 'follows') return state.releasePrNumber;
	const releasePullRequest =
		umbrella.base === STABLE_BRANCH
			? release.pullRequest
			: await getPrereleasePullRequest(framework, release.pullRequest);
	return releasePullRequest?.number;
}

/** Gets the title and body the umbrella PR should have. */
async function getWantedText(
	docs: Repository,
	umbrella: UmbrellaPullRequest,
	{ title, linkedReleasePrNumber }: { title: string; linkedReleasePrNumber: number | undefined }
): Promise<{ title: string; body: string }> {
	const commitTitles = await listCommitTitlesAhead(docs, umbrella.base, umbrella.branch);
	const body = formatUmbrellaBody(umbrella.base, {
		releasePrNumber: linkedReleasePrNumber,
		included: parseIncludedPullRequests(commitTitles),
	});
	return { title, body };
}

/** Gets the title and body of `wanted` that differ from the umbrella's. */
function getTextChanges(
	umbrella: UmbrellaPullRequest,
	wanted: { title: string; body: string }
): { title?: string; body?: string } {
	return {
		...(wanted.title === umbrella.title ? {} : { title: wanted.title }),
		...(wanted.body === umbrella.body ? {} : { body: wanted.body }),
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
		isLiveFor(mode, umbrella.base) ? 'live' : 'skipped'
	);
	for (const umbrella of skipped) {
		console.info(`Skipped #${umbrella.number}: dry run for ${umbrella.base}.`);
	}
	const failures: Error[] = [];
	// One after the other, as GitHub advises for writes: concurrent ones can
	// hit its secondary rate limits.
	for (const umbrella of liveUmbrellas) {
		const failure = await refreshAndSyncReview(run, umbrella, release);
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
 * Refreshes an umbrella PR and its merge-block review. Catches a failure, so
 * the other umbrellas still get refreshed.
 */
async function refreshAndSyncReview(
	{ actions, bot, framework }: RunContext,
	umbrella: UmbrellaPullRequest,
	release: StableRelease
): Promise<Error | undefined> {
	try {
		const refreshed = await refreshUmbrella({ docs: bot, framework }, umbrella, release);
		// Without a join, a dismissed review still covers the included PRs.
		await syncMergeBlockReview(actions, refreshed, { shouldBlock: false });
		return undefined;
	} catch (error) {
		return new Error(`Couldn't refresh #${umbrella.number}.`, { cause: error });
	}
}
