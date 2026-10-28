import type { GitHubRepository, PullRequest } from '../lib/github/repository.ts';
import {
	FRAMEWORK_PACKAGE,
	FRAMEWORK_STABLE_RELEASE_BRANCH,
	RELEASE_TYPES,
	type ReleaseType,
} from './config.ts';

/** The heading Changesets writes for each released package, such as `## astro@7.4.1`. */
const FRAMEWORK_VERSION_HEADING = new RegExp(
	`^## ${FRAMEWORK_PACKAGE}@((\\d+)\\.(\\d+)\\.(\\d+)\\S*)\\s*$`,
	'm'
);

export type FrameworkRepository = Pick<
	GitHubRepository,
	'fullName' | 'getOpenPullRequestsFromBranch'
>;

export type FrameworkRelease = {
	prNumber: number;
	/** `null` when the release does not include `astro`. */
	astroVersion: string | null;
	/** The type of the `astro` release, patch when the release does not include `astro`. */
	type: ReleaseType;
};

/**
 * Reads the open `[ci] release` PR of the framework's stable branch.
 *
 * @param {FrameworkRepository} framework - The framework repository.
 * @returns {Promise<FrameworkRelease | null>} The release, or `null` when no release PR is open,
 * such as right after a release.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function readStableRelease(
	framework: FrameworkRepository
): Promise<FrameworkRelease | null> {
	const [releasePullRequest] = await framework.getOpenPullRequestsFromBranch(
		FRAMEWORK_STABLE_RELEASE_BRANCH
	);
	return releasePullRequest ? toFrameworkRelease(releasePullRequest) : null;
}

function toFrameworkRelease({ number, body }: Pick<PullRequest, 'number' | 'body'>) {
	const match = body?.match(FRAMEWORK_VERSION_HEADING);
	if (!match) return { prNumber: number, astroVersion: null, type: RELEASE_TYPES.patch };

	const [, version, , minor, patch] = match;
	return { prNumber: number, astroVersion: version, type: getReleaseType(minor, patch) };
}

function getReleaseType(minor: string, patch: string): ReleaseType {
	if (Number(patch) > 0) return RELEASE_TYPES.patch;
	if (Number(minor) > 0) return RELEASE_TYPES.minor;
	return RELEASE_TYPES.major;
}
