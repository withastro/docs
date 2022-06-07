# Astro Docs <img align="right" valign="center" height="52" width="39" src="https://raw.githubusercontent.com/withastro/astro/main/assets/brand/logo.svg" alt="Astro logo" />

To all who come to this happy place: welcome.

This is the repo for [docs.astro.build](https://docs.astro.build/).
This repo contains all the source code we use to build our docs site.

## We are Astro

Astro is a site builder for the web platform.
We want everyone to be successful building sites, and that means helping everyone understand how Astro works.

## You are Awesome

You can also help make the docs awesome.
Your feedback is welcome.
Your writing, editing, translating, designing, and developing skills are welcome.
You being a part of our community is welcome.

## Chat with Us

You can learn more about Astro, get support, and meet other devs in [our Discord community](https://astro.build/chat).

## Raise an Issue

Is something missing?
Is something wrong?

Creating a new Issue puts a problem on our radar!

[See if your issue has already been reported](https://github.com/withastro/docs/issues), and if not, [create a new one](https://github.com/withastro/docs/issues/new/choose).

## Share an Idea

Could something be better?
Want to share an idea with us?

Discussions are threads where you can offer feedback on things that might not exactly be problems to be fixed but are ideas to be explored. 

[Join the Docs Discussions](https://github.com/withastro/docs/discussions) where we brainstorm, ask questions, share hopes and dreams...

## Make a Fix or Contribution

If you can see what the problem is, and you know how to fix it, then you can make a PR (pull request) with the change and contribute to the docs repo yourself!

Every page on [docs.astro.build](https://docs.astro.build/) has an **Edit this page** button in the sidebar.
You can click that button to edit the source code for that page in **GitHub**.

After you make your changes, click **Commit changes**.
This will automatically create a [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks) of the docs in your GitHub account with the changes.

Once your edits are ready in GitHub, follow the prompts to **create a pull request** and submit your changes for review.
Every pull request needs to be reviewed by our contributors and approved by a maintainer.

**Important Note re: Internationalization (i18n)**

Please only add new text content to the docs **in English**, only modifying **`.md` files located within `src/pages/en/`**. 

We have automated systems in place for notifying our community translators that there is new material to be translated, so there is no need to make changes to additional languages yourself. 

_Speak another language natively? Join our i18n gang on Discord or jump into the PRs to help with translating or reviewing translations!_ 


## Translate a Page

Help us translate our content! Check out the dedicated [i18n guide](src/i18n/README.md) for more details.

## Develop

To begin developing locally, checkout this project from your machine.

```shell
git clone git@github.com:withastro/docs.git
```

You can install and run the project locally using [pnpm](https://pnpm.io/). Head to [the pnpm installation guide](https://pnpm.io/installation) to get that set up. Then, run the following from your terminal:

```shell
pnpm install

pnpm start
```

If you’re copying these instructions, remember to [configure this project as a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-for-a-fork).

```shell
git remote add upstream git@github.com:csstools/docs.git
```

At any point, create a branch for your contribution.
We are not strict about branch names.

```shell
git checkout -b add/partial-hydration-typo-fix
```

That’s it.
As you [open a pull request](https://github.com/withastro/astro/compare), please include a clear title. The description will be pre-filled with questions that you can answer by editing right in the text field.

```markdown
# Fixes a typo on Partial Hydration page

This fixes a typo in the page on partial hydration, and additionally removes an unnecessary extra space.
```

Thank you for helping make the docs awesome.
And please, [come chat with us](https://astro.build/chat) if you have any questions.

## Deploy

Every pull request generates a preview using **Netlify** for anyone to see.

Use the **Deploy Preview** of your pull request to review and share your changes.

The docs site will be automatically updated whenever pull requests are merged.

## Next Steps

- [Read the docs](https://docs.astro.build/)
- [Fork the docs](https://github.com/withastro/docs/fork)
- [Raise an issue](https://github.com/withastro/docs/issues/new)
- [Discuss the docs](https://discord.gg/cZDZU3hJHc)
