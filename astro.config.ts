import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { defineConfig, sharpImageService } from 'astro/config';
import { sidebar } from './astro.sidebar';
import { devServerFileWatcher } from './config/integrations/dev-server-file-watcher';
import { sitemap } from './config/integrations/sitemap';
import { localesConfig } from './config/locales';
import { starlightPluginSmokeTest } from './config/plugins/smoke-test';
import { tasklistEnhancerPlugin } from './config/plugins/satteri-tasklist-enhancer';
import { fallbackLangPlugin } from './config/plugins/satteri-fallback-lang';

const previewBranch = process.env.GITHUB_HEAD_REF;
const previewSite = previewBranch
	? `https://${previewBranch}.previews.docs.astro.build/`
	: undefined;

const site = previewSite || 'https://docs.astro.build/';

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [
		devServerFileWatcher([
			'./config/**', // Custom plugins and integrations
			'./astro.sidebar.ts', // Sidebar configuration file
			'./src/content/nav/*.ts', // Sidebar labels
		]),
		starlight({
			title: 'Docs',
			expressiveCode: {
				plugins: [pluginCollapsibleSections()],
			},
			components: {
				EditLink: './src/components/starlight/EditLink.astro',
				Hero: './src/components/starlight/Hero.astro',
				MarkdownContent: './src/components/starlight/MarkdownContent.astro',
				MobileTableOfContents: './src/components/starlight/MobileTableOfContents.astro',
				TableOfContents: './src/components/starlight/TableOfContents.astro',
				PageSidebar: './src/components/starlight/PageSidebar.astro',
				Footer: './src/components/starlight/Footer.astro',
				SiteTitle: './src/components/starlight/SiteTitle.astro',
				Search: './src/components/starlight/Search.astro',
				Sidebar: './src/components/starlight/Sidebar.astro',
				MobileMenuFooter: './src/components/starlight/MobileMenuFooter.astro',
				PageTitle: './src/components/starlight/PageTitle.astro',
			},
			routeMiddleware: './src/routeData.ts',
			editLink: {
				baseUrl: 'https://github.com/withastro/docs/edit/main',
			},
			defaultLocale: 'en',
			locales: localesConfig,
			sidebar,
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/astro' },
				{ icon: 'discord', label: 'Discord', href: 'https://astro.build/chat' },
			],
			pagefind: false,
			head: [
				// Add ICO favicon fallback for Safari.
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon.ico',
						sizes: '32x32',
					},
				},
			],
			disable404Route: true,
			plugins: [starlightPluginSmokeTest()],
		}),
		sitemap(),
	],
	trailingSlash: 'always',
	scopedStyleStrategy: 'where',
	compressHTML: false,
	markdown: {
		processor: satteri({
			features: {
				smartPunctuation: {
					dashes: false,
				},
			},
			hastPlugins: [tasklistEnhancerPlugin()],
			mdastPlugins: [fallbackLangPlugin()],
		}),
	},
	image: {
		domains: ['avatars.githubusercontent.com'],
		service: sharpImageService(),
	},
});
