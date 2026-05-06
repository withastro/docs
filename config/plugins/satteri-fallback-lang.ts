import fs from 'node:fs';
import path from 'node:path';
import { defineMdastPlugin } from 'satteri';

const pageSourceDir = path.resolve('./src/content/docs');
const baseUrl = 'https://docs.astro.build/';

export function fallbackLangPlugin() {
	return defineMdastPlugin({
		name: 'fallback-lang',
		link(node, context) {
			const pageUrl = mdFilePathToUrl(context.filename, pageSourceDir, baseUrl);
			const pageLang = getLanguageCodeFromPathname(pageUrl.pathname);

			// Ignore pages without language prefix and English pages
			if (!pageLang || pageLang === 'en') return;

			const linkUrl = new URL(node.url, pageUrl);

			// Ignore external links
			if (pageUrl.host !== linkUrl.host) return;

			// Ignore link targets without language prefix
			const linkLang = getLanguageCodeFromPathname(linkUrl.pathname);
			if (!linkLang) return;

			// Ignore link targets that have a valid source file
			const linkSourceFileName = tryFindSourceFileForPathname(linkUrl.pathname, pageSourceDir);
			if (linkSourceFileName) return;

			context.appendChild(node, {
				type: 'text',
				value: '\u00A0(EN)',
			});
		},
	});
}

function mdFilePathToUrl(mdFilePath: string, pageSourceDir: string, baseUrl: string) {
	const pathBelowRoot = path.relative(pageSourceDir, mdFilePath);
	const pathname = pathBelowRoot.replace(/\\/g, '/').replace(/\.mdx?$/i, '/');
	return new URL(pathname, baseUrl);
}

function getLanguageCodeFromPathname(pathname: string) {
	const firstPathPart = pathname.split('/')[1];
	if (firstPathPart?.match(/^[a-z]{2}(-[a-zA-Z]{2})?$/)) return firstPathPart;
}

function tryFindSourceFileForPathname(pathname: string, pageSourceDir: string) {
	const possibleSourceFilePaths = [
		path.join(pageSourceDir, pathname, '.') + '.md',
		path.join(pageSourceDir, pathname, 'index.md'),
		path.join(pageSourceDir, pathname, '.') + '.mdx',
		path.join(pageSourceDir, pathname, 'index.mdx'),
	];
	return possibleSourceFilePaths.find((possiblePath) => fs.existsSync(possiblePath));
}
