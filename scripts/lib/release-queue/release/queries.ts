import { FRAMEWORK_PRERELEASE_BRANCH, FRAMEWORK_STABLE_BRANCH } from '../config.ts';
import type { Repository } from '../github/repository.ts';
import type { PullRequestResponse } from '../github/types.ts';
import { isRecord, parseJson } from '../json.ts';
import {
	getStableRelease,
	parseReleaseVersions,
	type ReleasePullRequest,
	type StableRelease,
} from './release.ts';

/** The branch prefix of the changesets release PRs. */
const RELEASE_BRANCH_PREFIX = 'changeset-release/';
/** The changesets file that holds the prerelease mode of a branch. */
const PRE_STATE_PATH = '.changeset/pre.json';

/**
 * Reads the next release from the stable branch of the framework repository.
 *
 * @param {Repository} framework - The framework repository.
 * @returns {Promise<FrameworkReleases>} The releases of the framework, with
 *   the next stable release read.
 */
export async function readFrameworkReleases(framework: Repository): Promise<FrameworkReleases> {
	const stablePullRequest = await getReleasePullRequest(framework, FRAMEWORK_STABLE_BRANCH);
	return new FrameworkReleases(framework, getStableRelease(stablePullRequest));
}

/**
 * The releases of the framework repository in a run: the next stable release,
 * read once, and the release PRs read when an umbrella needs them.
 */
export class FrameworkReleases {
	/** The next release from the stable branch. */
	readonly stable: StableRelease;
	#framework: Repository;

	/**
	 * Binds the next stable release to the repository it was read from.
	 *
	 * @param {Repository} framework - The framework repository.
	 * @param {StableRelease} stable - The next release from the stable branch.
	 */
	constructor(framework: Repository, stable: StableRelease) {
		this.#framework = framework;
		this.stable = stable;
	}

	/**
	 * Gets the release PR a prerelease umbrella ships with.
	 *
	 * @returns {Promise<ReleasePullRequest | undefined>} The alpha or beta
	 *   release PR while the prerelease branch is in prerelease mode. Then the
	 *   release PR of the stable branch, which the prerelease branch was merged
	 *   into.
	 */
	async getPrereleasePullRequest(): Promise<ReleasePullRequest | undefined> {
		return (await isPrereleaseBranchInPreMode(this.#framework))
			? getReleasePullRequest(this.#framework, FRAMEWORK_PRERELEASE_BRANCH)
			: this.stable.pullRequest;
	}

	/**
	 * Whether a PR of the framework repository, such as a release PR, is merged.
	 *
	 * @param {number} prNumber - The number of the PR.
	 * @returns {Promise<boolean>} `false` for a PR that doesn't exist.
	 */
	async isPullRequestMerged(prNumber: number): Promise<boolean> {
		const pr = await this.#framework.find<PullRequestResponse>(`pulls/${prNumber}`);
		return pr?.merged === true;
	}
}

/**
 * Gets the open release PR of a framework repository branch.
 *
 * @param {Repository} framework - The framework repository.
 * @param {string} branch - The stable branch, or the prerelease branch for
 *   alpha and beta releases.
 * @returns {Promise<ReleasePullRequest | undefined>} The release PR with its
 *   package versions, or `undefined` when none is open.
 */
async function getReleasePullRequest(
	framework: Repository,
	branch: string
): Promise<ReleasePullRequest | undefined> {
	// Changesets keeps one release PR open per branch, and updates it.
	const [pr] = await framework.listOpenPullRequests({ head: `${RELEASE_BRANCH_PREFIX}${branch}` });
	if (!pr) return undefined;
	return { number: pr.number, versions: parseReleaseVersions(pr.body ?? '') };
}

/** Whether the prerelease branch of the framework is in prerelease mode. */
async function isPrereleaseBranchInPreMode(framework: Repository): Promise<boolean> {
	const preState = await framework.find<{ content: string }>(
		`contents/${PRE_STATE_PATH}?ref=${FRAMEWORK_PRERELEASE_BRANCH}`
	);
	if (!preState) return false;
	// `exit` means the prerelease ends: the branch is then merged into the
	// stable branch.
	return readPreMode(Buffer.from(preState.content, 'base64').toString()) === 'pre';
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
