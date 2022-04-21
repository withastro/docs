# 🌐 <abbr title="internationalization">i18n</abbr> Guide

Thanks for your interest in helping us translate [docs.astro.build](https://docs.astro.build/)! This can be a great way to get involved with open source development without having to code.

## Languages for translation

Currently we are aiming to translate the Astro documentation into the following languages:

- English
- TBD

### Why can Astro only support a few languages?

Supporting a language means that Astro takes responsibility for maintaining that language going forward. It’s not just a one-time translation, and it is not just a few pages. It is continuous and ongoing updates for both content and site design, maintaining complete versions of the docs in every supported language.

### How do you choose which languages to support?
1. Where our traffic comes from, and the user base we need to support
2. Availability of community members who can commit time to maintaining the translations

### What about unsupported languages?
The official docs will only contain supported languages for now, but we will be looking to add more officially supported languages as we grow.  If you would like to host translated docs yourself in another language, please let us know! We are happy to help you set this up and coordinate with future changes to the docs.

## Getting involved

### How can I participate in the conversation and decisions?
Discussion around translation currently takes place in [the Astro Discord](https://astro.build/chat). Everyone is welcome to participate! If you are interested in getting involved, please reach out to us in the `#docs-i18n` channel.

### How can I help translate one of the supported languages?
Translations all live in this GitHub repository. You can add and update them by creating a pull request. Read on to find out more!

## Translation Structure

Generally speaking there are two kinds of content that we need to translate to internationalise the docs.

1. **Documentation pages** — explain how specific parts of Astro work
2. **UI text** — used to structure and label the user interface of many different pages

Each of these content types lives in a different place.

### 1. Documentation pages

Each documentation page lives in the [`src/pages`](../pages) directory of this <abbr title="repository">repo</abbr>. There you’ll find directories for all of the languages currently translated. Each page is a Markdown file to support rich text formatting. For example, the English language “Getting Started” page is at `src/pages/en/getting-started.md` and the same page in French is at `src/pages/fr/getting-started.md`.

### 2. UI text

UI text generally consists of relatively short bits of text used to label or structure components of the documentation UI. For example, our auto-generated table of contents has a heading that in English reads “On this page”. For other languages we need to translate this.

UI text lives in `src/i18n` with a folder for each language similar to how pages work. Unlike pages, these translations look more like a dictionary, mapping standard keys to translated strings. Each language should provide the following files:

- `nav.ts` — translates the labels for the navigation menu as well as the slug for their link
- `ui.ts` — translates miscellaneous bits of text found around the docs
- `docsearch.ts` — translates the search component

See [`src/i18n/de`](de) for examples of these three files.


## Adding a new language

TODO

## Creating and maintaining a fork

TODO

## Opening a PR

TODO
