/**
 * Gets the title of the umbrella PR merging into `target`, after the
 * `[ci] release` PRs of `withastro/astro`. The `main` umbrella uses the
 * `astro` version when there is one, as merged PRs are posted to Discord.
 * A prerelease umbrella uses its branch name, which says what it is for.
 */
export function getUmbrellaTitle(target: string, astroVersion?: string): string {
	const release = target === 'main' && astroVersion ? `astro@${astroVersion}` : target;
	return `[ci] release ${release} docs`;
}
