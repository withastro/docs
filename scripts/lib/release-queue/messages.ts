import {
	ACCEPTED_LABEL,
	type Decision,
	type Refusal,
	type RefusalCode,
	type Route,
} from './routing.ts';

/** An open umbrella PR, or the title of the one to create. */
export type Umbrella = { number: number } | { title: string };

export interface MessageContext {
	/** The umbrella PR the docs PR would join. */
	umbrella?: Umbrella;
	/** The open `main` umbrella PR, named when the next release is a major. */
	mainUmbrella?: { number: number };
}

const code = (text: string) => `\`${text}\``;
const list = (items: string[]) => items.map(code).join(', ');

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

/** Writes the comment of a dry run: what the bot would do, without doing it. */
export function formatDryRunComment(
	{ route, refusals }: Decision,
	context: MessageContext = {}
): string {
	const heading = '**Release queue (dry run)**: nothing was changed.';
	const { umbrella } = context;
	if (refusals.length === 0) {
		if (!route || !umbrella) {
			throw new Error('A PR without refusals needs a route and an umbrella.');
		}
		return `${heading}\n\n${describeRoute(route, umbrella)}`;
	}

	const reasons = refusals.map((refusal) => `- ${describeRefusal(refusal, context)}`).join('\n');
	const target = route && umbrella ? describeUmbrella(route, umbrella) : 'its release umbrella';
	return `${heading}\n\nThis PR wouldn't join ${target} yet:\n\n${reasons}\n\nOutside a dry run, the ${code(ACCEPTED_LABEL)} label would be removed. It would need to be added again after fixing.`;
}
