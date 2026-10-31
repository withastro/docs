// Moves the docs PRs with the accepted label into their release umbrella PR,
// then refreshes the umbrellas. Run by `.github/workflows/release-queue.yml`.
//
// Outside GitHub Actions, the run is read-only and logs the writes instead of
// sending them. To preview a docs PR locally:
// GITHUB_REPOSITORY=withastro/docs BOT_TOKEN=<token> GITHUB_TOKEN=<token> PR_NUMBER=<number> node --experimental-transform-types scripts/release-queue.ts

import { parseArgs } from 'node:util';
import { ReadOnlyRepository } from './lib/github/read-only-repository.ts';
import { GitHubRepository } from './lib/github/repository.ts';
import { FRAMEWORK_REPOSITORY, MODES, type Mode } from './release-queue/config.ts';
import { runDryRun, runLiveMode } from './release-queue/run-modes.ts';
import type { ReleaseQueueContext } from './release-queue/run-state.ts';

async function run() {
	const { values: flags } = parseArgs({
		options: {
			// `dry-run` or `live`, set by the workflow.
			mode: { type: 'string', default: MODES.dryRun },
		},
	});
	// Set by GitHub Actions.
	const isReadOnly = process.env.GITHUB_ACTIONS !== 'true';
	if (isReadOnly) console.info('Read-only run: the writes are logged, not sent.');
	const context = createContext(isReadOnly);

	if (parseMode(flags.mode) === MODES.live) {
		await runLiveMode(context);
		return;
	}

	// The PR that triggered the run, empty on a manual run.
	const prNumber = readOptionalPrNumber('PR_NUMBER');
	if (prNumber) await runDryRun(context, prNumber);
	else console.info('Dry run: no PR to preview.');
}

function createContext(isReadOnly: boolean): ReleaseQueueContext {
	// The docs repository, as `owner/repo`.
	const docsFullName = readRequiredVariable('GITHUB_REPOSITORY');
	// The bot account, which merges docs PRs and opens the umbrellas.
	const botToken = readRequiredVariable('BOT_TOKEN');
	// The workflow's own token, which reads the framework and reviews the umbrellas.
	const workflowToken = readRequiredVariable('GITHUB_TOKEN');
	const createDocsRepository = (token: string) =>
		isReadOnly
			? new ReadOnlyRepository({ fullName: docsFullName, token, log: console.info })
			: new GitHubRepository({ fullName: docsFullName, token });

	return {
		docs: createDocsRepository(botToken),
		astro: new GitHubRepository({ fullName: FRAMEWORK_REPOSITORY, token: workflowToken }),
		reviewer: createDocsRepository(workflowToken),
		log: console.info,
		// Set by GitHub Actions.
		jobName: process.env.GITHUB_JOB || null,
	};
}

function readRequiredVariable(name: string) {
	const value = process.env[name];
	if (!value) throw new Error(`The ${name} environment variable is required.`);
	return value;
}

function parseMode(value: string): Mode {
	const mode = Object.values(MODES).find((knownMode) => knownMode === value);
	if (!mode) {
		throw new Error(`--mode must be one of: ${Object.values(MODES).join(', ')}. Got: "${value}".`);
	}
	return mode;
}

/** Reads a PR number, or `null` when the variable is empty. */
function readOptionalPrNumber(name: string) {
	const value = process.env[name];
	if (!value) return null;

	const prNumber = Number(value);
	if (!Number.isInteger(prNumber) || prNumber <= 0) {
		throw new Error(`${name} must be a pull request number. Got: "${value}".`);
	}
	return prNumber;
}

await run();
