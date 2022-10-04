---
setup: | 
import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
layout: ~/layouts/MainLayout.astro
title: Migrationsleitfaden
description: So migrieren Dú Ihr Projekt auf die neueste Version von Astro.
i18nReady: true
---

Dieser Leitfaden hilft Ihnen bei der Migration von älteren Versionen von Astro auf die neueste Version.

Du können die Astro-Version Ihres Projekts mithilfe Ihres Paketmanagers auf die neueste Version aktualisieren. Wenn du Astro-Integrationen verwenden, sollten du diese auch auf die neueste Version aktualisieren.

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # aktualisiert die Astro-Abhängigkeit:
  npm upgrade astro
  # oder um alle Abhängigkeiten zu aktualisieren:
  npm upgrade
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # aktualisiert die Astro-Abhängigkeit:
  pnpm upgrade astro
  # oder um alle Abhängigkeiten zu aktualisieren:
  pnpm upgrade
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # aktualisiert die Astro-Abhängigkeit:
  yarn upgrade astro
  # oder um alle Abhängigkeiten zu aktualisieren::
  yarn upgrade
  ```
  </Fragment>
</PackageManagerTabs>


Lesen du den Leitfaden unten für wichtige Highlights und Anweisungen zum Umgang mit Breaking Changes.

## Astro 1.0

Astro v1.0 führt einige Änderungen ein, die du bei der Migration von v0.x- und v1.0-Beta-Versionen beachten sollten. Siehe unten für weitere Details.

### Aktualisiert: Vite 3

Astro v1.0 wurde von Vite 2 auf [Vite 3] (https://vitejs.dev/) aktualisiert. Wir haben den größten Teil des Upgrades innerhalb von Astro für du erledigt; Einige subtile Verhaltensweisen von Vite können sich jedoch zwischen den Versionen ändern. Lesen du den offiziellen [Vite-Migrationsleitfaden](https://vitejs.dev/guide/migration.html#general-changes), wenn du auf Probleme stoßen.

### Veraltet:`Astro.canonicalURL`

Du können jetzt die neue verwenden [`Astro.url`](/en/reference/api-reference/#astrourl) helfer zum Erstellen Ihrer eigenen kanonischen URL aus der aktuellen Seiten-/Anfrage-URL.

```js del="Astro.canonicalURL" ins="new URL(Astro.url.pathname, Astro.site)"
// Vor:
const canonicalURL = Astro.canonicalURL;
// Nach:
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
```

### Geändert: Scoped CSS-Spezifität:

[Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) wird nun in bereichsbezogenen CSS-Stilen beibehalten. Diese Änderung wird dazu führen, dass die meisten bereichsbezogenen Stile Vorrang vor globalen Stilen haben. Dieses Verhalten wird jedoch nicht mehr explizit garantiert. 

Technisch wird dies mit erreicht [das `:where()` pseudo-klasse](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) anstatt Klassen direkt in der CSS-Ausgabe von Astro zu verwenden.

Nehmen wir als Beispiel den folgenden Stilblock in einer Astro-Komponente:

```astro
<style>
  div { color: red; } /* 0-0-1 specificity */
