import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': 'コンテンツにスキップ',
	'navbar.a11yTitle': 'トップナビゲーション',
	// Site settings
	'site.title': 'Astroドキュメント',
	'site.description':
		'より少ないクライアントサイドJavascriptで、より高速なWebサイトを構築できます。',
	'site.og.imageAlt': '星空にAstroロゴ、右手前には紫色の土星のような惑星が見える。',
	// Left Sidebar
	'leftSidebar.a11yTitle': 'サイトナビゲーション',
	'leftSidebar.learnTab': '学習',
	'leftSidebar.referenceTab': 'リファレンス',
	'leftSidebar.noTranslations': '翻訳が見つかりません',
	'leftSidebar.viewInEnglish': '英語版で見る',
	// Right Sidebar
	'rightSidebar.a11yTitle': '目次',
	'rightSidebar.onThisPage': '目次',
	'rightSidebar.overview': '概要',
	'rightSidebar.more': 'その他',
	'rightSidebar.editPage': 'このページを編集',
	'rightSidebar.translatePage': 'このページを翻訳',
	'rightSidebar.joinCommunity': 'コミュニティーに参加',
	'rightSidebar.github': 'GitHubリポジトリ',
	// `<ThemeToggleButton>` acessibility labels
	'themeToggle.useLight': 'ライトモード',
	'themeToggle.useDark': 'ダークモード',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': '次のページ',
	'articleNav.prevPage': '戻る',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': '追加:',
	'since.new': 'New',
	// Installation Guide
	'install.autoTab': '自動CLI',
	'install.manualTab': '手動セットアップ',
	// `<ContributorList>` fallback text
	'contributors.seeAll': 'すべての協力者を見る',
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice':
		'このページはまだ日本語版が用意されていないため、英語版を表示しています。興味があればこのページの翻訳に協力できます！',
	'fallbackContent.linkText': '貢献の方法についてはこちらをご覧ください',
	// 404 Page
	'404.title': 'ページが見つかりません',
	'404.content': 'このページは、太陽系にはありません。',
	'404.linkText': '家へ帰る',
	// Aside component default labels
	'aside.note': 'ノート',
	'aside.tip': 'ヒント',
	'aside.caution': '注意',
	'aside.danger': '危険',
});
