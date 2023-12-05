import type starlight from '@astrojs/starlight';
import { normalizeLangTag } from '../src/i18n/bcp-normalize';
import type { NavDict } from '../src/i18n/translation-checkers';
import { navTranslations } from '../src/i18n/util';

/** For an item in our sidebar, get translations of its label. */
function getTranslations(item: NavDict[number]): Record<string, string> | undefined {
	return Object.fromEntries(
		Object.entries(navTranslations)
			.map(([lang, translations]) => {
				const translation = translations.find((t) => t.key === item.key);
				return [
					normalizeLangTag(lang),
					translation && translation.text !== item.text ? translation?.text : '',
				] as const;
			})
			.filter(([, text]) => Boolean(text))
	);
}

type StarlightSidebarConfig = NonNullable<Parameters<typeof starlight>[0]['sidebar']>;

/** Generate a Starlight sidebar config object from our existing `nav.ts` files. */
export function makeSidebar(): StarlightSidebarConfig {
	return navTranslations.en.reduce((sidebar, item) => {
		if ('header' in item) {
			sidebar.push({
				label: item.text,
				translations: getTranslations(item),
				items: [],
			});
		} else {
			const group = sidebar.at(-1);
			if (group && 'items' in group) {
				group.items.push({
					label: item.text,
					link: item.slug,
					translations: getTranslations(item),
				});
			}
		}
		return sidebar;
	}, [] as StarlightSidebarConfig);
}