</style>
```

Zuvor würde Astro dies in das folgende CSS umwandeln, das eine Besonderheit von hat `0-1-1` — eine höhere Spezifität als das Quell-CSS:

```css del=".astro-XXXXXX"
div.astro-XXXXXX { color: red; } /* 0-1-1 specificity */
```

Jetzt umschließt Astro den Klassenselektor mit `:where()`, wobei die erstellte Spezifität beibehalten wird:

```css ins=":where(.astro-XXXXXX)"
div:where(.astro-XXXXXX) { color: red; } /* 0-0-1 specificity */
```
Die bisherige Steigerung der Spezifität erschwerte die Kombination von Scoped Styles in Astro mit anderen CSS-Dateien oder Style-Bibliotheken (z. B. Tailwind, CSS Modules, Styled Components, Stitches). Durch diese Änderung können die bereichsbezogenen Stile von Astro konsistent mit ihnen zusammenarbeiten, während die exklusiven Grenzen beibehalten werden, die verhindern, dass Stile außerhalb der Komponente angewendet werden.

:::vorsicht
Überprüfen du beim Upgrade die Ausgabe Ihrer Website visuell, um sicherzustellen, dass alles wie erwartet formatiert ist. Wenn nicht, finden du Ihren bereichsbezogenen Stil und erhöhen du die Selektorspezifität manuell, um dem alten Verhalten zu entsprechen.:::

### Veraltet: Komponenten und JSX in Markdown
Astro unterstützt standardmäßig keine Komponenten oder JSX-Ausdrücke mehr in Markdown-Seiten. Für langfristigen Support sollten du auf die migrieren [`@astrojs/mdx`](/en/guides/integrations-guide/mdx/) integration.

Um die Migration zu vereinfachen, kann ein neues [legacy-flag](/en/reference/configuration-reference/#legacyastroflavoredmarkdown) verwendet werden, um frühere Markdown-Funktionen wieder zu aktivieren.

### Vorhandenes umwandeln `.md` dateien zu `.mdx`


Wenn du mit MDX nicht vertraut sind, können du den folgenden Schritten folgen, um eine vorhandene "Astro Flavored Markdown" - Datei schnell in MDX zu konvertieren. Wenn du mehr über MDX erfahren, können du gerne andere Möglichkeiten zum Schreiben Ihrer Seiten erkunden!

1. Installiere das [`@astrojs/mdx`](/en/guides/integrations-guide/mdx/) integration.

2. Ändere deine bestehenden `.md` dateierweiterungen zu `.mdx`

3. Entfernen du alle `setup:` eigenschaften aus Ihrer Frontmatter, und schreiben du stattdessen alle import-Anweisungen unter die Frontmatter.

    ```mdx del={4-5} ins={10}
    // src/pages/posts/my-post.mdx
    ---
    layout: '../../layouts/BaseLayout.astro'
    setup: |
      import ReactCounter from '../../components/ReactCounter.jsx'
    title: 'Migration auf MDX'
    date: 2022-07-26
    tags: ["markdown", "mdx", "astro"]
    ---
    import ReactCounter from '../../components/ReactCounter.jsx'

    # {frontmatter.title}

    Hier ist meine Gegenkomponente, die in MDX arbeitet:

    <ReactCounter client:load />
    ```

4. Aktualisieren du alle `Astro.glob()` aussagen, die derzeit zurückgegeben werden `.md` dateien, so dass du jetzt Ihre zurückgeben `.mdx` dateien.

    :::vorsicht
    Das beim Import zurückgegebene objekt `.mdx` dateien (einschließlich der Verwendung von Astro.glob) unterscheidet sich von dem beim Import zurückgegebenen Objekt `.md` dateien. Jedoch, `frontmatter`, `file`, und `url` funktionieren identisch.
    :::

5. Aktualisieren du jede Verwendung der `<Content />` komponente zum Verwenden des Standardexports beim Importieren von MDX:

    ```astro title="src/pages/index.astro" ins=".default"
    ---
    // Mehrere Importe mit Astro.glob
    const mdxPosts = await Astro.glob('./posts/*.mdx');
    ---

    {mdxPosts.map(Post => <Post.default />)}
    ```
    
    ```astro title="src/pages/index.astro" ins="default as"
    ---
    // Importieren du eine einzelne Seite
    import { default as About } from './about.mdx';
    ---

    <About />    
    ```

:::tip
Während du auf MDX umstellen, möchten du möglicherweise [das Legacy-Flag aktivieren](/en/reference/configuration-reference/#legacyastroflavoredmarkdown) und beide einbeziehen **`.md` und `.mdx`** dateien, sodass Ihre Website weiterhin normal funktioniert, auch bevor alle Ihre Dateien konvertiert wurden. Hier ist eine Möglichkeit, wie du das tun können:

```astro
---
const mdPosts = await Astro.glob('../pages/posts/*.md');
const mdxPosts = await Astro.glob('../pages/posts/*.mdx');
const allPosts = [...mdxPosts, ...mdPosts];
---
```
:::

### `<Markdown />` komponente entfernt

Astro ist eingebaut `<Markdown />` komponente wurde in ein separates Paket verschoben. Um diese Komponente weiterhin verwenden zu können, müssen du du jetzt installierenl `@astrojs/markdown-component` und aktualisieren du Ihre Importe entsprechend. Weitere Einzelheiten finden du unter [das `@astrojs/markdown` Liesmich](https://github.com/withastro/astro/tree/main/packages/markdown/component).

:::tip
Astro unterstützt jetzt [MDX](https://mdxjs.com/) durch unsere [MDX-Integration](https://github.com/withastro/astro/tree/main/packages/integrations/mdx). MDX gibt Ihnen die Möglichkeit, sowohl Markdown- als auch importierte Komponenten in dieselbe Datei aufzunehmen. MDX kann eine gute Alternative für die sein `<Markdown />` komponente aufgrund ihrer großen Community und stabilen APIs.
:::

## Migrieren du auf v1.0.0-beta

Am 4. April 2022 haben wir die Astro 1.0 Beta veröffentlicht! 🎉

Wenn du von v0.25 oder früher kommen, vergewissern du sich, dass du den [v0.26 Migration Guide](#migrate-to-v026) unten gelesen und befolgt haben, der mehrere wichtige Breaking Changes enthielt.

Das `v1.0.0-beta.0` veröffentlichung von Astro enthielt keine Breaking Changes. Nachfolgend finden du kleine Änderungen, die während der Beta-Phase eingeführt wurden.

### Geändert: RSS-Feeds

RSS-Feeds sollten jetzt mit der generiert werden `@astrojs/rss` paket, wie in unserem [RSS-Leitfaden](/en/guides/rss/) beschrieben.

## Migrieren du auf v0.26
### Neue Konfigurations-API

Unsere Konfigurations-API wurde neu gestaltet, um einige offensichtliche Verwirrungspunkte zu beseitigen, die sich im Laufe des letzten Jahres aufgebaut hatten. Die meisten Konfigurationsoptionen wurden gerade verschoben oder umbenannt, was hoffentlich für die meisten Benutzer ein schnelles Update sein wird. Einige Optionen wurden stärker umgestaltet und erfordern möglicherweise einige zusätzliche Änderungen:

- `.buildOptions.site` wurde durch ersetzt `.site` (Ihre bereitgestellte Domäne) und eine neue `.base` (Ihr bereitgestellter Unterpfad) option.
- `.markdownOptions` wurde durch ersetzt `.markdown`, ein weitgehend ähnliches Konfigurationsobjekt mit einigen kleinen Änderungen zur Vereinfachung der Markdown-Konfiguration.
- `.sitemap` wurde in die Integration [@astrojs/sitemap](https://www.npmjs.com/package/@astrojs/sitemap) verschoben.

Wenn du Astro mit einer Legacy-Konfiguration ausführen, wird eine Warnung mit Anweisungen zum Aktualisieren angezeigt. Weitere Informationen zum Upgrade finden du in unserer aktualisierten [Konfigurationsreferenz](/en/reference/configuration-reference/).

Lesen du [RFC0019](https://github.com/withastro/rfcs/blob/main/proposals/0019-config-finalization.md) für weitere Hintergrundinformationen zu diesen Änderungen.

### Neue Markdown-API

Astro v0.26 veröffentlicht eine brandneue Markdown-API für Ihre Inhalte. Dazu gehörten drei wichtige benutzerseitige Änderungen:
- Du kannst jetzt `import`/`import()` markdown-Inhalte direkt über einen ESM-Import.
- Ein neuer `Astro.glob()` API für einfachere Glob-Importe (insbesondere für Markdown).
- **BRUCHVERÄNDERUNG:** `Astro.fetchContent()` wurde entfernt und durch ersetzt `Astro.glob()`
- **BRUCHVERÄNDERUNG:** Markdown-Objekte haben eine aktualisierte Benutzeroberfläche.

```js del={2} ins={4}
// v0.25
let allPosts = Astro.fetchContent('./posts/*.md');
// v0.26+
let allPosts = await Astro.glob('./posts/*.md');
```

Achten du bei der Migration auf die neue Markdown-Objektschnittstelle. Frontmatter wurde beispielsweise in die verschoben `.frontmatter` eigenschaft, also Referenzen wie `post.title` zu ändern sollte `post.frontmatter.title`.

Dies sollte viele Probleme für Markdown-Benutzer lösen, einschließlich einiger netter Leistungssteigerungen für größere Websites.

Lesen Dú [RFC0017](https://github.com/withastro/rfcs/blob/main/proposals/0017-markdown-content-redesign.md) für weitere Hintergrundinformationen zu diesen Änderungen.

### Neues Standard-Skriptverhalten

`<script>` tags ein Astro-Komponenten werden jetzt standardmäßig erstellt, gebündelt und optimiert. Dies vervollständigt einen langfristigen Schritt, um unsere Astro-Komponentensyntax konsistenter zu machen und dem standardmäßig optimierten Verhalten unserer `<style>` tags haben heute.

Dies beinhaltet einige Änderungen, die du beachten sollten:

- **BRECHEN:** `<script hoist>` ist die neue Standardeinstellung `<script>` verhalten. Das `hoist` attribut wurde entfernt. Um das neue Standardverhalten zu verwenden, stellen du sicher, dass es keine anderen Attribute in der gibt `<script>` tag. 
Zum Beispiel entfernen `type="module"` wenn du es vorher verwendet haben.

- Neu `<script is:inline>` direktive, um a zurückzusetzen `<script>` tag auf vorheriges Standardverhalten setzen (nicht erstellt, entbündelt, von Astro unberührt).
- Neu `<style is:inline>` direktive, um ein Style-Tag inline in der Seitenvorlage zu belassen (ähnlich der vorherigen `<script>` 
verhalten).
- Neu `<style is:global>` richtlinie zu ersetzen `<style global>` in einer zukünftigen Version.


```js del={2} ins={4}
// v0.25
<script hoist type="module">
// v0.26+
<script>
```
Ausführliche Informationen finden du unter Verwendung von [clientseitigen Skripts](/en/core-concepts/astro-components/#client-side-scripts) in Astro.

Lesen du [RFC0016](https://github.com/withastro/rfcs/blob/main/proposals/0016-style-script-defaults.md) für weitere Hintergrundinformationen zu diesen Änderungen.

### Aktualisiert `Astro.request` API


`Astro.request` wurde von unserem benutzerdefinierten Objekt zu einem Standard geändert `Request` objekt. Dies ist Teil eines Projekts zur Verwendung von mehr Webstandard-APIs, insbesondere in Bezug auf SSR.

Dies beinhaltet einige Änderungen, die du beachten sollten:

- Veränderung `Astro.request` um ein [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)-objekt zu werden.
- Bewegen `Astro.request.params` zu `Astro.params`.
- Bewegen `Astro.request.canonicalURL` zu `Astro.canonicalURL`.

Lesen du [RFC0018](https://github.com/withastro/rfcs/blob/main/proposals/0018-astro-request.md) für weitere Hintergrundinformationen zu diesen Änderungen.


### Andere Änderungen

- Verbessern `Astro.slots` API um die Übergabe von Argumenten an funktionsbasierte Slots zu unterstützen. Dies ermöglicht ergonomischere Hilfskomponenten, die eine Rückruffunktion als Kind akzeptieren.
- Aktualisieren du die CLI-Ausgabeformatierung, insbesondere in Bezug auf die Fehlerberichterstattung.
- Aktualisieren `@astrojs/compiler`, behebung einiger Fehler im Zusammenhang mit der Verwendung von RegExp in Frontmatter.

## Migrieren du auf v0.25

### Astro-Integrationen

Das `renderers` config wurde durch ein neues, offizielles Integrationssystem ersetzt! DaDúrch werden einige wirklich aufregende neue Funktionen für Astro freigeschaltet. Weitere Informationen zur Verwendung dieses neuen Systems finden du in unserem Leitfaden [Using Integrations](/en/guides/integrations-guide/).

Integrationen ersetzen unser original `renderers` konzept und kommen mit ein paar bahnbrechenden Änderungen und neuen Standardeinstellungen für bestehende Benutzer. Diese Änderungen werden unten behandelt.

#### Entfernt: Integrierte Framework-Unterstützung

Zuvor waren React, Preact, Svelte und Vue standardmäßig in Astro enthalten. Ab v0.25.0 enthält Astro keine integrierten Renderer mehr. Wenn du keine hatten `renderers` konfigurationseintrag bereits für Ihr Projekt definiert haben, müssen du diese Frameworks nun selbst installieren.

Lesen du unsere [Schritt-für-Schritt-Anleitung](/en/guides/integrations-guide/), um zu erfahren, wie du eine neue Astro-Integration für die Frameworks hinzufügen, die du derzeit verwenden.

#### Veraltet: Renderer

:::Hinweis
Lesen du diesen Abschnitt, wenn du benutzerdefinierte haben "renderers" bereits in Ihrer Konfigurationsdatei definiert.
:::

Das neue Integrationssystem ersetzt das bisherige `renderers` system, einschließlich der veröffentlichten `@astrojs/renderer-*` pakete auf npm. Vorwärts gehen, `@astrojs/renderer-react` wird `@astrojs/react`, `@astrojs/renderer-vue` wird `@astrojs/vue`, 
usw.

**Migrieren:** aktualisieren du Astro auf `v0.25.0` und dann laufen `astro dev` oder `astro build` mit Ihrer alten Konfigurationsdatei, die die veraltete enthält `"renderers"` konfig. Du werden sofort einen Hinweis sehen, der Ihnen die genauen Änderungen mitteilt, die du an Ihrer vornehmen müssen `astro.config.mjs` datei, basierend auf Ihrer aktuellen Konfiguration. Du können Ihre Pakete auch selbst aktualisieren, indem du die folgende Tabelle verwenden.


Lesen du für eine ausführlichere Anleitung unsere [Schritt-für-Schritt-Anleitung](/en/guides/integrations-guide/), um zu erfahren, wie du vorhandene Renderer durch eine neue Astro-Framework-Integration ersetzen.

```shell add={3-4}
# Installieren du Ihre neuen Integrationen und Frameworks:
# (Lesen du die vollständige Anleitung: https://docs.astro.build/en/guides/integrations-guide)
npm install @astrojs/lit lit
npm install @astrojs/react react react-dom
```

```js ins={3-4,8} del={7}
// Aktualisieren du dann Ihre `astro.config.mjs` datei:
// (Lesen du die vollständige Anleitung: https://docs.astro.build/en/guides/integrations-guide)
import lit from '@astrojs/lit';
import react from '@astrojs/react';

