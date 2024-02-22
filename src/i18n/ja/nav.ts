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
	{ text: 'スタートガイド', header: true, type: 'learn', key: 'startHere' },
	{ text: 'はじめに', slug: 'getting-started', key: 'getting-started' },
	{ text: 'インストール', slug: 'install/auto', key: 'install' },
	{ text: 'エディタのセットアップ', slug: 'editor-setup', key: 'editor-setup' },
	{ text: 'v4へのアップグレード', slug: 'guides/upgrade-to/v4', key: 'guides/upgrade-to/v4' },

	{ text: 'コアコンセプト', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'Astroを選ぶ理由', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'Astroアイランド', slug: 'concepts/islands', key: 'concepts/islands' },

	{ text: 'チュートリアル', header: true, type: 'learn', key: 'tutorials' },
	{ text: 'ブログを作る', slug: 'tutorial/0-introduction', key: 'blog-tutorial' },
	{
		text: 'コンテンツコレクションで拡張する',
		slug: 'tutorials/add-content-collections',
		key: 'add-collections-tutorial',
	},
	{
		text: 'ビュートランジションで拡張する',
		slug: 'tutorials/add-view-transitions',
		key: 'add-transitions-tutorial',
	},
	// { text: 'Thinking with Islands', slug: 'tutorial/0-introduction', key: 'island-tutorial' },

	{ text: '基本', header: true, type: 'learn', key: 'basics' },

	{
		text: 'ディレクトリ構成',
		slug: 'basics/project-structure',
		key: 'basics/project-structure',
	},
	{
		text: 'コンポーネント',
		slug: 'basics/astro-components',
		key: 'basics/astro-components',
	},
	{ text: 'ページ', slug: 'basics/astro-pages', key: 'basics/astro-pages' },
	{ text: 'レイアウト', slug: 'basics/layouts', key: 'basics/layouts' },
	{
		text: 'Astroテンプレートの構文',
		slug: 'basics/astro-syntax',
		key: 'basics/astro-syntax',
	},
	{
		text: 'レンダリングモード',
		slug: 'basics/rendering-modes',
		key: 'basics/rendering-modes',
	},

	{ text: '組み込み機能', header: true, type: 'learn', key: 'builtins' },
	{
		text: 'コンテンツコレクション',
		slug: 'guides/content-collections',
		key: 'guides/content-collections',
	},
	{
		text: 'ビュートランジション',
		slug: 'guides/view-transitions',
		key: 'guides/view-transitions',
	},
	{
		text: 'プリフェッチ',
		slug: 'guides/prefetch',
		key: 'guides/prefetch',
	},

	{ text: 'インテグレーション', header: true, type: 'learn', key: 'addons' },
	{
		text: 'インテグレーションの追加',
		slug: 'guides/integrations-guide',
		key: 'guides/integrations-guide',
	},
	{
		text: 'UIフレームワーク',
		slug: 'guides/framework-components',
		key: 'guides/framework-components',
	},
	{
		text: 'サーバーサイドレンダリング（SSR）',
		slug: 'guides/server-side-rendering',
		key: 'guides/server-side-rendering',
	},

	{ text: 'レシピ', header: true, type: 'learn', key: 'examples' },
	{ text: 'Astroへの移行', slug: 'guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	{ text: 'CMSとの接続', slug: 'guides/cms', key: 'guides/cms' },
	{ text: 'バックエンドサービスの追加', slug: 'guides/backend', key: 'guides/backend' },
	{ text: 'サイトのデプロイ', slug: 'guides/deploy', key: 'guides/deploy' },
	{ text: 'その他のレシピ', slug: 'recipes', key: 'guides/recipes' },

	{ text: 'ガイド', header: true, type: 'learn', key: 'features' },
	{ text: 'ルーティング', slug: 'guides/routing', key: 'guides/routing' },
	{ text: 'Markdown', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{
		text: 'スクリプトとイベントハンドリング',
		slug: 'guides/client-side-scripts',
		key: 'guides/client-side-scripts',
	},
	{ text: 'CSSとスタイル', slug: 'guides/styling', key: 'guides/styling' },
	{ text: '画像', slug: 'guides/images', key: 'guides/images' },
	{ text: 'フォント', slug: 'guides/fonts', key: 'guides/fonts' },
	{ text: 'インポート', slug: 'guides/imports', key: 'guides/imports' },
	{ text: 'エンドポイント', slug: 'guides/endpoints', key: 'guides/endpoints' },
	{ text: 'データフェッチ', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{ text: '国際化', slug: 'guides/internationalization', key: 'guides/internationalization' },
	{ text: 'ミドルウェア', slug: 'guides/middleware', key: 'guides/middleware' },
	{ text: 'テスト', slug: 'guides/testing', key: 'guides/testing' },
	{ text: '認証', slug: 'guides/authentication', key: 'guides/authentication' },
	{ text: 'トラブルシューティング', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },

	{ text: '設定', header: true, type: 'learn', key: 'configuration' },
	{
		text: 'Astroの設定ファイル',
		slug: 'guides/configuring-astro',
		key: 'guides/configuring-astro',
	},
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'importエイリアス', slug: 'guides/aliases', key: 'guides/aliases' },
	{ text: '環境変数', slug: 'guides/environment-variables', key: 'guides/environment-variables' },

	{ text: 'リファレンス', header: true, type: 'api', key: 'reference' },
	{
		text: '設定方法',
		slug: 'reference/configuration-reference',
		key: 'reference/configuration-reference',
	},
	{ text: 'ランタイムAPI', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{
		text: 'インテグレーションAPI',
		slug: 'reference/integrations-reference',
		key: 'reference/integrations-reference',
	},
	{
		text: 'アダプターAPI',
		slug: 'reference/adapter-reference',
		key: 'reference/adapter-reference',
	},
	{
		text: '画像サービスAPI',
		slug: 'reference/image-service-reference',
		key: 'reference/image-service-reference',
	},
	{
		text: 'Dev Toolbar App API',
		slug: 'reference/dev-toolbar-app-reference',
		key: 'reference/dev-toolbar-app-reference',
	},
	{
		text: 'テンプレートディレクティブ',
		slug: 'reference/directives-reference',
		key: 'reference/directives-reference',
	},
	{ text: 'Astro CLI', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{
		text: 'エラーリファレンス',
		slug: 'reference/error-reference',
		key: 'reference/error-reference',
	},
	{ text: 'NPMパッケージの形式', slug: 'reference/publish-to-npm', key: 'guides/publish-to-npm' },

	{ text: 'コミュニティリソース', header: true, type: 'learn', key: 'communityResources' },
	{
		text: 'コース、ガイド、レシピ',
		slug: 'community-resources/content',
		key: 'community-resources/content',
	},
	{
		text: 'トーク、インタビュー、配信',
		slug: 'community-resources/talks',
		key: 'community-resources/talks',
	},
] as const;
