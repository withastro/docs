// Moves the docs PRs with the accepted label into their umbrella PR, and
// refreshes the umbrella PRs. Run by `.github/workflows/release-assistant.yml`,
// through `actions/github-script`.

import type { context as actionsContext } from '@actions/github';
import { FRAMEWORK_REPOSITORY, MODES, type Mode } from './release-assistant/config.ts';
import { GitHubRepository, type Octokit } from './release-assistant/github/repository.ts';
import { runDryRun, runLiveMode, type ReleaseAssistantContext } from './release-assistant/run.ts';

type RunOptions = {
	/** The client `actions/github-script` creates, with the bot token. */
	github: Octokit;
	/**
	 * A client with the workflow's `GITHUB_TOKEN`. It reads the framework
	 * repository and reviews the umbrella PRs.
	 */
	workflowGithub: Octokit;
	/** The workflow run, as `actions/github-script` gives it. */
	context: Pick<typeof actionsContext, 'repo'>;
	/** One of `MODES`. */
	mode: string;
};

/**
 * Runs the release assistant in live or dry-run mode.
 *
 * @param {RunOptions} options - The clients, the workflow context, and the mode.
 * @throws {Error} When the mode is unknown, or when the run fails.
 */
export async function runReleaseAssistant({
	github,
	workflowGithub,
	context,
	mode,
}: RunOptions): Promise<void> {
	const runMode = parseMode(mode);
	const runContext: ReleaseAssistantContext = {
		docs: new GitHubRepository(github, context.repo),
		astro: new GitHubRepository(workflowGithub, FRAMEWORK_REPOSITORY),
		reviewer: new GitHubRepository(workflowGithub, context.repo),
		log: console.info,
	};

	if (runMode === MODES.live) await runLiveMode(runContext);
	else await runDryRun(runContext);
}

function parseMode(value: string): Mode {
	const mode = Object.values(MODES).find((knownMode) => knownMode === value);
	if (!mode) {
		throw new Error(
			`The mode must be one of: ${Object.values(MODES).join(', ')}. Got: "${value}".`
		);
	}
	return mode;
}