export default {
  renderers: ['@astrojs/renderer-lit', '@astrojs/renderer-react'],
  integrations: [lit(), react()],
}
```


| Deprecated Renderers on npm | v0.25+ Integrations on npm |
| --------------------------- | -------------------------- |
| @astrojs/renderer-react     | @astrojs/react             |
| @astrojs/renderer-preact    | @astrojs/preact            |
| @astrojs/renderer-solid     | @astrojs/solid-js          |
| @astrojs/renderer-vue       | @astrojs/vue               |
| @astrojs/renderer-svelte    | @astrojs/svelte            |

#### Umgang mit Peer-Abhängigkeiten

:::Hinweis
Lesen du diesen Abschnitt, wenn: du sich auf Node v14 befinden **oder** wenn du einen anderen Paketmanager als npm verwenden.
:::

Im Gegensatz zu den alten Renderern markieren Integrationen nicht mehr die Frameworks selbst ("react", "svelte", "vue", etc.) als direkte Abhängigkeiten der Integration. Stattdessen sollten du jetzt Ihre Framework-Pakete installieren *zusätzlich zu* ihre Integrationen.

```shell ins="react react-dom"
# Beispiel: Integrationen und Frameworks zudumen installieren
npm install @astrojs/react react react-dom
```

Wenn du ein sehen `"Cannot find package 'react'"` (oder ähnliche) Warnung, wenn du Astro starten, bedeutet dies, dass du dieses Paket in Ihrem Projekt installieren müssen. Weitere Informationen finden du in unserem [Hinweis zu Peer-Abhängigkeiten](/en/guides/troubleshooting/#cannot-find-package-x) in der Anleitung zur Fehlerbehebung.

Wenn du verwenden `npm` & Node v16+, dann kann dies automatisch für du erledigt werden `npm`, 
seit der neusten Version von `npm` (v7+) installiert Peer-Abhängigkeiten wie diese automatisch für du. Installieren du in diesem Fall ein Framework wie "react" in Ihr Projekt ist ein optionaler, aber dennoch empfohlener Schritt.

### Aktualisiert: Syntaxhervorhebung

Wir lieben es, sinnvolle Vorgaben dafür zu finden "nur arbeiten" aus der Kiste. Als Teil davon haben wir uns entschieden, [Shiki](https://github.com/shikijs/shiki) zu unserem neuen Standard-Syntax-Highlighter zu machen. Dies ist vorkonfiguriert mit der `github-dark` thema, das Zero-Config-Highlighting in Ihren Codeblöcken ohne überflüssige CSS-Klassen, Stylesheets oder clientseitiges JS bereitstellt.

Ausführliche Informationen finden du in unseren neuen [Dokumenten zur Syntaxhervorhebung](/en/guides/markdown-content/#syntax-highlighting). **Wenn du Prism lieber als Ihren Syntax-Highlighter behalten möchten,** [setze die `syntaxHighlight` option zu `'prism'`](/en/guides/markdown-content/#prism-configuration) in der Markdown-Konfiguration Ihres Projekts.

#### Das `<Prism />` bauteil hat ein neues Zuhause:

Als Teil unserer Mission, Astro Core so schlank wie möglich zu halten, haben wir die verschoben eingebaut `Prism` komponente aus`astro/components` und in die `@astrojs/prism` paket. Du können diese Komponente nun aus importieren `@astrojs/prism` 
so:


```astro
---
import { Prism } from '@astrojs/prism';
---
```

Seit der `@astrojs/prism` paket ist noch mit gebündelt `astro` core müssen du nichts Neues installieren oder Prism als Integration hinzufügen! Beachten du jedoch, dass wir _tun_ zu extrahieren planen `@astrojs/prism` (und die Prism-Syntaxhervorhebung im Allgemeinen) zu einem separaten, installierbaren Paket in der Zukunft. Sehen [das `<Prism />` komponenten-API-referenz](/en/reference/api-reference/#prism-) für mehr.

### CSS-Parser-Upgrade


Unser interner CSS-Parser wurde aktualisiert und bietet eine bessere Unterstützung für erweiterte CSS-Syntax wie Containerabfragen. Dies sollte für die meisten Benutzer eine größtenteils unsichtbare Änderung sein, aber hoffentlich werden fortgeschrittene Benutzer die Unterstützung der neuen CSS-Funktion genießen.

## Migrieren du auf v0.24

:::Hinweis
Die neue Build-Strategie ist standardmäßig auf 0.24 aktiviert. Wenn du auf ein Problem stoßen, können du mit der alten Build-Strategie fortfahren, indem du die `--legacy-build` flagge. Bitte [ein Problem öffnen](https://github.com/withastro/astro/issues/new/choose) damit wir Probleme mit der neuen Build-Strategie lösen können.
:::

0.24 ein neues eingeführt *statischer Aufbau* strategie, die das Verhalten einiger Features ändert. In früheren Versionen von Astro war dieses Verhalten mit einem Opt-in-Flag verfügbar: `--experimental-static-build`.

Beachten du bei der Migration für den Übergang die folgenden Änderungen, die für die Umstellung auf diese neue Build-Engine erforderlich sind. Du können diese Änderungen jederzeit an Ihrer Codebasis vornehmen, sodass du vorzeitig bereit sind.

### Veraltet: `Astro.resolve()`

`Astro.resolve()` ermöglicht es Ihnen, aufgelöste URLs zu Assets zu erhalten, auf die du möglicherweise im Browser verweisen möchten. Dies wurde am häufigsten innerhalb von verwendet  `<link>` und `<img>` tags zum Laden von CSS-Dateien und Bildern nach Bedarf. Leider wird dies nicht mehr funktionieren, da Astro jetzt Vermögenswerte aufbaut *bauzeit* eher als bei *zeit rendern*. 
Du sollten Ihre Asset-Referenzen auf eine der folgenden zukunftssicheren Optionen aktualisieren, die in Zukunft verfügbar sind:

#### So lösen du CSS-Dateien auf:

**1. ESM-Import (empfohlen)**

**Beispiel:** `import './style.css';`
**Wann ist dies zu verwenden:** Wenn Ihre CSS-Datei innerhalb der `src/` verzeichnis, und du möchten automatische CSS-Erstellungs- und Optimierungsfunktionen.

Verwenden du einen ESM-Import, um der Seite etwas CSS hinzuzufügen. Astro erkennt diese CSS-Importe und erstellt, optimiert und fügt das CSS automatisch zur Seite hinzu. Dies ist der einfachste Weg, von zu migrieren `Astro.resolve()` während das automatische Erstellen/Bündeln, das Astro bietet, beibehalten wird.

```astro
---
// Beispiel: Astro wird dieses CSS automatisch für du einbinden und optimieren
import './style.css';
---
<html><!-- Your page here --></html>
```

Das Importieren von CSS-Dateien sollte überall funktionieren, wo ESM-Importe unterstützt werden, einschließlich:
- JavaScript-Dateien
- TypeScript-Dateien
- Astro-Komponenten-Vorderseite
- Nicht-Astro-Komponenten wie React, Svelte und andere

Wenn eine CSS-Datei mit dieser Methode importiert wird, wird any `@import` anweisungen werden ebenfalls aufgelöst und in die importierte CSS-Datei eingebettet. Alle`url()` verweise werden auch relativ zur Quelldatei aufgelöst, und alle `url()` referenzierte Assets werden in den endgültigen Build aufgenommen.


**2. Absoluter URL-Pfad**

**Beispiel:** `<link href="/style.css">`
**Wann ist dies zu verwenden:** Wenn Ihre CSS-Datei innerhalb von lebt `public/`, und du ziehen es vor, Ihr HTML zu erstellen `link` 
element selbst.

Du können auf jede Datei innerhalb der `public/` verzeichnis nach absolutem URL-Pfad in Ihrer Komponentenvorlage. Dies ist eine gute Option, wenn du die steuern möchten `<link>` tag auf der Seite selbst. Dieser Ansatz überspringt jedoch auch die CSS-Verarbeitung, -Bündelung und -Optimierung, die von Astro bereitgestellt werden, wenn du die verwenden `import` oben beschriebene Methode.

Wir empfehlen die Verwendung von `import` ansatz über den aboluten URL-Ansatz, da er standardmäßig die bestmögliche CSS-Leistung und -Funktionen bietet.

#### So lösen du JavaScript-Dateien auf


**1. Absoluter URL-Pfad**

**Beispiel:** `<script src="/some-external-script.js" />`
**Wann ist dies zu verwenden:** Wenn sich Ihre JavaScript-Datei darin befindet `public/`.

Du können auf jede Datei innerhalb der `public/` verzeichnis nach absolutem URL-Pfad in Ihren Astro-Komponentenvorlagen. Dies ist eine gute Standardoption für externe Skripte, da du damit die steuern können `<script>` tag auf der Seite selbst.

Beachten du, dass dieser Ansatz die JavaScript-Verarbeitung, -Bündelung und -Optimierung überspringt, die von Astro bereitgestellt werden, wenn du die verwenden `import` unten beschriebene Methode. Dies kann jedoch für alle externen Skripte bevorzugt werden, die bereits separat von Astro veröffentlicht und minimiert wurden. Wenn Ihr Skript von einer externen Quelle heruntergeladen wurde, wird diese Methode wahrscheinlich bevorzugt.

**2. ESM-Import über `<script hoist>`**

**Beispiel:** `<script hoist>import './some-external-script.js';</script>`
**Wann ist dies zu verwenden:** Wenn Ihr externes Skript darin lebt `src/` _und_ es unterstützt den Modultyp ESM.

Verwenden du einen ESM-Import innerhalb von a `<script hoist>` element in Ihrer Astro-Vorlage, und Astro fügt die JavaScript-Datei in Ihren endgültigen Build ein. Astro erkennt diese clientseitigen JavaScript-Importe und erstellt, optimiert und fügt dann das JavaScript automatisch zur Seite hinzu. Dies ist der einfachste Weg, von zu migrieren `Astro.resolve()` während das automatische Erstellen/Bündeln, das Astro bietet, beibehalten wird.

```astro
<script hoist>
  import './some-external-script.js';
