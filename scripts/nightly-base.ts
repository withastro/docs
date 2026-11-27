// Finds the base of the nightly PR. Run by `.github/workflows/nightly.yml`,
// through `actions/github-script`.

import type { context as actionsContext } from '@actions/github';
import {
	GitHubRepository,
	type Octokit,
	type Repository,
} from './release-assistant/github/repository.ts';
import {
	getUmbrellaBranches,
	type UmbrellaBranches,
} from './release-assistant/umbrella/umbrella.ts';

type RunOptions = {
	/** The client `actions/github-script` creates, with the bot token. */
	github: Octokit;
	/** The workflow run, as `actions/github-script` gives it. */
	context: Pick<typeof actionsContext, 'repo'>;
	/** The docs branch the nightly PR updates. */
	targetBranch: string;
	/** The head branch of the nightly PR. */
	prBranch: string;
};

/**
 * Retargets the open nightly PR to the umbrella of the target branch when one
 * is open, else to the target branch.
 *
 * @param {RunOptions} options - The client, the workflow context, and the branches.
 * @returns {Promise<string>} The branch to build on and to open the PR against.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function prepareNightlyBase({
	github,
	context,
	targetBranch,
	prBranch,
}: RunOptions): Promise<string> {
	const docs = new GitHubRepository(github, context.repo);
	const umbrella = getUmbrellaBranches(targetBranch);
	const base = await findNightlyBase(docs, umbrella);
	console.info(`The nightly PR builds on ${base}.`);

	const staleBase = base === umbrella.head ? umbrella.base : umbrella.head;
	// `create-pull-request` only updates a PR that has the same base.
	await retargetNightlyPr(docs, prBranch, { from: staleBase, to: base });
	return base;
}

async function findNightlyBase(docs: Repository, umbrella: UmbrellaBranches): Promise<string> {
	const umbrellaPrs = await docs.getOpenPullRequestsFromBranch(umbrella.head);
	const isUmbrellaOpen = umbrellaPrs.some(({ base }) => base.ref === umbrella.base);
	return isUmbrellaOpen ? umbrella.head : umbrella.base;
}

async function retargetNightlyPr(
	docs: Repository,
	prBranch: string,
	{ from, to }: { from: string; to: string }
): Promise<void> {
	const nightlyPrs = await docs.getOpenPullRequestsFromBranch(prBranch);
	const nightlyPr = nightlyPrs.find(({ base }) => base.ref === from);
	if (!nightlyPr) return;

	await docs.updatePullRequest(nightlyPr.number, { base: to });
	console.info(`Retargeted #${nightlyPr.number} from ${from} to ${to}.`);
}
