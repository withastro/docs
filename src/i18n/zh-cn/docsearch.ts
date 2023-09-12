import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: '搜索',
	placeholder: '搜索文档...',
	shortcutLabel: '按下 / 来搜索文档',
	resultsFooterLede: '正在寻找 Astro 集成或主题？需要更多帮助吗？',
	resultsFooterIntegrations: 'Astro 集成目录',
	resultsFooterThemes: 'Astro 主题展示',
	resultsFooterDiscord: '在 Discord 上加入我们',
	modal: {
		searchBox: {
			resetButtonTitle: '删除搜索',
			resetButtonAriaLabel: '删除搜索',
			cancelButtonText: '取消',
			cancelButtonAriaLabel: '取消',
		},
		startScreen: {
			recentSearchesTitle: '最近搜索',
			noRecentSearchesText: '无最近搜索内容',
			saveRecentSearchButtonTitle: '保存此搜索',
			removeRecentSearchButtonTitle: '移除此搜索',
			favoriteSearchesTitle: '收藏夹',
			removeFavoriteSearchButtonTitle: '从收藏夹移除',
		},
		errorScreen: {
			titleText: '出现未知错误！',
			helpText: '请检查你的互联网连接是否有误',
		},
		footer: {
			selectText: '进入条目',
			selectKeyAriaLabel: '回车键',
			navigateText: '导航',
			navigateUpKeyAriaLabel: '上方向键',
			navigateDownKeyAriaLabel: '下方向键',
			closeText: '关闭搜索',
			closeKeyAriaLabel: 'Esc 键',
			searchByText: '搜索来自',
		},
		noResultsScreen: {
			noResultsText: '没有合适的结果...',
			suggestedQueryText: '请尝试搜索',
			reportMissingResultsText: '仍然认为应该有搜索结果？',
			reportMissingResultsLinkText: '请通知我们。',
		},
	},
});
