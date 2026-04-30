import type { AstroConfig } from 'astro';
import type { HookParameters, StarlightConfig } from '@astrojs/starlight/types';

export interface RemarkRehypePluginOptions {
	starlightConfig: Pick<StarlightConfig, 'defaultLocale' | 'locales' | 'markdown'>;
	astroConfig: Pick<AstroConfig, 'root' | 'srcDir'>;
	useTranslations: HookParameters<'config:setup'>['useTranslations'];
	absolutePathToLang: HookParameters<'config:setup'>['absolutePathToLang'];
}
