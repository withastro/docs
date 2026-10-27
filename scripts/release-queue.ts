// Comments on a docs PR labeled `accepted` with the release umbrella PR it would join.
// Run by `.github/workflows/release-queue.yml`, with `GITHUB_REPOSITORY`, `BOT_TOKEN`, and `PR_NUMBER`.

import { GitHubRepository } from './lib/github/repository.ts';
import { previewJoin } from './release-queue/join.ts';

const docs = new GitHubRepository({
	fullName: readRequiredVariable('GITHUB_REPOSITORY'),
	token: readRequiredVariable('BOT_TOKEN'),
});
await previewJoin({ docs, log: console.info }, readPrNumber('PR_NUMBER'));

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
