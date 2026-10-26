import { wrapInCode } from '../formats/markdown.ts';
import { GitHubError } from '../github/error.ts';
import type { Repository } from '../github/repository.ts';
import { findOpenUmbrella } from '../umbrella/queries.ts';
import { getPullRequest, type PullRequest } from './queries.ts';
import type { JoinRefusal, Route } from './routing.ts';

/** A docs PR to join to the umbrella of `route`. */
interface JoinRequest {
	pr: PullRequest;
	route: Route;
	/** The title given to the umbrella PR when the join opens it. */
	umbrellaTitle: string;
}

/**
 * An open umbrella PR, or a planned one that a join would create. A planned
 * umbrella has no number yet: its title names it.
 */
export type Umbrella = { status: 'open'; number: number } | { status: 'planned'; title: string };

/** The outcome of a join. */
type JoinResult =
	| { status: 'joined'; umbrella: Umbrella }
	| { status: 'refused'; refusal: JoinRefusal }
	| { status: 'unopened'; error: unknown };

/** A join that merged the PR, but couldn't open the umbrella PR. */
export type UnopenedJoin = Extract<JoinResult, { status: 'unopened' }>;

/**
 * The umbrella branch before a join that opens the umbrella PR: missing, left
 * over without commits (e.g. after a failed first merge), or left over with
 * commits, which a maintainer has to look at.
 */
type UmbrellaBranch = { state: 'missing' | 'empty'; umbrellaBaseSha: string } | { state: 'stale' };

/**
 * The join of a docs PR to its umbrella: the squash merge into the umbrella
 * branch, and the umbrella PR when none is open yet.
 */
export class UmbrellaJoin {
	#repo: Repository;
	#pr: PullRequest;
	#route: Route;
	#umbrellaTitle: string;

	/**
	 * Prepares the join of a docs PR.
	 *
	 * @param {Repository} repo - The docs repository.
	 * @param {JoinRequest} request - The PR to merge, its route, and the
	 *   umbrella title.
	 */
	constructor(repo: Repository, { pr, route, umbrellaTitle }: JoinRequest) {
		this.#repo = repo;
		this.#pr = pr;
		this.#route = route;
		this.#umbrellaTitle = umbrellaTitle;
	}

