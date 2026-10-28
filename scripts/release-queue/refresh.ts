import type {
	GitHubRepository,
	PullRequest,
	PullRequestChanges,
} from '../lib/github/repository.ts';
import { DOCS_STABLE_BRANCH, RELEASE_TYPES } from './config.ts';
import type { FrameworkRelease } from './release.ts';
import type { ReleaseState } from './state.ts';
import {
	getIncludedPrNumbers,
	getUmbrellaBranch,
	getUmbrellaRelease,
	isUmbrellaPullRequest,
	planUmbrellaUpdate,
} from './umbrella.ts';

type UmbrellaRepository = Pick<
	GitHubRepository,
	'fullName' | 'getOpenPullRequests' | 'compare' | 'updatePullRequest' | 'addLabels' | 'removeLabel'
>;

type RefreshContext = {
	docs: UmbrellaRepository;
	log: (message: string) => void;
};

type Umbrella = Pick<PullRequest, 'number' | 'title' | 'body' | 'labels' | 'base'>;

/**
 * Refreshes every open umbrella PR of the docs repository.
 *
 * A settled umbrella keeps its release, and only its list of PRs changes. While the next stable
 * release is a major, the stable umbrella is left to maintainers, who merge it into the
 * prerelease branch.
 *
 * @param {RefreshContext} context - The docs repository, and where to log.
 * @param {ReleaseState} state - The open releases, and the settled umbrellas.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function refreshOpenUmbrellas(
	context: RefreshContext,
	state: ReleaseState
): Promise<void> {
	const { docs, log } = context;
	const pullRequests = await docs.getOpenPullRequests();
	const umbrellas = pullRequests.filter((pullRequest) =>
		isUmbrellaPullRequest(pullRequest, docs.fullName)
	);
	log(`Open umbrellas: ${umbrellas.map(({ number }) => `#${number}`).join(', ') || 'none'}.`);
	for (const umbrella of umbrellas) {
		if (isWaitingForMajorRelease(umbrella, state)) {
			log(
				`Umbrella #${umbrella.number} skipped: the next stable release is a major, so a maintainer merges it into the prerelease branch.`
			);
			continue;
		}
		await refreshUmbrella(context, umbrella, getReleaseToApply(umbrella, state));
	}
}

function isWaitingForMajorRelease({ base }: Umbrella, { releases }: ReleaseState) {
	return base.ref === DOCS_STABLE_BRANCH && releases.stable?.type === RELEASE_TYPES.major;
}

/** Gets the release an umbrella ships with, or `null` to keep the one of a settled umbrella. */
function getReleaseToApply({ base }: Umbrella, { releases, settledBaseBranches }: ReleaseState) {
	return settledBaseBranches.includes(base.ref) ? null : getUmbrellaRelease(releases, base.ref);
}

/**
 * Updates the title, the description, and the labels of an umbrella PR from the release it ships
 * with and the PRs merged into its branch.
 *
 * Sends nothing for what is already up to date.
 *
 * @param {RefreshContext} context - The docs repository, and where to log.
 * @param {Umbrella} umbrella - The umbrella PR.
 * @param {FrameworkRelease | null} release - The release to apply, or `null` to keep the current
 * one.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
async function refreshUmbrella(
	{ docs, log }: RefreshContext,
	umbrella: Umbrella,
	release: FrameworkRelease | null
): Promise<void> {
	const baseBranch = umbrella.base.ref;
	const comparison = await docs.compare(baseBranch, getUmbrellaBranch(baseBranch));
	const update = planUmbrellaUpdate(umbrella, release, getIncludedPrNumbers(comparison));
	const changes = getChangedFields(umbrella, update);
	const hasChanges = Object.keys(changes).length > 0;
	if (hasChanges) await docs.updatePullRequest(umbrella.number, changes);
	if (update.labelsToAdd.length > 0) await docs.addLabels(umbrella.number, update.labelsToAdd);
	for (const label of update.labelsToRemove) await docs.removeLabel(umbrella.number, label);

	const isChanged = hasChanges || update.labelsToAdd.length > 0 || update.labelsToRemove.length > 0;
	log(
		isChanged
			? `Umbrella #${umbrella.number} refreshed.`
			: `Umbrella #${umbrella.number} is up to date.`
	);
}

function getChangedFields(
	umbrella: Pick<Umbrella, 'title' | 'body'>,
	{ title, body }: Pick<PullRequestChanges, 'title' | 'body'>
): PullRequestChanges {
	return {
		...(title !== umbrella.title && { title }),
		...(body !== umbrella.body && { body }),
	};
}
