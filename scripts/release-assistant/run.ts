import type { PullRequest, Repository } from './github/repository.ts';
import { previewAcceptedPullRequests } from './join/accepted-prs.ts';

/** The repositories a run works with, and where it reports. */
export type ReleaseAssistantContext = {
	/** The docs repository, through the bot account. */
	docs: Repository;
	/** Where the run reports what it does, one line at a time. */
	log: (message: string) => void;
};

/** What a run knows when it starts. */
export type RunState = {
	/** The open PRs of the docs repository, umbrellas included. */
	openPullRequests: PullRequest[];
};

/** The context of a run, with its state when it started. */
export type ReleaseAssistantRun = ReleaseAssistantContext & { state: RunState };

/**
 * Previews the join of every docs PR with the accepted label.
 *
 * @param {ReleaseAssistantContext} context - The repositories, and where to log.
 * @throws {GitHubError} When reading the state fails.
 * @throws {AggregateError} When some PRs could not be previewed.
 */
export async function runDryRun(context: ReleaseAssistantContext): Promise<void> {
	const run = await startRun(context);
	await previewAcceptedPullRequests(run);
}

/** Reads the open docs PRs. */
async function startRun(context: ReleaseAssistantContext): Promise<ReleaseAssistantRun> {
	const openPullRequests = await context.docs.getOpenPullRequests();
	return { ...context, state: { openPullRequests } };
}
