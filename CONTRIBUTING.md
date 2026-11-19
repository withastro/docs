
# Contributor Manual

We welcome contributions of any size and contributors of any skill level. As an open source project, we believe in giving back to our contributors. We are happy to help with guidance on PRs, technical writing, and turning any feature idea into a reality.


> **"[Astro Docs Docs"](https://contribute.docs.astro.build)** is the best place to learn how to make a helpful, successful contribution to Astro Docs.
>
> There, you'll find all the information below, and so much more!

This document has some basic information to get you started, but we encourage you to visit our [dedicated site for contributing to Astro docs](https://contribute.docs.astro.build) for all the information you need!

There, you will find a writing and style guide, instructions on how to make changes and open PRs, guidance for translating the docs, and even information about how to help review Astro Docs PRs. 


> **Tip for new contributors:**
> Take a look at [GitHub's Docs](https://docs.github.com/en/get-started/quickstart/hello-world) for helpful information on working with GitHub.

## Types of Contributions

There are lots of ways to contribute to the Astro Docs website! 

The Astro Docs website is ... an Astro website! Maintaining it requires not only written content but also maintaining Astro code and addressing a11y, CSS, UI, and UX concerns. We also make our documentation available in several languages, so we need help translating the entire site.

You can also make a huge contribution by getting involved by leaving review comments on [PRs](https://github.com/withastro/docs/pulls), adding ideas in existing GitHub [Issues](https://github.com/withastro/docs/issues) and [Discussions](https://github.com/withastro/docs/discussions) and participating in our "Pinned" issue maintenance tasks! 

Every PR, especially translation PRs, needs reviewers! Reviewing PRs and leaving comments, suggestions, or an approving "LGTM!" ("Looks Good To Me!") is a great way to get started on Team Docs, and to learn more about Astro.

We encourage you to:

- **File an Issue** to let us know of outdated, confusing, or incorrect documentation. You can also let us know of any problems you encounter on the site itself.

- **Start a Discussion** if you're not sure that your "issue" rises to the level of incorrect documentation requiring a "fix," but you still want to share ideas and opinions.

- **Make a PR directly** for very obvious documentation fixes like typos or broken links.

- **Look at our Existing Issues** (especially those labelled [`help wanted`](https://github.com/withastro/docs/issues?q=is:open+is:issue+label:%22help+wanted%22) and [`good first issue`](https://github.com/withastro/docs/issues?q=is:open+is:issue+label:%22good+first+issue%22)) for contributions we are actively seeking.

- **Review Existing PRs** (especially translations!) to help us get our fixes implemented live on the website sooner.

We provide new content and rework existing content _in response to GitHub Issues and Discussions_.

Submitting an Issue is usually the first step to making a change. After an Issue has been considered by the community, we often reach out to community members to encourage them to submit PRs based on existing Issues.

Larger contributions to the docs are encouraged after participating in Issues and Discussions, as unsolicited material may not fit into our existing plans.

### Examples of Helpful GitHub New Issues

- a particular explanation is confusing (with explanation)
- a code example is wrong (with or without a proposed fix)
- accessibility (a11y) issues discovered
- missing content
- a request for an example of how to implement a specific feature (e.g. responsive nav bar)

### Examples of Helpful GitHub PRs
 - PRs addressing an existing Issue
 - unsolicited PRs to address typos, broken links, and other minor problems
<!--TODO: Link to past successful PRs, and explain why they were successful (maybe best for a later section) -->

### Examples of Helpful GitHub Discussions
- is this page in the right section of the docs?
- is anything missing from our docs landing page?
- is this theme color too bold?
- is site navigation clear and helpful?
- is our "Astro vs X" page providing helpful comparisons between Astro and other website builders?

<!-- ## Who Are We? -->

## Making a New Issue

If you're unsure which type of contribution best represents your concern, please [make a new issue](https://github.com/withastro/docs/issues/new)!

### Writing an Issue

Helpful issues usually include:
- Clear descriptive titles
- Links to relevant pages/files
- Explanations as to why (or _for whom_) this is a problem
- Optional: proposed solutions

## Making PRs (pull requests)

> Need help making a PR? [Join us on Discord](https://astro.build/chat), we'll be more than glad to help you out!

Contributions to the documentation site are made by editing the docs repository. You can do this directly on GitHub.com or by creating a copy of the repository locally, making your changes there, and contributing back to our repository.

> **Note**
> By default, your merged PR to an English page will trigger our Translation Status Tracker. If your change should **NOT** be applied to every language (e.g. a typo fix to an English word), please include the keyword "en-only" in your PR title.  See the next section for more details.

**Internationalization (i18n)**

Please only add new text content to the docs **in English**, by modifying only **`.md` files located within `src/content/docs/en/`**.

We have automated systems in place for notifying our community translators that there is new material to be translated, so there is no need to make changes to additional languages yourself.

Our Docs are translated into several languages and we rely on automation to notify our translators that English pages have changed. By default, when a PR to an English page is merged, our Translation Status Tracker is updated.

**When choosing a PR title, please consider whether your PR should or should NOT trigger a rewrite to pages in other languages**: some tiny fixes are English only (e.g. spelling of English words) but some *will* require updating all language pages (e.g. a small error in a code sample).  Please use the keyword "en-only" in your PR title to override this default behavior and indicate that your PR does **NOT** require translating.

**Pages generated from outside sources**

Some of our English-language pages are generated from outside sources and maintained in another repo. Currently, these files are `configuration-reference.mdx`, `legacy-flags.mdx`, and all our error messages.
The page's **Edit this page** button should redirect you to the file that should be changed. Alternatively, you can get the correct URL from the file's `githubURL` frontmatter property.

> **Note**
> All of the generated pages will have a dev-only warning at the top and the `githubURL` frontmatter property.

When you make a PR with docs changes in another repo, please ping **@withastro/maintainers-docs** so we are aware of the changes made and can properly review your contribution.

### Edit this Page via GitHub

Every page on [docs.astro.build](https://docs.astro.build/) has an **Edit this page** button in the sidebar. You can click that button to edit the source code for that page in **GitHub**.

After you make your changes, click **Commit changes**.
This will automatically create a [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks) of the docs in your GitHub account with the changes.

Once you have committed your edits to your fork, follow the prompts to **create a pull request** and submit your changes for review.

Every pull request needs to be reviewed by our contributors and approved by a maintainer.

You can find more information about submitting your pull requests in our [contributor guides](https://contribute.docs.astro.build)

### Contribute PRs using an online code editor (e.g. StackBlitz, Codeflow, CodeSandbox)

Editing a local fork on GitHub.com is convenient for small text changes, but does not allow you to see a live preview of the site.

You can instead open your fork in an online IDE (integrated development environment) for a code editor and live preview without needing to set up any local development environment. Each online IDE has its own shortcut URL for opening an existing repository, and will allow you to create pull requests after you have made changes.

See specific instructions for opening an existing repository in [CodeSandbox](https://codesandbox.io/docs/importing#import-from-github), [StackBlitz](https://developer.stackblitz.com/docs/platform/importing-projects/#import-from-github) and [Codeflow IDE](https://developer.stackblitz.com/codeflow/working-in-codeflow-ide) on their respective websites.

Note that CodeSandbox and StackBlitz provide Astro syntax highlighting in their custom code editors, while Codeflow supports the full [Astro VSCode extension](https://docs.astro.build/en/editor-setup/#vs-code).

### Contribute PRs by Developing Locally

To begin developing locally, checkout this project from your machine.

```shell
git clone git@github.com:withastro/docs.git
```

You can install and run the project locally using [pnpm](https://pnpm.io/). Head to [the pnpm installation guide](https://pnpm.io/installation) to get that set up. Then, run the following from your terminal:

```shell
pnpm install

pnpm run dev
```

If you’re copying these instructions, remember to [configure this project as a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork).

```shell
git remote add upstream git@github.com:withastro/docs.git
```

At any point, create a branch for your contribution.
We are not strict about branch names.

```shell
git checkout -b add/partial-hydration-typo-fix
```
### Opening a PR

Once you have made your changes using any of the above methods, you’re ready to create a “Pull Request!”

This will let the Astro docs team know you have some changes to propose. At this point we can give you feedback and might request changes. For translations, we like to have at least one other person who knows the language you are translating into review the PR.

[Read more about making a pull request in GitHub’s docs](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request)

Please include a clear title. The description will be pre-filled with questions that you can answer by editing right in the text field.

Every pull request generates a preview of the docs site, including your proposed changes, using **Cloudflare Workers** for anyone to see.

Use the **Preview deployment** link in your pull request to review and share your changes.

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
2. Click <kbd>Sync fork</kbd> and then <kbd>Update branch</kbd>

##### Manually from the command line
In the terminal on your computer:
1. Make sure you’re on the main branch: `git checkout main`
2. Fetch and merge updates: `git pull upstream main`
3. Push the updates back to your fork on GitHub: `git push origin main`

##### Automatically with a GitHub app
1. Go to [the “Pull” GitHub app page](https://github.com/apps/pull)
2. Click <kbd>Install</kbd>
3. Follow the instructions to select your fork

## Next Steps

- [Read the docs](https://docs.astro.build/)
- [Fork the docs](https://github.com/withastro/docs/fork)
- [Raise an issue](https://github.com/withastro/docs/issues/new)
- [Discuss the docs](https://discord.gg/cZDZU3hJHc)
- [Visit the Astro Docs Docs to see even more documentation about contributing to Astro docs!](https://contribute.docs.astro.build)

## For maintainers

This section provides guidance for maintainers of the docs repository. For the review process, merging, and how to use labels, see [Tips for Astro Maintainers](https://contribute.docs.astro.build/roles/maintainers/).

### Automation overview

Each workflow in the `.github/workflows/` directory starts with a comment describing what it does. When you add or change a workflow, please add or update this comment.

You can also run scheduled workflows manually, for example before a release: open the workflow in the Actions tab and select **Run workflow**.

### Dependency updates

[Renovate](https://docs.renovatebot.com/) only updates the GitHub Actions used in workflows (`.github/renovate.json5`). npm dependencies, pnpm, and Node.js are updated by hand. The Node.js version used in CI is set in `.github/actions/install/action.yml`.

### Release process

This section describes how to handle the docs for patch, minor, and major releases of Astro.

For every release, check whether the generated reference pages need a last-minute update. If they do, run the `nightly.yml` workflow manually.

#### Umbrella PRs

We collect docs PRs into umbrella PRs to make it easier to merge the documentation associated with a new release. Each release type has a matching label:

- `patch-release`: the docs PR is based on `main` and ships with an Astro patch release.
- `minor-release`: the docs PR is based on `main` and ships with an Astro minor release.
- `major-release`: the docs PR is based on a [version branch](#creating-a-version-branch) and ships with an Astro major release, including prereleases (e.g. a patch for a major beta).

Umbrella PRs are labeled `merge-on-release` to easily find them in the PRs list.

#### Adding a docs PR to its umbrella

1. Approve the PR and label it for the release (e.g. `minor-release`).
2. Optionally, add it to the milestone for the new version (e.g. `7.3`).
3. When the PR is ready for the release, add the `accepted` label.
4. First-time contributor PRs require a second workflow approval after adding `accepted`.

The release assistant (`.github/workflows/release-assistant.yml`) then makes several checks to ensure that the pull request can be merged: the PR is approved, the branch matches the label, and there are no requested changes, no conflicts, and no pending or failed checks.

- If it can, the release assistant squash-merges the PR into the umbrella branch of its base (e.g. `umbrella/main` for `main`), and opens the umbrella PR if none is open.
- If it can't, it comments with the reasons and removes `accepted`. Fix them, then add `accepted` again.

Once the `[ci] release` PR is merged in [`withastro/astro`](https://github.com/withastro/astro), the docs PR can no longer join the umbrella:

- If the PR is for the same release (e.g. last-minute fixes), change its base to its umbrella branch (e.g. `umbrella/main`), then add `accepted`.
- If not, [merge the umbrella PR](#merging-an-umbrella-pr) first, then add `accepted` to create a new umbrella.

#### Refreshing an umbrella PR

The release assistant updates the title, labels, and description of each umbrella PR when a new PR is added to it. Changes made to these elements are overwritten.

You can also refresh the umbrella PRs by running the `release-assistant.yml` workflow manually. This can be helpful when the release PR changed or when the umbrella has not been updated due to a GitHub outage.

#### Merging an umbrella PR

The release assistant blocks the merge with a checklist. When the `[ci] release` PR is merged in [`withastro/astro`](https://github.com/withastro/astro):

1. Go through the checklist, then dismiss the review.
2. Squash-merge the umbrella PR. If it is labeled `i18n`, add a [Lunaria directive](https://lunaria.dev/guides/tracking/#triggering-changes-per-file) to the commit body (e.g. `@lunaria-track:src/content/docs/en/**.mdx`).

#### Major releases

Docs PRs for a major release follow the same process. They are based on the version branch (e.g. `v7`) and labeled `major-release`.

The examples below use a release from `v6` to `v7`.

##### 1. Preparing the repository

When [`withastro/astro`](https://github.com/withastro/astro) enters prerelease mode for the new major version:

1. [Create a version branch](#creating-a-version-branch) for the new version from `main` (e.g. `v7`).
2. In `.github/workflows/nightly.yml`, uncomment the matrix entries that generate the reference pages from the `next` branch of `withastro/astro`, and update their target branch for the new version (e.g. `TARGET_BRANCH: v7`).
3. Prepare an upgrade guide for the new version.

##### 2. During the alpha and beta phase

1. Make sure docs PRs for the new version target the new version branch.
2. Add them to the milestone for that version (e.g. `7.0`).
3. Review and approve them as usual.
4. When the implementations are merged, label their docs PR with `accepted`. They'll join their own umbrella PR (e.g. `umbrella/v7`).
5. When a `[ci] release (next)` PR is merged in [`withastro/astro`](https://github.com/withastro/astro), merge the associated umbrella PR.
6. When the first umbrella PR is merged into the new version branch, the docs lead opens a PR from the new version branch to `main`, with the `major-release` label. This PR stays open until the final release.
7. Regularly merge `main` into the new version branch to keep it up to date.

##### 3. Before the final release

When [`withastro/astro`](https://github.com/withastro/astro) merges its `next` branch into `main` and leaves prerelease mode, the release assistant refuses docs PRs based on `main`.

1. If a `main` umbrella PR is still open, change its base to the new version branch, and squash-merge it.
2. Update the mentions of the alpha or beta in the docs (e.g. the upgrade command).
3. Update the docs links in [`withastro/astro`](https://github.com/withastro/astro) to point to `docs.astro.build` instead of the version subdomain.
4. In `.github/workflows/nightly.yml`, comment out the matrix entries added when preparing the repository.
5. Update the branch for the current version (e.g. `v6`) to capture the final state of its docs: merge `main` into it and resolve any conflicts. If this branch doesn't exist, [create it](#creating-a-version-branch) from `main`.
6. Stop merging PRs into `main`.

##### 4. Releasing

1. If the PR from the new version branch to `main` contains translations, prepare a [Lunaria directive](https://lunaria.dev/guides/tracking/#triggering-changes-per-file) for the commit body.
2. When the `[ci] release` PR is merged in [`withastro/astro`](https://github.com/withastro/astro), [merge the umbrella PR](#merging-an-umbrella-pr) of the new version branch (e.g. `umbrella/v7`), if one is open.
3. Merge the PR from the new version branch to `main`, adding the Lunaria directive to the commit body if needed.

##### 5. After the final release

Update the subdomain redirects in the Cloudflare dashboard.

1. Remove the redirect from the previous version's subdomain (e.g. `v6.docs.astro.build`), so it serves the archived docs.
2. Redirect the new version's subdomain (e.g. `v7.docs.astro.build`) to `docs.astro.build`.

### Creating a Version Branch

When a new major version of Astro is released, the current `main` branch becomes a version branch (e.g. `v7`) to preserve the docs for that version. Since `main` already has the Cloudflare Workers deployment infrastructure, only a few changes are needed:

#### 1. On the new version branch

After branching from `main`, update these files:

- **`wrangler.jsonc`** — Change the `name` field to match the version (e.g. `"name": "docs-v7"`).
- **`astro.config.ts`** — Change the `site` URL to the versioned subdomain (e.g. `'https://v7.docs.astro.build/'`).

#### 2. On `main`

Update `.github/workflows/deploy.yml` to include the new version branch:

- Add the branch name to the `push.branches` list (e.g. `[main, v4, v5, v6, v7]`).
- Add a corresponding `github.ref == 'refs/heads/v7'` condition to the Deploy step's `if` block.

#### 3. In the Cloudflare dashboard

- After the first successful deploy, go to the Worker's settings (e.g. `docs-v7`) -> **Domains & Routes** and add the custom domain (e.g. `v7.docs.astro.build`).
