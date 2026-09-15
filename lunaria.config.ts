import { defineRendererConfig, html } from '@lunariajs/core';
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
	dashboard: {
		title: 'Astro Docs Translation Status',
		description:
			'Translation progress tracker for the Astro Docs site. See how much has been translated in your language and get involved!',
		site: 'https://i18n.docs.astro.build/',
		basesToHide: ['src/content/docs/en/', 'src/i18n/en/', 'src/content/docs/', 'src/content/'],
		customCss: ['./scripts/lunaria/styles.css'],
		favicon: {
			external: [
				{ link: 'https://docs.astro.build/favicon.ico', type: 'image/x-icon' },
				{ link: 'https://docs.astro.build/favicon.svg', type: 'image/svg+xml' },
			],
		},
		ui: {
			'statusByLocale.heading': 'Translation progress by locale',
			'statusByLocale.outdatedLocalizationLink': 'outdated translation',
			'statusByLocale.incompleteLocalizationLink': 'incomplete translation',
			'statusByLocale.completeLocalization': 'This translation is complete, amazing job! 🎉',
			'statusByFile.heading': 'Translation status by file',
		},
	},
	renderer: defineRendererConfig({
		slots: {
			head: () => html`<meta property="last-build" content="${new Date().toString()}" />`,
			afterTitle: () => html`
				<p>
					If you're interested in helping us translate
					<a href="https://docs.astro.build/">docs.astro.build</a> into one of the languages listed
					below, you've come to the right place! This auto-updating page always lists all the
					content that could use your help right now.
				</p>
				<p>
					Before starting, please read our
					<a href="https://contribute.docs.astro.build/guides/i18n/">i18n Guide</a>
					to learn about our translation process and how you can get involved.
				</p>
			`,
		},
	}),
});
