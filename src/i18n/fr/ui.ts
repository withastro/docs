import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': 'Aller au contenu principal',
	'navbar.a11yTitle': 'Navigation principale',
	// Site settings
	'site.title': 'Documentation Astro',
	'site.description':
		'Compilez des sites plus rapidement avec moins de JavaScript pour vos utilisateurs.',
	'site.og.imageSrc': '/default-og-image.png?v=1',
	'site.og.imageAlt':
		"Logo d'Astro dans l'espace, avec une planète violette dans le style de saturne flottant à droite de l'image.",
	// Left Sidebar
	'leftSidebar.a11yTitle': 'Navigation du site',
	'leftSidebar.learnTab': 'Apprendre',
	'leftSidebar.referenceTab': 'Référence',
	'leftSidebar.viewInEnglish': 'Voir en anglais',
	// Right Sidebar
	'rightSidebar.a11yTitle': 'Table des matières',
	'rightSidebar.onThisPage': 'Sur cette page',
	'rightSidebar.overview': 'Vue générale',
	'rightSidebar.community': 'Communauté',
	'rightSidebar.joinDiscord': 'Rejoindre notre Discord',
	'rightSidebar.readBlog': 'Lire nos articles',
	'rightSidebar.openCollective': 'Notre lien Open Collective',
	'rightSidebar.contribute': 'Contribuer',
	'rightSidebar.contributorGuides': 'Guides des contributeurs',
	'rightSidebar.editPage': 'Modifier cette page',
	'rightSidebar.translatePage': 'Traduire cette page',
	'rightSidebar.github': "La doc d'Astro sur GitHub",
	// `<ThemeToggleButton>` acessibility labels
	'themeToggle.useLight': 'Changer vers le thème clair',
	'themeToggle.useDark': 'Changer vers le thème sombre',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': 'Page suivante',
	'articleNav.prevPage': 'Page précédente',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': 'Ajouté à la version :',
	'since.new': 'Nouveau',
	// Installation Guide
	'install.autoTab': "Automatiquement via l'ILC",
	'install.manualTab': 'Configuration manuelle',
	// `<DeployGuidesNav>` vocabulary
	'deploy.sectionTitle': 'Guides de déploiement',
	'deploy.altSectionTitle': 'Plus de guides de déploiement',
	'deploy.filterLabel': 'Filtrer par type de déploiement',
	'deploy.ssrTag': 'SSR',
	'deploy.staticTag': 'Statique',
	// CMS Guides vocabulary
	'cms.navTitle': 'Plus de guides sur les CMS',
	// Migration Guides vocabulary
	'migration.navTitle': 'Plus de guides sur les migrations',
	// Recipes vocabulary
	'recipes.navTitle': 'Plus de méthodes',
	// `<RecipeLinks>` vocabulary
	'recipesLink.singular': 'Méthode associée :',
	'recipesLink.plural': 'Méthodes associées',
	// `<ContributorList>` fallback text
	'contributors.seeAll': 'Voir tous les contributeurs',
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice':
		"Cette page est affichée en anglais car elle n'est pas encore disponible dans votre langue. Vous pouvez aider en la traduisant !",
	'fallbackContent.linkText': 'En savoir plus sur la façon de contribuer',
	// 404 Page
	'404.title': 'Page introuvable',
	'404.content': 'Cette page ne fait pas partie de notre système solaire.',
	'404.linkText': 'Ramenez moi à la maison',
	// Aside component default labels
	'aside.note': 'Note',
	'aside.tip': 'Astuce',
	'aside.caution': 'Attention',
	'aside.danger': 'Danger',
	// Feedback Fish widget
	'feedback.button': 'Laissez un commentaire',
	'feedback.a11yLabel': 'Formulaire de commentaires',
	'feedback.formTitle': 'Comment pouvons-nous vous aider ?',
	'feedback.categoryGroupLabel': 'Choisissez le type de commentaire',
	'feedback.issue': 'Problème',
	'feedback.createIssue': 'Créer une issue GitHub',
	'feedback.idea': 'Idée',
	'feedback.other': 'Autres',
	'feedback.messageA11yLabel': 'Message',
	'feedback.placeholder': 'Que faut-il savoir ?',
	'feedback.submit': 'Envoyez des commentaires',
	'feedback.close': 'Fermer le formulaire de commentaires',
	'feedback.success': 'Merci ! Nous avons reçu vos commentaires.',
	// `<FileTree>` component
	'fileTree.directoryLabel': 'Répertoire',
	// Code snippet vocabulary
	'expressiveCode.terminalWindowFallbackTitle': 'Fenêtre du terminal',
	'expressiveCode.copyButtonTooltip': 'Copier dans le presse-papiers',
	'expressiveCode.copyButtonCopied': 'Copié!',
	// Backend Guides vocabulary
	'backend.navTitle': 'Plus de guides sur les services backend',
	// Stubs vocabulary
	'stub.title': 'Développez cette ébauche !',
	'stub.subtitle': 'Ce guide est une ébauche.',
	'stub.description.migration':
		'Vous souhaitez contribuer à ce guide ? Vous avez un article de blog, une vidéo ou une autre ressource à partager sur la migration de cette technologie vers Astro ?',
	'stub.description.cms': "En savoir plus sur l'utilisation de ce CMS avec Astro ?",
	'stub.description.backend': "En savoir plus sur l'utilisation de ce service backend avec Astro ?",
});
