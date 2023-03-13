# Contributing to Recipes

Our "Recipes" section in the sidebar highlights step-by-step how-to guides for accomplishing a specific task in Astro. These include established landing pages for deployment, CMS, and migration guide, as well as a [dedicated section](https://docs.astro.build/en/recipes/) for a wider range of tasks you can accomplish with Astro.

Like all contributions to our docs, take a look at the [WRITING.md](https://github.com/withastro/docs/blob/main/WRITING.md
) and [CONTRIBUTING.md](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md
) files for guidance on drafting your PR.

Astro docs welcomes contributions that:

- Edit an existing guide with corrected content or [new links](#add-new-links), by PRing the existing file in the docs repo.
- Add a new CMS, Deploy or Migration guide. (See below for instructions to create the required files in Docs.)
- Add a new official recipe, by PRing a new page to `src/content/docs/recipes/` 
- Add a new community recipe by PRing a link to `src/content/docs/guides/recipes.mdx`

## CMS, Deploy, and Migrate

The `src/content/guides/` directory in the docs has three subdirectories for established guides:

- `cms/`
- `deploy/`
- `migrate-to-astro/`

The best way to start a new guide for these sections is to choose an existing one as an example.

These require:
- A new guide page.
- A logo in `public/logos/`.
- An update to [`src/data/logo.ts`](https://github.com/withastro/docs/blob/main/src/data/logos.ts) to add the logo.

### Adding a new guide

1. Add a new `.mdx` file to one of the subdirectories. Copy the contents of an existing file, and change the `title` and `description` in the frontmatter.

2. Edit the body of the file. This should match the structure of other guides of that type. For example, a deployment guide should have a step-by-step “How to Deploy” section. A migration guide should have “Key Similarities,” “Key Differences,” and “Switch from X to Astro” sections.

3. Add a logo to `public/logos/`. Ideally, this should be an SVG. Use [SVGOMG](https://jakearchibald.github.io/svgomg/) to optimize its file size.

4. Update [`src/data/logo.ts`](https://github.com/withastro/docs/blob/main/src/data/logos.ts) to add the logo.

### Stubs

Some guides are marked as `stub: true` in the frontmatter. These are not yet full guides, but instead include introductory content and link to external resources.

If you don't have a full guide yet, feel free to create a stub with an introductory paragraph and a “Community Resources” and/or “Official Resources” section. See [this example PR creating a new stub](https://github.com/withastro/docs/pull/2336/files).

You can expand a stub, even if it's an incremental improvement. For example, you can expand a CMS guide by adding an "Integrating with Astro" section to explain how to connect the CMS to Astro. You can also provide a step-by-step section to use that integration to build something. (See [Making a blog with Astro and Contentful](https://docs.astro.build/en/guides/cms/contentful/#making-a-blog-with-astro-and-contentful).)

### Add new links

The CMS, Deploy, and Migrate guides all have sections for external links. You can add a new link by [creating a PR](https://github.com/withastro/docs/blob/main/CONTRIBUTING.md).

## More Recipes page

This landing page shows how-to guides that don't fit in the above categories. 

The Official Recipes section is for officially maintained recipes, found in the `src/content/guides/recipes` folder. Like the rest of our docs, these must meet the standards of our [Writing Guide](https://github.com/withastro/docs/blob/main/WRITING.md) and require long-term maintenance to make sure they're up to date.

Community Recipes are for external links that fit the definition of a recipe: short, focused how-to guides. This lets us include community resources without requiring long-term maintenance.

### Is my guide a recipe?

Our recipe format is inspired by Diataxis's [how-to guides](https://diataxis.fr/how-to-guides/). Recipes:

- Provide step-by-step instructions
- Meet a user at a specific starting point (see our [Prerequisites](https://docs.astro.build/en/recipes/build-forms-api/#prerequisites) sections)
- Explain how to accomplish a specific task
- Use real-world examples

See our [HTML Forms](https://docs.astro.build/en/recipes/build-forms-api/) recipe as an example. It teaches a specific, practical goal (how to build and handle a form). It provides an example that can be modified and incorporated into your project. It uses step-by-step instructions and keeps explanations to a minimum.

### Community Recipes

You can share a published recipe in our “Community Recipes” section. This includes posts on a personal or company blog, or on your preferred blogging platform like [DEV.to](https://dev.to/). This follows the IndieWeb principle of “Publish (on your) Own Site, Syndicate Elsewhere” (often abbreviated to [POSSE](https://indieweb.org/POSSE)).

After you publish your article, [open a PR adding a link to this page](https://github.com/withastro/docs/edit/main/src/content/docs/en/recipes.mdx).

### Official Recipes

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
