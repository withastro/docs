import fs from 'fs';
import type { Root } from 'mdast';
import path from 'path';
import type { Plugin, Transformer } from 'unified';
import { visit } from 'unist-util-visit';

export function remarkFallbackLang(): Plugin<[], Root> {
	const pageSourceDir = path.resolve('./src/content/docs');
	const baseUrl = 'https://docs.astro.build/';

	const transformer: Transformer<Root> = (tree, file) => {
		const pageUrl = mdFilePathToUrl(file.path, pageSourceDir, baseUrl);
		const pageLang = getLanguageCodeFromPathname(pageUrl.pathname);

		// Ignore pages without language prefix and English pages
		if (!pageLang || pageLang === 'en') return;

		visit(tree, 'link', (link) => {
			const linkUrl = new URL(link.url, pageUrl);

			// Ignore external links
			if (pageUrl.host !== linkUrl.host) return;

			// Ignore link targets without language prefix
			const linkLang = getLanguageCodeFromPathname(linkUrl.pathname);
			if (!linkLang) return;

			// Ignore link targets that have a valid source file
			const linkSourceFileName = tryFindSourceFileForPathname(linkUrl.pathname, pageSourceDir);
			if (linkSourceFileName) return;

			link.children.push({
				type: 'text',
				value: `\u00A0(EN)`,
			});
		});
	};

	return function attacher() {
		return transformer;
	};
}

function mdFilePathToUrl(mdFilePath: string, pageSourceDir: string, baseUrl: string) {
	const pathBelowRoot = path.relative(pageSourceDir, mdFilePath);
	const pathname = pathBelowRoot.replace(/\\/g, '/').replace(/\.mdx?$/i, '/');

	return new URL(pathname, baseUrl);
}

function getLanguageCodeFromPathname(pathname: string) {
	// Assuming that `pathname` always starts with a `/`, retrieve the first path part,
	// which is usually the language code
	const firstPathPart = pathname.split('/')[1];
	// Only return parts that look like a two-letter language code
	// with optional two-letter country code
	if (firstPathPart.match(/^[a-z]{2}(-[a-zA-Z]{2})?$/)) return firstPathPart;
}

/**
 * Attempts to find a Markdown source file for the given `pathname`.
 *
 * Example: Given a pathname of `/en/some-page` or `/en/some-page/`,
 * searches for the source file in the following locations
 * and returns the first matching path:
 * - `${this.pageSourceDir}/en/some-page.md`
 * - `${this.pageSourceDir}/en/some-page/index.md`
 * - `${this.pageSourceDir}/en/some-page.mdx`
 * - `${this.pageSourceDir}/en/some-page/index.mdx`
 *
 * If no existing file is found, returns `undefined`.
 */
function tryFindSourceFileForPathname(pathname: string, pageSourceDir: string) {
	const possibleSourceFilePaths = [
		path.join(pageSourceDir, pathname, '.') + '.md',
		path.join(pageSourceDir, pathname, 'index.md'),
		path.join(pageSourceDir, pathname, '.') + '.mdx',
		path.join(pageSourceDir, pathname, 'index.mdx'),
	];
	return possibleSourceFilePaths.find((possiblePath) => fs.existsSync(possiblePath));
}
