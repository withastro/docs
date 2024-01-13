import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: 'Cercar',
	placeholder: 'Cercar en la documentació',
	shortcutLabel: 'Pressiona / per trobar',
	resultsFooterLede: "Busques una integració o tema d'Astro? Necesites més ajuda?",
	resultsFooterIntegrations: "Directori d'integracions d'Astro",
	resultsFooterThemes: "Galeria de temes d'Astro",
	resultsFooterDiscord: "Uneix-te'n a nosaltres en Discord",
	modal: {
		searchBox: {
			resetButtonTitle: 'Esborrar la consulta de cerca',
			resetButtonAriaLabel: 'Esborrar la consulta de cerca',
			cancelButtonText: 'Cancel·lar',
			cancelButtonAriaLabel: 'Cancel·lar',
		},
		startScreen: {
			recentSearchesTitle: 'Recents',
			noRecentSearchesText: "No n'hi han cerques recents",
			saveRecentSearchButtonTitle: 'Emmagatzemar aquesta cerca',
			removeRecentSearchButtonTitle: "Esborrar aquesta cerca de l'historial",
			favoriteSearchesTitle: 'Preferits',
			removeFavoriteSearchButtonTitle: 'Esborrar aquesta cerca de preferits',
		},
		errorScreen: {
			titleText: 'No es poden recuperar els resultats',
			helpText: 'És posible que desitgis verificar la teva conexió de red.',
		},
		footer: {
			selectText: 'per seleccionar',
			selectKeyAriaLabel: "Tecla d'entrada",
			navigateText: "per navegar",
			navigateUpKeyAriaLabel: 'Fletxa cap amunt',
			navigateDownKeyAriaLabel: 'Fletxa cap abaix',
			closeText: 'per tancar',
			closeKeyAriaLabel: "Tecla d'escapament",
			searchByText: 'Cerca per',
		},
		noResultsScreen: {
			noResultsText: 'No n¡hi han resultats per',
			suggestedQueryText: 'Prova buscar',
			reportMissingResultsText: "Creus què aquesta consulta deuria retornar resultats?",
			reportMissingResultsLinkText: 'Fes-ne saber.',
		},
	},
});
