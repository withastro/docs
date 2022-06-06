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
  outDir: './mein-eigenes-build-verzeichnis'
}
```


### site

<p>

**Typ:** `string`
</p>

Die endgültige URL deiner Seite bei deinem Hosting-Anbieter. Astro verwendet diese vollständige URL, um deine Sitemap und kanonische URLs in deinem endgültigen Build zu generieren. Es wird ausdrücklich empfohlen, diese Konfigurationsoption festzulegen, um Astro optimal nutzen zu können.

```js
{
  site: 'https://www.meine-website.dev'
}
```


### base

<p>

**Typ:** `string`
</p>

Der Basispfad, unter dem du deine Website hosten möchtest. Astro wird diesen Pfadnamen auch während der Entwicklung verwenden, damit deine Entwicklungsumgebung so gut wie möglich mit deiner Build-Umgebung übereinstimmt. Im folgenden Beispiel wird dein Server mit `astro dev` unter `/dokumentation` gestartet.

```js
{
  base: '/dokumentation'
}
```


### trailingSlash

<p>

**Typ:** `'always' | 'never' | 'ignore'`<br>
**Standard:** `'always'`
</p>

Legt das Verhalten des Entwicklungsservers beim Zuordnen von URLs zu Seiten im Dateisystem fest. Wähle aus den folgenden Optionen:
  - `'always'` - Nur URLs mit abschließendem Schrägstrich zuordnen (z. B. "/foo/")
  - `'never'` - Nur URLs ohne abschließenden Schrägstrich zuordnen (z. B. "/foo")
  - `'ignore'` - URLs unabhängig von der Präsenz eines abschließenden "/" zuordnen

Verwende diese Konfigurationsoption, wenn dein Hosting-Anbieter strikte Regeln dafür hat, wie abschließende Schrägstriche funktionieren oder nicht funktionieren.

Du kannst diese Einstellung auch vornehmen, wenn du dir selbst striktere Vorgaben machen willst, dass URLs mit oder ohne abschließende Schrägstriche während der Entwicklung nicht funktionieren.

```js
{
  // Beispiel: Erfordere abschließende Schrägstriche
  // in Seiten-URLs während der Entwicklung
  trailingSlash: 'always'
}
```
**Siehe auch:**
- build.format


## Build-Optionen

### build.format

<p>

**Typ:** `('file' | 'directory')`<br>
**Standard:** `'directory'`
</p>

Bestimmt das Format, nach dem die Ausgabedatei jeder Seite benannt werden soll:
  - Bei "file" erzeugt Astro für jede Seite eine HTML-Datei (z. B. "/foo.html").
  - Bei "directory" erzeugt Astro für jede Seite ein Verzeichnis mit einer darin enthaltenen `index.html`-Datei (z. B.: "/foo/index.html").

```js
{
  build: {
    // Beispiel: Erzeuge `page.html` statt `page/index.html`
    // während des Build-Prozesses.
    format: 'file'
  }
}
```


## Server-Optionen

Passe den Astro-Entwicklungsserver an, der sowohl von `astro dev` als auch von `astro serve` verwendet wird.

```js
{
  server: {port: 1234, host: true}
}
```

Um unterschiedliche Konfigurationen auf der Grundlage des ausgeführten Befehls ("dev", "preview") festzulegen, kann dieser Konfigurationsoption auch eine Funktion übergeben werden.

```js
{
  // Beispiel: Verwende die Funktionssyntax, um Anpassungen
  // auf der Grundlage des ausgeführten Befehls vorzunehmen
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

Legt fest, unter welchem Port der Entwicklungsserver erreichbar sein soll.

Wenn der angegebene Port bereits belegt ist, versucht Astro automatisch den nächsten verfügbaren Port zu verwenden.

## Markdown-Optionen

### markdown.drafts

<p>

**Typ:** `boolean`<br>
**Standard:** `false`
</p>

Legt fest, ob Markdown-Entwurfsseiten in den Build aufgenommen werden sollen.

Eine Markdown-Seite wird als Entwurf betrachtet, wenn sie die Frontmatter-Eigenschaft `draft: true` enthält. Entwurfsseiten sind während der Entwicklung (`astro dev`) immer enthalten und sichtbar, werden aber standardmäßig nicht in den endgültigen Build aufgenommen.

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

Legt fest, welche Syntaxhervorhebung verwendet werden soll (wenn überhaupt):
- `shiki` - Verwendet [Shiki](https://github.com/shikijs/shiki) zur Syntaxhervorhebung
- `prism` - Verwendet [Prism](https://prismjs.com/) zur Syntaxhervorhebung
- `false` - Deaktiviert die Syntaxhervorhebung

```js
{
  markdown: {
    // Beispiel: Ändere die Syntaxhervorhebung in Markdown auf Prism
    syntaxHighlight: 'prism',
  }
}
```


### markdown.remarkPlugins

<p>

**Typ:** `Array.<Plugin>`
</p>

Übergibt benutzerdefinierte [Remark](https://github.com/remarkjs/remark)-Plugins, um die Verarbeitung deiner Markdown-Inhalte anzupassen.

**Anmerkung:** Die Verwendung der Konfigurationsoptionen `remarkPlugins` oder `rehypePlugins` entfernt Astros native Unterstützung für [Markdown im GitHub-Stil](https://github.github.com/gfm/), die [Fußnoten-Syntax](https://github.com/remarkjs/remark-footnotes) und [Smartypants](https://github.com/silvenon/remark-smartypants). Du musst diese Plugins explizit in deine Datei `astro.config.mjs` aufnehmen, falls gewünscht.

```js
{
  markdown: {
    // Beispiel: Die von Astro standardmäßig verwendeten Remark-Plugins
    remarkPlugins: ['remark-code-titles', ['rehype-autolink-headings', { behavior: 'prepend' }]],
  },
};
```


### markdown.rehypePlugins

<p>

**Typ:** `Array.<Plugin>`
</p>

Übergibt benutzerdefinierte [Rehype](https://github.com/remarkjs/remark-rehype)-Plugins, um die Verarbeitung deiner Markdown-Inhalte anzupassen.

**Anmerkung:** Die Verwendung der Konfigurationsoptionen `remarkPlugins` oder `rehypePlugins` entfernt Astros native Unterstützung für [Markdown im GitHub-Stil](https://github.github.com/gfm/), die [Fußnoten-Syntax](https://github.com/remarkjs/remark-footnotes) und [Smartypants](https://github.com/silvenon/remark-smartypants). Du musst diese Plugins explizit in deine Datei `astro.config.mjs` aufnehmen, falls gewünscht.

```js
{
  markdown: {
    // Beispiel: Die von Astro standardmäßig verwendeten Rehype-Plugins
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

