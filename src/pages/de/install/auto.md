---
title: Automatische Installation von Astro
description: So installierst du Astro mit dem Assistenten create-astro und NPM, PNPM oder Yarn.
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
---
Bist du bereit, Astro zu installieren? In dieser Installationsanleitung findest du alle Informationen, um direkt loszulegen.

#### Voraussetzungen

- **Node.js** - `14.15.0`, `v16.0.0` oder höher.
- **Texteditor** - Wir empfehlen [VS Code](https://code.visualstudio.com/) mit unserer [offiziellen Astro-Erweiterung](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro wird über seine Befehlszeilenschnittstelle (CLI) gesteuert.

<InstallGuideTabGroup />

#### So funktioniert die automatische Installation

Unser Assistent `create-astro` ist der schnellste und einfachste Weg, ein neues Astro-Projekt von Grund auf zu erstellen.


## 1. Starte den Assistenten

Führe den nachfolgenden Befehl in deinem Terminal aus, um unseren praktischen Installations-Assistenten `create-astro` zu starten. Dieser führt dich durch die nötigen Schritte, um ein neues Astro-Projekt zu erstellen.

*Hinweis: Es ist nicht erforderlich, vorher ein neues Verzeichnis für dein Projekt zu erstellen! Diesen Schritt übernimmt der Assistent für dich.*

```shell
# npm
npm create astro@latest

# yarn
yarn create astro

# pnpm
pnpm create astro@latest
```

Abhängig von deinem Paketmanager musst du möglicherweise die Installation von `create-astro@latest` bestätigen, damit es losgehen kann.

Danach wirst du aufgefordert, den Verzeichnisnamen einzugeben, in dem der Assistent dein Projekt erstellen soll (z.B. `./meine-astro-seite`).

### Wähle eine Vorlage

Nun siehst du eine kurze Liste von Vorlagen, aus denen du wählen kannst:
- `Just the basics`: Eine ideale Einstiegsvorlage für alle, die Astro erkunden wollen.
- `Blog`, `Documentation`, `Portfolio`: Vorlagen mit umfangreicheren Vorgaben für beliebte Website-Arten.
- `Completely empty`: Eine Vorlage, die nur das Nötigste enthält, um loszulegen.

Verwende die Pfeiltasten (auf und ab) zur Navigation, und bestätige deine Auswahl mit der Eingabetaste.

> 💡 Möchtest du dir die Vorlagen im Browser ansehen, bevor du dich entscheidest? Dann schau hier vorbei: [astro.new](https://astro.new/)

### Installiere erforderliche Pakete (optional)

Der Assistent bietet dir nun an, direkt den `install`-Befehl deines Paketmanagers auszuführen, um alle erforderlichen Pakete zu installieren. Dieser Schritt ist optional.

> ⚠️ Wenn du diesen Schritt überspringst, musst du nach Abschluss des Assistenten selbst die [erforderlichen Pakete installieren](/de/install/auto/#2-installiere-erforderliche-pakete), bevor du dein Projekt starten kannst.

### Installiere offizielle Integrationen (optional)

Du hast nun die Möglichkeit, die Unterstützung für [zusätzliche UI-Frameworks](/de/core-concepts/framework-components/) (React, Svelte, Vue, Solid, Preact, Lit), sowie andere offizielle Astro-Integrationen (Tailwind, Turbolinks, Partytown, Sitemap) zu installieren. Wenn du dich dafür entscheidest, führt der Assistent den Befehl `astro add --yes` aus.

Um auszuwählen, welche Astro-Integrationen installiert werden sollen, verwende die Pfeiltasten (auf und ab) zur Navigation, und die Leertaste, um die aktuelle Integration zur Auswahl hinzuzufügen oder zu entfernen. Du kannst beliebig viele Integrationen gleichzeitig auswählen, oder auch ganz ohne Auswahl fortfahren.

Wenn du mit deiner Auswahl zufrieden bist, bestätige sie mit der Eingabetaste.

> Alle offiziellen Integrationen, sowie jegliche [Astro-Community-Integrationen](https://astro.build/integrations/) können auch später hinzugefügt werden. Siehe dazu unsere [Integrationsanleitung](/de/guides/integrations-guide/).

Nachdem du die hinzuzufügenden Integrationen ausgewählt hast, solltest du die folgende Meldung in deinem Terminal sehen, die dich darüber informiert, welche Änderungen `create-astro` an der Konfigurationsdatei `astro.config.mjs` deines Projekts vornehmen wird:

```bash
Astro will make the following changes to your config file:
```

Danach sollte der Assistent zurückmelden, dass die gewählten Integrationen erfolgreich hinzugefügt wurden. (Falls nicht, kannst du sie später jederzeit manuell hinzufügen.)

### Erstelle ein .git-Repository (optional)

Im letzten Schritt kannst du wählen, ob ein Git-Repository in deinem neuen Projektverzeichnis erstellt werden soll. Dieser optionale Schritt ist nützlich, wenn du das bekannte Tool [Git](https://git-scm.com/) für die Versionsverwaltung deines Projekts verwenden möchtest.

### Nächste Schritte

Nach Abschluss empfiehlt der `create-astro`-Installationsassistent dir einige nächste Schritte, um die Einrichtung abzuschließen und dein neues Projekt zu starten.


## 2. Installiere erforderliche Pakete

Falls du den Schritt zur Installation erforderlicher Pakete im Assistenten übersprungen hast, ist es nun an der Zeit, dies mit deinem bevorzugten Paketmanager zu erledigen:

```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install
```


## 3. Starte Astro ✨

Astro stellt einen integrierten Entwicklungsserver bereit, den du voraussichtlich für den Großteil der Entwicklung deines Projekts verwenden wirst. Er stellt den einfachsten Weg dar, dein Projekt während der Entwicklung lokal auszuführen.

Verwende deinen Paketmanager, um das vorkonfigurierte Startskript auszuführen:

```bash
# npm
npm run dev

# yarn
yarn start

# pnpm
pnpm run dev
```

Wenn alles gut geht, sollte dein Astro-Projekt jetzt unter [http://localhost:3000](http://localhost:3000) aufrufbar sein!

Astro überwacht zur Laufzeit alle Dateien im Verzeichnis `src/`, sodass du den Server nicht neu starten musst, wenn du während der Entwicklung Änderungen vornimmst.

Falls du dein Projekt nicht im Browser aufrufen kannst, gehe zurück zum Terminal, in dem du den Startbefehl gegeben hast, und prüfe die angezeigten Meldungen, um eventuelle Probleme zu beheben.


## 4. Veröffentliche dein Projekt

Es ist an der Zeit, dein Projekt im Internet zu veröffentlichen! Führe das mitgelieferte `build`-Skript aus, um eine statische Website aus deinem Projekt zu erzeugen und sie im neuen Verzeichnis `dist/` zu speichern.

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm run build
```

Sobald der Build-Vorgang abgeschlossen ist, solltest du ein neues Verzeichnis `dist/` in deinem Projektverzeichnis finden, dessen Inhalt du direkt bei deinem bevorzugten Hosting-Anbieter veröffentlichen kannst.

Besuche unseren Partner [Netlify](https://www.netlify.com/), um kostenlos ins Hosting deiner Website einzusteigen. Weitere Details zur Veröffentlichung deiner Website bei beliebigen Hosting-Anbietern findest du in unserer [Veröffentlichungs-Anleitung](/de/guides/deploy/).

## Nächste Schritte

Geschafft! Jetzt kannst du mit der Entwicklung beginnen!

📚 Erkunde Astros [Projektstruktur](/de/core-concepts/project-structure/).

📚 Lerne, wie du [Komponenten](/de/core-concepts/astro-components/) auf deinen Seiten nutzen kannst.

📚 Erfahre mehr über Astros [dateibasiertes Routing](/de/core-concepts/astro-pages/).
