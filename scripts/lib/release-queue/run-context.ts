import { DOCS_REPO, FRAMEWORK_REPO } from './config.ts';
import { GitHubClient, PrintingGitHubClient } from './github/client.ts';
import { Repository } from './github/repository.ts';
import { isDryRun, parseMode, type Mode } from './modes.ts';

/** The environment variables that set how a run reaches GitHub. */
export interface RunEnv {
	/** Used for reads, dry-run comments and merge-block reviews. */
	GITHUB_TOKEN?: string | undefined;
	/** Used for joins, refusals and refreshes. */
	BOT_TOKEN?: string | undefined;
	/** The bot mode. */
	MODE?: string | undefined;
	// The variables below are set by GitHub Actions.
	GITHUB_ACTIONS?: string | undefined;
	GITHUB_REPOSITORY?: string | undefined;
}

/** The repositories a run acts through, and its mode. */
export interface RunContext {
	/**
	 * The docs repository through `GITHUB_TOKEN`: reads the PR, posts dry-run
	 * comments, and submits merge-block reviews.
	 */
	actions: Repository;
	/** The docs repository as the bot account: joins, refuses, and refreshes. */
	bot: Repository;
	/** The framework repository, read for its release PRs. */
	framework: Repository;
	mode: Mode;
}

/**
 * Whether the run is in GitHub Actions, where writes are sent.
 *
 * @param {RunEnv} env - The environment variables of the run.
 * @returns {boolean} `true` in GitHub Actions, `false` in a local run.
 */
export function isGitHubActions(env: RunEnv): boolean {
	return env.GITHUB_ACTIONS === 'true';
}

/**
 * Creates the repositories of a run from its environment. A local run gets
 * repositories that print their writes instead of sending them.
 *
 * @param {RunEnv} env - The environment variables of the run.
 * @returns {RunContext} The repositories and the mode of the run.
 * @throws {Error} When `MODE` is unknown, `GITHUB_TOKEN` is missing, or
 *   `BOT_TOKEN` is missing in GitHub Actions outside a dry run.
 */
export function createRunContext(env: RunEnv): RunContext {
	const mode = parseMode(env.MODE);
	const token = env.GITHUB_TOKEN;
	if (!token) throw new Error('GITHUB_TOKEN is required.');
	// A local run never changes GitHub: it prints what it would write.
	const shouldWrite = isGitHubActions(env);
	// Changes go through the bot account, as its merges into an umbrella branch
	// trigger the checks of the umbrella PR.
	const botToken = env.BOT_TOKEN;
	if (shouldWrite && !isDryRun(mode) && !botToken) {
		throw new Error(`BOT_TOKEN is required when MODE is ${mode}.`);
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
