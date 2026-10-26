import { FRAMEWORK_STABLE_BRANCH } from './config.ts';
import { canActOn } from './modes.ts';
import { getReleasePullRequest } from './release/queries.ts';
import { getStableRelease, type StableRelease } from './release/release.ts';
import type { RunContext } from './run-context.ts';
import { listOpenUmbrellas, type UmbrellaPullRequest } from './umbrella/queries.ts';
import { refreshUmbrella } from './umbrella/refresh.ts';

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
	const [umbrellas, releasePullRequest] = await Promise.all([
		listOpenUmbrellas(actions),
		getReleasePullRequest(framework, FRAMEWORK_STABLE_BRANCH),
	]);
	const release = getStableRelease(releasePullRequest);
	const numbers = umbrellas.map(({ number }) => `#${number}`).join(', ');
	console.info(`Open umbrellas: ${numbers || 'none'}.`);

	const { live: liveUmbrellas = [], skipped = [] } = Object.groupBy(umbrellas, (umbrella) =>
		canActOn(mode, umbrella.base) ? 'live' : 'skipped'
	);
	for (const umbrella of skipped) {
		console.info(`Skipped #${umbrella.number}: dry run for ${umbrella.base}.`);
	}
	const failures: Error[] = [];
	// One after the other, as GitHub advises for writes: concurrent ones can
	// hit its secondary rate limits.
	for (const umbrella of liveUmbrellas) {
		const failure = await tryRefreshUmbrella(run, umbrella, release);
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
	run: RunContext,
	umbrella: UmbrellaPullRequest,
	release: StableRelease
): Promise<Error | undefined> {
	try {
		// Without a join, a dismissed review still covers the included PRs.
		await refreshUmbrella(run, umbrella, { release, shouldBlock: false });
		return undefined;
	} catch (error) {
		return new Error(`Couldn't refresh #${umbrella.number}.`, { cause: error });
	}
}
