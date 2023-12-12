import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: '搜尋',
	placeholder: '搜尋文檔',
	shortcutLabel: '按下 / 來搜尋文檔',
	resultsFooterLede: '正在尋找 Astro 整合或主題？需要更多幫助嗎？',
	resultsFooterIntegrations: 'Astro 整合目錄',
	resultsFooterThemes: 'Astro 主題展示',
	resultsFooterDiscord: '在 Discord 上加入我們',
	modal: {
		searchBox: {
			resetButtonTitle: '刪除搜尋',
			resetButtonAriaLabel: '刪除搜尋',
			cancelButtonText: '取消',
			cancelButtonAriaLabel: '取消',
		},
		startScreen: {
			recentSearchesTitle: '最近搜尋',
			noRecentSearchesText: '無最近搜尋内容',
			saveRecentSearchButtonTitle: '保存此搜尋',
			removeRecentSearchButtonTitle: '刪除此搜尋',
			favoriteSearchesTitle: '收藏夾',
			removeFavoriteSearchButtonTitle: '從收藏夾中刪除',
		},
		errorScreen: {
			titleText: '出現未知錯誤！',
			helpText: '請確認你的網路連線狀況',
		},
		footer: {
			selectText: '進入條目',
			selectKeyAriaLabel: 'Enter 鍵',
			navigateText: '導航',
			navigateUpKeyAriaLabel: '上方向鍵',
			navigateDownKeyAriaLabel: '下方向鍵',
			closeText: '關閉搜尋',
			closeKeyAriaLabel: 'Esc 鍵',
			searchByText: '搜尋來自',
		},
		noResultsScreen: {
			noResultsText: '未找到相關結果',
			suggestedQueryText: '請嘗試搜尋',
			reportMissingResultsText: '仍然認為應該有搜尋結果？',
			reportMissingResultsLinkText: '請聯絡我們。',
		},
	},
});
