import { RELEASE_LABELS, RELEASE_TYPES, type ReleaseType } from '../config.ts';
import { hasLabel, type PullRequest } from '../github/repository.ts';
import {
	getUmbrellaBaseBranch,
	getUmbrellaBranches,
	isStableBranch,
	type UmbrellaBranches,
} from '../umbrella/umbrella.ts';

export const OUTCOMES = {
	join: 'join',
	refuse: 'refuse',
} as const;

export const REFUSAL_REASONS = {
	missingReleaseLabel: 'missing-release-label',
	severalReleaseLabels: 'several-release-labels',
	majorReleaseOnStableBranch: 'major-release-on-stable-branch',
	stableReleaseOnPrereleaseBranch: 'stable-release-on-prerelease-branch',
} as const;

export type RefusalReason = (typeof REFUSAL_REASONS)[keyof typeof REFUSAL_REASONS];

/** What decides whether a docs PR can go to the umbrella of its base branch. */
type RoutingFacts = {
	releaseLabelCount: number;
	/** `null` without exactly one release label. The base branch checks then don't apply. */
	releaseType: ReleaseType | null;
	isStableUmbrella: boolean;
};

type ProblemChecks<T> = [RefusalReason, (facts: T) => boolean][];

const ROUTING_PROBLEM_CHECKS: ProblemChecks<RoutingFacts> = [
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
];

export type Refusal = {
	outcome: typeof OUTCOMES.refuse;
	reasons: RefusalReason[];
	/** The branches of the umbrella the PR would join. */
	branches: UmbrellaBranches;
};

export type Decision = { outcome: typeof OUTCOMES.join; branches: UmbrellaBranches } | Refusal;

/**
 * Decides whether a docs PR joins the umbrella of its base branch.
 *
 * A PR based on an umbrella branch belongs to that umbrella.
 *
 * @param {Pick<PullRequest, 'base' | 'labels'>} pullRequest - The docs PR.
 * @returns {Decision} The umbrella to join, or a refusal with every reason.
 */
export function decideJoin(pullRequest: Pick<PullRequest, 'base' | 'labels'>): Decision {
	const reasons = findProblems(ROUTING_PROBLEM_CHECKS, readRoutingFacts(pullRequest));
	const branches = getUmbrellaBranches(getTargetBaseBranch(pullRequest));
	return reasons.length > 0
		? { outcome: OUTCOMES.refuse, reasons, branches }
		: { outcome: OUTCOMES.join, branches };
}

function readRoutingFacts(pullRequest: Pick<PullRequest, 'base' | 'labels'>): RoutingFacts {
	const releaseTypes = getReleaseTypes(pullRequest);
	return {
		releaseLabelCount: releaseTypes.length,
		releaseType: releaseTypes.length === 1 ? releaseTypes[0] : null,
		isStableUmbrella: isStableBranch(getTargetBaseBranch(pullRequest)),
	};
}

/** Gets the base branch of the umbrella a PR belongs to: its own base, or its umbrella's base. */
function getTargetBaseBranch({ base }: Pick<PullRequest, 'base'>) {
	return getUmbrellaBaseBranch(base.ref) ?? base.ref;
}

function getReleaseTypes(pullRequest: Pick<PullRequest, 'labels'>): ReleaseType[] {
	return Object.values(RELEASE_TYPES).filter((type) => hasLabel(pullRequest, RELEASE_LABELS[type]));
}

function findProblems<T>(checks: ProblemChecks<T>, facts: T): RefusalReason[] {
	return checks.filter(([, isProblem]) => isProblem(facts)).map(([reason]) => reason);
}
