import type { PullRequest } from '../lib/github/repository.ts';
import { RELEASE_LABELS, RELEASE_TYPES, type ReleaseType } from './config.ts';
import type { Readiness } from './readiness.ts';
import { isMajorRelease, type FrameworkRelease } from './release.ts';
import { isSettled } from './run.ts';
import {
	getUmbrellaBaseBranch,
	getUmbrellaBranches,
	isStableBranch,
	type UmbrellaBranches,
} from './umbrella.ts';

export const OUTCOMES = {
	join: 'join',
	refuse: 'refuse',
} as const;

export const REFUSAL_REASONS = {
	missingReleaseLabel: 'missing-release-label',
	severalReleaseLabels: 'several-release-labels',
	majorReleaseOnStableBranch: 'major-release-on-stable-branch',
	stableReleaseOnPrereleaseBranch: 'stable-release-on-prerelease-branch',
	majorReleasePending: 'major-release-pending',
	settledUmbrella: 'settled-umbrella',
	draft: 'draft',
	changesRequested: 'changes-requested',
	missingApproval: 'missing-approval',
	mergeConflict: 'merge-conflict',
	unknownMergeability: 'unknown-mergeability',
	failingChecks: 'failing-checks',
	pendingChecks: 'pending-checks',
} as const;

export type RefusalReason = (typeof REFUSAL_REASONS)[keyof typeof REFUSAL_REASONS];

/** What routing reads from the release state. */
type RoutingState = {
	releases: { stable: Pick<FrameworkRelease, 'type'> | null };
	settledBaseBranches: readonly string[];
};

type DecisionFacts = {
	state: RoutingState;
	readiness: Readiness;
};

/** What decides whether a docs PR can go to the umbrella of its base branch. */
type Routing = {
	releaseLabelCount: number;
	/** `null` without a single release label, which skips the checks on the base branch. */
	releaseType: ReleaseType | null;
	isStableUmbrella: boolean;
	isBasedOnUmbrella: boolean;
	isMajorReleasePending: boolean;
	isUmbrellaSettled: boolean;
};

type Problems<T> = [RefusalReason, (facts: T) => boolean][];

const ROUTING_PROBLEMS: Problems<Routing> = [
	[REFUSAL_REASONS.missingReleaseLabel, ({ releaseLabelCount }) => releaseLabelCount === 0],
	[REFUSAL_REASONS.severalReleaseLabels, ({ releaseLabelCount }) => releaseLabelCount > 1],
	[
		REFUSAL_REASONS.majorReleaseOnStableBranch,
		({ releaseType, isStableUmbrella }) => isStableUmbrella && releaseType === RELEASE_TYPES.major,
	],
	[
		REFUSAL_REASONS.stableReleaseOnPrereleaseBranch,
		({ releaseType, isStableUmbrella }) =>
			!isStableUmbrella && releaseType !== null && releaseType !== RELEASE_TYPES.major,
	],
	[
		REFUSAL_REASONS.majorReleasePending,
		({ isStableUmbrella, isMajorReleasePending }) => isStableUmbrella && isMajorReleasePending,
	],
	[
		REFUSAL_REASONS.settledUmbrella,
		({ isBasedOnUmbrella, isUmbrellaSettled }) => !isBasedOnUmbrella && isUmbrellaSettled,
	],
];

const READINESS_PROBLEMS: Problems<Readiness> = [
	[REFUSAL_REASONS.draft, ({ isDraft }) => isDraft],
	[REFUSAL_REASONS.changesRequested, (readiness) => readiness.hasChangesRequestedByMaintainer],
	[REFUSAL_REASONS.missingApproval, ({ isApprovedByMaintainer }) => !isApprovedByMaintainer],
	[REFUSAL_REASONS.mergeConflict, ({ isMergeable }) => isMergeable === false],
	[REFUSAL_REASONS.unknownMergeability, ({ isMergeable }) => isMergeable === null],
	[REFUSAL_REASONS.failingChecks, ({ hasFailingChecks }) => hasFailingChecks],
	[REFUSAL_REASONS.pendingChecks, ({ hasPendingChecks }) => hasPendingChecks],
];

export type Decision =
	| { outcome: typeof OUTCOMES.join; branches: UmbrellaBranches }
	| { outcome: typeof OUTCOMES.refuse; reasons: RefusalReason[] };

/**
 * Decides whether a docs PR joins the umbrella of its base branch, or gives every reason it can't.
 *
 * A PR based on an umbrella branch belongs to that umbrella.
 *
 * @param {Pick<PullRequest, 'base' | 'labels'>} pullRequest - The docs PR.
 * @param {DecisionFacts} facts - The state of the run, and whether the PR can be merged.
 * @returns {Decision} The umbrella to join, or the reasons, first about where the PR goes, then
 * about whether it can be merged.
 */
export function decideJoin(
	pullRequest: Pick<PullRequest, 'base' | 'labels'>,
	{ state, readiness }: DecisionFacts
): Decision {
	const reasons = [
		...findProblems(ROUTING_PROBLEMS, readRouting(pullRequest, state)),
		...findProblems(READINESS_PROBLEMS, readiness),
	];
	if (reasons.length > 0) return { outcome: OUTCOMES.refuse, reasons };

	return {
		outcome: OUTCOMES.join,
		branches: getUmbrellaBranches(getTargetBaseBranch(pullRequest)),
	};
}

function readRouting(
	pullRequest: Pick<PullRequest, 'base' | 'labels'>,
	state: RoutingState
): Routing {
	const releaseTypes = getReleaseTypes(pullRequest);
	const targetBaseBranch = getTargetBaseBranch(pullRequest);
	return {
		releaseLabelCount: releaseTypes.length,
		releaseType: releaseTypes.length === 1 ? releaseTypes[0] : null,
		isStableUmbrella: isStableBranch(targetBaseBranch),
		isBasedOnUmbrella: getUmbrellaBaseBranch(pullRequest.base.ref) !== null,
		isMajorReleasePending: isMajorRelease(state.releases.stable),
		isUmbrellaSettled: isSettled(state, targetBaseBranch),
	};
}

/** Gets the base branch of the umbrella a PR belongs to: its own base, or its umbrella's base. */
function getTargetBaseBranch({ base }: Pick<PullRequest, 'base'>) {
	return getUmbrellaBaseBranch(base.ref) ?? base.ref;
}

function getReleaseTypes({ labels }: Pick<PullRequest, 'labels'>): ReleaseType[] {
	const labelNames = labels.map(({ name }) => name);
	return Object.values(RELEASE_TYPES).filter((type) => labelNames.includes(RELEASE_LABELS[type]));
}

function findProblems<T>(problems: Problems<T>, facts: T): RefusalReason[] {
	return problems.filter(([, isProblem]) => isProblem(facts)).map(([reason]) => reason);
}
