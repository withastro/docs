import { canActOn } from './modes.ts';
import { readFrameworkReleases } from './release/queries.ts';
import type { RunContext } from './run-context.ts';
import { listOpenUmbrellas, type UmbrellaPullRequest } from './umbrella/queries.ts';
import { UmbrellaRefresher } from './umbrella/refresh.ts';

/**
 * Refreshes every open umbrella PR the mode acts on, for example after a
 * change to a release PR.
 *
 * @param {RunContext} run - The repositories and the mode of the run.
 * @throws {AggregateError} Once every umbrella was tried, when some of them
 *   couldn't be refreshed.
 */
export async function refreshOpenUmbrellas(run: RunContext) {
	const { actions, framework, mode } = run;
	const [umbrellas, releases] = await Promise.all([
		listOpenUmbrellas(actions),
		readFrameworkReleases(framework),
	]);
	const numbers = umbrellas.map(({ number }) => `#${number}`).join(', ');
	console.info(`Open umbrellas: ${numbers || 'none'}.`);

	const { live: liveUmbrellas = [], skipped = [] } = Object.groupBy(umbrellas, (umbrella) =>
		canActOn(mode, umbrella.base) ? 'live' : 'skipped'
	);
	for (const umbrella of skipped) {
		console.info(`Skipped #${umbrella.number}: dry run for ${umbrella.base}.`);
	}
	const refresher = new UmbrellaRefresher(run, releases);
	const failures: Error[] = [];
	// One after the other, as GitHub advises for writes: concurrent ones can
	// hit its secondary rate limits.
	for (const umbrella of liveUmbrellas) {
		const failure = await tryRefreshUmbrella(refresher, umbrella);
		if (failure) failures.push(failure);
	}
	if (failures.length > 0) {
		throw new AggregateError(
			failures,
			`Couldn't refresh ${failures.length} of ${liveUmbrellas.length} umbrella PRs.`
		);
	}
}

/**
 * Refreshes an umbrella PR without a join. Catches a failure, so the other
 * umbrellas still get refreshed.
 */
async function tryRefreshUmbrella(
	refresher: UmbrellaRefresher,
	umbrella: UmbrellaPullRequest
): Promise<Error | undefined> {
	try {
		// Without a join, a dismissed review still covers the included PRs.
		await refresher.refresh(umbrella, { shouldBlock: false });
		return undefined;
	} catch (error) {
		return new Error(`Couldn't refresh #${umbrella.number}.`, { cause: error });
	}
}
