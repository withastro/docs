import type { AstroGlobal } from 'astro';

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
export function removeSubpageSegment(path:string) {	
	// Include new pages with subpages as part of this if statement.
	if (/(?:install|deploy|integrations-guide)\//.test(path)) {
		return path.slice(0, path.lastIndexOf('/'));
	}
	return path;
}

export function getCanonicalURL(Astro: AstroGlobal): URL {
	return new URL(new URL(Astro.request.url).pathname, Astro.site);
}

export function escapeHtml(unescapedString: string) {
	return unescapedString
		.replace(/&/g, '&amp;')
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export function unescapeHtml(escapedString: string) {
	return escapedString
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, "\"")
			.replace(/&#039;/g, "'");
}
