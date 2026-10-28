import {
	MERGE_METHODS,
	type GitHubRepository,
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
import { ACCEPTED_LABEL, UMBRELLA_LABEL } from './config.ts';
import { OUTCOMES, routePullRequest, type Decision } from './decision.ts';
import { findReadinessProblems, readReadiness } from './readiness.ts';
import { readStableRelease, type FrameworkRelease, type FrameworkRepository } from './release.ts';
import {
	isUmbrellaPullRequest,
	renderUmbrellaBody,
	renderUmbrellaTitle,
	type Route,
} from './umbrella.ts';

type DocsRepository = Pick<
	GitHubRepository,
	| 'fullName'
	| 'getOpenPullRequests'
	| 'getOpenPullRequestsFromBranch'
	| 'getPullRequest'
	| 'getReviews'
	| 'hasWriteAccess'
	| 'getChecks'
	| 'getBranchSha'
	| 'createBranch'
	| 'createPullRequest'
	| 'updatePullRequest'
	| 'mergePullRequest'
	| 'addLabels'
	| 'removeLabel'
	| 'createComment'
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
export async function previewJoin(context: ReleaseQueueContext, prNumber: number): Promise<void> {
	const { docs, log } = context;
	const pullRequest = await docs.getPullRequest(prNumber);
	const skipReason = getSkipReason(pullRequest, docs.fullName);
	if (skipReason) {
		log(`#${prNumber} skipped: ${skipReason}.`);
		return;
	}

	const stableRelease = await readAndLogStableRelease(context);
	const decision = await decideJoin(context, pullRequest, stableRelease);
	await docs.createComment(prNumber, renderDryRunComment(decision));
	log(`Dry run: #${prNumber} ${describeDecision(decision)}.`);
}

/**
 * Moves every open docs PR with the accepted label into its umbrella, or refuses it with a comment.
 *
 * Handles the PRs one at a time, oldest first, since each join changes the umbrella the next PR
 * joins. A PR that fails does not stop the others.
 *
 * @param {ReleaseQueueContext} context - The docs and framework repositories, where to log, and
 * the job running the release queue.
 * @throws {GitHubError} When reading the accepted PRs or the stable release fails.
 * @throws {AggregateError} When some PRs failed, after handling the others.
 */
export async function joinAcceptedPullRequests(context: ReleaseQueueContext): Promise<void> {
	const { docs, log } = context;
	const prNumbers = await findAcceptedPrNumbers(docs);
	log(`Accepted PRs: ${prNumbers.map((prNumber) => `#${prNumber}`).join(', ') || 'none'}.`);
	if (prNumbers.length === 0) return;

	const stableRelease = await readAndLogStableRelease(context);
	const errors: unknown[] = [];
	for (const prNumber of prNumbers) {
		try {
			await joinPullRequest(context, prNumber, stableRelease);
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

async function findAcceptedPrNumbers(docs: DocsRepository) {
	const pullRequests = await docs.getOpenPullRequests();
	return pullRequests
		.filter((pullRequest) => !getSkipReason(pullRequest, docs.fullName))
		.map(({ number }) => number)
		.toSorted((first, second) => first - second);
}

async function readAndLogStableRelease({ astro, log }: ReleaseQueueContext) {
	const stableRelease = await readStableRelease(astro);
	log(`Stable release: ${describeRelease(stableRelease, astro.fullName)}.`);
	return stableRelease;
}

async function joinPullRequest(
	context: ReleaseQueueContext,
	prNumber: number,
	stableRelease: FrameworkRelease | null
) {
	const { docs, log } = context;
	// Read again: the list has no mergeability, and the PR may have changed since.
	const pullRequest = await docs.getPullRequest(prNumber);
	const skipReason = getSkipReason(pullRequest, docs.fullName);
	if (skipReason) {
		log(`#${prNumber} skipped: ${skipReason}.`);
		return;
	}

	const decision = await decideJoin(context, pullRequest, stableRelease);
	if (decision.outcome === OUTCOMES.refuse) {
		await refuseJoin(docs, prNumber, renderRefusalComment(decision.reasons));
		log(`#${prNumber} refused (${decision.reasons.join(', ')}).`);
		return;
	}

	await mergeIntoUmbrella(context, pullRequest, decision.route);
}

/** Routes a docs PR to its umbrella, then checks that it can be merged. */
async function decideJoin(
	{ docs, jobName }: ReleaseQueueContext,
	pullRequest: PullRequestDetails,
	stableRelease: FrameworkRelease | null
): Promise<Decision> {
	const routing = routePullRequest(pullRequest, stableRelease);
	if (routing.outcome === OUTCOMES.refuse) return routing;

	const problems = findReadinessProblems(await readReadiness(docs, pullRequest, jobName));
	return problems.length > 0 ? { outcome: OUTCOMES.refuse, reasons: problems } : routing;
}

async function refuseJoin(docs: DocsRepository, prNumber: number, comment: string) {
	// Removed first, so the comment is true once posted.
	await docs.removeLabel(prNumber, ACCEPTED_LABEL);
	await docs.createComment(prNumber, comment);
}

async function mergeIntoUmbrella(
	context: ReleaseQueueContext,
	pullRequest: PullRequestDetails,
	route: Route
) {
	const { docs, log } = context;
	await createUmbrellaBranchIfMissing(docs, route);
	const mergeError = await squashIntoUmbrella(docs, pullRequest, route).then(
		() => null,
		returnGitHubError
	);
	if (mergeError) {
		await refuseJoin(
			docs,
			pullRequest.number,
			renderMergeFailureComment(route, mergeError.apiMessage)
		);
		log(`#${pullRequest.number} not merged: ${mergeError.apiMessage}.`);
		return;
	}

	const umbrellaPrNumber =
		(await findUmbrellaPrNumber(docs, route)) ?? (await openUmbrella(context, pullRequest, route));
	if (umbrellaPrNumber === null) return;

	await docs.createComment(pullRequest.number, renderJoinedComment(route, umbrellaPrNumber));
	log(`#${pullRequest.number} joined ${route.umbrellaBranch} (#${umbrellaPrNumber}).`);
}

async function createUmbrellaBranchIfMissing(docs: DocsRepository, route: Route) {
	if (await docs.getBranchSha(route.umbrellaBranch)) return;

	const baseSha = await docs.getBranchSha(route.umbrellaBaseBranch);
	if (!baseSha) throw new Error(`The branch "${route.umbrellaBaseBranch}" does not exist.`);
	await docs.createBranch(route.umbrellaBranch, baseSha);
}

/** Changes the base of a docs PR to the umbrella branch, then squash-merges it. */
async function squashIntoUmbrella(
	docs: DocsRepository,
	pullRequest: PullRequestDetails,
	route: Route
) {
	const { number, base, head } = pullRequest;
	const isBaseChangeNeeded = base.ref !== route.umbrellaBranch;
	if (isBaseChangeNeeded) await docs.updatePullRequest(number, { base: route.umbrellaBranch });

	try {
		await docs.mergePullRequest(number, {
			method: MERGE_METHODS.squash,
			expectedHeadSha: head.sha,
		});
	} catch (error) {
		// A PR that can't join is left as it was.
		if (isBaseChangeNeeded) await docs.updatePullRequest(number, { base: base.ref });
		throw error;
	}
}

async function findUmbrellaPrNumber(docs: DocsRepository, route: Route) {
	const pullRequests = await docs.getOpenPullRequestsFromBranch(route.umbrellaBranch);
	return pullRequests.find(({ base }) => base.ref === route.umbrellaBaseBranch)?.number ?? null;
}

/**
 * Opens the umbrella PR, or comments on the docs PR when GitHub refuses.
 *
 * GitHub only opens a PR from a branch with commits that its base lacks, so the umbrella PR is
 * opened after the first docs PR is merged.
 */
async function openUmbrella(
	{ docs, log }: ReleaseQueueContext,
	pullRequest: PullRequestDetails,
	route: Route
) {
	const umbrella = await docs
		.createPullRequest({
			title: renderUmbrellaTitle(route.umbrellaBaseBranch),
			head: route.umbrellaBranch,
			base: route.umbrellaBaseBranch,
			body: renderUmbrellaBody(route),
		})
		.catch(returnGitHubError);
	if (umbrella instanceof GitHubError) {
		await docs.createComment(
			pullRequest.number,
			renderUmbrellaFailureComment(route, umbrella.apiMessage)
		);
		log(
			`#${pullRequest.number} joined ${route.umbrellaBranch}, but no umbrella PR: ${umbrella.apiMessage}.`
		);
		return null;
	}

	await docs.addLabels(umbrella.number, [UMBRELLA_LABEL]);
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
