import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: 'खोजें',
	placeholder: 'दस्तावेज़ खोजें',
	shortcutLabel: 'खोजने के लिए / दबाएँ',
	resultsFooterLede: 'एक Astro एकीकरण या विषय की तलाश में? अधिक मदद की आवश्यकता है?',
	resultsFooterIntegrations: 'Astro एकीकरण निर्देशिका',
	resultsFooterThemes: 'Astro थीम का प्रदर्शन',
	resultsFooterDiscord: 'डिस्कोर्ड पर हमसे जुड़ें',
    modal: {
		searchBox: {
			resetButtonTitle: 'खोज साफ़ करें',
			resetButtonAriaLabel: 'खोज साफ़ करें',
			cancelButtonText: 'रद्द करे',
			cancelButtonAriaLabel: 'रद्द करे',
		},
		startScreen: {
			recentSearchesTitle: 'हाल की खोजें',
			noRecentSearchesText: 'कोई हालिया खोज नहीं',
			saveRecentSearchButtonTitle: 'इस खोज को सहेजें',
			removeRecentSearchButtonTitle: "इस खोज को इतिहास से हटाएँ",
			favoriteSearchesTitle: 'पसंदीदा',
			removeFavoriteSearchButtonTitle: 'इस खोज को पसंदीदा से निकालें',
		},
		errorScreen: {
			titleText: 'परिणाम पुनर्प्राप्त करने में त्रुटि',
			helpText: "आपको अपने इंटरनेट कनेक्शन की स्थिति की जांच करनी चाहिए।",
		},
		footer: {
			selectText: 'चयन करने के लिए',
			selectKeyAriaLabel: 'कुंजी दबाएँ',
			navigateText: 'नेविगेट करने के लिए',
			navigateUpKeyAriaLabel: 'शीर्ष तीर',
			navigateDownKeyAriaLabel: 'नीचे तीर',
			closeText: 'बंद करना',
			closeKeyAriaLabel: "भागने की कुंजी",
			searchByText: 'के माध्यम से खोजें',
		},
		noResultsScreen: {
			noResultsText: 'इसका कोई परिणाम नहीं मिला',
			suggestedQueryText: 'खोजने का प्रयास करें',
			reportMissingResultsText: 'क्या आपको लगता है कि आपको कोई त्रुटि मिली है?',
			reportMissingResultsLinkText: 'हमें बताएं।',
		},
	},
});
