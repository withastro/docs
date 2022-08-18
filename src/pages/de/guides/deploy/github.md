---
title: Veröffentliche deine Astro-Seite bei GitHub Pages
description: Wie du deine Astro-Seite mit GitHub Pages im Internet veröffentlichst.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Du kannst [GitHub Pages](https://pages.github.com/) verwenden, um eine Astro-Webseite direkt von einem Repository auf [GitHub.com](https://github.com/) zu hosten.

## Wie du sie veröffentlichst

Du kannst eine Astro-Seite bei GitHub Pages veröffentlichen, indem du [GitHub Actions](https://github.com/features/actions) verwendest und so deine Seite automatisch erzeugst und veröffentlichst. Um dies zu erreichen, muss dein Quelltext auf GitHub liegen.

Astro pflegt die offizielle `withastro/action`, welche dein Projekt mit minimaler Konfiguration veröffentlicht. Folge den unten angeführten Anweisungen, um deine Astro-Seite bei GitHub Pages zu veröffentlichen und les [die Package README](https://github.com/withastro/action), falls du mehr Informationen benötigst.

1. Setze die [`site`](/de/reference/configuration-reference/#site) und, falls benötigt, [`base`](/de/reference/configuration-reference/#base) Optionen in `astro.config.mjs`.
    - `site` sollte in etwa `https://<DEIN_NUTZERNAME>.github.io` entsprechen
    - `base` sollte ein Schrägstrich gefolgt vom Namen deines Repositories sein, zum Beispiel `/mein-repository`.
    
    :::note
    Falls dein Repository `<DEIN_NUTZERNAME>.github.io` heißt, benötigst du die Option `base` nicht.
    :::

2. Erstelle eine neue Datei `.github/workflows/deploy.yml` in deinem Projekt und füge den folgende YAML-Ausschnitt ein.

    ```yaml
    name: Github Pages Astro CI

    on:
      # Löst den Workflow bei jedem Push auf den `main` Branch aus
      # Verwendest du einen anderen Branch-Namen? Ersetze `main` durch den Namen deines Branches
      push:
        branches: [ main ]
      # Erlaubt es dir diesen Workflow manuell über den Actions-Tab auf GitHub zu starten
      workflow_dispatch:
      
    # Erlaubt diesem Job das Repository zu klonen und eine Veröffentlichung bei GitHub Pages zu erstellen
    permissions:
      contents: read
      pages: write
      id-token: write

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: Checke dein Repository mit Git aus
            uses: actions/checkout@v2          
          - name: Installiere Abhängigkeiten, erzeuge deine Seite und lade sie hoch
            uses: withastro/action@v0

      deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        steps:
          - name: Bei GitHub Pages veröffentlichen
            id: deployment
            uses: actions/deploy-pages@v1
    ```
    
    :::caution
    Die offizielle Astro [Action](https://github.com/withastro/action) such nach einem Lockfile, um deinen bevorzugten Paketmanager (`npm`, `yarn` oder `pnpm`) zu erkennen. Du solltest die von deinem Paketmanager automatisch generierte Datei `package-lock.json`, `yarn.lock` oder `pnpm-lock.yaml` zu deinem Repository hinzufügen.
    :::

3. Committe die neue Workflow-Datei und pushe sie zu GitHub.

4. Auf GitHub, gehe zum Tab **Settings** deines Repositories und suche den Abschnitt **Pages**.  

5. Wähle den `gh-pages` Branch und das `"/" (root)` Verzeichnis als **Source** deiner Seite aus und drücke **Save**.  
  
Deine Seite sollte jetzt veröffentlicht sein! Wenn du Änderungen an deinem Astro-Projekt zu deinem Repository pushst, wird die GitHub Action diese automatisch veröffentlichen.

:::tip[Richte eine benutzerdefinierte Domäne ein]
Optional kannst du eine benutzerdefinierte Domäne einrichten, indem du die folgende Datei `./public/CNAME` zu deinem Projekt hinzufügst:

```txt title="public/CNAME"
sub.meine-domain.de
```

Dadurch wird deine Seite auf deiner benutzerdefinierten Domäne, statt auf `<DEIN_NUTZERNAME>.github.io`, veröffentlicht. Vergiss nicht, auch [den DNS Eintrag deines Domänen-Anbieters anzupassen](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain).   
:::
