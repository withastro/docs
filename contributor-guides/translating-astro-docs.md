# 🌐 <abbr title="internationalization">i18n</abbr> Guide

Thanks for your interest in helping us translate [docs.astro.build](https://docs.astro.build/)! This can be a great way to get involved with open source development without having to code.

## Getting involved

To get involved in our translation efforts, we **highly recommend** [joining our Discord chat](https://astro.build/chat) first. This way, we can get you up to speed with our process and give you the opportunity to chat with your language's translation team.

Most of our internationalization decisions and discussions happen on Discord. Joining us there is the best way to find out which patterns and recommendations your language's translation team follows before making your own PRs. You can even become a part of the decision-making process.

> Can’t access Discord? Please [open a new issue](https://github.com/withastro/docs/issues/new/choose) here on GitHub to ask any questions you may have.

### How can I help translate/review one of the supported languages?

Translations all live in this GitHub repository. You can add and update them by creating a pull request or reviewing pending translations in the "Pull Requests" tab. Read on to find out more!

#### Minimum quality standards

We are only able to maintain multiple translations of the docs thanks to our amazing team of volunteers, who are prepared to spot typos and fix the occasional grammatical error. Translations requiring significant editing cannot be accepted and therefore, we may close PRs that don't meet our minimum quality standards.

We do expect translators to be Astro users, so that they are familiar with Astro terms and concepts. Translations should be faithful representations of the English text, at a native speaker's grammar level, without changes to the meaning and structure of a page. Changes to content are only made in the English documentation, and translations that attempt to "improve" the documentation will not be accepted. (If you believe there is a problem with the English documentation, then please create a GitHub Issue so it can be addressed in the English docs.) This ensures translation reviewers will only have to make small (if any) suggestions to a translation before merging, making our current workflow sustainable.

### How can I find out what needs to be reviewed/translated?

To find translations pending review, you can filter through this repo's [Pull Requests with the i18n label](https://github.com/withastro/docs/pulls?q=is%3Apr+is%3Aopen+label%3Ai18n).

See our automated [Translation Status Overview](https://i18n.docs.astro.build/) for a quick list of which pages are missing a translation or need updating to match a change to the English version.

> **Warning**
> Please do not translate any pages without first checking their status in our [Overview Issue](https://github.com/withastro/docs/issues/438)! If a page is not listed here as needing a translation or an update, we can not accept your PR.
 
Not every page is marked as "ready to translate." So, even if you find a page that is not yet translated on the Docs site, you must first confirm that it is on the list of available pages to translate. Do not translate documents that are missing:

- A "Translate this page" button in the Docs site.
- The `i18nReady: true` frontmatter property in its MDX file.

You can read more about how pages are marked "ready for (initial) translating" and "needs updating" in [CONTRIBUTING.md](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md).

## Languages for translation

Currently we are aiming to translate the Astro documentation into the following languages:

- Brazilian Portuguese
- Chinese (Simplified)
- English
- French
- German
- Japanese
- Korean
- Polish
- Spanish

### Why can Astro only support a few languages?

Supporting a language means that Astro takes responsibility for maintaining that language going forward. It’s not just a one-time translation, and it is not just a few pages. It is continuous and ongoing updates for both content and site design, maintaining complete versions of the docs in every supported language.

### How do you choose which languages to support?

1. Where our traffic comes from, and the user base we need to support
2. Availability of community members who can commit time to maintaining the translations

### What about unsupported languages?

The official docs will only contain supported languages for now, but we will be looking to add more officially supported languages as we grow. If you would like to host translated docs yourself in another language, please let us know! We are happy to help you set this up and coordinate with future changes to the docs.

## Translation Structure

Generally speaking, there are two kinds of content that we need to translate to internationalize the docs.

1. **Documentation pages** — explain how specific parts of Astro work
2. **UI text** — used to structure and label the user interface of many different pages

Each of these content types lives in a different place.

### 1. Documentation pages

Each documentation page lives in the `src/content/docs/` directory of this <abbr title="repository">repo</abbr>. There you’ll find directories for all of the languages currently translated. Each page is a MDX file to support rich text formatting. For example, the English language “Getting Started” page is at `src/content/docs/en/getting-started.mdx` and the same page in French is at `src/content/docs/fr/getting-started.mdx`.

### 2. UI text

UI text generally consists of relatively short bits of text used to label or structure components of the documentation UI. For example, our auto-generated table of contents has a heading that in English reads “On this page”. For other languages we need to translate this.

UI text lives in `src/i18n` with a folder for each language similar to how pages work. Unlike pages, these translations look more like a dictionary, mapping standard keys to translated strings. Each language should provide the following files:

- `nav.ts` — translates the labels for the navigation menu
- `ui.ts` — translates miscellaneous bits of text found around the docs
- `docsearch.ts` — translates the search component

See `src/i18n/de` for examples of these three files.

### How do I find the thing I want to translate?

If you spot something on [docs.astro.build](https://docs.astro.build/) that you want to translate or fix, here’s how to figure out where the content lives in this repo.

1. Is the text in the navigation menu (left sidebar on desktop, hamburger menu on mobile)?

    ➤ Go to `src/i18n/{language}/nav.ts`

2. Is the text in the search box or modal?

    ➤ Go to `src/i18n/{language}/docsearch.ts`

3. Is the text reused on several pages (e.g. right sidebar, article navigation, etc.)

    ➤ Go to `src/i18n/{language}/ui.ts`

4. Is the text specific to one page (page title, main content, etc.)?

    ➤ Go to `src/content/docs/{language}/{page-slug}.mdx`

# Contributing to translations

Please see [CONTRIBUTING.md](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md) for information about contributing via a fork, our Style Guide, and more!

## Pull Request Recommendations

To ensure translation contributions are sustainable, we have a few recommendations on how PRs should look like.

### Recommended size

PRs should try to be small, changing only a few pages/files and not surpassing the 300 lines changed mark. This is not a hard rule! There will be cases in which you will change more than the recommended limit, especially when the page you're translating is more than 500 lines long or when you need to change multiple pages to pass the CI checks.

For smaller updates, especially those that only change a sentence or a code sample, you are welcome to bundle a small number (usually fewer than 10) pages together. Please be aware that the more pages you add, the longer it takes to get reviews! While your PRs are waiting, the original pages may already have other changes added to them. So it is important to keep checking your PRs to the current version of the English site. Your PR cannot be merged until it matches the English version, because the Translation Status Overview would mistakenly think the page is 100% updated when your PR is merged.

Following these guidelines ensures that PRs are small enough for reviewers to jump in and review quickly. It makes it easier for you to keep up with any changes to the original pages, and reduces the risk of complex merge conflicts when multiple translators are working together.

### Title

We recommend prefixing PR titles with `i18n(language): changes`, being `language` the [language's BCP 47 tag](#prerequisites) and `changes` a small description of the changes made, for example:

```
i18n(pt-BR): Update `markdown-content.mdx` translation
```

This way, it's easier for reviewers to filter for PRs from their squad and distinguishes changes to the main English docs from translations.

### Description

We already fill out a template description for you, so all you need to do is to remove anything that doesn't apply   in the "What kind of changes does this PR include?" question, and add a description in the heading below.

Your description can be simple! Listing the pages and/or files changed is enough, although you are free to add any worries or questions you may have and explain any errors/issues you've encountered while translating.  This allows maintainers and other contributors to know if there are specific things to look at more closely, and allows them to help you out.

### Commits

In docs, all PRs are squashed on merge, so only its title will be shown in the main branch's commit history. This means you're free to have as many commits as you want in your PR, without the need to worry about complex git commands to erase your mistakes as you go.

Feel free to keep your commit messages simple, like "Fix broken link" or "Update translations to most recent changes" provided that they're descriptive.

## Review Tips

We love our reviewers! Reviewing PRs is an important task — it's thanks to the efforts of our reviewers that we can guarantee consistent, high-quality translations. Many projects track PRs that you submit, but we also celebrate review stats, visible on your very own [Astro Badge](https://astro.badg.es)! Visit our Discord and you'll see that we shout out every PR merged with a list contributors who helped with review comments.

We even have an entire section in our Maintainer's Guide about [how to manually add reviewer's names to commit messages](https://github.com/withastro/docs/blob/main/MAINTAINERS.md#getting-co-authored-by-commit-message-name-and-email) before merging in case they are not automatically included!

So, if you're interested in helping review translation PRs, thank you! We really appreciate the effort, and we put an effort into showing it!

Learn more about [how to review and suggest changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request) on GitHub Docs.

### Checklist

It can be confusing to know what exactly should be reviewed! Mostly, what we are looking for is another pair of eyes to catch any obvious mistakes. If that is all you do, you have been a HUGE help!

Just ask yourself: does anything seem "out of place" or "unusual" when I read it? Are there typos or any unusual words choices that I would not expect to read? This might not mean the translation is "wrong" but *is* worth mentioning if a word choice is distracting when reading documentation.

If you want to take your reviews to the next level, here are some more questions you can ask yourself while reviewing translations:

- Is the translation correctly written following the translated language's norms and practices?
- Did the translation deviate from the original in a way that important information is being missed somehow?
- Is the translation consistent with the language's style guide and glossary?
- Are there any UI labels or content missing translation?
- Are the custom components, asides, and code samples being properly displayed in the Deploy Preview?
- Does the code samples' titles, syntax highlighting (like `js` or `astro`), and highlighted lines match the English version?
- Are there any links that could be localized? (e.g. Wikipedia and MDN links)

**When you think a PR is good to be merged**, approve the PR through GitHub's "Review Changes" button or leave a "**LGTM!**" in the comments. (“LGTM” is an abbreviation of “Looks Good to Me” often used to approve pull requests.)

## Translation Tips

### How and how much to adapt your translation

Not everything written in English will have a 1:1 translation, so it is not only allowed, but also encouraged to make language-specific adaptations to text when necessary. The two main goals of your translation should be:

1. To represent the English documents as closely as possible, remembering that they have undergone extensive review to achieve their current form.

2. To provide a natural, comfortable reading experience for a native speaker in the language.

Things like removing or adding a comma, making a paragraph easier to read according to the language's structure and norms, and other small changes are examples of **helpful adaptations**, where the overall meaning is not changed.

On the other hand, changing the page structure (e.g. moving headings, asides, etc.), the content itself (e.g. different examples, new paragraphs, etc.), and not faithfully translating the page are examples of **unhelpful adaptations**. These changes are more difficult for i18n contributors to review because they require significantly more effort to ensure that no meaning is lost or changed.

Please note that our English documents are written only after significant research, collaboration and negotiation by a team of developers and writers. Everything from page titles to code example file names has been discussed and agreed upon, so translations must represent the existing text without significant adaptation. There may be room for improvement! But, in our project, that happens only in the English documentation, and then the changes are represented in our translations.

If you find a section that is difficult to translate into your language, then that might mean that the English docs need some work! Please file a GitHub Issue and let us know. If you have some ideas for improvement, please use an Issue to make suggestions to the English documentation.

### Language-specific Guides (Glossary & Style Guide)

Translators are free to create and mantain a glossary, style guide and other tips for their language's translation squad. This is a great way to keep translations consistent across contributors and to centralize team decisions. You can find it (or create it) inside the language's `i18n` folder as a `README.md` file.

Feel free to take a look at the [Deutsch Guide](https://github.com/withastro/docs/blob/main/src/i18n/de/README.md) for an example.

### Frontmatter

Our pages are generated from MDX files which have frontmatter properties. These are variables that hold information about the page (values) that we later use to specify the page's title, description, and other special data.

Here's an example file showing the **properties** of `layout`, `title`, `description`, and `i18nReady` along with their corresponding values for this page.

```
---
layout: ~/layouts/MainLayout.astro
title: Data Fetching
description: Learn how to fetch remote data with Astro using the fetch API.
i18nReady: true
---

// Rest of the file's content is here...
```

**tl/dr: Translate only some values, never translate properties!**

The frontmatter **properties** themselves, like `title` and `description`, should not be translated, as doing so would cause a runtime error and break our CI.

The only frontmatter **values** that should be translated are those corresponding to the `title` and `description` properties: "*Data Fetching*" and "*Learn how to fetch remote data with Astro using the fetch API*."

Other frontmatter properties that aren't mentioned here should be ignored and not translated, as we use them for handling our "Edit this page" links or for specifying in which category an integration belongs, etc.

Here is the above example correctly translated:

```
---
layout: ~/layouts/MainLayout.astro
title: Fetching de datos
description: Aprenda como obtener datos remotos con Astro utilizando la API de fetch.
i18nReady: true
---

// Rest of the file's content is here...
```

### Code Samples

We have lots of code samples throughout our docs, and although we **recommend translating comments**, as they give a contextual clue of what's happening in the code, each language is **free to decide** whether or not they want to translate titles, variables, string values, function names, etc.

Be aware that if code samples are being translated, you may need to update some of the code sample's highlighted lines. Read the [Code Samples section](https://github.com/withastro/docs/blob/main/contributor-guides/writing-and-style-guide.md#custom-components) in our Writing Guide to know more about our syntax.

### Asides

Most of our pages include stylish tip/note/caution blocks called "asides". We use a custom syntax to author them which includes the type of aside (all lowercase) and optionally a custom title in square brackets. Here is an example of a "tip" found in the docs:

```
:::tip[Online previews]
Prefer to try Astro in your browser? Visit [astro.new](https://astro.new/) to browse our starter templates and spin up a new Astro project without ever leaving your browser.
:::
```

**Do translate**: the custom inline labels inside `[square brackets]`, and the text inside the aside block.

**Do not translate**: the aside's type (e.g. `:::tip`). These type names are instead translated once in each language's `i18n/nav.ts` file and are automatically replaced in your translated page as necessary.

Here is the above example correctly translated:

```
:::tip[オンラインプレビュー]
ブラウザでAstroを試してみませんか？[astro.new](https://astro.new/)では、スターターテンプレートを利用し、ブラウザから離れることなく、新しいAstroプロジェクトを立ち上げられます。
:::
```

### Components

Astro allows us to import and include custom components in our pages using MDX. Take this fragment of the `islands.mdx` page, which renders a diagram, as an example:

```jsx
<IslandsDiagram>
    <Fragment slot="headerApp">Header (interactive island)</Fragment>
    <Fragment slot="sidebarApp">Sidebar (static HTML)</Fragment>
    <Fragment slot="main">
        Static content like text, images, etc.
    </Fragment>
    <Fragment slot="carouselApp">Image carousel (interactive island)</Fragment>
    <Fragment slot="footer">Footer (static HTML)</Fragment>
    <Fragment slot="source">Source: [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)</Fragment>
</IslandsDiagram>
```

**Do translate**: slotted content (content between the opening and closing tags).

**Do not translate**: import statements, component names, and slot names (like `slot="headerApp"`).

Here is the above example correctly translated:

```jsx
<IslandsDiagram>
    <Fragment slot="headerApp">Cabeçalho (ilha interativa)</Fragment>
    <Fragment slot="sidebarApp">Barra lateral (HTML estático)</Fragment>
    <Fragment slot="main">
        Conteúdo estático como texto, imagens, etc.
    </Fragment>
    <Fragment slot="carouselApp">Carrossel de imagens (ilha interativa)</Fragment>
    <Fragment slot="footer">Rodapé (HTML estático)</Fragment>
    <Fragment slot="source">Fonte: [Arquitetura em Ilhas: Jason Miller](https://jasonformat.com/islands-architecture/)</Fragment>
</IslandsDiagram>
```

Note that some of our components' labels are instead translated inside the language's respective `i18n/` files, as we explain in the [Translation Structure section](#2-ui-text).

### Generated pages and dev-only warnings

Some of our English page content is generated from outside sources, and must not be edited directly in this repository. We need to show dev-only warnings to prevent contributors from changing that English content here, and instead, guide them towards the proper source location of the English content.

However, these pages are translated directly here and **these warnings are not meant for translations**.

For these generated pages (like `configuration-reference.mdx`), we recommend **ignoring and removing the note and component (including its import) from the file**, thus avoiding confusion for other translators thinking that this warning applies to translations as well.

### Tutorials

Some of our pages belong to tutorials, which are a linear sequence of lessons to introduce users to Astro concepts. They also include custom components that you can find the labels for translation in the language's `i18n/ui.ts` file, as described in the [Translation Structure section](#2-ui-text).

Considering how distracting it would be to try to follow a tutorial with only some translated pages, we cannot merge partial tutorial translations, only fully translated ones. But, that's a huge job for one translator! We care about making our translator workflow sustainable, so we've made a few guidelines specifically for the tutorial pages to avoid burdening any contributor working on them:

- Tutorial translation PRs are recommended to contain 1-3 lessons (each lesson is its own `.mdx` file) or a full unit if small (equivalent to a chapter of the tutorial). This is not only to help translators work in smaller units, but also allows reviewers to have smaller PRs to review.

- All translations will be merged in a custom branch first, and then merged into `main` once the tutorial is 100% complete. No need to change anything in your PR workflow! Your PRs should be to the `main` branch, like any other translation PR, and we will take care of creating and changing the merge target to the custom branch set up by us. This allows the tutorial to be translated in smaller pieces, in the same way you would translate any other page, without making these changes go live on the docs site until the tutorial is fully translated.

## Adding a new language

> 🛑 **Please don’t add a new language without first consulting with the docs team in [the `#docs-i18n` channel on Discord](https://astro.build/chat).**

### Prerequisites

To get started adding a language, you’ll need:

1. **Its BCP 47 tag**

    Examples: `en` / `pt-BR` / `ar`

    This will be used for the HTML `lang` attribute and as the base for URLs for this language, e.g. `/{tag}/getting-started`. These tags can encode script-type and regions as well as language, but most often we will only need the language part unless we want to distinguish regional variants (as in the `pt-BR` example above).

    #### Resources

    - [Choosing a Language Tag](https://www.w3.org/International/questions/qa-choosing-language-tags) (in-depth guide)
    - [Subtag lookup web app](https://r12a.github.io/app-subtags/)
    - [IANA subtag registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)

2. **Its name as written in the language**

    Examples: `English` / `Português do Brasil` / `العربية`

    This will be used to label this language in the site’s language switcher and potentially elsewhere. The best way to get this is probably to ask the person leading translation work for this language.

### Scaffold files for a new language

To scaffold the basic files for a new language, use the `add-language` script from your terminal:

```bash
pnpm run add-language
```

The CLI will prompt you for a tag and name for the new language as described above. Follow the instructions and the wizard will create a basic set of files to get started translating that language.

Update the placeholder content in the newly created files, commit them, and away you go!
