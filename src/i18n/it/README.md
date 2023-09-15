# 📖 Glossario

Il glossario è una raccolta di vocaboli, modi di dire e pratiche comuni per la traduzione italiana della documentazione di Astro.

Alcune parole legate ad Astro e allo sviluppo web non vanno tradotte in quanto sono parte integrante del suo ambiente e non hanno una traduzione immediata nell'Italiano.

## 🔄️ Vocaboli che non hanno bisogno di traduzione

> 💡 Queste parole sono considerate nomi propri data la loro origine Inglese :

| Vocabolo          | Definizione | Uso         |
|-------------------|-------------|-------------|
| Runtime           | Ambiente d'esecuzione / Tempo di esecuzione | Usato come "runtime di JavaScript" o "runtime edge" |
| Framework         | Un "Framework" è un insieme di strumenti, librerie, e convenzioni che forniscono un metodo strutturato per costruire applicazioni. I Framework sono progettati per semplificare e ottimizzare il processo di sviluppo offrendo una base che gli sviluppatori possono usare per costruire un'applicazione senza partire da zero. | Utilizzato in riferimento al framework Astro e ad altri framework che possono essere usati e integrati con esso. |
| Build             | Nel contesto di un linguaggio di programmazione che richiede un passaggio di trasformazione (tra due diversi linguaggi) | Questa parola deve essere usata quando si parla della fase di compilazione tramite il comando `astro build` usato per produrre un risultato compatibile con i browser e ottimizzato da Astro
| Frontend          | Tutto quell'insieme di librerie e programmi usati per costruire l'interfaccia utente direttamente visibile nel browser | Comunemente usato per distinguere il codice relativo alla logica dell'interfaccia utente dal codice che viene eseguito sul server e che non è visibile all'utente |
| Backend           | L'insieme delle librerie e codice che viene usato per definire la struttura e il funzionamento del server |  Il termine "Backend" si riferisce al lato server dell'applicazione/sito web. È la parte del codice responsabile della gestione delle richieste da parte del client/browser (Frontend), della manipolazione dei dati, e gestione del server e interazione con il database. |
| Markdown, Astro, JavaScript, TypeScript, React, Vue, Svelte, Lit, Solid | Nomi di pacchetti o linguaggi di programmazione sempre scritti con la maiuscola | Utilizzati ovunque nella documentazione e sempre scritti con la maiuscola |
| API (Application Programming Interface) | Un'insieme di metodi, regole e protocolli esposti allo sviluppatore che permettono a diversi software e applicazioni di comunicare tra di loro. Definisce i metodi e le strutture dati che le applicazioni possono usare per richiedere e scambiarsi informazioni. | Abbreviazione usata in riferimento all'architettura e interfaccia di programmazione di Astro e altri software che potrebbero essere integrati con il framework e che permette allo sviluppatore di controllare il comportamento di Astro e di eventuali software integrati ad esso. |
| Routing | La pratica dell'indirizzamento dell'utente alle varie pagine presenti all'interno di un sit/applicazione web. | Termine usato in riferimento ai processi tramite i quali la tua applicazione gestisce diversi URL e indirizza gli utenti al contenuto o alle pagine richieste. |
| Router | Controller che gestisce la navigazione all'interno del sito/applicazione web. | Termine usato per definire il controller che viene utilizzato per inizializzare e portare a termine le navigazioni che avvengono tra le varie pagine del sit/applicazione web sviluppata. |

## 📚 Traduzioni comuni

Alcuni vocaboli hanno una correlazione diretta o quasi con l'Italiano e vanno usate sempre allo stesso modo per mantenere una certa coerenza all'interno della documentazione:

| Inglese                      | Italiano                                           |
|------------------------------|----------------------------------------------------|
| SSR / Server-side rendering  | SSR / Rendering lato server                        |
| Client-side                  | Lato browser / Lato client                         |
| Template                     | Template / Modello                                 |
| CLI / Command line interface | CLI / Interfaccia da riga di comando               |
| Route                        | Route / Rotta                                      |
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
| To fetch                     | Richiedere (dati da un'Endpoint)                        |
| Endpoint                     | Endpoint / Punto d'accesso                         |
| Astro Islands                | Isole Astro                                        |
| Component Islands            | Isole di Componenti                                |
| Island architecture          | Architettura a Isole                               |
| Scope / Scoped               | Scope / Ambito                                     |
| Frontmatter                  | Avantesto. Blocco di testo iniziale in un file Markdown riservato alla definizione di codice e informazioni da rendere disponibili al client/browser (per es. data creazione, descrizione SEO, ecc.). Viene sempre delimitato da tre trattini (`---`) |

## 📝 Note per la traduzione

### Il brand Astro

Astro deve essere trattato come un brand, pertanto alcune traduzioni devono essere adattate in quest'ottica. Per esempio quando si traduce una frase come "Create your new Astro project..." Astro non va prefissato con alcuna preposizione come ci verrebbe naturale fare ("...nuovo progetto **di** Astro..."), ma va mantenuto invariato e tradotto in questa maniera: "Crea il tuo nuovo progetto Astro...". Questa è una pratica comune anche in Italia e si può osservare in marchi come Barilla ("pasta ~~della~~ Barilla" vs. "pasta Barilla"), RayBan ("occhiali ~~della~~ RayBan" vs. "occhiali RayBan") e molti altri.

> ⚠️ Il glossario è in continuo sviluppo e non è da considerarsi completo. Suggerimenti e contribuzioni sono ben accetti e incoraggiati!
