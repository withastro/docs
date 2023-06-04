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

Do not use _"Let's..."_ or _"Next, we will..."_. You are not sitting there with your reader! (This also means you will never need the words _we_, _us_, and _our_. If you see them, rephrase!)

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

As features are added to Astro, it can be helpful to document _when_ they were added. This allows users to easily see if the version of Astro (or other packages) they are running supports a specific feature as described in the docs.

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
