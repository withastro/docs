import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: 'البحث',
	placeholder: 'ابحث في الوثائق',
	shortcutLabel: 'اضغط على / للبحث',
	resultsFooterLede: 'هل تبحث عن إضافة أو ثيم لأسترو؟ هل تريد المزيد من المساعدة؟',
	resultsFooterIntegrations: 'دليل إضافات أسترو',
	resultsFooterThemes: 'معرض قوالب أسترو',
	resultsFooterDiscord: 'انضم لنا على ديسكورد',
	modal: {
		searchBox: {
			resetButtonTitle: 'إعادة تعيين البحث',
			resetButtonAriaLabel: 'زر إعادة تعيين البحث',
			cancelButtonText: 'إلغاء',
			cancelButtonAriaLabel: 'زر الإلغاء',
		},
		startScreen: {
			recentSearchesTitle: 'عمليات البحث الأخيرة',
			noRecentSearchesText: 'لا توجد عمليات بحث قديمة',
			saveRecentSearchButtonTitle: 'تفضيل هذا البحث',
			removeRecentSearchButtonTitle: 'إزالة هذا البحث من السجل',
			favoriteSearchesTitle: 'المفضلة',
			removeFavoriteSearchButtonTitle: 'إزالة هذا البحث من المفضلة',
		},
		errorScreen: {
			titleText: 'خطأ أثناء استرداد النتائج',
			helpText: 'يرجى التحقق من حالة اتصالك بالإنترنت.',
		},
		footer: {
			selectText: 'للاختيار',
			selectKeyAriaLabel: 'اضغط على المفتاح',
			navigateText: 'للتنقل',
			navigateUpKeyAriaLabel: 'اضغط سهم أعلى للتنقل للأعلى',
			navigateDownKeyAriaLabel: 'اضغط سهم أسفل للتنقل للأسفل',
			closeText: 'للإغلاق',
			closeKeyAriaLabel: 'اضغط esc للإغلاق',
			searchByText: 'بحث عبر',
		},
		noResultsScreen: {
			noResultsText: 'لم يتم العثور على أي نتائج لـ',
			suggestedQueryText: 'جرب البحث عن',
			reportMissingResultsText: 'هل تعتقد أنك وجدت خطأ؟',
			reportMissingResultsLinkText: 'أخبرنا.',
		},
	},
});
