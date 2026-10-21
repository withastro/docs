import { GitHubError, type GitHubClient } from './github.ts';
import { countCommitsAhead, getBranchSha, getPullRequest, type PullRequest } from './queries.ts';
import type { JoinRefusal, Route } from './routing.ts';
import { findOpenUmbrella } from './umbrella-queries.ts';
import type { Umbrella } from './umbrella.ts';

/**
 * The outcome of a join. `unopened` means the PR was merged into the umbrella
 * branch, but the umbrella PR couldn't be opened.
 */
export type JoinResult =
	| { status: 'joined'; umbrella: Umbrella }
	| { status: 'refused'; refusal: JoinRefusal }
	| { status: 'unopened'; error: unknown };

/** A join that merged the PR, but couldn't open the umbrella PR. */
export type UnopenedJoin = Extract<JoinResult, { status: 'unopened' }>;

/**
 * Squash-merges a docs PR into its umbrella branch. Prepares the branch before
 * changing the PR, then changes the PR base, merges, and opens the umbrella
 * PR titled `umbrellaTitle` if none is open: GitHub refuses a PR without
 * commits. A refused merge restores the PR base. Expected failures come back
 * as a result, anything else throws. The refresh sets the labels and body.
 */
export async function joinUmbrella(
	gh: GitHubClient,
	repo: string,
	pr: PullRequest,
	route: Route,
	umbrellaTitle: string
): Promise<JoinResult> {
	const openUmbrella = await findOpenUmbrella(gh, repo, route.umbrellaBranch);
	if (!openUmbrella) {
		const refusal = await prepareUmbrellaBranch(gh, repo, route);
		if (refusal) return { status: 'refused', refusal };
	}

	if (route.shouldRetarget) await setBase(gh, repo, pr.number, route.umbrellaBranch);
	const refusal = await mergeOrRestoreBase(gh, repo, pr, route);
	if (refusal) return { status: 'refused', refusal };

	if (openUmbrella) return { status: 'joined', umbrella: { number: openUmbrella.number } };
	return createUmbrella(gh, repo, route, umbrellaTitle);
}

/**
 * Makes sure the umbrella branch starts from its target. A branch left over
 * without commits, for example after a failed first merge, is reset. One with
 * commits is left to a maintainer. Returns a refusal, or `undefined` when the
 * branch is ready.
 */
async function prepareUmbrellaBranch(
	gh: GitHubClient,
	repo: string,
	{ target, umbrellaBranch }: Route
): Promise<JoinRefusal | undefined> {
	const targetSha = await getBranchSha(gh, repo, target);
	if (!targetSha) throw new Error(`The branch ${target} doesn't exist in ${repo}.`);

	const umbrellaSha = await getBranchSha(gh, repo, umbrellaBranch);
	if (umbrellaSha === undefined) {
		await gh.write('POST', `repos/${repo}/git/refs`, {
			ref: `refs/heads/${umbrellaBranch}`,
			sha: targetSha,
		});
		return undefined;
	}
	if ((await countCommitsAhead(gh, repo, target, umbrellaBranch)) > 0) {
		return { code: 'stale-umbrella-branch', branch: umbrellaBranch };
	}
	await gh.write('PATCH', `repos/${repo}/git/refs/heads/${umbrellaBranch}`, {
		sha: targetSha,
		force: true,
	});
	return undefined;
}

function setBase(gh: GitHubClient, repo: string, number: number, base: string) {
	return gh.write('PATCH', `repos/${repo}/pulls/${number}`, { base });
}

/**
 * Squash-merges the PR, and restores its base when the merge is refused or
 * throws. Returns a refusal, or `undefined` once merged.
 */
async function mergeOrRestoreBase(
	gh: GitHubClient,
	repo: string,
	pr: PullRequest,
	route: Route
): Promise<JoinRefusal | undefined> {
	let refusal: JoinRefusal | undefined;
	try {
		refusal = await squashMerge(gh, repo, pr, route);
	} catch (error) {
		await restoreBase(gh, repo, pr, route, error);
		throw error;
	}
	if (refusal) await restoreBase(gh, repo, pr, route, refusal);
	return refusal;
}

/**
 * Changes the PR base back. If that fails too, the error keeps both: the
 * failure to restore, and `cause`, the reason for restoring.
 */
async function restoreBase(
	gh: GitHubClient,
	repo: string,
	pr: PullRequest,
	route: Route,
	cause: unknown
) {
	if (!route.shouldRetarget) return;
	try {
		await setBase(gh, repo, pr.number, pr.base);
	} catch (error) {
		throw new AggregateError([error], `Couldn't restore the base of #${pr.number}.`, { cause });
	}
}

async function squashMerge(
	gh: GitHubClient,
	repo: string,
	pr: PullRequest,
	route: Route
): Promise<JoinRefusal | undefined> {
	// GitHub computes the mergeability again after a base change.
	const { isMergeable } = await getPullRequest(gh, repo, pr.number);
	if (isMergeable === false) return { code: 'umbrella-conflict', branch: route.umbrellaBranch };

	try {
		await gh.write('PUT', `repos/${repo}/pulls/${pr.number}/merge`, {
			merge_method: 'squash',
			// Refuses the merge if the PR changed since its checks were read.
			sha: pr.headSha,
			// Set here rather than relying on how the API applies the squash
			// title setting of the repository.
			commit_title: `${pr.title} (#${pr.number})`,
		});
		return undefined;
	} catch (error) {
		if (error instanceof GitHubError) return { code: 'merge-failed', reason: error.reason };
		throw error;
	}
}

async function createUmbrella(
	gh: GitHubClient,
	repo: string,
	{ target, umbrellaBranch }: Route,
	title: string
): Promise<Extract<JoinResult, { status: 'joined' }> | UnopenedJoin> {
	let created: { number: number } | undefined;
	try {
		created = await gh.write<{ number: number }>('POST', `repos/${repo}/pulls`, {
			title,
			head: umbrellaBranch,
			base: target,
			body: `Release umbrella for \`${target}\`, managed by the release queue.`,
		});
	} catch (error) {
		return { status: 'unopened', error };
	}
	return { status: 'joined', umbrella: created ? { number: created.number } : { title } };
}
