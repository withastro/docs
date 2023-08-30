# 📖 Glossaire

Le glossaire est là pour définir les mots, traductions et orientations concernant la traduction française de la documentation d'Astro.

Certains mots jugés comme "inhérents" à Astro n'auront pas de traduction, car étant une part conséquente de son environnement.

## 🔄️ Mots ne nécessitant pas de traductions

> 💡 Ces mots sont considérés comme des noms propres dû à leurs origines anglaises, prenant toujours une majuscule :

| Mot concerné      | Définition | Utilisation |
|-------------------|------------|-------------|
| Template          | Mise en page / construction d'un composant Astro | Dans le contexte de “Templating” ou “Template” d'un composant |
| Composant Layout  | Composant inhérent à la logique d'Astro, servant de modèle pour une page Astro, simplifiant sa syntaxe | Utilisé quand on parle d'un Composant Layout d'Astro, cela peut s'avérer utile de le mettre entre “crochets”
| Composant Page    | Composant Astro situé dans `src/pages` contenant une syntaxe `<html></html>` complète, sert de fondation pour le routage de base d'Astro | Utilisé dans le contexte d'un "Composant Page Astro" à ne pas confondre avec une “page HTML” qui ne prendra pas de majuscule, car venant du français
| Slot              | `<slot/>` ou emplacement, ce mot est souvent utilisé dans le code pour spécifier où doit se placer un contenu dans le contexte d'héritage ou dans des Frameworks / environnements orientés composants | Peut être spécifié sous cette forme ou sous sa version HTML `<slot/>`. Utilisé pour son utilisation par tous les Frameworks supportés par Astro en plus de lui-même
| Framework         | Mot couramment dans le code pour spécifier un logiciel ou un “Package” utilisant une syntaxe spécifique à son utilisation (ex: `React`, `Vue`, `Svelte`, etc...) | Utilisé dans le cadre des intégrations fournies par Astro intégrant de nombreux environnements différents.
| Node Built-in     | Intégrations construites nativement dans le gestionnaire de paquets Node (ex: `node:fs`, `node:path`, etc...) | Les intégrations natives à Astro n'ont pas à utiliser cela, utilisé seulement pour node, étant une syntaxe courante pour cet environnement
| Frontmatter       | Aussi utilisé sous le nom de “Script du Composant”, c'est le code JavaScript placé entre les tirets `---` dans tous les composants Astro | Peut être utilisé sous le nom de “Script du Composant” si spécifié, utilisé seulement dans le contexte d'Astro (et les pages markdown d'Astro)
| Fragment          | Concept lié au code, le plus souvent dans le web ou dans les interfaces, c'est un élément éphémère utilisé pour regrouper plusieurs éléments ensembles | Est souvent écrit sous sa forme HTML (`<Fragment> </Fragment>` ou `<> </>`) mais peut être spécifié comme tel dans le texte
| Package           | Peut être traduit par “Module” ou “Librairie” par certains, en parlant d'un packet NPM, n'a pas besoin de traduction, car couramment utilisé dans le code | Utilisé en parlant d'un paquet NPM ou d'une installation à effectuer pour une intégration Astro
| Build             | Dans le contexte d'un langage utilisant une étape de compilation, on parle de compilation / transpilation | Ce mot est à utiliser lorsqu'on parle de l'étape de compilation via la commande `astro build` servant à produire un résultat compatible pour les navigateurs et optimisé par Astro
| Frontend          |
| Backend           |
| Markdown, Astro, JavaScript, TypeScript, React, Vue, Svelte, Lit, Solid | Tous les noms de packages / langages prennent une majuscule, car considérés comme des noms propres à ces environnements | Utilisé partout sur la doc de façon universelle, doit toujours porter une majuscule |

> Et non je ne parlerai pas du mot “Cadriciel”.

## 📚 Traductions courantes

Certains mots dans la traduction ont un équivalent français utilisé uniformément dans les différentes traductions :

| Anglais                      | Français                                  |
|------------------------------|-------------------------------------------|
| Server-side-rendering        | Rendu Coté Serveur                        |
| Client-side                  | Sur le navigateur / Coté client           |
| Runtime                      | Exécution / Code Exécuté                  |
| CLI / Command line interface | ILC / Interface de ligne de commande      |
| Routing                      | Routage                                   |
| UI components                | Composants d'interface / Composants UI    |
| Code fences (`---`)          | Barres de code / Triples tirets           |
| Imports                      | Imports / Importer / Inclure              |
| Exports                      | Exports / Exporter                        |
| Render / Rendering           | Rendu / Affichage / Sortie                |
| Re-render                    | Rafraîchir / Effectuer à nouveau un rendu | 
| Component Script             | Script du composant                       |
| Component Template           | Template du composant                     |
| Bundle / Bundled             | Regroupé / Groupé / Compacté              |
| Processed                    | Optimisé / Transpilé                      |
| Process                      | Optimise / Processus / Exécute            |
| Wrap                         | Englober / Entourer                       |
| Slot (verbe *to slot*)       | Inclure / Injecter / Insérer              |
| Fetch                        | Importer / Récupérer / Chercher           |
| Endpoint                     | Point de terminaison                      |
| Island architecture          | Architecture Isolée                       |
| Partial Hydration            | Hydratation Partielle                     |
| Scope / Scoped               | Limité / Délimité                         |
| Astro Islands                | Îles Astro                                |

> ⚠️ Ce glossaire est encore en travaux, merci de contribuer à la traduction française en lui apportant des suggestions !
