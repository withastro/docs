import { ACCEPTED_LABEL } from './config.ts';
import type { Repository } from './github/repository.ts';
import {
	formatDryRunJoinComment,
	formatDryRunRefusalComment,
	formatJoinComment,
	formatRefusalComment,
	formatUnopenedJoinComment,
	type MessageContext,
} from './join/messages.ts';
import { getPullRequest, getReadiness, type PullRequest } from './join/queries.ts';
import {
	decideJoin,
	wouldRetargetFromStable,
	type Decision,
	type RefusedDecision,
	type Route,
} from './join/routing.ts';
import { UmbrellaJoin, type Umbrella } from './join/umbrella-join.ts';
import { canActOn } from './modes.ts';
import { readFrameworkReleases, type FrameworkReleases } from './release/queries.ts';
import type { RunContext } from './run-context.ts';
import { getUmbrellaBase, STABLE_UMBRELLA_BRANCH } from './umbrella/branch.ts';
import { getUmbrellaTitle } from './umbrella/heading.ts';
import { findOpenUmbrella, getUmbrella } from './umbrella/queries.ts';
import { UmbrellaRefresher } from './umbrella/refresh.ts';
import { getSettledStableUmbrella } from './umbrella/state.ts';

/**
 * A docs PR labeled as accepted, with the release it ships with and the
 * decision on it.
 */
interface DecidedPullRequest {
	pr: PullRequest;
	releases: FrameworkReleases;
	decision: Decision;
}

/**
 * Joins a docs PR labeled as accepted to its umbrella, refuses it, or
 * comments on it as a dry run.
 *
 * @param {RunContext} run - The repositories and the mode of the run.
 * @param {number} prNumber - The number of the docs PR.
 * @param {string} [labelSender] - Who added the label. Without it, the write
 *   access check is skipped, as in a local run.
 */
export async function handleAcceptedPullRequest(
	run: RunContext,
	prNumber: number,
	labelSender?: string
) {
	if (!(await isSenderAllowed(run.actions, labelSender))) return;

	const { pr, releases, decision } = await readAcceptedPullRequest(run, prNumber);
	console.info(JSON.stringify({ pr: pr.url, release: releases.stable, decision }, null, 2));
	const accepted = new AcceptedPullRequest(run, { pr, releases });
	if (!canActOn(run.mode, getUmbrellaBase(pr.base))) {
		await accepted.commentDryRun(decision);
	} else if (decision.status === 'refuse') {
		await accepted.refuse(decision);
	} else {
		await accepted.join(decision.route);
	}
}

/** Whether `labelSender` can write to the repository, like maintainers do. */
async function isSenderAllowed(
	repo: Repository,
	labelSender: string | undefined
): Promise<boolean> {
	if (labelSender === undefined) {
		console.info('No label sender: skipping the write access check.');
		return true;
	}
	if (await repo.canWrite(labelSender)) return true;
	console.info(`Ignored: ${labelSender} can't write to ${repo.name}.`);
	return false;
}

/**
 * Reads a docs PR with what decides its join: its readiness, the next stable
 * release, and the settled stable umbrella.
 */
async function readAcceptedPullRequest(
	{ actions, framework }: RunContext,
	prNumber: number
): Promise<DecidedPullRequest> {
	const pr = await getPullRequest(actions, prNumber);
	const [readiness, releases] = await Promise.all([
		getReadiness(actions, pr),
		readFrameworkReleases(framework),
	]);
	const settledStableUmbrella = wouldRetargetFromStable(pr)
		? await getSettledStableUmbrella(actions, releases)
		: undefined;
	const decision = decideJoin(pr, readiness, { release: releases.stable, settledStableUmbrella });
	return { pr, releases, decision };
}

/**
 * A docs PR labeled as accepted, and what the bot does with it in a run: a
 * dry-run comment, a refusal, or a join.
 */
class AcceptedPullRequest {
	#run: RunContext;
	#pr: PullRequest;
	#releases: FrameworkReleases;

	/**
	 * Prepares what the bot does with an accepted docs PR.
	 *
	 * @param {RunContext} run - The repositories of the run.
	 * @param {object} accepted - The docs PR, and the releases of the framework.
	 * @param {PullRequest} accepted.pr - The docs PR.
	 * @param {FrameworkReleases} accepted.releases - The releases of the
	 *   framework.
	 */
	constructor(run: RunContext, { pr, releases }: { pr: PullRequest; releases: FrameworkReleases }) {
		this.#run = run;
		this.#pr = pr;
		this.#releases = releases;
	}

