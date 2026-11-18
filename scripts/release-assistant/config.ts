export const MODES = {
	/** Removes the accepted label from each PR and comments with what a live run would do. */
	dryRun: 'dry-run',
	live: 'live',
} as const;

export type Mode = (typeof MODES)[keyof typeof MODES];

export const ACCEPTED_LABEL = 'accepted';
export const UMBRELLA_LABEL = 'merge-on-release';

/** The name of `.github/workflows/release-assistant-trigger.yml`. */
export const TRIGGER_WORKFLOW_NAME = 'Release assistant trigger';
/** The check `.github/workflows/release-assistant-trigger.yml` adds to labeled PRs. */
export const TRIGGER_CHECK_NAME = 'Trigger the release assistant';

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

export const DOCS_REPOSITORY = { owner: 'withastro', repo: 'docs' };

export const FRAMEWORK_REPOSITORY = { owner: 'withastro', repo: 'astro' };
export const FRAMEWORK_REPOSITORY_NAME = `${FRAMEWORK_REPOSITORY.owner}/${FRAMEWORK_REPOSITORY.repo}`;
export const FRAMEWORK_PACKAGE = 'astro';
/** The branches Changesets opens the release PRs from. */
export const FRAMEWORK_RELEASE_BRANCHES = {
	stable: 'changeset-release/main',
	prerelease: 'changeset-release/next',
};
/** Changesets writes this file on the framework's prerelease branch while it is in pre mode. */
export const FRAMEWORK_PRE_MODE_FILE = { path: '.changeset/pre.json', ref: 'next' };

/** Set by the labeler on PRs that change translations. */
export const I18N_LABEL = 'i18n';
/** Tells Lunaria to track the English pages an umbrella changes. */
export const LUNARIA_DIRECTIVE_EXAMPLE = '@lunaria-track:src/content/docs/en/**.mdx';
export const LUNARIA_DIRECTIVE_GUIDE =
	'https://lunaria.dev/guides/tracking/#triggering-changes-per-file';
