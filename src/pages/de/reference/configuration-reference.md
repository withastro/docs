---
layout: ~/layouts/MainLayout.astro
title: Konfigurationsreferenz
setup: |
  import Since from '../../../components/Since.astro';
---

Die folgenden Referenzen beschreiben alle unterstützten Konfigurationsoptionen in Astro. Wenn du mehr über die Konfiguration von Astro erfahren möchtest, lies unsere Anleitung [Astro konfigurieren](/de/guides/configuring-astro/).

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // Deine Konfigurationsoptionen hier...
})
```
## Top-Level-Optionen

### root

<p>

**Typ:** `string`<br>
**CLI:** `--root`<br>
**Standard:** `"."` (Aktuelles Arbeitsverzeichnis)
</p>

Du solltest diese Option nur angeben, wenn du die `astro`-CLI-Befehle in einem anderen Verzeichnis als dem Stammverzeichnis deines Projekts ausführst. Normalerweise wird diese Option über die Kommandozeile, und nicht über die Datei `astro.config.js` bereitgestellt, da Astro dein Projektstammverzeichnis kennen muss, bevor es deine Konfigurationsdatei finden kann.

Wenn du einen relativen Pfad angibst (z.B.: `--root: './mein-projekt'`), löst Astro diesen gegen das aktuelle Arbeitsverzeichnis auf.

#### Beispiele

```js
{
  root: './mein-projektverzeichnis'
}
```
```bash
$ astro build --root ./mein-projektverzeichnis
```


### srcDir

<p>

**Typ:** `string`<br>
**Standard:** `"./src"`
</p>

Legt das Verzeichnis fest, aus dem Astro deine Website lesen soll.

Der Wert kann entweder ein absoluter Dateisystempfad oder ein Pfad relativ zum Projektstamm sein.

```js
{
  srcDir: './www'
}
```


### publicDir

<p>

**Typ:** `string`<br>
**Standard:** `"./public"`
</p>

Legt das Verzeichnis für deine statischen Assets fest. Die Dateien in diesem Verzeichnis werden während der Entwicklung unter `/` bereitgestellt, und während des Build-Prozesses in dein Build-Verzeichnis kopiert. Diese Dateien werden immer unverändert bereitgestellt oder kopiert, ohne Transformation oder Bündelung.

Der Wert kann entweder ein absoluter Dateisystempfad oder ein Pfad relativ zum Projektstamm sein.

```js
{
  publicDir: './mein-eigenes-publicDir-verzeichnis'
}
```


### outDir

<p>

**Typ:** `string`<br>
**Standard:** `"./dist"`
</p>

Legt das Verzeichnis fest, in das `astro build` deinen endgültigen Build schreibt.

Der Wert kann entweder ein absoluter Dateisystempfad oder ein Pfad relativ zum Projektstamm sein.

```js
{
  outDir: './my-custom-build-directory'
}
```


### site

<p>

**Typ:** `string`
</p>

deine endgültig bereitgestellte URL. Astro verwendet diese vollständige URL, um deine Sitemap und kanonische URLs in deinem endgültigen Build zu generieren. Es wird ausdrücklich empfohlen, diese Konfiguration festzulegen, um Astro optimal nutzen zu können.

```js
{
  site: 'https://www.my-site.dev'
}
```


### base

<p>

**Typ:** `string`
</p>

Der Basispfad, in den Du deployen möchtest. Astro passt diesen Pfadnamen während der Entwicklung an, damit deine Entwicklungsumgebung so gut wie möglich mit deiner Build-Umgebung übereinstimmt. Im folgenden Beispiel wird dein Server mit "astro dev" unter "/docs" gestartet.

```js
{
  base: '/docs'
}
```


### trailingSlash

<p>

**Typ:** `'always' | 'never' | 'ignore'`<br>
**Standard:** `'always'`
</p>

Legt das Verhalten des Dev-Servers beim Routenabgleich fest. Wähle aus den folgenden Optionen:
  - `'always'` - Nur URLs abgleichen, die einen abschließenden Schrägstrich enthalten (Beispiel: "/foo/")
  - `'never'` - Kein Abgleich mit URLs, die einen Schrägstrich am Ende enthalten (z. B. "/foo")
  - `'ignore'` - Abgleich von URLs unabhängig davon, ob ein nachgestelltes "/" vorhanden ist

Verwende diese Konfigurationsoption, wenn dein "Production"-Host strikte Regeln für die Verwendung von abschließenden Schrägstrichen hat oder nicht.

Du kannst diese Einstellung auch vornehmen, wenn Du selbst strikter vorgehen willst, so dass URLs mit oder ohne nachgestellte Schrägstriche während der Entwicklung nicht funktionieren.

```js
{
  // Beispiel: nachgestellter Schrägstrich während Entwicklung erforderlich
  trailingSlash: 'always'
}
```
* Duhe auch:**
- build.format


## Build Optionen

### build.format

<p>

**Typ:** `('file' | 'directory')`<br>
**Standard:** `'directory'`
</p>

Bestimme das Format der Ausgabedatei für jede Seite.
  - Bei "file" erzeugt Astro für jede Seite eine HTML-Datei (z.B. "/foo.html").
  - Bei "directory" erzeugt Astro für jede Seite ein Verzeichnis mit einer verschachtelten "index.html"-Datei (z.B.: "/foo/index.html").

```js
{
  build: {
    // Beispiel: Erzeugen von "page.html" anstelle von "page/index.html" während des Build-Prozess.
    format: 'file'
  }
}
```


## Server Optionen

Passe den Astro Dev Server an, der sowohl von `astro dev` als auch von `astro serve` verwendet wird.

```js
{
  server: {port: 1234, host: true}
}
```

Um unterschiedliche Konfigurationen auf der Grundlage des ausgeführten Befehls ("dev", "preview") festzulegen, kann dieser Konfigurationsoption auch eine Funktion übergeben werden.

```js
{
  // Beispiel: Verwende die Funktionssyntax zum Anpassen auf der Grundlage des Befehls
  server: (command) => ({port: command === 'dev' ? 3000 : 4000})
}
```

### server.host

<p>

**Typ:** `string | boolean`<br>
**Standard:** `false`<br>
<Since v="0.24.0" />
</p>

Legt fest, unter welchen Netzwerk-IP-Adressen der Entwicklungsserver erreichbar sein soll (d. h. IPs außerhalb von `localhost`).
- `false` - Keine Erreichbarkeit über Netzwerk-IP-Adressen
- `true` - Erreichbarkeit über alle Adressen, inkl. LAN- und Internet-Adressen
- `[eigene-adresse]` - Erreichbarkeit über die IP-Adresse `[eigene-adresse]`


### server.port

<p>

**Typ:** `number`<br>
**Standard:** `3000`
</p>

Legt fest, welchen Port der Dev-Server abhören soll.

Wenn der angegebene Port bereits belegt ist, versucht Astro automatisch den nächsten verfügbaren Port.

## Markdown Optionen

### markdown.drafts

<p>

**Typ:** `boolean`<br>
**Standard:** `false`
</p>

Legt fest, ob Markdown-Entwurfsseiten in den Build aufgenommen werden sollen.

Eine Markdown-Seite wird als Entwurf betrachtet, wenn sie `draft: true` in ihrer frontmatter enthält. Entwurfsseiten sind während der Entwicklung (`astro dev`) immer enthalten und sichtbar, aber standardmäßig werden sie nicht in den endgültigen Build aufgenommen.

```js
{
  markdown: {
    // Beispiel: Alle Entwürfe in den endgültigen Build einbeziehen
    drafts: true,
  }
}
```


### markdown.shikiConfig

<p>

**Typ:** `ShikiConfig`
</p>

Shiki Konfigurationspptionen. Siehe [Markdown Konfiguration Docs](https://docs.astro.build/en/guides/markdown-content/#shiki-configuration).


### markdown.syntaxHighlight

<p>

**Typ:** `'shiki' | 'prism' | false`<br>
**Standard:** `shiki`
</p>

Legt fest welcher Syntax-Highlighter zu verwenden ist, wenn überhaupt.
- `shiki` - benutze die [Shiki](https://github.com/shikijs/shiki) Syntaxhervorhebung
- `prism` - benutze die [Prism](https://prismjs.com/) Syntaxhervorhebung
- `false` - keine Syntaxhervorhebung anwenden

```js
{
  markdown: {
    // Beispiel: Umschalten auf Prism zur Syntaxhervorhebung in Markdown
    syntaxHighlight: 'prism',
  }
}
```


### markdown.remarkPlugins

<p>

**Typ:** `Array.<Plugin>`
</p>

Übergibt ein benutzerdefiniertes [Remark](https://github.com/remarkjs/remark) Plugin, um die Art und Weise, wie dein Markdown erstellt wird, anzupassen.

**Anmerkung:** Die Aktivierung von benutzerdefinierten `remarkPlugins` oder `rehypePlugins` entfernt Astros native Unterstützung für [GitHub-flavored Markdown](https://github.github.com/gfm/), [Footnotes](https://github.com/remarkjs/remark-footnotes) Syntax, [Smartypants](https://github.com/silvenon/remark-smartypants). Du musst diese Plugins explizit in deine Datei `astro.config.mjs` aufnehmen, falls gewünscht.

```js
{
  markdown: {
    // Beispiel: Die von Astro verwendeten remark Standard-Plugins
    remarkPlugins: ['remark-code-titles', ['rehype-autolink-headings', { behavior: 'prepend' }]],
  },
};
```


### markdown.rehypePlugins

<p>

**Typ:** `Array.<Plugin>`
</p>

Übergbt eine benutzerdefinierte [Rehype](https://github.com/remarkjs/remark-rehype) Plugin, um die Erstellung von Markdown anzupassen.

**Anmerkung:** Die Aktivierung von benutzerdefinierten `remarkPlugins` oder `rehypePlugins` entfernt Astros native Unterstützung für [GitHub-flavored Markdown](https://github.github.com/gfm/), [Footnotes](https://github.com/remarkjs/remark-footnotes) Syntax, [Smartypants](https://github.com/silvenon/remark-smartypants). Du musst diese Plugins explizit in deine Datei `astro.config.mjs` aufnehmen, falls gewünscht.

```js
{
  markdown: {
    // Beispiel: Die von Astro verwendeten rehype Standard-Plugins
    rehypePlugins: [['rehype-toc', { headings: ['h2', 'h3'] }], [addClasses, { 'h1,h2,h3': 'title' }], 'rehype-slug'],
  },
};
```


## Integrationen

Erweitere Astro mit benutzerdefinierten Integrationen. Integrationen sind deine zentrale Anlaufstelle für das Hinzufügen von Framework-Unterstützung (wie Solid.js), neuen Funktionen (wie Sitemaps) und neuen Bibliotheken (wie Partytown und Tailwind).

Lese unseren [Integrations-Leitfaden](/de/guides/integrations-guide/), um die ersten Schritte mit Astro-Integrationen zu gehen.

```js
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
{
  // Beispiel: Füge React- & Tailwind-Unterstützung zu Astro hinzu
  integrations: [react(), tailwind()]
}
```

## Vite

Übergibt zusätzliche Konfigurationsoptionen an Vite. Nützlich, wenn Astro eine fortgeschrittene Konfiguration nicht unterstützt, die du vielleicht benötigst.

Sieh dir die vollständige Dokumentation zum Konfigurationsobjekt `vite` auf [vitejs.dev](https://vitejs.dev/config/) an.

#### Beispiele

```js
{
  vite: {
    ssr: {
      // Beispiel: Erzwinge das Überspringen eines defekten Pakets
      // bei der SSR-Verarbeitung, falls erforderlich
      external: ['defektes-npm-paket'],
    }
  }
}
```

```js
{
  vite: {
    // Beispiel: Füge benutzerdefinierte Vite-Plugins
    // direkt zu deinem Astro-Projekt hinzu
    plugins: [meinPlugin()],
  }
}
```

