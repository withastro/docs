---
title: Verwendung von benutzerdefinierten Schriftarten
description: Möchtest du einem Astro-Projekt einige benutzerdefinierte Schriftarten hinzufügen? Verwende dafür Google Fonts mit Fontsource oder füge eine Schriftart deiner wahl hinzu.
i18nReady: true
layout: ~/layouts/MainLayout.astro
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro';
---

Astro unterstützt alle gängigen möglichkeiten zum Hinzufügen benutzerdefinierter Schriftarten zu deinem Website-Design. Diese Anleitung zeigt zwei verschiedene Möglichkeiten, Webfonts in dein Projekt einzubinden.

## Verwenden einer lokalen Schriftdatei

Wenn du Schriftdateien zu deinem Projekt hinzufügen möchtest, empfehlen wir, sie in deinem [`public/`-Verzeichniss](/de/core-concepts/project-structure/#public) zu plazieren. In deiner CSS datei können die Schriftarten dann mit einer [`@font-face`-Regel](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) registriert und mit einer `font -family`-Anweisung verwendet werden, um deine Website zu gestalten.

## Beispiel

Angenommen du hast die Font-Datei `DistantGalaxy.woff`

1. Plaziere die Font-Datei im `public/fonts/`-Verzeichniss.

2. Füge eine `@font-face`-Regel in deiner CSS hinzu. Das kann eine Globale `.css`-Datei sein oder in einem `<style>` Block innerhalb deines Layouts oder Komponente sein.

    ```css
    /* Registriere deine Benutzerdefinierte Schriftart und teile dem Browser mit, wo er sie finden kann */
    @font-face {
      font-family: 'DistantGalaxy';
      src: url('/fonts/DistantGalaxy.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    ```

    :::note
    Wir fügen das `public`-Verzeichniss nicht in die Quell-URL hinzu, denn alle Dateien im `public`-Verzeichniss werden dem Projektstamm-­verzeichnis deiner Website hinzugefügt.
    :::

3. Benutze die `font-family`-Anweisung von der `@font-face`-Regel um Komponente oder das Layout zu gestalten. In diesem Beispiel wird, das `<h1>` Element die Benutzerdefinierte Schriftart erhalten, während der Paragraph `<p>` sie nicht besitzt.

    ```astro {10-12}
    ---
    // src/pages/example.astro
    ---

    <h1>In einer Galaxie weit, weit entfernt...</h1>

    <p>Benutzerdefinierte Schriftarten machen meine Überschriften viel cooler!</p>

    <style>
    h1 {
      font-family: 'DistantGalaxy', sans-serif;
    }
    </style>
    ```

## Fontsource Verwenden

Das [Fontsource](https://fontsource.org/) Projekt ermöglicht die Verwendung von Google Fonts und anderen Open Source Schriftarten. Es stellt npm Pakete bereit um die gewünschten Schriftarten zu Installieren.

1. Finde die Schriftart die du benutzen möchtest im [Fontsource Katalog](https://fontsource.org/fonts). Für dieses Beispiel werden wir [Twinkle Star](https://fontsource.org/fonts/twinkle-star) nutzen.

2. Installiere das Paket deiner gewählten Schriftart. 

    <PackageManagerTabs>
      <Fragment slot="npm">
      ```shell
      npm install @fontsource/twinkle-star
      ```
      </Fragment>
      <Fragment slot="pnpm">
      ```shell
      pnpm install @fontsource/twinkle-star
      ```
      </Fragment>
      <Fragment slot="yarn">
      ```shell
      yarn add @fontsource/twinkle-star
      ```
      </Fragment>
    </PackageManagerTabs>

    :::tip
    Du findest den Korrekten Paket-Namen in der “Quick Installation” Sektion bei jeder Schriftart Seite von der Fontsource’s Website. Er startet immer mit `@fontsource/` gefolgt von Namen der Schriftart.
    :::

3. Importiere das Schriftarten Paket in dein Layout oder Komponente wo du sie benutzen möchtest. Normalerweise solltest du dies in einer gemeinsamen Layoutkomponente tun, um sicherzustellen, dass die Schriftart überall auf deiner Website verfügbar ist.

    Der Import fügt automatisch die erforderliche `@font-face`-Regel hinzu, die zum Einrichten der Schriftart benötigt wird.

    ```astro
    ---
    // src/layouts/BaseLayout.astro
    import '@fontsource/twinkle-star';
    ---
    ```

4. Benutze die `font-family`-Anweisung wie es auf der jeweiligen Schriftarten Fontsource Seite beschrieben ist. Das funktioniert überall wo CSS geschrieben werden kann in deinem Astro-Projekt.

    ```css
    h1 {
      font-family: "Twinkle Star", cursive;
    }
    ```

## Mehr Ressourcen

### Schriftarten mit Tailwind hinzufügen

Falls du die [Tailwind-Integration](/de/guides/integrations-guide/tailwind/) verwendest,kannst du entweder eine `@font-face`-Regel für eine lokale Schriftart hinzufügen oder die `Import`-Strategie von Fontsource verwenden, um die Schriftart zu registrieren. Folge dann [Tailwinds Dokumentation zum Hinzufügen benutzerdefinierter Schriftfamilien](https://tailwindcss.com/docs/font-family#using-custom-values).

### Erfahre wie Web-Schriftarten funktionieren

Der [MDN’s web fonts guide](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts) erklärt mehr zu dem Thema.

### Generiere CSS für deine Schriftart

Der [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator) kann dabei helfen, deine Schriftarten vorzubereiten.
