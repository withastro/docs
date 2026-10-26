import {
	ACCEPTED_LABEL,
	FRAMEWORK_CORE_PACKAGE,
	FRAMEWORK_STABLE_BRANCH,
	RELEASE_LABELS,
	DOCS_STABLE_BRANCH,
} from '../config.ts';
import { GitHubError } from '../github/error.ts';
import { formatFrameworkReference } from '../release/release.ts';
import { STABLE_UMBRELLA_BRANCH } from '../umbrella/branch.ts';
import type { Umbrella } from '../umbrella/queries.ts';
import type { UnopenedJoin } from './join.ts';
import type { Refusal, RefusalCode, RefusedDecision, Route } from './routing.ts';

export interface MessageContext {
	/** The umbrella PR the docs PR would join. */
	umbrella?: Umbrella | undefined;
	/** The open stable umbrella PR, named when the next release is a major. */
	stableUmbrella?: { number: number } | undefined;
}

const wrapInCode = (text: string) => `\`${text}\``;
const joinAsCode = (items: string[]) => items.map(wrapInCode).join(', ');
// GitHub's reasons sometimes end with a period already.
const endWithPeriod = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

type DescribeRefusal<C extends RefusalCode> = (
	refusal: Refusal<C>,
	context: MessageContext
) => string;

const PATCH_LABEL_CODE = wrapInCode(RELEASE_LABELS.patch);
const MINOR_LABEL_CODE = wrapInCode(RELEASE_LABELS.minor);
const MAJOR_LABEL_CODE = wrapInCode(RELEASE_LABELS.major);
const STABLE_BRANCH_CODE = wrapInCode(DOCS_STABLE_BRANCH);

function describeMissingReleaseLabel(): string {
	return `This PR has no release label. Add ${PATCH_LABEL_CODE} or ${MINOR_LABEL_CODE} for a PR against ${STABLE_BRANCH_CODE}, or ${MAJOR_LABEL_CODE} for a PR against a prerelease branch.`;
}

function describeMismatch({ base, label }: Refusal<'mismatch'>): string {
	const currentBase = wrapInCode(base);
	if (label === RELEASE_LABELS.major) {
		return `${MAJOR_LABEL_CODE} PRs target a prerelease branch, but this one targets ${currentBase}. Change the base to the prerelease branch, or the label to ${PATCH_LABEL_CODE} or ${MINOR_LABEL_CODE}.`;
	}
	return `${wrapInCode(label)} PRs target ${STABLE_BRANCH_CODE}, but this one targets ${currentBase}. Change the base to ${STABLE_BRANCH_CODE}, or the label to ${MAJOR_LABEL_CODE}.`;
}

function describeMajorOnStable(
	{ frameworkVersion }: Refusal<'major-on-stable'>,
	{ stableUmbrella }: MessageContext
): string {
	const corePackage = wrapInCode(FRAMEWORK_CORE_PACKAGE);
	const frameworkBranch = wrapInCode(FRAMEWORK_STABLE_BRANCH);
	const version = frameworkVersion
		? ` (${wrapInCode(`${FRAMEWORK_CORE_PACKAGE}@${frameworkVersion}`)})`
		: '';
	const umbrellaToMove = stableUmbrella
		? ` The open ${STABLE_BRANCH_CODE} umbrella (#${stableUmbrella.number}) needs to be squashed into the prerelease branch by a maintainer.`
		: '';
	return `The next ${corePackage} release from ${frameworkBranch} is a major${version}: docs for it belong on the prerelease branch. Change the base to the prerelease branch and the label to ${MAJOR_LABEL_CODE}.${umbrellaToMove}`;
}

function describeSettledUmbrella({ number, releasePrNumber }: Refusal<'settled-umbrella'>): string {
	const releasePr = formatFrameworkReference(releasePrNumber);
	const umbrellaBranch = wrapInCode(STABLE_UMBRELLA_BRANCH);
	return `#${number} ships with ${releasePr}, which is already merged. Merge #${number} first. If this PR documents that release, change its base to ${umbrellaBranch} instead.`;
}

const REFUSAL_DESCRIPTIONS: { [C in RefusalCode]: DescribeRefusal<C> } = {
	closed: () => 'This PR is closed.',
	umbrella: () => 'This PR is a release umbrella. Merge it when the release is out.',
	draft: () => 'This PR is a draft. Mark it as ready for review.',
	'no-release-label': describeMissingReleaseLabel,
	'several-release-labels': ({ labels }) =>
		`This PR has several release labels (${joinAsCode(labels)}). Keep only one.`,
	mismatch: describeMismatch,
	'major-on-stable': describeMajorOnStable,
	'settled-umbrella': describeSettledUmbrella,
	'not-approved': () => 'This PR has no approval from a maintainer. Ask a maintainer to review it.',
	'changes-requested': ({ reviewers }) =>
		`Changes are requested by ${reviewers.join(', ')}. Address them, then ask for a new review or dismiss the old one.`,
	'failing-checks': ({ checks }) =>
		`These required checks fail: ${joinAsCode(checks)}. Fix them, or re-run them if they failed for an unrelated reason.`,
	'pending-checks': ({ checks }) =>
		`These required checks haven't finished yet: ${joinAsCode(checks)}. Wait for them to finish.`,
	'missing-checks': ({ checks }) =>
		`These required checks haven't run: ${joinAsCode(checks)}. If the workflow runs are waiting for approval, approve them.`,
	conflict: () => 'This PR has merge conflicts. Resolve them.',
	'umbrella-conflict': ({ branch }) =>
		`This PR conflicts with changes already in ${wrapInCode(branch)}. Resolve the conflicts with that branch.`,
	'stale-umbrella-branch': ({ branch }) =>
		`The branch ${wrapInCode(branch)} has commits but no open umbrella PR. A maintainer needs to open the umbrella PR from it, or delete it if its commits already shipped.`,
	'merge-failed': ({ reason }) => `GitHub refused the merge: ${endWithPeriod(reason)}`,
};

