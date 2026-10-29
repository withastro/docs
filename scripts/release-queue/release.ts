import type { PullRequest, Repository } from '../lib/github/repository.ts';
import * as shape from '../lib/github/shape.ts';
import {
	FRAMEWORK_PACKAGE,
	FRAMEWORK_PRE_MODE_FILE,
	FRAMEWORK_RELEASE_BRANCHES,
	FRAMEWORK_REPOSITORY,
	RELEASE_TYPES,
	type ReleaseType,
} from './config.ts';

/** The heading Changesets writes for each released package, such as `## @astrojs/node@10.0.1`. */
const PACKAGE_HEADING = /^## ((?:@[^/\s]+\/)?[^@\s]+)@(\S+)\s*$/gm;
const SEMVER_CORE = /^(\d+)\.(\d+)\.(\d+)/;
/** The mode Changesets records in its pre mode file until the prerelease line exits pre mode. */
const PRE_MODE = 'pre';
/** The field of the pre mode file the release queue reads. */
const preModeFileShape = shape.object({ mode: shape.string });

type PackageVersion = { name: string; version: string };

export type FrameworkRelease = {
	prNumber: number;
	/** In the order of the release PR. */
	packages: PackageVersion[];
	/** The type of the framework package's release, a patch when the release does not include it. */
	type: ReleaseType;
};

/**
 * The open release of each release line: a framework branch Changesets releases from, stable or
 * prerelease. `null` when the line has no open release PR.
 */
export type FrameworkReleases = {
	/** The release the stable docs branch ships with. */
	stable: FrameworkRelease | null;
	/**
	 * The release the prerelease docs branches ship with: the release of the prerelease line while
	 * that line is in pre mode, and the stable release once it leaves pre mode.
	 */
	prerelease: FrameworkRelease | null;
};

/**
 * Reads the open `[ci] release` PRs of the framework.
 *
 * @param {Repository} framework - The framework repository.
 * @returns {Promise<FrameworkReleases>} The releases, `null` when no release PR is open, such as
 * right after a release.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When the pre mode file is not valid JSON or has no mode, or a release PR gives a
 * version of the framework package that is not semantic.
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
 * Describes the open releases of the framework, for the logs.
 *
 * @param {FrameworkReleases} releases - The open releases of the framework.
 * @returns {string} The release PR, the version of the framework package, and the release type of
 * each release line.
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
 * @returns {PackageVersion | undefined} The package and its version, or `undefined` when the
 * release does not include it.
 */
export function findFrameworkPackage({
	packages,
}: Pick<FrameworkRelease, 'packages'>): PackageVersion | undefined {
	return packages.find(({ name }) => name === FRAMEWORK_PACKAGE);
}

/**
 * Tells whether a release of the framework is a major release of the framework package.
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
		return preModeFileShape(JSON.parse(content)).mode === PRE_MODE;
	} catch (error) {
		throw new Error(`Could not read ${path} on ${ref}.`, { cause: error });
	}
}

function toFrameworkRelease({ number, body }: Pick<PullRequest, 'number' | 'body'>) {
	const packages = [...(body ?? '').matchAll(PACKAGE_HEADING)].map(([, name, version]) => ({
		name,
		version,
	}));
	const frameworkPackage = findFrameworkPackage({ packages });
	const type = frameworkPackage ? getReleaseType(frameworkPackage.version) : RELEASE_TYPES.patch;
	return { prNumber: number, packages, type };
}

function getReleaseType(version: string): ReleaseType {
	const match = version.match(SEMVER_CORE);
	if (!match) {
		throw new Error(`Expected a semantic version for ${FRAMEWORK_PACKAGE}, got "${version}".`);
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
	return `${FRAMEWORK_REPOSITORY}#${release.prNumber} (${version}, ${release.type})`;
}
