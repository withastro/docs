import type {
	GitHubRepository,
	PullRequest,
	PullRequestDetails,
} from '../lib/github/repository.ts';
import { renderDryRunComment } from './comments.ts';
import { ACCEPTED_LABEL } from './config.ts';
import { OUTCOMES, routePullRequest, type Decision } from './decision.ts';
import { findReadinessProblems, readReadiness } from './readiness.ts';
import { readStableRelease, type FrameworkRelease, type FrameworkRepository } from './release.ts';
import { isUmbrellaPullRequest } from './umbrella.ts';

type DocsRepository = Pick<
	GitHubRepository,
	'fullName' | 'getPullRequest' | 'getReviews' | 'hasWriteAccess' | 'getChecks' | 'createComment'
>;

type ReleaseQueueContext = {
	docs: DocsRepository;
	/** The framework repository, read for its release PRs. */
	astro: FrameworkRepository;
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
 * @param {ReleaseQueueContext} context - The docs and framework repositories, where to log, and
 * the job running the release queue.
 * @param {number} prNumber - The number of the docs PR.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function previewJoin(
	{ docs, astro, log, jobName }: ReleaseQueueContext,
	prNumber: number
): Promise<void> {
	const pullRequest = await docs.getPullRequest(prNumber);
	const skipReason = getSkipReason(pullRequest, docs.fullName);
	if (skipReason) {
		log(`#${prNumber} skipped: ${skipReason}.`);
		return;
	}

	const stableRelease = await readStableRelease(astro);
	log(`Stable release: ${describeRelease(stableRelease, astro.fullName)}.`);

	const decision = await decideJoin({ docs, pullRequest, stableRelease, jobName });
	await docs.createComment(prNumber, renderDryRunComment(decision));
	log(`Dry run: #${prNumber} ${describeDecision(decision)}.`);
}

type JoinFacts = {
	docs: DocsRepository;
	pullRequest: PullRequestDetails;
	stableRelease: FrameworkRelease | null;
	jobName: string | null;
};

/** Routes a docs PR to its umbrella, then checks that it can be merged. */
async function decideJoin({
	docs,
	pullRequest,
	stableRelease,
	jobName,
}: JoinFacts): Promise<Decision> {
	const routing = routePullRequest(pullRequest, stableRelease);
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

function describeRelease(release: FrameworkRelease | null, repositoryFullName: string) {
	if (!release) return 'none open';
	const version = release.astroVersion ? `astro@${release.astroVersion}` : 'without astro';
	return `${repositoryFullName}#${release.prNumber} (${version}, ${release.type})`;
}

function describeDecision(decision: Decision) {
	return decision.outcome === OUTCOMES.join
		? `would join ${decision.route.umbrellaBranch}`
		: `would be refused (${decision.reasons.join(', ')})`;
}
