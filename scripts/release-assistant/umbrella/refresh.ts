import { isMajorRelease } from '../framework-release.ts';
import type { ReleaseAssistantRun, ReleaseState, RunState } from '../run.ts';
import { describeError } from '../utils/errors.ts';
import { formatPrNumbers } from '../utils/pr-numbers.ts';
import {
	getIncludedPrNumbers,
	getUmbrellaReleasePrNumber,
	hasFieldChanges,
	hasUmbrellaChanges,
	planUmbrellaUpdate,
	type UmbrellaChanges,
} from './content.ts';
import { syncMergeBlockReview } from './merge-block.ts';
import {
	findUmbrellas,
	getUmbrellaRelease,
	isSettled,
	isStableBranch,
	type Umbrella,
} from './umbrella.ts';

type RefreshRun = Pick<ReleaseAssistantRun, 'docs' | 'reviewer' | 'log' | 'state'>;

/**
 * Refreshes every open umbrella PR, and the review that blocks its merge.
 *
 * Lists the open PRs again, since the joins of the run may have opened an
 * umbrella. An umbrella that fails does not stop the others.
 *
 * @param {RefreshRun} run - The run.
 * @throws {GitHubError} When GitHub answers with an error status while listing the open PRs.
 * @throws {AggregateError} When some umbrellas failed, after refreshing the others.
 */
export async function refreshOpenUmbrellas(run: RefreshRun): Promise<void> {
	const { docs, log } = run;
	const openPullRequests = await docs.getOpenPullRequests();
	const refreshRun = { ...run, state: { ...run.state, openPullRequests } };
	const umbrellas = findUmbrellas(openPullRequests, docs.fullName);
	log(`Open umbrellas: ${formatPrNumbers(umbrellas.map(({ number }) => number))}.`);

	const errors: Error[] = [];
	for (const umbrella of umbrellas) {
		if (isWaitingForMajorRelease(umbrella, refreshRun.state)) {
			log(
				`Umbrella #${umbrella.number} skipped: the next stable release is a major, so a maintainer merges it into the prerelease branch.`
			);
			continue;
		}
		try {
			await refreshUmbrella(refreshRun, umbrella);
		} catch (error) {
			errors.push(
				new Error(`Umbrella #${umbrella.number} failed: ${describeError(error)}`, { cause: error })
			);
		}
	}

	if (errors.length > 0) {
		throw new AggregateError(
			errors,
			`${errors.length} of ${umbrellas.length} open umbrellas failed.`
		);
	}
}

/** Tells whether the stable umbrella waits for a major release. */
function isWaitingForMajorRelease({ branches }: Umbrella, { releases }: ReleaseState) {
	return isStableBranch(branches.base) && isMajorRelease(releases.stable);
}

/**
 * Gets the release an umbrella ships with, or `null` for a settled umbrella,
 * which keeps its recorded release.
 */
function getReleaseToApply({ branches }: Umbrella, state: ReleaseState) {
	return isSettled(state.settledBaseBranches, branches.base)
		? null
		: getUmbrellaRelease(state.releases, branches.base);
}

/**
 * Updates the title, description, and labels of an umbrella PR, then its
 * merge-block review.
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
		isReleaseMerged: isSettled(state.settledBaseBranches, branches.base),
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
