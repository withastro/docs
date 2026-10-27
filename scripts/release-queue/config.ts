export const ACCEPTED_LABEL = 'accepted';

export const RELEASE_TYPES = {
	patch: 'patch',
	minor: 'minor',
	major: 'major',
} as const;

export type ReleaseType = (typeof RELEASE_TYPES)[keyof typeof RELEASE_TYPES];

export const RELEASE_LABELS = {
	patch: `${RELEASE_TYPES.patch}-release`,
	minor: `${RELEASE_TYPES.minor}-release`,
	major: `${RELEASE_TYPES.major}-release`,
} as const satisfies { [Type in ReleaseType]: `${Type}-release` };

/** The docs branch for stable releases. Umbrellas for any other base are for prereleases. */
export const DOCS_STABLE_BRANCH = 'main';

/** Branches starting with this prefix are reserved for umbrellas, one per base branch. */
export const UMBRELLA_BRANCH_PREFIX = 'release-queue/';
