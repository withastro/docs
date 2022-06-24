## Style Guide

We are developing a full Style Guide to help our contributors provide new content with a consistent style and voice!

Please use the following as a general guideline, and thank you for understanding that contributions may be edited to match existing style, tone, conventions and structure.

We aim for **clear** and **helpful** documentation that serves the reader above all else! 

Usually this means choosing:

- shorter sentences and paragraphs
- simpler vocabulary and phrases
- less jargon
- fewer assumptions about what the reader already knows

### Tone

As a general guide for writing tone, you can follow the [Google Developers Guide](https://developers.google.com/style/tone):

>In your documents, aim for a voice and tone that's conversational, friendly, and respectful without being overly colloquial or frivolous; a voice that's casual and natural and approachable, not pedantic or pushy. Try to sound like a knowledgeable friend who understands what the developer wants to do.
>
>Don't try to write exactly the way you speak; you probably speak more colloquially and verbosely than you should write, at least for developer documentation. But aim for a conversational tone rather than a formal one.
>
>Don't try to be super-entertaining, but also don't aim for super-dry. Be human, let your personality show, and be memorable. But remember that the primary purpose of the document is to provide information to someone who's looking for it and may be in a hurry.
>
>Remember that many readers aren't fluent English speakers, many of them come from cultures different from yours, and your document might be translated into other languages. For more information, see Writing for a global audience.

Also see tips on how to [write inclusive documentation](https://developers.google.com/style/inclusive-documentation).

## Specific Writing Notes

For now, to get this document started, here is a random collectiong of some specific items we have encountered when writing our docs content, and what we have decided to do about them. 

Please enjoy how much of a work-in-progress this document is! :)

### Headings

New sections should be at the `<h2>` level. The page title is an `<h1>` element.

Please keep headings short. `<h2>` and `<h3>` headings will appear in the right sidebar / "On this page" menu, so please check previews to make sure your headings are visually pleasing in this location in addition to being concise, descriptive and helpful.

Headings should not end in punctuation (e.g. ":") but should format `<code>` when appropriate.

Do use headings to break up text into organized sections! Many readers prefer to skim, and your headings will show up in the sidebar / table of contents menu to help your readers navigate, and let them know they are on the correct page.

### Lists vs. Headings

We use both lists and headings in the docs! We will often start by using `<ul>` for related items. But, when individual line items become large, span multiple paragraphs, or contain too many `<code>` terms affecting readability, then we will change to headings.

Use unordered (bulleted) lists when the order of the items is not important.

Use ordered (numbered) lists when giving steps or instructions to be followed in sequence.

### For example (e.g. examples)

Current working practice is to use the words "for example" in full within the text of a sentence, but (e.g. Netlify, Vercel) inside a parenthetical to not take the reader out of the sentence.
 
> For example, when passing props . . . 

> If you store your Astro project in an online Git provider (e.g. GitHub, GitLab), you can . . . 

### Writing Asides (aka how not to abuse `blockquote`)

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

## Code Samples

Here are a few specific situations we have encountered when writing code samples, and the decisions we have taken:

### Include File Names

Code should include a sample file name so that we give the reader not only copy-pastable code, but also the file into which that code should be pasted.

#### Astro Code Samples
When including the file name in an `.astro` code sample, the file name should come AFTER the opening code fence:

```
\`\`\`astro
---
// src/pages/index.astro
const title = "My Page Title"
---
<!-- component template -->
\`\`\`
```

### Don't destructure props

The following prop syntax is relevant to all component frameworks we support:

```
\`\`\`jsx
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
\`\`\`
```

## Next Steps

- [Read the docs](https://docs.astro.build/)
- [Fork the docs](https://github.com/withastro/docs/fork)
- [Raise an issue](https://github.com/withastro/docs/issues/new)
- [Discuss the docs](https://discord.gg/cZDZU3hJHc)
