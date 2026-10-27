import { ACCEPTED_LABEL, DOCS_STABLE_BRANCH, RELEASE_LABELS } from './config.ts';
import { OUTCOMES, REFUSAL_REASONS, type Decision, type RefusalReason } from './decision.ts';

const { patch, minor, major } = RELEASE_LABELS;

const REFUSAL_MESSAGES: Record<RefusalReason, string> = {
	[REFUSAL_REASONS.missingReleaseLabel]: `This PR has no release label. Add \`${patch}\` or \`${minor}\` if it ships in a release from \`${DOCS_STABLE_BRANCH}\`, or \`${major}\` if it ships with a prerelease branch.`,
	[REFUSAL_REASONS.severalReleaseLabels]: `This PR has several release labels. Keep only the one for the release it ships in.`,
	[REFUSAL_REASONS.majorReleaseOnStableBranch]: `This PR has \`${major}\`, but its base branch is \`${DOCS_STABLE_BRANCH}\`. Change its base to the prerelease branch it ships with, or replace \`${major}\` with \`${patch}\` or \`${minor}\`.`,
	[REFUSAL_REASONS.stableReleaseOnPrereleaseBranch]: `This PR has \`${patch}\` or \`${minor}\`, but its base branch is a prerelease branch. Change its base to \`${DOCS_STABLE_BRANCH}\`, or replace its release label with \`${major}\`.`,
};

/**
 * Renders the comment explaining why a docs PR can't join its umbrella, and
 * how to retry.
 *
 * @param {RefusalReason} reason - Why the PR is refused.
 * @returns {string} The comment, in Markdown.
 */
export function renderRefusalComment(reason: RefusalReason): string {
	return `${REFUSAL_MESSAGES[reason]}\n\nAfter fixing this, add \`${ACCEPTED_LABEL}\` again.`;
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
			? `will merge this PR into \`${decision.route.umbrellaBranch}\`, the umbrella branch for the next release into \`${decision.route.umbrellaBaseBranch}\`.`
			: `will remove \`${ACCEPTED_LABEL}\` and reply:\n\n${quote(renderRefusalComment(decision.reason))}`;

	return `**Dry run**: once the release queue is live, it ${outcome}\n\nNothing has changed yet: handle this PR as usual.`;
}

function quote(markdown: string) {
	return markdown
		.split('\n')
		.map((line) => (line ? `> ${line}` : '>'))
		.join('\n');
}
