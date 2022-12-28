import path from 'path';
import type { Root } from 'hast';
import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';

import { mdFilePathToUrl, getLanguageCodeFromPathname } from './remark-fallback-lang';
import { useTranslationsForLang } from '../src/i18n/util';
import type { UILanguageKeys } from '../src/i18n/translation-checkers';

/**
 * Rehype plugin to translate the headings' anchors according to the currently selected language.
 */
export function rehypei18nAutolinkHeadings() {
	const pageSourceDir = path.resolve('./src/pages');
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
