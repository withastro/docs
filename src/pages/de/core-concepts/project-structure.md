---
layout: ~/layouts/MainLayout.astro
title: Projektstruktur
description: Erfahre, wie du ein Projekt mit Astro strukturierst.
---

Dein neues Astro-Projekt, welches vom CLI-Assistenten `create-astro` erstellt wurde, enthält bereits einige Dateien und Verzeichnisse. Alle weiteren Inhalte erstellst du selbst und fügst sie zur bestehenden Verzeichnisstruktur von Astro hinzu.

Hier erfährst du, wie ein Astro-Projekt grundsätzlich organisiert ist, und welche Dateien du in deinem neuen Projekt vorfindest.

## Verzeichnisse und Dateien

Astro nutzt einige fest vorgegebene Verzeichnisse, um dein Projekt zu strukturieren. Das Stammverzeichnis jedes Astro-Projekts sollte die folgenden Verzeichnisse und Dateien enthalten:

- `src/*` - Der Quellcode deines Projekts (Komponenten, Seiten, Stile usw.)
- `public/*` - Nicht zu verarbeitende Inhalte, die kein Quellcode sind (Schriftarten, Symbole usw.)
- `package.json` - Die Projektdatei deines Paketmanagers
- `astro.config.mjs` - Eine Astro-Konfigurationsdatei (optional)

### Beispiel-Verzeichnisbaum

Ein typischer Verzeichnisbaum könnte so aussehen:

```
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └-─ Button.jsx
│   ├── layouts/
│   │   └-─ PostLayout.astro
│   └── pages/
│   │   ├── posts/
│   │   │   ├── post1.md
│   │   │   ├── post2.md
│   │   │   └── post3.md
│   │   └── index.astro
│   └── styles/
│       └-─ global.css
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └-─ social-image.png
├── astro.config.mjs
└── package.json

```

### `src/`

Im src-Verzeichnis befindet sich der Großteil deines Projektquellcodes. Dieser beinhaltet Folgendes:

- [Seiten](/de/core-concepts/astro-pages/)
- [Layouts](/de/core-concepts/layouts/)
- [Astro-Komponenten](/de/core-concepts/astro-components/)
- [UI-Framework-Komponenten (React usw.)](/de/core-concepts/framework-components/)
- [Stile (CSS, Sass)](/de/guides/styling/)
- [Markdown](/de/guides/markdown-content/)

Astro verarbeitet, optimiert und bündelt deine Dateien in `src/`, um die endgültige Website zu erstellen, die an den Browser gesendet wird. Im Gegensatz zum statischen `public/`-Verzeichnis werden deine `src/`-Dateien von Astro für dich verarbeitet und optimiert:

Einige Dateien (z.B. Astro-Komponenten) werden gar nicht so an den Browser gesendet, wie du sie geschrieben hast, sondern stattdessen in statisches HTML gerendert. Andere Dateien (z.B. CSS) werden zwar an den Browser gesendet, können aber zur Leistungsverbesserung vorher optimiert und mit anderen CSS-Dateien gebündelt werden.

### `src/components`

**Komponenten** sind wiederverwendbare Quellcode-Einheiten, die du beliebig oft auf deinen Seiten einsetzen kannst. Du kannst sowohl [Astro-Komponenten](/de/core-concepts/astro-components/) als auch [UI-Framework-Komponenten](/de/core-concepts/framework-components/) aus Frameworks wie React oder Vue verwenden. Es ist üblich, alle Komponenten eines Projekts in diesem Ordner zu gruppieren und zu organisieren.

Diese Vorgehensweise ist in Astro-Projekten üblich, aber nicht zwingend erforderlich. Du kannst deine Komponenten gerne auch anders organisieren!

### `src/layouts`

[Layouts](/de/core-concepts/layouts/) sind spezielle Komponenten, die deine Inhalte in ein übergeordnetes Seitenlayout einbinden. Sie werden meistens verwendet, um das umgebende Layout von [Astro-Seiten](/de/core-concepts/astro-pages/) und [Markdown-Seiten](/de/guides/markdown-content/) festzulegen.

Genau wie bei `src/components` ist die Nutzung dieses Verzeichnisses in Astro-Projekten üblich, aber nicht zwingend erforderlich.

### `src/pages`

[Seiten](/de/core-concepts/astro-pages/) sind spezielle Komponenten, die verwendet werden, um neue Seiten auf deiner Website zu erstellen. Es kann sich dabei um eine Astro-Komponente oder eine Markdown-Datei handeln, die den Inhalt einer Seite auf deiner Website repräsentiert.

> ⚠️  `src/pages` ist ein **erforderliches** Unterverzeichnis deines Astro-Projekts. Fehlt es, hat deine Website keine Seiten oder Routen!

### `src/styles`

Es ist eine übliche Vorgehensweise, deine CSS- oder Sass-Stile im Verzeichnis `src/styles` zu speichern, es ist aber nicht zwingend erforderlich. So lange deine Stile sich irgendwo innerhalb des `src/`-Verzeichnisses befinden und korrekt importiert werden, wird Astro sie verarbeiten und optimieren.

### `public/`

Das Verzeichnis `public/` ist für Dateien und Inhalte vorgesehen, die Astro während des Buildvorgangs nicht verarbeiten muss. Diese Dateien werden während des Buildvorgangs unverändert in das Ausgabeverzeichnis kopiert.

Dieses Verhalten macht `public/` ideal für verbreitete Inhalte wie Bilder und Schriftarten, sowie für besondere Dateien wie `robots.txt` und `manifest.webmanifest`.

Du kannst zwar auch CSS- und JavaScript-Dateien in `public/` speichern, beachte aber bitte, dass diese dann während des Buildvorgangs weder gebündelt noch optimiert werden.

 💡 *Als allgemeine Regel kann man sagen, dass jeglicher CSS- oder JavaScript-Code, den du selbst geschrieben hast, im `src/`-Verzeichnis gespeichert werden sollte.*

### `package.json`

Diese Datei wird von JavaScript-Paketmanagern verwendet, um die erforderlichen Pakete ("Abhängigkeiten") eines Projekts zu verwalten. Sie definiert auch die Skripte, die üblicherweise dazu verwendet werden, um Astro auszuführen (z.B. `npm start`, `npm run build`).

Eine Anleitung zur Erstellung einer neuen `package.json`-Datei für dein Projekt findest du auf der Seite [Manuelle Installation von Astro](/de/install/manual/).

### `astro.config.mjs`

Diese Datei wird von jeder Starter-Vorlage generiert und enthält Konfigurationsoptionen für dein Astro-Projekt. Hier kannst du die zu verwendenden Integrationen, Build-Optionen, Serveroptionen und mehr angeben.

Weiterführende Informationen zur Konfiguration von Astro findest du in der [Konfigurationsreferenz](/de/reference/configuration-reference/#article).
