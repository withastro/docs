import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: 'Trobar',
	placeholder: 'Trobar en la documentació',
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
			selectText: 'para seleccionar',
			selectKeyAriaLabel: 'Tecla de entrada',
			navigateText: 'para navegar',
			navigateUpKeyAriaLabel: 'Flecha hacia arriba',
			navigateDownKeyAriaLabel: 'Flecha hacia abajo',
			closeText: 'para cerrar',
			closeKeyAriaLabel: 'Tecla de escape',
			searchByText: 'Búsqueda por',
		},
		noResultsScreen: {
			noResultsText: 'No hay resultados para',
			suggestedQueryText: 'Intenta buscar',
			reportMissingResultsText: '¿Crees que esta consulta debería devolver resultados?',
			reportMissingResultsLinkText: 'Háganos saber.',
		},
	},
});
