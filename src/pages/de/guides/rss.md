---
layout: ~/layouts/MainLayout.astro
title: RSS
description: Eine Einführung in RSS in Astro.
---

Astro unterstützt schnelle, automatische RSS-Feed-Generierung für Blogs und andere Content-Seiten. Für mehr Informationen über RSS-Feeds im Allgemeinen, siehe [aboutfeeds.com](https://aboutfeeds.com/).

## Einrichten von `@astrojs/rss`

Das `@astrojs/rss`-Paket bietet Hilfsfunktionen zur Erzeugnung von RSS-Feeds mithilfe von [API-Endpunkten](/de/core-concepts/astro-pages/#nicht-html-seiten). Dies ermöglicht _sowohl_ statische Erstellungen als auch On-Demand-Generierung bei Verwendung eines [SSR-Adapters](/de/guides/server-side-rendering/#enabling-ssr-in-your-project).

Installiere zu Beginn `@astrojs/rss` mit deinem bevorzugten Paketmanager:

```bash
# npm
npm i @astrojs/rss
# yarn
yarn add @astrojs/rss
# pnpm
pnpm i @astrojs/rss
```

Stelle dann sicher, dass du in deiner `astro.config` eine [`site` konfigurierst](/en/reference/configuration-reference/#site). Damit kannst du [über die `SITE`-Umgebungsvariable](/en/guides/environment-variables/#default-environment-variables) Links in deinem RSS-Feed erzeugen.

:::note[Benötigt v1]
Die `SITE` Umgebungsvariable existiert nur in der neusten Astro 1.0 beta. Entweder aktualisiere auf die aktuellste Version von Astro (`astro@latest`), oder schreibe deine `site` manuell, wenn das nicht möglich ist (siehe Beispiele unten).
:::

Lass und jetzt unser erstes RSS-Feed generieren! Erstelle eine `rss.xml.js`-Datei in deinem `src/pages/`-Ordner. `rss.xml` wird die Ausgabe-URL sein. Du kannst sie also nach deinen Wünschen anpassen, wenn du möchtest.

Danach, importiere die `rss`-Hilfsfunktion aus dem `@astrojs/rss`-Paket und rufe sie mit folgenden Parametern auf:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    // `<title>` Feld in der XML-Ausgabe
    title: 'Buzz’s Blog',
    // `<description>` Feld in der XML-Ausgabe
    description: 'Ein bescheidener Astronaut und sein Weg zu den Sternen',
    // Basis-URL für RSS-<item>-Links
    // SITE verwendet "site" aus der astro.config deines Projekts.
    site: import.meta.env.SITE,
    // Liste mit `<item>` in der XML-Ausgabe
    // Einfaches Beispiel: Items für jede md-Datei in /src/pages erzeugen
    // Siehe im Abschnitt "items erzeugen" für erforderliche Frontmatter und erweiterte Anwendungsfälle
    items: import.meta.glob('./**/*.md'),
    // (optional) benutzerdefiniertes xml einfügen
    customData: `<language>en-us</language>`,
  });
```

## `items` generieren

Das `items`-Feld akzeptiert entweder:
1. [Ein `import.meta.glob(...)` Ergebnis](#1-importmetaglob-ergebnis) **(nutze dies nur für `.md`-Dateien in  deinem `src/pages/`-Verzeichnis!)**
2. [Liste der RSS-Feed-Objekte](#2-liste-der-rss-feed-objekte), jeweils mit einem `link`, `title`, `pubDate`, und optionalen `description` und `customData` Feldern.

### 1. `import.meta.glob`-Ergebnis

Wir empfehlen diese Option als eine bequeme Abkürzung für `.md`-Dateien unter `src/pages/`. Jeder Eintrag sollte einen `title`, `pubDate` und optional `description` oder `customData` Felder in seinem Frontmatter haben. Wenn das nicht möglich ist, oder du es bevorzugst deinen Frontmatter im Code selbst zu generieren, [siehe Option 2](#2-liste-der-rss-feed-objekte).

Angenommen, deine Blog-Einträge sind im Verzeichnis `src/pages/blog/`. Du kannst dann einen RSS-Feed wie folgt erzeugen:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'Ein bescheidener Astronaut und sein Weg zu den Sternen',
    site: import.meta.env.SITE,
    items: import.meta.glob('./blog/**/*.md'),
  });
```

Siehe die [Vite glob-import-Dokumentation](https://vitejs.dev/guide/features.html#glob-import) für weitere Informationen über diese Syntax.

### 2. Liste der RSS-Feed-Objekte

Wir empfehlen diese Option für `.md`-Dateien außerhalb des `pages`-Verzeichnises. Dies ist überlich beim Generieren von Routen [via `getStaticPaths`](/de/reference/api-reference/#getstaticpaths).

Angenommen, deine `.md`-Einträge sind in einem `src/posts/`-Verzeichnis gespeichert. Jeder Eintrag hat ein `title`, `pubDate` und `slug` in seinem Frontmatter, wobei `slug` der Ausgabe-URL deiner Website entspricht. Wir können dann ein RSS-Feed mithilfe von [Vite's `import.meta.glob` helper](https://vitejs.dev/guide/features.html#glob-import) wie folgt generieren:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

const postImportResult = import.meta.glob('../posts/**/*.md', { eager: true });
const posts = Object.values(postImportResult);

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'Ein bescheidener Astronaut und sein Weg zu den Sternen',
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: post.url,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.pubDate,
    }))
  });
```

## Ein Stylesheet hinzufügen

Du kannst deinen RSS-Feed so gestalten, dass er für den Nutzer noch angenehmer wird, wenn er ihn in seinem Browser ansieht.

Nutze die Option `stylesheet`der `rss`-Funktion, um einen absoluten Pfad zu deinem Stylesheet anzugeben.

```js
rss({
  // Nutze z.B. dein Stylesheet aus "public/rss/styles.xsl"
  stylesheet: '/rss/styles.xsl',
  // ...
});
```

Falls du kein RSS-Stylesheet zur Verfügung hast, empfehlen wir das [Pretty Feed v3 Standard-Stylesheet](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl), das du dir von GitHub herunterladen und in dein `public/`-Verzeichnis deines Projekts speichern kannst.