/** Describes a refusal and how to fix it. */
function describeRefusal<C extends RefusalCode>(
	refusal: Refusal<C>,
	context: MessageContext
): string {
	return REFUSAL_DESCRIPTIONS[refusal.code](refusal, context);
}

function describeUmbrella(route: Route, umbrella: Umbrella): string {
	const name =
		umbrella.status === 'open'
			? `#${umbrella.number}`
			: `a new umbrella PR (${wrapInCode(umbrella.title)})`;
	return `${name} into ${wrapInCode(route.umbrellaBase)}`;
}

function describeRoute(route: Route, umbrella: Umbrella): string {
	const base = route.shouldRetarget
		? ` Its base would change to ${wrapInCode(route.umbrellaBranch)}.`
		: '';
	return `This PR would be squash-merged into ${wrapInCode(route.umbrellaBranch)}, the branch of ${describeUmbrella(route, umbrella)}.${base}`;
}

function listRefusals(refusals: Refusal[], context: MessageContext): string {
	return refusals.map((refusal) => `- ${describeRefusal(refusal, context)}`).join('\n');
}

function describeUmbrellaOrFallback(route?: Route, umbrella?: Umbrella): string {
	return route && umbrella ? describeUmbrella(route, umbrella) : 'its release umbrella';
}

function describeError(error: unknown): string {
	if (error instanceof GitHubError) return error.githubReason;
	return error instanceof Error ? error.message : String(error);
}

const DRY_RUN_HEADING = '**Release queue (dry run)**: nothing was changed.';

/**
 * Writes the dry-run comment of a PR that would join an umbrella.
 *
 * @param {Route} route - The umbrella branch and base the PR goes to.
 * @param {Umbrella} umbrella - The umbrella PR it would join.
 * @returns {string} The comment, in Markdown.
 */
export function formatDryRunJoinComment(route: Route, umbrella: Umbrella): string {
	return `${DRY_RUN_HEADING}\n\n${describeRoute(route, umbrella)}`;
}

/**
 * Writes the dry-run comment of a PR that would be refused.
 *
 * @param {RefusedDecision} decision - The refusals, and the route if any.
 * @param {MessageContext} context - The umbrellas the refusals name.
 * @returns {string} The comment, in Markdown.
 */
export function formatDryRunRefusalComment(
	{ route, refusals }: RefusedDecision,
	context: MessageContext
): string {
	const umbrella = describeUmbrellaOrFallback(route, context.umbrella);
	return `${DRY_RUN_HEADING}\n\nThis PR wouldn't join ${umbrella} yet:\n\n${listRefusals(refusals, context)}\n\nOutside a dry run, the ${wrapInCode(ACCEPTED_LABEL)} label would be removed. It would need to be added again after fixing.`;
}

/**
 * Writes the comment of a refusal, posted once the accepted label is removed.
 *
 * @param {RefusedDecision} decision - The refusals, and the route if any.
 * @param {MessageContext} context - The umbrellas the refusals name.
 * @returns {string} The comment, in Markdown.
 */
export function formatRefusalComment(
	{ route, refusals }: RefusedDecision,
	context: MessageContext
): string {
	const umbrella = describeUmbrellaOrFallback(route, context.umbrella);
	return `**Release queue**: this PR didn't join ${umbrella}:\n\n${listRefusals(refusals, context)}\n\nThe ${wrapInCode(ACCEPTED_LABEL)} label was removed. Add it again after fixing.`;
}

/**
 * Writes the comment of a join: the umbrella the PR is now part of.
 *
 * @param {Route} route - The umbrella branch and base the PR goes to.
 * @param {Umbrella} umbrella - The umbrella PR it joined.
 * @returns {string} The comment, in Markdown.
 */
export function formatJoinComment(route: Route, umbrella: Umbrella): string {
	return `**Release queue**: squash-merged into ${wrapInCode(route.umbrellaBranch)}, the branch of ${describeUmbrella(route, umbrella)}. It ships when the umbrella PR is merged.`;
}

/**
 * Writes the comment of a merged PR whose umbrella PR couldn't be opened.
 *
 * @param {Route} route - The umbrella branch and base the PR goes to.
 * @param {UnopenedJoin} join - The join, with the error that stopped it.
 * @returns {string} The comment, in Markdown.
 */
export function formatUnopenedJoinComment(route: Route, { error }: UnopenedJoin): string {
	const branch = wrapInCode(route.umbrellaBranch);
	const reason = endWithPeriod(describeError(error));
	return `**Release queue**: squash-merged into ${branch}, but the umbrella PR into ${wrapInCode(route.umbrellaBase)} couldn't be opened: ${reason} A maintainer needs to open it from ${branch}.`;
}