</script>
```

Beachten du, dass Astro dieses externe Skript mit dem Rest Ihres clientseitigen JavaScripts bündeln und in die Datei laden wird `type="module"` skriptkontext. Einige ältere JavaScript-Dateien sind möglicherweise nicht für die geschrieben `module` kontext, in diesem Fall müssen du möglicherweise aktualisiert werden, um diese Methode zu verwenden.


#### So lösen du Bilder und andere Assets auf:

**1. Absoluter URL-Pfad (empfohlen)**

**Beispiel:** `<img src="/penguin.png">`
**Wann ist dies zu verwenden:** Wenn Ihr Vermögenswert darin lebt `public/`.

Wenn du Ihre Bilder innerhalb von platzieren `public/` du können du sicher über den absoluten URL-Pfad direkt in Ihren Komponentenvorlagen referenzieren. Dies ist der einfachste Weg, auf ein Asset zu verweisen, das du heute verwenden können, und es wird den meisten Benutzern empfohlen, die mit Astro beginnen.

**2. ESM Import**

**Beispiel:** `import imgUrl from './penguin.png'`
**Wann ist dies zu verwenden:** Wenn Ihr Vermögenswert innerhalb des lebt `src/` verzeichnis, und du möchten automatische Optimierungsfunktionen wie Dateinamen-Hashing.

Dies funktioniert innerhalb jeder JavaScript- oder Astro-Komponente und gibt eine aufgelöste URL an das endgültige Bild zurück. Sobald du die aufgelöste URL haben, können du du überall in der Komponentenvorlage verwenden.

```astro
---
// Beispiel: Astro fügt diese Bilddatei in Ihren endgültigen Build ein
import imgUrl from './penguin.png';
---
<img src={imgUrl} />
```

Ähnlich wie Astro mit CSS umgeht, ermöglicht der ESM-Import Astro, einige einfache Build-Optimierungen automatisch für du durchzuführen. Zum Beispiel jedes Asset innerhalb von `src/` die über einen ESM-Import importiert wird (ex: `import imgUrl from './penguin.png'`) der dateiname wird automatisch gehasht. Dadurch können du die Datei aggressiver auf dem Server zwischenspeichern und die Benutzerleistung verbessern. In Zukunft kann Astro weitere Optimierungen wie diese hinzufügen.

**Tip:** Wenn du statische ESM-Importe nicht mögen, unterstützt Astro auch dynamische ESM-Importe. Wir empfehlen diese Option nur, wenn du diese Syntax bevorzugen: `<img src={(await import('./penguin.png')).default} />`.

### Veraltet: `<script>` Standardverarbeitung

Früher alle `<script>` elemente wurden aus der endgültigen HTML-Ausgabe gelesen und verarbeitet + automatisch gebündelt. Dieses Verhalten ist nicht mehr die Standardeinstellung. Ab Version 0.24 müssen du sich anmelden `<script>` elementverarbeitung über die `hoist` attribut. Das `type="module"` wird auch für hochgezogene Module benötigt.

```astro
<script>
  // Wird genau wie geschrieben in das HTML gerendert!
  // ESM-Importe werden nicht relativ zur Datei aufgelöst.
