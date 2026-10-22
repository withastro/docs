// The names the release queue uses. The labels, the repositories, the
// reviewer and the Lunaria directive can change here. The branch names are
// also vocabulary: they appear in names like `main-only` or `major-on-main`,
// and in comments.

export const DOCS_REPO = 'withastro/docs';
export const FRAMEWORK_REPO = 'withastro/astro';
/** The package of `withastro/astro` that names its releases. */
export const FRAMEWORK_PACKAGE = 'astro';
export const FRAMEWORK_MAIN_BRANCH = 'main';
/** The branch of `withastro/astro` for its alpha and beta releases. */
export const FRAMEWORK_PRERELEASE_BRANCH = 'next';
/** The title prefix of `withastro/astro` release PRs, shared by umbrellas. */
export const RELEASE_TITLE_PREFIX = '[ci] release';

export const MAIN_BRANCH = 'main';
/** The reserved branch prefix for umbrellas. */
export const UMBRELLA_PREFIX = 'release-queue/';
export const MAIN_UMBRELLA_BRANCH = `${UMBRELLA_PREFIX}${MAIN_BRANCH}`;

/** The label meaning a docs PR ships with the next release. */
export const ACCEPTED_LABEL = 'accepted';
export const MERGE_ON_RELEASE_LABEL = 'merge-on-release';
/** Added by `pr-labeler.yml` when translations change. */
export const TRANSLATIONS_LABEL = 'i18n';
/** The label of each release type. */
export const RELEASE_LABELS = {
	patch: 'patch-release',
	minor: 'minor-release',
	major: 'major-release',
} as const;

export type ReleaseLabel = (typeof RELEASE_LABELS)[keyof typeof RELEASE_LABELS];

export const ALL_RELEASE_LABELS: ReleaseLabel[] = Object.values(RELEASE_LABELS);

/** The label of a release whose type isn't known yet. */
export const FALLBACK_RELEASE_LABEL: ReleaseLabel = RELEASE_LABELS.patch;

/** The bot behind `GITHUB_TOKEN`, which blocks umbrella merges. */
export const REVIEWER_LOGIN = 'github-actions[bot]';

export const LUNARIA_DIRECTIVE = '@lunaria-track:src/content/docs/en/**.mdx';
export const LUNARIA_DIRECTIVE_DOCS =
	'https://lunaria.dev/guides/tracking/#triggering-changes-per-file';
