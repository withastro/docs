import type {
	GitHubRepository,
	PullRequest,
	PullRequestDetails,
} from '../lib/github/repository.ts';
import { renderDryRunComment } from './comments.ts';
import { ACCEPTED_LABEL } from './config.ts';
import { OUTCOMES, routePullRequest, type Decision } from './decision.ts';
import { findReadinessProblems, readReadiness } from './readiness.ts';
import { isUmbrellaPullRequest } from './umbrella.ts';

type DocsRepository = Pick<
	GitHubRepository,
	'fullName' | 'getPullRequest' | 'getReviews' | 'hasWriteAccess' | 'getChecks' | 'createComment'
>;

type ReleaseQueueContext = {
	docs: DocsRepository;
	log: (message: string) => void;
	/** The job running the release queue, from `GITHUB_JOB`. `null` outside GitHub Actions. */
	jobName: string | null;
};

/**
 * Tells an accepted docs PR, in a comment, what the release queue would do with it, and changes
 * nothing else.
 *
 * Skips a PR that no longer has the label, and umbrella PRs.
 *
 * @param {ReleaseQueueContext} context - The docs repository, where to log, and the job running
 * the release queue.
 * @param {number} prNumber - The number of the docs PR.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function previewJoin(
	{ docs, log, jobName }: ReleaseQueueContext,
	prNumber: number
): Promise<void> {
	const pullRequest = await docs.getPullRequest(prNumber);
	const skipReason = getSkipReason(pullRequest, docs.fullName);
	if (skipReason) {
		log(`#${prNumber} skipped: ${skipReason}.`);
		return;
	}

	const decision = await decideJoin(docs, pullRequest, jobName);
	await docs.createComment(prNumber, renderDryRunComment(decision));
	log(`Dry run: #${prNumber} ${describeDecision(decision)}.`);
}

/** Routes a docs PR to its umbrella, then checks that it can be merged. */
async function decideJoin(
	docs: DocsRepository,
	pullRequest: PullRequestDetails,
	jobName: string | null
): Promise<Decision> {
	const routing = routePullRequest(pullRequest);
	if (routing.outcome === OUTCOMES.refuse) return routing;

	const problems = findReadinessProblems(await readReadiness(docs, pullRequest, jobName));
	return problems.length > 0 ? { outcome: OUTCOMES.refuse, reasons: problems } : routing;
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
		? `would join ${decision.route.umbrellaBranch}`
		: `would be refused (${decision.reasons.join(', ')})`;
}
