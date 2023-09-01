import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': 'اقفز إلى المحتوى',
	'a11y.sectionLink': 'قسم بعنوان',
	'navbar.a11yTitle': 'القمة',
	// Site settings
	'site.title': 'مستندات أسترو',
	'site.description': 'انشئ مواقع ويب أسرع باستخدام ',
	'site.og.imageSrc': '/default-og-image.png?v=1',
	'site.og.imageAlt':
		'شعار أسترو على فضاء مليئ بالنجوم، مع كوكب أرجواني يشبه زحل يطفو في المقدمة اليمنى',
	// Left Sidebar
	'leftSidebar.a11yTitle': 'أساسي',
	'leftSidebar.learnTab': 'تعلّم',
	'leftSidebar.referenceTab': 'مرجع',
	'leftSidebar.viewInEnglish': 'اعرض باللغة الإنجليزية',
	'leftSidebar.sponsoredBy': 'برعاية',
	// Right Sidebar
	'rightSidebar.a11yTitle': 'ثانوي',
	'rightSidebar.onThisPage': 'في الصفحة الحالية',
	'rightSidebar.overview': 'نظرة عامة',
	'rightSidebar.community': 'المجتمع',
	'rightSidebar.joinDiscord': 'انضم إلينا على Discord',
	'rightSidebar.readBlog': 'اقرأ منشورات مدونتنا',
	'rightSidebar.openCollective': 'Open Collective',
	'rightSidebar.contribute': 'ساهم',
	'rightSidebar.contributorGuides': 'أدلة المساهمين',
	'rightSidebar.editPage': 'عدل هذه الصفحة',
	'rightSidebar.translatePage': 'ترجم هذه الصفحة',
	'rightSidebar.github': 'مستندات أسترو على GitHub',
	// Footer
	'footer.privacyPolicy': 'Privacy Policy',
	// `<ThemeToggleButton>` acessibility labels
	'themeToggle.useLight': 'استخدم الوضع النهاري',
	'themeToggle.useDark': 'استخدم الوضع الليلي',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': 'الصفحة التالية',
	'articleNav.prevPage': 'عودة',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': 'أُضيفت في:',
	'since.new': 'جديد',
	'since.beta': 'تجريبي',
	// Installation Guide
	'install.autoTab': 'CLI أوتوماتيكي',
	'install.manualTab': 'التثبيت اليدوي',
	/* `<DeployGuidesNav>` vocabulary
	 * TODO: Translate along deploy.mdx
	 */
	'deploy.sectionTitle': 'Deployment Guides',
	'deploy.altSectionTitle': 'More Deployment Guides',
	'deploy.filterLabel': 'Filter by deploy type',
	'deploy.ssrTag': 'SSR',
	'deploy.staticTag': 'Static',
	/* CMS Guides vocabulary
	 * TODO: Translate along cms.mdx
	 */
	'cms.navTitle': 'More CMS guides',
	/* Migration Guides vocabulary
	 * TODO: Translate along migrate-to-astro.mdx
	 */
	'migration.navTitle': 'More migration guides',
	// Recipes vocabulary
	'recipes.navTitle': 'المزيد من الوصفات',
	// `<RecipeLinks>` vocabulary
	'recipesLink.singular': 'وصفة ذات صلة:',
	'recipesLink.plural': 'الوصفات ذات الصلة',
	// `<ContributorList>` fallback text
	'contributors.seeAll': 'رؤية كل المساهمين',
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice':
		'هذه الصفحة غير متوفرة باالغة العربية، لذا سنعرضها بالإنجليزية. يمكنك المساهمة عن طريق ترجمتها بنفسك!',
	'fallbackContent.linkText': 'تعرف على المزيد حول كيفية المساهمة',
	// 404 Page
	'404.title': 'لم يتم العثور',
	'404.content': 'الصفحة التي تبحث عنها غير موجودة في نظامنا الشمسي.',
	'404.linkText': 'العودة إلى الصفحة الرئيسية',
	// Aside component default labels
	'aside.note': 'ملحوظة',
	'aside.tip': 'نصيحة',
	'aside.caution': 'تنبيه',
	'aside.danger': 'تحذير',
	// `<LanguageSelect>` vocabulary
	'languageSelect.label': 'اختر لغة',
	// Integrations vocabulary
	'integrations.changelog': 'سجل التغييرات',
	'integrations.footerTitle': 'المزيد من الإضافات',
	'integrations.renderers': 'أطر الواجهات',
	'integrations.adapters': 'محولات SSR',
	'integrations.others': 'أخرى',
	// Checklist component
	'checklist.or': 'أو',
	// Multiple Choice component
	'multipleChoice.defaultCorrect': 'صحيح!',
	'multipleChoice.defaultIncorrect': 'حاول مرة أخرى!',
	'multipleChoice.submitLabel': 'إرسال',
	// Tutorial Progress
	'progress.todo': 'قيد الإنجاز',
	'progress.done': 'مكتمل',
	// Tutorial Navigation
	'tutorial.trackerLabel': 'Tutorial Tracker',
	'tutorial.unit': 'Unit',
	// Tutorial
	'tutorial.getReady': 'Get ready to…',
	// Feedback Fish widget
	'feedback.button': 'أرسل لنا ملاحظاتك',
	'feedback.a11yLabel': 'نموذج الملاحظات',
	'feedback.formTitle': 'بماذا تفكّر؟',
	'feedback.categoryGroupLabel': 'اختر الفئة المناسبة',
	'feedback.issue': 'مشكلة',
	'feedback.createIssue': 'انشئ مشكلة على GitHub',
	'feedback.idea': 'فكرة',
	'feedback.other': 'أخرى',
	'feedback.messageA11yLabel': 'رسالتك',
	'feedback.placeholder': 'ما الي الذي تريد قوله؟',
	'feedback.submit': 'أرسل',
	'feedback.close': 'أغلق',
	'feedback.success': 'شكرًا! تم إرسال ملاحظاتك بنجاح.',
	// `<FileTree>` component
	'fileTree.directoryLabel': 'دليل',
	// Code snippet vocabulary
	'expressiveCode.terminalWindowFallbackTitle': 'نافذة طرفيّة',
	'expressiveCode.copyButtonTooltip': 'نسخ إلى الحافظة',
	'expressiveCode.copyButtonCopied': 'تم النسخ!',
	/* Backend Guides vocabulary
	 * TODO: Translate along backend.mdx
	 */
	'backend.navTitle': 'More backend service guides',
});
