import type { PullRequest } from '../lib/github/repository.ts';
import { DOCS_STABLE_BRANCH, RELEASE_LABELS, RELEASE_TYPES, type ReleaseType } from './config.ts';
import type { FrameworkRelease } from './release.ts';
import { getUmbrellaBaseBranch, getUmbrellaBranch } from './umbrella.ts';

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
	draft: 'draft',
	changesRequested: 'changes-requested',
	missingApproval: 'missing-approval',
	mergeConflict: 'merge-conflict',
	unknownMergeability: 'unknown-mergeability',
	failingChecks: 'failing-checks',
	pendingChecks: 'pending-checks',
} as const;

export type RefusalReason = (typeof REFUSAL_REASONS)[keyof typeof REFUSAL_REASONS];

export type Route = {
	umbrellaBranch: string;
	/** The branch the umbrella PR merges into. */
	umbrellaBaseBranch: string;
};

export type Decision =
	| { outcome: typeof OUTCOMES.join; route: Route }
	| { outcome: typeof OUTCOMES.refuse; reasons: RefusalReason[] };

/**
 * Finds the umbrella a docs PR belongs to, from its base branch and its release label.
 *
 * A PR based on the stable branch needs a patch or minor release label, and a PR based on any
 * other branch needs the major release label. A PR based on an umbrella branch belongs to that
 * umbrella, with the same rule for the umbrella's base.
 *
 * While the next stable release of the framework is a major, the stable umbrella takes no PR:
 * everything merged in the framework then ships in the major, so its docs belong to the
 * prerelease branch.
 *
 * @param {Pick<PullRequest, 'base' | 'labels'>} pullRequest - The docs PR.
 * @param {Pick<FrameworkRelease, 'type'> | null} stableRelease - The next stable release of the
 * framework, or `null` when none is open.
 * @returns {Decision} The umbrella to join, or why the PR can't join it.
 */
export function routePullRequest(
	pullRequest: Pick<PullRequest, 'base' | 'labels'>,
	stableRelease: Pick<FrameworkRelease, 'type'> | null
): Decision {
	const releaseTypes = getReleaseTypes(pullRequest);
	if (releaseTypes.length === 0) return refuse(REFUSAL_REASONS.missingReleaseLabel);
	if (releaseTypes.length > 1) return refuse(REFUSAL_REASONS.severalReleaseLabels);

	const baseBranch = pullRequest.base.ref;
	const umbrellaBaseBranch = getUmbrellaBaseBranch(baseBranch) ?? baseBranch;
	const isStable = umbrellaBaseBranch === DOCS_STABLE_BRANCH;
	const isMajor = releaseTypes[0] === RELEASE_TYPES.major;
	if (isStable && isMajor) return refuse(REFUSAL_REASONS.majorReleaseOnStableBranch);
	if (!isStable && !isMajor) return refuse(REFUSAL_REASONS.stableReleaseOnPrereleaseBranch);
	if (isStable && stableRelease?.type === RELEASE_TYPES.major) {
		return refuse(REFUSAL_REASONS.majorReleasePending);
	}

	return {
		outcome: OUTCOMES.join,
		route: { umbrellaBranch: getUmbrellaBranch(umbrellaBaseBranch), umbrellaBaseBranch },
	};
}

function getReleaseTypes({ labels }: Pick<PullRequest, 'labels'>): ReleaseType[] {
	const labelNames = labels.map(({ name }) => name);
	return Object.values(RELEASE_TYPES).filter((type) => labelNames.includes(RELEASE_LABELS[type]));
}

function refuse(reason: RefusalReason): Decision {
	return { outcome: OUTCOMES.refuse, reasons: [reason] };
}
