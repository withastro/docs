import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: 'Rechercher',
	placeholder: 'Rechercher dans la documentation',
	shortcutLabel: 'Appuyez sur / pour rechercher',
	modal: {
		searchBox: {
			resetButtonTitle: 'Effacer la recherche',
			resetButtonAriaLabel: 'Effacer la recherche',
			cancelButtonText: 'Annuler',
			cancelButtonAriaLabel: 'Annuler',
		},
		startScreen: {
			recentSearchesTitle: 'Recherches récentes',
			noRecentSearchesText: 'Aucune recherche récente',
			saveRecentSearchButtonTitle: 'Sauvegarder cette recherche',
			removeRecentSearchButtonTitle: "Enlever cette recherche de l'historique",
			favoriteSearchesTitle: 'Favoris',
			removeFavoriteSearchButtonTitle: 'Enlever cette recherche des favoris',
		},
		errorScreen: {
			titleText: 'Erreur lors de la récupération des résultats',
			helpText: "Vous devriez vérifier l'état de votre connection internet.",
		},
		footer: {
			selectText: 'pour sélectionner',
			selectKeyAriaLabel: 'Appuyez sur la touche',
			navigateText: 'pour naviguer',
			navigateUpKeyAriaLabel: 'Flèche du haut',
			navigateDownKeyAriaLabel: 'Flèche du bas',
			closeText: 'pour fermer',
			closeKeyAriaLabel: "Touche d'échappement",
			searchByText: 'Recherche via',
		},
		noResultsScreen: {
			noResultsText: 'Aucun résultat trouvé pour',
			suggestedQueryText: 'Essayez de rechercher pour',
			reportMissingResultsText: 'Vous pensez avoir trouvé une erreur ?',
			reportMissingResultsLinkText: 'Faites-le nous savoir.',
		},
	},
});
