/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: '由此开始', header: true, type: 'learn', key: 'startHere' },
	{ text: '入门指南', slug: 'getting-started', key: 'getting-started' },
	{ text: '安装', slug: 'install/auto', key: 'install' },
	{ text: '编辑器配置', slug: 'editor-setup', key: 'editor-setup' },
	{ text: '迁移指南', slug: 'migrate', key: 'migrate' },

	{ text: '核心概念', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: '为何选用 Astro', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'MPA vs. SPA', slug: 'concepts/mpa-vs-spa', key: 'concepts/mpa-vs-spa' },
	{ text: 'Astro Islands', slug: 'concepts/islands', key: 'concepts/islands' },

	{ text: '基础教程', header: true, type: 'learn', key: 'basics' },
	{ text: '项目结构', slug: 'core-concepts/project-structure', key: 'core-concepts/project-structure' },
	{ text: '组件', slug: 'core-concepts/astro-components', key: 'core-concepts/astro-components' },
	{ text: '页面', slug: 'core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	{ text: '布局', slug: 'core-concepts/layouts', key: 'core-concepts/layouts' },
	{ text: 'Markdown & MDX', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{ text: '路由', slug: 'core-concepts/routing', key: 'core-concepts/routing' },
	{ text: '静态资源', slug: 'guides/imports', key: 'guides/imports' },
	{ text: '故障排查', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },
	{ text: '部署', slug: 'guides/deploy', key: 'guides/deploy' },


	{ text: '指南', header: true, type: 'learn', key: 'features' },
	{ text: '配置 Astro', slug: 'guides/configuring-astro', key: 'guides/configuring-astro' },
	{ text: 'CSS 与样式', slug: 'guides/styling', key: 'guides/styling' },
	{ text: '字体', slug: 'guides/fonts', key: 'guides/fonts' },
	{ text: '获取数据', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{ text: '环境变量', slug: 'guides/environment-variables', key: 'guides/environment-variables' },
	{ text: '图像', slug: 'guides/images', key: 'guides/images' },
	{ text: '别名导入', slug: 'guides/aliases', key: 'guides/aliases' },
	{ text: '集成', slug: 'guides/integrations-guide', key: 'guides/integrations-guide' },
	{ text: 'RSS', slug: 'guides/rss', key: 'guides/rss' },
	{ text: '服务端渲染 (SSR)', slug: 'guides/server-side-rendering', key: 'guides/server-side-rendering' },
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'UI 框架', slug: 'core-concepts/framework-components', key: 'core-concepts/framework-components' },
	{ text: '共享状态', slug: 'core-concepts/sharing-state', key: 'core-concepts/sharing-state' },

	{ text: '参考', header: true, type: 'api', key: 'reference' },
	{ text: '配置', slug: 'reference/configuration-reference', key: 'reference/configuration-reference' },
	{ text: 'CLI', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{ text: '运行时 API', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{ text: '集成 API', slug: 'reference/integrations-reference', key: 'reference/integrations-reference' },
	{ text: '适配器 API', slug: 'reference/adapter-reference', key: 'reference/adapter-reference' },
	{ text: '模板指令', slug: 'reference/directives-reference', key: 'reference/directives-reference' },
	{ text: 'NPM 包格式', slug: 'guides/publish-to-npm', key: 'guides/publish-to-npm' },
] as const;
