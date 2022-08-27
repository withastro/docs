# Anleitung für deutsche Übersetzungen

Hallo und herzlich willkommen! Wir freuen uns sehr, dass du dich dafür interessierst, bei der deutschen Übersetzung der Astro-Dokumentation mitzuwirken. 😊🚀


## Zielsetzung dieser Anleitung

Wie bei Open Source-Projekten üblich wird unsere Dokumentation von vielen fleißigen Personen auf freiwilliger Basis übersetzt. Die aktuellen Übersetzungen stammen daher aus vielen unterschiedlichen Federn. Zudem ändert sich auch die Besetzung unseres Teams im Laufe der Zeit.

Diese Anleitung soll dazu beitragen, dass sich das Ergebnis beim Lesen trotz aller verschiedenen Einflüsse wie ein Gesamtwerk mit gemeinsamem Schreibstil anfühlt.

&nbsp;


## Übersetzungs-Glossar

| Originalbegriff             | Übersetzung                          | Anmerkungen
|:----------------------------|:-------------------------------------|:------------
| branch                      | der Branch                           | Wird nicht übersetzt (gängiger Domänenbegriff).
| build                       | Erzeugung / Erstellung               | Wird aus Konsistenzgründen zu bestehenden Übersetzungen vorerst so übersetzt. Eventuell werden wir "Build" aber zukünftig als gängigen Domänenbegriff einstufen und nicht übersetzen.
| build process               | Erzeugungs- / Erstellungsvorgang     | s.o.
| build time                  | Erzeugungs- / Erstellungszeitpunkt   | s.o.
| to build                    | erzeugen                             | Da die Alternativen "bauen" oder gar "builden" merkwürdig klingen, wird diese Übersetzung vermutlich so bleiben.
| command line                | die Kommandozeile                    |
| CLI                         | die Kommandozeilen&shy;schnittstelle | Beim ersten Vorkommen in einem Abschnitt kann `(CLI)` dahinter ergänzt werden. Aufgrund der Wortlänge wird die Aufnahme eines weichen Bindestrichs empfohlen: `Kommandozeilen&shy;schnittstelle`
| CLI flag                    | die Kommandozeilen&shy;option        | Aufgrund der Wortlänge wird die Aufnahme eines weichen Bindestrichs empfohlen: `Kommandozeilen&shy;option`
| configuration option        | die Konfigurations&shy;option        | Wenn klar ist, dass es um die Konfiguration geht, kann auch nur "Option" verwendet werden. Bei der Langversion wird die Aufnahme eines weichen Bindestrichs empfohlen: `Konfigurations&shy;option`
| deployment provider         | der Hosting-Anbieter                 |
| to deploy                   | veröffentlichen                      | Wir vermeiden "ausliefern" aufgrund der Zweideutigkeit.
| directory                   | das Verzeichnis                      |
| domain                      | die Domäne                           |
| frontmatter                 | das Frontmatter                      | Wird nicht übersetzt (gängiger Domänenbegriff).
| frontmatter prop(erty)      | die Frontmatter-Eigenschaft          |
| frontmatter value           | der Frontmatter-Wert                 |
| to hydrate (an element)     | hydratisieren                        | Falsch hingegen wäre "hydrieren".
| island(s)                   | die Astro-Insel(n)                   | Der Präfix "Astro-" wird davorgesetzt, sofern wir über Astros Umsetzung der Inselarchitektur sprechen.
| page                        | die Seite                            | Eine einzelne (HTML-)Seite. Wir vermeiden die längere Form "Webseite", um Verwechslungen mit "Website" zu vermeiden.
| partial hydration           | die partielle Hydratation            | Falsch hingegen wäre "Hydrierung".
| project root (directory)    | das Projektstamm&shy;verzeichnis     | Aufgrund der Wortlänge wird die Aufnahme eines weichen Bindestrichs empfohlen: `Projektstamm&shy;verzeichnis`
| repository                  | das Repository                       | Wird nicht übersetzt (gängiger Domänenbegriff).
| request                     | die Anfrage                          |
| script                      | das Skript                           |
| selective hydration         | die selektive Hydratation            | Falsch hingegen wäre "Hydrierung".
| site, website               | die Website                          | Eine vollständige Webpräsenz unter einer gemeinsamen Domain, bestehend aus beliebig vielen (HTML-)Seiten.
| template                    | die Vorlage                          |
| ui                          | die Benutzeroberfläche               |
| web                         | das Internet                         |

&nbsp;


## Stilrichtlinien (Style Guide)

- Wir halten uns hinsichtlich Grammatik und Rechtschreibung an die Empfehlungen des Dudens und verwenden die neue deutsche Rechtschreibung.
- Wir verwenden eine informelle Ansprache mit kleingeschriebenem "du" (statt "Du" oder "Sie").
- Wir bleiben möglichst nah am englischen Originaltext.
	- Falls die Übersetzung sich aber nicht flüssig liest, weil z.B. im Deutschen übliche Überleitungen fehlen oder andere Formulierungen geläufiger sind, kann freier übersetzt werden, so lange die Bedeutung korrekt bleibt.
- Wir übersetzen alle Kommentare in Code-Beispielen.
- Wir übersetzen gerne auch Komponenten-, Klassen- und Variablennamen in Code-Beispielen. So signalisieren wir, dass diese Namen frei definierbar sind und keine "magischen Keywords" von Astro darstellen.
- Wir haben uns gegen das Gendern in unserer Übersetzung entschieden, weil es die Lesbarkeit der Texte verschlechtert und noch keine Duden-Vorgaben dafür existieren. Wir vermeiden lieber geschlechtsspezifische Formulierungen in unseren Übersetzungen und formulieren die Texte so, dass niemand sich ausgeschlossen fühlen muss.
- Wir vermeiden wertende Adjektive wie "einfach", "simpel" usw., da es immer Personen geben wird, denen das beschriebene Thema eben nicht "einfach" oder "simpel" vorkommt. Wir möchten niemandem den Eindruck vermitteln, fachlich "nicht gut genug" zu sein.

&nbsp;


## Häufige Korrekturen

- Fehlende Bindestriche bei zusammengesetzten Wörtern
	- Astro Projekt --> Astro-Projekt
	- `<description>` Feld --> `<description>`-Feld
	- Readme Datei --> Readme-Datei
- Vom Duden empfohlene Schreibweisen
	- mit Hilfe --> mithilfe
- Markennamen (wir halten uns an die offizielle Schreibweise auf der Hersteller-Website)
	- Github --> GitHub
	- Javascript --> JavaScript
	- Typescript --> TypeScript
	- VSCode --> VS Code

&nbsp;


## Hast du Ergänzungen oder Anregungen zu dieser Anleitung?

Das ist super! Die Inhalte dieses Dokuments sind nämlich nicht als in Stein gemeißelte "Regeln von oben" zu verstehen, sondern bilden lediglich den aktuellen Konsens unseres deutschen Übersetzungsteams ab. 

Solltest du Verbesserungsideen oder Änderungswünsche zu diesem Dokument haben, besuch uns gerne auf Discord und sprich mit uns darüber. Wir sind stets offen für neue Anregungen!

&nbsp;
