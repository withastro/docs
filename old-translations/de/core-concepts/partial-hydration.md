---
layout: ~/layouts/MainLayout.astro
title: Partielle Hydratation in Astro
description: Erfahre, wie die partielle Hydratation mit der "Insel-Architektur" in Astro funktioniert.
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
---

**Astro erzeugt jede Website standardmäßig komplett ohne clientseitigen JavaScript-Code.** Du kannst Komponenten verwenden, die mit den UI-Frameworks [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) oder [Lit](https://lit.dev/) erstellt wurden, und Astro wird diese während des Buildvorgangs in reinen HTML-Code umwandeln ("rendern") und den JavaScript-Code entfernen. So bleibt jede Astro-Website standardmäßig schnell.

```astro
---
// Beispiel: Verwende eine statische React-Komponente auf der Seite,
// ohne JavaScript-Code zum Browser zu senden.
import MeineReactKomponente from '../components/MeineReactKomponente.jsx';
---
<!-- 100% HTML, kein JavaScript! -->
<MeineReactKomponente />
```

Manchmal ist es aber erforderlich, JavaScript zum Browser zu senden, um interaktive Benutzeroberflächen zu erstellen. Falls du solche Interaktivität auf deiner Seite benötigst, zwingt Astro dich nicht dazu, gleich die gesamte Seite mit JavaScript zu rendern. Stattdessen verwendet Astro eine Technik namens **Partielle Hydratation**, mit der du einzelne Komponenten auf der Seite interaktiv machen ("hydratisieren") kannst. Auf diese Weise wird nur der absolut erforderliche JavaScript-Code zum Browser gesendet, den du zur Ausführung deiner Seite benötigst.

```astro
---
// Beispiel: Verwende eine dynamische React-Komponente auf der Seite.
import MeineReactKomponente from '../components/MeineReactKomponente.jsx';
---
<!-- Diese Komponente auf der Seite ist nun interaktiv! 
     Der Rest deiner Website bleibt unverändert. -->
<MeineReactKomponente client:load />
```

Der Großteil deiner Website bleibt reines, leichtgewichtiges HTML & CSS mit isolierten **Inseln der Interaktivität**.


## Partielle Hydratation

Es gibt viele Anwendungsfälle, in denen es erforderlich ist, eine interaktive UI-Komponente im Browser auszuführen. Hier einige Beispiele:

- Ein Bilderkarussell
- Ein Suchfeld mit automatischer Vervollständigung
- Ein Button zum Öffnen/Schließen einer mobilen Seitenleiste
- Ein "Jetzt kaufen"-Button

In Astro ist es deine Entscheidung als Entwickler, welche Komponenten wirklich im Browser ausgeführt werden müssen. Astro hydratisiert nur genau die von dir ausgewählten Komponenten und verwendet für den Rest deiner Website statisches HTML. Diese Technik wird als **partielle Hydratation** bezeichnet.

**Partielle Hydratation ist das Geheimnis, mit dem Astro Websites standardmäßig schnell macht.**


## Insel-Architektur

Als **Insel-Architektur** bezeichnet man das Konzept, partielle Hydratation zur Entwicklung von Websites zu verwenden. Die Insel-Architektur stellt eine Alternative zur sonst üblichen Vorgehensweise dar, die gesamte Website in ein clientseitiges JavaScript-Bundle zu verpacken, das an den Browser gesendet werden muss.

> Die grundsätzliche Idee der "Insel"-Architektur ist verblüffend einfach: Auf dem Server werden HTML-Seiten gerendert, und hochdynamische Bereiche darin werden mit Platzhaltern und Aussparungen versehen.
> <br/> -- Mehr dazu im englischsprachigen Artikel von Jason Miller: [Islands Architecture](https://jasonformat.com/islands-architecture/)

Neben den offensichtlichen Leistungsvorteilen, die durch das Senden von weniger JavaScript an den Browser erzielt werden, bietet die Insel-Architektur zwei weitere Hauptvorteile:

- **Komponenten werden einzeln geladen.** Eine leichtgewichtige Komponente (z.B. ein Button zum Umschalten einer Seitenleiste) wird schnell geladen und gerendert, ohne von umfangreicheren Komponenten auf der Seite blockiert zu werden.
- **Komponenten werden voneinander getrennt gerendert.** Jeder Teil der Seite stellt eine isolierte Einheit dar, und Leistungsprobleme einer Einheit wirken sich nicht direkt negativ auf die anderen Einheiten aus.

<IslandsDiagram>
	<Fragment slot="headerApp">Header-"App"</Fragment>
	<Fragment slot="sidebarApp">Sidebar-"App"</Fragment>
	<Fragment slot="main">
		Server-gerenderte HTML-Inhalte wie Text, Bilder usw.
	</Fragment>
	<Fragment slot="carouselApp">Bilder&shy;karussell-"App"</Fragment>
	<Fragment slot="advertisement">Werbung<br/>(server-gerendert)</Fragment>
	<Fragment slot="footer">Footer (server-gerendertes HTML)</Fragment>
</IslandsDiagram>

_Quelle: [Islands Architecture](https://jasonformat.com/islands-architecture/) von Jason Miller_
