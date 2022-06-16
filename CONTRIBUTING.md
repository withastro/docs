# Contributor Manual

We welcome contributions of any size and skill level. As an open source project, we believe in giving back to our contributors and are happy to help with guidance on PRs, technical writing, and turning any feature idea into a reality.

> **Tip for new contributors:**
> Take a look at <https://github.com/firstcontributions/first-contributions> for helpful information on contributing

This document is a work in progress! Most information on contributing can be found in the main README.md file. But, we need a place to begin to document some of our tools and processes, like our `Aside` Markdown feature.

## Contributing with a Fork

Not sure how to get started with GitHub, forks, pull requests, or want a quick refresher? You might want to check out this free video series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

### Forks
On GitHub you’ll need a “fork” of this repository to work on. This is your own copy where you can make changes. [Read more about forks in GitHub’s docs](https://guides.github.com/activities/forking/).

#### Creating a fork
To create your copy, click the <kbd>Fork</kbd> button at the top right of any page in this repository.

#### Maintaining a fork
When you first create your fork, it will be an exact copy of this repository. Over time, `withastro/docs` will change as the docs are updated, but your fork won’t automatically stay up-to-date. Here are some ways to keep your fork in sync with this repo.

##### Manually via the GitHub UI
1. Navigate to your fork on GitHub
2. Click <kbd>Fetch upstream</kbd> and then <kbd>Fetch and merge</kbd>

##### Manually from the command line
In the terminal on your computer:
1. Make sure you’re on the main branch: `git checkout main`
2. Fetch and merge updates: `git pull upstream main`
3. Push the updates back to your fork on GitHub: `git push origin main`

##### Automatically with a GitHub app
1. Go to [the “Pull” Github app page](https://github.com/apps/pull)
2. Click <kbd>Install</kbd>
3. Follow the instructions to select your fork

### Opening a PR

One you have made your changes, you’re ready to create a “Pull Request”! This will let the Astro docs team know you have some changes to propose. At this point we can give you feedback and might request changes. In general, we like to have at least one other person who knows the language you are translating into review the PR.

[Read more about making a pull request in GitHub’s docs](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request)

## Style Guide

We are developing a full Style Guide to help our contributors provide new content with a consistent style and voice! For now, here are some specific items you should know about when writing new docs content.

## Writing Asides (aka how not to abuse `blockquote`)

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