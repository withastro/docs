export const MODES = {
	/** Removes the accepted label from each PR and comments with what a live run would do. */
	dryRun: 'dry-run',
} as const;

export type Mode = (typeof MODES)[keyof typeof MODES];

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

export const DOCS_STABLE_BRANCH = 'main';

export const UMBRELLA_BRANCH_PREFIX = 'umbrella/';
