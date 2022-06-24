# Contributor Manual

We welcome contributions of any size and skill level. As an open source project, we believe in giving back to our contributors and are happy to help with guidance on PRs, technical writing, and turning any feature idea into a reality.

> **Tip for new contributors:**
> Take a look at <https://github.com/firstcontributions/first-contributions> for helpful information on contributing

**Support Squad and Astro Maintainers**

Be on the lookout for coming-soon guides for contributing to the docs as a(n):

- Support Squad member, with specific ideas and support for making information flow between support threads and docs, in both directions.

- Astro Maintainer with merge permissions in this repository (aka how NOT to commit to "main"!)



This document is an active work in progress! But, we hope you'll find some useful information here to get started.

## Types of Contributions

We welcome contributions! 

While this site is currently in active, planned restructuring and development by our Docs Team, there are some kinds of contributions we are more prepared to handle than others.

In general:

**File an Issue** to let us know of outdated, confusing, or incorrect documentation.

**Start a Discussion** if you're not sure that your "issue" rises to the level of incorrect documentation requiring a "fix," but you still want to share ideas and opinions.

**Make a PR directly** for very obvious documentation fixes like typos or broken links. 

Our Docs Team, core maintainers and Technical Steering Committee provide new content, restructure and rewrite existing content _in response to GitHub Issues and Discussions_. We often reach out to community members who have proposed content or UI improvements or addtions and who have participated in these discussions to encourage them to submit PRs after an issue has been considered by the community. 

Larger contributions to the docs are encouraged after consultation, as unsolicited material may not fit into our existing plans. 

> Tip: Existing PRs and Issues need reviewing, triaging, and feedback, too! You can make valuable contributions by commenting, suggesting, testing, researching, brainstorming and generally helping in all areas on GitHub!


### Examples of Helpful PR Contributions
- typo fixes (to any language)
- correcting broken links (in any language)
- rewriting broken code samples (typos, or incorrect/incomplete code)
- additions or corrections to a short section on a page
    - adding a new or undocumented item in a list with a short description
    - noting or removing a deprecated feature

### Examples of Helpful GitHub New Issues

- a particular explanation is confusing
- a suggested rewording of a section
- a code example is wrong (without a fix proposed)
- a11y issues discovered
- missing content or topic not yet covered in the docs
- a request for a walk-through of implementing a specific feature (eg. responsive nav bar)

### Examples of Helpful GitHub New Discussions
- should a page be moved into a different section?
- are theme colours too bold/not bold enough?
- is site navigation clear and helpful?
- is our Astro vs X page providing helpful comparisons between Astro and other website builders?

## Making a New Issue

If you're unsure, what type of contribution best represents your concern, the best thing you can do is [make a new issue](https://github.com/withastro/docs/issues/new)! 

## Making PRs (pull requests)

Contributions to the documentation site are made by editing the docs repo code. You can do this directly on GitHub.com or by creating a copy of the repository locally, making your changes there, and contributing back to our repository.


**Important Note re: Internationalization (i18n)**

Please only add new text content to the docs **in English**, by modifying only **`.md` files located within `src/pages/en/`**. 

We have automated systems in place for notifying our community translators that there is new material to be translated, so there is no need to make changes to additional languages yourself. 

### Edit this Page via GitHub

Every page on [docs.astro.build](https://docs.astro.build/) has an **Edit this page** button in the sidebar.
You can click that button to edit the source code for that page in **GitHub**.

After you make your changes, click **Commit changes**.
This will automatically create a [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks) of the docs in your GitHub account with the changes.

Once your edits are ready in GitHub, follow the prompts to **create a pull request** and submit your changes for review.
Every pull request needs to be reviewed by our contributors and approved by a maintainer.

You can also read an annotated blog post with screenshots [demonstrating the process of editing the docs this way](https://www.rainsberger.ca/posts/contribute-open-source-docs-edit-page-on-github/).

### Contribute PRs using an online code editor (e.g. StackBlitz, CodeSandbox, Gitpod)

You can [fork the docs repository](#helpful-information-about-forks) at GitHub.com then edit online there, or open it in an online editor without needing to set up any local development environment. Each cloud IDE has its own shortcut URL for opening an existing repository, and will allow you to create pull requests after you have made changes.

See specific instructions for [CodeSandbox](https://codesandbox.io/docs/importing#import-from-github), [StackBlitz](https://developer.stackblitz.com/docs/platform/importing-projects/#import-from-github) and [Gitpod](https://www.gitpod.io/docs/getting-started#start-your-first-workspace).

### Contribute PRs by Developing Locally via the command line

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
git remote add upstream git@github.com:withastro/docs.git
```

At any point, create a branch for your contribution.
We are not strict about branch names.

```shell
git checkout -b add/partial-hydration-typo-fix
```
### Opening a PR

One you have made your changes, you’re ready to create a “Pull Request”! This will let the Astro docs team know you have some changes to propose. At this point we can give you feedback and might request changes. For translations, we like to have at least one other person who knows the language you are translating into review the PR.

[Read more about making a pull request in GitHub’s docs](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request)

Please include a clear title. The description will be pre-filled with questions that you can answer by editing right in the text field.

Every pull request generates a preview of the docs site, including your proposed changes, using **Netlify** for anyone to see.

Use the **Deploy Preview** link in your pull request to review and share your changes.

The docs site will be automatically updated whenever pull requests are merged.


### Helpful information about Forks

On GitHub you’ll need a “fork” of this repository to work on. This is your own copy where you can make changes. [Read more about forks in GitHub’s docs](https://guides.github.com/activities/forking/).

Not sure how to get started with GitHub, forks, pull requests, or want a quick refresher? You might want to check out this free video series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

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

## Next Steps

- [Read the docs](https://docs.astro.build/)
- [Fork the docs](https://github.com/withastro/docs/fork)
- [Raise an issue](https://github.com/withastro/docs/issues/new)
- [Discuss the docs](https://discord.gg/cZDZU3hJHc)