</script>
<script type="module" hoist>
  // Verarbeitet! Gebündelt! ESM-Importe funktionieren, sogar in npm-Pakete.
</script>
```


## Migrieren du auf v0.23

### Fehlender Sass-Fehler

```
Präprozessorabhängigkeit "sass" nicht gefunden. Hast du es installiert?
```

In unserem Bestreben, die Installationsgröße von npm zu reduzieren, sind wir umgezogen [Sass](https://sass-lang.com/) 
heraus zu einer optionalen Abhängigkeit. Wenn du Sass in Ihrem Projekt verwenden, sollten du sicherstellen, dass du ausgeführt werden `npm install sass --save-dev` um es als Abhängigkeit zu speichern.

### Veraltet: HTML ohne Escapezeichen

In Astro v0.23+ ist nicht maskierter HTML-Inhalt in Ausdrücken jetzt veraltet.
In zukünftigen Versionen werden Inhalte innerhalb von Ausdrücken mit Zeichenketten versehen, um du vor unbeabsichtigter HTML-Einschleusung zu schützen.

```astro del={1} ins={2}
<h1>{title}</h1> <!-- <h1>Hello <strong>World</strong></h1> -->
<h1>{title}</h1> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
```
🤝
Um weiterhin HTML ohne Escapezeichen einzufügen, können du jetzt verwenden `set:html`.

```astro del={1} ins={2}
<h1>{title}</h1>
<h1 set:html={title} />
```

Um ein Wrapper-Element zu vermeiden, `set:html` nebenher arbeiten kann`<Fragment>`.

```astro del={1} ins={2}
<h1>{title}!</h1>
<h1><Fragment set:html={title}>!</h1>
```

Du können sich auch vor unbeabsichtigter HTML-Einschleusung schützen `set:text`.

```astro
<h1 set:text={title} /> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
```

## Migrieren du auf v0.21

### Vite

Ab v0.21 wird Astro mit [Vite] erstellt.
Dadurch werden Konfigurationen eingeschrieben `snowpack.config.mjs` eingezogen werden soll `astro.config.mjs`.

```js
// @ts-check

