import { joinAcceptedPullRequests, type ReleaseQueueContext } from './join.ts';
import { refreshOpenUmbrellas } from './refresh.ts';
import { describeReleases, readFrameworkReleases } from './release.ts';

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
	const releases = await readFrameworkReleases(astro);
	log(`Releases: ${describeReleases(releases, astro.fullName)}.`);

	try {
		await joinAcceptedPullRequests(context, releases);
	} finally {
		await refreshOpenUmbrellas(context, releases);
	}
}
