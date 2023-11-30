import starlight from '@astrojs/starlight';
import preact from '@astrojs/preact';
import { defineConfig, sharpImageService } from 'astro/config';
import { makeLocalesConfig } from './config/locales';
import { makeSidebar } from './config/sidebar';

import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';

import { rehypeOptimizeStatic } from './plugins/rehype-optimize-static';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { remarkFallbackLang } from './plugins/remark-fallback-lang';
import { sitemap } from './integrations/sitemap';

/* https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables */
const VERCEL_PREVIEW_SITE =
	process.env.VERCEL_ENV !== 'production' &&
	process.env.VERCEL_URL &&
	`https://${process.env.VERCEL_URL}`;

const site = VERCEL_PREVIEW_SITE || 'https://docs.astro.build/';

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [
		preact({ compat: true }),
		starlight({
			title: 'Docs',
      customCss: ['./src/styles/custom.css'],
			logo: {
				light: './src/assets/astro-logo-light.svg',
				dark: './src/assets/astro-logo-dark.svg',
				alt: 'Astro',
			},
      components: {
        Head: './src/components/starlight/Head.astro',
        MarkdownContent: './src/components/starlight/MarkdownContent.astro',
        MobileTableOfContents: './src/components/starlight/MobileTableOfContents.astro',
        TableOfContents: './src/components/starlight/TableOfContents.astro',
        PageSidebar: './src/components/starlight/PageSidebar.astro',
        Pagination: './src/components/starlight/Pagination.astro',
        SiteTitle: './src/components/starlight/SiteTitle.astro',
        Search: './src/components/starlight/Search.astro',
        Sidebar: './src/components/starlight/Sidebar.astro'
      },
      editLink: {
        baseUrl: 'https://github.com/withastro/docs/edit/main'
      },
			defaultLocale: 'en',
			locales: makeLocalesConfig(),
			sidebar: makeSidebar(),
			social: {
				github: 'https://github.com/withastro/astro',
				discord: 'https://astro.build/chat',
			},
      pagefind: false
		}),
    sitemap()
	],
  trailingSlash: 'always',
	scopedStyleStrategy: 'where',
	compressHTML: false,
	markdown: {
		// Override with our own config
		smartypants: false,
		remarkPlugins: [
			[remarkSmartypants, { dashes: false }],
			// Add our custom plugin that marks links to fallback language pages
			remarkFallbackLang(),
		],
		rehypePlugins: [
			rehypeSlug,
			// Tweak GFM task list syntax
			rehypeTasklistEnhancer(),
			// Collapse static parts of the hast to html
			rehypeOptimizeStatic,
		],
	},
	image: {
		domains: ['avatars.githubusercontent.com'],
		service: sharpImageService(),
	},
});
