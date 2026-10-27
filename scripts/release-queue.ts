// Comments on a docs PR labeled `accepted` with the release umbrella PR it would join.
// Run by `.github/workflows/release-queue.yml`, with `GITHUB_REPOSITORY`, `BOT_TOKEN`, and `PR_NUMBER`.
// Locally, add `--read-only` to log the writes instead of sending them.

import { parseArgs } from 'node:util';
import { ReadOnlyRepository } from './lib/github/read-only-repository.ts';
import { GitHubRepository } from './lib/github/repository.ts';
import { previewJoin } from './release-queue/join.ts';

const { values: flags } = parseArgs({
	options: { 'read-only': { type: 'boolean', default: false } },
});
const docs = createDocsRepository({ isReadOnly: flags['read-only'] });
await previewJoin({ docs, log: console.info }, readPrNumber('PR_NUMBER'));

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

function readPrNumber(name: string) {
	const value = readRequiredVariable(name);
	const prNumber = Number(value);
	if (!Number.isInteger(prNumber) || prNumber <= 0) {
		throw new Error(`${name} must be a pull request number. Got: "${value}".`);
	}
	return prNumber;
}
