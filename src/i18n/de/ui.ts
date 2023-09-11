import { UIDictionary } from '../translation-checkers';

export default UIDictionary({
	'a11y.skipLink': 'Zum Inhalt springen',
	'a11y.sectionLink': 'Abschnitt betitelt',
	'navbar.a11yTitle': 'Haupt',
	// Site settings
	'site.title': 'Astro-Dokumentation',
	'site.description': 'Erstelle schnellere Websites mit weniger ausgeliefertem JavaScript.',
	'site.og.imageAlt':
		'Astro-Logo im Weltraum mit Sternen und einem violetten, Saturn-ähnlichen Planeten rechts im Vordergrund',
	// Left Sidebar
	'leftSidebar.a11yTitle': 'Primär',
	'leftSidebar.learnTab': 'Lernen',
	'leftSidebar.referenceTab': 'Referenz',
	'leftSidebar.viewInEnglish': 'Auf Englisch ansehen',
	// Right Sidebar
	'rightSidebar.a11yTitle': 'Sekundär',
	'rightSidebar.onThisPage': 'Auf dieser Seite',
	'rightSidebar.overview': 'Überblick',
	'rightSidebar.community': 'Community',
	'rightSidebar.joinDiscord': 'Tritt unserem Discord bei',
	'rightSidebar.readBlog': 'Lies unsere Blog-Beiträge',
	'rightSidebar.openCollective': 'Unsere Open Collective-Seite',
	'rightSidebar.contribute': 'Wirke mit',
	'rightSidebar.contributorGuides': 'Leitfäden für Mitwirkende',
	'rightSidebar.editPage': 'Bearbeite diese Seite',
	'rightSidebar.translatePage': 'Übersetze diese Seite',
	'rightSidebar.github': 'Astro Docs auf GitHub',
	  // Footer
 	'footer.privacyPolicy': 'Datenschutzerklärung',
	// `<ThemeToggleButton>` acessibility labels
	'themeToggle.useLight': 'Nutze das helle Theme',
	'themeToggle.useDark': 'Nutze das dunkle Theme',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': 'Nächste Seite',
	'articleNav.prevPage': 'Zurück',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': 'Hinzugefügt in:',
	'since.new': 'Neu',
	// Installation Guide
	'install.autoTab': 'Automatische Installation',
	'install.manualTab': 'Manuelle Installation',
	// `<DeployGuidesNav>` vocabulary
	'deploy.sectionTitle': 'Veröffentlichungs-Anleitungen',
	'deploy.altSectionTitle': 'Weitere Veröffentlichungs-Anleitungen',
	'deploy.filterLabel': 'Nach Art filtern',
	'deploy.ssrTag': 'SSR',
	'deploy.staticTag': 'Statisch',
	// CMS Guides vocabulary
	'cms.navTitle': 'Weitere CMS-Anleitungen',
  	// Migration Guides vocabulary
  	'migration.navTitle': 'Weitere Migrations-Anleitungen',
  	// Recipes vocabulary
 	'recipes.navTitle': 'Weitere Anleitungen',
  	// `<RecipeLinks>` vocabulary
	'recipesLink.singular': 'Verwandte Anleitung:',
  	'recipesLink.plural': 'Verwandte Anleitungen',
	// `<ContributorList>` fallback text
	'contributors.seeAll': 'Alle Mitwirkenden ansehen',
	// Fallback content notice shown when a page is not yet translated
	'fallbackContent.notice':
		'Da diese Seite noch nicht auf Deutsch verfügbar ist, siehst du sie auf Englisch. Möchtest du uns helfen?',
	'fallbackContent.linkText': 'Übersetze diese Seite',
	// 404 Page
	'404.title': 'Nicht gefunden',
	'404.content': 'Diese Seite befindet sich nicht in unserem Sonnensystem.',
	'404.linkText': 'Bring mich nach Hause.',
	// Aside component default labels
	'aside.note': 'Hinweis',
	'aside.tip': 'Tipp',
	'aside.caution': 'Achtung',
	'aside.danger': 'Gefahr',
	// `<LanguageSelect>` vocabulary
	'languageSelect.label': 'Sprache auswählen',
  	// Integrations vocabulary
	'integrations.changelog': 'Changelog',
	'integrations.footerTitle': 'Weitere Integrationen',
	'integrations.renderers': 'UI-Frameworks',
	'integrations.adapters': 'SSR-Adapter',
	'integrations.others': 'Sonstiges',
  	// Checklist component
	'checklist.or': 'oder',
  	// Multiple Choice component
	'multipleChoice.defaultCorrect': 'Korrekt!',
  	'multipleChoice.defaultIncorrect': "Versuch's nochmal!",
  	'multipleChoice.submitLabel': 'Absenden',
  	// Tutorial Progress
	'progress.todo': 'To-do',
  	'progress.done': 'Erledigt',
  	// Tutorial Navigation
  	'tutorial.trackerLabel': 'Tutorial Tracker',
	'tutorial.unit': 'Teil',
  	// Tutorial
	'tutorial.getReady': 'Mach dich bereit, …',
	// Feedback Fish widget
	'feedback.button': 'Gib uns Feedback',
	'feedback.a11yLabel': 'Feedback-Formular',
	'feedback.formTitle': 'Worum geht es?',
	'feedback.categoryGroupLabel': 'Feedback-Typ wählen',
	'feedback.issue': 'Problem',
	'feedback.createIssue': 'Issue auf GitHub erstellen',
	'feedback.idea': 'Idee',
	'feedback.other': 'Sonstiges',
	'feedback.messageA11yLabel': 'Nachricht',
	'feedback.placeholder': 'Was sollen wir wissen?',
	'feedback.submit': 'Feedback abschicken',
	'feedback.close': 'Feedback-Formular schließen',
	'feedback.success': 'Danke! Wir haben dein Feedback bekommen.',
  	// `<FileTree>` component
  	'fileTree.directoryLabel': 'Verzeichnis',
  	// Code snippet vocabulary
  	'expressiveCode.terminalWindowFallbackTitle': 'Terminal-Fenster',
  	'expressiveCode.copyButtonTooltip': 'In Zwischenablage kopieren',
  	'expressiveCode.copyButtonCopied': 'Kopiert!',
  	// Backend Guides vocabulary
  	'backend.navTitle': 'Weitere Backend-Anleitungen',
  	// Stubs vocabulary
	'stub.title': 'Erweitere diese Anleitung!',
	'stub.subtitle': 'Diese Anleitung ist ein Entwurf.',
 	'stub.description.migration': 'Möchtest du zu dieser Anleitung beitragen? Hast du einen Blogbeitrag, ein Video oder eine andere Informationsquelle über die Migration von dieser Technologie zu Astro, die du teilen möchtest?',
	'stub.description.cms': 'Weißt du mehr darüber, wie man dieses CMS mit Astro verwenden kann?',
 	'stub.description.backend': 'Weißt du mehr darüber, wie man diesen Backend-Dienst mit Astro verwenden kann?',
});
