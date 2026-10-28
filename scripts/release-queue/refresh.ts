import type {
	GitHubRepository,
	PullRequest,
	PullRequestChanges,
} from '../lib/github/repository.ts';
import { DOCS_STABLE_BRANCH, RELEASE_TYPES } from './config.ts';
import { syncMergeBlockReview, type MergeChecklist } from './merge-block.ts';
import type { FrameworkRelease } from './release.ts';
import type { ReleaseState } from './state.ts';
import {
	getIncludedPrNumbers,
	getUmbrellaBranch,
	getUmbrellaRelease,
	isUmbrellaPullRequest,
	planUmbrellaUpdate,
	type UmbrellaUpdate,
} from './umbrella.ts';

type UmbrellaRepository = Pick<
	GitHubRepository,
	'fullName' | 'getOpenPullRequests' | 'compare' | 'updatePullRequest' | 'addLabels' | 'removeLabel'
>;

type RefreshContext = {
	docs: UmbrellaRepository;
	/** The repository to review umbrellas with, from another account than the one opening them. */
	reviewer: Pick<GitHubRepository, 'getReviews' | 'requestChanges' | 'updateReview'>;
	log: (message: string) => void;
};

/** What the refresh of an umbrella reads besides the umbrella itself. */
type UmbrellaFacts = Pick<MergeChecklist, 'isReleaseMerged' | 'openPrNumbers'> & {
	/** The release to apply, or `null` to keep the current one. */
	release: FrameworkRelease | null;
};

type Umbrella = Pick<PullRequest, 'number' | 'title' | 'body' | 'labels' | 'base'>;

/**
 * Refreshes every open umbrella PR of the docs repository, and the review that blocks its merge.
 *
 * A settled umbrella keeps its release, and only its list of PRs changes. While the next stable
 * release is a major, the stable umbrella is left to maintainers, who merge it into the
 * prerelease branch.
 *
 * @param {RefreshContext} context - The docs repository, the repository to review with, and where
 * to log.
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
		await refreshUmbrella(context, umbrella, readUmbrellaFacts(umbrella, pullRequests, state));
	}
}

function readUmbrellaFacts(
	umbrella: Umbrella,
	openPullRequests: Pick<PullRequest, 'number' | 'base'>[],
	state: ReleaseState
): UmbrellaFacts {
	const umbrellaBranch = getUmbrellaBranch(umbrella.base.ref);
	return {
		release: getReleaseToApply(umbrella, state),
		isReleaseMerged: state.settledBaseBranches.includes(umbrella.base.ref),
		openPrNumbers: openPullRequests
			.filter(({ base }) => base.ref === umbrellaBranch)
			.map(({ number }) => number),
	};
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
 * with and the PRs merged into its branch, then the review that blocks its merge.
 *
 * Sends nothing for what is already up to date.
 *
 * @param {RefreshContext} context - The docs repository, the repository to review with, and where
 * to log.
 * @param {Umbrella} umbrella - The umbrella PR.
 * @param {UmbrellaFacts} facts - The release to apply, and what the checklist needs.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
async function refreshUmbrella(
	context: RefreshContext,
	umbrella: Umbrella,
	{ release, isReleaseMerged, openPrNumbers }: UmbrellaFacts
): Promise<void> {
	const { docs, log } = context;
	const route = {
		umbrellaBranch: getUmbrellaBranch(umbrella.base.ref),
		umbrellaBaseBranch: umbrella.base.ref,
	};
	const comparison = await docs.compare(route.umbrellaBaseBranch, route.umbrellaBranch);
	const includedPrNumbers = getIncludedPrNumbers(comparison);
	const update = planUmbrellaUpdate(umbrella, release, includedPrNumbers);
	const isChanged = await applyUmbrellaUpdate(docs, umbrella, update);
	log(
		isChanged
			? `Umbrella #${umbrella.number} refreshed.`
			: `Umbrella #${umbrella.number} is up to date.`
	);

	await syncMergeBlockReview(context, umbrella.number, {
		route,
		releasePrNumber: update.releasePrNumber,
		isReleaseMerged,
		openPrNumbers,
		includedPrNumbers,
	});
}

/** Sends the changes of an umbrella update, and tells whether there were any. */
async function applyUmbrellaUpdate(
	docs: UmbrellaRepository,
	umbrella: Umbrella,
	update: UmbrellaUpdate
) {
	const changes = getChangedFields(umbrella, update);
	const hasFieldChanges = Object.keys(changes).length > 0;
	if (hasFieldChanges) await docs.updatePullRequest(umbrella.number, changes);
	if (update.labelsToAdd.length > 0) await docs.addLabels(umbrella.number, update.labelsToAdd);
	for (const label of update.labelsToRemove) await docs.removeLabel(umbrella.number, label);

	return hasFieldChanges || update.labelsToAdd.length > 0 || update.labelsToRemove.length > 0;
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
