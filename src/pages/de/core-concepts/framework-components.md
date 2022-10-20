---
layout: ~/layouts/MainLayout.astro
title: Framework Komponenten
description: Lerne wie du React, Svelte, etc. nutzen kannst.
i18nReady: true
---
Erstelle deine Astro Webseite ohne dein favorisiertes Komponenten-Framework aufzugeben.

Astro unterstützt eine Vielzahl von beliebten Frameworks wie [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) und [Lit](https://lit.dev/).

## Integrationen installieren

Astro kommt mit optionalen Integrationen für React, Preact, Svelte, Vue, SolidJS, AlpineJS und Lit. Ein oder mehrere dieser Astro-Integrationen kann in deinem Projekt installiert und konfiguriert werden.

Um Astro für die Verwendung dieser Frameworks zu konfigurieren, installiere zunächst die Integration mit ihren Abhängigkeiten:

```bash
npm install --save-dev @astrojs/react react react-dom
```

Anschließend importiere die Integration und füge die Funktion in deine Liste von Integrationen in der `astro.config.mjs` hinzu:

```js title="astro.config.mjs" ins={3} ins=/(?<!p)react\\(\\)/
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import preact from '@astrojs/preact';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import solid from '@astrojs/solid-js';
import lit from '@astrojs/lit';
import alpine from '@astrojs/alpinejs';

export default defineConfig({
	integrations: [react(), preact(), svelte(), vue(), solid(), lit(), alpine()],
});
```

⚙️ Schaue den [Integrationsleitfaden](/en/guides/integrations-guide/) für mehr Details an und erfahre mehr über das Installieren und Konfigurieren von Astro-Integrationen.

⚙️ Möchtest du ein Beispiel für ein Framework deiner Wahl sehen? Besuche [astro.new](https://astro.new/) und wähle eine Framework-Vorlage.

## Framework-Komponenten nutzen

Nutze deine JavaScript Framework-Komponenten in deinen Astro-Seiten, -Layouts und -Komponenten genauso wie deine Astro-Komponenten. Alle deine Komponenten können zusammen in `/src/components` organisiert werden, oder auf eine andere Weise, die dir gefällt.

Um eine Framework-Komponente zu nutzen, importiere sie relativ in deine Astro-Komponente. Anschließend kannst du die Komponente neben anderen Komponenten, HTML-Elementen und JSX-ähnlichen Ausdrücken im Komponenten-Template verwenden.

```astro title="src/pages/static-components.astro" ins={2,7}
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<html>
  <body>
    <h1>Nutze React-Komponenten direkt in Astro!</h1>
    <MyReactComponent />
  </body>
</html>
```

Standardmäßig werden die Framework-Komponenten als statisches HTML gerendert. Dies ist hilfreich für Template-Komponenten, die nicht interaktiv sind. Dadurch wird verhindert, dass unnötiges JavaScript an den Client gesendet wird.

## Interaktive Komponenten hydratisieren

Eine Framework-Komponenten kann kann aktiviert (hydratisiert) werden, indem die `client:*`-Direktiven verwendet werden. Das ist ein Komponenten-Attribut, welches definiert wie die Komponente **gerendert** und **hydriert** werden soll.

Die [Client-Direktive](/en/reference/directives-reference/#client-directives) beschreibt ob die Komponente zur Build-Zeit gerendet werden soll und wann das JavaScript der Komponente client-seitig durch den Browser geladen werden soll. 

Die meisten Direktiven rendern die Komponenten auf dem Server zur Build-Zeit. Das Komponenten-JS wird entsprechend der angewendeten Direktive an den Client gesendet. Die Komponente wird hydratisiert, wenn ihr JS geladen wurde.

```astro title="src/pages/interactive-components.astro" /client:\S+/
---
// Beispiele: Framework-Komponenten im Browser hydratisiert.
import InteractiveButton from '../components/InteractiveButton.jsx';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
---
<!-- Das JS dieser Komponente wird geladen, wenn die Seite lädt-->
<InteractiveButton client:load />

<!-- Das JS dieser Komponente wird nicht an den Client übertragen solange der User 
 nicht auf der Seite herunterscrollt und die Komponente auf der Seite sichtbar ist -->
<InteractiveCounter client:visible />
```

:::Achtung
Jegliches JS, welches für das Framework der Komponente (z.B. React, Svelt) notwendig ist, wird mit der Seite geladen. Die `client:*`-Direktiven geben lediglich vor wann das _Komponenten JS_ geladen wird und wann die _Komponente_ hydratisiert wird.
:::

:::Hinweis[Barrierefreiheit]
Die meisten Framework-spezifischen Barrierefreiheit-Pattern sollten genauso funktionieren, wenn Sie in Astro verwendet werden. Vergewissere dich, dass du eine client-Direktive verwendest, die sicherstellt, dass das JavaScript für die Barrierefreiheit korrekt geladen und zur richtigen Zeit ausgeführt wird!
:::

### Verfügbare Hydratisierungs-Direktiven 

Es sind einige Hydratisierungs-Direktiven für UI Framework-Komponenten verfügbar: `client:load`, `client:idle`, `client:visible`, `client:media={QUERY}` and `client:only={FRAMEWORK}`.

📚 Schaue unsere [Direktiven-Referenz](/en/reference/directives-reference/#client-directives) Seite für die vollständige Beschreibung der Direktiven sowie deren Nutzung an.

## Frameworks mischen

Du kannst Komponenten aus verschiedenen Frameworks in der selben Astro-Komponente importieren und rendern.

```astro title="src/pages/mixing-frameworks.astro"
---
// Beispiel: Mehrere Framework-Komponenten auf der gleichen Seite verwenden.
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
import MyVueComponent from '../components/MyVueComponent.vue';
---
<div>
  <MySvelteComponent />
  <MyReactComponent />
  <MyVueComponent />
</div>
```

:::Achtung
Nur **Astro**-Komponenten (`.astro`) können Komponenten von verschiedenen Frameworks enthalten.
:::

## Kinder an Framework-Komponenten durchreichen 

Innerhalb einer Astro-Komponenten **kannst** du Kinder an die Framework-Komponente durchreichen. Jedes Framework hat dabei seine eigene Vorgehensweise wie die Kinder referenziert werden sollen: React, Preact und Solid nutzen eine spezielle `children`-prop, wohingegen Svelte und Vue ein `<slot />`-Element nutzen.


```astro title="src/pages/component-children.astro" {5}
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
---
<MyReactSidebar>
  <p>Hier ist eine Sidebar mit etwas Text und einem Button</p>
</MyReactSidebar>
```

Zusätzlich kannst du [Named Slots](/en/core-concepts/astro-components/#named-slots) verwenden, um spezifische Kinder zu gruppieren.

Für React, Preact und Solid werden die Slots in Eigenschaften auf oberster Ebene konvertiert. Slot-Namen in `kebab-case` werden in `camelCase` konvertiert.

```astro title="src/pages/named-slots.astro" /slot="(.*)"/
---
import MySidebar from '../components/MySidebar.jsx';
---
<MySidebar>
  <h2 slot="title">Menü</h2>
  <p>Hier ist eine Sidebar mit etwas Text und einem Button</p>
  <ul slot="social-links">
    <li><a href="https://twitter.com/astrodotbuild">Twitter</a></li>
    <li><a href="https://github.com/withastro">GitHub</a></li>
  </ul>
</MySidebar>
```

```jsx /{props.(title|socialLinks)}/
// src/components/MySidebar.jsx
export default function MySidebar(props) {
  return (
    <aside>
      <header>{props.title}</header>
      <main>{props.children}</main>
      <footer>{props.socialLinks}</footer>
    </aside>
  )
}
```

In Svelte und Vue können diese Slots durch ein `<slot>`-Element mit `name`-Attribut referenziert werden. Slot-Namen in `kebab-case` bleiben erhalten.

```jsx /slot name="(.*)"/
// src/components/MySidebar.svelte
<aside>
  <header><slot name="title" /></header>
  <main><slot /></main>
  <footer><slot name="social-links" /></footer>
</aside>
```

## Framework-Komponenten verschachteln

Innerhalb einer Astro Datei, können Framework-Komponenten ebenfalls hydratisierte Komponenten sein. Das bedeutet, dass du rekursiv Framework-Komponenten verschachteln kannst.

```astro title="src/pages/nested-components.astro" {10-11}
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MyReactButton from '../components/MyReactButton.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---

<MyReactSidebar>
  <p>Hier ist eine Sidebar mit etwas Text und einem Button</p>
  <div slot="actions">
    <MyReactButton client:idle />
    <MySvelteButton client:idle />
  </div>
</MyReactSidebar>
```

:::Achtung
Beachte: Framework-Komponenten selbst (z.B. `.jsx`, `.svelte`) können keine Frameworks mischen.
:::

Dies erlaubt es dir gesamte Anwendungen mit deinem bevorzugten JavaScript Framework zu bauen und sie durch eine Eltern-Komponenten in einer Astro-Seite zu rendern.

:::Hinweis
Astro-Komponenten werden immer als statisches HTML gerendet, sogar wenn sie hydratisierte Framework-Komponenten enthalten. Das bedeutet, dass du nur Argumente weitergeben kannst, die kein HTML-rendering verursachen. Werden z.B. React's "render props" an Framework-Komponenten von einer Astro-Komponente gegeben, wird dies nicht funktionieren, da Astro-Komponenten nicht das Laufzeitverhalten am Client zur 
Verfügung stellen kann, welches dafür benötigt wird. Nutze stattdessen named slots.
:::

## Kann ich Astro-Komponenten innerhalb meiner Framework-Komponenten verwenden?

Jede UI Framework-Komponente wird zu einer "Astro-Insel" dieses Frameworks. Diese Komponenten müssen komplett in validem Framework-Code geschrieben werden und können nur ihre eigenen Importe und Pakete verwenden. Du kannst keine `.astro` Komponenten in eine UI Framework-Komponente (z.B. `.jsx` or `.svelte`) importieren.

Dahingegen kannst du [das Astro `<slot />`-Muster](/en/core-concepts/astro-components/#slots) verwenden, um statischen Inhalt, der von Astro-Komponenten erzeugt wurde, an Kinder in diene Framework-Komponenten  **in** einer `.astro` Komponente zu geben.

```astro title="src/pages/astro-children.astro" {6}
---
import MyReactComponent from  '../components/MyReactComponent.jsx';
import MyAstroComponent from '../components/MyAstroComponent.astro';
---
<MyReactComponent>
  <MyAstroComponent slot="name" />
</MyReactComponent>
```

## Kann ich Astro-Komponenten hydratisieren?

Wenn du versucht eine Astro-Komponente mit einer `client:`-Direktive zu hydratisieren, wirst du einen Fehler erhalten.

[Astro-Komponenten](/en/core-concepts/astro-components/) sind ausschließlich HTML-Komponenten ohne client-seitige Laufzeit. Jedoch kannst du ein `<script>`-Tag verwenden, um im Template deiner Astro-Komponente JavaScript an den Browser zu senden, welches global ausgeführt wird.

📚 Erfahre mehr über den [client-seitigen `<script>`-Tag in Astro-Komponenten](/en/core-concepts/astro-components/#client-side-scripts)

[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
