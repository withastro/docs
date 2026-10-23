// The names the release queue uses: repositories, branches, labels, and the
// accounts and directives it relies on.

export const DOCS_REPO = 'withastro/docs';
export const FRAMEWORK_REPO = 'withastro/astro';
/** The package of the framework repository that names its releases. */
export const FRAMEWORK_PACKAGE = 'astro';
export const FRAMEWORK_STABLE_BRANCH = 'main';
/** The branch of the framework repository for its alpha and beta releases. */
export const FRAMEWORK_PRERELEASE_BRANCH = 'next';
/** The title prefix of the framework's release PRs, shared by umbrellas. */
export const RELEASE_TITLE_PREFIX = '[ci] release';

export const STABLE_BRANCH = 'main';
export const UMBRELLA_BRANCH_PREFIX = 'release-queue/';
export const STABLE_UMBRELLA_BRANCH = `${UMBRELLA_BRANCH_PREFIX}${STABLE_BRANCH}`;

/** The label meaning a docs PR ships with the next release. */
export const ACCEPTED_LABEL = 'accepted';
export const MERGE_ON_RELEASE_LABEL = 'merge-on-release';
/** Added by `pr-labeler.yml` when translations change. */
export const TRANSLATIONS_LABEL = 'i18n';
export const RELEASE_LABELS = {
	patch: 'patch-release',
	minor: 'minor-release',
	major: 'major-release',
} as const;

export type ReleaseLabel = (typeof RELEASE_LABELS)[keyof typeof RELEASE_LABELS];

export const ALL_RELEASE_LABELS: ReleaseLabel[] = Object.values(RELEASE_LABELS);

/** The label of a release whose type isn't known yet. */
export const FALLBACK_RELEASE_LABEL: ReleaseLabel = RELEASE_LABELS.patch;

/** The login of the bot behind `GITHUB_TOKEN`. */
export const MERGE_BLOCK_REVIEWER_LOGIN = 'github-actions[bot]';

export const LUNARIA_DIRECTIVE = '@lunaria-track:src/content/docs/en/**.mdx';
export const LUNARIA_DIRECTIVE_DOCS =
	'https://lunaria.dev/guides/tracking/#triggering-changes-per-file';
