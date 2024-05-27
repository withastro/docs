---
layout: ~/layouts/MainLayout.astro
title: Hydratation Partielle dans Astro
description: Apprend comment l'Hydratation Partielle fonctionne dans Astro avec l' "Island Architecture".
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
---

**Astro génère n'importe quel site sans aucun JavaScript côté client par défaut.** Utilisez un composant de Framework construit avec [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) ou [Lit](https://lit.dev/) et Astro le génèrera automatiquement en HTML, retirant tout JavaScript. Cela permet de garder chaque site ultra-rapide par défaut.

```astro
---
// Exemple: Utiliser un composant React statique sur une page, sans JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Aucun JavaScript ! -->
<MyReactComponent />
```

Mais par moments, vous avez besoin de créer des UIs interactives. Quand c'est le cas, Astro ne vous forcera pas à utiliser du JavaScript sur la totalité de la page. Au contraire, Astro utilise une technique appelée **"Partial Hydration" (ou Hydratation Partielle)** qui vous permet d' "hydrater" des composants individuels sur la page. Cela signifie que vous n'envoyez que le JavaScript nécessaire pour exécuter votre page.

```astro
---
// Exemple: Utiliser un composant React dynamique sur une page.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- Ce composant est maintenant interactif sur votre page !
     Le reste de votre site reste le même. -->
<MyReactComponent client:load />
```

La vaste majorité de votre site est purement en HTML et CSS, avec des **îles d'interactivité** isolées du reste du contenu.

## Hydration Partielle

Il y a de nombreux cas où vous pourriez avoir besoin d'un composant UI interactif qui demande une exécution dans le navigateur :

- Un slider de présentation d'images
- Une barre de recherche avec autocomplétion
- Un bouton pour afficher/masquer une navigation mobile
- Un bouton "Ajouter au panier"

Dans Astro, c'est votre responsabilité de définir les composants qui doivent être hydratés dans le navigateur. Astro ne va hydrater que ce qui est nécessaire pour le fonctionnement de votre site et laisser le reste de votre site en HTML statique.

**L'Hydratation Partielle est le secret pour lequel Astro est connu comme "fast-by-default" en terme de performances.**

## Architecture Isolée

**Island Architecture (ou Architecture Isolée)** est l'idée d'utiliser l'Hydratation Partielle pour construire des sites en entier. L'Architecture Isolée est une alternative à la construction de site sous JavaScript qui doit être envoyé au visiteur de celui-ci.

> L'idée générale d'une Architecture dite "Isolée" est simple comme bonjour : Rendre les pages HTML sur le serveur, et injecter des emplacements ou des espaces restreints autour de régions dynamiques.
> <br/> -- [Islands Architecture: Jason Miller (EN)](https://jasonformat.com/islands-architecture/)

Autre que les avantages évidents de ne pas envoyer de JavaScript au navigateur, il y a deux avantages clés à l'Architecture Isolée :

- **Les composants sont chargés individuellement.** Les composants plus légers (comme une navigation sur téléphone) ne sont pas bloqués par des composants plus lourds de la page.
- **Les composants sont isolés.** Chaque composant de la page sont isolés, les performances de la page ne seront donc pas affectées par les autres.

<IslandsDiagram>
    <Fragment slot="headerApp">Header "app"</Fragment>
    <Fragment slot="sidebarApp">Sidebar "app"</Fragment>
    <Fragment slot="main">
        Contenu HTML rendu côté serveur comme du texte, des images, etc...
    </Fragment>
    <Fragment slot="carouselApp">Carrousel d'images "app"</Fragment>
    <Fragment slot="advertisement">Publicitée<br/>(rendu côté serveur)</Fragment>
    <Fragment slot="footer">Footer (HTML rendu côté serveur)</Fragment>
</IslandsDiagram>

_Source: [Islands Architecture: Jason Miller (EN)](https://jasonformat.com/islands-architecture/)_
