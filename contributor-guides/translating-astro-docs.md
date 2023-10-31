# 🌐 <abbr title="internationalization">i18n</abbr> Guide

Thanks for your interest in helping us translate [docs.astro.build](https://docs.astro.build/)! This can be a great way to get involved with open-source development without having to code.

**Participating in Hacktoberfest?** See how you can get recognized for your translation PRs and PR reviews in our [Hacktoberfest guide](../.github/hacktoberfest.md).

Currently, we are aiming to translate the Astro documentation into the following languages:

- Brazilian Portuguese
- Chinese (Simplified/Traditional)
- English
- French
- German
- Hindi
- Italian
- Japanese
- Korean
- Polish
- Russian
- Spanish

We can currently support the above languages thanks to active community translators willing to volunteer their time to contribute with translations and reviews!
	
Unfortunately, we cannot support all languages at this time, and must prioritize based on available community members and their needs. Adding a language means allocating additional resources to attracting new contributors, and maintaining changes to our code base in multiple languages. **We will not add any new languages that we haven't approved beforehand**, and we cannot approve a new language without a group of people prepared to undertake significant work to translate our entire site.

> **Note**
> Don't see your language in the list but still want to contribute to Astro with translations? See how you can [contribute to Starlight's i18n system](https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md#translations). 

## How can I contribute?

We receive several translation PRs to our repository daily, meaning one of the most helpful and impactful ways to contribute is through **reviews** so that all of these wonderful translations can be properly checked before being published. Keep reading to find out how to contribute on GitHub!

If you're a beginner when it comes to reviewing GitHub PRs and translations, we got you covered in our [Reviewer Process section](#review-process).

> **Note**
> Did you know that reviews and translations count towards your Astro Badge? [Astro Badges](https://astro.badg.es/) is a community initiative made to award contributions to Astro through achievements you can showcase in your GitHub profile!

## Join our Community on Discord

Before making any contribution, we **highly recommend** [joining our Discord chat](https://astro.build/chat) first. There, access the "Channels & Roles" menu and select your language, which should make a `docs-i18n` channel pop up. Send us a hello message there and the language you're interested in contributing, so that we can add you to the language's crew own thread for discussion and planning.

Joining us on Discord means we can answer any of your questions and allow you to chat with your teammates to avoid duplicate work. All of our internationalization decisions and discussions happen there, meaning it is the best place to find out which patterns and recommendations your language's translation crew follows and get yourself involved in the decision-making process.

> Can’t access Discord? We still want you to participate! Please [open a new issue](https://github.com/withastro/docs/issues/new/choose) here on GitHub to ask any questions you may have.

## Getting started

Visit our [translation tracking system](https://i18n.docs.astro.build/), where the current status of all pages can be seen, including what needs to be updated in them and the open PRs waiting for reviews. It works by fetching our local git history, which compares the date of the changes made in the different translations of a page and updates its status accordingly.

You can also visit GitHub directly and go through your language's [open Pull Requests with the i18n label needing review](https://github.com/withastro/docs/pulls?q=is%3Apr+is%3Aopen+label%3Ai18n) and see if there are any mistranslations, typos, or sentences hard to read. This will also be a good first lesson on how Astro Docs' i18n works.

### Structure of Astro Docs

Each documentation page lives in the `src/content/docs/` directory of this <abbr title="repository">repo</abbr>. There you’ll find directories for all of the languages currently translated. Each page is a MDX file to support rich text formatting. For example, the English language “Getting Started” page is at `src/content/docs/en/getting-started.mdx` and the same page in French is at `src/content/docs/fr/getting-started.mdx`.

We also have UI text, generally consisting of relatively short bits of text used to label or structure components of the documentation UI. For example, our auto-generated table of contents has a heading that in English reads “On this page.” Those texts are stored separately from the page content itself, which means we have to translate them separately.

These labels live in the `src/i18n` folder, with a directory for each language similar to how pages work. Unlike pages, these translations look more like a dictionary, mapping standard keys to translated strings. Each language should provide the following files:

- `nav.ts` — translates the labels for the navigation menu
- `ui.ts` — translates miscellaneous bits of text found around the docs
- `docsearch.ts` — translates the search component

See [`src/i18n/es`](https://github.com/withastro/docs/tree/main/src/i18n/es) as an example of these three files.

## Translation Process

To start working on translating a part of [docs.astro.build](https://docs.astro.build/), the first step is to figure out where the content lives in this repo:

1. Is the text in the navigation menu (left sidebar on desktop, hamburger menu on mobile)?

    ➤ Go to `src/i18n/{language}/nav.ts`

2. Is the text in the search box or modal?

    ➤ Go to `src/i18n/{language}/docsearch.ts`

3. Is the text reused on several pages (e.g. right sidebar, article navigation, tutorial, etc.)

    ➤ Go to `src/i18n/{language}/ui.ts`

4. Is the text specific to one page (page title, main content, etc.)?

    ➤ Go to `src/content/docs/{language}/{page-slug}.mdx`

After you've found what you want to translate, check the [Translation Tracker](https://i18n.docs.astro.build/) and the open PRs to see if anyone's already done it. If not, tell your fellow translation crewmates you're on it to avoid someone else from working on the same page!

> **Note**
> Not sure if something should or not be translated? How does a certain component work? See our [Reference section](#reference). 

> **Warning**
> Not all of our pages are ready for translation, we roll out new pages for translation based on their stability, so do not translate any page that doesn't include a "Translate this page" button in the "Contribute" section of the right sidebar.

## Review Process

The review process is a very important step in our internationalization work, enabling us maintainers to quickly and reliably merge new translations knowing the content has been both translated and reviewed for accuracy. Whether your work is being reviewed or you are reviewing someone else's translations, we have a few tips for you!

### Reviewing someone else's PR

It can be confusing to know what exactly should be reviewed! Mostly, what we are looking for is another pair of eyes to catch any obvious mistakes. If that is all you do, you have been a HUGE help!

Just ask yourself: does anything seem "out of place" or "unusual" when I read it? Are there typos or any word choices that I would not expect to read? This might not mean the translation is "wrong" but *is* worth mentioning if a word choice is distracting when reading documentation. You're also free to suggest small deviations from the original text if that means making a sentence that reads better in your language or culture.

If you want to take your reviews to the next level, here are some more questions you can ask yourself while reviewing translations:

- Is the translation correctly written following the translated language's norms and practices?
- Did the translation deviate from the original in a way that important information is being missed somehow?
- Is the translation consistent with the language's style guide and glossary?
- Are there any UI labels or content missing translation?
- Are the custom components, asides, and code samples being properly displayed in the Deploy Preview?
- Do the code samples' titles, syntax highlighting (like `js` or `astro`), and highlighted lines match the English version?
- Are there any links that could be localized? (e.g. Wikipedia and MDN links)

Our maintainer's team does not know all the languages available for translation, and this is the valuable assistance that you are providing us! **When you think a PR is good to be merged** after your suggestions were addressed (if any), approve it through GitHub's "Review Changes" button or leave a "**LGTM!**" in the comments to let us know. (“LGTM” is an abbreviation of “Looks Good to Me”, often used to approve pull requests.)

If you are not used to approving PRs or suggesting changes on GitHub, read about [how to review and suggest changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request) on GitHub Docs.

### Getting a review on your own PR

After publishing your own i18n PR, make sure to share it in your language's `i18n-crew` thread, where other contributors will be able to notice it quickly and review it sooner. Do not spam repeatedly with requests to review. All contributors are voluntarily taking their time, and if a few weeks have passed without any reviews, Astro maintainers will gently nudge contributors and proceed with the review ourselves if necessary.

When you receive a review, do not worry if you see a lot of suggestions made correcting your work. It doesn't mean you did a bad job! There are lots of things to account for when translating, including choices made by previous translators which we must match for consistency. Each language crew makes its own decisions based on which words do or do not get translated, as well as the level of formality and whether certain phrases are acceptable, for example. And, everyone makes typos and mistakes, or and it usually takes other people to notice them! There is usually a lot of discussion in a translation PR because of our active, dedicated community that wants to see the best docs possible!

If your PR is full of suggestions and you want to accept and commit them all quickly, see how you can [batch suggestions and merge them as one commit](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/incorporating-feedback-in-your-pull-request#applying-suggested-changes) on GitHub Docs.


### Quality Standards & Adaptation

We are only able to maintain multiple translations of the docs thanks to our amazing team of volunteers, who are prepared to spot typos and fix the occasional grammatical errors. **Translations requiring significant editing cannot be accepted** and for that reason, we may close PRs that don't meet our criteria.

**Translations should be faithful representations of the English text**, at a native speaker's grammar level, without changes to the meaning and structure of a page. It is valid to make small deviations to a sentence order or structure if that means a better understanding of the text in the translation. 

> **Note**
>   Changes to the content itself should be only made in the English documentation. Any translations that attempt to "improve" the documentation will not be accepted. If you believe the English documentation needs improving, please make a separate PR to the English docs first.

We expect translators to be Astro users so that they are familiar with Astro terms and concepts; however, reviewers who are less familiar with Astro are welcome to review for typos and grammar errors and other language edits!

### Pull Request Guidelines

To make it easy to find and organize our i18n PRs for both maintainers and reviewers, please follow the following guidelines:

1. To easily identify a PR's language, we recommend titles in the form `i18n(language): add/update page translation`, for example:

    ```
    i18n(pt-BR): Update `markdown-content.mdx` translation
    ```

    ```
    i18n(ar): Add new `markdown-content.mdx` translation
    ```

2. PRs should be small. They can include multiple pages/files if each page has only a small number of lines changed, but avoid updating more than 2 or 3 pages at a time in the same PR. By doing so, we allow reviewers to go through individual PRs and approve them more quickly. Many small PRs to review are less overwhelming and each one can be merged on its own as soon as it is approved. This helps prevent large PRs from taking a long time to review and revise, and can avoid content becoming out of date.

3. Add to the initial PR comment any questions you have, anything that you found difficult, or issues you had along the way. This helps maintainers and reviewers to know if they need to look at anything more closely. You can even "review your own PR" and add thoughts, comments, or questions to your own PR, making it easy for others to spot potential issues that require discussion!

4. If your PR only makes a minor fix but does *not* update the entire page to be current with the English version (e.g. a typo or broken link on a page that still does require updating), you will need to add `[i18nIgnore]` to the PR title so our Translation Tracker won't mistake it with a complete update. This will prevent our tracking system from assuming the page is fully updated to match the English version, but still allows you to fix an urgent mistake. For example:
   ```
   [i18nIgnore] i18n(fr): update `astro-components.mdx` code sample
   ```

### Language Guides

Translators are free to create and maintain a glossary, style guide, and other tips for their language's translation crew. This is a great way to keep translations consistent across contributors and to centralize team decisions. You can find it (or create it) inside the language's `i18n` folder as a `README.md` file.

Feel free to take a look at the [Deutsch Guide](https://github.com/withastro/docs/blob/main/src/i18n/de/README.md) for an example.

### Tutorials

The pages under the `tutorial/` directory belong to the "Create a Blog" tutorial, which is a linear sequence of lessons to introduce users to Astro concepts. It would be distracting to follow a tutorial with only some of its pages translated, therefore **we cannot merge a tutorial translation PR before it's been fully translated**.

Translating the entire tutorial is a huge job for one translator, and as we care about making our workflow sustainable, we've made a different workflow specifically for the tutorial pages to avoid burdening any contributor working on them. Please only start translating the tutorial if you intend to finish it! :D

As with any other PR, it is recommended to be small, something between 1 to 3 lessons (each lesson is its own `.mdx` file) or a full unit if small (equivalent to a chapter of the tutorial).

If there isn't an existing `language/tutorial` branch to target, publish your PR to the `main` branch and we will take care of creating it and updating your PR to merge there instead. After the first PR has been merged, one maintainer will create a WIP (Work in Progress) PR to merge this branch into `main`.

This allows for the smaller pieces of the tutorial to be translated by different contributors and merged without showing up on the main site before its fully completed.

> **Warning**
> Since the changes aren't made to the `main` branch, be sure to check on Discord and on the tutorial branch if the page has been translated already.

## Reference

We welcome new or inexperienced contributors and also Astro users not familiar with our Docs repo and configuration! Below is a helpful guide on how certain elements should be translated or treated.

### Frontmatter

Our pages are generated from MDX files which have frontmatter properties. These are variables that hold information about the page (values) that we later use to specify the page's title, description, and other special data.

Here's an example file showing the **properties** of `layout`, `title`, `description`, and `i18nReady` along with their corresponding values for this page.

```mdx
---
layout: ~/layouts/MainLayout.astro
title: Data Fetching
description: Learn how to fetch remote data with Astro using the fetch API.
i18nReady: true
---

// Rest of the file's content is here...
```

**TL/DR: Translate only some values, never translate properties!**

The frontmatter **properties** themselves, like `title` and `description`, should not be translated, as doing so would cause a runtime error and break our CI.

The only frontmatter **values** that should be translated are those corresponding to the `title` and `description` properties, for example: "*Data Fetching*" and "*Learn how to fetch remote data with Astro using the fetch API*."

Other frontmatter properties that aren't mentioned here should be ignored and not translated, as we use them for handling our "Edit this page" link or for specifying to which category an integration belongs, etc.

Here is the above example correctly translated:

```mdx
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

Be aware that if code samples are being translated, you may need to update some of the code sample's highlighted lines. Read the [Code Samples section](https://github.com/withastro/docs/blob/main/contributor-guides/writing-and-style-guide.md#custom-components) in our Writing Guide to learn more about their syntax. Astro uses [Expressive Code](https://www.npmjs.com/package/remark-expressive-code) for customizable code snippets.

### Asides

Most of our pages include stylish tip/note/caution blocks called "asides". We use a custom syntax to author them which includes the type of aside (all lowercase) and optionally a custom title in square brackets. Here is an example of a "tip" found in the docs:

```mdx
:::tip[Online previews]
Prefer to try Astro in your browser? Visit [astro.new](https://astro.new/) to browse our starter templates and spin up a new Astro project without ever leaving your browser.
:::
```

**Do translate**: the custom inline labels inside `[square brackets]`, and the text inside the aside block.

**Do not translate**: the aside's type (e.g. `:::tip`). These type names are instead translated once in each language's `i18n/nav.ts` file and are automatically replaced in your translated page as necessary.

Here is the above example correctly translated:

```mdx
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

Note that some of our components' labels are instead translated inside the language's respective `i18n/` files.

### Generated pages and warnings

Some of our English page content is generated from outside sources, and must not be edited directly in this repository. We show dev-only warnings to prevent contributors from changing that English content here, and instead, guide them toward the proper source location of the English content.

However, these pages *are* translated directly here and **these warnings are not meant for translations**.

For these generated pages (like `configuration-reference.mdx`), we recommend **ignoring and removing the note and component (including its import) from the file**, thus avoiding confusion for other translators thinking that this warning applies to translations as well.

We also might include comments warning about specifics that should be done in translations. Please always read the top of the file when you begin to work on a page, follow what's described and if no longer needed, you can remove the comment in the translated file.

### Adding a new language

> **Warning**
> Please don’t add a new language without first consulting with the docs team in [the `#docs-i18n` channel on Discord](https://astro.build/chat).

#### Prerequisites

To get started adding a language, you’ll need:

1. **Its BCP 47 tag**

    Examples: `en` / `pt-BR` / `ar`

    This will be used for the HTML `lang` attribute and as the base for URLs for this language, e.g. `/{tag}/getting-started`. These tags can encode script-type and regions as well as language, but most often we will only need the language part unless we want to distinguish regional variants (as in the `pt-BR` example above).

    ##### Resources:
    - [Choosing a Language Tag](https://www.w3.org/International/questions/qa-choosing-language-tags) (in-depth guide)
    - [Subtag lookup web app](https://r12a.github.io/app-subtags/)
    - [IANA subtag registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)
 
2. **Its name as written in the language**

    Examples: `English` / `Português do Brasil` / `العربية`

    This will be used to label this language in the site’s language switcher and potentially elsewhere. The best way to get this is probably to ask the person leading translation work for this language.

#### Scaffold files for a new language

To scaffold the basic files for a new language, use the `add-language` script from your terminal:

```bash
pnpm run add-language
```

The CLI will prompt you for a tag and name for the new language as described above. Follow the instructions and the wizard will create a basic set of files to get started translating that language.

Update the placeholder content in the newly created files, commit them, and away you go!
