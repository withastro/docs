import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: '搜索',
	placeholder: '搜素文档...',
	shortcutLabel: '按下 / 来搜索文档',
	modal: {
		searchBox: {
			// resetButtonTitle: '',
			// resetButtonAriaLabel: '',
			cancelButtonText: '取消',
			// cancelButtonAriaLabel: '',
		},
		startScreen: {
			recentSearchesTitle: '最近搜索',
			noRecentSearchesText: '无最近搜索内容',
			// saveRecentSearchButtonTitle: '',
			// removeRecentSearchButtonTitle: "",
			favoriteSearchesTitle: '收藏夹',
			removeFavoriteSearchButtonTitle: '从收藏夹移除',
		},
		errorScreen: {
			titleText: '出现未知错误！',
			helpText: '请检查您的互联网连接是否有误',
		},
		footer: {
			selectText: '进入条目',
			// selectKeyAriaLabel: '',
			navigateText: '导航',
			// navigateUpKeyAriaLabel: '',
			// navigateDownKeyAriaLabel: '',
			closeText: '关闭搜索',
			// closeKeyAriaLabel: "",
			searchByText: '搜索来自',
		},
		noResultsScreen: {
			noResultsText: '没有合适的结果...',
			suggestedQueryText: '请尝试搜索：',
			reportMissingResultsText: '任然认为应该有搜索结果？',
			reportMissingResultsLinkText: '请通知我们。',
		},
	},
});
