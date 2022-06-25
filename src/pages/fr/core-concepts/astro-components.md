---
layout: ~/layouts/MainLayout.astro
title: Composants
description: Une introduction à la syntaxe des composants en .astro.
---

**Les composants Astro** sont les blocs de base de tout projet Astro. Il permettent de mettre en forme uniquement avec du HTML, sans code exécuté sur le navigateur.

La syntaxe des composants Astro est une surcouche du HTML. Elle a été conçue pour [ressembler à HTML et JSX](/fr/comparing-astro-vs-other-tools/#astro-vs-jsx), et ajoute la possibilité d'inclure des composants et des expressions JavaScript. Vous pouvez identifier un composant Astro par son extension de fichier : `.astro`.

Les composants Astro sont extrêmement flexibles. Il y a souvent des composants qui contiennent des **UI réutilisables sur la page**, comme un header ou un profil. D'autres composants peuvent contenir un morceau de HTML, comme un ensemble de balises `<meta>` qui facilitent la SEO. Les composants Astro peuvent aussi contenir une mise en page entière (appelée _Layout_).

La chose la plus importante à savoir sur les composants Astro est qu'ils **produisent leur rendu HTML durant la compilation**. Cela signifie que même si vous utilisez du JavaScript dans vos composants, tout sera exécuté pendant la compilation. Le résultat sera un site plus rapide, avec aucun chargement de JavaScript ajouté par défaut.

## Vue d'ensemble des composants

Un composant Astro est composé de deux parties principales : le **Script du composant** et le **Template du composant**. Chacune de ces parties s'occupe de faire une tâche différente, mais ensemble, constituent un cadre facile d'utilisation et assez expressif pour gérer n'importe quelle situation.

```astro
---
// Script du composant (JavaScript)
---
<!-- Template du composant (HTML + Expressions JS) -->
```

Vous pouvez utiliser des composants dans d'autres composants, pour construire des interfaces plus avancées. Par exemple, un composant `Button` peut être utilisé pour créer un composant `ButtonGroup` comme ceci :

```astro
---
// Example: ButtonGroup.astro
import Button from './Button.astro';
---
<div>
  <Button title="Button 1" />
  <Button title="Button 2" />
  <Button title="Button 3" />
</div>
```

### Le script du composant

Astro utilise des barres de code (`---`) pour identifier le script du composant dans votre composant Astro. Si vous avez déjà écrit du Markdown avant, vous pourriez être déjà familier avec un concept similaire appelé *frontmatter*. Astro est directement inspiré de cela.

Vous pouvez utiliser le script du composant pour écrire du code JavaScript qui vous aidera à construire votre template. Cela peut inclure :

- Importer d'autres composants Astro
- Importer des composants de Framework, comme React
- Importer des données, comme un fichier JSON
- Récupérer le contenu d'une API ou une base de données
- Créer des variables que vous voulez référencer dans votre template

```astro
---
// Note: Les importations doivent être placées en haut de votre fichier.
import SomeAstroComponent from '../components/SomeAstroComponent.astro';
import SomeReactComponent from '../components/SomeReactComponent.jsx';
import someData from '../data/pokemon.json';

// Acceder aux propriétés passées dans le composant, comme `<X title="Hello, World" />`
const {title} = Astro.props;
// Récupérer des données externes, même depuis une API privée ou une base de données
const data = await fetch('SOME_SECRET_API_URL/users').then(r => r.json());
---
<!-- Votre template ici ! -->
```

Les barrières de code sont conçues pour garantir que le code JavaScript que vous écrivez à l’intérieur "ne puisse pas s'échapper". Ce code n'apparaîtra pas dans le code final de votre page, il ne sera pas visible par l'utilisateur. Vous pouvez écrire du code JavaScript coûteux (en terme de performance) ou sensible (comme un appel à votre base de données privée) sans vous inquiéter de ce qui finit dans le navigateur de l'utilisateur.

:::tip
Vous pouvez également écrire du TypeScript dans votre script de composant !
:::

### Le template du composant

En dessous du script du composant se trouve le template du composant. Le template du composant définit le HTML de sortie de votre composant.

Si vous écrivez du HTML simple ici, votre composant affichera cet HTML dans toutes les pages où il est importé et utilisé.

De plus, la syntaxe du template du composant Astro prend également en charge les **expressions JavaScript**, les **composants importés** et les [**directives spéciales Astro**](/fr/reference/directives-reference/). Les données et les valeurs définies (à la compilation) dans le script du composant peuvent être utilisées dans le template du composant pour produire du HTML dynamiquement.

```astro
---
// Votre script du composant ici !
import ReactPokemonComponent from '../components/ReactPokemonComponent.jsx';
const myFavoritePokemon = [/* ... */];
---
<!-- les commentaires HTML sont supportés ! -->

<h1>Hello, world!</h1>

<!-- Utilisez les propriétés et autres variables du script du composant : -->
<p>Mon pokemon favoris est : {Astro.props.title}</p>

<!-- Incluez d'autres composants avec une directive `client:` pour l'hydrater : -->
<ReactPokemonComponent client:visible />

<!-- Mixez HTML avec des expressions JavaScript, similaire à JSX : -->
<ul>
  {myFavoritePokemon.map((data) => <li>{data.name}</li>)}
<ul>

<!-- Utilisez une directive `template:` pour injecter un code HTML sans l'échapper : -->
<p set:html={rawHTMLString} />
```

### Expressions dynamiques JSX

Les composants Astro peuvent également définir des variables locales dans le script du composant. Toutes les variables sont alors automatiquement disponibles dans le template HTML du composant juste en dessous.

#### Valeurs dynamiques

Ces variables locales peuvent être utilisées dans des accolades pour passer des valeurs à utiliser comme texte HTML :

```astro
---
const name = "Astro";
---
<div>
  <h1>Hello {name}!</h1>
</div>
```

#### Attributs dynamiques

Ces variables locales peuvent être utilisées dans des accolades pour passer des valeurs à utiliser comme attributs d'éléments HTML et de composants :

```astro
---
const name = "Astro";
---
<h1 class={name}>Les expressions d'attributs sont prises en charge</h1>

<MyComponent templateLiteralNameAttribute={`MonNomEst${name}`} />
```

#### HTML dynamique

Ces variables locales peuvent être utilisées dans des fonctions ressemblantes au JSX pour produire dynamiquement des éléments HTML :

```astro
---
const items = ["Chien", "Chat", "Ornithorynque"];
---
<ul>
  {items.map((item) => (
    <li>{item}</li>
  ))}
</ul>
```

#### Fragments & valeurs multiples

Un composant Astro peut faire le rendu de plusieurs éléments sans avoir à les entourer d'une balise `<div>` ou `<>`, contrairement au JavaScript ou JSX.

```astro
---
// Template avec plusieurs éléments
---
<p>Pas besoin d'entourer les éléments avec un élément conteneur.</p>
<p>Astro supporte plusieurs éléments racines dans son Template.</p>
```

Par contre, quand vous utilisez une expression pour créer plusieurs éléments, vous devez entourer ces éléments d'un **Fragment** comme vous le feriez dans du JavaScript ou du JSX. Astro permet l'utilisation de `<Fragment> </Fragment>` ou des `<> </>`.

```astro
---
const items = ["Chien", "Chat", "Ornithorynque"];
---
<ul>
  {items.map((item) => (
    <>
      <li>Red {item}</li>
      <li>Blue {item}</li>
      <li>Green {item}</li>
    </>
  ))}
</ul>
```

Les Fragments peuvent aussi être utiles pour éviter d'utiliser des éléments conteneurs lors de l'ajout des [directives `set:*`](/fr/reference/directives-reference/#sethtml), comme dans l'exemple suivant :

```astro
---
const htmlString = '<p>Contenu HTML</p>';
---
<Fragment set:html={htmlString} />
```

### Propriétés de composants

Un composant Astro peut définir et accepter des propriétés. Ces propriétés sont alors disponibles dans le template du composant pour le rendu du HTML. Les propriétés sont disponibles dans la variable globale `Astro.props` dans le script de composant.

Voici un exemple de composant qui reçoit une propriété `greeting` et une propriété `name`. Notez que les propriétés à recevoir sont obtenues via la destructuration de l'objet global `Astro.props`

```astro
---
// Example : GreetingHeadline.astro
// Utilisation : <GreetingHeadline greeting="Salutation" name="Partenaire" />
const { greeting, name } = Astro.props
---
<h2>{greeting}, {name} !</h2>
````

Vous pouvez aussi définir vos propres propriétés et leur type avec TypeScript en exposant une interface `Props`. Astro va automatiquement récupérer toutes les interfaces `Props` exportées pour vous avertir s'il y a des erreurs de type dans votre projet. Des valeurs par défaut peuvent aussi être définies pour ces propriétés lors de la destructuration de `Astro.props`.

```astro
---
// src/components/GreetingHeadline.astro
export interface Props {
  name: string;
  greeting?: string;
}

const { greeting = "Salut", name } = Astro.props as Props;
---
<h2>{greeting}, {name} !</h2>
```

Ce composant, lorsqu'il est importé et utilisé dans d'autres composants Astro, Layouts ou Pages, peut recevoir ces propriétés définies sous forme d'attributs :

```astro
---
// src/components/GreetingCard.astro
import GreetingHeadline from './GreetingHeadline.astro';
const name = "Astro"
---
<h1>Carte de bienvenue</h1>
<GreetingHeadline greeting="Hey" name={name} />
<p>J'espère que vous passez une exellente journée !</p>
```

### Emplacements

L'élément `<slot />` est un espace réservé pour du HTML externe, vous permettant d'injecter (ou "insérer" de l'anglais "Slot") des éléments HTML enfants depuis d'autres fichiers dans votre template de composant.

Par défaut, tout élément enfant d'un composant Astro est inséré dans son `<slot />`.

:::note
Contrairement aux _propriétés_, qui sont les attributs accessibles avec `Astro.props()` dans un composant Astro, les _Slots_ affichent directement des éléments HTML là où ils sont écrits.
:::

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{title}</h1>
  <slot />  <!-- l'enfant ira ici -->
  <Footer />
</div>
```

```astro
---
// src/pages/fred.astro
import Wrapper from '../components/Wrapper.astro';
---

<Wrapper title="Page de Fred">
  <h2>Tout ce qui est a savoir sur Fred</h2>
  <p>Voici quelques truc à propos de Fred.</p>
</Wrapper>
```

Ce modèle de structure est la base d'un composant de "_Layout_" Astro : une page entière de HTML peut être « englobée » par des balises `<Layout></Layout>` et envoyée au composant `Layout` pour être affichée dans des éléments de page communs.

#### Emplacements nommés

Un composant Astro peut aussi avoir des "Slots" nommés. Cela vous permet de passer à un _Slot_ uniquement les éléments HTML avec un nom de _Slot_ correspondant.

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <slot name="after-header"/>  <!-- l'enfant avec l'attribut `slot="after-header"` ira ici -->
  <Logo />
  <h1>{title}</h1>
  <slot />  <!-- l'enfant sans l'attibut `slot`, ou avec l'attribut `slot="default"` ira ici -->
  <Footer />
  <slot name="after-footer"/>  <!-- l'enfant avec l'attribut `slot="after-footer"` ira ici -->
</div>
```

```astro
---
// src/pages/fred.astro
import Wrapper from '../components/Wrapper.astro';
---

<Wrapper title="Page de Fred">
  <img src="https://my.photo/fred.jpg" slot="after-header">
  <h2>Tout ce qui est a savoir sur Fred</h2>
  <p>Voici quelques truc à propos de Fred.</p>
  <p slot="after-footer">Copyright 2022</p>
</Wrapper>

```

Utilisez un attribut `slot="my-slot"` sur l'élément enfant que vous voulez passer à un emplacement correspondant à `<slot name="my-slot" />` dans votre composant.

:::tip
Les "Slots" nommées peuvent être passés à des Composants de [Framework](/fr/core-concepts/framework-components/) !
:::

#### Contenu par défaut pour les emplacements

Les emplacements peuvent aussi afficher du **contenu par défaut**. Quand aucun enfant correspondant à un emplacement n'est passé à un composant, l'élément `<slot />` affecté affichera ses propres enfants.

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{title}</h1>
  <slot>
    <p>Ceci est mon contenu de remplacement, seulement s'il n'y a pas d'enfants passés dans l'emplacement</p>
  </slot>
  <Footer />
</div>
```

### Styles CSS

Les balises `<style>` CSS sont également permises dans le template du composant.

Elles peuvent être utilisées pour donner un style à vos composants, et toutes les règles de style sont automatiquement limitées pour agir uniquement à l'intérieur du composant. Cela permet d'éviter les conflits de CSS dans de grosses applications.

```astro
---
// Votre script du composant ici !
---
<style>
  /* restreint au composant, les autres balises H1 sur la page restent les mêmes */
  h1 { color: red }
</style>

<h1>Hello, world!</h1>
```

:::caution
Les styles définis ici s'appliquent uniquement au contenu écrit directement dans le template du composant lui-même. Les enfants et tous les composants importés ne seront **pas** stylisés par défaut.
:::

📚 Allez voir notre [Guide des styles](/fr/guides/styling/) pour plus d'informations sur l'application de styles.

### Scripts côté client

Pour envoyer du JavaScript au navigateur sans utiliser un [composant de Framework](/fr/core-concepts/framework-components/) (React, Svelte, Vue, Preact, SolidJS, AlpineJS, Lit) ou une [intégration Astro](https://astro.build/integrations/) (par ex: `astro-XElement`), vous pouvez utiliser une balise `<script>` dans votre template du composant Astro et envoyer du JavaScript au navigateur qui s'exécute dans le contexte global.

Par défaut, les balises `<script>` sont optimisées par Astro.

- Toutes les importations seronts regroupées, vous permettant d'importer des fichiers locaux ou des Modules Node.
- Le Script optimisé sera injecté dans la balise `<head>` de votre page avec la propriétée [`type="module"`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules).
- Si votre composant est utilisé plusieurs fois sur une même page, le Script final l'inclura qu'une seule fois.

:::caution
Vous ne pouvez pas à ce jour écrire du TypeScript dans un composant coté client, _cependant_ vous pouvez importer un fichier TypeScript si vous préférez cette syntaxe.
:::

```astro
<script>
  // Optimisé ! Groupé ! Les imports ESM fonctionnent, même pour les packages npm.
</script>
```

Pour éviter la compression du script, vous pouvez utiliser l'attribut `is:inline`.

```astro
<script is:inline>
  // Va être affiché dans l'HTML exactement comme écrit !
  // Les imports ESM ne seront pas résolus par rapport au fichier.
</script>
```

Plusieurs balises `<script>` peuvent être utilisées dans le même fichier `.astro` en utilisant n'importe quelle combinaison via les méthodes ci-dessus.

:::note
Ajouter `type="module"` ou n'importe quel autre attribut a une balise `<script>` désactivera la compression effectué par Astro par défaut, considérant la balise comme si elle possédait la directive `is:inline`.
:::

📚 Jetez un oeil à notre [référence de directives](/fr/reference/directives-reference/#script--style-directives) pour plus d'informations sur les directives disponibles sur les balises `<script>`.

#### Chargement de scripts externes

**Quand utiliser cette fonctionnalité :** Si votre fichier JavaScript se trouve dans `public/`.

Notez que cette approche ne permet pas à Astro d'appliquer le traitement, le bundling et les optimisations JavaScript qui sont fournis lorsque vous utilisez la méthode d'importation décrite ci-dessous.

```astro
// Chemin absolu vers le fichier JavaScript
<script is:inline src="/some-external-script.js"></script>
```

#### Utilisation des scripts hoistés

**Quand utiliser cette fonctionnalité :** Si votre script externe se trouve dans `src/` _et_ supporte l'importation par module ESM.

Astro détecte ces importations JavaScript côté client, les compile, optimise et ajoute automatiquement le JS au code HTML.

```astro
// importation ESM
<script>
  import './some-external-script.js';
</script>
```

## Étapes suivantes

📚 En savoir plus sur les [composants inclus dans Astro](/fr/reference/api-reference/#built-in-components).

📚 Apprendre à utiliser des [composants de Framework JavaScript](/fr/core-concepts/framework-components/) dans votre projet Astro.
