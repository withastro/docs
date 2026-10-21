export interface PackageVersion {
	name: string;
	version: string;
}

export type ReleaseType = 'patch' | 'minor' | 'major';

/** The next release from the `main` branch of `withastro/astro`. */
export interface MainRelease {
	type: ReleaseType;
	astroVersion?: string;
}

/** Reads the `## <package>@<version>` headings of a release PR body. */
export function parseReleaseVersions(body: string): PackageVersion[] {
	return Array.from(body.matchAll(/^## (\S+)@(\d+\.\d+\.\d+\S*)\s*$/gm), ([, name, version]) => ({
		name,
		version,
	}));
}

export function findVersion(versions: PackageVersion[], name: string): string | undefined {
	return versions.find((pkg) => pkg.name === name)?.version;
}

/**
 * Gets the type of a stable release from its version. Prereleases and missing
 * versions count as patches: only a new stable minor or major changes how docs
 * PRs are routed.
 */
export function getReleaseType(version: string | undefined): ReleaseType {
	const match = version?.match(/^\d+\.(\d+)\.(\d+)$/);
	if (!match) return 'patch';
	const [, minor, patch] = match;
	if (patch !== '0') return 'patch';
	return minor === '0' ? 'major' : 'minor';
}

/**
 * Gets the next release from `main` from the versions of its release PR, or
 * from none when there is no open release PR.
 */
export function getMainRelease(versions: PackageVersion[] = []): MainRelease {
	const astroVersion = findVersion(versions, 'astro');
	return { type: getReleaseType(astroVersion), astroVersion };
}
