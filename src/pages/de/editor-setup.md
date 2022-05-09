---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: "Editor-Einrichtung"
description: Richte deinen Editor ein, um etwas mit Astro zu kreieren.
---

Passe deinen Code-Editor an, um die Astro-Entwicklererfahrung zu verbessern und neue Funktionen freizuschalten.

## VS Code

[VS Code](https://code.visualstudio.com) ist ein beliebter Code-Editor für Webentwickler, der von Microsoft entwickelt wurde. Die VS Code-Engine treibt auch beliebte Browserbasierte Code-Editoren wie [GitHub Codespaces](https://github.com/features/codespaces) und [Gitpod](https://gitpod.io) an.

Astro funktioniert mit jedem Code-Editor. VS Code ist jedoch der von uns empfohlene Editor für Astro-Projekte. Wir bieten eine offizielle [Astro VS Code Erweiterung](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) an, die mehrere wichtige Funktionen und Verbesserungen für Entwickler in Astro-Projekten freischaltet.

- Syntaxhervorhebung für `.astro`-Dateien.
- TypeScript-Typinformationen für "Astro"-Dateien.
- [VS Code Intellisense](https://code.visualstudio.com/docs/editor/intellisense) für Code-Vervollständigung, Hinweise und mehr.

Um loszulegen, installiere noch heute die [Astro VS Code Erweiterung](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).

>⚙️ Schau dir an, wie du in deinem Astro-Projekt [TypeScript einrichtest](/de/guides/typescript/).

## Andere Code-Editoren

Unsere wunderbare Community stellt mehrere Erweiterungen für andere beliebte Editoren bereit, darunter auch:

- [VS Code Erweiterung auf Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">Offiziell</Badge></span> - Die offizielle Astro Erweiterung für VS Code, verfügbar im Open VSX Registry für quelloffene Plattformen wie [VSCodium](https://vscodium.com/)
- [Nova Extension](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/) <span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> - Syntaxhervorhebungen, IntelliSense, Autovervollständigung fur Astro

## Browser Editoren

Zusätzlich zu den lokalen Editoren läuft Astro auch gut mit im Browser gehosteten Editoren, einschließlich:

- [StackBlitz](https://stackblitz.com) und [CodeSandbox](https://codesandbox.io) - Online-Editoren, die in deinem Browser laufen, mit eingebauter Syntaxhervorhebungs-Unterstützung für `.astro`-Dateien. Keine Installation oder Konfiguration erforderlich!
- [GitHub.dev](https://github.dev) - ermöglicht die Installation der Astro VS Code-Erweiterung als [Web-Erweiterung](https://code.visualstudio.com/api/extension-guides/web-extensions), wodurch du nur Zugriff auf einige der Funktionen der Erweiterung hast. Derzeit wird nur die Syntaxhervorhebung unterstützt.
- [Gitpod](https://gitpod.io) - eine vollständige Entwicklungsumgebung in der Cloud, mit der die offizielle Astro VS Code-Erweiterung von Open VSX installiert werden kann.
