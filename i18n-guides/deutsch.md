# Anleitung für deutsche Übersetzungen

Hallo und herzlich willkommen! Wir freuen uns sehr, dass du dich dafür interessierst, bei der deutschen Übersetzung der Astro-Dokumentation mitzuwirken. 😊🚀

## Zielsetzung dieser Anleitung

Wie bei Open Source-Projekten üblich wird unsere Dokumentation von vielen fleißigen Personen auf freiwilliger Basis übersetzt. Die aktuellen Übersetzungen stammen daher von einigen unterschiedlichen Leuten. Zudem ändert sich auch die Besetzung unseres Teams im Laufe der Zeit.

Diese Anleitung soll dazu beitragen, dass sich das Ergebnis beim Lesen trotz aller verschiedenen Einflüsse wie ein Gesamtwerk mit gemeinsamem Schreibstil anfühlt.

## Übersetzungs-Glossar

| Originalbegriff             | Übersetzung                          | Anmerkungen
|:----------------------------|:-------------------------------------|:------------
| asset                       | Asset                                | Wird nicht übersetzt (gängiger Domänenbegriff).
| branch                      | der Branch                           | s.o.
| breaking change             | inkompatible Änderung                |
| build process               | Erzeugungs- / Erstellungsvorgang     | s.o.
| build time                  | Erzeugungs- / Erstellungszeitpunkt   | s.o.
| to build                    | erzeugen                             | Da die Alternativen „bauen“ oder gar „builden“ merkwürdig klingen, wird diese Übersetzung vermutlich so bleiben.
| command line                | die Kommandozeile                    |
| commit                      | Commit                               | Siehe [Stilrichtlinien](#stilrichtlinien-style-guide)
| content collection          | Content-Collection                   | Beim ersten Vorkommen in einem Abschnitt kann „(Inhaltssammlung)“ ergänzt werden.
| CLI                         | die Kommandozeilen&shy;schnittstelle | Beim ersten Vorkommen in einem Abschnitt kann „(CLI)“ dahinter ergänzt werden.
| CLI flag                    | die Kommandozeilen&shy;option        |
| configuration option        | die Konfigurations&shy;option        | Wenn klar ist, dass es um die Konfiguration geht, kann auch nur „Option“ verwendet werden.
| deployment provider         | der Hosting-Anbieter                 |
| to deprecate                | Nutzung nicht mehr empfohlen         | _Feature X is deprecated_ → _Die Nutzung von Feature X ist nicht mehr empfohlen_
| deprecation                 | die Abkündigung                      | alternativ paraphrasiert, basierend auf der Übersetzung von _to deprecate_ (s.o)
| to deploy                   | veröffentlichen                      | Wir vermeiden „ausliefern“ aufgrund der Zweideutigkeit.
| dev server                  | der Entwicklungsserver               |
| dev toolbar                 | die Entwicklungs&shy;werkzeugleiste  |
| directory                   | das Verzeichnis                      |
| domain                      | die Domäne                           |
| framework                   | das Framework                        | Wird nicht übersetzt (gängiger Domänenbegriff).
| frontmatter                 | das Frontmatter                      | Wird nicht übersetzt (gängiger Domänenbegriff).
| frontmatter prop(erty)      | die Frontmatter-Eigenschaft          |
| frontmatter value           | der Frontmatter-Wert                 |
| guide                       | die Anleitung                        |
| to hydrate (an element)     | hydratisieren                        | Falsch hingegen wäre „hydrieren“.
| island(s)                   | Island(s)                            | „Islands“ bleibt unübersetzt. „Astro“ wird davorgesetzt, um den Feature-Charakter zu betonen. Beim ersten Vorkommen: „(Insel(n))“ ergänzen zur Verständlichkeit.
| to log                      | protokollieren                       |
| the logging                 | die Protokollierung                  | Kann im Einzelfall auch mit „Logging“ übersetzt werden.
| media query                 | Media Query                          | Wird nicht übersetzt (gängiger Domänenbegriff).
| page                        | die Seite                            | Eine einzelne (HTML-)Seite. Wir vermeiden die längere Form „Webseite“, um Verwechslungen mit „Website“ zu vermeiden.
| partial hydration           | die partielle Hydratation            | Falsch hingegen wäre „Hydrierung“.
| project root (directory)    | das Projektstamm&shy;verzeichnis     | 
| recipe                      | das Beispiel                         |
| to release                  | veröffentlichen                      |
| repository                  | das Repository                       | Wird nicht übersetzt (gängiger Domänenbegriff).
| request                     | die Anfrage                          |
| script                      | das Skript                           |
| selective hydration         | die selektive Hydratation            | Falsch hingegen wäre „Hydrierung“.
| site, website               | die Website                          | Eine vollständige Webpräsenz unter einer gemeinsamen Domain, bestehend aus beliebig vielen (HTML-)Seiten.
| style, styles               | Style, Styles                        | Wird nicht übersetzt (gängiger Domänenbegriff).
| scoped style                | Scoped Style                         | Beim ersten Vorkommen sollte die deutsche Erklärung „(auf Komponenten begrenzte lokale CSS-Stile)“ dahinter ergänzt werden.
| template                    | die Vorlage                          |
| UI                          | die Benutzeroberfläche               |
| to update/upgrade           | aktualisieren                        | als Substantiv „die Aktualisierung“
| web                         | das Internet                         |

## Stilrichtlinien (Style Guide)

- Wir halten uns hinsichtlich Grammatik und Rechtschreibung an die Empfehlungen des Dudens und verwenden die reformierte deutsche Rechtschreibung.
- Wir verwenden eine informelle Ansprache mit kleingeschriebenem „du“ (statt „Du“ oder „Sie“).
- Wir bleiben möglichst nah am englischen Originaltext.
	- Falls die Übersetzung sich aber nicht flüssig liest, weil z. B. im Deutschen übliche Überleitungen fehlen oder andere Formulierungen geläufiger sind, kann freier übersetzt werden, so lange die Bedeutung korrekt bleibt.
- Wir übersetzen alle Kommentare in Code-Beispielen.
- Komponenten-, Klassen- und Variablennamen in Code-Beispielen werden nicht übersetzt.
- Wir streben in unseren Übersetzungen eine neutrale Ausdrucksweise an, durch die sich niemand ausgeschlossen fühlen soll. Wo neutrale Formulierungen nicht möglich sind, wird aus Gründen der besseren Lesbarkeit auf die gleichzeitige Verwendung mehrgeschlechtlicher Sprachformen verzichtet. Sämtliche Personenbezeichnungen gelten dabei als geschlechtsneutral und beziehen sich gleichermaßen auf alle Geschlechter. Unsere Gemeinschaft lebt von Vielfalt – wir legen großen Wert darauf, dass sich jede Person, unabhängig von der Identität, hier willkommen und angesprochen fühlt.
- Wir vermeiden wertende Adjektive wie „einfach“, „simpel“ usw., da es immer Personen geben wird, denen das beschriebene Thema eben nicht „einfach“ oder „simpel“ vorkommt. Wir möchten niemandem den Eindruck vermitteln, fachlich „nicht gut genug“ zu sein.
- Wir übersetzen nicht zwanghaft Begriffe, die aus einem Ökosystem-spezifischen Kontext stammen. Eine Wort für Wort Übersetzung ist meistens nicht möglich, sodass eine ausführliche Erklärung folgen müsste, was wiederum die Lesbarkeit verschlechtert. Ein gutes Beispiel hierfür wären Begriffe, wie  „Commit“, „Pull Request“ und „merge“, die teils einen ganzen Prozess im Git-Ökosystem beschreiben.
- Bei Wörtern, die länger als 20 Zeichen sind, fügen wir generell einen weichen Bindestrich (`&shy;`) ein. Um solche Wörter zu finden, kann der folgende reguläre Ausdruck zum Suchen im Code-Editor verwendet werden: `\b[A-Za-zÄäÖöÜüẞß]{20,}\b`
- Wir verwenden untere (`„`) und obere (`“`) Anführungszeichen anstelle von englischen Anführungszeichen (`“”`) (`„Erstelle deinen ersten Astro-Blog“`)
- Abkürzungen müssen in der gleichen Zeile stehen. Hierfür wird die HTML-Entität `&nbsp;` oder das [Unicode Symbol "U+00A0 NO-BREAK SPACE"](https://unicode-explorer.com/c/00A0) (` `) verwendet.

## Häufige Fehler

> **🚨 Wichtig:** Bitte sieh dir die nachfolgenden Fehler genau an und vermeide sie in deinen Übersetzungen. Insbesondere der erste Fehler (fehlende Bindestriche) tritt besonders häufig auf und verursacht so vermeidbare Arbeit bei Reviews.

- Fehlende Bindestriche bei zusammengesetzten Wörtern
	- Astro Projekt → Astro-Projekt
	- `<description>` Feld → `<description>`-Feld
	- Readme Datei → Readme-Datei
- Falsche Übersetzung von Infoboxen („Asides“)
  - Unsere Dokumentation enthält an manchen Stellen farblich hervorgehobene Boxen mit Hinweisen, Tipps und Warnungen. Diese sind im Markdown-Code mit drei Doppelpunkten abgegrenzt und beginnen mit dem Typnamen der Box (`:::note`, `:::tip`, `:::caution`). Dieser Typname ist **nicht** zu übersetzen, da ansonsten die Infobox nicht mehr funktioniert.
  - Falls dem Typnamen eine vom Standard abweichende Überschrift in eckigen Klammern folgt (`:::caution[Here be dragons!]`), darf nur der Teil in eckigen Klammern übersetzt werden.
- Nichtverwendung der vom Duden empfohlenen Schreibweisen
  - mit Hilfe → mithilfe
- Falsch geschriebene Markennamen (wir halten uns an die offizielle Schreibweise auf der Hersteller-Website)
  - Github → GitHub
  - Gitlab → GitLab
  - Javascript → JavaScript
  - Typescript → TypeScript
  - VSCode → VS Code
  - NPM → npm
- Markennamen, deren Name sich im Laufe der Zeit geändert hat, werden mit dem aktuellen Namen genannt; der frühere Name steht in Klammern (z. B. X (Twitter)).
- Verwendung der falschen Anführungszeichen ("" statt „“)
- Abkürzungen sind nicht mit non-breaking space versehen
  - `z. B.` → `z. B.` (Unicode-Zeichen) oder `z.&nbsp;B.` (HTML-Entität)

## Hast du Ergänzungen oder Anregungen zu dieser Anleitung?

Das ist super! Die Inhalte dieses Dokuments sind nämlich nicht als in Stein gemeißelte „Regeln von oben“ zu verstehen, sondern bilden lediglich den aktuellen Konsens unseres deutschen Übersetzungsteams ab.

Solltest du Verbesserungsideen oder Änderungswünsche zu diesem Dokument haben, besuch uns gerne auf Discord und sprich mit uns darüber. Wir sind stets offen für neue Anregungen!
