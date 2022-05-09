---
setup: |
    import Button from '../../components/Button.astro'
    import ContributorList from '../../components/ContributorList.astro'
layout: ~/layouts/MainLayout.astro
title: Erste Schritte
description: Eine einfache Einführung in Astro
---
Erzeuge statische Websites  🚀  Nutze dein Lieblings-Framework  🚀  Sende weniger JavaScript zum Browser


> Benutzt du noch eine ältere Astro-Version in deinem Projekt? Folge unserer [Migrations-Anleitung](/de/migrate/), um auf die v1.0 Beta zu aktualisieren!


## So legst du mit Astro los

Wir haben es dir so einfach wie möglich gemacht, mit Astro entweder in deinem Browser oder lokal auf deiner Maschine loszulegen.

### Teste Astro direkt im Browser

Besuche [astro.new](https://astro.new), um Astro ganz ohne Installation zu testen. Wähle deinen Favoriten aus einer **Vielzahl von Vorlagen** ("Startern"), und beginne die Entwicklung deiner Seite mit einer voll funktionsfähigen Astro-Version direkt in deinem Browser!

Du kannst auch **mit unserer Basis-Vorlage loslegen** - sie ist nur einen Knopfdruck entfernt:

<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
    <Button href="https://astro.new/basics?on=codesandbox">In CodeSandbox öffnen</Button>
    <Button href="https://astro.new/basics?on=stackblitz">In StackBlitz öffnen</Button>
</div>

### Installiere Astro lokal

Du bist bereit für eine lokale Installation? Super!

Mit unserem Assistenten `create-astro` kannst du im Handumdrehen ein Astro-Projekt direkt von deiner Kommandozeile aus anlegen:

```bash
# Erstelle ein Projektverzeichnis und wechsle dorthin
mkdir my-astro-project && cd $_

# Erzeuge ein neues Astro-Projekt mit npm
npm create astro@latest

# ...oder yarn
yarn create astro

# ...oder pnpm
pnpm create astro@latest
```

⚙️ Unsere [Installations-Anleitung](/de/install/auto/) erklärt sowohl die Nutzung unseres Assistenten als auch die nachfolgenden Schritte - bis hin zur Veröffentlichung deiner neuen Astro-Seite!

⚙️ Alternativ kannst du auch eine [manuelle Installation](/de/install/manual/) ohne den Assistenten durchführen.


## Fülle deine Astro-Seite mit Leben

Jetzt kannst du loslegen und Inhalte und Funktionen zu deiner Seite hinzufügen:

🏗️ Erstelle [Astro (.astro)-Seiten](/de/core-concepts/astro-pages/) und/oder [Markdown (.md)-Seiten](/de/guides/markdown-content/).

🏗️ Erzeuge dein erstes [Layout](/de/core-concepts/layouts), um deinen Seiten einen gemeinsamen Rahmen zu geben.

🏗️ Nutze [CSS & Styling](/de/guides/styling/), um die Optik deiner Seite zu verändern.

*...weitere Möglichkeiten findest du im Abschnitt **Funktionen**!*


## Lerne mehr über Astro

Hier findest du weiterführende Informationen über die grundlegenden Konzepte und Strukturen einer Astro-Seite:

📚 Sieh dir Astros [Projektstruktur](/de/core-concepts/project-structure/) an.

📚 Lerne, welche [Vorlagen-Direktiven](/de/reference/directives-reference/) du auf Astro-Seiten nutzen kannst.

📚 Erkunde Astros [Laufzeit-API](/de/reference/api-reference/).

*...weitere Inhalte findest du im Abschnitt **Referenz**!*


## Erweitere Astro

🧰 Starte dein Projekt mit einer [vorgefertigten Vorlage](https://astro.build/themes/).

🧰 Passe es mit offiziellen und Community-beigesteuerten [Erweiterungen](https://astro.build/integrations/) an.

🧰 Lass dich von unserer [Webseiten-Galerie](https://astro.build/showcase) inspirieren.

*...mehr findest du in unserer Anleitung zur [Nutzung von Integrationen](/de/guides/integrations-guide/)!*


## Werde Teil unserer Community

Trete dem [Astro-Discord](https://astro.build/chat) bei, um deine Erfahrungen und Fragen rund um Astro mit unserer aktiven, freundlichen Community zu teilen:

💬 Stell dich im Kanal `#introduce-yourself` vor!

💬 Frag unser Support-Team im Kanal `#support-threads`!

💬 Zeig uns dein Astro-Projekt im Kanal `#showcase`!


## Weiterführende Links

[Astro-Blog](https://astro.build/blog/)

[Astro-Änderungsverlauf](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

[Migrations-Anleitung](/de/migrate/)


## Wirke bei Astro mit

Die Astro-Dokumentation wurde von einer Vielzahl hilfreicher Personen erstellt. Willst auch du mitwirken? [Besuche uns auf GitHub!](https://github.com/withastro/docs)

<ContributorList githubRepo="withastro/docs" />
