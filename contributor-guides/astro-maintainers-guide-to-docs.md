# Maintainers Manual

Welcome, Maintainers!

Just like the core Astro code base, and other code repositories within the Astro organization, you also have extra permissions within the Docs repo, too.

When you do find yourself wanting or needing to get involved in the Docs, here is some handy guidance for helping to maintain this repository.

**"How can I help, if I have some time today?"**

This is a recurring theme in the #docs Discord channel. Maintainers regularly post messages to `@team-docs` answering _everyone's obvious burning question_, with specific or general prompts and nudges.

The following is the answer to that question **for Astro Maintainers**, so that you can all feel comfortable jumping in and helping out.


## Triaging Issues and PRs

Docs uses a label system in GitHub to categorize Issues and PRs **according to general topic area**.

The docs site involves not only content (writing and technical content), but also everything involved in managing an Astro site: site UI, architecture, accessibility (a11y) issues, internationalization (i18n) with multiple languages in active translation and various automation processes surrounding PRs, page generation and translation status. It's A. LOT.

When you see PRs that have not yet been labelled, you can help by adding one or more labels. Our common labels include:

- `i18n` includes page translations and other efforts to keep the translators organized, including GitHub actions, automation, and site UI relevant to supporting multiple languages.

- `add new content` is used for something previously undocumented on the website. (i.e. We haven't thought in detail about how to write about this topic before.) This tag is useful because it reminds us that we should make sure we really understand this new thing, and any implications elsewhere in the Docs, while documenting it. (Does it replace an existing feature that we need to deprecate? Does this change an instruction or recommendation documented elsewhere? If a brand new feature, does it require a technical documentation in Reference and also a more user-friendly mention somewhere in Learn? Should other existing pages link to this?)

- `improve existing documentation` is used for smaller, but non-trivial documentation improvements to items that are currently documented. This distinction is helpful because we have already considered this feature as part of the entire Docs site, and the change might be small enough to be localized. For example, improving the wording of an explanation or adding an extra example to illustrate a particular nuance of a topic that we have already documented.

- `site improvement` is a broad category, but is used to label site issues and maintenance tasks as opposed to content and writing tasks. This distinction is helpful to allow community members and maintainers to easily filter tasks to either focus on or ignore content writing Issues and PRs. This allows community members (and maintainers!) more easily contribute according to their own skills and interests.



## Merging PRs

Astro's Docs community, and repository, is _extremely active_. 

It is a complex project handling Issues and PRs coming from all directions. In order to accept the greatest number of contributions from the greatest number of community members, with the fewest number of merge conflicts possible... many PRs will be created that are intended to be simply stepping stones to a desired end result. 

**NWTWWHB!** (_Not worse than what we had before!_) is a phrase you may see frequently around the Docs project, as we try to move fast and *not* break things.

One of the most helpful things an Astro maintainer can do is **help our community members get their PRs merged**!

Providing friendly, helpful, timely feedback is important to maintaining our community. It shows respect and appreciation for their time and contribution.

As a maintainer, here are some helpful things you can do:

- Leave a "Thank you for this!" message, or a simple emoji reaction, in an Issue or a PR if it hasn't had any activity yet. Similarly, "Just checking in!" or "We haven't forgotten about this, but are waiting on..." messages are also friendly and helpful!

- Ask any obvious clarifying questions, even if you do not intend to follow up with or take responsibility for the PR itself. Anticipate what further information might be useful to include, or address any weaknesses or points of confusion.

- Give general feedback or opinions, even if you do not intend to follow up with or take responsibility for the PR itself. Comments such as "I can reproduce this problem!" or "I agree, this code example isn't working as written," can save others time when they are trying to evaluate PRs.

- Leave the message **LGTM** (_Looks good to me_, _Let's get that money_, _Let's get to merging_...) on a PR you sign off on... but don't feel comfortable merging yourself. For example, a proposed new section or explanation looks good to you, but you suspect that other maintainers will also want the opportunity to review it. If your approval concerns only a specific aspect of the PR (e.g. you have verified a code sample is correct; you agree with the intention, if not the exact wording etc.) then please be specific about *what* looks good to you. This is to help the maintainer who will assume responsibility for merging the PR know which aspects have been reviewed, and also to not give the PR author "false hope" that the entire PR is ready to merge!

- Mention a particular maintainer or community member whose guidance or inclusion you know would be helpful. Different maintainers work on different parts of Astro, and if you know who the right person to seek extra clarification or approval from is, ping them!

- Merge a PR yourself, even without any consultation or discussion, if it's an obvious fix like a typo or broken link.

### Content

For PRs related to text content, including formatting of content for ease of readability as well as organizing and structuring content:

- Consult our [writing guide](/contributor-guides/writing-and-style-guide.md) when evaluating new or revised text content to the docs.
- Proofread, edit, make suggestions and leave "LGTM" (and/or "NWTWWHB") as appropriate.
- For most non-trivial PRs, the Docs Lead will likely want to do a final review themselves before the PR is merged.

### Site UI/Architecture

For PRs related to the Astro Docs website itself, including accessibility (a11y) issues, UI elements and project structure:

- Test the proposed changes at a variety of screen sizes, and on a variety of devices.
- Check both light and dark theme modes.
- Navigate to several pages, including following anchor links, to test behaviour.
- Conduct any a11y checks or tests you have access to: screen reader behaviour, colour contrast ratios, etc.
- For most non-trivial PRs, the Docs Infrastructure Lead will likely want to do a final review themselves before the PR is merged.

#### Accessibility

We encourage our maintainers to audit and improve the accessibility of our code base as we strive for inclusion. We have selected a few trusted sources to help you out in your accessibility efforts when reviewing or making your own PRs:

- The WAI (Web Accessibility Initiative) has a great [introduction to accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/), as well as a list of [recommended resources for developers](https://www.w3.org/WAI/roles/developers/).
- WAI's APG (ARIA Authoring Practices Guide) is great for learning [accessible component patterns](https://www.w3.org/WAI/ARIA/apg/patterns/).
- The A11yProject's [extensive list of resources](https://www.a11yproject.com/resources/) contains articles about accessibility testing, free developer tools, podcasts, and more. Also, it's worth looking at their blog posts and checklist for more insights!
- MDN (Mozilla Developers Network) has interesting, easy-to-follow [accessibility tutorials, guides, and documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility).

### Language Translations

For PRs that are translations to existing Docs content, including new page additions as well as smaller updates and corrections:

- Consult the [Internationalization Guide](/translating-astro-docs.md) to familiarize yourself with the translators' process.
- If you see "LGTM" in a message within the PR, that means at least one other native speaker has approved the translation, and the PR can be immediately merged! 🥳
- If you speak the language natively, check the content for accuracy. Note: some languages have created their own glossaries and/or language guides located in their language folder within `/src/i18n/`.
- If you do not speak the language natively, and the PR has not had any recent activity, you can use online translation tools (e.g. Google Translate) and scan the results for anything that looks wildly out of place. Also, visit the page in the PR’s Netlify deploy preview to verify that nothing is visually out of place. While we always prefer to have a review from a native speaker of the language, having translated docs with some errors is usually better than having no docs at all.

<!-- #### Correcting an Incorrect Translation Status

If the Translation Status Overview Issue incorrectly shows "needs updating" for a page (e.g. a typo fix to an English page triggered the status update), take the following steps to manually update the tracker:

- Open the [Translation Status Overview](https://github.com/withastro/docs/issues/438) Issue.
- Click the "Edit" button.
- Find the big JSON object at the end (i.e. the translation's internal progress data).
- Replace the `lastMajorChange` value of the affected languages with today's date and hour.

The JSON object will look something like this:
```json
{
"zh-cn": {
      "comparing-astro-vs-other-tools.md": {
        "lastChange": "2022-07-27T19:08:40.000Z",
        "lastCommitMsg": "Core Concepts PR follow-up (#1126)",
        // This property below is the one you should change!
        "lastMajorChange": "2022-07-27T19:08:40.000Z", 
        "lastMajorCommitMsg": "Core Concepts PR follow-up (#1126)"
      },
      // (other pages...)
  }
  // (other languages...)
}
```

This process tells the tracker that the page was updated "now". The next time a PR gets merged, the translation tracking script will be rerun and the page will appear to have been updated, removing its "needs updating" icon. -->

## Submitting your own PRs

This section is much shorter now that we are protecting the `main` branch of the Astro repos! 😅

If your PR depends on a core PR being merged first, please **mark your PR as a draft** so that it does not get merged first. Please also link to the other PR so that we can easily check on its status when we are doing PR reviews.

If your PR includes content for the Docs site to be translated and reflected in all languages, please **only submit your content in English**. This includes any related updates to the navigation sidebar etc. We have a robust system in place for updating the status of affected pages and all related site infrastructure in our other languages, and often our translators are in the best position to notice the "ripple effects" of your changes in their specific pages.

If your PR includes content changes that should *not* be reflected in other languages (e.g. an English typo fix), then you can add the keyword "en-only" or "typo" in a commit message, and our system will *not* flag this page as needing a translation update. (This can be added in the "Squash and Merge" text field.)

Other maintainers who leave review comments will mention you by name so that you will receive a GitHub notification. This is our default way of alerting you of activity on your PR. **If this is not a good way to get your attention, then please state in the PR whether you would like to be pinged on Discord.**

Maintainers who submit PRs are expected to **merge their own PRs**, but only **after receiving an LGTM**.

Typically, this will be an approval from another maintainer, often the Docs Lead or Docs Infrastructure Lead. But, in the case of minor PRs (e.g. typo fixes, broken links, etc.), any second LGTM is acceptable.

### `Co-authored-by:` credit

We have a "DocsBot" that posts congratulation messages in the #docs Discord channel. **Our bot also acknowledges co-authors!** During "Squash and Merge," if you would like to acknowledge any reviewer, please type in the exact phrase `Co-authored-by:` and include any missing reviewers or contributors whom you'd like to acknowledge! For example:

```
Co-authored-by: Sarah Rainsberger <sarah@rainsberger.ca>
Co-authored-by: Chris Swithinbank <swithinbank@gmail.com>
Co-authored-by: Yan Thomas <61414485+Yan-Thomas@users.noreply.github.com>
Co-authored-by: Hippo <6137925+hippotastic@users.noreply.github.com>
Co-authored-by: Kevin Zuniga Cuellar <46791833+kevinzunigacuellar@users.noreply.github.com>
Co-authored-by: ElianCodes <hello@elian.codes>
Co-authored-by: Reuben Tier <64310361+TheOtterlord@users.noreply.github.com>
```

You must use the exact co-author's name and email associated with their GitHub account. You can look up that information using a GitHub commit they have made from any PR, even one from another repository! Please don't hesitate to take the extra step and include others!

From an individual's commit, e.g. `https://github.com/withastro/docs/commit/de11f2f2abf7ef54c874ebe0c85301d9bad36094`, add `.patch` to the end of the URL.

This will bring up a "patchfile" containing all of the information about the commit, including the author's name and email address associated with the commit. You'll find this information in a field labelled `From:`.

## Note on Dependencies

Currently there are dependencies installed that are not directly used, but should not be removed:

- `canvaskit-wasm`: Dependency of `astro-og-canvas` which doesn't bundle well as it uses `__dirname` that doesn't exist in ESM. Install as direct dependency so it can be imported by Astro's intermediary SSR build process.
