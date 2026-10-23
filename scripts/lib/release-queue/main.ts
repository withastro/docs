import { readFile } from 'node:fs/promises';
import { handleAcceptedPullRequest } from './accepted/handle.ts';
import { chooseAction, parseEvent, type RunEvent } from './cli.ts';
import { DOCS_REPO, FRAMEWORK_REPO } from './config.ts';
import { GitHubClient, PrintingGitHubClient } from './github/client.ts';
import { Repository } from './github/repository.ts';
import { isDryRun, parseMode } from './modes.ts';
import type { RunContext } from './run-context.ts';
import { refreshOpenUmbrellas } from './umbrella/refresh.ts';

/** The command-line flags of `scripts/release-queue.ts`. */
export interface Flags {
	pr?: string | undefined;
	refresh: boolean;
	/** Who added the label, for the write access check. */
	sender?: string | undefined;
	write: boolean;
}

/** The environment variables the release queue reads. */
export interface Env {
	/** For reads, dry-run comments and merge-block reviews. */
	GITHUB_TOKEN?: string | undefined;
	/** The token of the bot account, for joins, refusals and refreshes. */
	BOT_TOKEN?: string | undefined;
	/** A dry run by default: see `Mode`. */
	MODE?: string | undefined;
	// Set by GitHub Actions.
	GITHUB_ACTIONS?: string | undefined;
	GITHUB_EVENT_NAME?: string | undefined;
	GITHUB_EVENT_PATH?: string | undefined;
	GITHUB_REPOSITORY?: string | undefined;
}

/**
 * Routes a docs PR labeled as accepted, or refreshes the open umbrella PRs.
 *
 * In GitHub Actions, the event says which, and the writes are sent. In a local
 * run, the flags say which, and the writes are printed unless `write` is set.
 *
 * @param {object} input - The input of the run.
 * @param {Flags} input.flags - The command-line flags.
 * @param {Env} input.env - The environment variables.
 * @throws {Error} When a token or the label sender is missing, or when the
 *   flags and the event don't say what to do.
 */
export async function runReleaseQueue({ flags, env }: { flags: Flags; env: Env }) {
	const run = createRunContext(flags, env);
	const event = await readEvent(env.GITHUB_EVENT_PATH);
	const action = chooseAction({
		pr: flags.pr,
		isRefreshRequested: flags.refresh,
		eventName: env.GITHUB_EVENT_NAME,
		eventPullRequest: event.pullRequest,
	});

	if (action.type === 'refresh') {
		await refreshOpenUmbrellas(run);
	} else {
		const labelSender = getLabelSender(flags, env, event);
		await handleAcceptedPullRequest(run, action.prNumber, labelSender);
	}
}

const isGitHubActions = (env: Env) => env.GITHUB_ACTIONS === 'true';

function createRunContext(flags: Flags, env: Env): RunContext {
	const mode = parseMode(env.MODE);
	const token = env.GITHUB_TOKEN;
	if (!token) throw new Error('GITHUB_TOKEN is required.');
	const shouldWrite = isGitHubActions(env) || flags.write;
	// Changes go through the bot account: unlike `GITHUB_TOKEN`, its merges into
	// an umbrella branch trigger the checks of the umbrella PR.
	const botToken = env.BOT_TOKEN;
	if (shouldWrite && !isDryRun(mode) && !botToken) {
		throw new Error(`BOT_TOKEN is required in ${mode} mode.`);
	}

	const Client = shouldWrite ? GitHubClient : PrintingGitHubClient;
	const actionsClient = new Client(token);
	const repo = env.GITHUB_REPOSITORY ?? DOCS_REPO;
	return {
		actions: new Repository(actionsClient, repo),
		bot: new Repository(new Client(botToken ?? token), repo),
		framework: new Repository(actionsClient, FRAMEWORK_REPO),
		mode,
	};
}

async function readEvent(path: string | undefined): Promise<RunEvent> {
	return path ? parseEvent(await readFile(path, 'utf-8'), path) : {};
}

/**
 * Gets who added the label. Only a local run can go without one, which skips
 * the write access check.
 */
function getLabelSender(flags: Flags, env: Env, event: RunEvent): string | undefined {
	const labelSender = flags.sender ?? event.labelSender;
	if (labelSender === undefined && isGitHubActions(env)) {
		throw new Error('The event has no sender: the write access check needs one.');
	}
	return labelSender;
}
