import type { GitHubRepository, PullRequest } from '../lib/github/repository.ts';
import { renderDryRunComment } from './comments.ts';
import { ACCEPTED_LABEL } from './config.ts';
import { OUTCOMES, routePullRequest, type Decision } from './decision.ts';
import { isUmbrellaPullRequest } from './umbrella.ts';

type DocsRepository = Pick<GitHubRepository, 'fullName' | 'getPullRequest' | 'createComment'>;

type ReleaseQueueContext = {
	docs: DocsRepository;
	log: (message: string) => void;
};

/**
 * Tells an accepted docs PR, in a comment, what the release queue would do with it, and changes
 * nothing else.
 *
 * Skips a PR that no longer has the label, and umbrella PRs.
 *
 * @param {ReleaseQueueContext} context - The docs repository, and where to log.
 * @param {number} prNumber - The number of the docs PR.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function previewJoin(
	{ docs, log }: ReleaseQueueContext,
	prNumber: number
): Promise<void> {
	const pullRequest = await docs.getPullRequest(prNumber);
	const skipReason = getSkipReason(pullRequest, docs.fullName);
	if (skipReason) {
		log(`#${prNumber} skipped: ${skipReason}.`);
		return;
	}

	const decision = routePullRequest(pullRequest);
	await docs.createComment(prNumber, renderDryRunComment(decision));
	log(`Dry run: #${prNumber} ${describeDecision(decision)}.`);
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
		: `would be refused (${decision.reason})`;
}
