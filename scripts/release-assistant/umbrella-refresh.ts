import { formatPrNumbers } from './comments.ts';
import { isMajorRelease } from './framework-release.ts';
import { syncMergeBlockReview } from './merge-block.ts';
import {
	isSettled,
	type ReleaseAssistantRun,
	type ReleaseState,
	type RunState,
} from './run-state.ts';
import {
	getIncludedPrNumbers,
	getUmbrellaReleasePrNumber,
	hasFieldChanges,
	hasUmbrellaChanges,
	planUmbrellaUpdate,
	type UmbrellaChanges,
} from './umbrella-content.ts';
import { findUmbrellas, getUmbrellaRelease, isStableBranch, type Umbrella } from './umbrella.ts';

type RefreshRun = Pick<ReleaseAssistantRun, 'docs' | 'reviewer' | 'log' | 'state'>;

/**
 * Refreshes every open umbrella PR, and the review that blocks its merge.
 *
 * Lists the open PRs again, since the joins of the run may have opened an
 * umbrella.
 *
 * @param {RefreshRun} run - The run.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function refreshOpenUmbrellas(run: RefreshRun): Promise<void> {
	const { docs, log } = run;
	const openPullRequests = await docs.getOpenPullRequests();
	const refreshRun = { ...run, state: { ...run.state, openPullRequests } };
	const umbrellas = findUmbrellas(openPullRequests, docs.fullName);
	log(`Open umbrellas: ${formatPrNumbers(umbrellas.map(({ number }) => number))}.`);
	for (const umbrella of umbrellas) {
		if (isWaitingForMajorRelease(umbrella, refreshRun.state)) {
			log(
				`Umbrella #${umbrella.number} skipped: the next stable release is a major, so a maintainer merges it into the prerelease branch.`
			);
			continue;
		}
		await refreshUmbrella(refreshRun, umbrella);
	}
}

/**
 * Tells whether the stable umbrella waits for a major. A maintainer then
 * merges it into the prerelease branch, and the refresh leaves it as it is.
 */
function isWaitingForMajorRelease({ branches }: Umbrella, { releases }: ReleaseState) {
	return isStableBranch(branches.base) && isMajorRelease(releases.stable);
}

/** Gets the release an umbrella ships with, or `null` to keep the one of a
 * settled umbrella. */
function getReleaseToApply({ branches }: Umbrella, state: ReleaseState) {
	return isSettled(state, branches.base) ? null : getUmbrellaRelease(state.releases, branches.base);
}

/**
 * Updates the title, the description, and the labels of an umbrella PR from
 * the release it ships with and the PRs merged into its branch, then the
 * review that blocks its merge.
 *
 * Sends nothing for what is already up to date.
 *
 * @param {RefreshRun} run - The run.
 * @param {Umbrella} umbrella - The umbrella PR.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
async function refreshUmbrella(run: RefreshRun, umbrella: Umbrella): Promise<void> {
	const { docs, log, state } = run;
	const { branches } = umbrella;
	const comparison = await docs.compare(branches.base, branches.head);
	const includedPrNumbers = getIncludedPrNumbers(comparison);
	const release = getReleaseToApply(umbrella, state);
	const changes = planUmbrellaUpdate(umbrella, { release, includedPrNumbers });
	await applyUmbrellaChanges(docs, changes);
	log(
		hasUmbrellaChanges(changes)
			? `Umbrella #${umbrella.number} refreshed.`
			: `Umbrella #${umbrella.number} is up to date.`
	);

	await syncMergeBlockReview(run, {
		umbrella,
		releasePrNumber: getUmbrellaReleasePrNumber(umbrella, release),
		isReleaseMerged: isSettled(state, branches.base),
		openPrNumbers: getOpenPrNumbers(state, branches.head),
		includedPrNumbers,
	});
}

function getOpenPrNumbers(
	{ openPullRequests }: Pick<RunState, 'openPullRequests'>,
	baseBranch: string
) {
	return openPullRequests.filter(({ base }) => base.ref === baseBranch).map(({ number }) => number);
}

async function applyUmbrellaChanges(
	docs: RefreshRun['docs'],
	{ prNumber, fields, labelsToAdd, labelsToRemove }: UmbrellaChanges
) {
	if (hasFieldChanges(fields)) await docs.updatePullRequest(prNumber, fields);
	if (labelsToAdd.length > 0) await docs.addLabels(prNumber, labelsToAdd);
	for (const label of labelsToRemove) await docs.removeLabel(prNumber, label);
}
