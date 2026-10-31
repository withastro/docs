import {
	hasLabel,
	MERGE_METHODS,
	type PullRequest,
	type PullRequestDetails,
	type Repository,
} from '../lib/github/repository.ts';
import { GitHubError } from '../lib/github/request.ts';
import {
	formatPrNumbers,
	renderAcceptedUmbrellaComment,
	renderDryRunComment,
	renderJoinedComment,
	renderMergeFailureComment,
	renderRefusalComment,
	renderUmbrellaFailureComment,
} from './comments.ts';
import { ACCEPTED_LABEL } from './config.ts';
import { decideJoin, OUTCOMES, type Decision } from './join-decision.ts';
import { readReadiness } from './readiness.ts';
import type { ReleaseQueueContext, ReleaseQueueRun } from './run-state.ts';
import { renderSquashCommitTitle, renderUmbrella } from './umbrella-content.ts';
import { getUmbrellaRelease, isUmbrellaPullRequest, type UmbrellaBranches } from './umbrella.ts';

/** A docs PR that can join its umbrella, and the branches of that umbrella. */
type JoinRequest = {
	pullRequest: PullRequestDetails;
	branches: UmbrellaBranches;
};

/**
 * Tells, in a comment on an accepted docs PR, what the release queue would do
 * with it, and removes the label. Otherwise, the PRs previewed in dry-run mode
 * would all join their umbrella in the first live run.
 *
 * Skips a PR that no longer has the label, and refuses umbrella PRs.
 *
 * @param {ReleaseQueueRun} run - The run.
 * @param {number} prNumber - The docs PR number.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function previewJoin(run: ReleaseQueueRun, prNumber: number): Promise<void> {
	const { docs, log } = run;
	const candidate = await decideAcceptedPullRequest(run, prNumber);
	if (!candidate) return;

	const { decision } = candidate;
	await removeLabelAndComment(docs, prNumber, renderDryRunComment(decision));
	log(`Dry run: #${prNumber} ${describeDecision(decision)}.`);
}

/**
 * Moves every open docs PR with the accepted label into its umbrella, or
 * refuses it with a comment.
 *
 * Handles the PRs one at a time, oldest first, since each join changes the
 * umbrella the next PR joins. A PR that fails does not stop the others.
 *
 * @param {ReleaseQueueRun} run - The run.
 * @throws {AggregateError} When some PRs failed, after handling the others.
 */
