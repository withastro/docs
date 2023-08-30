import fs from 'fs';
import path from 'path';
import { dedentMd } from '../../output.mjs';
import type { LinkCheckerOptions } from '../base/base';
import { AllPagesByPathname, HtmlPage } from '../base/page';

/**
 * Reads sitemaps from the build output and extracts all unique pathnames.
 * `@astrojs/sitemap` can generate multiple numbered sitemaps, named `sitemap-0.xml` etc.
 */
export function getPagePathnamesFromSitemap(options: LinkCheckerOptions) {
	const distContents = fs.readdirSync(options.buildOutputDir);
	const sitemaps = distContents.filter((path) => /^sitemap-\d+\.xml$/.test(path));

	const sitemapRegex = new RegExp(`<loc>${options.baseUrl}(/.*?)</loc>`, 'ig');
	const uniquePagePaths = new Set<string>();

	for (const filename of sitemaps) {
		const sitemapFilePath = path.join(options.buildOutputDir, filename);
		const sitemap = fs.readFileSync(sitemapFilePath, 'utf8');
		const paths = Array.from(sitemap.matchAll(sitemapRegex), (m) => m[1]);
		paths.forEach((path) => uniquePagePaths.add(path));
	}

	return Array.from(uniquePagePaths);
}

/**
 * Parses multiple HTML pages based on their pathnames and builds an index of their contents.
 */
export function parsePages(pathnames: string[], options: LinkCheckerOptions): AllPagesByPathname {
	const pages: AllPagesByPathname = {};
	pathnames.forEach((pathname) => {
		pages[pathname] = parsePage(pathname, options);
	});

	return pages;
}

/**
 * Parses an HTML page based on its pathname and builds an index of its contents.
 */
function parsePage(pathname: string, options: LinkCheckerOptions): HtmlPage {
	// Determine the html file path and full page URL from the given pathname
	const htmlFilePath = pathnameToHtmlFilePath(pathname, options.buildOutputDir);
	const href = pathnameToHref(pathname, options.baseUrl);

	try {
		// Attempt to load the HTML file and create a page instance to parse it
		const html = fs.readFileSync(htmlFilePath, 'utf8');
		const htmlPage = new HtmlPage({ html, href, pathname });

		// Do not allow pages without main content unless they are a redirect
		if (!htmlPage.isRedirect && !htmlPage.mainContent)
			throw new Error('Failed to find main content - page has no <article> or <body>');

		// Do not allow pages without a main content "lang" attribute unless they are a redirect
		if (!htmlPage.isRedirect && !htmlPage.mainContentLang)
			throw new Error('Failed to find "lang" attribute of main content');

		return htmlPage;
	} catch (err: unknown) {
		throw new Error(dedentMd`Error parsing HTML file "${htmlFilePath}"
			referenced by sitemap: ${err instanceof Error ? err.message : err}`);
	}
}

function pathnameToHref(pathname: string, baseUrl: string) {
	const url = new URL(pathname, baseUrl);
	return url.href;
}

function pathnameToHtmlFilePath(pathname: string, buildOutputDir: string) {
	return path.join(buildOutputDir, pathname, 'index.html');
}
