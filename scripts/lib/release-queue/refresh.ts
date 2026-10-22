import type { GitHubClient } from './github.ts';
import { syncMergeBlockReview } from './merge-block.ts';
import { isLiveFor, type QueueOptions } from './modes.ts';
import { getPrereleasePullRequest, getReleasePullRequest, removeLabel } from './queries.ts';
import { getMainRelease, type MainRelease, type ReleasePullRequest } from './release.ts';
import { MAIN_BRANCH } from './routing.ts';
import { getUmbrellaHistory, listOpenUmbrellas, type OpenUmbrella } from './umbrella-queries.ts';
import { getReleaseState } from './umbrella-state.ts';
import {
	getKeptLabelChanges,
	getLabelChanges,
	getUmbrellaBody,
	getUmbrellaHeading,
	selectIncludedPullRequests,
} from './umbrella.ts';

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
	gh: GitHubClient,
	repo: string,
	umbrella: OpenUmbrella,
	release: MainRelease
): Promise<OpenUmbrella> {
	const state = await getReleaseState(gh, umbrella, release);
	const heading = getUmbrellaHeading(umbrella.target, release);
	const isFollowing = state.status === 'follows';
	if (isFollowing && umbrella.target === MAIN_BRANCH && release.type === 'major') {
		console.info(`Skipped #${umbrella.number}: the next release from main is a major.`);
		return umbrella;
	}

	const linked = isFollowing
		? (await getLinkedReleasePullRequest(gh, umbrella, release))?.number
		: state.releasePullRequest;
	const { commits, merged } = await getUmbrellaHistory(gh, repo, umbrella);
	const body = getUmbrellaBody(umbrella.target, {
		releasePullRequest: linked,
		included: selectIncludedPullRequests(merged, commits),
	});

	const changes: { title?: string; body?: string } = {};
	if (isFollowing && heading.title !== umbrella.title) changes.title = heading.title;
	// GitHub keeps the line endings of a description edited in the browser.
	if (body !== umbrella.body.replaceAll('\r\n', '\n')) changes.body = body;
	if (Object.keys(changes).length > 0) {
		await gh.write('PATCH', `repos/${repo}/pulls/${umbrella.number}`, changes);
	}

	const { toAdd, toRemove } = isFollowing
		? getLabelChanges(umbrella.labels, heading.releaseLabel)
		: getKeptLabelChanges(umbrella.labels);
	if (toAdd.length > 0) {
		await gh.write('POST', `repos/${repo}/issues/${umbrella.number}/labels`, { labels: toAdd });
	}
	await Promise.all(toRemove.map((label) => removeLabel(gh, repo, umbrella.number, label)));

	const removed = new Set<string>(toRemove);
	const labels = [...umbrella.labels, ...toAdd].filter((label) => !removed.has(label));
	return { ...umbrella, ...changes, labels };
}

/**
 * Gets the release PR an umbrella that follows its release links: the one of
 * `main`, or the one of the prerelease the umbrella ships with.
 */
async function getLinkedReleasePullRequest(
	gh: GitHubClient,
	umbrella: OpenUmbrella,
	release: MainRelease
): Promise<ReleasePullRequest | undefined> {
	if (umbrella.target === MAIN_BRANCH) return release.pullRequest;
	return getPrereleasePullRequest(gh, release.pullRequest);
}

/** Refreshes every open umbrella PR, for example after a release PR change. */
export async function refreshOpenUmbrellas({ actionsClient, botClient, repo, mode }: QueueOptions) {
	const [umbrellas, releasePullRequest] = await Promise.all([
		listOpenUmbrellas(actionsClient, repo),
		getReleasePullRequest(actionsClient),
	]);
	const release = getMainRelease(releasePullRequest);
	const numbers = umbrellas.map(({ number }) => `#${number}`).join(', ');
	console.info(`Open umbrellas: ${numbers || 'none'}.`);

	for (const umbrella of umbrellas) {
		if (!isLiveFor(mode, umbrella.target)) {
			console.info(`Skipped #${umbrella.number}: dry run for ${umbrella.target}.`);
			continue;
		}
		const refreshed = await refreshUmbrella(botClient, repo, umbrella, release);
		// Without a join, a dismissed review still covers the included PRs.
		await syncMergeBlockReview(actionsClient, repo, refreshed, { shouldBlock: false });
	}
}
