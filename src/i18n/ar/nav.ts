/*
 * This configures the navigation sidebar.
 * Only add entries for pages that are translated into Arabic.
 */

import { NavDictionary } from '../translation-checkers';

export default NavDictionary({
	// Start Here
	startHere: 'ابدأ هنا',
	'getting-started': 'دليل البداية',
	'editor-setup': 'إعداد البيئة البرمجية',
	'guides/upgrade-to/v3': 'الترقية إلى الإصدار 3',

	// Core Concepts
	coreConcepts: 'المفاهيم الأساسية',
	'concepts/why-astro': 'لماذا أسترو؟',
	'concepts/islands': 'جزر أسترو',

	// Tutorials
	tutorials: 'الدروس',
	'blog-tutorial': 'إنشاء مدونة',

	// Basics
	basics: 'الأساسيات',
	'core-concepts/project-structure': 'هيكل المشروع',
	'core-concepts/astro-components': 'المكوّنات',
	'core-concepts/astro-pages': 'الصفحات',
	'core-concepts/layouts': 'التخطيطات',

	// Examples
	examples: 'الأمثلة',
	'guides/migrate-to-astro': 'التحويل إلى أسترو',
	'guides/cms': 'ربط نظام إدارة المحتوى',
	'guides/backend': 'إضافة خدمات الخلف',
	'guides/integrations-guide': 'إضافة التكاملات',
	'guides/deploy': 'نشر موقعك',
	'guides/recipes': 'المزيد من الأمثلة',

	// Guides
	features: 'الدليل',
	'core-concepts/astro-syntax': 'صيغة كتابة أسترو',
	'core-concepts/framework-components': 'مكوّنات أطر الويب الأخرى',
	'core-concepts/routing': 'التوجيه',
	'guides/markdown-content': 'المحتوى بصيغة ماركداون و MDX',
	'guides/content-collections': 'مجموعات المحتوى',
	'guides/client-side-scripts': 'النصوص ومعالجة الأحداث',
	'guides/styling': 'التصميم و CSS',
	'guides/images': 'الصور',
	'guides/fonts': 'الخطوط',
	'guides/imports': 'الإضافات',
	'guides/server-side-rendering': 'التصيير على الخادم',
	'core-concepts/endpoints': 'نقاط النهاية',
	'guides/data-fetching': 'جلب البيانات',
	'guides/middleware': 'الوسيط',
	'guides/testing': 'الفحص',
	'guides/view-transitions': 'تحول الصفحات',
	'guides/troubleshooting': 'إصلاح المشاكل',

	// Configuration
	configuration: 'الإعدادات',
	'guides/configuring-astro': 'ملف إعدادات أسترو',
	'guides/typescript': 'تايب سكربت',
	'guides/aliases': 'الأسماء المستعارة للإضافات',
	'guides/environment-variables': 'متغيرات البيئة',

	// Reference
	reference: 'المراجع',
	'reference/configuration-reference': 'الإعدادات',
	'reference/api-reference': 'واجهة برمجة التطبيقات وقت التشغيل',
	'reference/integrations-reference': 'واجهة برمجة التطبيقات للتكاملات',
	'reference/adapter-reference': 'واجهة برمجة التطبيقات للمحولات',
	'reference/image-service-reference': 'واجهة برمجة التطبيقات لخدمة الصور',
	'reference/directives-reference': 'توجيهات القوالب',
	'reference/cli-reference': 'واجهة سطر الأوامر لأسترو',
	'reference/error-reference': 'مرجع الأخطاء',
	'guides/publish-to-npm': 'تنسيق حزمة NPM',
});
