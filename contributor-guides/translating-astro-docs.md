# 🌐 <abbr title="internationalization">i18n</abbr> Guide

Thanks for your interest in helping us translate [docs.astro.build](https://docs.astro.build/)! This can be a great way to get involved with open-source development without having to code.

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

We decided on those languages based on where our traffic comes from and the availability of our community. Adding a language means that we're taking responsibility for supporting it going forward, including allocating resources to attracting new contributors and making any necessary changes to our codebase. With that in mind, **we will not add any new languages that we haven't approved beforehand**.

> **Note**
> Don't see your language in the list but still want to contribute to Astro with translations? See how you can [contribute to Starlight's i18n system](https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md#translations). 

## Getting Involved

We have a high incoming of translation PRs to our repository daily, meaning one of the most helpful and impactful ways to contribute is through reviews, which ensure we're bringing the most faithful and useful docs to the world. Go through your language's [Pull Requests with the i18n label](https://github.com/withastro/docs/pulls?q=is%3Apr+is%3Aopen+label%3Ai18n) and see if there are any mistranslations, typos, or sentences hard to read. This will also be a good first lesson on how Astro Docs' i18n works.

If you're a beginner when it comes to reviewing GitHub PRs and translations, we got you covered in our [Reviewer Process section](#reviewer).

> **Note**
> Did you know that reviews and translations count towards your Astro Badge? [Astro Badges](https://astro.badg.es/) is a community initiative made to award contributions to Astro through achievements you can showcase in your GitHub profile!

## Workflow

Our community developed its own [translation tracking system](https://i18n.docs.astro.build/), where the current status of all pages can be seen, including what needs to be updated in them and the open PRs waiting for reviews. It works by fetching our local git history, which compares the date of the changes made in the different translations of a page and updates its status accordingly.

Before making any contribution, we **highly recommend** [joining our Discord chat](https://astro.build/chat) first. There, access the "Channels & Roles" menu and select your language, which should make a `docs-i18n` channel pop up. Send us a hello message there and the language you're interested in contributing, so that we can add you to the language's crew own thread for discussion and planning.

Joining us on Discord means we can answer any of your questions and allow you to chat with your teammates to avoid duplicate work. All of our internationalization decisions and discussions happen there, meaning it is the best place to find out which patterns and recommendations your language's translation crew follows and get yourself involved in the decision-making process.

> Can’t access Discord? Please [open a new issue](https://github.com/withastro/docs/issues/new/choose) here on GitHub to ask any questions you may have.

### Structure

Each documentation page lives in the `src/content/docs/` directory of this <abbr title="repository">repo</abbr>. There you’ll find directories for all of the languages currently translated. Each page is a MDX file to support rich text formatting. For example, the English language “Getting Started” page is at `src/content/docs/en/getting-started.mdx` and the same page in French is at `src/content/docs/fr/getting-started.mdx`.

> **Note** 
> Starting to translate a language that doesn't exist in our file structure yet? See our [Adding a new language section](#adding-a-new-language). 

We also have UI text, generally consisting of relatively short bits of text used to label or structure components of the documentation UI. For example, our auto-generated table of contents has a heading that in English reads “On this page” but isn't part of a MDX file markup, which means we have to translate it separately.

These labels live in `src/i18n` folder, with a directory for each language similar to how pages work. Unlike pages, these translations look more like a dictionary, mapping standard keys to translated strings. Each language should provide the following files:

- `nav.ts` — translates the labels for the navigation menu
- `ui.ts` — translates miscellaneous bits of text found around the docs
- `docsearch.ts` — translates the search component

See [`src/i18n/es`](https://github.com/withastro/docs/tree/main/src/i18n/es) as an example of these three files.

## Review Process

The review process is a very important step in our internationalization work, enabling us maintainers to quickly and reliably merge new translations knowing the content has been spectacularly translated and reviewed. Whether you're being reviewed or is reviewing, we have a few tips for you!

### Reviewee

After you just published your own i18n PR, make sure to share it in your language's `i18n-crew` thread, where other contributors will be able to notice it quickly and review it sooner. Do not spam, all contributors are voluntarily taking their time, and if a few weeks have passed without any reviews, we will gently nudge contributors and proceed with the review ourselves if there's no activity.

When you receive a review, do not worry about the amount of suggestions made, it doesn't mean you did a bad job! There are lots of things to account for when translating, which even professional translators tend to not notice, see it only as the community's dedication to bringing the most inclusive piece of content possible. 

If your PR is full of suggestions and you want to commit them all quickly, see how you can [batch suggestions and merge them as one commit](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/incorporating-feedback-in-your-pull-request#applying-suggested-changes) on GitHub Docs.

### Reviewer

It can be confusing to know what exactly should be reviewed! Mostly, what we are looking for is another pair of eyes to catch any obvious mistakes. If that is all you do, you have been a HUGE help!

Just ask yourself: does anything seem "out of place" or "unusual" when I read it? Are there typos or any word choices that I would not expect to read? This might not mean the translation is "wrong" but *is* worth mentioning if a word choice is distracting when reading documentation. You're also free to suggest small deviations from the original text if that means making a sentence that reads better in your language and culture.

If you want to take your reviews to the next level, here are some more questions you can ask yourself while reviewing translations:

- Is the translation correctly written following the translated language's norms and practices?
- Did the translation deviate from the original in a way that important information is being missed somehow?
- Is the translation consistent with the language's style guide and glossary?
- Are there any UI labels or content missing translation?
- Are the custom components, asides, and code samples being properly displayed in the Deploy Preview?
- Does the code samples' titles, syntax highlighting (like `js` or `astro`), and highlighted lines match the English version?
- Are there any links that could be localized? (e.g. Wikipedia and MDN links)

Our maintainer's team does not know all the languages available for translation! **When you think a PR is good to be merged** after your suggestions were addressed (if any), approve it through GitHub's "Review Changes" button or leave a "**LGTM!**" in the comments to let us know. (“LGTM” is an abbreviation of “Looks Good to Me” often used to approve pull requests.)

If you are not used to approving PRs or suggesting changes on GitHub, read about [how to review and suggest changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request) on GitHub Docs.

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

After you've found what you want to translate, check the [Translation Tracker](https://i18n.docs.astro.build/) and the open PRs to see if anyone's already done it. If not, tell your fellow translation crewmates you're on it to avoid someone else from working on the same page.

> **Note**
> Not sure if something should or not be translated? How does a certain component work? See our [Reference section](#reference). 

Got your PR published and want to know how to handle and ask for reviews? See our [Reviewee Process section](#reviewee).

> **Warning**
> Not all of our pages are ready for translation, we roll out new pages for translation based on their stability, so do not translate any page that doesn't include a "Translate this page" button in the "Contribute" section of the right sidebar.

### Quality Standards & Adaptation

We are only able to maintain multiple translations of the docs thanks to our amazing team of volunteers, who are prepared to spot typos and fix the occasional grammatical errors. Translations requiring full editing cannot be accepted and for that reason, we may close PRs that don't meet our criteria.

We expect translators to be Astro users so that they are familiar with Astro terms and concepts. Translations should be faithful representations of the English text, at a native speaker's grammar level, without changes to the meaning and structure of a page. It is valid to make small deviations to a sentence order or structure if that means a better understanding of the text in the translation. 

Changes to the content itself should be only made in the English documentation. Any translations that attempt to "improve" the documentation will not be accepted, although we'd be happy to receive any possible improvements in the English docs first.

### Pull Request Guidelines

To improve the contribution experience for all parties involved, we have a few recommendations on how your PR should be like:

1. To easily distinguish for which language a PR is for, we recommend following the `i18n(language): changes` title pattern, being `language` the [language's BCP 47 tag](#prerequisites) and `changes` a small description of the changes made, for example:

    ```
    i18n(pt-BR): Update `markdown-content.mdx` translation
    ```

2. PRs should be small. They can include multiple pages/files but avoid passing the 300 changed lines mark. By doing so, we allow reviewers to quickly go through them without being overwhelmed and help you keep track of the changes made to the files in the meantime.

3. Add to the description any questions you have, anything that you found difficult, or issues along the way, which helps maintainers and reviewers to know if they need to look at anything more closely.

4. Commits are squashed by default, meaning only your first commit will be added to our git history. If your PR should not mark the pages committed as updated (e.g. typo or broken link fixes), prefix it with `[i18nIgnore]` so our Translation Tracker won't mistake it with an update that matches the English version.

### Language Guides

Translators are free to create and maintain a glossary, style guide, and other tips for their language's translation crew. This is a great way to keep translations consistent across contributors and to centralize team decisions. You can find it (or create it) inside the language's `i18n` folder as a `README.md` file.

Feel free to take a look at the [Deutsch Guide](https://github.com/withastro/docs/blob/main/src/i18n/de/README.md) for an example.

### Tutorials

The pages under the `tutorial/` directory belong to the "Create a Blog" tutorial, which is a linear sequence of lessons to introduce users to Astro concepts. It would be distracting to follow a tutorial with only some of its pages translated, therefore we cannot merge a tutorial before it's been fully translated.

Translating the entire tutorial is a huge job for one translator, and as we care about making our workflow sustainable, we've made a different workflow specifically for the tutorial pages to avoid burdening any contributor working on them.

As with any other PR, it is recommended to be small, something between 1 to 3 lessons (each lesson is its own `.mdx` file) or a full unit if small (equivalent to a chapter of the tutorial).

If there isn't an existing `language/tutorial` branch to target, publish your PR to the `main` branch and we will take care of creating it and updating your PR to merge there instead. After the first PR has been merged, one maintainer will create a WIP (Work in Progress) PR to merge this branch into `main`.

This allows for the smaller pieces of the tutorial to be translated by different contributors and merged without showing up on the main site before its fully completed.

> **Warning**
> Since the changes aren't made to the `main` branch, be sure to check on Discord and on the tutorial branch if the page's been translated already.

## Reference

We welcome novice contributors and Astro users who may not be fully aware of how certain things work, and for that reason, we've made a guide on how certain elements should be translated or treated.

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

Be aware that if code samples are being translated, you may need to update some of the code sample's highlighted lines. Read the [Code Samples section](https://github.com/withastro/docs/blob/main/contributor-guides/writing-and-style-guide.md#custom-components) in our Writing Guide to know more about their syntax.

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

However, these pages are translated directly here and **these warnings are not meant for translations**.

For these generated pages (like `configuration-reference.mdx`), we recommend **ignoring and removing the note and component (including its import) from the file**, thus avoiding confusion for other translators thinking that this warning applies to translations as well.

We also might include comments warning about specifics that should be done in translations, follow what's described and remove the comment in the translated file.

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