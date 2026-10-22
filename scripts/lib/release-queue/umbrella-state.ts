import { isFrameworkPullRequestMerged } from './queries.ts';
import type { MainRelease } from './release.ts';
import { MAIN_BRANCH, MAIN_UMBRELLA_BRANCH } from './config.ts';
import type { SettledUmbrella } from './routing.ts';
import type { Repositories, Repository } from './repository.ts';
import { findOpenUmbrella, type OpenUmbrella } from './umbrella-queries.ts';
import { parseReleaseMarker } from './umbrella-body.ts';

/**
 * How an umbrella relates to the release PRs of `withastro/astro`:
 * - `follows`: it takes its title, label and link from the open release PR.
 * - `kept`: no release PR is open. It keeps what it has, and its link if any.
 * - `settled`: the release PR it links is merged. It keeps everything until a
 *   maintainer merges it, even when the next release PR opens.
 */
type ReleaseState =
	| { status: 'follows' }
	| { status: 'kept'; releasePullRequest?: number | undefined }
	| { status: 'settled'; releasePullRequest: number };

/**
 * Gets the release state of an umbrella. Prerelease umbrellas always follow:
 * their branch has continuous betas.
 */
export async function getReleaseState(
	framework: Repository,
	umbrella: OpenUmbrella,
	release: MainRelease
): Promise<ReleaseState> {
	if (umbrella.target !== MAIN_BRANCH) return { status: 'follows' };
	const linked = parseReleaseMarker(umbrella.body);
	const open = release.pullRequest?.number;
	// A release PR closed without merging settles nothing.
	if (
		linked !== undefined &&
		linked !== open &&
		(await isFrameworkPullRequestMerged(framework, linked))
	) {
		return { status: 'settled', releasePullRequest: linked };
	}
	return open === undefined
		? { status: 'kept', releasePullRequest: linked }
		: { status: 'follows' };
}

/** Gets the open `main` umbrella if it's settled, for `decideJoin`. */
export async function getSettledMainUmbrella(
	{ docs, framework }: Repositories,
	release: MainRelease
): Promise<SettledUmbrella | undefined> {
	const umbrella = await findOpenUmbrella(docs, MAIN_UMBRELLA_BRANCH);
	if (!umbrella) return undefined;
	const state = await getReleaseState(framework, umbrella, release);
	return state.status === 'settled'
		? { number: umbrella.number, releasePullRequest: state.releasePullRequest }
		: undefined;
}
