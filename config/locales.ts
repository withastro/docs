import type starlight from '@astrojs/starlight';
import { normalizeLangTag } from '../src/util/normalizeLangTag';
import languages, { rtlLanguages } from '../src/languages';

type StarlightLocalesConfig = NonNullable<Parameters<typeof starlight>[0]['locales']>;

export function makeLocalesConfig(): StarlightLocalesConfig {
	return Object.fromEntries(
		Object.entries(languages).map(([locale, label]) => [
			locale,
			{ label, lang: normalizeLangTag(locale), dir: rtlLanguages.has(locale) ? 'rtl' : 'ltr' },
		])
	);
}
