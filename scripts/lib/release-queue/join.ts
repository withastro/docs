import { GitHubError } from './github-error.ts';
import { countCommitsAhead, getBranchSha, getPullRequest, type PullRequest } from './queries.ts';
import type { Repository } from './repository.ts';
import type { JoinRefusal, Route } from './routing.ts';
import type { Umbrella } from './umbrella-heading.ts';
import { findOpenUmbrella } from './umbrella-queries.ts';

/** A docs PR to join to the umbrella of `route`. */
export interface Join {
	pr: PullRequest;
	route: Route;
	/** The title of the umbrella PR, if the join opens it. */
	umbrellaTitle: string;
}

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
 * The umbrella branch before a join that opens the umbrella PR: missing, left
 * over without commits (for example after a failed first merge), or left over
 * with commits, which a maintainer has to look at.
 */
type UmbrellaBranch = { state: 'missing' | 'empty'; targetSha: string } | { state: 'stale' };

/**
 * Squash-merges a docs PR into its umbrella branch. Prepares the branch before
 * changing the PR, then changes the PR base, merges, and opens the umbrella
 * PR if none is open: GitHub refuses a PR without commits. A refused merge
 * restores the PR base. Expected failures come back as a result, anything
 * else throws. The refresh sets the labels and body.
 *
 * @param {Repository} repo - The docs repository, written as the bot account.
 * @param {Join} join - The PR to merge, its route, and the umbrella title.
 */
export async function joinUmbrella(
	repo: Repository,
	{ pr, route, umbrellaTitle }: Join
): Promise<JoinResult> {
	const openUmbrella = await findOpenUmbrella(repo, route.umbrellaBranch);
	if (!openUmbrella) {
		const branch = await readUmbrellaBranch(repo, route);
		if (branch.state === 'stale') {
			const refusal: JoinRefusal = { code: 'stale-umbrella-branch', branch: route.umbrellaBranch };
			return { status: 'refused', refusal };
		}
		await startUmbrellaBranch(repo, route, branch);
	}

	const refusal = route.shouldRetarget
		? await retargetAndMerge(repo, pr, route)
		: await squashMerge(repo, pr, route);
	if (refusal) return { status: 'refused', refusal };

	if (openUmbrella)
		return {
			status: 'joined',
			umbrella: { status: 'open', number: openUmbrella.number },
		};
	return createUmbrella(repo, route, umbrellaTitle);
}

async function readUmbrellaBranch(
	repo: Repository,
	{ target, umbrellaBranch }: Route
): Promise<UmbrellaBranch> {
	const targetSha = await getBranchSha(repo, target);
	if (!targetSha) throw new Error(`The branch ${target} doesn't exist in ${repo.name}.`);
	if ((await getBranchSha(repo, umbrellaBranch)) === undefined) {
		return { state: 'missing', targetSha };
	}
	const commitsAhead = await countCommitsAhead(repo, target, umbrellaBranch);
	return commitsAhead > 0 ? { state: 'stale' } : { state: 'empty', targetSha };
}

/** Creates the umbrella branch from its target, or resets an empty one. */
async function startUmbrellaBranch(
	repo: Repository,
	{ umbrellaBranch }: Route,
	branch: Extract<UmbrellaBranch, { state: 'missing' | 'empty' }>
) {
	if (branch.state === 'missing') {
		await repo.write('POST', 'git/refs', {
			ref: `refs/heads/${umbrellaBranch}`,
			sha: branch.targetSha,
		});
		return;
	}
	await repo.write('PATCH', `git/refs/heads/${umbrellaBranch}`, {
		sha: branch.targetSha,
		force: true,
	});
}

function setBase(repo: Repository, prNumber: number, base: string) {
	return repo.write('PATCH', `pulls/${prNumber}`, { base });
}

/**
 * Changes the PR base to the umbrella branch, then squash-merges the PR. The
 * base is restored when the merge is refused or throws. Returns a refusal, or
 * `undefined` once merged.
 */
async function retargetAndMerge(
	repo: Repository,
	pr: PullRequest,
	route: Route
): Promise<JoinRefusal | undefined> {
	await setBase(repo, pr.number, route.umbrellaBranch);
	// Not a `try` around both paths: a failed restore after a refusal would
	// then restore the base a second time.
	const refusal = await squashMerge(repo, pr, route).catch(async (error: unknown) => {
		await restoreBase(repo, pr, error);
		throw error;
	});
	if (refusal) await restoreBase(repo, pr, refusal);
	return refusal;
}

/**
 * Changes the PR base back. If that fails too, the error keeps both: the
 * failure to restore, and `cause`, the reason for restoring.
 */
async function restoreBase(repo: Repository, pr: PullRequest, cause: unknown) {
	try {
		await setBase(repo, pr.number, pr.base);
	} catch (error) {
		throw new AggregateError([error], `Couldn't restore the base of #${pr.number}.`, { cause });
	}
}

async function squashMerge(
	repo: Repository,
	pr: PullRequest,
	route: Route
): Promise<JoinRefusal | undefined> {
	// GitHub computes the mergeability again after a base change.
	const { isMergeable } = await getPullRequest(repo, pr.number);
	if (isMergeable === false) return { code: 'umbrella-conflict', branch: route.umbrellaBranch };

	try {
		await repo.write('PUT', `pulls/${pr.number}/merge`, {
			merge_method: 'squash',
			// Refuses the merge if the PR changed since its checks were read.
			sha: pr.headSha,
			// Set here rather than relying on how the API applies the squash
			// title setting of the repository.
			commit_title: `${pr.title} (#${pr.number})`,
		});
		return undefined;
	} catch (error) {
		if (error instanceof GitHubError) return { code: 'merge-failed', reason: error.githubReason };
		throw error;
	}
}

async function createUmbrella(
	repo: Repository,
	{ target, umbrellaBranch }: Route,
	title: string
): Promise<Extract<JoinResult, { status: 'joined' }> | UnopenedJoin> {
	try {
		const created = await repo.write<{ number: number }>('POST', 'pulls', {
			title,
			head: umbrellaBranch,
			base: target,
			body: `Release umbrella for \`${target}\`, managed by the release queue.`,
		});
		// Without an answer, the request was only printed.
		const umbrella: Umbrella = created
			? { status: 'open', number: created.number }
			: { status: 'planned', title };
		return { status: 'joined', umbrella };
	} catch (error) {
		return { status: 'unopened', error };
	}
}
