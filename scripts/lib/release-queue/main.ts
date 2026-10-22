import { readFile } from 'node:fs/promises';
import { chooseAction, parseEvent, type RunEvent } from './cli.ts';
import { DOCS_REPO, FRAMEWORK_REPO } from './config.ts';
import { GitHubClient } from './github.ts';
import { handleAcceptedPullRequest } from './handle-accepted.ts';
import { needsBotToken, parseMode, type QueueOptions } from './modes.ts';
import { PrintingGitHubClient } from './printing-github-client.ts';
import { refreshOpenUmbrellas } from './refresh.ts';
import { Repository } from './repository.ts';

/** The command-line flags of `scripts/release-queue.ts`. */
export interface Flags {
	pr?: string | undefined;
	refresh: boolean;
	sender?: string | undefined;
	write: boolean;
}

/** The environment variables the release queue reads. */
export interface Env {
	/** Reads, dry-run comments and merge-block reviews. */
	GITHUB_TOKEN?: string | undefined;
	/** The bot account, for joins, refusals and refreshes. */
	BOT_TOKEN?: string | undefined;
	/** `dry-run` by default: see `Mode`. */
	MODE?: string | undefined;
	// Set by GitHub Actions.
	GITHUB_ACTIONS?: string | undefined;
	GITHUB_EVENT_NAME?: string | undefined;
	GITHUB_EVENT_PATH?: string | undefined;
	GITHUB_REPOSITORY?: string | undefined;
}

/**
 * Routes a docs PR labeled `accepted`, or refreshes the open umbrella PRs.
 * In GitHub Actions, the event says which, and the writes are sent. In a
 * local run, the flags say which, and the writes are printed unless `write`.
 */
export async function runReleaseQueue({ flags, env }: { flags: Flags; env: Env }) {
	const shouldWrite = env.GITHUB_ACTIONS === 'true' || flags.write;
	const options = createOptions(env, shouldWrite);
	const event = await readEvent(env.GITHUB_EVENT_PATH);
	const action = chooseAction({
		pr: flags.pr,
		refresh: flags.refresh,
		eventName: env.GITHUB_EVENT_NAME,
		eventPullRequest: event.pullRequest,
	});

	if (action.type === 'refresh') {
		await refreshOpenUmbrellas(options);
	} else {
		await handleAcceptedPullRequest(options, action.prNumber, flags.sender ?? event.sender);
	}
}

function createOptions(env: Env, shouldWrite: boolean): QueueOptions {
	const mode = parseMode(env.MODE);
	const token = env.GITHUB_TOKEN;
	if (!token) throw new Error('GITHUB_TOKEN is required.');
	// Changes go through the bot account: unlike `GITHUB_TOKEN`, its merges into
	// an umbrella branch trigger the checks of the umbrella PR.
	const botToken = env.BOT_TOKEN;
	if (needsBotToken(mode, shouldWrite) && !botToken) {
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
