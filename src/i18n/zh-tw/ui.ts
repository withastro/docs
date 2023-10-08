import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': '跳至內容',
	'a11y.sectionLink': '標題為',
	'navbar.a11yTitle': '頂部導覽',
	// Site settings
	'site.title': 'Astro 文檔',
	'site.description': '用更少的用戶端 JavaScript 打造更快速的網站。',
	'site.og.imageSrc': '/default-og-image.webp?v=1',
	'site.og.imageAlt': 'Astro 的標誌在充滿星辰的太空中，右邊前景飄浮著土星似的紫色星球',
	// Left Sidebar
	'leftSidebar.a11yTitle': '網站導覽',
	'leftSidebar.learnTab': '學習',
	'leftSidebar.referenceTab': '參考',
	'leftSidebar.viewInEnglish': '閱讀英文版',
	'leftSidebar.sponsoredBy': '贊助者',
	// Right Sidebar
	'rightSidebar.a11yTitle': '目錄',
	'rightSidebar.onThisPage': '本頁內容',
	'rightSidebar.overview': '概要',
	'rightSidebar.community': 'Community',
	'rightSidebar.joinDiscord': '加入我們的 Discord',
	'rightSidebar.readBlog': '瀏覽我們的部落格',
	'rightSidebar.openCollective': '我們的 Open Collective',
	'rightSidebar.contribute': 'Contribute',
	'rightSidebar.contributorGuides': '貢獻者指南',
	'rightSidebar.editPage': '編輯此頁',
	'rightSidebar.translatePage': '翻譯此頁',
	'rightSidebar.github': 'GitHub 上的 Astro 文檔',
	// Footer
	'footer.privacyPolicy': '隱私權政策',
	// `<ThemeToggleButton>` acessibility labels
	'themeToggle.useLight': '使用淺色主題',
	'themeToggle.useDark': '使用深色主題',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': '下一頁',
	'articleNav.prevPage': '返回',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': '添加於：',
	'since.new': '新',
	'since.beta': 'Beta',
	// Installation Guide
	'install.autoTab': '自動化命令列',
	'install.manualTab': '手動設定',
	// `<DeployGuidesNav>` vocabulary
	'deploy.sectionTitle': '部署指南',
	'deploy.altSectionTitle': '更多部署指南',
	'deploy.filterLabel': '根據部署類型篩選',
	'deploy.ssrTag': 'SSR',
	'deploy.staticTag': '靜態',
	// CMS Guides vocabulary
	'cms.navTitle': '更多 CMS 指南',
	// Migration Guides vocabulary
	'migration.navTitle': '更多遷移指南',
	// Recipes vocabulary
	'recipes.navTitle': '更多操作指南',
	// `<RecipeLinks>` vocabulary
	'recipesLink.singular': '相關操作指南：',
	'recipesLink.plural': '相關操作指南',
	// `<ContributorList>` fallback text
	'contributors.seeAll': '查看所有貢獻者',
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice': '此頁面尚未支援你使用的語言，所以會以英文版呈現。你可以幫忙翻譯它！',
	'fallbackContent.linkText': '進一步了解如何貢獻',
	// 404 Page
	'404.title': '找不到此頁面',
	'404.content': '這一頁不在我們的太陽系中。',
	'404.linkText': '返回主頁',
	// Aside component default labels
	'aside.note': '注意',
	'aside.tip': '提示',
	'aside.caution': '警告',
	'aside.danger': '危險',
	// `<LanguageSelect>` vocabulary
	'languageSelect.label': '選擇語言',
	// Integrations vocabulary
	'integrations.changelog': '變更日誌',
	'integrations.footerTitle': '更多整合',
	'integrations.renderers': 'UI 框架',
	'integrations.adapters': 'SSR 配接器',
	'integrations.others': '其他',
	// Checklist component
	'checklist.or': '或',
	// Multiple Choice component
	'multipleChoice.defaultCorrect': '正確！',
	'multipleChoice.defaultIncorrect': '再試一次！',
	'multipleChoice.submitLabel': '提交',
	// Tutorial Progress
	'progress.todo': '待辦',
	'progress.done': '完成',
	// Tutorial Navigation
	'tutorial.trackerLabel': '教學追蹤',
	'tutorial.unit': '單元',
	// Tutorial
	'tutorial.getReady': '準備好……',
	// Feedback Fish widget
	'feedback.button': '給予我們反饋',
	'feedback.a11yLabel': '反饋表單',
	'feedback.formTitle': '你有哪些想法？',
	'feedback.categoryGroupLabel': '選擇反饋類型',
	'feedback.issue': '問題',
	'feedback.createIssue': '建立 GitHub Issue',
	'feedback.idea': '想法',
	'feedback.other': '其它',
	'feedback.messageA11yLabel': '留言',
	'feedback.placeholder': '你想讓我們知道甚麼？',
	'feedback.submit': '提交反饋',
	'feedback.close': '關閉反饋表單',
	'feedback.success': '謝謝！我們收到了你的反饋。',
	// `<FileTree>` component
	'fileTree.directoryLabel': '目錄',
	// Code snippet vocabulary
	'expressiveCode.terminalWindowFallbackTitle': '終端機視窗',
	'expressiveCode.copyButtonTooltip': '複製到剪貼簿',
	'expressiveCode.copyButtonCopied': '複製成功！',
	// Backend Guides vocabulary
	'backend.navTitle': '更多後端服務指南',
	// Stubs vocabulary
	'stub.title': '完善本頁！',
	'stub.subtitle': '此指南尚未完成。',
	'stub.description.migration':
		'想為這個指南貢獻嗎？是否有介紹從這種技術遷移至 Astro 的部落格文章、影片或其他資源可以分享？',
	'stub.description.cms': '知道更多在 Astro 使用此 CMS 的資訊？',
	'stub.description.backend': '知道更多在 Astro 使用此後端服務的資訊？',
});
