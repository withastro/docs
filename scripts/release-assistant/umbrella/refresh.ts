import { isMajorRelease } from '../framework-release.ts';
import type { ReleaseAssistantRun, ReleaseState } from '../run.ts';
import { describeError } from '../utils/errors.ts';
import { formatPrNumbers } from '../utils/pr-numbers.ts';
import {
	getIncludedPrNumbers,
	hasFieldChanges,
	hasUmbrellaChanges,
	planUmbrellaUpdate,
	type UmbrellaChanges,
} from './content.ts';
import { findUmbrellas, getUmbrellaRelease, isStableBranch, type Umbrella } from './umbrella.ts';

type RefreshRun = Pick<ReleaseAssistantRun, 'docs' | 'log' | 'state'>;

/**
 * Refreshes every open umbrella PR.
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
 * Updates the title, description, and labels of an umbrella PR.
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
	const release = getUmbrellaRelease(state.releases, branches.base);
	const changes = planUmbrellaUpdate(umbrella, { release, includedPrNumbers });
	await applyUmbrellaChanges(docs, changes);
	log(
		hasUmbrellaChanges(changes)
			? `Umbrella #${umbrella.number} refreshed.`
			: `Umbrella #${umbrella.number} is up to date.`
	);
}

async function applyUmbrellaChanges(
	docs: RefreshRun['docs'],
	{ prNumber, fields, labelsToAdd, labelsToRemove }: UmbrellaChanges
) {
	if (hasFieldChanges(fields)) await docs.updatePullRequest(prNumber, fields);
	if (labelsToAdd.length > 0) await docs.addLabels(prNumber, labelsToAdd);
	for (const label of labelsToRemove) await docs.removeLabel(prNumber, label);
}
