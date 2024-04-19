/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 *
 * For translators:
 *
 * Copy the English `key` value unchanged and translate only the `text` into your language:
 *
 * `src/i18n/en/nav.ts`: `{ text: 'Getting Started', slug: 'getting-started', key: 'getting-started' },`
 * `src/i18n/ja/nav.ts`: `'getting-started': 'はじめに',`
 */
export default [
	{ text: 'ابدأ هنا', header: true, type: 'learn', key: 'startHere' },
	{ text: 'دليل البداية', slug: 'getting-started', key: 'getting-started' },
	{ text: 'التثبيت', slug: 'install/auto', key: 'install' },
	{ text: 'إعداد المحرر', slug: 'editor-setup', key: 'editor-setup' },
	{ text: 'Upgrade Astro', slug: 'upgrade-astro', key: 'upgrade-astro' },

	{ text: 'المفاهيم الأساسية', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'لماذا أسترو؟', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'جزر أسترو', slug: 'concepts/islands', key: 'concepts/islands' },

	{ text: 'الدروس', header: true, type: 'learn', key: 'tutorials' },
	{ text: 'إنشاء مدونة', slug: 'tutorial/0-introduction', key: 'blog-tutorial' },
	{
		text: 'امتداد مع مجموعات المحتوى',
		slug: 'tutorials/add-content-collections',
		key: 'add-collections-tutorial',
	},
	{
		text: 'تمدد مع انتقالات العرض',
		slug: 'tutorials/add-view-transitions',
		key: 'add-transitions-tutorial',
	},
	// { text: 'Thinking with Islands', slug: 'tutorial/0-introduction', key: 'island-tutorial' },

	{ text: 'الأساسيات', header: true, type: 'learn', key: 'basics' },

	{
		text: 'هيكل المشروع',
		slug: 'basics/project-structure',
		key: 'basics/project-structure',
	},
	{
		text: 'عناصر',
		slug: 'basics/astro-components',
		key: 'basics/astro-components',
	},
	{ text: 'الصفحات', slug: 'basics/astro-pages', key: 'basics/astro-pages' },
	{ text: 'تخطيطات', slug: 'basics/layouts', key: 'basics/layouts' },
	{
		text: 'بنية قالب أسترو',
		slug: 'basics/astro-syntax',
		key: 'basics/astro-syntax',
	},
	{
		text: 'أوضاع التقديم',
		slug: 'basics/rendering-modes',
		key: 'basics/rendering-modes',
	},

	{ text: 'مدمجة', header: true, type: 'learn', key: 'builtins' },
	{
		text: 'مجموعات المحتوى',
		slug: 'guides/content-collections',
		key: 'guides/content-collections',
	},
	{
		text: 'أوضاع التقديم',
		slug: 'guides/view-transitions',
		key: 'guides/view-transitions',
	},
	{
		text: 'الجلب',
		slug: 'guides/prefetch',
		key: 'guides/prefetch',
	},
	{
		text: 'شريط أدوات المطور',
		slug: 'guides/dev-toolbar',
		key: 'guides/dev-toolbar',
	},

	{ text: 'التكامل', header: true, type: 'learn', key: 'addons' },
	{ text: 'Add integrations', slug: 'guides/integrations-guide', key: 'guides/integrations-guide' },
	{
		text: 'أطر واجهة المستخدم',
		slug: 'guides/framework-components',
		key: 'guides/framework-components',
	},
	{
		text: 'محولات التصيير على الخادم',
		slug: 'guides/server-side-rendering',
		key: 'guides/server-side-rendering',
	},
	{
		text: 'Astro DB',
		slug: 'guides/astro-db',
		key: 'guides/astro-db',
	},

	{ text: 'وصفات', header: true, type: 'learn', key: 'examples' },
	{ text: 'ترحيل إلى أسترو', slug: 'guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	{ text: 'تواصل مع أسترو الاستوديو', slug: 'recipes/studio', key: 'recipes/studio' },
	{ text: 'قم بتوصيل CMS', slug: 'guides/cms', key: 'guides/cms' },
	{ text: 'إضافة خدمات الخلفية', slug: 'guides/backend', key: 'guides/backend' },
	{ text: 'نشر موقعك', slug: 'guides/deploy', key: 'guides/deploy' },
	{ text: 'المزيد من الوصفات', slug: 'recipes', key: 'guides/recipes' },

	{ text: 'الدليل', header: true, type: 'learn', key: 'features' },
	{ text: 'التوجيه', slug: 'guides/routing', key: 'guides/routing' },
	{ text: 'ماركداون', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{
		text: 'البرامج النصية والتعامل مع الأحداث',
		slug: 'guides/client-side-scripts',
		key: 'guides/client-side-scripts',
	},
	{ text: 'css والتصميم', slug: 'guides/styling', key: 'guides/styling' },
	{ text: 'الصور', slug: 'guides/images', key: 'guides/images' },
	{ text: 'الخطوط', slug: 'guides/fonts', key: 'guides/fonts' },
	{ text: 'الواردات', slug: 'guides/imports', key: 'guides/imports' },
	{ text: 'نقاط النهاية', slug: 'guides/endpoints', key: 'guides/endpoints' },
	{ text: 'جلب البيانات', slug: 'guides/data-fetching', key: 'guides/data-fetching' },

	{
		text: 'العالمية',
		slug: 'guides/internationalization',
		key: 'guides/internationalization',
	},
	{ text: 'الوسيطة', slug: 'guides/middleware', key: 'guides/middleware' },
	{ text: 'التجارة الإلكترونية', slug: 'guides/ecommerce', key: 'guides/ecommerce' },
	{ text: 'اختبارات', slug: 'guides/testing', key: 'guides/testing' },
	{ text: 'المصادقة', slug: 'guides/authentication', key: 'guides/authentication' },
	{ text: 'استكشاف الأخطاء وإصلاحها', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },

	{ text: 'إعدادات', header: true, type: 'learn', key: 'configuration' },
	{
		text: 'ملف التكوين لأسترو',
		slug: 'guides/configuring-astro',
		key: 'guides/configuring-astro',
	},
	{ text: 'typeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'استيراد الاسم المستعار', slug: 'guides/aliases', key: 'guides/aliases' },
	{
		text: 'متغيرات البيئة',
		slug: 'guides/environment-variables',
		key: 'guides/environment-variables',
	},

	{ text: 'مرجع', header: true, type: 'api', key: 'reference' },
	{
		text: 'إعدادات',
		slug: 'reference/configuration-reference',
		key: 'reference/configuration-reference',
	},
	{ text: 'API وقت التشغيل', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{
		text: 'دمج API',
		slug: 'reference/integrations-reference',
		key: 'reference/integrations-reference',
	},
	{ text: 'مشترك API', slug: 'reference/adapter-reference', key: 'reference/adapter-reference' },
	{
		text: 'خدمة الصور API',
		slug: 'reference/image-service-reference',
		key: 'reference/image-service-reference',
	},
	{
		text: 'تطبيق شريط أدوات المطور API',
		slug: 'reference/dev-toolbar-app-reference',
		key: 'reference/dev-toolbar-app-reference',
	},
	{
		text: 'توجيهات القالب',
		slug: 'reference/directives-reference',
		key: 'reference/directives-reference',
	},
	{ text: 'واجهة سطر الأوامر (CLI) لأسترو', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{
		text: 'مرجع الأخطاء',
		slug: 'reference/error-reference',
		key: 'reference/error-reference',
	},
	{ text: 'تنسيق حزمة NPM', slug: 'reference/publish-to-npm', key: 'guides/publish-to-npm' },

	{ text: 'موارد المجتمع', header: true, type: 'learn', key: 'communityResources' },
	{
		text: 'الدورات والأدلة والوصفات',
		slug: 'community-resources/content',
		key: 'community-resources/content',
	},
	{
		text: 'المحادثات والمقابلات والتيارات',
		slug: 'community-resources/talks',
		key: 'community-resources/talks',
	},
] as const;
