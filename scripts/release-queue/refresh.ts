import { syncMergeBlockReview } from './merge-block.ts';
import { isMajorRelease } from './release.ts';
import { isSettled, type ReleaseQueueRun, type ReleaseState, type RunState } from './run.ts';
import {
	getIncludedPrNumbers,
	getUmbrellaReleasePrNumber,
	hasUmbrellaChanges,
	planUmbrellaUpdate,
	type UmbrellaChanges,
} from './umbrella-update.ts';
import { findUmbrellas, getUmbrellaRelease, isStableBranch, type Umbrella } from './umbrella.ts';

type RefreshRun = Pick<ReleaseQueueRun, 'docs' | 'reviewer' | 'log' | 'state'>;

/**
 * Refreshes every open umbrella PR of the docs repository, and the review that blocks its merge.
 *
 * A settled umbrella keeps its release, and only its list of PRs changes. While the next stable
 * release is a major, the stable umbrella is left to maintainers, who merge it into the
 * prerelease branch.
 *
 * @param {RefreshRun} run - The run, whose state gives the releases and the settled umbrellas. The
 * open PRs are listed again, since the joins of the run may have opened an umbrella.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function refreshOpenUmbrellas(run: RefreshRun): Promise<void> {
	const { docs, log } = run;
	const openPullRequests = await docs.getOpenPullRequests();
	const refreshRun = { ...run, state: { ...run.state, openPullRequests } };
	const umbrellas = findUmbrellas(openPullRequests, docs.fullName);
	log(`Open umbrellas: ${umbrellas.map(({ number }) => `#${number}`).join(', ') || 'none'}.`);
	for (const umbrella of umbrellas) {
		if (isWaitingForMajorRelease(umbrella, run.state)) {
			log(
				`Umbrella #${umbrella.number} skipped: the next stable release is a major, so a maintainer merges it into the prerelease branch.`
			);
			continue;
		}
		await refreshUmbrella(refreshRun, umbrella);
	}
}

function isWaitingForMajorRelease({ branches }: Umbrella, { releases }: ReleaseState) {
	return isStableBranch(branches.base) && isMajorRelease(releases.stable);
}

/** Gets the release an umbrella ships with, or `null` to keep the one of a settled umbrella. */
function getReleaseToApply({ branches }: Umbrella, state: ReleaseState) {
	return isSettled(state, branches.base) ? null : getUmbrellaRelease(state.releases, branches.base);
}

/**
 * Updates the title, the description, and the labels of an umbrella PR from the release it ships
 * with and the PRs merged into its branch, then the review that blocks its merge.
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

/** Gets the open PRs based on a branch. */
function getOpenPrNumbers(
	{ openPullRequests }: Pick<RunState, 'openPullRequests'>,
	branch: string
) {
	return openPullRequests.filter(({ base }) => base.ref === branch).map(({ number }) => number);
}

async function applyUmbrellaChanges(
	docs: RefreshRun['docs'],
	{ prNumber, fields, labelsToAdd, labelsToRemove }: UmbrellaChanges
) {
	if (Object.keys(fields).length > 0) await docs.updatePullRequest(prNumber, fields);
	if (labelsToAdd.length > 0) await docs.addLabels(prNumber, labelsToAdd);
	for (const label of labelsToRemove) await docs.removeLabel(prNumber, label);
}
