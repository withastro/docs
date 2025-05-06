# Guide de traduction de la version française d'Astro Docs

Ce guide est destiné aux personnes souhaitant participer à la traduction en français de la documentation d'Astro.

Son objectif est d'aider à maintenir une traduction homogène au sein de la documentation et de l'écosystème d'Astro (par exemple [Starlight](https://starlight.astro.build/)).

## 🧩 Participer à la traduction

N'hésitez-pas à rejoindre le [serveur Discord officiel d'Astro](https://astro.build/chat), et notamment le fil [`i18n-fr`](https://discord.com/channels/830184174198718474/971729943786561556), pour obtenir de l'aide, demander des conseils et vous coordonner avec les autres traducteurs.

## 📖 Glossaire

Le glossaire permet d'établir une liste des traductions convenues et des mots ne nécessitant pas de traduction parce que considérés comme propre à Astro ou globalement acceptés.

> [!WARNING]
> Ce glossaire est vivant : n'hésitez pas à l'enrichir quand le besoin se fait sentir !

### 🔄️ Mots ne nécessitant pas de traductions

Les mots se référant à des technologies ne devraient pas être traduits, qu'il s'agisse de langages, de bibliothèques ou de frameworks (p. ex. Markdown, Typescript, React, Svelte, Intellisense, etc.).

#### Concepts d'Astro

| Terme | Condition | Explications/Référence (facultatif) |
|-------|-----------|-------------------------------------|
| Fragment | Lorsqu'il fait référence aux balises `<Fragment> </Fragment>` ou `<> </>`. | La balise ne peut pas être traduite. |
| frontmatter | Tout le temps. | Peut être considéré comme l'en-ête du fichier (Astro ou Markdown), délimité par trois tirets (`---`). Il ne semble pas être traduit ailleurs. |
| props | Lorsqu'il fait référence aux propriétés/attributs d'un composant. | « props » est un terme courant dans la Jamstack, pour faciliter la migration nous avons choisi de ne pas le traduire (ref. [discussion sur Discord](https://discord.com/channels/830184174198718474/971729943786561556/1286078277810782289)). |
| slot | Lorsqu'il est employé en tant que nom et qu'il fait référence à la balise `<slot/>`. | La balise ne peut pas être traduite. |

#### Autres mots non traduits

Il existe d'autres mots ne possédant pas de traduction officielle ou dont le terme recommandé ne fait pas consensus et est peu utilisé ailleurs. Dans ces cas-là, il est préférable de garder le mot anglais qui sera sans doute plus compréhensible.

| Terme | Définition | Explications/Référence (facultatif) |
|-------|------------|-------------------------------------|
| framework | Fait référence à une infrastructure logicielle permettant la conception d'applications (p. ex. : `Angular`, `Vue`, `Svelte`, etc…) | Bien que « cadriciel » soit la traduction officielle, elle est rarement utilisée ailleurs. |
| front-end | Fait référence à l'interface utilisateur d'une application. | Bien que « frontal » soit une traduction possible, elle est rarement utilisée ailleurs. |
| back-end | Fait référence à la partie serveur d'une application. | Bien que « dorsal » soit une traduction possible, elle est rarement utilisée ailleurs. |
| middleware | Désigne un logiciel qui permet de coordonner le fonctionnement de plusieurs logiciels. | Bien que « logiciel médiateur » et « intergiciel » soient les traductions recommandées, elles sont rarement utilisées ailleurs. |
| hook | Désigne un point d'ancrage permettant à l'utilisateur d'exécuter du code à un endroit précis du code source. | « crochet » n'apporte pas suffisamment de sens et il est rarement traduit ailleurs. Précédente discussion : https://github.com/withastro/docs/pull/11593#discussion_r2074976678 |

###  🔤 Traductions courantes

#### Concepts et API d'Astro

| Anglais | Français | Explications/Référence (facultatif) |
|---------|----------|-------------------------------------|
| Astro Islands | Îlots Astro | Précédente discussion : https://github.com/withastro/docs/pull/11593/files#r2074910929 |
| Content Collections | Collections de contenu | |
| Content Layer | Couche de contenu | |
| Fonts | Polices ou Polices d'écriture | |
| Island architecture | Architecture en îles | |
| Sessions | Sessions | |

#### Langage courant

Certains mots ont un équivalent français qui devrait être utilisé uniformément dans les différentes traductions.

| Anglais | Français | Explications/Référence (facultatif) |
|---------|----------|-------------------------------------|
| build | Suivant le contexte : création / construction / compilation. En référence à `astro build`, on privilégiera le terme compilation.  | |
| bundle | regroupement | |
| changelog | journal des modifications | |
| (the) CLI / (the) command line interface | (la) CLI / (l')interface en ligne de commande | |
| client-side | côté client | |
| code fences (`---`) | délimitateur de code | |
| endpoint | point de terminaison | |
| export | exportation | |
| feedback | retour / réaction / commentaire | |
| footer | pied de page | |
| header | en-tête | |
| heading | titre ou en-tête | Nous n'avons pas de consensus (« titre » dans Astro Docs et « en-tête » dans Starlight). Précédente discussion : https://github.com/withastro/starlight/pull/2884#discussion_r1957379942 |
| headless | sans-tête | |
| import | importation | |
| issue | problème ou, en référence à la fonctionnalité de Github, ticket | [MDN](https://developer.mozilla.org/fr/docs/MDN/Community/Issues) utilise également « ticket » pour décrire la fonctionnalité de Github |
| layout | mise en page | |
| on-demand rendering | rendu à la demande | |
| package | paquet | |
| placeholder | paramètre fictif | |
| preset | préréglage | « préconfiguration » pourrait convenir mais dans certains cas la formulation devient lourde. Discuté dans https://github.com/withastro/starlight/pull/3126#discussion_r2046673972 |
| prop | propriété | |
| props | props ou propriétés | En référence à un composant privilégiez « props », autrement utilisez « propriétés » (voir [Concepts d'Astro](#concepts-dastro)) |
| output | sortie ou affichage | |
| re-render | rafraîchir / effectuer un nouveau rendu | |
| recipes | recettes | |
| renderer | moteur de rendu | |
| rendering | rendu / affichage / restitution | |
| repository | dépôt | |
| routing | routage | |
| runtime | Suivant le contexte : moteur d'exécution / environnement d'exécution / au moment de l'exécution | |
| scope | limité / délimité | |
| scoped | à portée limitée | |
| server-side | coté serveur | |
| template | modèle | |
| to build | Suivant le contexte : créer / construire / compiler | |
| to bundle | regrouper | |
| to export | exporter | |
| to fetch | récupérer | |
| to import | importer | |
| to render | rendre / afficher / restituer | |
| to slot | inclure / injecter / insérer | |
| to style | mettre en forme / appliquer des styles | |
| to wrap | englober / envelopper | |
| type safe | sûreté du typage | |
| UI | UI | |
| update | mise à jour | |
| upgrade | mise à niveau | |
| view transitions | transitions de vue | |

> [!NOTE]
> Ces traductions sont des recommandations. Il est parfois acceptable d'utiliser une autre traduction si elle est plus adaptée au contexte ou elle rend la lecture plus fluide en évitant des répétitions.

> [!TIP]
> Il est parfois utile pour faciliter la recherche d'un concept de proposer à certains endroits, avec parcimonie, deux versions couramment utilisées. Par exemple : `a headless CMS` pourrait être traduit de la façon suivante `un CMS sans-tête (ou « headless »)`.

## 📝 Conseils stylistiques

### Les titres

Certains guides de style anglais préconisent l'utilisation de majuscules pour chaque mot d'un titre. Ces règles ne s'appliquent pas en français. Il est donc recommandé de n'utiliser une majuscule qu'en début de titre, à l'exception des noms propres et des composants.

### Les guillemets

Bien que difficilement accessibles sur un clavier, privilégiez les guillements francophones (`« texte »`) aux guillemets doubles (`"texte"`).

Mémo Unicode :
* `«` : <kbd>U+00ab</kbd>
* `»` : <kbd>U+00bb</kbd>

### Code en ligne utilisé comme mot dans une phrase

Dans la version anglaise, vous verrez régulièrement des mots entre accents graves `` ` ``. Cette syntaxe n'a pas toujours de sens en français, il est donc parfois préférable de remplacer le code par un mot français et de rajouter la version code à côté.

**Par exemple :** ``The file `path`...`` devrait être traduit par ``Le chemin du fichier (`path`)...``.

### Liens

#### Internes

Tous les liens doivent rediriger vers la version française, pensez donc à remplacer `/en/` par `/fr/` même si la page de destination n'est pas encore traduite. Vous devez également pensez à traduire la partie après `#`, quand elle existe : elle correspond a l'id généré pour un titre sur la page. Vous pouvez utiliser le serveur de développement pour vérifier l'id généré.

#### Externes

* L'ancre (ou texte) du lien est toujours traduit.
* Le lien ne change pas sauf s'il existe une version française. Il est donc préférable de vérifier le lien au moment de la traduction.
* S'il n'existe pas de version française, il peut être utile de rajouter la langue après le lien (p. ex. `texte du lien (Anglais)`) pour informer le lecteur que la page de destination est dans une autre langue.

### Les exemples

Pour que l'exemple reste compréhensible pour les moins anglophones des lecteurs, il est important de traduire les commentaires. Il peut également être intéressant d'adapter les chemins et les noms des variables si vous jugez que ça facilite la compréhension.

Lorsque vous modifiez un exemple, pensez à vérifier les arguments passés au bloc de code pour également [mettre à jour la mise en évidence](https://expressive-code.com/key-features/text-markers/#usage-in-markdown--mdx) si besoin.

## 📚 Ressources

* En cas de doute pour une traduction, n'hésitez pas à consulter ce qui est fait dans d'autres documentations (MDN, React, Vue, etc.).
* [FranceTerme](https://www.culture.fr/franceterme)
* [Vitrine linguistique de l'Office québécois](https://vitrinelinguistique.oqlf.gouv.qc.ca/) : Bien que destiné aux québecois, les recommandations françaises sont souvent affichées. En utilisant les « termes privilégiés », vous devriez trouver une traduction pouvant convenir à tout le monde.
