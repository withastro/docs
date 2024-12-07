import { navDictionary } from '../../util/navDictionary';

export default navDictionary({
	start: 'Démarrage',
	'start.welcome': 'Bienvenue le monde !',
	'start.newProject': 'Démarrer un nouveau projet',
	'start.config': 'Configuration',
	'start.migrate': 'Migrer vers Astro',

	guides: 'Guides et recettes',
	'guides.routing': 'Routage et navigation',
	'guides.ui': 'Construire votre UI',
	'guides.content': 'Ajouter du contenu à votre site',
	'guides.serverRendering': 'Rendu du serveur',
	'guides.upgrade': 'Mise à niveau',
	'guides.upgrade.major': 'Guides de mise à niveau majeurs',
	'guides.recipes': 'Recettes pratiques',

	reference: 'Référence',
	'reference.runtime': "API d'exécution",
	'reference.other': 'Autres API de développement',
	'reference.syntax': 'Syntaxe des modèles Astro',
	'reference.experimental': 'Fonctionnalités expérimentales',

	integrations: 'Intégrations',
	'integrations.ui': 'Frameworks UI',
	'integrations.adapters': 'Adaptateurs',
	'integrations.other': 'Autres intégrations officielles',

	thirdParty: 'Services tiers',
	'thirdParty.deployment': 'Guides de déploiement',
	'thirdParty.cms': 'Systèmes de gestion de contenu',
	'thirdParty.backend': 'Services back-end',
	'thirdParty.media': 'Médias hébergés et DAM',
});
