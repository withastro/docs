import { AstroGlobal } from "astro";

export function getLanguageFromURL(pathname: string) {
	const langCodeMatch = pathname.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
	return langCodeMatch ? langCodeMatch[1] : 'en';
}

/** Remove \ and / from beginning of string */
export function removeLeadingSlash(path: string) {
	return path.replace(/^[/\\]+/, '');
}

/** Remove \ and / from end of string */
export function removeTrailingSlash(path: string) {
	return path.replace(/[/\\]+$/, '');
}

/** Remove the subpage segment of a URL string */
export function removeSubpageSegment(path: string) {
	// Include new pages with subpages as part of this if statement.
	if (/(?:install|deploy|integrations-guide|tutorial)\//.test(path)) {
		return path.slice(0, path.lastIndexOf('/'));
	}
	return path;
}

/** Gets the URL to edit the page on GitHub */
export function getGithubEditUrl(Astro: Readonly<AstroGlobal>) {
	const { content = {} } = Astro.props;
	const isFallback = !!Astro.params.fallback;
	const currentPage = Astro.url.pathname;
	const lang = getLanguageFromURL(currentPage);
	const filePath = `src/pages${currentPage.replace(/\/$/, '')}.md`;
	const currentFile = isFallback ? filePath.replace(`/${lang}/`, '/en/') : filePath;
	const githubEditUrl =
		content.githubURL && (lang === 'en' || isFallback)
			? `${content.githubURL}${content.hasREADME ? 'README.md' : ''}`
			: `https://github.com/withastro/docs/blob/main/${currentFile}`;

	return githubEditUrl;
}
