import {
	ACCEPTED_LABEL,
	DOCS_STABLE_BRANCH,
	RELEASE_LABELS,
	UMBRELLA_BRANCH_PREFIX,
} from './config.ts';
import { OUTCOMES, REFUSAL_REASONS, type Decision, type RefusalReason } from './decision.ts';
import type { UmbrellaBranches } from './umbrella.ts';

const { patch, minor, major } = RELEASE_LABELS;
const RETRY_INSTRUCTION = `Once fixed, add \`${ACCEPTED_LABEL}\` again.`;

const REFUSAL_MESSAGES: Record<RefusalReason, string> = {
	[REFUSAL_REASONS.missingReleaseLabel]: `This PR has no release label. Add \`${patch}\` or \`${minor}\` if it ships in a release from \`${DOCS_STABLE_BRANCH}\`, or \`${major}\` if it ships with a prerelease branch.`,
	[REFUSAL_REASONS.severalReleaseLabels]: `This PR has several release labels. Keep only the one for the release it ships in.`,
	[REFUSAL_REASONS.majorReleaseOnStableBranch]: `This PR has \`${major}\`, but its base branch is \`${DOCS_STABLE_BRANCH}\`. Change its base to the prerelease branch it ships with, or replace \`${major}\` with \`${patch}\` or \`${minor}\`.`,
	[REFUSAL_REASONS.stableReleaseOnPrereleaseBranch]: `This PR has \`${patch}\` or \`${minor}\`, but its base branch is a prerelease branch. Change its base to \`${DOCS_STABLE_BRANCH}\`, or replace its release label with \`${major}\`.`,
	[REFUSAL_REASONS.majorReleasePending]: `The next stable release of Astro is a major: everything merged now ships with it, so this PR belongs to its prerelease branch. Change its base to that branch, and replace its release label with \`${major}\`.`,
	[REFUSAL_REASONS.settledUmbrella]: `The release of this PR's umbrella is out, so this PR belongs to the next release: add \`${ACCEPTED_LABEL}\` again once a maintainer has merged the umbrella PR. If this PR documents the release that is out, change its base to the \`${UMBRELLA_BRANCH_PREFIX}\` branch of the umbrella first.`,
	[REFUSAL_REASONS.draft]: `This PR is a draft. Mark it as ready for review first.`,
	[REFUSAL_REASONS.changesRequested]: `A maintainer requested changes. Address them, then ask for a new review.`,
	[REFUSAL_REASONS.missingApproval]: `This PR needs an approval from a maintainer.`,
	[REFUSAL_REASONS.mergeConflict]: `This PR has conflicts with its base branch. Resolve them first.`,
	[REFUSAL_REASONS.unknownMergeability]: `GitHub is still checking this PR for conflicts. Try again in a few minutes.`,
	[REFUSAL_REASONS.failingChecks]: `Some checks fail. Fix them first.`,
	[REFUSAL_REASONS.pendingChecks]: `Some checks are still running. Wait for them to finish.`,
};

/**
 * Renders the comment explaining why a docs PR can't join its umbrella, and
 * how to retry.
 *
 * @param {RefusalReason[]} reasons - Why the PR is refused, at least one reason.
 * @returns {string} The comment, in Markdown.
 */
export function renderRefusalComment(reasons: RefusalReason[]): string {
	const messages = reasons.map((reason) => REFUSAL_MESSAGES[reason]);
	const explanation =
		messages.length === 1
			? messages[0]
			: `This PR can't join its umbrella yet:\n\n${messages.map((message) => `- ${message}`).join('\n')}`;

	return `${explanation}\n\n${RETRY_INSTRUCTION}`;
}

/**
 * Renders the comment telling a docs PR it joined its umbrella.
 *
 * @param {UmbrellaBranches} branches - The umbrella branches the PR was merged into.
 * @param {number} umbrellaPrNumber - The number of the umbrella PR.
 * @returns {string} The comment, in Markdown.
 */
export function renderJoinedComment(
	{ head, base }: UmbrellaBranches,
	umbrellaPrNumber: number
): string {
	return `Merged into \`${head}\`, the umbrella branch for the next release into \`${base}\`. It ships with #${umbrellaPrNumber}.`;
}

/**
 * Renders the comment telling a docs PR that GitHub refused to merge it into
 * its umbrella.
 *
 * @param {UmbrellaBranches} branches - The umbrella branches the PR was to be merged into.
 * @param {string} apiMessage - GitHub's reason.
 * @returns {string} The comment, in Markdown.
 */
export function renderMergeFailureComment({ head }: UmbrellaBranches, apiMessage: string): string {
	return `GitHub refused to merge this PR into \`${head}\`, with this message:\n\n${quote(apiMessage)}\n\n${RETRY_INSTRUCTION}`;
}

/**
 * Renders the comment telling a docs PR it was merged, but its umbrella PR
 * could not be opened.
 *
 * @param {UmbrellaBranches} branches - The umbrella branches the PR was merged into.
 * @param {string} apiMessage - GitHub's reason.
 * @returns {string} The comment, in Markdown.
 */
export function renderUmbrellaFailureComment(
	{ head, base }: UmbrellaBranches,
	apiMessage: string
): string {
	return `Merged into \`${head}\`, but the release queue couldn't open the umbrella PR into \`${base}\`, with this message from GitHub:\n\n${quote(apiMessage)}\n\nA maintainer needs to open it by hand.`;
}

/**
 * Renders the comment telling what the release queue would do with a docs PR
 * once live.
 *
 * @param {Decision} decision - The umbrella the PR would join, or why it would be refused.
 * @returns {string} The comment, in Markdown.
 */
export function renderDryRunComment(decision: Decision): string {
	const outcome =
		decision.outcome === OUTCOMES.join
			? `will merge this PR into \`${decision.branches.head}\`, the umbrella branch for the next release into \`${decision.branches.base}\`.`
			: `will remove \`${ACCEPTED_LABEL}\` and reply:\n\n${quote(renderRefusalComment(decision.reasons))}`;

	return `**Dry run**: once the release queue is live, it ${outcome}\n\nNothing has changed yet: handle this PR as usual.`;
}

function quote(markdown: string) {
	return markdown
		.split('\n')
		.map((line) => (line ? `> ${line}` : '>'))
		.join('\n');
}
