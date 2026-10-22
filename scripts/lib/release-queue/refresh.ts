import { syncMergeBlockReview } from './merge-block.ts';
import { isLiveFor, type QueueOptions } from './modes.ts';
import { getPrereleasePullRequest, getReleasePullRequest, removeLabel } from './queries.ts';
import { getMainRelease, type MainRelease, type ReleasePullRequest } from './release.ts';
import { FRAMEWORK_MAIN_BRANCH, MAIN_BRANCH } from './config.ts';
import { getUmbrellaHistory, listOpenUmbrellas, type OpenUmbrella } from './umbrella-queries.ts';
import type { Repositories, Repository } from './repository.ts';
import { getReleaseState } from './umbrella-state.ts';
import { formatUmbrellaBody, selectIncludedPullRequests } from './umbrella-body.ts';
import { getUmbrellaHeading } from './umbrella-heading.ts';
import {
	applyToLabels,
	getKeptLabelChanges,
	getLabelChanges,
	type LabelChanges,
} from './umbrella-labels.ts';

/**
 * Brings an umbrella PR up to date, writing only what changed. Its body
 * always lists the included docs PRs. The `main` umbrella takes its title,
 * release label and link from the open release PR of `main`, unless it is
 * `kept` or `settled`. A prerelease umbrella takes its title and label from
 * its branch, and links the release PR of its prerelease. Leaves the `main`
 * umbrella as it is before a major: a maintainer moves it to the prerelease
 * branch. Returns the umbrella as it is after the refresh.
 */
export async function refreshUmbrella(
	{ docs, framework }: Repositories,
	umbrella: OpenUmbrella,
	release: MainRelease
): Promise<OpenUmbrella> {
	const state = await getReleaseState(framework, umbrella, release);
	const isFollowing = state.status === 'follows';
	if (isFollowing && isBeforeMajor(umbrella, release)) {
		console.info(
			`Skipped #${umbrella.number}: the next release from ${FRAMEWORK_MAIN_BRANCH} is a major.`
		);
		return umbrella;
	}

	const heading = getUmbrellaHeading(umbrella.target, release);
	const linked = isFollowing
		? (await getLinkedReleasePullRequest(framework, umbrella, release))?.number
		: state.releasePullRequest;
	const { commits, closed } = await getUmbrellaHistory(docs, umbrella);
	const textChanges = getTextChanges(umbrella, {
		title: isFollowing ? heading.title : umbrella.title,
		body: formatUmbrellaBody(umbrella.target, {
			releasePullRequest: linked,
			included: selectIncludedPullRequests(closed, commits),
		}),
	});
	if (Object.keys(textChanges).length > 0) {
		await docs.write('PATCH', `pulls/${umbrella.number}`, textChanges);
	}

	const labelChanges = isFollowing
		? getLabelChanges(umbrella.labels, heading.releaseLabel)
		: getKeptLabelChanges(umbrella.labels);
	await applyLabelChanges(docs, umbrella.number, labelChanges);
	return { ...umbrella, ...textChanges, labels: applyToLabels(umbrella.labels, labelChanges) };
}

/**
 * Whether the `main` umbrella waits for a major: the bot leaves it to a
 * maintainer.
 */
function isBeforeMajor(umbrella: OpenUmbrella, release: MainRelease): boolean {
	return umbrella.target === MAIN_BRANCH && release.type === 'major';
}

/** Gets the title and body of `wanted` that differ from the umbrella's. */
function getTextChanges(
	umbrella: OpenUmbrella,
	wanted: { title: string; body: string }
): { title?: string; body?: string } {
	return {
		...(wanted.title === umbrella.title ? {} : { title: wanted.title }),
		...(wanted.body === umbrella.body ? {} : { body: wanted.body }),
	};
}

async function applyLabelChanges(docs: Repository, umbrellaNumber: number, changes: LabelChanges) {
	if (changes.toAdd.length > 0) {
		await docs.write('POST', `issues/${umbrellaNumber}/labels`, { labels: changes.toAdd });
	}
	await Promise.all(changes.toRemove.map((label) => removeLabel(docs, umbrellaNumber, label)));
}

/**
 * Gets the release PR an umbrella that follows its release links: the one of
 * `main`, or the one of the prerelease the umbrella ships with.
 */
async function getLinkedReleasePullRequest(
	framework: Repository,
	umbrella: OpenUmbrella,
	release: MainRelease
): Promise<ReleasePullRequest | undefined> {
	if (umbrella.target === MAIN_BRANCH) return release.pullRequest;
	return getPrereleasePullRequest(framework, release.pullRequest);
}

/** Refreshes every open umbrella PR, for example after a release PR change. */
export async function refreshOpenUmbrellas({ actions, bot, framework, mode }: QueueOptions) {
	const [umbrellas, releasePullRequest] = await Promise.all([
		listOpenUmbrellas(actions),
		getReleasePullRequest(framework, FRAMEWORK_MAIN_BRANCH),
	]);
	const release = getMainRelease(releasePullRequest);
	const numbers = umbrellas.map(({ number }) => `#${number}`).join(', ');
	console.info(`Open umbrellas: ${numbers || 'none'}.`);

	for (const umbrella of umbrellas) {
		if (!isLiveFor(mode, umbrella.target)) {
			console.info(`Skipped #${umbrella.number}: dry run for ${umbrella.target}.`);
			continue;
		}
		const refreshed = await refreshUmbrella({ docs: bot, framework }, umbrella, release);
		// Without a join, a dismissed review still covers the included PRs.
		await syncMergeBlockReview(actions, refreshed, { shouldBlock: false });
	}
}
