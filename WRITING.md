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

```md
---
setup: |
  import Badge from '~/components/Badge.astro';
---

<Badge>Nice</Badge>
```

By default, the badge uses a muted colour scheme to blend in. It also has an accented variant that can be used if you need it to stand out more from the surrounding context:

```md
<Badge variant="accent">Wow!</Badge>
```

#### Examples

- The [Editor Setup](https://docs.astro.build/en/editor-setup/#other-code-editors) page uses `<Badge />` to distinguish community and official editor support.
- The [Deployment guides navigation component](https://docs.astro.build/en/guides/deploy/) uses `<Badge />` internally to label the deployment types each service supports.

### Since Component

As features are added to Astro, it can be helpful to document _when_ they were added. This allows users to easily see if the version of Astro they are running supports a specific feature as described in the docs.

You can use the `<Since />` component to display this information in a standardized way. This component takes a single `v` prop, which indicates the version of Astro in which the feature was added.

```md
---
setup: |
  import Since from '~/components/Since.astro';
---

<Since v="1.0.0" />
```

This will render the text “**Added in:** v1.0.0”.

The advantages of using the component include:

- “Added in” is automatically translated on pages in other languages.
- The passed version is checked against the current Astro version and a “NEW” badge will be added automatically as long as the version is relatively recent.

#### Examples

The standard usage of this component is on its own line, immediately following the feature's heading, for example:

```md
## `Astro.clientAddress`
<Since v="1.0.0-rc" />

Specifies the IP address of the request. This property is only available when building for SSR (server-side rendering) and should not be used for static sites.
```

 Or, it can be used in a short block of information, for example:

```md
### `server.host`

Type: `string | boolean`
Default: `false`
<Since v="0.24.0" />
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

If you are adding new code samples, you have the option of adding a file name (usually recommended!) to be displayed as a title. You can also higlight individual words, phrases or entire lines in regular or "diff" (red/green) style. Add these on the opening line of the code block, after the language.

Here are two examples of what our code snippets look like written in Markdown. Syntax explanations follow.


``````markdown
```astro title="src/pages/nested-components.astro" {9-10}
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MyReactButton from '../components/MyReactButton.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---
<MyReactSidebar>
  <p>Here is a sidebar with some text and a button.</p>
  <div slot="actions">
    <MyReactButton client:idle />
    <MySvelteButton client:idle />
  </div>
</MyReactSidebar>
```
``````

``````markdown
```jsx /{props.(title|socialLinks)}/ "aside"
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
``````

### File Name as Title

Code should include a sample file name so that we give the reader not only copy-pastable code, but also provide the file into which that code should be pasted.

`title="src/pages/index.astro"` 

Alternatively, write the file name of `.astro` files immediately after the opening `---`
``````markdown
 ```astro
 ---
 // src/pages/index.astro
 ---
```
``````

### Line Highlighting

Use Curly braces to highlight (default), or show "diff" style (+/-) lines.

- {4-5,10} - Highlights lines 4, 5 and 10
- del={2} - Shows "diff" style (-) at line 2
- ins={7-9} - Shows "diff" style (+) lines 7-9


### Text Highlighting

Use quotation marks to highlight (default), or assign red/green "diff" style background colors on individual words and phrases.

Regular expressions are supported within slashes `/ /`. See a handy [tool for converting between natural English and Regex](https://www.autoregex.xyz/)!

- "{item}" - All instances of `{item}` are highlighted
- del="My blog title" - All instances of "My blog title" have a red background color
- ins="Astro.props" - All instances of "Astro.props" have a green background color
- /{frontmatter.(title|description)}/ - Higlight all instances of `{frontmatter.title}` and `{frontmatter.description}`


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
