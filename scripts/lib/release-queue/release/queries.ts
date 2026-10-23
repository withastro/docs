import { FRAMEWORK_PRERELEASE_BRANCH } from '../config.ts';
import { GitHubError } from '../github/error.ts';
import { isRecord, parseJson } from '../github/json.ts';
import type { Repository } from '../github/repository.ts';
import type { PullRequestResponse } from '../github/types.ts';
import { parseReleaseVersions, type ReleasePullRequest } from './release.ts';

/** The branch prefix of the release PRs that changesets opens. */
const RELEASE_BRANCH_PREFIX = 'changeset-release/';
/** The changesets file that holds the prerelease mode of a branch. */
const PRE_STATE_PATH = '.changeset/pre.json';

/**
 * Gets the open release PR of a branch of the framework repository.
 *
 * @param {Repository} framework - The framework repository.
 * @param {string} branch - The stable branch, or the prerelease branch for
 *   alpha and beta releases.
 * @returns {Promise<ReleasePullRequest | undefined>} The release PR with its
 *   package versions, or `undefined` when none is open.
 */
export async function getReleasePullRequest(
	framework: Repository,
	branch: string
): Promise<ReleasePullRequest | undefined> {
	const [pr] = await framework.get<PullRequestResponse[]>(
		`pulls?state=open&head=${framework.owner}:${RELEASE_BRANCH_PREFIX}${branch}`
	);
	if (!pr) return undefined;
	return { number: pr.number, versions: parseReleaseVersions(pr.body ?? '') };
}

/** Whether the prerelease branch of the framework is in prerelease mode. */
async function isPrereleaseBranchInPreMode(framework: Repository): Promise<boolean> {
	try {
		const { content } = await framework.get<{ content: string }>(
			`contents/${PRE_STATE_PATH}?ref=${FRAMEWORK_PRERELEASE_BRANCH}`
		);
		// `exit` means the prerelease ends: the branch is then merged into the
		// stable branch.
		return readPreMode(Buffer.from(content, 'base64').toString()) === 'pre';
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return false;
		throw error;
	}
}

/** Reads the prerelease mode from the changesets file of the branch. */
function readPreMode(json: string): string {
	const source = `The \`${PRE_STATE_PATH}\` of \`${FRAMEWORK_PRERELEASE_BRANCH}\``;
	const preState = parseJson(json, source);
	if (!isPreState(preState)) throw new Error(`${source} has no \`mode\`.`);
	return preState.mode;
}

function isPreState(value: unknown): value is { mode: string } {
	return isRecord(value) && typeof value.mode === 'string';
}

/**
 * Gets the release PR a prerelease umbrella ships with.
 *
 * @param {Repository} framework - The framework repository.
 * @param {ReleasePullRequest} [stablePullRequest] - The open release PR of the
 *   stable branch.
 * @returns {Promise<ReleasePullRequest | undefined>} The alpha or beta release
 *   PR while the prerelease branch is in prerelease mode. Then the release PR
 *   of the stable branch, which the prerelease branch was merged into.
 */
export async function getPrereleasePullRequest(
	framework: Repository,
	stablePullRequest: ReleasePullRequest | undefined
): Promise<ReleasePullRequest | undefined> {
	return (await isPrereleaseBranchInPreMode(framework))
		? getReleasePullRequest(framework, FRAMEWORK_PRERELEASE_BRANCH)
		: stablePullRequest;
}

/**
 * Whether a PR of the framework repository, such as a release PR, is merged.
 *
 * @param {Repository} framework - The framework repository.
 * @param {number} prNumber - The number of the PR.
 * @returns {Promise<boolean>} `false` for a PR that doesn't exist, for example
 *   from an edited marker.
 */
export async function isFrameworkPullRequestMerged(
	framework: Repository,
	prNumber: number
): Promise<boolean> {
	try {
		const { merged } = await framework.get<PullRequestResponse>(`pulls/${prNumber}`);
		return merged === true;
	} catch (error) {
		if (error instanceof GitHubError && error.status === 404) return false;
		throw error;
	}
}
