import { ACCEPTED_LABEL } from '../config.ts';
import {
	hasLabel,
	type PullRequest,
	type PullRequestDetails,
	type Repository,
} from '../github/repository.ts';
import type { ReleaseAssistantContext, ReleaseAssistantRun } from '../run.ts';
import { isUmbrellaPullRequest } from '../umbrella/umbrella.ts';
import { describeError } from '../utils/errors.ts';
import { formatPrNumbers } from '../utils/pr-numbers.ts';
import { renderAcceptedUmbrellaComment, renderDryRunComment } from './comments.ts';
import { decideJoin, OUTCOMES, type Decision } from './decision.ts';
import { readReadiness } from './readiness.ts';

/** What an accepted PR is when read again before acting on it. */
const ACCEPTED_PR_KINDS = {
	/** It no longer has the accepted label. */
	skipped: 'skipped',
	umbrella: 'umbrella',
	docs: 'docs',
} as const;

type AcceptedPullRequest =
	| { kind: typeof ACCEPTED_PR_KINDS.skipped }
	| { kind: typeof ACCEPTED_PR_KINDS.umbrella }
	| { kind: typeof ACCEPTED_PR_KINDS.docs; pullRequest: PullRequestDetails; decision: Decision };

/**
 * Removes the accepted label from each docs PR that has it, and comments with
 * what a live run would do. Without the label, the PR doesn't join its umbrella
 * at the first live run.
 *
 * @param {ReleaseAssistantRun} run - The run.
 * @throws {AggregateError} When some PRs failed, once the others are done.
 */
export async function previewAcceptedPullRequests(run: ReleaseAssistantRun): Promise<void> {
	await forEachAcceptedPullRequest(run, previewPullRequest);
}

/**
 * Acts on each open PR with the accepted label. A PR that fails doesn't stop
 * the others.
 *
 * GitHub cancels a pending run when another one is queued, so a run acts on
 * every accepted PR, not only the one whose label started it.
 */
async function forEachAcceptedPullRequest(
	run: ReleaseAssistantRun,
	actOnPullRequest: (run: ReleaseAssistantRun, prNumber: number) => Promise<void>
) {
	const prNumbers = findAcceptedPrNumbers(run.state.openPullRequests);
	run.log(`Accepted PRs: ${formatPrNumbers(prNumbers)}.`);

	const errors: Error[] = [];
	for (const prNumber of prNumbers) {
		try {
			await actOnPullRequest(run, prNumber);
		} catch (error) {
			errors.push(new Error(`#${prNumber} failed: ${describeError(error)}`, { cause: error }));
		}
	}

	if (errors.length > 0) {
		throw new AggregateError(
			errors,
			`${errors.length} of ${prNumbers.length} accepted PRs failed.`
		);
	}
}

/** Finds the numbers of the open PRs with the accepted label, oldest first. */
function findAcceptedPrNumbers(openPullRequests: PullRequest[]) {
	return openPullRequests
		.filter((pullRequest) => hasLabel(pullRequest, ACCEPTED_LABEL))
		.map(({ number }) => number)
		.toSorted((first, second) => first - second);
}

async function previewPullRequest(run: ReleaseAssistantRun, prNumber: number) {
	const accepted = await readAcceptedPullRequest(run, prNumber);
	if (accepted.kind === ACCEPTED_PR_KINDS.skipped) return logSkipped(run, prNumber);
	if (accepted.kind === ACCEPTED_PR_KINDS.umbrella) return refuseUmbrella(run, prNumber);

	const { decision } = accepted;
	await removeLabelAndComment(run.docs, prNumber, renderDryRunComment(decision));
	run.log(`Dry run: #${prNumber} ${describeDecision(decision)}.`);
}

/**
 * Reads an accepted PR again, because the list of open PRs may be outdated.
 * Then decides whether a docs PR joins its umbrella.
 */
async function readAcceptedPullRequest(
	run: ReleaseAssistantRun,
	prNumber: number
): Promise<AcceptedPullRequest> {
	const { docs, state } = run;
	const pullRequest = await docs.getPullRequest(prNumber);
	if (!hasLabel(pullRequest, ACCEPTED_LABEL)) return { kind: ACCEPTED_PR_KINDS.skipped };
	if (isUmbrellaPullRequest(pullRequest, docs.fullName)) {
		return { kind: ACCEPTED_PR_KINDS.umbrella };
	}

	const readiness = await readReadiness(run, pullRequest);
	return {
		kind: ACCEPTED_PR_KINDS.docs,
		pullRequest,
		decision: decideJoin(pullRequest, { state, readiness }),
	};
}

function logSkipped({ log }: ReleaseAssistantContext, prNumber: number) {
	log(`#${prNumber} skipped: it no longer has the "${ACCEPTED_LABEL}" label.`);
}

/** Removes the accepted label from an umbrella PR, and comments that a maintainer merges it. */
async function refuseUmbrella({ docs, log }: ReleaseAssistantContext, prNumber: number) {
	await removeLabelAndComment(docs, prNumber, renderAcceptedUmbrellaComment());
	log(`#${prNumber} refused (umbrella PR).`);
}

async function removeLabelAndComment(docs: Repository, prNumber: number, comment: string) {
	// The comment says the label was removed, so remove it first.
	await docs.removeLabel(prNumber, ACCEPTED_LABEL);
	await docs.createComment(prNumber, comment);
}

function describeDecision(decision: Decision) {
	return decision.outcome === OUTCOMES.join
		? `would join ${decision.branches.head}`
		: `would be refused (${decision.reasons.join(', ')})`;
}
