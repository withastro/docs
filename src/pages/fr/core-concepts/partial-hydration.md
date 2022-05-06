---
layout: ~/layouts/MainLayout.astro
title: Hydratation partielle dans Astro
description: Apprend comment l'hydratation partielle fonctionne dans Astro avec l' "Island Architecture".
---

**Astro va générer n'importe quel site sans aucun JavaScript côté client par défaut.** Utilisez n'importe quel composant frontend que vous voulez ([React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) et [Lit](https://lit.dev/)) et Astro va le générer automatiquement en HTML et enlever tout JavaScript. Cela permet de garder chaque site ultra-rapide par défaut.

```astro
---
// Exemple: Utiliser un composant React statique sur une page, sans JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Aucun JavaScript ! -->
<MyReactComponent />
```

Mais par moments, vous avez besoin d'un composant UI interactif. Quand vous trouvez que vous avez d'un besoin sur la page, Astro ne vous forcera pas à utiliser 100% JavaScript sur la totalité de la page. Au contraire, Astro utilise une technique appelée **partial hydration (ou hydratation partielle)** qui vous permet d' "hydrater" des composants individuels sur la page. Cela signifie que vous n'envoyez que le JavaScript nécessaire pour exécuter votre page.

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

Il y a de nombreux cas où vous avez besoin d'un composant UI interactif pour s'exécuter dans le navigateur :

- Un slider de présentation d'images
- Une barre de recherche avec autocomplétion
- Un bouton pour afficher/masquer une navigation mobile
- Un bouton "Ajouter au panier"

Dans Astro, c'est votre responsabilité de définir les composants qui doivent être hydratés dans le navigateur. Astro ne va hydrater que ce qui est nécessaire pour le fonctionnement de votre site et laisser le reste de votre site en HTML statique. Cette technique est appelée **partial hydration (ou hydratation partielle en français)**.

**l'hydratation partielle est le secret pour lequel Astro est connu comme "fast-by-default" en terme de performances.**

## Architecture Isolée

**Island architecture (ou Architecture Isolée)** est l'idée d'utiliser l'hydratation partielle pour construire des sites en entier. L'architecture isolée est une alternative à la construction de site sous JavaScript qui doit être envoyé au visiteur de celui-ci.

> L'idée générale d'une architecture "isolée" est simple comme bonjour : rendre des pages HTML sur le serveur, et injecter des emplacements ou des espaces restreint autour de régions dynamiques.
> <br/> -- [Islands Architecture: Jason Miller (EN)](https://jasonformat.com/islands-architecture/)

Autre que les avantages évidents de ne pas envoyer de JavaScript au navigateur, il y a deux avantages clés à l'architecture isolée :

- **Les composants sont chargés individuellements.** Les composants plus légers (comme une navigation sur téléphone) ne sont pas bloqués par des composants plus lourds de la page.
- **Les composants sont isolés.** Chaques composants de la page sont isolées, et les performances de la page ne sont pas affectées par les autres.

![diagramme](https://res.cloudinary.com/wedding-website/image/upload/v1596766231/islands-architecture-1.png "Diagramme de l'Architecture Isolée")
