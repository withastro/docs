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

- `nav.ts` — translates the labels for the navigation menu
- `ui.ts` — translates miscellaneous bits of text found around the docs
- `docsearch.ts` — translates the search component

See [`src/i18n/de`](de) for examples of these three files.

### How do I find the thing I want to translate?

If you spot something on [docs.astro.build](https://docs.astro.build/) that you want to translate or fix, here’s how to figure out where the content lives in this repo.

1. Is the text in the navigation menu (left sidebar on desktop, hamburger menu on mobile)?

    ➤ Go to `src/i18n/{language}/nav.ts`

2. Is the text in the search box or modal?

    ➤ Go to `src/i18n/{language}/docsearch.ts`

3. Is the text reused on several pages (e.g. right sidebar, article navigation, etc.)

    ➤ Go to `src/i18n/{language}/ui.ts`

4. Is the text specific to one page (page title, main content, etc.)?

    ➤ Go to `src/pages/{language}/{page-slug}.md`

## Contributing to translations

Not sure how to get started with GitHub, forks, pull requests, or want a quick refresher? You might want to check out this free video series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
### Forks
On GitHub you’ll need a “fork” of this repository to work on. This is your own copy where you can make changes. [Read more about forks in GitHub’s docs](https://guides.github.com/activities/forking/).

#### Creating a fork
To create your copy, click the <kbd>Fork</kbd> button at the top right of any page in this repository.

#### Maintaining a fork
When you first create your fork, it will be an exact copy of this repository. Over time, `withastro/docs` will change as the docs are updated, but your fork won’t automatically stay up-to-date. Here are some ways to keep your fork in sync with this repo.

##### Manually via the GitHub UI
1. Navigate to your fork on GitHub
2. Click <kbd>Fetch upstream</kbd> and then <kbd>Fetch and merge</kbd>

##### Manually from the command line
In the terminal on your computer:
1. Make sure you’re on the main branch: `git checkout main`
2. Fetch and merge updates: `git pull upstream main`
3. Push the updates back to your fork on GitHub: `git push origin main`

##### Automatically with a GitHub app
1. Go to [the “Pull” Github app page](https://github.com/apps/pull)
2. Click <kbd>Install</kbd>
3. Follow the instructions to select your fork

### Opening a PR

One you have made your changes, you’re ready to create a “Pull Request”! This will let the Astro docs team know you have some changes to propose. At this point we can give you feedback and might request changes. In general, we like to have at least one other person who knows the language you are translating into review the PR.

[Read more about making a pull request in GitHub’s docs](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request)

---

## [For Maintainers] Adding a new language

> **Please don’t add a new language without first consulting with the docs team in [the `#docs-i18n` channel on Discord](https://astro.build/chat).**

TODO
