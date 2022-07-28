import EleventyFetch from '@11ty/eleventy-fetch';

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
	if (/(?:install|deploy|integrations-guide)\//.test(path)) {
		return path.slice(0, path.lastIndexOf('/'));
	}
	return path;
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

export type CachedFetchOptions = {
	duration?: string;
	verbose?: boolean;
};

export async function cachedFetch(
	url: string,
	fetchOptions = {},
	{ duration = '5m', verbose = false }: CachedFetchOptions = {}
) {
	let status = 200;
	let statusText = 'OK';
	let buffer: Buffer | undefined;

	try {
		buffer = await EleventyFetch(url, {
			duration,
			verbose,
			type: 'buffer',
			fetchOptions,
		});
	} catch (error) {
		const msg: string = error?.message || error.toString();
		const matches = msg.match(/^Bad response for (.*) \(.*?\): (.*)$/);
		status = parseInt(matches?.[2] || '') || 404;
		statusText = matches?.[3] || msg;
	}

	return {
		ok: status >= 200 && status <= 299,
		status,
		statusText,
		body: buffer,
		json: () => buffer && JSON.parse(buffer.toString()),
		text: () => buffer?.toString(),
	};
}
