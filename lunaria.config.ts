import { defineConfig } from '@lunariajs/core/config';

export default defineConfig({
	repository: {
		name: 'withastro/docs',
	},
	sourceLocale: {
		label: 'English',
		lang: 'en',
		parameters: {
			tag: 'en',
		},
	},
	locales: [
		{
			label: 'العربية',
			lang: 'ar',
			parameters: {
				tag: 'ar',
			},
		},
		{
			label: 'Deutsch',
			lang: 'de',
			parameters: {
				tag: 'de',
			},
		},
		{
			label: 'Español',
			lang: 'es',
			parameters: {
				tag: 'es',
			},
		},
		{
			label: 'Français',
			lang: 'fr',
			parameters: {
				tag: 'fr',
			},
		},
		{
			label: 'हिन्दी',
			lang: 'hi',
			parameters: {
				tag: 'hi',
			},
		},
		{
			label: 'Italiano',
			lang: 'it',
			parameters: {
				tag: 'it',
			},
		},
		{
			label: '日本語',
			lang: 'ja',
			parameters: {
				tag: 'ja',
			},
		},
		{
			label: '한국어',
			lang: 'ko',
			parameters: {
				tag: 'ko',
			},
		},
		{
			label: 'Polski',
			lang: 'pl',
			parameters: {
				tag: 'pl',
			},
		},
		{
			label: 'Português do Brasil',
			lang: 'pt-br',
			parameters: {
				tag: 'pt-BR',
			},
		},
		{
			label: 'Русский',
			lang: 'ru',
			parameters: {
				tag: 'ru',
			},
		},
		{
			label: '简体中文',
			lang: 'zh-cn',
			parameters: {
				tag: 'zh-CN',
			},
		},
		{
			label: '正體中文',
			lang: 'zh-tw',
			parameters: {
				tag: 'zh-TW',
			},
		},
	],
	files: [
		{
			include: ['src/content/i18n/en.yml'],
			pattern: 'src/content/i18n/@tag.yml',
			type: 'dictionary',
		},
		{
			include: ['src/content/nav/en.ts'],
			pattern: 'src/content/nav/@tag.ts',
			type: 'dictionary',
		},
		{
			include: ['src/content/docs/en/**/*.(md|mdx)'],
			pattern: 'src/content/docs/@lang/@path',
			type: 'universal',
		},
	],
	tracking: {
		localizableProperty: 'i18nReady',
		ignoredKeywords: [
			'lunaria-ignore',
			'typo',
			'en-only',
			'broken link',
			'i18nReady',
			'i18nIgnore',
		],
	},
});
