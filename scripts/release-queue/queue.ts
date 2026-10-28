import { joinAcceptedPullRequests, type ReleaseQueueContext } from './join.ts';
import { refreshOpenUmbrellas } from './refresh.ts';
import { describeReleaseState, readReleaseState } from './state.ts';

/**
 * Moves the docs PRs labeled `accepted` into their umbrella, then refreshes every open umbrella.
 *
 * The umbrellas are refreshed even when some PRs failed, so the PRs that joined are listed.
 *
 * @param {ReleaseQueueContext} context - The docs and framework repositories, where to log, and
 * the job running the release queue.
 * @throws {GitHubError} When GitHub answers with an error status outside a single PR.
 * @throws {AggregateError} When some PRs failed, after refreshing the umbrellas.
 */
export async function runReleaseQueue(context: ReleaseQueueContext): Promise<void> {
	const { astro, log } = context;
	const state = await readReleaseState(context);
	log(describeReleaseState(state, astro.fullName));

	try {
		await joinAcceptedPullRequests(context, state);
	} finally {
		await refreshOpenUmbrellas(context, state);
	}
}
