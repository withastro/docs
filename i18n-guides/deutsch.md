# Anleitung für deutsche Übersetzungen

Hallo und herzlich willkommen! Wir freuen uns sehr, dass du dich dafür interessierst, bei der deutschen Übersetzung der Astro-Dokumentation mitzuwirken. 😊🚀

## Zielsetzung dieser Anleitung

Wie bei Open Source-Projekten üblich wird unsere Dokumentation von vielen fleißigen Personen auf freiwilliger Basis übersetzt. Die aktuellen Übersetzungen stammen daher aus vielen unterschiedlichen Federn. Zudem ändert sich auch die Besetzung unseres Teams im Laufe der Zeit.

Diese Anleitung soll dazu beitragen, dass sich das Ergebnis beim Lesen trotz aller verschiedenen Einflüsse wie ein Gesamtwerk mit gemeinsamem Schreibstil anfühlt.

## Übersetzungs-Glossar

| Originalbegriff             | Übersetzung                          | Anmerkungen
|:----------------------------|:-------------------------------------|:------------
| asset                       | Asset                                | Wird nicht übersetzt (gängiger Domänenbegriff).
| branch                      | der Branch                           | s.o.
| build process               | Erzeugungs- / Erstellungsvorgang     | s.o.
| build time                  | Erzeugungs- / Erstellungszeitpunkt   | s.o.
| to build                    | erzeugen                             | Da die Alternativen „bauen“ oder gar „builden“ merkwürdig klingen, wird diese Übersetzung vermutlich so bleiben.
| command line                | die Kommandozeile                    |
| Commit                      | Commit                               | Siehe [Stilrichtlinien](#stilrichtlinien-style-guide)
| CLI                         | die Kommandozeilen&shy;schnittstelle | Beim ersten Vorkommen in einem Abschnitt kann `(CLI)` dahinter ergänzt werden.
| CLI flag                    | die Kommandozeilen&shy;option        |
| configuration option        | die Konfigurations&shy;option        | Wenn klar ist, dass es um die Konfiguration geht, kann auch nur „Option“ verwendet werden.
| deployment provider         | der Hosting-Anbieter                 |
| to deploy                   | veröffentlichen                      | Wir vermeiden „ausliefern“ aufgrund der Zweideutigkeit.
| dev toolbar                 | die Entwicklungs&shy;werkzeugleiste  |
| directory                   | das Verzeichnis                      |
| domain                      | die Domäne                           |
| frontmatter                 | das Frontmatter                      | Wird nicht übersetzt (gängiger Domänenbegriff).
| frontmatter prop(erty)      | die Frontmatter-Eigenschaft          |
| frontmatter value           | der Frontmatter-Wert                 |
| to hydrate (an element)     | hydratisieren                        | Falsch hingegen wäre „hydrieren“.
| island(s)                   | Island(s)                            | „Islands“ bleibt unübersetzt. „Astro“ wird davorgesetzt, um den Feature-Charakter zu betonen. Beim ersten Vorkommen: `(Insel(n))` ergänzen zur Verständlichkeit.
| media query                 | Media Query                          | Wird nicht übersetzt (gängiger Domänenbegriff).
| page                        | die Seite                            | Eine einzelne (HTML-)Seite. Wir vermeiden die längere Form „Webseite“, um Verwechslungen mit „Website“ zu vermeiden.
| partial hydration           | die partielle Hydratation            | Falsch hingegen wäre „Hydrierung“.
| project root (directory)    | das Projektstamm&shy;verzeichnis     | 
| recipe                      | das Beispiel                         |
| repository                  | das Repository                       | Wird nicht übersetzt (gängiger Domänenbegriff).
| request                     | die Anfrage                          |
| script                      | das Skript                           |
| selective hydration         | die selektive Hydratation            | Falsch hingegen wäre "Hydrierung".
| site, website               | die Website                          | Eine vollständige Webpräsenz unter einer gemeinsamen Domain, bestehend aus beliebig vielen (HTML-)Seiten.
| style, styles               | Style, Styles                        | Wird nicht übersetzt (gängiger Domänenbegriff).
| scoped style                | Scoped Style                         | Beim ersten Vorkommen sollte die deutsche Erklärung `(auf Komponenten begrenzte lokale CSS-Stile)` dahinter ergänzt werden.
| template                    | die Vorlage                          |
| ui                          | die Benutzeroberfläche               |
| web                         | das Internet                         |

## Stilrichtlinien (Style Guide)

- Wir halten uns hinsichtlich Grammatik und Rechtschreibung an die Empfehlungen des Dudens und verwenden die neue deutsche Rechtschreibung.
- Wir verwenden eine informelle Ansprache mit kleingeschriebenem "du" (statt "Du" oder "Sie").
- Wir bleiben möglichst nah am englischen Originaltext.
	- Falls die Übersetzung sich aber nicht flüssig liest, weil z. B. im Deutschen übliche Überleitungen fehlen oder andere Formulierungen geläufiger sind, kann freier übersetzt werden, so lange die Bedeutung korrekt bleibt.
- Wir übersetzen alle Kommentare in Code-Beispielen.
- Komponenten-, Klassen- und Variablennamen in Code-Beispielen werden nicht übersetzt.
- Wir haben uns gegen das Gendern in unserer Übersetzung entschieden, weil es die Lesbarkeit der Texte verschlechtert und noch keine Duden-Vorgaben dafür existieren. Wir vermeiden lieber geschlechtsspezifische Formulierungen in unseren Übersetzungen und formulieren die Texte so, dass niemand sich ausgeschlossen fühlen muss.
- Wir vermeiden wertende Adjektive wie "einfach", "simpel" usw., da es immer Personen geben wird, denen das beschriebene Thema eben nicht "einfach" oder "simpel" vorkommt. Wir möchten niemandem den Eindruck vermitteln, fachlich "nicht gut genug" zu sein.
- Wir übersetzen nicht zwanghaft Begriffe, die aus einem Ökosystem-spezifischen Kontext stammen. Eine Wort für Wort Übersetzung ist meistens nicht möglich, sodass eine ausführliche Erklärung folgen müsste, was wiederum die Lesbarkeit verschlechtert. Ein gutes Beispiel hierfür wären Begriffe, wie `Commit`, `Pull Request` und `merge`, die teils einen ganzen Prozess im Git-Ökosystem beschreiben.
- Bei Wörtern, die länger als 20 Zeichen sind, fügen wir generell einen weichen Bindestrich (`&shy;`) ein. Um solche Wörter zu finden, kann der folgende reguläre Ausdruck zum Suchen im Code-Editor verwendet werden: `\b[A-Za-zÄäÖöÜüß]{20,}\b`
- Wir verwenden untere (`„`) und obere (`“`) Anführungszeichen anstelle von englischen quotation marks (`"`) (`„Erstelle deinen ersten Astro-Blog“`)

## Häufige Fehler

> **🚨 Wichtig:** Bitte sieh dir die nachfolgenden Fehler genau an und vermeide sie in deinen Übersetzungen. Insbesondere der erste Fehler (fehlende Bindestriche) tritt besonders häufig auf und verursacht so vermeidbare Arbeit bei Reviews.

- Fehlende Bindestriche bei zusammengesetzten Wörtern
	- Astro Projekt --> Astro-Projekt
	- `<description>` Feld --> `<description>`-Feld
	- Readme Datei --> Readme-Datei
- Falsche Übersetzung von Infoboxen ("Asides")
  - Unsere Dokumentation enthält an manchen Stellen farblich hervorgehobene Boxen mit Hinweisen, Tipps und Warnungen. Diese sind im Markdown-Code mit drei Doppelpunkten abgegrenzt und beginnen mit dem Typnamen der Box (`:::note`, `:::tip`, `:::caution`). Dieser Typname ist **nicht** zu übersetzen, da ansonsten die Infobox nicht mehr funktioniert.
  - Falls dem Typnamen eine vom Standard abweichende Überschrift in eckigen Klammern folgt (`:::caution[Here be dragons!]`), darf nur der Teil in eckigen Klammern übersetzt werden.
- Nichtverwendung der vom Duden empfohlenen Schreibweisen
	- mit Hilfe --> mithilfe
- Falsch geschriebene Markennamen (wir halten uns an die offizielle Schreibweise auf der Hersteller-Website)
    - Github → GitHub
    - Gitlab → GitLab
    - Javascript → JavaScript
    - Typescript → TypeScript
    - VSCode → VS Code
    - NPM → npm
- Abkürzungen müssen in der gleichen Zeile stehen. Hierfür wird das [Unicode Symbol "U+00A0 NO-BREAK SPACE"](https://unicode-explorer.com/c/00A0) (` `) verwendet:
    - zum Beispiel --> `z. B.` (am besten mit geschütztem Leerzeichen, sonst die HTML-Entität)
- Verwendung der falschen Anführungszeichen ("" statt „“)

## Hast du Ergänzungen oder Anregungen zu dieser Anleitung?

Das ist super! Die Inhalte dieses Dokuments sind nämlich nicht als in Stein gemeißelte "Regeln von oben" zu verstehen, sondern bilden lediglich den aktuellen Konsens unseres deutschen Übersetzungsteams ab. 

Solltest du Verbesserungsideen oder Änderungswünsche zu diesem Dokument haben, besuch uns gerne auf Discord und sprich mit uns darüber. Wir sind stets offen für neue Anregungen!
