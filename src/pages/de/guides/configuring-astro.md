---
layout: ~/layouts/MainLayout.astro
title: Astro Konfigurieren
---

Passe die Funktionsweise von Astro an, indem du eine `astro.config.mjs` zu deinem Projekt hinzufügst. Dies ist eine gängige Datei in Astro-Projekten und alle offiziellen Templates und Themes enthalten standardmäßig diese Datei.

📚 In der [API Konfigurationsreferenz](/de/reference/configuration-reference/) von Astro gibt es eine Gesamtübersicht über alle unterstützten Konfigurationsoptionen.
## Die Astro Konfigurationsdatei

Eine gültige Astro-Konfigurationsdatei exportiert ihre Konfiguration mit Hilfe des `default`-Exports und der empfohlenen Hilfsfunktion `defineConfig`.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // hier Konfigurationsoptionen einfügen...
  // https://docs.astro.build/de/reference/configuration-reference/
})
```

Die Verwendung von `defineConfig()` wird für automatische Typhinweise in der IDE empfohlen, ist aber optional. Eine minimale, gültige Konfiguration würde so aussehen:

```js title="astro.config.mjs"
// Beispiel: Minimale, leere Konfigurationsdatei
export default {}
```

## Unterstützte Konfigurationsdateitypen

Astro unterstützt mehrere Dateiformate für seine Konfigurationsdatei: `astro.config.js`, `astro.config.mjs`, `astro.config.cjs` und `astro.config.ts`. 

Das Laden von Typescript-Konfigurationsdateien erfolgt mit Hilfe von [`tsm`](https://github.com/lukeed/tsm) und berücksichtigt die tsconfig-Optionen deines Projektes.
## Auflösen von Konfigurationsdateien

Astro versucht automatisch, eine Konfigurationsdatei mit dem Namen `astro.config.mjs` im Stammverzeichnis im Projekt aufzulösen. Wenn keine Konfigurationsdatei gefunden wurde, werden die Standardoptionen von Astro verwendet.

```bash
# Beispiel: Liest deine Konfiguration aus ./astro.config.mjs
astro build
```

Du kannst explizit eine Konfigurationsdatei mit dem CLI-flag `--config` festlegen. Dieses wird relativ zum aktuellen Arbeitsverzeichnis ausgeführt, in dem der `astro`-CLI-Befehl ausgeführt wird.

```bash
# Beispiel: Liest deine Konfiguration aus dieser Datei
astro build --config my-config-file.js
```

## IntelliSense-Konfiguration

Astro empfiehlt die Verwendung der Hilfsfunktion `defineConfig()` in deiner Konfiguration. `defineConfig()` bietet automatisches IntelliSense in deiner IDE. Editoren wie VSCode sind in der Lage Astros Typescript-Typendefinitionen zu lesen und automatische jsdoc-Typ-Hinweise zu liefern, selbst wenn deine Konfiguration nicht in Typescript geschrieben ist.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // hier Konfigurationsoptionen einfügen...
  // https://docs.astro.build/en/reference/configuration-reference/
})
```

Du kannst außerdem VSCode auch manuell Typendefinitionen zur Verfügung stellen, indem du diese JSDoc-Notation verwendest: 

```js
// astro.config.mjs
export default /** @type {import('astro').AstroUserConfig} */ ({
  // hier Konfigurationsoptionen einfügen...
  // https://docs.astro.build/en/reference/configuration-reference/
}
```

## Referenzierung relativer Dateien

Wenn du einen relativen Pfad zu `root` oder das `--root`-CLI-flag angibst, wird Astro es gegen das aktuelle Arbeitsverzeichnis auflösen, in dem du den `astro`-CLI-Befehl ausgeführt hast.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // Löst in das Verzeichnis "./foo" in dem aktuellen Arbeitsverzeichnis auf
  root: 'foo'
})
```
Astro löst alle anderen relativen Datei- und Verzeichnis-strings relativ zum Projektstammverzeichnis auf:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // Löst in das Verzeichnis "./foo" in dem aktuellen Arbeitsverzeichnis auf
  root: 'foo',
  // Löst in das Verzeichnis "./foo/public" in dem aktuellen Arbeitsverzeichnis auf
  publicDir: 'public',
})
```

Um eine Datei und ein Verzeichnis relativ zur Konfigurationsdatei zu referenzieren, verwende `import.meta.url` (es sei denn, du schreibst eine common.js-Datei `astro.config.cjs`)

```js "import.meta.url"
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // Löst das Verzeichnis "./foo" relativ zur Konfigurationsdatei auf
  root: new URL("./foo", import.meta.url),
  // Löst das Verzeichnis "./public" relativ zur Konfigurationsdatei auf
  publicDir: new URL("./public", import.meta.url),
})
```

## Anpassen von Ausgabedateinamen

Für Code, den Astro verarbeitet, wie importierte JavaScript oder CSS Dateien, kannst du die Ausgabedateinamen mit [`entryFileNames`](https://rollupjs.org/guide/en/#outputentryfilenames), [`chunkFileNames`](https://rollupjs.org/guide/en/#outputchunkfilenames), und [`assetFileNames`](https://rollupjs.org/guide/en/#outputassetfilenames) in einem `vite.build.rollupOptions`-Eintrag in deiner `astro.config.*` anpassen. 

```js ins={9-11}
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'entry.[hash].js',
          chunkFileNames: 'chunks/chunk.[hash].js',
          assetFileNames: 'assets/asset.[hash][extname]',
        },
      },
    },
  },
})
```

Dies kann hilfreich sein, wenn du Skripts mit Namen hast, die von Werbeblockern blockiert werden (z.B. `ads.js` oder `google-tag-manager.js`).


## Konfigurationsreferenz

📚 In der [API Konfigurationsreferenz](/de/reference/configuration-reference/) von Astro gibt es eine Gesamtübersicht über alle unterstützten Konfigurationsoptionen.

