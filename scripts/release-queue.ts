// Moves docs PRs labeled `accepted` into their release umbrella PR and refreshes the umbrellas, or
// with `MODE=dry-run`, comments on the PR `PR_NUMBER` with what it would do. Run by
// `.github/workflows/release-queue.yml`, with `GITHUB_REPOSITORY`, `GITHUB_JOB`, `BOT_TOKEN` (writes
// on the docs repository), and `GITHUB_TOKEN` (reads the framework repository). Locally, add
// `--read-only` to log the writes instead.

import { parseArgs } from 'node:util';
import { ReadOnlyRepository } from './lib/github/read-only-repository.ts';
import { GitHubRepository } from './lib/github/repository.ts';
import { FRAMEWORK_REPOSITORY, MODES, type Mode } from './release-queue/config.ts';
import { previewJoin } from './release-queue/join.ts';
import { runReleaseQueue } from './release-queue/queue.ts';

const { values: flags } = parseArgs({
	options: { 'read-only': { type: 'boolean', default: false } },
});
const docs = createDocsRepository({ isReadOnly: flags['read-only'] });
const astro = new GitHubRepository({
	fullName: FRAMEWORK_REPOSITORY,
	token: readRequiredVariable('GITHUB_TOKEN'),
});
const context = { docs, astro, log: console.info, jobName: process.env.GITHUB_JOB || null };
const prNumber = readOptionalPrNumber('PR_NUMBER');
if (readMode('MODE') === MODES.live) await runReleaseQueue(context);
else if (prNumber) await previewJoin(context, prNumber);
else console.info('Dry run: no PR to preview.');

function createDocsRepository({ isReadOnly }: { isReadOnly: boolean }) {
	const options = {
		fullName: readRequiredVariable('GITHUB_REPOSITORY'),
		token: readRequiredVariable('BOT_TOKEN'),
	};
	return isReadOnly
		? new ReadOnlyRepository({ ...options, log: console.info })
		: new GitHubRepository(options);
}

function readRequiredVariable(name: string) {
	const value = process.env[name];
	if (!value) throw new Error(`The ${name} environment variable is required.`);
	return value;
}

function readMode(name: string): Mode {
	const value = readRequiredVariable(name);
	const mode = Object.values(MODES).find((knownMode) => knownMode === value);
	if (!mode) {
		throw new Error(`${name} must be one of: ${Object.values(MODES).join(', ')}. Got: "${value}".`);
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
