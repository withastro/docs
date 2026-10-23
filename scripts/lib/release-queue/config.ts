// The names the release queue uses: repositories, branches, labels, and the
// accounts and directives it relies on.

export const DOCS_REPO = 'withastro/docs';
export const FRAMEWORK_REPO = 'withastro/astro';
export const FRAMEWORK_CORE_PACKAGE = 'astro';
export const FRAMEWORK_STABLE_BRANCH = 'main';
export const FRAMEWORK_PRERELEASE_BRANCH = 'next';
export const RELEASE_TITLE_PREFIX = '[ci] release';

export const STABLE_BRANCH = 'main';
export const UMBRELLA_BRANCH_PREFIX = 'release-queue/';

/** The label meaning a docs PR ships with the next release. */
export const ACCEPTED_LABEL = 'accepted';
export const MERGE_ON_RELEASE_LABEL = 'merge-on-release';
/** Added by `pr-labeler.yml` when translations change. */
export const TRANSLATIONS_LABEL = 'i18n';
export const RELEASE_TYPES = { patch: 'patch', minor: 'minor', major: 'major' } as const;

export type ReleaseType = (typeof RELEASE_TYPES)[keyof typeof RELEASE_TYPES];

export const RELEASE_LABELS = {
	patch: `${RELEASE_TYPES.patch}-release`,
	minor: `${RELEASE_TYPES.minor}-release`,
	major: `${RELEASE_TYPES.major}-release`,
} as const satisfies { [Type in ReleaseType]: `${Type}-release` };

export type ReleaseLabel = (typeof RELEASE_LABELS)[keyof typeof RELEASE_LABELS];

export const ALL_RELEASE_LABELS: ReleaseLabel[] = Object.values(RELEASE_LABELS);

/** The label of a release whose type isn't known yet. */
export const FALLBACK_RELEASE_LABEL: ReleaseLabel = RELEASE_LABELS.patch;

/** The login of the bot behind `GITHUB_TOKEN`. */
export const MERGE_BLOCK_REVIEWER_LOGIN = 'github-actions[bot]';

export const LUNARIA_DIRECTIVE = '@lunaria-track:src/content/docs/en/**.mdx';
export const LUNARIA_DIRECTIVE_DOCS =
	'https://lunaria.dev/guides/tracking/#triggering-changes-per-file';
