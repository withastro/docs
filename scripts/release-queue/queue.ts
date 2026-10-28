import { joinAcceptedPullRequests } from './join.ts';
import { refreshOpenUmbrellas } from './refresh.ts';
import { describeReleaseState, startRun, type ReleaseQueueContext } from './run.ts';

/**
 * Moves the docs PRs with the accepted label into their umbrella, then refreshes every open
 * umbrella.
 *
 * The umbrellas are refreshed even when some PRs failed, so the PRs that joined are listed.
 *
 * @param {ReleaseQueueContext} context - The repositories, and where to log.
 * @throws {GitHubError} When reading the state or refreshing the umbrellas fails.
 * @throws {Error} When the framework's release PR or pre mode file can't be read.
 * @throws {AggregateError} When some PRs could not join, or when the joins and the refresh both
 * failed.
 */
export async function runReleaseQueue(context: ReleaseQueueContext): Promise<void> {
	const run = await startRun(context);
	run.log(describeReleaseState(run.state, run.astro.fullName));

	const errors: unknown[] = [];
	await joinAcceptedPullRequests(run).catch((error: unknown) => errors.push(error));
	await refreshOpenUmbrellas(run).catch((error: unknown) => errors.push(error));

	if (errors.length > 1) {
		throw new AggregateError(errors, 'Both the joins and the refresh of the umbrellas failed.');
	}
	if (errors.length === 1) throw errors[0];
}
