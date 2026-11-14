import { ACCEPTED_LABEL, DOCS_STABLE_BRANCH, RELEASE_LABELS } from '../config.ts';
import type { UmbrellaBranches } from '../umbrella/umbrella.ts';
import {
	OUTCOMES,
	REFUSAL_REASONS,
	type Decision,
	type Refusal,
	type RefusalReason,
} from './decision.ts';

const { patch, minor, major } = RELEASE_LABELS;
const RETRY_INSTRUCTION = `Once fixed, a maintainer can add \`${ACCEPTED_LABEL}\` again.`;

/** Explains a refusal, as a list item. Takes the branches of the umbrella the PR would join. */
type RefusalMessage = (branches: UmbrellaBranches) => string;

const REFUSAL_MESSAGES: Record<RefusalReason, RefusalMessage> = {
	[REFUSAL_REASONS.missingReleaseLabel]: () =>
		`It has no release label. Add \`${patch}\` or \`${minor}\` for a release from \`${DOCS_STABLE_BRANCH}\`, or \`${major}\` for a prerelease branch.`,
	[REFUSAL_REASONS.severalReleaseLabels]: () => 'It has several release labels. Keep only one.',
	[REFUSAL_REASONS.majorReleaseOnStableBranch]: () =>
		`It has \`${major}\`, but its base branch is \`${DOCS_STABLE_BRANCH}\`. Change its base to the prerelease branch, or use \`${patch}\` or \`${minor}\` instead.`,
	[REFUSAL_REASONS.stableReleaseOnPrereleaseBranch]: () =>
		`It has \`${patch}\` or \`${minor}\`, but its base branch is a prerelease branch. Change its base to \`${DOCS_STABLE_BRANCH}\`, or use \`${major}\` instead.`,
	[REFUSAL_REASONS.draft]: () => "It's a draft. Mark it as ready for review.",
	[REFUSAL_REASONS.changesRequested]: () =>
		'A maintainer requested changes. Address them, then ask for a new review.',
	[REFUSAL_REASONS.missingApproval]: () => 'It needs an approval from a maintainer.',
	[REFUSAL_REASONS.mergeConflict]: () => 'It has conflicts with its base branch. Resolve them.',
	[REFUSAL_REASONS.unknownMergeability]: () =>
		'GitHub is still checking it for conflicts. Try again in a few minutes.',
	[REFUSAL_REASONS.failingChecks]: () => 'Some checks are failing. Fix them.',
	[REFUSAL_REASONS.pendingChecks]: () => 'Some checks are still running. Wait for them to finish.',
	[REFUSAL_REASONS.checksAwaitingApproval]: () =>
		"Some workflows are waiting for a maintainer's approval. Approve them, then wait for them to finish.",
};

/**
 * Renders the comment explaining why a docs PR can't join its umbrella, and
 * how to retry.
 *
 * @param {Pick<Refusal, 'reasons' | 'branches'>} refusal - The refusal, with at least one reason.
 * @returns {string} The comment, in Markdown.
 */
export function renderRefusalComment({
	reasons,
	branches,
}: Pick<Refusal, 'reasons' | 'branches'>): string {
	const reasonList = reasons.map((reason) => `- ${REFUSAL_MESSAGES[reason](branches)}`);
	return [
		`\`${ACCEPTED_LABEL}\` was removed. This PR can't join its umbrella PR yet:`,
		reasonList.join('\n'),
		RETRY_INSTRUCTION,
	].join('\n\n');
}

/**
 * Renders the comment telling an umbrella PR with the accepted label that a
 * maintainer merges it.
 *
 * @returns {string} The comment, in Markdown.
 */
export function renderAcceptedUmbrellaComment(): string {
	return `\`${ACCEPTED_LABEL}\` was removed because it doesn't apply to umbrella PRs. A maintainer merges it by hand once the release is out, after going through the checklist.`;
}

/**
 * Renders the comment telling what the release assistant would do with a docs
 * PR once live.
 *
 * @param {Decision} decision - The umbrella the PR would join, or why it would be refused.
 * @returns {string} The comment, in Markdown.
 */
export function renderDryRunComment(decision: Decision): string {
	const outcome =
		decision.outcome === OUTCOMES.join
			? `would merge this PR into \`${decision.branches.head}\`, the branch of the umbrella PR into \`${decision.branches.base}\`.`
			: `would reply:\n\n${quote(renderRefusalComment(decision))}`;

	return [
		`**Dry run**: the release assistant isn't live yet, so nothing was merged. Handle this PR as usual. \`${ACCEPTED_LABEL}\` was removed, so that this PR doesn't join an umbrella PR when the release assistant goes live.`,
		`Once live, the release assistant ${outcome}`,
	].join('\n\n');
}

function quote(markdown: string) {
	return markdown
		.split('\n')
		.map((line) => (line ? `> ${line}` : '>'))
		.join('\n');
}
