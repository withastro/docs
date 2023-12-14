import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: 'Buscar',
	placeholder: 'Buscar en la documentación',
	shortcutLabel: 'Presiona / para buscar',
	resultsFooterLede: '¿Buscas una integración o tema de Astro? ¿Necesitas más ayuda?',
	resultsFooterIntegrations: 'Directorio de integraciones de Astro',
	resultsFooterThemes: 'Galeria de temas de Astro',
	resultsFooterDiscord: 'Únete a nosotros en Discord',
	modal: {
		searchBox: {
			resetButtonTitle: 'Borrar la consulta de búsqueda',
			resetButtonAriaLabel: 'Borrar la consulta de búsqueda',
			cancelButtonText: 'Cancelar',
			cancelButtonAriaLabel: 'Cancelar',
		},
		startScreen: {
			recentSearchesTitle: 'Recientes',
			noRecentSearchesText: 'No hay búsquedas recientes',
			saveRecentSearchButtonTitle: 'Guardar esta búsqueda',
			removeRecentSearchButtonTitle: 'Eliminar esta búsqueda del historial',
			favoriteSearchesTitle: 'Favoritos',
			removeFavoriteSearchButtonTitle: 'Eliminar esta búsqueda de favoritos',
		},
		errorScreen: {
			titleText: 'No se pueden recuperar los resultados',
			helpText: 'Es posible que desees verificar tu conexión de red.',
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
