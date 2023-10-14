import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': '跳转到内容',
	'a11y.sectionLink': '段落标题',
	'navbar.a11yTitle': '顶部导航',
	// Site settings
	'site.title': 'Astro 文档',
	'site.description': '用更少的客户端 JavaScript 构建更快的站点。',
	'site.og.imageSrc': '/default-og-image.png?v=1',
	'site.og.imageAlt': '星辰浩瀚的太空中的 astro 标志，右侧前景中漂浮着一颗紫色的土星状行星。',
	// Left Sidebar
	'leftSidebar.a11yTitle': '站点导航',
	'leftSidebar.learnTab': '学习',
	'leftSidebar.referenceTab': '参考',
	'leftSidebar.viewInEnglish': '查看英文版本',
	'leftSidebar.sponsoredBy': '赞助商',
	// Right Sidebar
	'rightSidebar.a11yTitle': '目录',
	'rightSidebar.onThisPage': '本页内容',
	'rightSidebar.overview': '概述',
	'rightSidebar.editPage': '编辑本页内容',
	'rightSidebar.translatePage': '翻译本页内容',
	'rightSidebar.contribute': '贡献',
	'rightSidebar.contributorGuides': '贡献者指南',
	'rightSidebar.community': '社区',
	'rightSidebar.joinDiscord': '加入我们的 Discord',
	'rightSidebar.readBlog': '阅读我们的博客',
	'rightSidebar.openCollective': '我们的 Open Collective',
	'rightSidebar.github': 'GitHub 上的 Astro 文档',
	// Footer
	'footer.privacyPolicy': '隐私协议',
	// `<ThemeToggleButton>` acessibility labels
	'themeToggle.useLight': '使用浅色主题',
	'themeToggle.useDark': '使用深色主题',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': '下一页',
	'articleNav.prevPage': '返回',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': '添加于：',
	'since.new': '新',
	'since.beta': 'Beta',
	// Installation Guide
	'install.autoTab': '自动化命令行',
	'install.manualTab': '手动设置',
	// `<DeployGuidesNav>` 词汇
	'deploy.sectionTitle': '部署指南',
	'deploy.altSectionTitle': '更多部署指南',
	'deploy.filterLabel': '根据部署类型筛选',
	'deploy.ssrTag': 'SSR',
	'deploy.staticTag': '静态',
	// CMS Guides vocabulary
	'cms.navTitle': '更多 CMS 指南',
	// Migration Guides vocabulary
	'migration.navTitle': '更多迁移指南',
	// Recipes vocabulary
	'recipes.navTitle': '更多方案',
	// `<RecipeLinks>` vocabulary
	'recipesLink.singular': '相关方案：',
	'recipesLink.plural': '相关方案',
	// `<ContributorList>` fallback text
	'contributors.seeAll': '查看所有贡献者',
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice': '此页暂不支持你的语言，我们将为你展示英文页面。你可以帮忙翻译它！',
	'fallbackContent.linkText': '了解更多关于贡献的内容',
	// 404 Page
	'404.title': '未能找到此页面',
	'404.content': '该页面不在我们的星系中。',
	'404.linkText': '返回主页',
	// Aside component default labels
	'aside.note': '注意',
	'aside.tip': '提示',
	'aside.caution': '警告',
	'aside.danger': '危险',
	// `<LanguageSelect>` vocabulary
	'languageSelect.label': '选择语言',
	// Integrations vocabulary
	'integrations.changelog': '更新日志',
	'integrations.footerTitle': '更多集成',
	'integrations.renderers': 'UI 框架',
	'integrations.adapters': 'SSR 适配器',
	'integrations.others': '其他',
	// Checklist component
	'checklist.or': '或',
	// Multiple Choice component
	'multipleChoice.defaultCorrect': '正确！',
	'multipleChoice.defaultIncorrect': '再试一次！',
	'multipleChoice.submitLabel': '提交',
	// Tutorial Progress
	'progress.todo': '待办',
	'progress.done': '完成',
	// Tutorial Navigation
	'tutorial.trackerLabel': '教程跟踪',
	'tutorial.unit': '单元',
	// Tutorial
	'tutorial.getReady': '准备好…',
	// Feedback Fish widget
	'feedback.button': '给予我们反馈',
	'feedback.a11yLabel': '反馈表单',
	'feedback.formTitle': '你有什么想法？',
	'feedback.categoryGroupLabel': '选择反馈类型',
	'feedback.issue': '问题',
	'feedback.createIssue': '创建 GitHub Issue',
	'feedback.idea': '想法',
	'feedback.other': '其它',
	'feedback.messageA11yLabel': '留言',
	'feedback.placeholder': '你想让我们知道什么？',
	'feedback.submit': '发送反馈',
	'feedback.close': '关闭反馈表单',
	'feedback.success': '感谢！我们收到了你的反馈。',
	// `<FileTree>` component
	'fileTree.directoryLabel': '目录',
	// Code snippet vocabulary
	'expressiveCode.terminalWindowFallbackTitle': '终端窗口',
	'expressiveCode.copyButtonTooltip': '复制到剪贴板',
	'expressiveCode.copyButtonCopied': '复制成功！',
	// Backend Guides vocabulary
	'backend.navTitle': '更多后端服务指南',
	// Stubs vocabulary
	'stub.title': '完善本指南！',
	'stub.subtitle': '此指南尚未完成。',
	'stub.description.migration':
		'想为这个指南做贡献吗？有关于从这项技术迁移到 Astro 的文章、视频或其他资源？',
	'stub.description.cms': '知道更多在 Astro 使用此 CMS 的信息？',
	'stub.description.backend': '知道更多在 Astro 使用此后端服务的信息？',
});
