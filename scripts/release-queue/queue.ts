import { joinAcceptedPullRequests } from './join.ts';
import { refreshOpenUmbrellas } from './refresh.ts';
import { describeReleaseState, startRun, type ReleaseQueueContext } from './run.ts';

/**
 * Moves the docs PRs with the accepted label into their umbrella, then refreshes every open
 * umbrella.
 *
 * The umbrellas are refreshed even when some PRs failed, so the PRs that joined are listed.
 *
 * @param {ReleaseQueueContext} context - The repositories to read and write, where to log, and the
 * job running the release queue.
 * @throws {GitHubError} When GitHub answers with an error status outside a single PR.
 * @throws {AggregateError} When some PRs failed, after refreshing the umbrellas.
 */
export async function runReleaseQueue(context: ReleaseQueueContext): Promise<void> {
	const run = await startRun(context);
	run.log(describeReleaseState(run.state, run.astro.fullName));

	try {
		await joinAcceptedPullRequests(run);
	} finally {
		await refreshOpenUmbrellas(run);
	}
}
