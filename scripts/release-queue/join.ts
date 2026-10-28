import {
	MERGE_METHODS,
	type PullRequest,
	type PullRequestDetails,
} from '../lib/github/repository.ts';
import { GitHubError } from '../lib/github/request.ts';
import {
	renderDryRunComment,
	renderJoinedComment,
	renderMergeFailureComment,
	renderRefusalComment,
	renderUmbrellaFailureComment,
} from './comments.ts';
import { ACCEPTED_LABEL } from './config.ts';
import { decideJoin, OUTCOMES, type Decision } from './decision.ts';
import { readReadiness } from './readiness.ts';
import {
	describeReleaseState,
	startRun,
	type ReleaseQueueContext,
	type ReleaseQueueRun,
} from './run.ts';
import { renderSquashCommitTitle, renderUmbrella } from './umbrella-update.ts';
import { getUmbrellaRelease, isUmbrellaPullRequest, type UmbrellaBranches } from './umbrella.ts';

type DocsRepository = ReleaseQueueContext['docs'];

/** A docs PR that can join its umbrella, and the branches of that umbrella. */
type JoinRequest = {
	pullRequest: PullRequestDetails;
	branches: UmbrellaBranches;
};

/**
 * Tells an accepted docs PR, in a comment, what the release queue would do with it, and changes
 * nothing else.
 *
 * Skips a PR that no longer has the label, and umbrella PRs.
 *
 * @param {ReleaseQueueContext} context - The repositories, and where to log.
 * @param {number} prNumber - The number of the docs PR.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When the framework's release PR or pre mode file can't be read.
 */
export async function previewJoin(context: ReleaseQueueContext, prNumber: number): Promise<void> {
	const { docs, log } = context;
	const pullRequest = await readPullRequestToJoin(context, prNumber);
	if (!pullRequest) return;

	const run = await startRun(context);
	log(describeReleaseState(run.state, context.astro.fullName));
	const decision = await readDecision(run, pullRequest);
	await docs.createComment(prNumber, renderDryRunComment(decision));
	log(`Dry run: #${prNumber} ${describeDecision(decision)}.`);
}

/**
 * Moves every open docs PR with the accepted label into its umbrella, or refuses it with a comment.
 *
 * Handles the PRs one at a time, oldest first, since each join changes the umbrella the next PR
 * joins. A PR that fails does not stop the others.
 *
 * @param {ReleaseQueueRun} run - The run.
 * @throws {AggregateError} When some PRs failed, after handling the others.
 */
