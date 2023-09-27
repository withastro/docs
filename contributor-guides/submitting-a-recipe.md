# Contributing to Recipes

Our "Recipes" section in the sidebar highlights **step-by-step how-to guides** for **accomplishing a specific task** in Astro. These include established landing pages for deployment, CMS, and migration guide, as well as a [dedicated section](https://docs.astro.build/en/recipes/) for a wider range of tasks you can accomplish with Astro.

Astro docs welcomes recipe contributions that:

- Edit an existing recipe with corrected content or [new resource links](#add-new-links), by PRing the existing file in the docs repo.
- Add a new [community recipe](#community-recipes) by PRing a link to the ["More Recipes" page](#more-recipes-page): `src/content/docs/en/recipes.mdx`.
- [Add a new CMS, Deploy or Migration recipe](#cms-deploy-and-migrate) to these existing categories.
- Add a new [official recipe](#official-recipes), by PRing a new page (`.mdx` file) to the `src/content/docs/recipes/` folder.


## Edit Existing Recipes

These have been written by Team Docs and we actively maintain this content. We welcome corrections, updates or more resource links to any of these pages! This content is intended to be kept accurate and up to date. You are welcome to PR a quick fix or resource, or to make an Issue on GitHub to let us know of larger content changes that may be necessary.

You can use the "Edit This Page" link in the right sidebar to make a change on GitHub directly and submit a pull request, or see the [Contributing Guide](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md#making-prs-pull-requests) for other ways to edit the Docs site.

## Community Recipes

Community Recipes are for external links that fit the definition of a recipe: short, focused how-to guides. This lets us include community resources without requiring long-term maintenance. They are listed on our [More Recipes](https://docs.astro.build/en/recipes/) page in docs.

You can share a published recipe in our “Community Recipes” section. This includes posts on a personal or company blog, or on your preferred blogging platform like [DEV.to](https://dev.to/). This follows the IndieWeb principle of “Publish (on your) Own Site, Syndicate Elsewhere” (often abbreviated to [POSSE](https://indieweb.org/POSSE)).

After you publish your article, [open a PR adding a link to this page](https://github.com/withastro/docs/edit/main/src/content/docs/en/recipes.mdx).

The link should be of the form `[Post or article title](full URL)` and it should be added to the bottom of the list of existing community recipes. Use the existing entries above it as a guide, and if any changes are necessary, we can make them while reviewing the PR.

Please note that all community recipe PRs will be reviewed to make sure they fit our definition of a recipe (a **step-by-step how-to guide** for **accomplishing a specific task** in Astro). They may also be tested by a Team Docs member who will attempt to follow your recipe and make sure it works. So, while this may seem like a tiny PR, please know that there is work going on behind the scenes and it may take some time to properly evaluate your recipe!

### Is my guide a recipe?

Our recipe format is inspired by Diataxis's [how-to guides](https://diataxis.fr/how-to-guides/). Recipes:

- Provide step-by-step instructions
- Meet a user at a specific starting point by providing a Prerequisites section
- Explain how to accomplish a specific task
- Use real-world examples

See our [HTML Forms](https://docs.astro.build/en/recipes/build-forms-api/) recipe as an example. It teaches a specific, practical goal (how to build and handle a form). It provides an example that can be modified and incorporated into your project. It uses step-by-step instructions and keeps explanations to a minimum.

Examples that would not be considered recipes:
- A blog post in narrative form that reports on what you did instead of structuring concise instructions for the reader to follow. (e.g. "How I finally got content collections set up with my custom remark plugin in my Astro project")
- A walk-through that teaches more than one task. (e.g. "How to set up Vue, TypeScript, and Partytown in Astro")
- A conceptual explanation of a topic, instead of a how-to guide that leads the reader through completing a specific task. (e.g. "How partial hydration works in Astro")

Like all contributions to our docs, take a look at our [Writing Guide](https://github.com/withastro/docs/blob/main/contributor-guides/writing-and-style-guide.md
) and [Main Contributing Guide](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md
) for guidance on drafting your PR.


## CMS, Deploy and Migrate

The `src/content/guides/` directory in the docs has three subdirectories for established guide categories:

- `cms/`
- `deploy/`
- `migrate-to-astro/`

The best way to start a new guide for these sections is to choose an existing one as an example.

These require:
- A new guide page.
- A logo in `public/logos/`.
- An update to [`src/data/logo.ts`](https://github.com/withastro/docs/blob/main/src/data/logos.ts) to add the logo.

### Add a new guide

1. Add a new `.mdx` file to one of the subdirectories. Copy the contents of an existing file, and change the `title` and `description` in the frontmatter.

2. Edit the body of the file. This should match the structure of other guides of that type. For example, a deployment guide should have a step-by-step “How to Deploy” section. A migration guide should have “Key Similarities,” “Key Differences,” and “Switch from X to Astro” sections.

3. Add a logo to `public/logos/`. Ideally, this should be an SVG. Use [SVGOMG](https://jakearchibald.github.io/svgomg/) to optimize its file size.

4. Update [`src/data/logo.ts`](https://github.com/withastro/docs/blob/main/src/data/logos.ts) to add the logo.

### Add a new stub

Some guides are marked as `stub: true` in the frontmatter. These are not yet full guides, but instead include introductory content and link to external resources.

If you don't have a full guide yet, feel free to create a stub with an introductory paragraph and a “Community Resources” and/or “Official Resources” section following the steps above. See [this example PR creating a new stub](https://github.com/withastro/docs/pull/2336/files).

You can expand a stub, even if it's an incremental improvement. For example, you can expand a CMS guide by adding an "Integrating with Astro" section to explain how to connect the CMS to Astro. You can also provide a step-by-step section to use that integration to build something. (See [Making a blog with Astro and Contentful](https://docs.astro.build/en/guides/cms/contentful/#making-a-blog-with-astro-and-contentful).)

### Add new links

The CMS, Deploy, and Migrate guides all have sections for external links. You can add a new link by [creating a PR](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md).

## Add a new official recipe

The Official Recipes section is for officially maintained recipes, found in the `src/content/guides/recipes` folder, that do not fit into one of our pre-existing categories. Like the rest of our docs, these must meet the standards of our [Writing Guide](https://github.com/withastro/docs/blob/main/contributor-guides/writing-and-style-guide.md) and require long-term maintenance to make sure they're up to date.

To add an official recipe:

1. Add a new `.mdx` file in the `src/content/guides/recipes` folder with the following frontmatter: 

    ```mdx
    ---
    title: # start with a verb!  Build, Learn, Add....
    description: # also start with a verb! elaborate on the title
    type: recipe
    i18nReady: false
    ---
    ```

2. Add an introduction: what will the recipe accomplish? (1 paragraph is fine.)

3. Add a `## Prerequisites` section that includes any required configurations or steps to take before starting the recipe. If your recipe works with any project setup, you can skip this section.

4. Add a `## Recipe` section that includes a numbered list of steps.

5. If you have external references or links, add a ``## Resources`` section at the end.
