
# Writing Guide

This writing guide is in progress! If you have any questions or suggestions, please [make a new issue](https://github.com/withastro/docs/issues/new) and let us know.

Please use the following as a general guideline, and thank you in advance for understanding that contributions may be edited to match existing style, tone, conventions and structure.

## Readability

All readers can benefit from clear, straightforward writing, but this can be particularly important for people who:

- are reading documentation in a non-native language.
- are frustrated, tired, or in a hurry.
- have cognitive, learning or attention difficulties.
- come from a non-traditional development background.

We aim for **clear** and **helpful** documentation that serves the reader above all else!

Usually this means choosing:

- shorter sentences and paragraphs
- simpler vocabulary and phrases
- less jargon
- fewer assumptions about what the reader already knows
- writing out abbreviations and acronyms in full
- bullet points and section headings to break up chunks of text

You can check your writing by pasting it into [Hemingway App](https://hemingwayapp.com/). It will show you if a sentence is too long and will encourage you to use active voice, which is generally shorter and easier to read.

### Voice

Please try to use the following language conventions when contributing to the docs:

- When addressing the reader, do so in the present tense and do not include yourself. You can use *you*, but do not use *we*, *we'll*, *us*, *let's* etc. (You are not with the reader at this exact moment.) Instead, use phrases like, "You can now safely delete this line of code." Or simply, "Delete this line of code. It is no longer needed." Never use *I*. This guide is not about what you can do!  

- It's OK to use exclamation points every now and then, but please try to do so only when emphasizing something that is truly exciting, surprising, or encouraging/reassuring. If you are not sure, use a period instead. Exclamation points can send "positive vibes" to the reader. But, if a reader is frustrated, confused, or in a serious state of mind, then exclamation points can seem insensitive or juvenile. Do not use too many.

### Tone

As a general guide for writing tone, you can follow the [Google Developers Guide](https://developers.google.com/style/tone):

>In your documents, aim for a voice and tone that's conversational, friendly, and respectful without being overly colloquial or frivolous; a voice that's casual and natural and approachable, not pedantic or pushy. Try to sound like a knowledgeable friend who understands what the developer wants to do.
>
>Don't try to write exactly the way you speak; you probably speak more colloquially and verbosely than you should write, at least for developer documentation. But aim for a conversational tone rather than a formal one.
>
>Don't try to be super-entertaining, but also don't aim for super-dry. Be human, let your personality show, and be memorable. But remember that the primary purpose of the document is to provide information to someone who's looking for it and may be in a hurry.
>
>Remember that many readers aren't fluent English speakers, many of them come from cultures different from yours, and your document might be translated into other languages. For more information, see Writing for a global audience.

Also see tips on how to [write inclusive documentation](https://developers.google.com/style/inclusive-documentation) and [write accessible documentation](https://developers.google.com/style/accessibility)

## Recipe Writing

Here are some tips and examples to match Astro Docs' style for instructional content, like a recipe:

### Imperative (instruction, command) tense

Whenever possible, give the reader a direct instruction:

e.g. Type the command...

Do not use *"Let's..."* or *"Next, we will..."*. You are not sitting there with your reader! (This also means you will never need the words *we*, *us*, and *our*. If you see them, rephrase!)

If you must address the reader, it is OK to use "you" and "your". Especially for emphasis in very important steps where something could go wrong:

e.g. Before continuing, you must check your... or else...

### Avoid "storytelling"

Recipes should be a set of instructions to follow, as concisely and directly as possible. Do not tell a story around what is happening, but do provide context or clarity if needed as a brief goal/benefit/reason.

Here is an example edit we made to one of our own recipes to illustrate the difference:

**Example:** Introduce a set of instructions with a "Big Step" (e.g. overall goal) + reason before listing specific steps to follow

**Before: narrative style**
> As well as needing your content in different languages, you will often need to translate labels for UI elements around your site. We can do this by creating dictionaries of terms instead of hard-coding text in one language in our templates.
>
> 1.
> 2. ...

**After: imperative style**
> Create dictionaries of terms to translate the labels for UI elements around your site. This allows your visitors to experience your site fully in their language.
>
> 1.
> 2. ...

### Opinionated Instructions

Sometimes you will need to give an instruction where the reader has options. You want to illustrate the example with the specific choice you made, but you also want to make it clear that other decisions are acceptable.

In this case, try to separate the instruction from the opinion. First, give the action to take with a more general description. Then state the opinionated choice that your example uses. Your reader will be able to first process what you are doing and then will see the choice you have made. They can still follow your instruction, making a choice that works for their own project.

This can be easier to follow (and perhaps more reassuring!) than a statement that gives multiple options. This is also usually easier to write since you do not have to remind the reader that this file is from *your* example, and may not appear in their project.

**Example:** An instruction to add a component where the component *could* go in multiple files/places and still achieve the goal.

**Before: vague initial instruction**

> Add the `LanguagePicker` component to your site. A good place might be in a navigation component or a footer shown on every page.

**After: add necessary context to the instruction, followed by opinionated usage**
> Add the `LanguagePicker` component to your site in a component that is shown on every page. The example below adds this to the page footer:

<!-- 

-->

## Custom Components

### Aside Component

Sometimes in documentation you want to provide information that is complementary but not strictly part of the current text or call out something that is particularly important. For example, maybe you want to include a tip that isn’t essential but could be helpful or warn a reader about a potential pitfall.

For these use cases you can use our aside component. This is an accessible component, based on the [recommended markup from the BBC’s GEL design system](https://bbc.github.io/gel/components/breakout-boxes/#recommended-markup).

The component has **note**, **tip**, **caution** and **danger** variants with colour, iconography, and default labelling distinct for each.

You can use a simple custom syntax to use the component in Markdown and also avoid needing to import it in the frontmatter all the time.

```
:::tip
It’s best to avoid using `<blockquote>` for things that aren’t quotes.
:::
```

The syntax also supports custom titles for the asides:

```
:::caution[Deprecated]
Using `<blockquote>` for notes is deprecated.
:::
```

You can see all three currently-used styles (we don't have any "danger" yet!) in action on the [Astro Components Page](https://docs.astro.build/en/core-concepts/astro-components/).

### Badge Component

Sometimes it is helpful to add a small badge to some content to label or highlight it. You can use the `<Badge />` component for this.

Badges work best when they only contain a single word or — at a push — two words. Think of them as a tag or label for something, not a way to highlight longer passages of text.

```mdx
import Badge from '~/components/Badge.astro';

<Badge>Nice</Badge>
```

By default, the badge uses a muted colour scheme to blend in. It also has an accented variant that can be used if you need it to stand out more from the surrounding context:

```mdx
<Badge variant="accent">Wow!</Badge>
```

#### Examples

- The [Editor Setup](https://docs.astro.build/en/editor-setup/#other-code-editors) page uses `<Badge />` to distinguish community and official editor support.
- The [Deployment guides navigation component](https://docs.astro.build/en/guides/deploy/) uses `<Badge />` internally to label the deployment types each service supports.

### Since Component

As features are added to Astro, it can be helpful to document *when* they were added. This allows users to easily see if the version of Astro (or other packages) they are running supports a specific feature as described in the docs.

You can use the `<Since />` component to display this information in a standardized way.

This component takes two props:

- A `v` prop, which indicates the version of the package in which the feature was added.
- A `pkg` prop, which indicates which package is being documented. This is optional and will default to `'astro'` so is only required when using `<Since />` for other packages.

```mdx
import Since from '~/components/Since.astro';

<Since v="1.0.0" />
```

This will render the text “**Added in:** `astro@1.0.0`”.

The advantages of using the component include:

- “Added in” is automatically translated on pages in other languages.
- The passed version is checked against the current package version and “NEW” or “BETA” badges will be added automatically based on data from npm.

#### Examples

The standard usage of this component is on its own line, immediately following the feature's heading, for example:

```mdx
## `Astro.clientAddress`

<Since v="1.0.0-rc" />

Specifies the IP address of the request. This property is only available when building for SSR (server-side rendering) and should not be used for static sites.
```

Or, it can be used in a short block of information, for example:

```mdx
### `server.host`

Type: `string | boolean`
Default: `false`
<Since v="0.24.0" />
```

Setting a custom package name helps us document integrations and other packages. For example:

```mdx
<Since v="2.1.0" pkg="@astrojs/rss" />
```

### Version Component

Sometimes it may be useful to display the latest version of a package on a page. For this, you can use the `<Version />` component, which must receive a valid package name from the npm registry as its `pkgName` prop.

```md
Astro's latest version:  <Version pkgName="astro" />
```

This will render **Astro's latest version: v1.2.1**.

The `<Version />` component is currently used in our Integrations pages as a way to keep each integration’s version up-to-date without having to merge changes to these pages directly. It's worth noting that this component is only updated at build-time, thus a package's version will not change until the site is rebuilt, be it manually or because a new PR was merged into main.

### Tabs Component

Astro Docs uses a `<Tabs>` component to allow readers to choose between different content views.

There are also two variants of this component, `<PackageManagerTabs>` and `<UIFrameworkTabs>`, for our most common use cases where readers might be interested in only one of several instructions or code samples: package managers and UI frameworks. Other custom components may be added over time. You can find all existing Tabs variations in `src/components/tabs/`.

Note that these components share state, so if a reader changes the active tab of one `<PackageManagerTabs>` or `<UIFrameworkTabs>` component, then all other instances of this component on the same page will also change. This allows the reader to see the same content choice by default while reading through the entire page.

#### Examples

To use an existing Tabs component (e.g. `<PackageManagerTabs>` , `<UIFrameworkTabs>`), import it in the `.mdx` file:

```mdx
import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
```

Then, create a `<Fragment>` for each tab. The fragment's slot name will identify the tab label and the content between the opening and closing `<Fragment>...</Fragment>` tags will be the panel content.

Here is an example of `<PackageManagerTabs>` showing the `create astro` commands from our [Automatic Astro Installation](https://docs.astro.build/en/install/auto/#1-run-the-setup-wizard) page.

````jsx
<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # create a new project with npm
  npm create astro@latest
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # create a new project with pnpm
  pnpm create astro@latest
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # create a new project with yarn
  yarn create astro
  ```
  </Fragment>
</PackageManagerTabs>
````

#### Creating your own custom Tabs component variation

If necessary, you can also create your own custom Tabs component using the base `Tabs.tsx` component. To do this, create a new Astro component in the [`src/components/tabs`](https://github.com/withastro/docs/blob/main/src/components/tabs/) directory, e.g. `MyCustomTabs.astro`. (Do not use `<Tabs>` directly in a Markdown page. Create your own component instead.)

Inside `MyCustomTabs.jsx`, import the Tabs component and create one `<Tabs>` component. Be sure to include the `client:visible` directive and give a unique name to the `sharedStore`. Each created Tabs component should have its own `sharedStore` to avoid unrelated tabs changing one another accidentally.

```astro
---
import Tabs from './Tabs';
---
<Tabs sharedStore="my-shared-store">
</Tabs>
```

To create your custom tab component, follow the pattern below using a `<Fragment>` with a named slot for each tab and panel to be created. Note that you must define your tab names here (e.g. Preact, React, Solid, Svelte, Vue), but the content for each panel will be written when your custom component is imported and used in a Markdown page, as in the previous `<PackageManagerTabs>` example.

```jsx
---
import Tabs from './Tabs';
---

<Tabs sharedStore="ui-frameworks">
 <Fragment slot="tab.preact">Preact</Fragment>
 <Fragment slot="tab.react">React</Fragment>
 <Fragment slot="tab.solid">Solid</Fragment>
 <Fragment slot="tab.svelte">Svelte</Fragment>
 <Fragment slot="tab.vue">Vue</Fragment>

 <Fragment slot="panel.preact"><slot name="preact" /></Fragment>
 <Fragment slot="panel.react"><slot name="react" /></Fragment>
 <Fragment slot="panel.solid"><slot name="solid" /></Fragment>
 <Fragment slot="panel.svelte"><slot name="svelte" /></Fragment>
 <Fragment slot="panel.vue"><slot name="vue" /></Fragment>
</Tabs>
```

The tabs will be displayed in alphabetical order, according to the slot name (e.g. `tab.*` and `panel.*`). For custom ordering, you can prefix your slot names with numbers (e.g. `tab.1.react`, `tab.2.preact`).

### Related recipe links

Astro Docs uses a `<RecipeLink>` component for displaying links to recipes with consistent styling. This is helpful when some page content has one or more relevant recipes you want to link to.

`<RecipeLink>` takes a single `slugs` prop, which is an array of the slugs of the recipes you want to link to. A slug has no leading or trailing slash and should match the language of the page you are currently on. For example, use `pt-br/recipes/captcha` on a Brazilian Portuguese page and not `en/recipes/captcha`.

```mdx
import RecipeLinks from "~/components/RecipeLinks.astro";

<RecipeLinks slugs={["en/recipes/captcha", "en/recipes/build-forms-api"]}/>
```

## Lists vs. Headings

Both lists and headings are used in our docs for readability. We will often start by using `<ul>` to list related items.

But, when individual line items become large, span multiple paragraphs, or contain too many `<code>` terms affecting readability, then we will change to section headings.

Use unordered (bulleted) lists when the order of the items is not important.

Use ordered (numbered) lists when giving steps or instructions to be followed in sequence.

## Headings

New sections should be at the `<h2>` level. The page title is an `<h1>` element.

Please keep headings short. `<h2>` and `<h3>` headings will appear in the right sidebar / "On this page" menu, so please check previews and consider shortening headings if the sidebar entry looks too long.

Headings should not end in punctuation (e.g. ":") but should format `<code>` when appropriate.

Do use headings to break up text into organized sections! Many readers prefer to skim, and your headings will show up in the sidebar / table of contents menu to help your readers navigate, and let them know they are on the correct page.

## Examples (e.g. examples)

Current practice is to use the words "for example" in full within the text of a sentence, but (e.g. Netlify, Vercel) inside a parenthetical so as to not take the reader out of the flow the sentence.

> For example, when passing props . . .

> If you store your Astro project in an online Git provider (e.g. GitHub, GitLab), you can . . .

## Code Samples

We take great pride in our code samples, but they require a little extra work to write!

Don't worry! We'll help you out in a PR if your code authoring needs some adjustment before merging. But, you can make use of all our features below and preview them locally to make sure your code looks the way you want.

If you are **editing existing code samples**, then please make sure to preview your updated code sample! Update any necessary syntax such as line highlighting or title (file name).

If you are **adding new code samples**, you have the option of adding a file name (usually recommended!) to be displayed as a title. You can also highlight individual words, phrases, or entire lines in regular or "diff" (red/green) style.

**All extra code styling is written on the opening line of the code block, immediately after the language.**

Here are two examples of what our code snippets look like written in Markdown, just so you can see what it looks like in action. Syntax explanations follow.

#### Example 1

- Use the file name as a title
- highlight rows 9 and 10

``````markdown
```astro title="src/pages/nested-components.astro" {9-10}
``````

#### Example 2

- use the file name as a title (alt method)
- apply "+ diff" styling (green backround) to any occurrence of `<Button />`
- highlight any occurrence of `{props.title}` and `{props.social}`

``````markdown
```jsx /{props.(title|socialLinks)}/ ins="<Button />"
// src/components/MySidebar.jsx
``````

### File Name as Title

Most code should include a sample file name so that we give the reader not only copy-pastable code, but also provide the file into which that code should be pasted.

`title="src/pages/index.astro"`

Alternatively, write the file name as a code comment in a separate line. Write the file name of `.astro` files immediately after the opening `---`

``````markdown
 ```astro
 ---
 // src/pages/index.astro
 ---
```
``````

``````markdown
 ```jsx
 // src/components/MyReactComponent.jsx
``````

### Line Highlighting

Use Curly braces to highlight (default), or show "diff" style (+/-) "inserted" or "deleted" lines.

- {4-7,10} - Highlights lines 4, 5, 6, 7 and 10
- del={2} - Shows "diff" style (-) at line 2
- ins={7-9} - Shows "diff" style (+) lines 7-9

### Text Highlighting

Use quotation marks to highlight (default), or assign red/green "diff" style background colors for individual words and phrases.

Regular expressions are supported within slashes `/ /`. See a handy [tool for converting between natural English and Regex](https://www.autoregex.xyz/)!

- "{item}" - All instances of `{item}` are highlighted

- del="My blog title" - All instances of "My blog title" have a red background color

- ins="Astro.props" - All instances of "Astro.props" have a green background color

- /{frontmatter.(title|description)}/ - Highlight all instances of `{frontmatter.title}` and `{frontmatter.description}`

> ***Note***
>
> - del="<p class=\"hi\">" - Use `\` to escape quotation marks and other special characters in the search string
>
>- del='\<p class="hi">' - Use single quotes to make it easier to match double quotes

### Don't destructure props

The following prop syntax is relevant to all component frameworks we support:

```jsx
// src/components/MySidebar.jsx
export default function MySidebar(props) {
  return (
    <aside>
      <header>{props.title}</header>
      <main>{props.children}</main>
      <footer>{props.socialLinks}</footer>
    </aside>
  )
}

```

## Next Steps

- [Read the docs](https://docs.astro.build/)
- [Fork the docs](https://github.com/withastro/docs/fork)
- [Raise an issue](https://github.com/withastro/docs/issues/new)
- [Discuss the docs](https://discord.gg/cZDZU3hJHc)
