## Style Guide

We are developing a full Style Guide to help our contributors provide new content with a consistent style and voice! 

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
## Specific Astro Writing Notes

For now, here are some specific items you should know about when writing new docs content.

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

The following prop syntax is relevant to all component frameworks we support

tick tick tick jsx
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
tick tick tick

## Next Steps

- [Read the docs](https://docs.astro.build/)
- [Fork the docs](https://github.com/withastro/docs/fork)
- [Raise an issue](https://github.com/withastro/docs/issues/new)
- [Discuss the docs](https://discord.gg/cZDZU3hJHc)
