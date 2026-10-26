import { readFile } from 'node:fs/promises';
import { chooseAction, parseEvent, type RunEvent } from './cli.ts';
import { handleAcceptedPullRequest } from './handle-accepted.ts';
import { refreshOpenUmbrellas } from './refresh-umbrellas.ts';
import { createRunContext, isGitHubActions, type RunEnv } from './run-context.ts';

/** The command-line flags of `scripts/release-queue.ts`. */
interface Flags {
	pr?: string | undefined;
	'preview-refresh': boolean;
	/** Who added the label, for the write access check. */
	sender?: string | undefined;
}

/** The environment variables the release queue reads. */
interface Env extends RunEnv {
	// The variables below are set by GitHub Actions.
	GITHUB_EVENT_NAME?: string | undefined;
	GITHUB_EVENT_PATH?: string | undefined;
}

/**
 * Routes a docs PR labeled as accepted, or refreshes the open umbrella PRs.
 *
 * In GitHub Actions, the event says which, and the writes are sent. In a local
 * run, the flags say which, and the writes are only printed.
 *
 * @param {object} input - The input of the run.
 * @param {Flags} input.flags - The command-line flags.
 * @param {Env} input.env - The environment variables.
 * @throws {Error} When a token or the label sender is missing, or when the
 *   flags and the event don't say what to do.
 */
export async function runReleaseQueue({ flags, env }: { flags: Flags; env: Env }) {
	const run = createRunContext(env);
	const event = await readEvent(env.GITHUB_EVENT_PATH);
	const action = chooseAction({
		pr: flags.pr,
		sender: flags.sender,
		isRefreshRequested: flags['preview-refresh'],
		eventName: env.GITHUB_EVENT_NAME,
		eventPullRequest: event.pullRequest,
		eventSender: event.labelSender,
		isSenderRequired: isGitHubActions(env),
	});

	if (action.type === 'refresh') {
		await refreshOpenUmbrellas(run);
	} else {
		await handleAcceptedPullRequest(run, action);
	}
}

async function readEvent(path: string | undefined): Promise<RunEvent> {
	return path ? parseEvent(await readFile(path, 'utf-8'), path) : {};
}
