import { FRAMEWORK_PACKAGE } from './config.ts';

export interface PackageVersion {
	name: string;
	version: string;
}

export type ReleaseType = 'patch' | 'minor' | 'major';

/** A `[ci] release` PR of `withastro/astro`. */
export interface ReleasePullRequest {
	number: number;
	versions: PackageVersion[];
}

/** The next release from the `main` branch of `withastro/astro`. */
export interface MainRelease {
	type: ReleaseType;
	astroVersion?: string | undefined;
	/** The open release PR. Without one, the release is a patch. */
	pullRequest?: ReleasePullRequest | undefined;
}

/** Reads the `## <package>@<version>` headings of a release PR body. */
export function parseReleaseVersions(body: string): PackageVersion[] {
	return Array.from(body.matchAll(/^## (\S+)@(\d+\.\d+\.\d+\S*)\s*$/gm), ([, name, version]) => ({
		name,
		version,
	}));
}

/** Finds the version of the package `name` among the released `versions`. */
function findVersion(versions: PackageVersion[], name: string): string | undefined {
	return versions.find((pkg) => pkg.name === name)?.version;
}

/**
 * Gets the type of a stable release from its version. Prereleases and missing
 * versions count as patches: only a new stable minor or major changes how docs
 * PRs are routed.
 */
function getReleaseType(version: string | undefined): ReleaseType {
	const match = version?.match(/^\d+\.(\d+)\.(\d+)$/);
	if (!match) return 'patch';
	const [, minor, patch] = match;
	if (patch !== '0') return 'patch';
	return minor === '0' ? 'major' : 'minor';
}

/** Gets the next release from `main` from its open release PR, if any. */
export function getMainRelease(pullRequest?: ReleasePullRequest): MainRelease {
	const astroVersion = findVersion(pullRequest?.versions ?? [], FRAMEWORK_PACKAGE);
	return { type: getReleaseType(astroVersion), astroVersion, pullRequest };
}
