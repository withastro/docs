/* global URL, URLPattern, Response */

/**
 * Redirect rules. Since Cloudflare Workers with a `main` entrypoint bypass
 * _redirects processing, we handle them directly in the worker using URLPattern.
 *
 * Format: [sourcePattern, destination, statusCode?]
 * - :name matches a single path segment
 * - * matches the rest of the path (referenced as :splat in the destination)
 */
const rules = [
	// Moved content
	['/:lang/install/auto', '/:lang/install-and-setup/'],
	['/:lang/install/manual', '/:lang/install-and-setup/'],
	['/:lang/core-concepts/project-structure', '/:lang/basics/project-structure/'],
	['/:lang/core-concepts/astro-components', '/:lang/basics/astro-components/'],
	['/:lang/core-concepts/astro-pages', '/:lang/basics/astro-pages/'],
	['/:lang/core-concepts/layouts', '/:lang/basics/layouts/'],
	['/:lang/core-concepts/astro-syntax', '/:lang/basics/astro-syntax/'],
	['/:lang/core-concepts/rendering-modes', '/:lang/guides/on-demand-rendering/'],
	['/:lang/core-concepts/routing', '/:lang/guides/routing/'],
	['/:lang/core-concepts/endpoints', '/:lang/guides/endpoints/'],
	['/:lang/core-concepts/framework-components', '/:lang/guides/framework-components/'],
	['/:lang/core-concepts/sharing-state', '/:lang/recipes/sharing-state-islands/'],
	['/:lang/reference/dev-overlay-plugin-reference', '/:lang/reference/dev-toolbar-app-reference/'],
	['/:lang/core-concepts/partial-hydration', '/:lang/concepts/islands/'],
	['/:lang/guides/publish-to-npm', '/:lang/guides/integrations/'],
	['/:lang/reference/publish-to-npm', '/:lang/guides/integrations/'],
	['/:lang/guides/integrations-guide', '/:lang/guides/integrations/'],
	['/:lang/concepts/mpa-vs-spa', '/:lang/concepts/why-astro/'],
	['/:lang/deploy/:service', '/:lang/guides/deploy/:service'],
	['/:lang/guides/client-side-routing', '/:lang/guides/view-transitions/'],
	['/:lang/guides/assets', '/:lang/guides/images/'],
	['/en/guides/aliases', '/en/guides/imports/#aliases'],
	['/:lang/guides/aliases', '/:lang/guides/imports/'],
	['/:lang/guides/integrations-guide/image', '/:lang/guides/images/'],
	['/:lang/migration/0.21.0', '/:lang/guides/upgrade-to/v1/'],
	['/:lang/migrate', '/:lang/guides/upgrade-to/v1/'],
	['/:lang/recipes/studio', '/:lang/guides/astro-db/'],
	['/:lang/basics/rendering-modes/', '/:lang/guides/on-demand-rendering/'],
	['/:lang/guides/server-side-rendering/', '/:lang/guides/on-demand-rendering/'],
	['/:lang/guides/content/', '/:lang/guides/markdown-content/'],
	['/:lang/community-resources/talks/', '/:lang/recipes/'],
	['/:lang/community-resources/content/', '/:lang/recipes/'],
	['/:lang/reference/components-reference/', '/:lang/guides/syntax-highlighting/'],
	['/:lang/tutorials/add-content-collections/', '/:lang/tutorial/6-islands/4/'],
	['/:lang/tutorials/add-view-transitions/', '/:lang/guides/view-transitions/'],
	['/:lang/guides/rss/', '/:lang/recipes/rss/'],
	['/:lang/basics/astro-syntax/', '/:lang/reference/astro-syntax/'],
	['/:lang/reference/experimental-flags/sessions/', '/:lang/guides/sessions/'],
	['/:lang/reference/experimental-flags/svg/', '/:lang/guides/images/'],
	['/:lang/reference/experimental-flags/serialized-configuration/', '/:lang/reference/modules/astro-config/'],
	['/:lang/reference/experimental-flags/responsive-images/', '/:lang/guides/images/'],
	['/:lang/guides/deploy/sst/', '/:lang/guides/deploy/aws-via-sst/'],
	['/:lang/guides/deploy/flightcontrol/', '/:lang/guides/deploy/aws-via-flightcontrol/'],
	['/:lang/guides/deploy/google-firebase/', '/:lang/guides/deploy/firebase/'],
	['/:lang/guides/backend/google-firebase/', '/:lang/guides/backend/firebase/'],
	['/:lang/guides/backend/appwriteio/', '/:lang/guides/backend/appwrite/'],
	['/:lang/reference/experimental-flags/csp/', '/:lang/reference/configuration-reference/#securitycsp'],
	['/:lang/reference/experimental-flags/fail-on-prerender-conflict/', '/:lang/reference/configuration-reference/#prerenderconflictbehavior'],
	['/:lang/reference/experimental-flags/fonts/', '/:lang/guides/fonts/'],
	['/:lang/reference/experimental-flags/heading-id-compat/', '/:lang/guides/markdown-content/#heading-ids'],
	['/:lang/reference/experimental-flags/live-content-collections/', '/:lang/guides/content-collections/#live-content-collections'],
	['/:lang/reference/experimental-flags/preserve-scripts-order/', '/:lang/guides/client-side-scripts/'],
	['/:lang/reference/experimental-flags/static-import-meta-env/', '/:lang/guides/environment-variables/'],

	// Very old docs site redirects
	['/reference/renderer-reference', '/en/reference/renderer-reference/'],
	['/en/core-concepts/component-hydration', '/en/concepts/islands/'],
	['/core-concepts/component-hydration', '/en/concepts/islands/'],
	['/core-concepts/collections', '/en/guides/content-collections/'],
	['/:lang/core-concepts/collections', '/:lang/guides/content-collections/'],
	['/en/getting-started/quick-start', '/en/install-and-setup/'],
	['/docs/*', '/:splat'],
	['/:lang/docs/*', '/:lang/:splat'],
	['/comparing-astro-vs-other-tools', '/en/guides/migrate-to-astro/'],
	['/:lang/comparing-astro-vs-other-tools', '/:lang/guides/migrate-to-astro/'],
	['/lighthouse/*', '/en/guides/migrate-to-astro/'],
	['/en/guides/debugging', '/en/guides/troubleshooting/'],
	['/en/quick-started', '/en/installation/'],

	// Redirect root to English homepage
	['/', '/en/getting-started/'],
];

