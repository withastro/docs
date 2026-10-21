import { GitHubError } from './github.ts';
import type { UnopenedJoin } from './join.ts';
import {
	ACCEPTED_LABEL,
	type Refusal,
	type RefusalCode,
	type RefusedDecision,
	type Route,
} from './routing.ts';
import type { Umbrella } from './umbrella.ts';

export interface MessageContext {
	/** The umbrella PR the docs PR would join. */
	umbrella?: Umbrella;
	/** The open `main` umbrella PR, named when the next release is a major. */
	mainUmbrella?: { number: number };
}

const code = (text: string) => `\`${text}\``;
const list = (items: string[]) => items.map(code).join(', ');
// GitHub's reasons sometimes end with a period already.
const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

type DescribeRefusal<C extends RefusalCode> = (
	refusal: Refusal<C>,
	context: MessageContext
) => string;

const REFUSAL_DESCRIPTIONS: { [C in RefusalCode]: DescribeRefusal<C> } = {
	closed: () => 'This PR is closed.',
	umbrella: () => 'This PR is a release umbrella. Merge it when the release is out.',
	draft: () => 'This PR is a draft. Mark it as ready for review.',
	'no-release-label': () =>
		'This PR has no release label. Add `patch-release` or `minor-release` for a PR against `main`, or `major-release` for a PR against a prerelease branch.',
	'several-release-labels': ({ labels }) =>
		`This PR has several release labels (${list(labels)}). Keep only one.`,
	mismatch: ({ base, label }) =>
		label === 'major-release'
			? `\`major-release\` PRs target a prerelease branch, but this one targets ${code(base)}. Change the base to the prerelease branch, or the label to \`patch-release\` or \`minor-release\`.`
			: `${code(label)} PRs target \`main\`, but this one targets ${code(base)}. Change the base to \`main\`, or the label to \`major-release\`.`,
	'major-on-main': ({ astroVersion }, { mainUmbrella }) => {
		const release = astroVersion ? ` (${code(`astro@${astroVersion}`)})` : '';
		const umbrella = mainUmbrella
			? ` The open \`main\` umbrella (#${mainUmbrella.number}) needs to be squashed into the prerelease branch by a maintainer.`
			: '';
		return `The next \`astro\` release from \`main\` is a major${release}: docs for it belong on the prerelease branch. Change the base to the prerelease branch and the label to \`major-release\`.${umbrella}`;
	},
	'settled-umbrella': ({ number, releasePullRequest }) =>
		`#${number} ships with withastro/astro#${releasePullRequest}, which is already merged. Merge #${number} first. If this PR documents that release, change its base to \`release-queue/main\` instead.`,
	'not-approved': () => 'This PR has no approval from a maintainer. Ask a maintainer to review it.',
	'changes-requested': ({ reviewers }) =>
		`Changes are requested by ${reviewers.join(', ')}. Address them, then ask for a new review or dismiss the old one.`,
	'failing-checks': ({ checks }) =>
		`These required checks fail: ${list(checks)}. Fix them, or re-run them if they failed for an unrelated reason.`,
	'pending-checks': ({ checks }) =>
		`These required checks haven't finished yet: ${list(checks)}. Wait for them to finish.`,
	'missing-checks': ({ checks }) =>
		`These required checks haven't run: ${list(checks)}. If the workflow runs are waiting for approval, approve them.`,
	conflict: () => 'This PR has merge conflicts. Resolve them.',
	'umbrella-conflict': ({ branch }) =>
		`This PR conflicts with changes already in ${code(branch)}. Resolve the conflicts with that branch.`,
	'stale-umbrella-branch': ({ branch }) =>
		`The branch ${code(branch)} has commits but no open umbrella PR. A maintainer needs to open the umbrella PR from it, or delete it if its commits already shipped.`,
	'merge-failed': ({ reason }) => `GitHub refused the merge: ${sentence(reason)}`,
};

/** Describes a refusal and how to fix it. */
export function describeRefusal<C extends RefusalCode>(
	refusal: Refusal<C>,
	context: MessageContext = {}
): string {
	return REFUSAL_DESCRIPTIONS[refusal.code](refusal, context);
}

function describeUmbrella(route: Route, umbrella: Umbrella): string {
	const name =
		'number' in umbrella ? `#${umbrella.number}` : `a new umbrella PR (${code(umbrella.title)})`;
	return `${name} into ${code(route.target)}`;
}

function describeRoute(route: Route, umbrella: Umbrella): string {
	const base = route.shouldRetarget
		? ` Its base would change to ${code(route.umbrellaBranch)}.`
		: '';
	return `This PR would be squash-merged into ${code(route.umbrellaBranch)}, the branch of ${describeUmbrella(route, umbrella)}.${base}`;
}

function listRefusals(refusals: Refusal[], context: MessageContext): string {
	return refusals.map((refusal) => `- ${describeRefusal(refusal, context)}`).join('\n');
}

function describeUmbrellaOrFallback(route?: Route, umbrella?: Umbrella): string {
	return route && umbrella ? describeUmbrella(route, umbrella) : 'its release umbrella';
}

function describeError(error: unknown): string {
	if (error instanceof GitHubError) return error.reason;
	return error instanceof Error ? error.message : String(error);
}

const DRY_RUN_HEADING = '**Release queue (dry run)**: nothing was changed.';

/** Writes the dry-run comment of a PR that would join `umbrella`. */
export function formatDryRunJoinComment(route: Route, umbrella: Umbrella): string {
	return `${DRY_RUN_HEADING}\n\n${describeRoute(route, umbrella)}`;
}

/** Writes the dry-run comment of a PR that would be refused. */
export function formatDryRunRefusalComment(
	{ route, refusals }: RefusedDecision,
	context: MessageContext = {}
): string {
	const umbrella = describeUmbrellaOrFallback(route, context.umbrella);
	return `${DRY_RUN_HEADING}\n\nThis PR wouldn't join ${umbrella} yet:\n\n${listRefusals(refusals, context)}\n\nOutside a dry run, the ${code(ACCEPTED_LABEL)} label would be removed. It would need to be added again after fixing.`;
}

/** Writes the comment of a refusal, posted once `accepted` is removed. */
export function formatRefusalComment(
	{ route, refusals }: RefusedDecision,
	context: MessageContext = {}
): string {
	const umbrella = describeUmbrellaOrFallback(route, context.umbrella);
	return `**Release queue**: this PR didn't join ${umbrella}:\n\n${listRefusals(refusals, context)}\n\nThe ${code(ACCEPTED_LABEL)} label was removed. Add it again after fixing.`;
}

/** Writes the comment of a join: the umbrella the PR is now part of. */
export function formatJoinComment(route: Route, umbrella: Umbrella): string {
	return `**Release queue**: squash-merged into ${code(route.umbrellaBranch)}, the branch of ${describeUmbrella(route, umbrella)}. It ships when the umbrella PR is merged.`;
}

/** Writes the comment of a merged PR whose umbrella PR couldn't be opened. */
export function formatUnopenedJoinComment(route: Route, { error }: UnopenedJoin): string {
	const branch = code(route.umbrellaBranch);
	const reason = sentence(describeError(error));
	return `**Release queue**: squash-merged into ${branch}, but the umbrella PR into ${code(route.target)} couldn't be opened: ${reason} A maintainer needs to open it from ${branch}.`;
}
