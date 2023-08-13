# 📖 Glossario

Il glossario è una raccolta di vocaboli, modi di dire e pratiche comuni per la traduzione italiana della documentazione di Astro.

Alcune parole legate ad Astro e allo sviluppo web non vanno tradotte in quanto sono parte integrante del suo ambiante e non hanno una traduzione immediata nell'Italiano.

## 🔄️ Vocaboli che non hanno bisogno di traduzione

> 💡 Queste parole sono considerate nomi propri data la loro origine Inglese :

| Vocabolo          | Definizione | Uso         |
|-------------------|-------------|-------------|
| Runtime           | Ambiente d'esecuzione / Tempo di esecuzione | Usato come "runtime di JavaScript" o "runtime edge" |
| Framework         | Parola comunemente usata nel codice per specificare un software o un pacchetto che fa uso di una sintassi specifica al suo ambiente (es: `React`, `Vue`, `Svelte`, ecc...) | Utilizzato in riferimento a vari ambienti che Astro integra e supporta
| Build             | Nel contesto di un linguaggio di programmazione che richiede un passaggio di compilazione e/o traduzione (tra due diversi linguaggi) | Questa parola deve essere usata quando si parla della fase di compilazione tramite il comando `astro build` usato per produrre un risultato compatibile con i browser e ottimizzato da Astro
| Frontend          | Tutto quell'insieme di pacchetti e programmazione usati per costruire l'interfaccia utente direttamente visibile nel browser | Comunemente usato per distinguere il codice relativo alla logica dell'interfaccia utente dal codice che viene eseguito sul server e non è visibile all'utente |
| Backend           | L'insieme del codice che veine usato per definire la struttura e il funzionamento del server | Vocabolo usato in contrapposizione a "Frontend" per distinguere codice e logica scritti per il browser da quelli scritti per il server |
| Markdown, Astro, JavaScript, TypeScript, React, Vue, Svelte, Lit, Solid | Nomi di pacchetti o linguaggi di programmazione sempre scritti con la maiuscola | Utilizzati ovunque nella documentazione e sempre scritti con la maiuscola |
| API (Application Programming Interface) | Interfaccia di programmazione dell'applicazione ovvero l'insieme dei metodi, classi e funzioni che definiscono il funzionamento e l'uso di una libreria o un framework | Abbreviazione usata in riferimento all'architettura e interfaccia di programmazione di Astro e altri software che potrebbero essere integrati con il framework |

## 📚 Traduzioni comuni

Alcuni vocaboli hanno una correlazione diretta o quasi con l'Italiano e vanno usate sempre allo stesso modo per mantenere una certa coerenza all'interno della documentazione:

| Inglese                      | Italiano                                           |
|------------------------------|----------------------------------------------------|
| SSR / Server-side rendering  | SSR / Rendering lato server                        |
| Client-side                  | Lato browser / Lato client                         |
| Template                     | Template / Modello                                 |
| CLI / Command line interface | CLI / Interfacia da riga di comando                |
| Routing                      | Indirizzamento                                     |
| UI components                | Componenti dell'interfaccia utente / Componenti UI |
| Code fences (`---`)          | Delimitatori di codice (`---`) / Tripli trattini   |
| Imports                      | Import / Importare / Includere                     |
| Exports                      | Export / Esportare                                 | 
| Component Script             | Script del Componente                              |
| Component Template           | Modello del Componente                             |
| Bundle / Bundled             | Pacchetto                                          |
| Processed                    | Processato / Trasformato                           |
| Process                      | Processo                                           |
| Wrap / To wrap               | Racchiuso / Racchiudere                            |
| To slot                      | Inserire / Includere                               |
| To fetch                     | Richiedere (dati da un'API)                        |
| Endpoint                     | Endpoint / Punto d'accesso                         |
| Astro Islands                | Isole Astro                                        |
| Component Islands            | Isole di Componenti                                |
| Island architecture          | Architettura a Isole                               |
| Scope / Scoped               | Scope / Ambito                                     |

## 📝 Note per la traduzione

### Il brand Astro

Astro deve essere trattato come un brand, pertanto alcune traduzioni devono essere adattate in quest'ottica. Per esempio quando si traduce una frase come "Create your new Astro project..." Astro non va prefissato con alcuna preposizione come ci verrebbe naturale fare ("...nuovo progetto **di** Astro..."), ma va mantenuto invariato e tradotto in questa maniera: "Crea il tuo nuovo progetto Astro...". Questa è una pratica comune anche in Italia e si può osservare in marchi come Barilla ("pasta ~~della~~ Barilla" vs. "pasta Barilla"), RayBan ("occhiali ~~della~~ RayBan" vs. "occhiali RayBan") e molti altri.

> ⚠️ Il glossario è in continuo sviluppo e non è da considerarsi completo. Suggerimenti e contribuzioni sono ben accetti e incoraggiati!
