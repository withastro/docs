# 📖 Glossaire

Le glossaire est là pour définir les mots, traductions et orientations concernant la traduction Française de la documentation d'Astro

Certains mots jugés comme "intégrant" à Astro n'auront pas de traduction, car étant une part conséquente de son environment

## 🔄️ Mots ne nécessitant pas de traductions

> 💡 Ces mots sont considérés comme des noms propres dû à leurs origines anglaises, prenant toujours une majuscule

| Mot concerné      | Définition | Utilisation |
|-------------------|------------|-------------|
| Template          | Mise en page / construction d'un composant Astro | Dans le context de “Templating” ou “Template” d'un composant |
| Composant Layout  | Composant intégrant à la logique d'Astro, servant de modèle pour une page Astro, simplifiant sa syntaxe | Utilisé quand on parle d'un Composant Layout d'Astro peut s'avérer utile de le mettre entre “crochets”
| Composant Page    | Composant Astro situé dans `src/pages` contenant une syntaxe `<html></html>` complète, sert de fondation pour le routage de base d'Astro | Utilisé dans le contexte d'un "Composant Page Astro" à ne pas confondre avec une “page HTML” qui ne prendra pas de majuscule, car venant du français
| Slot              | `<slot/>` ou emplacement, ce mot est souvent utilisé dans le code pour spécifier où doit se placer un contenu dans le contexte d'héritage ou dans des Frameworks / environnements orienté composants | Peut être spécifié sous cette forme ou sous sa version HTML `<slot/>`. Utilisé pour son utilisation par tous les Frameworks supporté par Astro en plus de lui-même
| Framework         | Mot couramment dans le code pour spécifier un logiciel ou un “Package” utilisant une syntaxe spécifique a son utilisation (ex: `React`, `Vue`, `Svelte`, etc...) | Utilisé dans le cadre des intégrations fournies par Astro intégrant de nombreux environnements différent.
| Node Built-in     | Intégrations construites nativement dans le gestionnaire de packets Node (ex: `node:fs`, `node:path`, etc...) | Les intégrations natives à Astro n'ont pas à utiliser cela, utilisé seulement pour node, étant une syntaxe courante pour cet environnement
| Frontmatter       | Aussi utilisé sous le nom de “Script du Composant”, c'est le code JavaScript placé au entre les barrières `---` dans tout les composants Astro | Peux être utilisé sous le nom de “Script du Composant” quand spécifié, utilisé seulement dans le contexte d'Astro (et les pages markdown d'Astro
| Fragment          | Est un concept lié au code, le plus souvent dans le web ou dans les interfaces, c'est un élément éphémère utilisé pour grouper plusieurs éléments ensembles | Est souvent écris sous sa forme HTML (`<Fragment> </Fragment>` ou `<> </>`) mais peux être spécifié comme tel dans le texte
| Package           | Peux être traduit par “Module” ou “Librairie” par certain, parlant d'un packet NPM, n'as pas besoin de traduction, car couramment utilisé dans le code | Utilisé en parlant d'un paquet NPM ou d'une installation à effectuer pour une intégration Astro
| Build             | Dans le contexte d'un langage utilisant une étape de compilation, on parle de compilation / transpilation | Ce mot est à utiliser que dans le cadre où l'on parle de l'étape de compilation via la commande `astro build` servant à sortir un résultat compatible pour les navigateurs et optimisé par Astro
| Frontend          |
| Backend           |
| Markdown, Astro, JavaScript, TypeScript, React, Vue, Svelte, Lit, Solid | Tous les noms de packages / langages prennent une majuscule, car considérés comme des noms propres à ces environnements | Utilisé partout sur la docs de façon universel, dois toujours porter une majuscule

> Et non je ne parlerais pas du mot “Cadriciel”

## 📚 Traductions courantes

Certains mots dans la traduction ont un équivalent français utilisé uniformément dans les différentes traduction

| Anglais                      | Français                               | Description |
|------------------------------|----------------------------------------|-------------|
| Server-side-rendering        | Rendu Coté Serveur                     |
| Client-side                  | Sur le navigateur / Coté client        |
| Runtime                      | Exécution / Code Exécuté               |
| CLI / Command line interface | ILC / Interface de ligne de commande   |
| Routing                      | Routage                                |
| UI components                | Composants d'interface / Composants UI |
| Code fences (`---`)          | Barres de code                         |
| Imports                      | Importations / Importer / Inclure      |
| Exports                      | Exportations / Exporter                |
| Render / Rendering           | Rendu / Affichage / Sortie             |
| Component Script             | Script du composant                    |
| Component Template           | Template du composant                  |
| Bundle / Bundled             | Regroupé / Groupé / Compacté           |
| Processed                    | Optimisé / Transpilé                   |
| Process                      | Optimise / Processus / Exécute         |
| Warp                         | Englober / Entourer                    |
| Slot (verbe *to slot*)       | Inclure / Injecter / Insérer           |
| Fetch                        | Importer / Récupérer / Chercher        |
| Endpoint                     | Point d'arrêt                          |
| Island architecture          | Architecture Isolée                    |
| Partial Hydration            | Hydratation Partielle                  |
| Scope / Scoped               | Limité / Délimité                      |

> ⚠️ Ce glossaire est encore en travaux, contribuez à la traduction française en apportant des suggestions à celui-ci !
