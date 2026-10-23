import { FRAMEWORK_PACKAGE, RELEASE_LABELS } from './config.ts';

/** A `## <package>@<version>` heading of a release PR body. */
const RELEASE_HEADING = /^## (\S+)@(\d+\.\d+\.\d+\S*)\s*$/gm;
/** A stable version, without a prerelease suffix: its minor and patch. */
const STABLE_VERSION = /^\d+\.(\d+)\.(\d+)$/;

export type ReleaseType = keyof typeof RELEASE_LABELS;

export const RELEASE_TYPES = {
	patch: 'patch',
	minor: 'minor',
	major: 'major',
} as const satisfies { [Type in ReleaseType]: Type };

export interface PackageVersion {
	name: string;
	version: string;
}

/** A release PR of the framework repository. */
export interface ReleasePullRequest {
	number: number;
	versions: PackageVersion[];
}

/** The next release from the stable branch of the framework repository. */
export interface StableRelease {
	type: ReleaseType;
	/** The version of the framework package, if the release includes it. */
	frameworkVersion?: string | undefined;
	/** The open release PR. Without one, the release is a patch. */
	pullRequest?: ReleasePullRequest | undefined;
}

/**
 * Reads the package versions of a release PR, from the headings of its body.
 *
 * @param {string} body - The body of the release PR.
 * @returns {PackageVersion[]} The versions, in the order of the headings.
 */
export function parseReleaseVersions(body: string): PackageVersion[] {
	return Array.from(body.matchAll(RELEASE_HEADING), ([, name, version]) => ({
		name,
		version,
	}));
}

function findVersion(versions: PackageVersion[], name: string): string | undefined {
	return versions.find((pkg) => pkg.name === name)?.version;
}

/**
 * Gets the type of a stable release from its version. Prereleases and missing
 * versions count as patches: only a new stable minor or major changes how docs
 * PRs are routed.
 */
function getReleaseType(version: string | undefined): ReleaseType {
	const match = version?.match(STABLE_VERSION);
	if (!match) return RELEASE_TYPES.patch;
	const [, minor, patch] = match;
	if (patch !== '0') return RELEASE_TYPES.patch;
	return minor === '0' ? RELEASE_TYPES.major : RELEASE_TYPES.minor;
}

/**
 * Gets the next release from the stable branch.
 *
 * @param {ReleasePullRequest} [pullRequest] - The open release PR of the
 *   stable branch. Without one, the release is a patch.
 * @returns {StableRelease} The type and version of the release, with its PR.
 */
export function getStableRelease(pullRequest?: ReleasePullRequest): StableRelease {
	const frameworkVersion = findVersion(pullRequest?.versions ?? [], FRAMEWORK_PACKAGE);
	return { type: getReleaseType(frameworkVersion), frameworkVersion, pullRequest };
}
