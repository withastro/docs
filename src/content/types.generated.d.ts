declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		typeof entryMap[C][keyof typeof entryMap[C]];
	export function collectionToPaths<C extends keyof typeof entryMap>(
		collection: C
	): Promise<import('astro').GetStaticPathsResult>;

	type BaseCollectionConfig<S extends import('astro/zod').ZodRawShape> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: CollectionEntry<keyof typeof entryMap>['slug'];
			collection: string;
			body: string;
			data: import('astro/zod').infer<import('astro/zod').ZodObject<S>>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends import('astro/zod').ZodRawShape>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	export function getEntry<C extends keyof typeof entryMap, E extends keyof typeof entryMap[C]>(
		collection: C,
		entryKey: E
	): Promise<typeof entryMap[C][E]>;
	export function getCollection<
		C extends keyof typeof entryMap,
		E extends keyof typeof entryMap[C]
	>(
		collection: C,
		filter?: (data: typeof entryMap[C][E]) => boolean
	): Promise<typeof entryMap[C][keyof typeof entryMap[C]][]>;
	export function renderEntry<
		C extends keyof typeof entryMap,
		E extends keyof typeof entryMap[C]
	>(entry: {
		collection: C;
		id: E;
	}): Promise<{
		Content: import('astro').MarkdownInstance<{}>['Content'];
		headings: import('astro').MarkdownHeading[];
		injectedFrontmatter: Record<string, any>;
	}>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		import('astro/zod').ZodObject<Required<ContentConfig['collections'][C]>['schema']>
	>;

	const entryMap: {
		"docs": {
"ar/editor-setup.mdx": {
  id: "ar/editor-setup.mdx",
  slug: "ar/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"ar/getting-started.mdx": {
  id: "ar/getting-started.mdx",
  slug: "ar/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"en/comparing-astro-vs-other-tools.mdx": {
  id: "en/comparing-astro-vs-other-tools.mdx",
  slug: "en/comparing-astro-vs-other-tools",
  body: string,
  collection: "docs",
  data: any
},
"en/editor-setup.mdx": {
  id: "en/editor-setup.mdx",
  slug: "en/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"en/getting-started.mdx": {
  id: "en/getting-started.mdx",
  slug: "en/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"en/migrate.mdx": {
  id: "en/migrate.mdx",
  slug: "en/migrate",
  body: string,
  collection: "docs",
  data: any
},
"de/editor-setup.mdx": {
  id: "de/editor-setup.mdx",
  slug: "de/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"de/getting-started.mdx": {
  id: "de/getting-started.mdx",
  slug: "de/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"es/editor-setup.mdx": {
  id: "es/editor-setup.mdx",
  slug: "es/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"es/getting-started.mdx": {
  id: "es/getting-started.mdx",
  slug: "es/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"es/migrate.mdx": {
  id: "es/migrate.mdx",
  slug: "es/migrate",
  body: string,
  collection: "docs",
  data: any
},
"fr/editor-setup.mdx": {
  id: "fr/editor-setup.mdx",
  slug: "fr/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"fr/getting-started.mdx": {
  id: "fr/getting-started.mdx",
  slug: "fr/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/comparing-astro-vs-other-tools.mdx": {
  id: "pt-br/comparing-astro-vs-other-tools.mdx",
  slug: "pt-br/comparing-astro-vs-other-tools",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/editor-setup.mdx": {
  id: "pt-br/editor-setup.mdx",
  slug: "pt-br/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/getting-started.mdx": {
  id: "pt-br/getting-started.mdx",
  slug: "pt-br/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/migrate.mdx": {
  id: "pt-br/migrate.mdx",
  slug: "pt-br/migrate",
  body: string,
  collection: "docs",
  data: any
},
"ja/comparing-astro-vs-other-tools.mdx": {
  id: "ja/comparing-astro-vs-other-tools.mdx",
  slug: "ja/comparing-astro-vs-other-tools",
  body: string,
  collection: "docs",
  data: any
},
"ja/editor-setup.mdx": {
  id: "ja/editor-setup.mdx",
  slug: "ja/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"ja/getting-started.mdx": {
  id: "ja/getting-started.mdx",
  slug: "ja/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"ja/migrate.mdx": {
  id: "ja/migrate.mdx",
  slug: "ja/migrate",
  body: string,
  collection: "docs",
  data: any
},
"ru/getting-started.mdx": {
  id: "ru/getting-started.mdx",
  slug: "ru/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/comparing-astro-vs-other-tools.mdx": {
  id: "zh-cn/comparing-astro-vs-other-tools.mdx",
  slug: "zh-cn/comparing-astro-vs-other-tools",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/editor-setup.mdx": {
  id: "zh-cn/editor-setup.mdx",
  slug: "zh-cn/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/getting-started.mdx": {
  id: "zh-cn/getting-started.mdx",
  slug: "zh-cn/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/migrate.mdx": {
  id: "zh-cn/migrate.mdx",
  slug: "zh-cn/migrate",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/editor-setup.mdx": {
  id: "zh-tw/editor-setup.mdx",
  slug: "zh-tw/editor-setup",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/getting-started.mdx": {
  id: "zh-tw/getting-started.mdx",
  slug: "zh-tw/getting-started",
  body: string,
  collection: "docs",
  data: any
},
"en/concepts/islands.mdx": {
  id: "en/concepts/islands.mdx",
  slug: "en/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"en/concepts/mpa-vs-spa.mdx": {
  id: "en/concepts/mpa-vs-spa.mdx",
  slug: "en/concepts/mpa-vs-spa",
  body: string,
  collection: "docs",
  data: any
},
"en/concepts/why-astro.mdx": {
  id: "en/concepts/why-astro.mdx",
  slug: "en/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"en/core-concepts/astro-components.mdx": {
  id: "en/core-concepts/astro-components.mdx",
  slug: "en/core-concepts/astro-components",
  body: string,
  collection: "docs",
  data: any
},
"en/core-concepts/astro-pages.mdx": {
  id: "en/core-concepts/astro-pages.mdx",
  slug: "en/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"en/core-concepts/endpoints.mdx": {
  id: "en/core-concepts/endpoints.mdx",
  slug: "en/core-concepts/endpoints",
  body: string,
  collection: "docs",
  data: any
},
"en/core-concepts/framework-components.mdx": {
  id: "en/core-concepts/framework-components.mdx",
  slug: "en/core-concepts/framework-components",
  body: string,
  collection: "docs",
  data: any
},
"en/core-concepts/layouts.mdx": {
  id: "en/core-concepts/layouts.mdx",
  slug: "en/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"en/core-concepts/project-structure.mdx": {
  id: "en/core-concepts/project-structure.mdx",
  slug: "en/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"en/core-concepts/routing.mdx": {
  id: "en/core-concepts/routing.mdx",
  slug: "en/core-concepts/routing",
  body: string,
  collection: "docs",
  data: any
},
"en/core-concepts/sharing-state.mdx": {
  id: "en/core-concepts/sharing-state.mdx",
  slug: "en/core-concepts/sharing-state",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/aliases.mdx": {
  id: "en/guides/aliases.mdx",
  slug: "en/guides/aliases",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/client-side-scripts.mdx": {
  id: "en/guides/client-side-scripts.mdx",
  slug: "en/guides/client-side-scripts",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms.mdx": {
  id: "en/guides/cms.mdx",
  slug: "en/guides/cms",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/configuring-astro.mdx": {
  id: "en/guides/configuring-astro.mdx",
  slug: "en/guides/configuring-astro",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/content.mdx": {
  id: "en/guides/content.mdx",
  slug: "en/guides/content",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/data-fetching.mdx": {
  id: "en/guides/data-fetching.mdx",
  slug: "en/guides/data-fetching",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy.mdx": {
  id: "en/guides/deploy.mdx",
  slug: "en/guides/deploy",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/environment-variables.mdx": {
  id: "en/guides/environment-variables.mdx",
  slug: "en/guides/environment-variables",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/fonts.mdx": {
  id: "en/guides/fonts.mdx",
  slug: "en/guides/fonts",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/images.mdx": {
  id: "en/guides/images.mdx",
  slug: "en/guides/images",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/imports.mdx": {
  id: "en/guides/imports.mdx",
  slug: "en/guides/imports",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide.mdx": {
  id: "en/guides/integrations-guide.mdx",
  slug: "en/guides/integrations-guide",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/markdown-content.mdx": {
  id: "en/guides/markdown-content.mdx",
  slug: "en/guides/markdown-content",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/rss.mdx": {
  id: "en/guides/rss.mdx",
  slug: "en/guides/rss",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/server-side-rendering.mdx": {
  id: "en/guides/server-side-rendering.mdx",
  slug: "en/guides/server-side-rendering",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/styling.mdx": {
  id: "en/guides/styling.mdx",
  slug: "en/guides/styling",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/testing.mdx": {
  id: "en/guides/testing.mdx",
  slug: "en/guides/testing",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/troubleshooting.mdx": {
  id: "en/guides/troubleshooting.mdx",
  slug: "en/guides/troubleshooting",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/typescript.mdx": {
  id: "en/guides/typescript.mdx",
  slug: "en/guides/typescript",
  body: string,
  collection: "docs",
  data: any
},
"en/integrations/integrations.mdx": {
  id: "en/integrations/integrations.mdx",
  slug: "en/integrations/integrations",
  body: string,
  collection: "docs",
  data: any
},
"en/install/auto.mdx": {
  id: "en/install/auto.mdx",
  slug: "en/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"en/install/manual.mdx": {
  id: "en/install/manual.mdx",
  slug: "en/install/manual",
  body: string,
  collection: "docs",
  data: any
},
"de/concepts/islands.mdx": {
  id: "de/concepts/islands.mdx",
  slug: "de/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"de/concepts/mpa-vs-spa.mdx": {
  id: "de/concepts/mpa-vs-spa.mdx",
  slug: "de/concepts/mpa-vs-spa",
  body: string,
  collection: "docs",
  data: any
},
"de/concepts/why-astro.mdx": {
  id: "de/concepts/why-astro.mdx",
  slug: "de/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"en/reference/adapter-reference.mdx": {
  id: "en/reference/adapter-reference.mdx",
  slug: "en/reference/adapter-reference",
  body: string,
  collection: "docs",
  data: any
},
"en/reference/api-reference.mdx": {
  id: "en/reference/api-reference.mdx",
  slug: "en/reference/api-reference",
  body: string,
  collection: "docs",
  data: any
},
"en/reference/cli-reference.mdx": {
  id: "en/reference/cli-reference.mdx",
  slug: "en/reference/cli-reference",
  body: string,
  collection: "docs",
  data: any
},
"en/reference/configuration-reference.mdx": {
  id: "en/reference/configuration-reference.mdx",
  slug: "en/reference/configuration-reference",
  body: string,
  collection: "docs",
  data: any
},
"en/reference/directives-reference.mdx": {
  id: "en/reference/directives-reference.mdx",
  slug: "en/reference/directives-reference",
  body: string,
  collection: "docs",
  data: any
},
"en/reference/error-reference.mdx": {
  id: "en/reference/error-reference.mdx",
  slug: "en/reference/error-reference",
  body: string,
  collection: "docs",
  data: any
},
"en/reference/integrations-reference.mdx": {
  id: "en/reference/integrations-reference.mdx",
  slug: "en/reference/integrations-reference",
  body: string,
  collection: "docs",
  data: any
},
"en/reference/publish-to-npm.mdx": {
  id: "en/reference/publish-to-npm.mdx",
  slug: "en/reference/publish-to-npm",
  body: string,
  collection: "docs",
  data: any
},
"de/core-concepts/astro-components.mdx": {
  id: "de/core-concepts/astro-components.mdx",
  slug: "de/core-concepts/astro-components",
  body: string,
  collection: "docs",
  data: any
},
"de/core-concepts/astro-pages.mdx": {
  id: "de/core-concepts/astro-pages.mdx",
  slug: "de/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"de/core-concepts/framework-components.mdx": {
  id: "de/core-concepts/framework-components.mdx",
  slug: "de/core-concepts/framework-components",
  body: string,
  collection: "docs",
  data: any
},
"de/core-concepts/layouts.mdx": {
  id: "de/core-concepts/layouts.mdx",
  slug: "de/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"de/core-concepts/project-structure.mdx": {
  id: "de/core-concepts/project-structure.mdx",
  slug: "de/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"de/core-concepts/routing.mdx": {
  id: "de/core-concepts/routing.mdx",
  slug: "de/core-concepts/routing",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/aliases.mdx": {
  id: "de/guides/aliases.mdx",
  slug: "de/guides/aliases",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/cms.mdx": {
  id: "de/guides/cms.mdx",
  slug: "de/guides/cms",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/configuring-astro.mdx": {
  id: "de/guides/configuring-astro.mdx",
  slug: "de/guides/configuring-astro",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/data-fetching.mdx": {
  id: "de/guides/data-fetching.mdx",
  slug: "de/guides/data-fetching",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/deploy.mdx": {
  id: "de/guides/deploy.mdx",
  slug: "de/guides/deploy",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/fonts.mdx": {
  id: "de/guides/fonts.mdx",
  slug: "de/guides/fonts",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/integrations-guide.mdx": {
  id: "de/guides/integrations-guide.mdx",
  slug: "de/guides/integrations-guide",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/markdown-content.mdx": {
  id: "de/guides/markdown-content.mdx",
  slug: "de/guides/markdown-content",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/rss.mdx": {
  id: "de/guides/rss.mdx",
  slug: "de/guides/rss",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/server-side-rendering.mdx": {
  id: "de/guides/server-side-rendering.mdx",
  slug: "de/guides/server-side-rendering",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/testing.mdx": {
  id: "de/guides/testing.mdx",
  slug: "de/guides/testing",
  body: string,
  collection: "docs",
  data: any
},
"de/install/auto.mdx": {
  id: "de/install/auto.mdx",
  slug: "de/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"de/install/manual.mdx": {
  id: "de/install/manual.mdx",
  slug: "de/install/manual",
  body: string,
  collection: "docs",
  data: any
},
"de/integrations/integrations.mdx": {
  id: "de/integrations/integrations.mdx",
  slug: "de/integrations/integrations",
  body: string,
  collection: "docs",
  data: any
},
"de/reference/configuration-reference.mdx": {
  id: "de/reference/configuration-reference.mdx",
  slug: "de/reference/configuration-reference",
  body: string,
  collection: "docs",
  data: any
},
"es/concepts/islands.mdx": {
  id: "es/concepts/islands.mdx",
  slug: "es/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"es/concepts/mpa-vs-spa.mdx": {
  id: "es/concepts/mpa-vs-spa.mdx",
  slug: "es/concepts/mpa-vs-spa",
  body: string,
  collection: "docs",
  data: any
},
"es/concepts/why-astro.mdx": {
  id: "es/concepts/why-astro.mdx",
  slug: "es/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"es/core-concepts/astro-components.mdx": {
  id: "es/core-concepts/astro-components.mdx",
  slug: "es/core-concepts/astro-components",
  body: string,
  collection: "docs",
  data: any
},
"es/core-concepts/astro-pages.mdx": {
  id: "es/core-concepts/astro-pages.mdx",
  slug: "es/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"es/core-concepts/endpoints.mdx": {
  id: "es/core-concepts/endpoints.mdx",
  slug: "es/core-concepts/endpoints",
  body: string,
  collection: "docs",
  data: any
},
"es/core-concepts/framework-components.mdx": {
  id: "es/core-concepts/framework-components.mdx",
  slug: "es/core-concepts/framework-components",
  body: string,
  collection: "docs",
  data: any
},
"es/core-concepts/layouts.mdx": {
  id: "es/core-concepts/layouts.mdx",
  slug: "es/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"es/core-concepts/project-structure.mdx": {
  id: "es/core-concepts/project-structure.mdx",
  slug: "es/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"es/core-concepts/routing.mdx": {
  id: "es/core-concepts/routing.mdx",
  slug: "es/core-concepts/routing",
  body: string,
  collection: "docs",
  data: any
},
"es/core-concepts/sharing-state.mdx": {
  id: "es/core-concepts/sharing-state.mdx",
  slug: "es/core-concepts/sharing-state",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/aliases.mdx": {
  id: "es/guides/aliases.mdx",
  slug: "es/guides/aliases",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/cms.mdx": {
  id: "es/guides/cms.mdx",
  slug: "es/guides/cms",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/configuring-astro.mdx": {
  id: "es/guides/configuring-astro.mdx",
  slug: "es/guides/configuring-astro",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/content.mdx": {
  id: "es/guides/content.mdx",
  slug: "es/guides/content",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/data-fetching.mdx": {
  id: "es/guides/data-fetching.mdx",
  slug: "es/guides/data-fetching",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy.mdx": {
  id: "es/guides/deploy.mdx",
  slug: "es/guides/deploy",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/environment-variables.mdx": {
  id: "es/guides/environment-variables.mdx",
  slug: "es/guides/environment-variables",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/fonts.mdx": {
  id: "es/guides/fonts.mdx",
  slug: "es/guides/fonts",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/images.mdx": {
  id: "es/guides/images.mdx",
  slug: "es/guides/images",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/imports.mdx": {
  id: "es/guides/imports.mdx",
  slug: "es/guides/imports",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/integrations-guide.mdx": {
  id: "es/guides/integrations-guide.mdx",
  slug: "es/guides/integrations-guide",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/markdown-content.mdx": {
  id: "es/guides/markdown-content.mdx",
  slug: "es/guides/markdown-content",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/rss.mdx": {
  id: "es/guides/rss.mdx",
  slug: "es/guides/rss",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/server-side-rendering.mdx": {
  id: "es/guides/server-side-rendering.mdx",
  slug: "es/guides/server-side-rendering",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/styling.mdx": {
  id: "es/guides/styling.mdx",
  slug: "es/guides/styling",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/troubleshooting.mdx": {
  id: "es/guides/troubleshooting.mdx",
  slug: "es/guides/troubleshooting",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/typescript.mdx": {
  id: "es/guides/typescript.mdx",
  slug: "es/guides/typescript",
  body: string,
  collection: "docs",
  data: any
},
"es/install/auto.mdx": {
  id: "es/install/auto.mdx",
  slug: "es/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"es/install/manual.mdx": {
  id: "es/install/manual.mdx",
  slug: "es/install/manual",
  body: string,
  collection: "docs",
  data: any
},
"es/integrations/integrations.mdx": {
  id: "es/integrations/integrations.mdx",
  slug: "es/integrations/integrations",
  body: string,
  collection: "docs",
  data: any
},
"es/reference/adapter-reference.mdx": {
  id: "es/reference/adapter-reference.mdx",
  slug: "es/reference/adapter-reference",
  body: string,
  collection: "docs",
  data: any
},
"es/reference/api-reference.mdx": {
  id: "es/reference/api-reference.mdx",
  slug: "es/reference/api-reference",
  body: string,
  collection: "docs",
  data: any
},
"es/reference/cli-reference.mdx": {
  id: "es/reference/cli-reference.mdx",
  slug: "es/reference/cli-reference",
  body: string,
  collection: "docs",
  data: any
},
"es/reference/configuration-reference.mdx": {
  id: "es/reference/configuration-reference.mdx",
  slug: "es/reference/configuration-reference",
  body: string,
  collection: "docs",
  data: any
},
"es/reference/directives-reference.mdx": {
  id: "es/reference/directives-reference.mdx",
  slug: "es/reference/directives-reference",
  body: string,
  collection: "docs",
  data: any
},
"es/reference/integrations-reference.mdx": {
  id: "es/reference/integrations-reference.mdx",
  slug: "es/reference/integrations-reference",
  body: string,
  collection: "docs",
  data: any
},
"es/reference/publish-to-npm.mdx": {
  id: "es/reference/publish-to-npm.mdx",
  slug: "es/reference/publish-to-npm",
  body: string,
  collection: "docs",
  data: any
},
"fr/concepts/islands.mdx": {
  id: "fr/concepts/islands.mdx",
  slug: "fr/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"fr/concepts/mpa-vs-spa.mdx": {
  id: "fr/concepts/mpa-vs-spa.mdx",
  slug: "fr/concepts/mpa-vs-spa",
  body: string,
  collection: "docs",
  data: any
},
"fr/concepts/why-astro.mdx": {
  id: "fr/concepts/why-astro.mdx",
  slug: "fr/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"fr/core-concepts/astro-components.mdx": {
  id: "fr/core-concepts/astro-components.mdx",
  slug: "fr/core-concepts/astro-components",
  body: string,
  collection: "docs",
  data: any
},
"fr/core-concepts/astro-pages.mdx": {
  id: "fr/core-concepts/astro-pages.mdx",
  slug: "fr/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"fr/core-concepts/endpoints.mdx": {
  id: "fr/core-concepts/endpoints.mdx",
  slug: "fr/core-concepts/endpoints",
  body: string,
  collection: "docs",
  data: any
},
"fr/core-concepts/framework-components.mdx": {
  id: "fr/core-concepts/framework-components.mdx",
  slug: "fr/core-concepts/framework-components",
  body: string,
  collection: "docs",
  data: any
},
"fr/core-concepts/layouts.mdx": {
  id: "fr/core-concepts/layouts.mdx",
  slug: "fr/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"fr/core-concepts/project-structure.mdx": {
  id: "fr/core-concepts/project-structure.mdx",
  slug: "fr/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"fr/core-concepts/routing.mdx": {
  id: "fr/core-concepts/routing.mdx",
  slug: "fr/core-concepts/routing",
  body: string,
  collection: "docs",
  data: any
},
"fr/core-concepts/sharing-state.mdx": {
  id: "fr/core-concepts/sharing-state.mdx",
  slug: "fr/core-concepts/sharing-state",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/aliases.mdx": {
  id: "fr/guides/aliases.mdx",
  slug: "fr/guides/aliases",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/configuring-astro.mdx": {
  id: "fr/guides/configuring-astro.mdx",
  slug: "fr/guides/configuring-astro",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/data-fetching.mdx": {
  id: "fr/guides/data-fetching.mdx",
  slug: "fr/guides/data-fetching",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/deploy.mdx": {
  id: "fr/guides/deploy.mdx",
  slug: "fr/guides/deploy",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/environment-variables.mdx": {
  id: "fr/guides/environment-variables.mdx",
  slug: "fr/guides/environment-variables",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/fonts.mdx": {
  id: "fr/guides/fonts.mdx",
  slug: "fr/guides/fonts",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/imports.mdx": {
  id: "fr/guides/imports.mdx",
  slug: "fr/guides/imports",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/integrations-guide.mdx": {
  id: "fr/guides/integrations-guide.mdx",
  slug: "fr/guides/integrations-guide",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/markdown-content.mdx": {
  id: "fr/guides/markdown-content.mdx",
  slug: "fr/guides/markdown-content",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/rss.mdx": {
  id: "fr/guides/rss.mdx",
  slug: "fr/guides/rss",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/server-side-rendering.mdx": {
  id: "fr/guides/server-side-rendering.mdx",
  slug: "fr/guides/server-side-rendering",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/styling.mdx": {
  id: "fr/guides/styling.mdx",
  slug: "fr/guides/styling",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/troubleshooting.mdx": {
  id: "fr/guides/troubleshooting.mdx",
  slug: "fr/guides/troubleshooting",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/typescript.mdx": {
  id: "fr/guides/typescript.mdx",
  slug: "fr/guides/typescript",
  body: string,
  collection: "docs",
  data: any
},
"fr/install/auto.mdx": {
  id: "fr/install/auto.mdx",
  slug: "fr/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"fr/install/manual.mdx": {
  id: "fr/install/manual.mdx",
  slug: "fr/install/manual",
  body: string,
  collection: "docs",
  data: any
},
"fr/integrations/integrations.mdx": {
  id: "fr/integrations/integrations.mdx",
  slug: "fr/integrations/integrations",
  body: string,
  collection: "docs",
  data: any
},
"fr/reference/configuration-reference.mdx": {
  id: "fr/reference/configuration-reference.mdx",
  slug: "fr/reference/configuration-reference",
  body: string,
  collection: "docs",
  data: any
},
"fr/reference/publish-to-npm.mdx": {
  id: "fr/reference/publish-to-npm.mdx",
  slug: "fr/reference/publish-to-npm",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/concepts/islands.mdx": {
  id: "pt-br/concepts/islands.mdx",
  slug: "pt-br/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/concepts/mpa-vs-spa.mdx": {
  id: "pt-br/concepts/mpa-vs-spa.mdx",
  slug: "pt-br/concepts/mpa-vs-spa",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/concepts/why-astro.mdx": {
  id: "pt-br/concepts/why-astro.mdx",
  slug: "pt-br/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/core-concepts/astro-components.mdx": {
  id: "pt-br/core-concepts/astro-components.mdx",
  slug: "pt-br/core-concepts/astro-components",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/core-concepts/astro-pages.mdx": {
  id: "pt-br/core-concepts/astro-pages.mdx",
  slug: "pt-br/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/core-concepts/endpoints.mdx": {
  id: "pt-br/core-concepts/endpoints.mdx",
  slug: "pt-br/core-concepts/endpoints",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/core-concepts/framework-components.mdx": {
  id: "pt-br/core-concepts/framework-components.mdx",
  slug: "pt-br/core-concepts/framework-components",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/core-concepts/layouts.mdx": {
  id: "pt-br/core-concepts/layouts.mdx",
  slug: "pt-br/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/core-concepts/project-structure.mdx": {
  id: "pt-br/core-concepts/project-structure.mdx",
  slug: "pt-br/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/core-concepts/routing.mdx": {
  id: "pt-br/core-concepts/routing.mdx",
  slug: "pt-br/core-concepts/routing",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/core-concepts/sharing-state.mdx": {
  id: "pt-br/core-concepts/sharing-state.mdx",
  slug: "pt-br/core-concepts/sharing-state",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/aliases.mdx": {
  id: "pt-br/guides/aliases.mdx",
  slug: "pt-br/guides/aliases",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/configuring-astro.mdx": {
  id: "pt-br/guides/configuring-astro.mdx",
  slug: "pt-br/guides/configuring-astro",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/data-fetching.mdx": {
  id: "pt-br/guides/data-fetching.mdx",
  slug: "pt-br/guides/data-fetching",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy.mdx": {
  id: "pt-br/guides/deploy.mdx",
  slug: "pt-br/guides/deploy",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/environment-variables.mdx": {
  id: "pt-br/guides/environment-variables.mdx",
  slug: "pt-br/guides/environment-variables",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/fonts.mdx": {
  id: "pt-br/guides/fonts.mdx",
  slug: "pt-br/guides/fonts",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/images.mdx": {
  id: "pt-br/guides/images.mdx",
  slug: "pt-br/guides/images",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/imports.mdx": {
  id: "pt-br/guides/imports.mdx",
  slug: "pt-br/guides/imports",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/integrations-guide.mdx": {
  id: "pt-br/guides/integrations-guide.mdx",
  slug: "pt-br/guides/integrations-guide",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/markdown-content.mdx": {
  id: "pt-br/guides/markdown-content.mdx",
  slug: "pt-br/guides/markdown-content",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/rss.mdx": {
  id: "pt-br/guides/rss.mdx",
  slug: "pt-br/guides/rss",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/server-side-rendering.mdx": {
  id: "pt-br/guides/server-side-rendering.mdx",
  slug: "pt-br/guides/server-side-rendering",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/styling.mdx": {
  id: "pt-br/guides/styling.mdx",
  slug: "pt-br/guides/styling",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/testing.mdx": {
  id: "pt-br/guides/testing.mdx",
  slug: "pt-br/guides/testing",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/troubleshooting.mdx": {
  id: "pt-br/guides/troubleshooting.mdx",
  slug: "pt-br/guides/troubleshooting",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/typescript.mdx": {
  id: "pt-br/guides/typescript.mdx",
  slug: "pt-br/guides/typescript",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/install/auto.mdx": {
  id: "pt-br/install/auto.mdx",
  slug: "pt-br/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/install/manual.mdx": {
  id: "pt-br/install/manual.mdx",
  slug: "pt-br/install/manual",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/integrations/integrations.mdx": {
  id: "pt-br/integrations/integrations.mdx",
  slug: "pt-br/integrations/integrations",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/reference/adapter-reference.mdx": {
  id: "pt-br/reference/adapter-reference.mdx",
  slug: "pt-br/reference/adapter-reference",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/reference/api-reference.mdx": {
  id: "pt-br/reference/api-reference.mdx",
  slug: "pt-br/reference/api-reference",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/reference/cli-reference.mdx": {
  id: "pt-br/reference/cli-reference.mdx",
  slug: "pt-br/reference/cli-reference",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/reference/configuration-reference.mdx": {
  id: "pt-br/reference/configuration-reference.mdx",
  slug: "pt-br/reference/configuration-reference",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/reference/directives-reference.mdx": {
  id: "pt-br/reference/directives-reference.mdx",
  slug: "pt-br/reference/directives-reference",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/reference/integrations-reference.mdx": {
  id: "pt-br/reference/integrations-reference.mdx",
  slug: "pt-br/reference/integrations-reference",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/reference/publish-to-npm.mdx": {
  id: "pt-br/reference/publish-to-npm.mdx",
  slug: "pt-br/reference/publish-to-npm",
  body: string,
  collection: "docs",
  data: any
},
"ja/concepts/islands.mdx": {
  id: "ja/concepts/islands.mdx",
  slug: "ja/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"ja/concepts/mpa-vs-spa.mdx": {
  id: "ja/concepts/mpa-vs-spa.mdx",
  slug: "ja/concepts/mpa-vs-spa",
  body: string,
  collection: "docs",
  data: any
},
"ja/concepts/why-astro.mdx": {
  id: "ja/concepts/why-astro.mdx",
  slug: "ja/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"ja/core-concepts/astro-components.mdx": {
  id: "ja/core-concepts/astro-components.mdx",
  slug: "ja/core-concepts/astro-components",
  body: string,
  collection: "docs",
  data: any
},
"ja/core-concepts/astro-pages.mdx": {
  id: "ja/core-concepts/astro-pages.mdx",
  slug: "ja/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"ja/core-concepts/endpoints.mdx": {
  id: "ja/core-concepts/endpoints.mdx",
  slug: "ja/core-concepts/endpoints",
  body: string,
  collection: "docs",
  data: any
},
"ja/core-concepts/framework-components.mdx": {
  id: "ja/core-concepts/framework-components.mdx",
  slug: "ja/core-concepts/framework-components",
  body: string,
  collection: "docs",
  data: any
},
"ja/core-concepts/layouts.mdx": {
  id: "ja/core-concepts/layouts.mdx",
  slug: "ja/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"ja/core-concepts/project-structure.mdx": {
  id: "ja/core-concepts/project-structure.mdx",
  slug: "ja/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"ja/core-concepts/routing.mdx": {
  id: "ja/core-concepts/routing.mdx",
  slug: "ja/core-concepts/routing",
  body: string,
  collection: "docs",
  data: any
},
"ja/install/auto.mdx": {
  id: "ja/install/auto.mdx",
  slug: "ja/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"ja/install/manual.mdx": {
  id: "ja/install/manual.mdx",
  slug: "ja/install/manual",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/aliases.mdx": {
  id: "ja/guides/aliases.mdx",
  slug: "ja/guides/aliases",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/cms.mdx": {
  id: "ja/guides/cms.mdx",
  slug: "ja/guides/cms",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/configuring-astro.mdx": {
  id: "ja/guides/configuring-astro.mdx",
  slug: "ja/guides/configuring-astro",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/data-fetching.mdx": {
  id: "ja/guides/data-fetching.mdx",
  slug: "ja/guides/data-fetching",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/deploy.mdx": {
  id: "ja/guides/deploy.mdx",
  slug: "ja/guides/deploy",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/environment-variables.mdx": {
  id: "ja/guides/environment-variables.mdx",
  slug: "ja/guides/environment-variables",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/fonts.mdx": {
  id: "ja/guides/fonts.mdx",
  slug: "ja/guides/fonts",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/imports.mdx": {
  id: "ja/guides/imports.mdx",
  slug: "ja/guides/imports",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/markdown-content.mdx": {
  id: "ja/guides/markdown-content.mdx",
  slug: "ja/guides/markdown-content",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/rss.mdx": {
  id: "ja/guides/rss.mdx",
  slug: "ja/guides/rss",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/server-side-rendering.mdx": {
  id: "ja/guides/server-side-rendering.mdx",
  slug: "ja/guides/server-side-rendering",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/styling.mdx": {
  id: "ja/guides/styling.mdx",
  slug: "ja/guides/styling",
  body: string,
  collection: "docs",
  data: any
},
"ja/guides/troubleshooting.mdx": {
  id: "ja/guides/troubleshooting.mdx",
  slug: "ja/guides/troubleshooting",
  body: string,
  collection: "docs",
  data: any
},
"ja/integrations/integrations.mdx": {
  id: "ja/integrations/integrations.mdx",
  slug: "ja/integrations/integrations",
  body: string,
  collection: "docs",
  data: any
},
"ja/reference/cli-reference.mdx": {
  id: "ja/reference/cli-reference.mdx",
  slug: "ja/reference/cli-reference",
  body: string,
  collection: "docs",
  data: any
},
"ja/reference/configuration-reference.mdx": {
  id: "ja/reference/configuration-reference.mdx",
  slug: "ja/reference/configuration-reference",
  body: string,
  collection: "docs",
  data: any
},
"ru/concepts/islands.mdx": {
  id: "ru/concepts/islands.mdx",
  slug: "ru/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"ru/concepts/mpa-vs-spa.mdx": {
  id: "ru/concepts/mpa-vs-spa.mdx",
  slug: "ru/concepts/mpa-vs-spa",
  body: string,
  collection: "docs",
  data: any
},
"ru/concepts/why-astro.mdx": {
  id: "ru/concepts/why-astro.mdx",
  slug: "ru/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"ru/core-concepts/astro-pages.mdx": {
  id: "ru/core-concepts/astro-pages.mdx",
  slug: "ru/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"ru/core-concepts/layouts.mdx": {
  id: "ru/core-concepts/layouts.mdx",
  slug: "ru/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"ru/core-concepts/project-structure.mdx": {
  id: "ru/core-concepts/project-structure.mdx",
  slug: "ru/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"ru/guides/markdown-content.mdx": {
  id: "ru/guides/markdown-content.mdx",
  slug: "ru/guides/markdown-content",
  body: string,
  collection: "docs",
  data: any
},
"ru/install/auto.mdx": {
  id: "ru/install/auto.mdx",
  slug: "ru/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/concepts/islands.mdx": {
  id: "zh-cn/concepts/islands.mdx",
  slug: "zh-cn/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/concepts/mpa-vs-spa.mdx": {
  id: "zh-cn/concepts/mpa-vs-spa.mdx",
  slug: "zh-cn/concepts/mpa-vs-spa",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/concepts/why-astro.mdx": {
  id: "zh-cn/concepts/why-astro.mdx",
  slug: "zh-cn/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/core-concepts/astro-components.mdx": {
  id: "zh-cn/core-concepts/astro-components.mdx",
  slug: "zh-cn/core-concepts/astro-components",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/core-concepts/astro-pages.mdx": {
  id: "zh-cn/core-concepts/astro-pages.mdx",
  slug: "zh-cn/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/core-concepts/endpoints.mdx": {
  id: "zh-cn/core-concepts/endpoints.mdx",
  slug: "zh-cn/core-concepts/endpoints",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/core-concepts/framework-components.mdx": {
  id: "zh-cn/core-concepts/framework-components.mdx",
  slug: "zh-cn/core-concepts/framework-components",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/core-concepts/layouts.mdx": {
  id: "zh-cn/core-concepts/layouts.mdx",
  slug: "zh-cn/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/core-concepts/project-structure.mdx": {
  id: "zh-cn/core-concepts/project-structure.mdx",
  slug: "zh-cn/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/core-concepts/routing.mdx": {
  id: "zh-cn/core-concepts/routing.mdx",
  slug: "zh-cn/core-concepts/routing",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/core-concepts/sharing-state.mdx": {
  id: "zh-cn/core-concepts/sharing-state.mdx",
  slug: "zh-cn/core-concepts/sharing-state",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/aliases.mdx": {
  id: "zh-cn/guides/aliases.mdx",
  slug: "zh-cn/guides/aliases",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/cms.mdx": {
  id: "zh-cn/guides/cms.mdx",
  slug: "zh-cn/guides/cms",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/configuring-astro.mdx": {
  id: "zh-cn/guides/configuring-astro.mdx",
  slug: "zh-cn/guides/configuring-astro",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/data-fetching.mdx": {
  id: "zh-cn/guides/data-fetching.mdx",
  slug: "zh-cn/guides/data-fetching",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/deploy.mdx": {
  id: "zh-cn/guides/deploy.mdx",
  slug: "zh-cn/guides/deploy",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/environment-variables.mdx": {
  id: "zh-cn/guides/environment-variables.mdx",
  slug: "zh-cn/guides/environment-variables",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/fonts.mdx": {
  id: "zh-cn/guides/fonts.mdx",
  slug: "zh-cn/guides/fonts",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/images.mdx": {
  id: "zh-cn/guides/images.mdx",
  slug: "zh-cn/guides/images",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/imports.mdx": {
  id: "zh-cn/guides/imports.mdx",
  slug: "zh-cn/guides/imports",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/integrations-guide.mdx": {
  id: "zh-cn/guides/integrations-guide.mdx",
  slug: "zh-cn/guides/integrations-guide",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/markdown-content.mdx": {
  id: "zh-cn/guides/markdown-content.mdx",
  slug: "zh-cn/guides/markdown-content",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/rss.mdx": {
  id: "zh-cn/guides/rss.mdx",
  slug: "zh-cn/guides/rss",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/server-side-rendering.mdx": {
  id: "zh-cn/guides/server-side-rendering.mdx",
  slug: "zh-cn/guides/server-side-rendering",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/styling.mdx": {
  id: "zh-cn/guides/styling.mdx",
  slug: "zh-cn/guides/styling",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/troubleshooting.mdx": {
  id: "zh-cn/guides/troubleshooting.mdx",
  slug: "zh-cn/guides/troubleshooting",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/typescript.mdx": {
  id: "zh-cn/guides/typescript.mdx",
  slug: "zh-cn/guides/typescript",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/install/auto.mdx": {
  id: "zh-cn/install/auto.mdx",
  slug: "zh-cn/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/install/manual.mdx": {
  id: "zh-cn/install/manual.mdx",
  slug: "zh-cn/install/manual",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/integrations/integrations.mdx": {
  id: "zh-cn/integrations/integrations.mdx",
  slug: "zh-cn/integrations/integrations",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/reference/adapter-reference.mdx": {
  id: "zh-cn/reference/adapter-reference.mdx",
  slug: "zh-cn/reference/adapter-reference",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/reference/api-reference.mdx": {
  id: "zh-cn/reference/api-reference.mdx",
  slug: "zh-cn/reference/api-reference",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/reference/cli-reference.mdx": {
  id: "zh-cn/reference/cli-reference.mdx",
  slug: "zh-cn/reference/cli-reference",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/reference/configuration-reference.mdx": {
  id: "zh-cn/reference/configuration-reference.mdx",
  slug: "zh-cn/reference/configuration-reference",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/reference/directives-reference.mdx": {
  id: "zh-cn/reference/directives-reference.mdx",
  slug: "zh-cn/reference/directives-reference",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/reference/integrations-reference.mdx": {
  id: "zh-cn/reference/integrations-reference.mdx",
  slug: "zh-cn/reference/integrations-reference",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/reference/publish-to-npm.mdx": {
  id: "zh-cn/reference/publish-to-npm.mdx",
  slug: "zh-cn/reference/publish-to-npm",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/concepts/islands.mdx": {
  id: "zh-tw/concepts/islands.mdx",
  slug: "zh-tw/concepts/islands",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/concepts/why-astro.mdx": {
  id: "zh-tw/concepts/why-astro.mdx",
  slug: "zh-tw/concepts/why-astro",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/core-concepts/astro-pages.mdx": {
  id: "zh-tw/core-concepts/astro-pages.mdx",
  slug: "zh-tw/core-concepts/astro-pages",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/core-concepts/layouts.mdx": {
  id: "zh-tw/core-concepts/layouts.mdx",
  slug: "zh-tw/core-concepts/layouts",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/core-concepts/project-structure.mdx": {
  id: "zh-tw/core-concepts/project-structure.mdx",
  slug: "zh-tw/core-concepts/project-structure",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/guides/deploy.mdx": {
  id: "zh-tw/guides/deploy.mdx",
  slug: "zh-tw/guides/deploy",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/install/auto.mdx": {
  id: "zh-tw/install/auto.mdx",
  slug: "zh-tw/install/auto",
  body: string,
  collection: "docs",
  data: any
},
"zh-tw/install/manual.mdx": {
  id: "zh-tw/install/manual.mdx",
  slug: "zh-tw/install/manual",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/builderio.mdx": {
  id: "en/guides/cms/builderio.mdx",
  slug: "en/guides/cms/builderio",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/buttercms.mdx": {
  id: "en/guides/cms/buttercms.mdx",
  slug: "en/guides/cms/buttercms",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/contentful.mdx": {
  id: "en/guides/cms/contentful.mdx",
  slug: "en/guides/cms/contentful",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/directus.mdx": {
  id: "en/guides/cms/directus.mdx",
  slug: "en/guides/cms/directus",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/ghost.mdx": {
  id: "en/guides/cms/ghost.mdx",
  slug: "en/guides/cms/ghost",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/netlify-cms.mdx": {
  id: "en/guides/cms/netlify-cms.mdx",
  slug: "en/guides/cms/netlify-cms",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/payload.mdx": {
  id: "en/guides/cms/payload.mdx",
  slug: "en/guides/cms/payload",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/prismic.mdx": {
  id: "en/guides/cms/prismic.mdx",
  slug: "en/guides/cms/prismic",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/sanity.mdx": {
  id: "en/guides/cms/sanity.mdx",
  slug: "en/guides/cms/sanity",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/storyblok.mdx": {
  id: "en/guides/cms/storyblok.mdx",
  slug: "en/guides/cms/storyblok",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/cms/wordpress.mdx": {
  id: "en/guides/cms/wordpress.mdx",
  slug: "en/guides/cms/wordpress",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/alpinejs.mdx": {
  id: "en/guides/integrations-guide/alpinejs.mdx",
  slug: "en/guides/integrations-guide/alpinejs",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/cloudflare.mdx": {
  id: "en/guides/integrations-guide/cloudflare.mdx",
  slug: "en/guides/integrations-guide/cloudflare",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/deno.mdx": {
  id: "en/guides/integrations-guide/deno.mdx",
  slug: "en/guides/integrations-guide/deno",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/image.mdx": {
  id: "en/guides/integrations-guide/image.mdx",
  slug: "en/guides/integrations-guide/image",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/lit.mdx": {
  id: "en/guides/integrations-guide/lit.mdx",
  slug: "en/guides/integrations-guide/lit",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/mdx.mdx": {
  id: "en/guides/integrations-guide/mdx.mdx",
  slug: "en/guides/integrations-guide/mdx",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/netlify.mdx": {
  id: "en/guides/integrations-guide/netlify.mdx",
  slug: "en/guides/integrations-guide/netlify",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/node.mdx": {
  id: "en/guides/integrations-guide/node.mdx",
  slug: "en/guides/integrations-guide/node",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/partytown.mdx": {
  id: "en/guides/integrations-guide/partytown.mdx",
  slug: "en/guides/integrations-guide/partytown",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/preact.mdx": {
  id: "en/guides/integrations-guide/preact.mdx",
  slug: "en/guides/integrations-guide/preact",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/prefetch.mdx": {
  id: "en/guides/integrations-guide/prefetch.mdx",
  slug: "en/guides/integrations-guide/prefetch",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/react.mdx": {
  id: "en/guides/integrations-guide/react.mdx",
  slug: "en/guides/integrations-guide/react",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/sitemap.mdx": {
  id: "en/guides/integrations-guide/sitemap.mdx",
  slug: "en/guides/integrations-guide/sitemap",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/solid-js.mdx": {
  id: "en/guides/integrations-guide/solid-js.mdx",
  slug: "en/guides/integrations-guide/solid-js",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/svelte.mdx": {
  id: "en/guides/integrations-guide/svelte.mdx",
  slug: "en/guides/integrations-guide/svelte",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/tailwind.mdx": {
  id: "en/guides/integrations-guide/tailwind.mdx",
  slug: "en/guides/integrations-guide/tailwind",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/vercel.mdx": {
  id: "en/guides/integrations-guide/vercel.mdx",
  slug: "en/guides/integrations-guide/vercel",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/integrations-guide/vue.mdx": {
  id: "en/guides/integrations-guide/vue.mdx",
  slug: "en/guides/integrations-guide/vue",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/aws.mdx": {
  id: "en/guides/deploy/aws.mdx",
  slug: "en/guides/deploy/aws",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/buddy.mdx": {
  id: "en/guides/deploy/buddy.mdx",
  slug: "en/guides/deploy/buddy",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/cleavr.mdx": {
  id: "en/guides/deploy/cleavr.mdx",
  slug: "en/guides/deploy/cleavr",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/cloudflare.mdx": {
  id: "en/guides/deploy/cloudflare.mdx",
  slug: "en/guides/deploy/cloudflare",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/deno.mdx": {
  id: "en/guides/deploy/deno.mdx",
  slug: "en/guides/deploy/deno",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/edgio.mdx": {
  id: "en/guides/deploy/edgio.mdx",
  slug: "en/guides/deploy/edgio",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/flightcontrol.mdx": {
  id: "en/guides/deploy/flightcontrol.mdx",
  slug: "en/guides/deploy/flightcontrol",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/github.mdx": {
  id: "en/guides/deploy/github.mdx",
  slug: "en/guides/deploy/github",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/gitlab.mdx": {
  id: "en/guides/deploy/gitlab.mdx",
  slug: "en/guides/deploy/gitlab",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/google-cloud.mdx": {
  id: "en/guides/deploy/google-cloud.mdx",
  slug: "en/guides/deploy/google-cloud",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/google-firebase.mdx": {
  id: "en/guides/deploy/google-firebase.mdx",
  slug: "en/guides/deploy/google-firebase",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/heroku.mdx": {
  id: "en/guides/deploy/heroku.mdx",
  slug: "en/guides/deploy/heroku",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/kinsta.mdx": {
  id: "en/guides/deploy/kinsta.mdx",
  slug: "en/guides/deploy/kinsta",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/microsoft-azure.mdx": {
  id: "en/guides/deploy/microsoft-azure.mdx",
  slug: "en/guides/deploy/microsoft-azure",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/netlify.mdx": {
  id: "en/guides/deploy/netlify.mdx",
  slug: "en/guides/deploy/netlify",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/render.mdx": {
  id: "en/guides/deploy/render.mdx",
  slug: "en/guides/deploy/render",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/surge.mdx": {
  id: "en/guides/deploy/surge.mdx",
  slug: "en/guides/deploy/surge",
  body: string,
  collection: "docs",
  data: any
},
"en/guides/deploy/vercel.mdx": {
  id: "en/guides/deploy/vercel.mdx",
  slug: "en/guides/deploy/vercel",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/0-introduction/1.mdx": {
  id: "en/tutorial/0-introduction/1.mdx",
  slug: "en/tutorial/0-introduction/1",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/0-introduction/index.mdx": {
  id: "en/tutorial/0-introduction/index.mdx",
  slug: "en/tutorial/0-introduction/index",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/1-setup/1.mdx": {
  id: "en/tutorial/1-setup/1.mdx",
  slug: "en/tutorial/1-setup/1",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/1-setup/2.mdx": {
  id: "en/tutorial/1-setup/2.mdx",
  slug: "en/tutorial/1-setup/2",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/1-setup/3.mdx": {
  id: "en/tutorial/1-setup/3.mdx",
  slug: "en/tutorial/1-setup/3",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/1-setup/4.mdx": {
  id: "en/tutorial/1-setup/4.mdx",
  slug: "en/tutorial/1-setup/4",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/1-setup/5.mdx": {
  id: "en/tutorial/1-setup/5.mdx",
  slug: "en/tutorial/1-setup/5",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/1-setup/index.mdx": {
  id: "en/tutorial/1-setup/index.mdx",
  slug: "en/tutorial/1-setup/index",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/2-pages/1.mdx": {
  id: "en/tutorial/2-pages/1.mdx",
  slug: "en/tutorial/2-pages/1",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/2-pages/2.mdx": {
  id: "en/tutorial/2-pages/2.mdx",
  slug: "en/tutorial/2-pages/2",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/2-pages/3.mdx": {
  id: "en/tutorial/2-pages/3.mdx",
  slug: "en/tutorial/2-pages/3",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/2-pages/4.mdx": {
  id: "en/tutorial/2-pages/4.mdx",
  slug: "en/tutorial/2-pages/4",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/2-pages/5.mdx": {
  id: "en/tutorial/2-pages/5.mdx",
  slug: "en/tutorial/2-pages/5",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/2-pages/index.mdx": {
  id: "en/tutorial/2-pages/index.mdx",
  slug: "en/tutorial/2-pages/index",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/3-components/1.mdx": {
  id: "en/tutorial/3-components/1.mdx",
  slug: "en/tutorial/3-components/1",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/3-components/2.mdx": {
  id: "en/tutorial/3-components/2.mdx",
  slug: "en/tutorial/3-components/2",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/3-components/3.mdx": {
  id: "en/tutorial/3-components/3.mdx",
  slug: "en/tutorial/3-components/3",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/3-components/4.mdx": {
  id: "en/tutorial/3-components/4.mdx",
  slug: "en/tutorial/3-components/4",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/3-components/index.mdx": {
  id: "en/tutorial/3-components/index.mdx",
  slug: "en/tutorial/3-components/index",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/4-layouts/1.mdx": {
  id: "en/tutorial/4-layouts/1.mdx",
  slug: "en/tutorial/4-layouts/1",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/4-layouts/2.mdx": {
  id: "en/tutorial/4-layouts/2.mdx",
  slug: "en/tutorial/4-layouts/2",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/4-layouts/3.mdx": {
  id: "en/tutorial/4-layouts/3.mdx",
  slug: "en/tutorial/4-layouts/3",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/4-layouts/index.mdx": {
  id: "en/tutorial/4-layouts/index.mdx",
  slug: "en/tutorial/4-layouts/index",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/5-astro-api/1.mdx": {
  id: "en/tutorial/5-astro-api/1.mdx",
  slug: "en/tutorial/5-astro-api/1",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/5-astro-api/2.mdx": {
  id: "en/tutorial/5-astro-api/2.mdx",
  slug: "en/tutorial/5-astro-api/2",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/5-astro-api/3.mdx": {
  id: "en/tutorial/5-astro-api/3.mdx",
  slug: "en/tutorial/5-astro-api/3",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/5-astro-api/4.mdx": {
  id: "en/tutorial/5-astro-api/4.mdx",
  slug: "en/tutorial/5-astro-api/4",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/5-astro-api/index.mdx": {
  id: "en/tutorial/5-astro-api/index.mdx",
  slug: "en/tutorial/5-astro-api/index",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/6-islands/1.mdx": {
  id: "en/tutorial/6-islands/1.mdx",
  slug: "en/tutorial/6-islands/1",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/6-islands/2.mdx": {
  id: "en/tutorial/6-islands/2.mdx",
  slug: "en/tutorial/6-islands/2",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/6-islands/3.mdx": {
  id: "en/tutorial/6-islands/3.mdx",
  slug: "en/tutorial/6-islands/3",
  body: string,
  collection: "docs",
  data: any
},
"en/tutorial/6-islands/index.mdx": {
  id: "en/tutorial/6-islands/index.mdx",
  slug: "en/tutorial/6-islands/index",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/deploy/github.mdx": {
  id: "de/guides/deploy/github.mdx",
  slug: "de/guides/deploy/github",
  body: string,
  collection: "docs",
  data: any
},
"de/guides/deploy/gitlab.mdx": {
  id: "de/guides/deploy/gitlab.mdx",
  slug: "de/guides/deploy/gitlab",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/aws.mdx": {
  id: "es/guides/deploy/aws.mdx",
  slug: "es/guides/deploy/aws",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/buddy.mdx": {
  id: "es/guides/deploy/buddy.mdx",
  slug: "es/guides/deploy/buddy",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/cleavr.mdx": {
  id: "es/guides/deploy/cleavr.mdx",
  slug: "es/guides/deploy/cleavr",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/cloudflare.mdx": {
  id: "es/guides/deploy/cloudflare.mdx",
  slug: "es/guides/deploy/cloudflare",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/deno.mdx": {
  id: "es/guides/deploy/deno.mdx",
  slug: "es/guides/deploy/deno",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/edgio.mdx": {
  id: "es/guides/deploy/edgio.mdx",
  slug: "es/guides/deploy/edgio",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/flightcontrol.mdx": {
  id: "es/guides/deploy/flightcontrol.mdx",
  slug: "es/guides/deploy/flightcontrol",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/github.mdx": {
  id: "es/guides/deploy/github.mdx",
  slug: "es/guides/deploy/github",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/gitlab.mdx": {
  id: "es/guides/deploy/gitlab.mdx",
  slug: "es/guides/deploy/gitlab",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/google-cloud.mdx": {
  id: "es/guides/deploy/google-cloud.mdx",
  slug: "es/guides/deploy/google-cloud",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/google-firebase.mdx": {
  id: "es/guides/deploy/google-firebase.mdx",
  slug: "es/guides/deploy/google-firebase",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/heroku.mdx": {
  id: "es/guides/deploy/heroku.mdx",
  slug: "es/guides/deploy/heroku",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/microsoft-azure.mdx": {
  id: "es/guides/deploy/microsoft-azure.mdx",
  slug: "es/guides/deploy/microsoft-azure",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/netlify.mdx": {
  id: "es/guides/deploy/netlify.mdx",
  slug: "es/guides/deploy/netlify",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/render.mdx": {
  id: "es/guides/deploy/render.mdx",
  slug: "es/guides/deploy/render",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/surge.mdx": {
  id: "es/guides/deploy/surge.mdx",
  slug: "es/guides/deploy/surge",
  body: string,
  collection: "docs",
  data: any
},
"es/guides/deploy/vercel.mdx": {
  id: "es/guides/deploy/vercel.mdx",
  slug: "es/guides/deploy/vercel",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/deploy/github.mdx": {
  id: "fr/guides/deploy/github.mdx",
  slug: "fr/guides/deploy/github",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/deploy/netlify.mdx": {
  id: "fr/guides/deploy/netlify.mdx",
  slug: "fr/guides/deploy/netlify",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/deploy/render.mdx": {
  id: "fr/guides/deploy/render.mdx",
  slug: "fr/guides/deploy/render",
  body: string,
  collection: "docs",
  data: any
},
"fr/guides/deploy/vercel.mdx": {
  id: "fr/guides/deploy/vercel.mdx",
  slug: "fr/guides/deploy/vercel",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/aws.mdx": {
  id: "pt-br/guides/deploy/aws.mdx",
  slug: "pt-br/guides/deploy/aws",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/buddy.mdx": {
  id: "pt-br/guides/deploy/buddy.mdx",
  slug: "pt-br/guides/deploy/buddy",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/github.mdx": {
  id: "pt-br/guides/deploy/github.mdx",
  slug: "pt-br/guides/deploy/github",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/gitlab.mdx": {
  id: "pt-br/guides/deploy/gitlab.mdx",
  slug: "pt-br/guides/deploy/gitlab",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/google-cloud.mdx": {
  id: "pt-br/guides/deploy/google-cloud.mdx",
  slug: "pt-br/guides/deploy/google-cloud",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/google-firebase.mdx": {
  id: "pt-br/guides/deploy/google-firebase.mdx",
  slug: "pt-br/guides/deploy/google-firebase",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/netlify.mdx": {
  id: "pt-br/guides/deploy/netlify.mdx",
  slug: "pt-br/guides/deploy/netlify",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/render.mdx": {
  id: "pt-br/guides/deploy/render.mdx",
  slug: "pt-br/guides/deploy/render",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/surge.mdx": {
  id: "pt-br/guides/deploy/surge.mdx",
  slug: "pt-br/guides/deploy/surge",
  body: string,
  collection: "docs",
  data: any
},
"pt-br/guides/deploy/vercel.mdx": {
  id: "pt-br/guides/deploy/vercel.mdx",
  slug: "pt-br/guides/deploy/vercel",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/deploy/cloudflare.mdx": {
  id: "zh-cn/guides/deploy/cloudflare.mdx",
  slug: "zh-cn/guides/deploy/cloudflare",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/deploy/github.mdx": {
  id: "zh-cn/guides/deploy/github.mdx",
  slug: "zh-cn/guides/deploy/github",
  body: string,
  collection: "docs",
  data: any
},
"zh-cn/guides/deploy/vercel.mdx": {
  id: "zh-cn/guides/deploy/vercel.mdx",
  slug: "zh-cn/guides/deploy/vercel",
  body: string,
  collection: "docs",
  data: any
},
},

	};

	type ContentConfig = never;
}
