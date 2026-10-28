export const MODES = {
	/** Comments on the PR that triggered the run with what the release queue would do. */
	dryRun: 'dry-run',
	live: 'live',
} as const;

export type Mode = (typeof MODES)[keyof typeof MODES];

export const ACCEPTED_LABEL = 'accepted';
/** Set on umbrella PRs only, to find them in the PR list. */
export const UMBRELLA_LABEL = 'merge-on-release';

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

/** GitHub checks a PR for conflicts on the first request for it, which takes a few seconds. */
export const MERGEABILITY_RETRY_COUNT = 5;
export const MERGEABILITY_RETRY_DELAY_MS = 2000;

export const FRAMEWORK_REPOSITORY = 'withastro/astro';
export const FRAMEWORK_PACKAGE = 'astro';
/** Changesets opens the release PR of each framework branch from these branches. */
export const FRAMEWORK_STABLE_RELEASE_BRANCH = 'changeset-release/main';
export const FRAMEWORK_PRERELEASE_RELEASE_BRANCH = 'changeset-release/next';
/** Changesets writes this file on the framework's prerelease branch while it is in pre mode. */
export const FRAMEWORK_PRE_MODE_FILE = { path: '.changeset/pre.json', ref: 'next' };

/** Set by the labeler on PRs that change translations. Their umbrella needs a Lunaria directive. */
export const I18N_LABEL = 'i18n';
/** The directive that tells Lunaria to track the English pages changed by an umbrella. */
export const LUNARIA_DIRECTIVE = '@lunaria-track:src/content/docs/en/**.mdx';
