import { DOCS_STABLE_BRANCH } from '../config.ts';
import type { Repository } from '../github/repository.ts';
import type { FrameworkReleases } from '../release/queries.ts';
import { parseReleaseMarker } from './body.ts';
import { STABLE_UMBRELLA_BRANCH } from './branch.ts';
import { findOpenUmbrella, type UmbrellaPullRequest } from './queries.ts';

/**
 * An open stable umbrella whose release PR is already merged. It stays settled
 * until a maintainer merges it.
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
type ReleaseState =
	| { status: 'follows' }
	| { status: 'kept'; releasePrNumber?: number | undefined }
	| { status: 'settled'; releasePrNumber: number };

/**
 * Gets how an umbrella relates to the release PRs.
 *
 * @param {UmbrellaPullRequest} umbrella - The umbrella PR, with the release PR
 *   its body links.
 * @param {FrameworkReleases} releases - The releases of the framework.
 * @returns {Promise<ReleaseState>} The release state.
 */
export async function getReleaseState(
	umbrella: UmbrellaPullRequest,
	releases: FrameworkReleases
): Promise<ReleaseState> {
	// A prerelease umbrella always follows: its branch has continuous betas.
	if (umbrella.base !== DOCS_STABLE_BRANCH) return { status: 'follows' };
	const linkedReleasePrNumber = parseReleaseMarker(umbrella.body);
	const openReleasePrNumber = releases.stable.pullRequest?.number;
	if (
		linkedReleasePrNumber !== undefined &&
		(await isLinkedReleaseMerged(releases, linkedReleasePrNumber))
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
	releases: FrameworkReleases,
	linkedReleasePrNumber: number
): Promise<boolean> {
	if (linkedReleasePrNumber === releases.stable.pullRequest?.number) return false;
	return releases.isPullRequestMerged(linkedReleasePrNumber);
}

/**
 * Gets the open stable umbrella if it's settled.
 *
 * @param {Repository} docs - The docs repository.
 * @param {FrameworkReleases} releases - The releases of the framework.
 * @returns {Promise<SettledUmbrella | undefined>} The settled umbrella, or
 *   `undefined` when none is open or it isn't settled.
 */
export async function getSettledStableUmbrella(
	docs: Repository,
	releases: FrameworkReleases
): Promise<SettledUmbrella | undefined> {
	const umbrella = await findOpenUmbrella(docs, STABLE_UMBRELLA_BRANCH);
	if (!umbrella) return undefined;
	const state = await getReleaseState(umbrella, releases);
	return state.status === 'settled'
		? { number: umbrella.number, releasePrNumber: state.releasePrNumber }
		: undefined;
}