	/**
	 * Comments on the PR with what a join would do, or why it would be refused.
	 *
	 * @param {Decision} decision - The decision on the PR.
	 */
	async commentDryRun(decision: Decision) {
		const { actions } = this.#run;
		if (decision.status === 'join') {
			const umbrella = await this.#findOrPlanUmbrella(decision.route);
			await actions.postComment(this.#pr.number, formatDryRunJoinComment(decision.route, umbrella));
			return;
		}
		const context = await this.#getMessageContext(decision);
		await actions.postComment(this.#pr.number, formatDryRunRefusalComment(decision, context));
	}

	/**
	 * Removes the accepted label, then says why on the PR.
	 *
	 * @param {RefusedDecision} decision - The refusals, and the route if any.
	 */
	async refuse(decision: RefusedDecision) {
		const { bot } = this.#run;
		const context = await this.#getMessageContext(decision);
		// Removed first, so the comment is true once posted.
		await bot.removeLabel(this.#pr.number, ACCEPTED_LABEL);
		await bot.postComment(this.#pr.number, formatRefusalComment(decision, context));
	}

	/**
	 * Joins the PR to the umbrella of `route`, then says how it went on the PR.
	 *
	 * @param {Route} route - The umbrella branch and base the PR goes to.
	 * @throws {Error} When the PR was merged, but the umbrella PR couldn't be
	 *   opened.
	 */
	async join(route: Route) {
		const pr = this.#pr;
		const umbrellaTitle = getUmbrellaTitle(route.umbrellaBase, this.#releases.stable);
		const join = new UmbrellaJoin(this.#run.bot, { pr, route, umbrellaTitle });
		const result = await join.mergePullRequest();

		switch (result.status) {
			case 'joined':
				await this.#announceJoin(route, result.umbrella);
				return;
			case 'refused':
				await this.refuse({ status: 'refuse', route, refusals: [result.refusal] });
				return;
			case 'unopened':
				await this.#run.bot.postComment(pr.number, formatUnopenedJoinComment(route, result));
				// The PR is merged, but a maintainer needs to open the umbrella PR.
				throw new Error(
					`#${pr.number} was merged into ${route.umbrellaBranch}, but the umbrella PR couldn't be opened.`,
					{ cause: result.error }
				);
			default: {
				const unknown: never = result;
				throw new Error(`Unknown join result: ${JSON.stringify(unknown)}`);
			}
		}
	}

	/**
	 * Comments on the PR that joined `umbrella`, then refreshes the umbrella and
	 * blocks its merge until a maintainer checks it.
	 */
	async #announceJoin(route: Route, umbrella: Umbrella) {
		const { bot } = this.#run;
		await bot.postComment(this.#pr.number, formatJoinComment(route, umbrella));
		// A planned umbrella was only printed.
		if (umbrella.status === 'planned') return;
		const openUmbrella = await getUmbrella(bot, umbrella.number);
		const refresher = new UmbrellaRefresher(this.#run, this.#releases);
		await refresher.refresh(openUmbrella, { shouldBlock: true });
	}

	/** Finds the open umbrella PR of `route`, or names the one to create. */
	async #findOrPlanUmbrella(route: Route): Promise<Umbrella> {
		const openUmbrella = await findOpenUmbrella(this.#run.actions, route.umbrellaBranch);
		if (openUmbrella) return { status: 'open', number: openUmbrella.number };
		return {
			status: 'planned',
			title: getUmbrellaTitle(route.umbrellaBase, this.#releases.stable),
		};
	}

	async #getMessageContext(decision: RefusedDecision): Promise<MessageContext> {
		const [umbrella, stableUmbrella] = await Promise.all([
			decision.route && this.#findOrPlanUmbrella(decision.route),
			findStableUmbrellaToMove(this.#run.actions, decision),
		]);
		return { umbrella, stableUmbrella };
	}
}

/**
 * Finds the open stable umbrella that a maintainer moves to the prerelease
 * branch before a major, when the decision refuses a PR for that major.
 */
async function findStableUmbrellaToMove(
	repo: Repository,
	decision: RefusedDecision
): Promise<{ number: number } | undefined> {
	if (!decision.refusals.some((refusal) => refusal.code === 'major-on-stable')) return undefined;
	const stableUmbrella = await findOpenUmbrella(repo, STABLE_UMBRELLA_BRANCH);
	return stableUmbrella && { number: stableUmbrella.number };
}