/**
 * Compile redirect rules into URLPattern instances.
 * Convert _redirects-style patterns (with * splats) to URLPattern syntax.
 */
const redirects = rules.map(([source, dest, status]) => {
	// URLPattern uses :name for named groups. For splats, convert "/*" to "/:splat*"
	// so the wildcard portion is captured as the "splat" group.
	let patternPath = source.replace(/\/\*$/, '/:splat*');
	// Strip trailing slash before adding the optional one, to avoid double-slash patterns.
	// Special-case the root path "/".
	if (patternPath !== '/') {
		patternPath = patternPath.replace(/\/$/, '');
	}
	// Match with or without trailing slash
	const pattern = new URLPattern({ pathname: `${patternPath}{/}?` });
	return { pattern, dest, status: status || 302 };
});

/**
 * Check if a pathname matches any redirect rule.
 * Returns { destination, status } or null.
 */
function findRedirect(url) {
	for (const { pattern, dest, status } of redirects) {
		const match = pattern.exec(url);
		if (match) {
			const groups = match.pathname.groups;
			// Replace :placeholders in destination with matched groups
			const destination = dest.replace(/:(\w+)/g, (_, name) => groups[name] ?? '');
			return { destination, status };
		}
	}
	return null;
}

/**
 * Worker that handles redirects and serves localized 404 pages.
 *
 * Redirect rules are checked first. If no redirect matches, the request is
 * served from static assets. If no asset is found, a localized 404 page is
 * served based on the URL's language prefix.
 */
export default {
	async fetch(request, env) {
		// Try to serve the request from static assets first
		const response = await env.ASSETS.fetch(request);

		// If an asset was found, return it immediately
		if (response.status !== 404) {
			return response;
		}

		// No asset matched — check redirect rules
		const url = new URL(request.url);
		const redirect = findRedirect(url);
		if (redirect) {
			const target = new URL(redirect.destination, url.origin);
			return Response.redirect(target.href, redirect.status);
		}

		// No redirect matched — try to serve a localized 404 page
		const firstSegment = url.pathname.split('/')[1];
		if (firstSegment) {
			const localizedNotFound = await env.ASSETS.fetch(
				new URL(`/${firstSegment}/404/index.html`, url.origin)
			);
			if (localizedNotFound.status === 200) {
				return new Response(localizedNotFound.body, {
					status: 404,
					headers: localizedNotFound.headers,
				});
			}
		}

		return response;
	},
};