/** @type {import('astro').AstroUserConfig} */
export default {
  renderers: [],
  vite: {
    plugins: [],
  },
};
```

Um mehr über die konfiguration von Vite zu erfahren, besuchen du bitte deren [Konfigurationsanleitung](https://vitejs.dev/config/).

#### Vite Plugins

In Astro v0.21+ können Vite-Plugins darin konfiguriert werden `astro.config.mjs`.

```js ins={4-6}
import { imagetools } from 'vite-imagetools';

export default {
  vite: {
    plugins: [imagetools()],
  },
};
```

Um mehr über Vite-Plug-ins zu erfahren, besuchen du bitte deren [Plug-in-Leitfaden] (https://vitejs.dev/guide/using-plugins.html).

#### Vite-Änderungen an Renderern

In Astro v0.21+ sollten Plugins jetzt verwendet werden `viteConfig()`.

```js del={8-9} ins={2,10-23}
// renderer-svelte/index.js
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  name: '@astrojs/renderer-svelte',
  client: './client.js',
  server: './server.js',
  snowpackPlugin: '@snowpack/plugin-svelte',
  snowpackPluginOptions: { compilerOptions: { hydratable: true } },
  viteConfig() {
    return {
      optimizeDeps: {
        include: ['@astrojs/renderer-svelte/client.js', 'svelte', 'svelte/internal'],
        exclude: ['@astrojs/renderer-svelte/server.js'],
      },
      plugins: [
        svelte({
          emitCss: true,
          compilerOptions: { hydratable: true },
        }),
      ],
    };
  },
}
```

Um mehr über Vite-Plug-ins zu erfahren, besuchen du bitte deren [Plug-in-Leitfaden] (https://vitejs.dev/guide/using-plugins.html).

:::Hinweis
In früheren Releases wurden diese mit konfiguriert `snowpackPlugin` oder `snowpackPluginOptions`.
:::


### Aliasing

In Astro v0.21+ können Importaliase hinzugefügt werden `tsconfig.json` oder `jsconfig.json`.

```json add={4-6}
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"]
    }
  }
}
```

_Diese Aliase werden automatisch in integriert [VSCode](https://code.visualstudio.com/docs/languages/jsconfig) und andere Redakteure._

### Dateierweiterungen in Importen

In Astro v0.21+ müssen Dateien mit ihrer tatsächlichen Erweiterung referenziert werden, genau wie auf der Festplatte. In diesem Beispiel `Div.tsx` müsste referenziert werden als `Div.tsx`, nicht `Div.jsx`.

```js del={1} ins={2}
import Div from './Div.jsx' // Astro v0.20
import Div from './Div.tsx' // Astro v0.21
```

Dieselbe Änderung gilt für eine Compile-to-CSS-Datei wie `Div.scss`:

```astro del={1} ins={2}
<link rel="stylesheet" href={Astro.resolve('./Div.css')}>
<link rel="stylesheet" href={Astro.resolve('./Div.scss')}>
```

### Entfernt: Komponenten in Frontmatter

Zuvor konnten du Mini-Astro-Komponenten innerhalb von Astro Frontmatter erstellen, indem du die JSX-Syntax anstelle der Komponentensyntax von Astro verwenden. Das war immer ein kleiner Hack, aber im neuen Compiler wurde es unmöglich, es zu unterstützen. Wir hoffen, diese Funktion in einer zukünftigen Version von Astro mit einer anderen Nicht-JSX-API wieder einführen zu können.

Um auf v0.21+ zu migrieren, konvertieren du bitte alle JSX Astro-Komponenten (d. h. alle Astro-Komponenten, die innerhalb der Frontmatter einer anderen Komponente erstellt wurden) in eigenständige Komponenten.


### Styling-Änderungen

#### Autoprefixer

Autoprefixer wird standardmäßig nicht mehr ausgeführt. Ermöglichen:

1. Installieren du die neueste Version (`npm i autoprefixer`)
2. Ein kreieren `postcss.config.cjs` datei im Stammverzeichnis Ihres Projekts mit:
   ```js
   module.exports = {
     plugins: {
       autoprefixer: {},
     },
   };
   ```

#### Tailwind CSS

Stellen du sicher, dass du PostCSS installiert haben. Dies war in früheren Versionen optional, ist aber jetzt erforderlich:

1. Installieren du die neueste Version von postcss (`npm i -D postcss`)
2. Ein kreieren`postcss.config.cjs` datei im Stammverzeichnis Ihres Projekts mit:
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
     },
   };
   ```
Weitere Informationen finden du in der [Tailwind CSS-Dokumentation] (https://tailwindcss.com/docs/installation#add-tailwind-as-a-post-css-plugin)

### Bekannte Probleme

#### Importe obendrauf

In Astro v0.21+ wurde ein Fehler eingeführt, der erfordert, dass Importe innerhalb von Komponenten ganz oben auf Ihrer Titelseite stehen.

```astro
---
import Component from '../components/Component.astro'
const whereShouldIPutMyImports = "on top!"
---
```


[vite]: https://vitejs.dev
