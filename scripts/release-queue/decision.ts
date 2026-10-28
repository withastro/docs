import type { PullRequest } from '../lib/github/repository.ts';
import { RELEASE_LABELS, RELEASE_TYPES, type ReleaseType } from './config.ts';
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

export type Decision =
	| { outcome: typeof OUTCOMES.join; branches: UmbrellaBranches }
	| { outcome: typeof OUTCOMES.refuse; reasons: RefusalReason[] };

/**
 * Finds the umbrella a docs PR belongs to, from its base branch and its release label.
 *
 * A PR based on an umbrella branch belongs to that umbrella.
 *
 * @param {Pick<PullRequest, 'base' | 'labels'>} pullRequest - The docs PR.
 * @param {RoutingState} state - The next stable release of the framework, and the base branches
 * of the settled umbrellas.
 * @returns {Decision} The umbrella to join, or why the PR can't join it.
 */
export function routePullRequest(
	pullRequest: Pick<PullRequest, 'base' | 'labels'>,
	state: RoutingState
): Decision {
	const releaseTypes = getReleaseTypes(pullRequest);
	const baseBranch = pullRequest.base.ref;
	const umbrellaBaseBranch = getUmbrellaBaseBranch(baseBranch) ?? baseBranch;
	const reason =
		findLabelProblem(releaseTypes) ??
		findBaseProblem(releaseTypes[0], umbrellaBaseBranch) ??
		findUmbrellaProblem(baseBranch, umbrellaBaseBranch, state);

	return reason
		? { outcome: OUTCOMES.refuse, reasons: [reason] }
		: { outcome: OUTCOMES.join, branches: getUmbrellaBranches(umbrellaBaseBranch) };
}

/** A docs PR needs a single release label: the release it ships in. */
function findLabelProblem(releaseTypes: ReleaseType[]): RefusalReason | null {
	if (releaseTypes.length === 0) return REFUSAL_REASONS.missingReleaseLabel;
	if (releaseTypes.length > 1) return REFUSAL_REASONS.severalReleaseLabels;
	return null;
}

/** The stable branch takes patch and minor releases, and any other branch the major release. */
function findBaseProblem(
	releaseType: ReleaseType,
	umbrellaBaseBranch: string
): RefusalReason | null {
	const isStable = isStableBranch(umbrellaBaseBranch);
	const isMajor = releaseType === RELEASE_TYPES.major;
	if (isStable && isMajor) return REFUSAL_REASONS.majorReleaseOnStableBranch;
	if (!isStable && !isMajor) return REFUSAL_REASONS.stableReleaseOnPrereleaseBranch;
	return null;
}

/**
 * While the next stable release of the framework is a major, the stable umbrella takes no PR:
 * everything merged in the framework then ships in the major, so its docs belong to the
 * prerelease branch. A settled umbrella only takes the PRs based on its branch: the others belong
 * to the next release.
 */
function findUmbrellaProblem(
	baseBranch: string,
	umbrellaBaseBranch: string,
	state: RoutingState
): RefusalReason | null {
	if (isStableBranch(umbrellaBaseBranch) && isMajorRelease(state.releases.stable)) {
		return REFUSAL_REASONS.majorReleasePending;
	}
	const isBasedOnUmbrella = baseBranch !== umbrellaBaseBranch;
	if (!isBasedOnUmbrella && isSettled(state, umbrellaBaseBranch)) {
		return REFUSAL_REASONS.settledUmbrella;
	}
	return null;
}

function getReleaseTypes({ labels }: Pick<PullRequest, 'labels'>): ReleaseType[] {
	const labelNames = labels.map(({ name }) => name);
	return Object.values(RELEASE_TYPES).filter((type) => labelNames.includes(RELEASE_LABELS[type]));
}
