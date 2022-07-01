---
layout: ~/layouts/MainLayout.astro
title: Sharing State
i18nReady: false
setup: |
  import UIFrameworkTabs from '~/components/tabs/UIFrameworkTabs.astro'
---

Boats!

<UIFrameworkTabs>
  <Fragment slot="preact">Preact content</Fragment>
  <Fragment slot="react">React content</Fragment>
  <Fragment slot="solid">Solid content</Fragment>
  <Fragment slot="svelte">Svelte content</Fragment>
  <Fragment slot="vue">Vue content</Fragment>
</UIFrameworkTabs>

<UIFrameworkTabs>
  <Fragment slot="preact">Preact content</Fragment>
  <Fragment slot="react">React content</Fragment>
  <Fragment slot="solid">Solid content</Fragment>
  <Fragment slot="svelte">Svelte content</Fragment>
  <Fragment slot="vue">Vue content</Fragment>
</UIFrameworkTabs>

