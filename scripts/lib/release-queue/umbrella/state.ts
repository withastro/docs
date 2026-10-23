import { STABLE_BRANCH, STABLE_UMBRELLA_BRANCH } from '../config.ts';
import type { Repository } from '../github/repository.ts';
import type { Repositories } from '../options.ts';
import { isFrameworkPullRequestMerged } from '../release/queries.ts';
import type { StableRelease } from '../release/release.ts';
import { parseReleaseMarker } from './body.ts';
import { findOpenUmbrella, type UmbrellaPullRequest } from './queries.ts';

/**
 * The open stable umbrella once the release PR it ships with is merged, until
 * the umbrella itself is merged.
 */
export interface SettledUmbrella {
	number: number;
	/** The merged release PR of the framework repository. */
	releasePrNumber: number;
}

/**
 * How an umbrella relates to the release PRs of the framework repository:
 * - `follows`: it takes its title, label and link from the open release PR.
 * - `kept`: no release PR is open. It keeps what it has, and its link if any.
 * - `settled`: the release PR it links is merged. It keeps everything until a
 *   maintainer merges it, even when the next release PR opens.
 */
export type ReleaseState =
	| { status: 'follows' }
	| { status: 'kept'; releasePrNumber?: number | undefined }
	| { status: 'settled'; releasePrNumber: number };

/**
 * Gets how an umbrella relates to the release PRs.
 *
 * @param {Repository} framework - The framework repository.
 * @param {UmbrellaPullRequest} umbrella - The umbrella PR, with the release PR
 *   its body links.
 * @param {StableRelease} release - The next release from the stable branch.
 * @returns {Promise<ReleaseState>} The release state. A prerelease umbrella
 *   always follows: its branch has continuous betas.
 */
export async function getReleaseState(
	framework: Repository,
	umbrella: UmbrellaPullRequest,
	release: StableRelease
): Promise<ReleaseState> {
	if (umbrella.base !== STABLE_BRANCH) return { status: 'follows' };
	const linkedReleasePrNumber = parseReleaseMarker(umbrella.body);
	const openReleasePrNumber = release.pullRequest?.number;
	if (
		linkedReleasePrNumber !== undefined &&
		(await isLinkedReleaseMerged(framework, linkedReleasePrNumber, openReleasePrNumber))
	) {
		return { status: 'settled', releasePrNumber: linkedReleasePrNumber };
	}
	return openReleasePrNumber === undefined
		? { status: 'kept', releasePrNumber: linkedReleasePrNumber }
		: { status: 'follows' };
}

/**
 * Whether the linked release PR is merged. A release PR closed without
 * merging settles nothing, and the open one isn't merged yet.
 */
async function isLinkedReleaseMerged(
	framework: Repository,
	linkedReleasePrNumber: number,
	openReleasePrNumber: number | undefined
): Promise<boolean> {
	if (linkedReleasePrNumber === openReleasePrNumber) return false;
	return isFrameworkPullRequestMerged(framework, linkedReleasePrNumber);
}

/**
 * Gets the open stable umbrella if it's settled.
 *
 * @param {Repositories} repositories - The docs and framework repositories.
 * @param {StableRelease} release - The next release from the stable branch.
 * @returns {Promise<SettledUmbrella | undefined>} The settled umbrella, or
 *   `undefined` when none is open or it isn't settled.
 */
export async function getSettledStableUmbrella(
	{ docs, framework }: Repositories,
	release: StableRelease
): Promise<SettledUmbrella | undefined> {
	const umbrella = await findOpenUmbrella(docs, STABLE_UMBRELLA_BRANCH);
	if (!umbrella) return undefined;
	const state = await getReleaseState(framework, umbrella, release);
	return state.status === 'settled'
		? { number: umbrella.number, releasePrNumber: state.releasePrNumber }
		: undefined;
}
