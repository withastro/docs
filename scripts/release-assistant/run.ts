import {
	describeReleases,
	readFrameworkReleases,
	type FrameworkReleases,
} from './framework-release.ts';
import type { PullRequest, Repository } from './github/repository.ts';
import { joinAcceptedPullRequests, previewAcceptedPullRequests } from './join/accepted-prs.ts';
import { refreshOpenUmbrellas } from './umbrella/refresh.ts';

/** The repositories a run works with, and where it reports. */
export type ReleaseAssistantContext = {
	/** The docs repository, through the bot account. */
	docs: Repository;
	/** The framework repository, read for its release PRs. */
	astro: Repository;
	/** Where the run reports what it does, one line at a time. */
	log: (message: string) => void;
};

/** The open releases of the framework. */
export type ReleaseState = {
	releases: FrameworkReleases;
};

/** What a run knows when it starts. */
export type RunState = ReleaseState & {
	/** The open PRs of the docs repository, umbrellas included. */
	openPullRequests: PullRequest[];
};

/** The context of a run, with its state when it started. */
export type ReleaseAssistantRun = ReleaseAssistantContext & { state: RunState };

/**
 * Moves the docs PRs with the accepted label into their umbrella, then
 * refreshes every open umbrella.
 *
 * The umbrellas are refreshed even when some PRs failed, so the PRs that
 * joined are listed.
 *
 * @param {ReleaseAssistantContext} context - The repositories, and where to log.
 * @throws {GitHubError} When reading the state or listing the umbrellas fails.
 * @throws {Error} When the framework's release PR or pre mode file can't be read.
 * @throws {AggregateError} When some PRs could not join, or when the joins and the refresh both failed.
 */
export async function runLiveMode(context: ReleaseAssistantContext): Promise<void> {
	const run = await startRun(context);
	run.log(describeReleaseState(run.state));

	const errors: unknown[] = [];
	await joinAcceptedPullRequests(run).catch((error: unknown) => errors.push(error));
	await refreshOpenUmbrellas(run).catch((error: unknown) => errors.push(error));

	if (errors.length > 1) {
		// Flat, so the workflow log shows every failure.
		throw new AggregateError(
			errors.flatMap((error) => (error instanceof AggregateError ? error.errors : [error])),
			'Both the joins and the refresh of the umbrellas failed.'
		);
	}
	if (errors.length === 1) throw errors[0];
}

/**
 * Previews the join of every docs PR with the accepted label.
 *
 * @param {ReleaseAssistantContext} context - The repositories, and where to log.
 * @throws {GitHubError} When reading the state fails.
 * @throws {Error} When the framework's release PR or pre mode file can't be read.
 * @throws {AggregateError} When some PRs could not be previewed.
 */
export async function runDryRun(context: ReleaseAssistantContext): Promise<void> {
	const run = await startRun(context);
	run.log(describeReleaseState(run.state));
	await previewAcceptedPullRequests(run);
}

/** Reads the framework releases and the open docs PRs. */
async function startRun(context: ReleaseAssistantContext): Promise<ReleaseAssistantRun> {
	const [releases, openPullRequests] = await Promise.all([
		readFrameworkReleases(context.astro),
		context.docs.getOpenPullRequests(),
	]);
	return { ...context, state: { releases, openPullRequests } };
}

/** Describes what a run knows about the releases. */
function describeReleaseState({ releases }: ReleaseState): string {
	return `Releases: ${describeReleases(releases)}.`;
}
