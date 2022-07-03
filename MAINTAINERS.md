# Maintainers Manual

Welcome, Maintainers!

Just like the core Astro code base, and other code repositories within the Astro organization, you also have extra permissions within the Docs repo, too.

When you do find yourself wanting or needing to get involved in the Docs, here is some handy guidance for helping to maintain this repository.

**"How can I help, if I have some time today?"**

This is a recurring theme in the #docs Discord channel. Maintainers regularly post messages to `@team-docs` answering _everyone's obvious burning question_, with specific or general prompts and nudges.

The following is the answer to that question **for Astro Maintainers**, so that you can all feel comfortable jumping in and helping out.


## Triaging Issues and PRs

Docs uses a label system in GitHub to categorize Issues and PRs **according to general topic area**.

The docs site involves not only content (writing and technical content), but also everything involved in managing an Astro site: site UI, architecture, accessibility (a11y) issues and internationalization (i18n) with multiple languages in active translation.

When you see PRs that have not yet been labelled, you can help by adding one or more labels. Our common labels include:

- `i18n` includes page translations and other efforts to keep the translators organized, including GitHub actions, automation, and site UI relevant to supporting multiple languages.

- `add new content` is used for something previously undocumented on the website. (i.e. We haven't thought in details about how to write about this topic before.) This tag is useful because it reminds us that we should make sure we really understand this new thing, and any implications elsewhere in the Docs, while documenting it. (Does it replace an existing feature that we need to deprecate? Does this change an instruction or recommendation documented elsewhere? If a brand new feature, does it require a technical documentation in Reference and also a more user-friendly mention somewhere in Learn?)

- `improve existing documentation` is used for smaller, but non-trivial documentation improvements to items that are currently documented. This distinction is helpful because we have already considered this feature as part of the entire Docs site, and the change might be small enough to be localized. For example, improving the wording of an instruction or adding an extra example to illustrate a particular nuance of a topic that we have already documented.

- `site improvement` is a broad category, but is used to label site issues and maintenance tasks as opposed to content and writing tasks. This distinction is helpful to allow community members and maintainers to easily filter tasks to either focus on or ignore content writing Issues and PRs. This allows community members (and maintainers!) more easily contribute according to their own skills and interests.


## Merging PRs

Astro's Docs community, and repository, is _extremely active_.

One of the most helpful things an Astro maintainer can do is **help our community members get their PRs merged**!

Providing friendly, helpful, timely feedback is important to maintaining our community. It shows respect and appreciation for their time and contribution.

As a maintainer, helpful things you can do:

- Leave a "Thank you for this!" message, or a simple emoji reaction, in an Issue or a PR if an Issue or PR hasn't had any activity yet. Similarly, "Just checking in!" or "We haven't forgotten about this, but are waiting on..." messages are also friendly and helpful!

- Ask any obvious clarifying questions, even if you do not intend to follow up with or take responsibility for the PR itself. Anticipate what further information might be useful to include, or address any weakness or points of confusion.

- Give general feedback (without commiting to responsibility for merging). "I can reproduce this problem!" or "I agree, this code example isn't working as written," save others time when trying to evaluate PRs.

- Leave the message **LGTM** (Looks good to me, Let's get that money...) on a PR you sign off on... but don't feel comfortable merging yourself. For example, a proposed new section or explanation looks good to you, but you suspect that other maintainers will also want the opportunity to review it. 

- Mention a particular maintainer or community member whose guidance or inclusion you know would be helpful. Different maintainers work on different parts of Astro, and if you know who the person to seek extra clarification, or approval from is, ping them!

- Merge a PR yourself, even without any consultation or discussion, if it's an obvious fix like a typo or broken link.


### Content

For PRs related to text content, including formatting of content for ease of readability as well as organizing and structuring content:

- Consult our [writing guide](/WRITING.md) when evaluating new or revised text content to the docs.
- Proofread, edit, make suggestions and leave "LGTM" as appropriate.
- For most non-trivial PRs, the Docs Lead will likely want to do a final review themselves before the PR is merged.

### Site UI/Architecture

For PRs related to the Astro website itself, including accessibility (a11y) issues, UI elements and project structure:

- Test the proposed changes at a variety of screen sizes, and on a variety of devices.
- Check both light and dark theme modes.
- Navigate to several pages, including following anchor links, to test behaviour
- Conduct any a11y checks or tests you have access to: screen reader behaviour, colour contrast ratios, etc.
- For most non-trival PRs, the Docs Infrastructure Lead will likely want to do a final review themselves before the PR is merged.

### Language Translations

For PRs that are translations to existing Docs content, including new page addtions as well as smaller updates and corrections:

- Consult the [Internationalization Guide](/src/i18n/README.md) to familiarize yourself with the transators' process
- If you see "LGTM" in a message within the PR, that means at least one other native speaker has approved the translation, and the PR can be immediately merged! 🥳
- If you speak the language natively, check the content for accuracy. Note: some languages have created their own glossaries and/or language guides loctaed in their language folder within `/src/i18n/`
- If you do not speak the language natively, and the PR has not had any recent activity, you can use online translation tools (e.g. Google Translate) and scan the results for anything that looks wildly out of place. Also, visit the page in the PR’s Netlify deploy preview to verify that nothing is visually out of place.


## Submitting your own PRs

This section is much shorter now that we are protecting the `main` branch of the Astro repos! 😅

Maintainers who submit PRs are expected to **merge their own PRs**, but only **after receiving an LGTM**. 

Typically, this will be an approval from another maintainer, often the Docs Lead or Docs Infrastructure Lead. But, in the case of minor PRs (e.g. typo fixes, broken links etc.), any second LGTM is acceptable.


