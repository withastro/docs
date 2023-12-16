import type { RehypePlugins } from 'astro';
import type { Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { escape } from 'html-escaper';
import { resolve as nodeResolve } from 'node:path';
import rehypeAutolinkHeadings, { type Options as AutolinkOptions } from 'rehype-autolink-headings';
import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import type { UILanguageKeys } from '../src/i18n/translation-checkers';
import { useTranslationsForLang } from '../src/i18n/util';
import { getLanguageCodeFromPathname, mdFilePathToUrl } from './remark-fallback-lang';

const AnchorLinkIcon = h(
	'span',
	{ ariaHidden: 'true', class: 'anchor-icon' },
	h(
		'svg',
		{ width: 16, height: 16, viewBox: '0 0 24 24' },
		h('path', {
			fill: 'currentcolor',
			d: 'm12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z',
		})
	)
);

const createSROnlyLabel = (text: string) => {
	const t = useTranslationsForLang('en');
	return h(
		'span',
		{ 'is:raw': true, class: 'sr-only' },
		`${t('a11y.sectionLink')} ${escape(text)}`
	);
};

/**
 * Configuration for the `rehype-autolink-headings` plugin.
 * This set-up was informed by https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
 */
const autolinkConfig: AutolinkOptions = {
	properties: { class: 'anchor-link' },
	behavior: 'after',
	group: ({ tagName }) => h('div', { tabIndex: -1, class: `heading-wrapper level-${tagName}` }),
	content: (heading) => [AnchorLinkIcon, createSROnlyLabel(toString(heading))],
};

/**
 * Rehype plugin to translate the headings' anchors according to the currently selected language.
 */
function rehypei18nAutolinkHeadings() {
	const pageSourceDir = nodeResolve('./src/content/docs');
	const baseUrl = 'https://docs.astro.build/';

	const transformer: Transformer<Root> = (tree, file) => {
		const pageUrl = mdFilePathToUrl(file.path, pageSourceDir, baseUrl);
		const pageLang = getLanguageCodeFromPathname(pageUrl.pathname);
		const englishText = useTranslationsForLang('en')('a11y.sectionLink');

		// Find anchor links
		visit(tree, 'element', (node) => {
			if (node.tagName === 'a' && node.properties?.class === 'anchor-link') {
				// Find a11y text labels
				visit(node, 'text', (text) => {
					const heading = text.value.replace(englishText!, '');
					const t = useTranslationsForLang(pageLang as UILanguageKeys);
					const title = t('a11y.sectionLink') || englishText;

					text.value = title + heading;
				});
			}
		});
	};

	return function attacher() {
		return transformer;
	};
}

/**
 * Configure heading anchor links.
 * Spread this into Astro’s `markdown.rehypePlugins` option.
 */
export const rehypeAutolink = (): RehypePlugins => [
	[rehypeAutolinkHeadings, autolinkConfig],
	rehypei18nAutolinkHeadings(),
];