export async function joinAcceptedPullRequests(run: ReleaseQueueRun): Promise<void> {
	const { log, state } = run;
	const prNumbers = findAcceptedPrNumbers(state.openPullRequests);
	log(`Accepted PRs: ${formatPrNumbers(prNumbers)}.`);

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

function findAcceptedPrNumbers(openPullRequests: PullRequest[]) {
	return openPullRequests
		.filter((pullRequest) => hasLabel(pullRequest, ACCEPTED_LABEL))
		.map(({ number }) => number)
		.toSorted((first, second) => first - second);
}

async function joinPullRequest(run: ReleaseQueueRun, prNumber: number) {
	const { docs, log } = run;
	const candidate = await decideAcceptedPullRequest(run, prNumber);
	if (!candidate) return;

	const { pullRequest, decision } = candidate;
	if (decision.outcome === OUTCOMES.refuse) {
		await removeLabelAndComment(docs, prNumber, renderRefusalComment(decision));
		log(`#${prNumber} refused (${decision.reasons.join(', ')}).`);
		return;
	}

	await joinUmbrella(run, { pullRequest, branches: decision.branches });
}

/**
 * Reads an accepted docs PR, then decides whether it joins its umbrella.
 *
 * This returns `null` when there is nothing to decide: the PR no longer has the
 * label, or it is an umbrella PR, refused with a comment.
 */
async function decideAcceptedPullRequest(run: ReleaseQueueRun, prNumber: number) {
	const { docs, log, state } = run;
	const pullRequest = await docs.getPullRequest(prNumber);
	if (!hasLabel(pullRequest, ACCEPTED_LABEL)) {
		log(`#${prNumber} skipped: it no longer has the "${ACCEPTED_LABEL}" label.`);
		return null;
	}
	if (isUmbrellaPullRequest(pullRequest, docs.fullName)) {
		await refuseUmbrella(run, prNumber);
		return null;
	}

	const readiness = await readReadiness(run, pullRequest);
	return { pullRequest, decision: decideJoin(pullRequest, { state, readiness }) };
}

/** Tells an umbrella PR with the accepted label that a maintainer merges it. */
async function refuseUmbrella({ docs, log }: ReleaseQueueContext, prNumber: number) {
	await removeLabelAndComment(docs, prNumber, renderAcceptedUmbrellaComment());
	log(`#${prNumber} refused (umbrella PR).`);
}

async function removeLabelAndComment(docs: Repository, prNumber: number, comment: string) {
	// Removed first, so the comment is true once posted.
	await docs.removeLabel(prNumber, ACCEPTED_LABEL);
	await docs.createComment(prNumber, comment);
}

/**
 * Moves a docs PR into its umbrella, opens the umbrella PR when there is none,
 * then tells the PR which umbrella it joined.
 */
async function joinUmbrella(run: ReleaseQueueRun, request: JoinRequest) {
	const { docs, log } = run;
	const { pullRequest, branches } = request;
	await createUmbrellaBranchIfMissing(docs, branches);
	const isMerged = await mergeOrRefuse(run, request);
	if (!isMerged) return;

	const umbrellaPrNumber =
		(await findUmbrellaPrNumber(docs, branches)) ?? (await openUmbrella(run, request));
	if (umbrellaPrNumber === null) return;

	await docs.createComment(pullRequest.number, renderJoinedComment(branches, umbrellaPrNumber));
	log(`#${pullRequest.number} joined ${branches.head} (#${umbrellaPrNumber}).`);
}

async function createUmbrellaBranchIfMissing(docs: Repository, branches: UmbrellaBranches) {
	if (await docs.getBranchSha(branches.head)) return;

	const baseSha = await docs.getBranchSha(branches.base);
	if (!baseSha) throw new Error(`The branch "${branches.base}" does not exist.`);
	await docs.createBranch(branches.head, baseSha);
}

/**
 * Squash-merges a docs PR into its umbrella branch, and tells whether it did.
 * When GitHub refuses, declines the PR with GitHub's message instead.
 */
async function mergeOrRefuse({ docs, log }: ReleaseQueueRun, request: JoinRequest) {
	const { pullRequest, branches } = request;
	try {
		await squashIntoUmbrella(docs, request);
		return true;
	} catch (error) {
		if (!(error instanceof GitHubError)) throw error;

		const comment = renderMergeFailureComment(branches, error.apiMessage);
		await removeLabelAndComment(docs, pullRequest.number, comment);
		log(`#${pullRequest.number} not merged: ${error.apiMessage}.`);
		return false;
	}
}

/** Changes the base of a docs PR to the umbrella branch, then squash-merges it. */
async function squashIntoUmbrella(docs: Repository, { pullRequest, branches }: JoinRequest) {
	const { number, base, head } = pullRequest;
	const isBaseChangeNeeded = base.ref !== branches.head;
	if (isBaseChangeNeeded) await docs.updatePullRequest(number, { base: branches.head });

	try {
		await docs.mergePullRequest(number, {
			method: MERGE_METHODS.squash,
			expectedHeadSha: head.sha,
			commitTitle: renderSquashCommitTitle(pullRequest),
		});
	} catch (mergeError) {
		// A PR that can't join is left as it was.
		if (isBaseChangeNeeded) {
			await docs.updatePullRequest(number, { base: base.ref }).catch((baseError: unknown) => {
				throw new AggregateError(
					[mergeError, baseError],
					`Could not merge #${number}, then could not change its base back to ${base.ref}.`
				);
			});
		}
		throw mergeError;
	}
}

async function findUmbrellaPrNumber(docs: Repository, branches: UmbrellaBranches) {
	const pullRequests = await docs.getOpenPullRequestsFromBranch(branches.head);
	return pullRequests.find(({ base }) => base.ref === branches.base)?.number ?? null;
}

/**
 * Opens an umbrella PR without labels, or comments on the PR when GitHub
 * refuses.
 *
 * GitHub only opens a PR from a branch with commits that its base lacks, so
 * the umbrella PR is opened after the first docs PR is merged.
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
	try {
		const umbrella = await docs.createPullRequest({ title, ...branches, body });
		return umbrella.number;
	} catch (error) {
		if (!(error instanceof GitHubError)) throw error;

		const comment = renderUmbrellaFailureComment(branches, error.apiMessage);
		await docs.createComment(pullRequest.number, comment);
		log(`#${pullRequest.number} joined ${branches.head}, but no umbrella PR: ${error.apiMessage}.`);
		return null;
	}
}

function describeDecision(decision: Decision) {
	return decision.outcome === OUTCOMES.join
		? `would join ${decision.branches.head}`
		: `would be refused (${decision.reasons.join(', ')})`;
}