export async function joinAcceptedPullRequests(run: ReleaseQueueRun): Promise<void> {
	const { docs, log, state } = run;
	const prNumbers = findAcceptedPrNumbers(state.openPullRequests, docs.fullName);
	log(`Accepted PRs: ${prNumbers.map((prNumber) => `#${prNumber}`).join(', ') || 'none'}.`);

	const errors: unknown[] = [];
	for (const prNumber of prNumbers) {
		try {
			await joinPullRequest(run, prNumber);
		} catch (error) {
			log(`#${prNumber} failed: ${error instanceof Error ? error.message : String(error)}`);
			errors.push(error);
		}
	}

	if (errors.length > 0) {
		throw new AggregateError(
			errors,
			`Could not handle ${errors.length} of ${prNumbers.length} accepted PRs.`
		);
	}
}

function findAcceptedPrNumbers(openPullRequests: PullRequest[], repositoryFullName: string) {
	return openPullRequests
		.filter((pullRequest) => !getSkipReason(pullRequest, repositoryFullName))
		.map(({ number }) => number)
		.toSorted((first, second) => first - second);
}

async function joinPullRequest(run: ReleaseQueueRun, prNumber: number) {
	const { docs, log } = run;
	// Read again: the list has no mergeability, and the PR may have changed since.
	const pullRequest = await readPullRequestToJoin(run, prNumber);
	if (!pullRequest) return;

	const decision = await readDecision(run, pullRequest);
	if (decision.outcome === OUTCOMES.refuse) {
		await refuseJoin(docs, prNumber, renderRefusalComment(decision.reasons));
		log(`#${prNumber} refused (${decision.reasons.join(', ')}).`);
		return;
	}

	await mergeIntoUmbrella(run, { pullRequest, branches: decision.branches });
}

/**
 * Reads a docs PR to join its umbrella, or gives `null` after logging why it is skipped: it no
 * longer has the accepted label, or it is an umbrella.
 */
async function readPullRequestToJoin({ docs, log }: ReleaseQueueContext, prNumber: number) {
	const pullRequest = await docs.getPullRequest(prNumber);
	const skipReason = getSkipReason(pullRequest, docs.fullName);
	if (!skipReason) return pullRequest;

	log(`#${prNumber} skipped: ${skipReason}.`);
	return null;
}

/** Reads whether a docs PR can be merged, then decides whether it joins its umbrella. */
async function readDecision(run: ReleaseQueueRun, pullRequest: PullRequestDetails) {
	const readiness = await readReadiness(run, pullRequest);
	return decideJoin(pullRequest, { state: run.state, readiness });
}

async function refuseJoin(docs: DocsRepository, prNumber: number, comment: string) {
	// Removed first, so the comment is true once posted.
	await docs.removeLabel(prNumber, ACCEPTED_LABEL);
	await docs.createComment(prNumber, comment);
}

async function mergeIntoUmbrella(run: ReleaseQueueRun, request: JoinRequest) {
	const { docs, log } = run;
	const { pullRequest, branches } = request;
	await createUmbrellaBranchIfMissing(docs, branches);
	const mergeError = await squashIntoUmbrella(docs, pullRequest, branches).then(
		() => null,
		returnGitHubError
	);
	if (mergeError) {
		await refuseJoin(
			docs,
			pullRequest.number,
			renderMergeFailureComment(branches, mergeError.apiMessage)
		);
		log(`#${pullRequest.number} not merged: ${mergeError.apiMessage}.`);
		return;
	}

	const umbrellaPrNumber =
		(await findUmbrellaPrNumber(docs, branches)) ?? (await openUmbrella(run, request));
	if (umbrellaPrNumber === null) return;

	await docs.createComment(pullRequest.number, renderJoinedComment(branches, umbrellaPrNumber));
	log(`#${pullRequest.number} joined ${branches.head} (#${umbrellaPrNumber}).`);
}

async function createUmbrellaBranchIfMissing(docs: DocsRepository, branches: UmbrellaBranches) {
	if (await docs.getBranchSha(branches.head)) return;

	const baseSha = await docs.getBranchSha(branches.base);
	if (!baseSha) throw new Error(`The branch "${branches.base}" does not exist.`);
	await docs.createBranch(branches.head, baseSha);
}

/** Changes the base of a docs PR to the umbrella branch, then squash-merges it. */
async function squashIntoUmbrella(
	docs: DocsRepository,
	pullRequest: PullRequestDetails,
	branches: UmbrellaBranches
) {
	const { number, base, head } = pullRequest;
	const isBaseChangeNeeded = base.ref !== branches.head;
	if (isBaseChangeNeeded) await docs.updatePullRequest(number, { base: branches.head });

	try {
		await docs.mergePullRequest(number, {
			method: MERGE_METHODS.squash,
			expectedHeadSha: head.sha,
			commitTitle: renderSquashCommitTitle(pullRequest),
		});
	} catch (error) {
		// A PR that can't join is left as it was.
		if (isBaseChangeNeeded) await docs.updatePullRequest(number, { base: base.ref });
		throw error;
	}
}

async function findUmbrellaPrNumber(docs: DocsRepository, branches: UmbrellaBranches) {
	const pullRequests = await docs.getOpenPullRequestsFromBranch(branches.head);
	return pullRequests.find(({ base }) => base.ref === branches.base)?.number ?? null;
}

/**
 * Opens the umbrella PR, or comments on the docs PR when GitHub refuses. Its labels come with the
 * refresh that ends the run.
 *
 * GitHub only opens a PR from a branch with commits that its base lacks, so the umbrella PR is
 * opened after the first docs PR is merged.
 */
async function openUmbrella(
	{ docs, log, state }: ReleaseQueueRun,
	{ pullRequest, branches }: JoinRequest
): Promise<number | null> {
	const { title, body } = renderUmbrella({
		branches,
		release: getUmbrellaRelease(state.releases, branches.base),
		includedPrNumbers: [pullRequest.number],
	});
	const umbrella = await docs
		.createPullRequest({ title, ...branches, body })
		.catch(returnGitHubError);
	if (umbrella instanceof GitHubError) {
		await docs.createComment(
			pullRequest.number,
			renderUmbrellaFailureComment(branches, umbrella.apiMessage)
		);
		log(
			`#${pullRequest.number} joined ${branches.head}, but no umbrella PR: ${umbrella.apiMessage}.`
		);
		return null;
	}

	return umbrella.number;
}

/** Returns a GitHub error, a refusal the caller reports, and throws any other error. */
function returnGitHubError(error: unknown): GitHubError {
	if (error instanceof GitHubError) return error;
	throw error;
}

function getSkipReason(pullRequest: PullRequest, repositoryFullName: string) {
	if (!pullRequest.labels.some(({ name }) => name === ACCEPTED_LABEL)) {
		return `it no longer has the "${ACCEPTED_LABEL}" label`;
	}
	if (isUmbrellaPullRequest(pullRequest, repositoryFullName)) return 'it is an umbrella PR';
	return null;
}

function describeDecision(decision: Decision) {
	return decision.outcome === OUTCOMES.join
		? `would join ${decision.branches.head}`
		: `would be refused (${decision.reasons.join(', ')})`;
}
