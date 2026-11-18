import {
	FRAMEWORK_PACKAGE,
	FRAMEWORK_PRE_MODE_FILE,
	FRAMEWORK_RELEASE_BRANCHES,
	FRAMEWORK_REPOSITORY_NAME,
	RELEASE_TYPES,
	type ReleaseType,
} from './config.ts';
import type { PullRequest, Repository } from './github/repository.ts';

/** The heading Changesets writes for each released package, such as `## @astrojs/node@10.0.1`. */
const PACKAGE_HEADING = /^## ((?:@[^/\s]+\/)?[^@\s]+)@(\S+)\s*$/gm;
const SEMVER_CORE = /^(\d+)\.(\d+)\.(\d+)/;
/** The mode Changesets writes in `pre.json` while it releases prereleases. */
const PRE_MODE = 'pre';

type PackageVersion = { name: string; version: string };

export type FrameworkRelease = {
	prNumber: number;
	/** In the order of the release PR. */
	packages: PackageVersion[];
	/**
	 * The release type of the framework package. Use patch when the release
	 * doesn't include it.
	 */
	type: ReleaseType;
};

/** The open release of each release line. */
export type FrameworkReleases = {
	/** The release the stable docs branch ships with. */
	stable: FrameworkRelease | null;
	/**
	 * The release of the prerelease docs branches. Same as stable when the
	 * framework is not in pre mode.
	 */
	prerelease: FrameworkRelease | null;
};

/**
 * Reads the open `[ci] release` PRs of the framework.
 *
 * @param {Repository} framework - The framework repository.
 * @returns {Promise<FrameworkReleases>} The open release of each release line.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When the pre mode file can't be read.
 * @throws {Error} When a release PR gives a version of the framework package that is not semantic.
 */
export async function readFrameworkReleases(framework: Repository): Promise<FrameworkReleases> {
	const [stable, isInPreMode] = await Promise.all([
		readRelease(framework, FRAMEWORK_RELEASE_BRANCHES.stable),
		readPreMode(framework),
	]);
	const prerelease = isInPreMode
		? await readRelease(framework, FRAMEWORK_RELEASE_BRANCHES.prerelease)
		: stable;
	return { stable, prerelease };
}

/**
 * Describes the open releases of the framework.
 *
 * @param {FrameworkReleases} releases - The open releases of the framework.
 * @returns {string} The release PR, the version of the framework package, and the release type of each release line.
 */
export function describeReleases({ stable, prerelease }: FrameworkReleases): string {
	const prereleaseDescription =
		prerelease?.prNumber === stable?.prNumber ? 'the same' : describeRelease(prerelease);
	return `stable ${describeRelease(stable)}, prerelease ${prereleaseDescription}`;
}

/**
 * Finds the framework package among the packages of a release.
 *
 * @param {Pick<FrameworkRelease, 'packages'>} release - A release of the framework.
 * @returns {PackageVersion | undefined} The package and its version, or `undefined` when the release does not include it.
 */
export function findFrameworkPackage({
	packages,
}: Pick<FrameworkRelease, 'packages'>): PackageVersion | undefined {
	return packages.find(({ name }) => name === FRAMEWORK_PACKAGE);
}

/**
 * Tells whether a framework release is a major release of the framework package.
 *
 * @param {Pick<FrameworkRelease, 'type'> | null} release - A release, or `null` when none is open.
 * @returns {boolean} `false` without a release.
 */
export function isMajorRelease(release: Pick<FrameworkRelease, 'type'> | null): boolean {
	return release?.type === RELEASE_TYPES.major;
}

async function readRelease(framework: Repository, releaseBranch: string) {
	const [releasePullRequest] = await framework.getOpenPullRequestsFromBranch(releaseBranch);
	return releasePullRequest ? toFrameworkRelease(releasePullRequest) : null;
}

async function readPreMode(framework: Repository) {
	const { path, ref } = FRAMEWORK_PRE_MODE_FILE;
	const content = await framework.getFileContent(path, ref);
	if (content === null) return false;

	try {
		return readMode(JSON.parse(content)) === PRE_MODE;
	} catch (error) {
		throw new Error(`Could not read ${path} on ${ref} in ${framework.fullName}.`, { cause: error });
	}
}

function readMode(preModeFile: unknown) {
	const mode =
		preModeFile && typeof preModeFile === 'object' && 'mode' in preModeFile && preModeFile.mode;
	if (typeof mode !== 'string') throw new Error('`mode` should be a string.');
	return mode;
}

function toFrameworkRelease({ number, body }: Pick<PullRequest, 'number' | 'body'>) {
	const packages = [...(body ?? '').matchAll(PACKAGE_HEADING)].map(([, name, version]) => ({
		name,
		version,
	}));
	const frameworkPackage = findFrameworkPackage({ packages });
	const type = frameworkPackage
		? getReleaseType(frameworkPackage.version, number)
		: RELEASE_TYPES.patch;
	return { prNumber: number, packages, type };
}

function getReleaseType(version: string, prNumber: number): ReleaseType {
	const match = version.match(SEMVER_CORE);
	if (!match) {
		throw new Error(
			`Expected a semantic version for ${FRAMEWORK_PACKAGE} in ${FRAMEWORK_REPOSITORY_NAME}#${prNumber}. Got: "${version}".`
		);
	}

	const [, , minor, patch] = match;
	if (Number(patch) > 0) return RELEASE_TYPES.patch;
	if (Number(minor) > 0) return RELEASE_TYPES.minor;
	return RELEASE_TYPES.major;
}

function describeRelease(release: FrameworkRelease | null) {
	if (!release) return 'none open';
	const frameworkPackage = findFrameworkPackage(release);
	const version = frameworkPackage
		? `${frameworkPackage.name}@${frameworkPackage.version}`
		: `without ${FRAMEWORK_PACKAGE}`;
	return `${FRAMEWORK_REPOSITORY_NAME}#${release.prNumber} (${version}, ${release.type})`;
}
