---
title: Veröffentliche deine Astro Seite
description: Wie du deine Astro Seite im Internet veröffentlichst.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
i18nReady: true
---
**Bist du bereit deine Astro Seite zu bauen und veröffentlichen?**
Folge einer unserer Leitfaden zu den jeweiligen 
Veröffentlichungsdiensten, oder scrolle weiter für generelle
Informationen über das Veröffentlichen einer Astro Seite.

<DeployGuidesNav />

## Optionen zur schnellen Veröffenlichung

Du kannst eine Astro Seite über eine Vielzahl an Anbietern schnell bauen
und veröffentlichen, indem du entweder das Dashboard UI der Webseite oder
die Kommandozeilen Werkzeuge nutzt.

### Webseiten UI

Ein direkter Weg zum veröffentlichen deiner Webseite führt über das Verbinden
des Online Git Repository's deines Astro Projektes 
(z.B. GitHub, GitLab, Bitbucket) mit dem jeweiligen Anbieter, um somit 
von der kontinuierlichen Veröffentlichung zu profitieren.

Die Anbieterplattform dediktiert automatisch Pushes hin zu deinem Astro Projekt Quellen Repository, baut deine Seite und veröffentlicht diese im
Web über eine benutzerspezifische URL oder deiner persönlichen Domain.
Das Aufsetzen der Veröffentlichung auf solchen Plattformen setzt sich oftmals aus, wie die folgen Schritten ähnlich zusammen:

1. Füge dein Repository einem Online Git Anbieter hinzu (z.B. in GitHub, GitLab, Bitbucket)

1. Wahle einen Anbieter aus, welcher **Kontinuierliche Veröffentlichung** unterstützt (e.g. [Netlify](/de/guides/deploy/netlify/) oder [Vercel](/de/guides/deploy/vercel/)) und importiere dein Git Repository als neue Seite/Projekt.

    Viele Anbieter werden deine Seite als Astro Seite erkennen und sollten
    geeignete Konfigurationseinstellungen zum Bauen und Veröffentlichen
    deiner Astro Seite festlegen, wie folgend gezeigt: (Sollte das nicht
    der Fall sein, können diese angepasst werden.)

    :::note[Veröffentlichungseinstellungen]
    - **Build Command:** `astro build` oder `npm run build`
    - **Publish directory:** `dist`
    :::

1. Klicke "Veröffentlichen" und deine neue Webseite wird auf einer
einzigartigen URL erstellt, zugehörig zum Anbieter. (z.B. `new-astro-site.netlify.app`).

Der Anbieter wird automatisch so konfiguriert sein, dass er nach Änderungen
auf dem main Branch deines Projektes auf deinem Git Anbieter Ausschau hält
und nach jedem neuen Commit die Seite neu baut, sowie wiedervöffentlicht.
Die Einstellungen können normalerweise im Dashboard UI deines Anbieters geändert werden.

### CLI Veröffentlichung

Manche Anbieter bieten ein eigenes Kommandozeilen Werkzeug (CLI) an,
welches du global auf deiner Machine über npm installieren kannst.
Das Veröffentlichung über das CLI sieht meistens wie folgt aus:

1. Installiere global deines Anbieters CLI, wie zum Beispiel:

    ```bash
    npm install --global netlify-cli
    ```

1. Starte das CLI und folge den Anweisungen zur Authentifizierung, Aufsetzen, etc.

1. Baue deine Seite und veröffentliche über deinen Anbieter

    Die gängigen Anbieter bauen und veröffentlichen deine Seite für dich.
    Im Normalfall werden diese dein Projekt als Astro Seite erkennen und
    die geeigneten Konfigurationseinstellungen festlegen, um deine Seite zu
    bauen und veröffentlichen, wie folgend gezeigt.
    (Sollte das nicht der Fall sein, können diese angepasst werden.)

    :::note[Veröffentlichungseinstellungen]
    - **Build Command:** `astro build` oder `npm run build`
    - **Publish directory:** `dist`
    :::

    Andere Anbieter setzen voraus, dass du [deine Seite lokal baust](#building-your-site-locally) und über das Kommando Zeilen Werkzeug
    veröffenlichst.

## Baue deine Seite lokal

Viele Anbieter, wie Netlify und Vercel, bauen deine Seite für dich und
veröffentlichen die gebaute Ausgabe in das Web. Wiederum andere Seiten
setzen voraus, dass du deine Seite lokal selber baust und einen Befehl
des Kommandozeilen Werkeuges zum Veröffentlichen nutzt, oder die gebaute
Ausgabe hochlädst. 

Du möchtest eventuell auch deine Seite lokal bauen, um eine Vorschau zu 
erstellen oder um mögliche Fehler, sowie Warnungen in deiner eigenen Umgebung vorab wahrzunehmen.

Nutze folgenden Befehl `npm run build` um deine Astro Seite zu bauen.

```bash
npm run build
```

Standardmäßig, die gebaute Ausgabe ersetzt `dist/`. Das Verzeichnis kann über
[`outDir` configuration option](/de/reference/configuration-reference/#outdir) geändert werden. 

## Einen Adapter für SSR hinzufügen

:::note
Bevor du deine Seite mit [SSR (server-side rendering)](/de/guides/server-side-rendering/) eingeschaltet veröffentlichst, stelle folgendes sicher:

    - installiere den [geeigneten Adapter](/de/guides/server-side-rendering/#enabling-ssr-in-your-project) als Projekt Abhängigkeit
    - [Füge den Adapter](/de/reference/configuration-reference/#integrations) zu deinen `astro.config.mjs` Datei Imports und standard Exports hinzu
:::
