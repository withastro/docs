/* global URL, Response */

/**
 * Worker that serves localized 404 pages.
 *
 * When a request doesn't match any static asset, this checks if the URL starts
 * with a language prefix (e.g. /fr/, /ja/) and serves the corresponding
 * localized 404 page (e.g. /fr/404/index.html) with a 404 status code.
 *
 * For non-localized 404s, the default asset response is returned as-is.
 */
export default {
	async fetch(request, env) {
		// Try to serve the request from static assets
		const response = await env.ASSETS.fetch(request);

		if (response.status === 404) {
			const url = new URL(request.url);
			// Extract the language prefix, e.g. "fr" from "/fr/some/page"
			const firstSegment = url.pathname.split('/')[1];
			if (firstSegment) {
				// Try to fetch the localized 404 page for this language
				const localizedNotFound = await env.ASSETS.fetch(
					new URL(`/${firstSegment}/404/index.html`, url.origin)
				);
				// If a localized 404 page exists, serve it with a 404 status
				if (localizedNotFound.status === 200) {
					return new Response(localizedNotFound.body, {
						status: 404,
						headers: localizedNotFound.headers,
					});
				}
			}
		}

		return response;
	},
};