	/**
	 * Squash-merges the docs PR into its umbrella branch, then opens the
	 * umbrella PR if none is open, because GitHub refuses a PR without commits.
	 * The refresh sets the labels and the body of a new umbrella PR.
	 *
	 * @returns {Promise<JoinResult>} The umbrella the PR joined, or the expected
	 *   failure that stopped the join.
	 * @throws {Error} On any other failure, once the PR base is restored if it
	 *   changed.
	 */
	async mergePullRequest(): Promise<JoinResult> {
		const openUmbrella = await findOpenUmbrella(this.#repo, this.#route.umbrellaBranch);
		const branchRefusal = openUmbrella ? undefined : await this.#prepareUmbrellaBranch();
		if (branchRefusal) return { status: 'refused', refusal: branchRefusal };

		const mergeRefusal = this.#route.shouldRetarget
			? await this.#retargetAndMerge()
			: await this.#squashMerge();
		if (mergeRefusal) return { status: 'refused', refusal: mergeRefusal };

		if (!openUmbrella) return this.#createUmbrella();
		return { status: 'joined', umbrella: { status: 'open', number: openUmbrella.number } };
	}

	/**
	 * Starts the umbrella branch of a join that opens the umbrella PR. Refuses
	 * the join when the branch has commits left over.
	 */
	async #prepareUmbrellaBranch(): Promise<JoinRefusal | undefined> {
		const branch = await this.#readUmbrellaBranch();
		if (branch.state === 'stale') {
			return { code: 'stale-umbrella-branch', branch: this.#route.umbrellaBranch };
		}
		await this.#startUmbrellaBranch(branch);
		return undefined;
	}

	async #readUmbrellaBranch(): Promise<UmbrellaBranch> {
		const { umbrellaBase, umbrellaBranch } = this.#route;
		const umbrellaBaseSha = await this.#repo.getBranchSha(umbrellaBase);
		if (!umbrellaBaseSha) {
			throw new Error(`The branch ${umbrellaBase} doesn't exist in ${this.#repo.name}.`);
		}
		if ((await this.#repo.getBranchSha(umbrellaBranch)) === undefined) {
			return { state: 'missing', umbrellaBaseSha };
		}
		const commitsAhead = await this.#repo.countCommitsAhead(umbrellaBase, umbrellaBranch);
		return commitsAhead > 0 ? { state: 'stale' } : { state: 'empty', umbrellaBaseSha };
	}

	/** Creates the umbrella branch from its base, or resets an empty one. */
	async #startUmbrellaBranch(branch: Extract<UmbrellaBranch, { state: 'missing' | 'empty' }>) {
		const { umbrellaBranch } = this.#route;
		if (branch.state === 'missing') {
			await this.#repo.write('POST', 'git/refs', {
				ref: `refs/heads/${umbrellaBranch}`,
				sha: branch.umbrellaBaseSha,
			});
			return;
		}
		await this.#repo.write('PATCH', `git/refs/heads/${umbrellaBranch}`, {
			sha: branch.umbrellaBaseSha,
			force: true,
		});
	}

	#setBase(base: string) {
		return this.#repo.write('PATCH', `pulls/${this.#pr.number}`, { base });
	}

	/**
	 * Changes the PR base to the umbrella branch, then squash-merges the PR. The
	 * base is restored when the merge is refused or throws.
	 */
	async #retargetAndMerge(): Promise<JoinRefusal | undefined> {
		await this.#setBase(this.#route.umbrellaBranch);
		// Not a `try` around both paths because a failed restore after a refusal
		// would then restore the base a second time.
		const refusal = await this.#squashMerge().catch(async (error: unknown) => {
			await this.#restoreBase(error);
			throw error;
		});
		if (refusal) await this.#restoreBase(refusal);
		return refusal;
	}

	/** Changes the PR base back. */
	async #restoreBase(cause: unknown) {
		try {
			await this.#setBase(this.#pr.base);
		} catch (error) {
			throw new AggregateError([error], `Couldn't restore the base of #${this.#pr.number}.`, {
				cause,
			});
		}
	}

	async #squashMerge(): Promise<JoinRefusal | undefined> {
		const pr = this.#pr;
		// GitHub computes the mergeability again after a base change.
		const { isMergeable } = await getPullRequest(this.#repo, pr.number);
		if (isMergeable === false) {
			return { code: 'umbrella-conflict', branch: this.#route.umbrellaBranch };
		}

		try {
			await this.#repo.write('PUT', `pulls/${pr.number}/merge`, {
				merge_method: 'squash',
				// Refuses the merge if the PR changed since its checks were read.
				sha: pr.headSha,
				// The title GitHub gives a squash merge in the browser. Set here, as
				// the included PRs are read from it, whatever the squash setting of
				// the repository.
				commit_title: `${pr.title} (#${pr.number})`,
			});
			return undefined;
		} catch (error) {
			if (error instanceof GitHubError) return { code: 'merge-failed', reason: error.githubReason };
			throw error;
		}
	}

	async #createUmbrella(): Promise<Extract<JoinResult, { status: 'joined' }> | UnopenedJoin> {
		const { umbrellaBase, umbrellaBranch } = this.#route;
		const title = this.#umbrellaTitle;
		try {
			const created = await this.#repo.write<{ number: number }>('POST', 'pulls', {
				title,
				head: umbrellaBranch,
				base: umbrellaBase,
				body: `Release umbrella for ${wrapInCode(umbrellaBase)}, managed by the release queue.`,
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
}
