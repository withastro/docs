---
layout: ~/layouts/MainLayout.astro
title: Layouts
description: Eine Einführung in Layouts - eine Astro-Komponenten-Art, mit der sich mehrere Seiten eine gemeinsame Gestaltung teilen können.
---

**Layouts** sind besondere [Astro-Komponenten](/de/core-concepts/astro-components/), die nützlich für die Erstellung wiederverwendbarer Seitenvorlagen sind.

Eine Layout-Komponente wird üblicherweise verwendet, um einer [`.astro`- oder `.md`-Seite](/de/core-concepts/astro-pages/) sowohl ein **Seiten-Gerüst** (`<html>`, ` <head>` und `<body>`-Tags) als auch einen `<slot />` zur Verfügung zu stellen, der bestimmt, wo im Layout der Seiteninhalt eingefügt werden soll.

Layouts enthalten häufig gemeinsame `<head>`-Elemente und gemeinsame UI-Elemente der Website, z.B. Kopfzeilen, Navigationsleisten und Fußzeilen.

Layouts werden normalerweise im Verzeichnis `src/layouts` deines Projekts abgelegt.

## Beispiel-Layout

```astro
---
// Beispiel: src/layouts/MeinLayout.astro
---
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <nav>
      <a href="#">Startseite</a>
      <a href="#">Beiträge</a>
      <a href="#">Kontakt</a>
    </nav>
    <article>
      <slot /> <!-- Dein Inhalt wird hier eingefügt -->
    </article>
  </body>
</html>
```

```astro
---
// Beispiel: src/pages/index.astro
import MeinLayout from '../layouts/MeinLayout.astro';
---
<MeinLayout>
  <p>Mein Seiteninhalt, umgeben von einem Layout!</p>
</MeinLayout>
```

📚 Lerne mehr über die Verwendung von [Slots](/de/core-concepts/astro-components/#slots).


## Verschachtelung von Layouts

Layout-Komponenten müssen nicht eine ganze Seite im HTML-Format enthalten. Du kannst deine Layouts in kleinere Komponenten aufteilen und diese Komponenten dann wiederverwenden, um noch flexiblere, leistungsfähigere Layouts in deinem Projekt zu erstellen.

Beispielsweise könnte ein übliches Layout für Blogbeiträge einen Titel, ein Datum und einen Autor anzeigen. Eine `BlogBeitragsLayout.astro`-Layout-Komponente könnte diese Informationen zur Seite hinzufügen und für die Darstellung der restlichen Seitenelemente ein größeres, Website-weites Basis-Layout nutzen.

```astro
---
// Beispiel: src/layout/BlogBeitragsLayout.astro
import BasisLayout from '../layouts/BasisLayout.astro'
const {content} = Astro.props;
---
<BasisLayout>
  <h1>{content.title}</h1>
  <h2>Autor des Beitrags: {content.author}</h2>
  <slot />
</BasisLayout>
```


## Markdown-Layouts

Seitenlayouts sind besonders nützlich für [Markdown-Dateien](/de/guides/markdown-content/#markdown-pages). Markdown-Dateien können die spezielle Frontmatter-Eigenschaft `layout` verwenden, um eine Layout-Komponente anzugeben, die den Markdown-Inhalt in ein ganzseitiges HTML-Dokument einbettet.

Wenn eine Markdown-Seite ein Layout verwendet, übergibt sie dem Layout eine einzelne `content`-Eigenschaft, die alle Markdown-Frontmatter-Daten und die gerenderte HTML-Ausgabe enthält. Sieh dir das Beispiel `BlogBeitragsLayout.astro` oben an, um zu erfahren, wie du diese `content`-Eigenschaft in deiner Layout-Komponente verwenden kannst.


```markdown
---
# src/pages/posts/beitrag-1.md
title: Blogbeitrag
description: Mein erster Blogbeitrag!
layout: ../../layouts/BlogBeitragsLayout.astro
---
Dies ist ein Beitrag, der in Markdown geschrieben wurde.
```

📚 Erfahre mehr über Astros Markdown-Unterstützung in unserer [Markdown-Anleitung](/de/guides/markdown-content/).
