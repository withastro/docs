// Moves the docs PRs with the accepted label into their release umbrella PR, then refreshes the
// umbrellas. In dry-run mode (`RELEASE_QUEUE_MODE` in `release-queue/config.ts`), only comments on
// the PR that triggered the run. Run by `.github/workflows/release-queue.yml`.
//
// Environment variables:
// - `GITHUB_REPOSITORY`: the docs repository, as `owner/repo`.
// - `BOT_TOKEN`: writes on the docs repository, through the bot account.
// - `GITHUB_TOKEN`: reads the framework repository, and reviews the umbrellas.
// - `GITHUB_JOB`: the job to leave out of the PR's checks. Optional.
// - `PR_NUMBER`: the PR to comment on in dry-run mode. Empty on a manual run.
//
// Flags, for local runs:
// - `--read-only`: logs the writes instead of sending them.
// - `--mode <mode>`: runs in another mode than `RELEASE_QUEUE_MODE`.

import { parseArgs } from 'node:util';
import { ReadOnlyRepository } from './lib/github/read-only-repository.ts';
import { GitHubRepository } from './lib/github/repository.ts';
import {
	FRAMEWORK_REPOSITORY,
	MODES,
	RELEASE_QUEUE_MODE,
	type Mode,
} from './release-queue/config.ts';
import { previewJoin } from './release-queue/join.ts';
import { runReleaseQueue } from './release-queue/queue.ts';

const { values: flags } = parseArgs({
	options: {
		'read-only': { type: 'boolean', default: false },
		mode: { type: 'string', default: RELEASE_QUEUE_MODE },
	},
});
const isReadOnly = flags['read-only'];
const workflowToken = readRequiredVariable('GITHUB_TOKEN');
const docs = createDocsRepository({ token: readRequiredVariable('BOT_TOKEN'), isReadOnly });
const reviewer = createDocsRepository({ token: workflowToken, isReadOnly });
const astro = new GitHubRepository({ fullName: FRAMEWORK_REPOSITORY, token: workflowToken });
const jobName = process.env.GITHUB_JOB || null;
const context = { docs, astro, reviewer, log: console.info, jobName };
if (parseMode(flags.mode) === MODES.live) {
	await runReleaseQueue(context);
} else {
	const prNumber = readOptionalPrNumber('PR_NUMBER');
	if (prNumber) await previewJoin(context, prNumber);
	else console.info('Dry run: no PR to preview.');
}

function createDocsRepository({ token, isReadOnly }: { token: string; isReadOnly: boolean }) {
	const options = { fullName: readRequiredVariable('GITHUB_REPOSITORY'), token };
	return isReadOnly
		? new ReadOnlyRepository({ ...options, log: console.info })
		: new GitHubRepository(options);
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

/** Reads a PR number, or `null` when the variable is empty, as on a manual run. */
function readOptionalPrNumber(name: string) {
	const value = process.env[name];
	if (!value) return null;

	const prNumber = Number(value);
	if (!Number.isInteger(prNumber) || prNumber <= 0) {
		throw new Error(`${name} must be a pull request number. Got: "${value}".`);
	}
	return prNumber;
}
