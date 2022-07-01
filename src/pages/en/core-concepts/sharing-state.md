---
layout: ~/layouts/MainLayout.astro
title: Sharing State
i18nReady: false
setup: |
  import Tabs from '~/components/tabs/Tabs'
---

Boats!

<Tabs client:visible storeKey="components">
  <Fragment slot="tab.preact">Preact</Fragment>
  <Fragment slot="tab.react">React</Fragment>
  <Fragment slot="tab.solid">Solid</Fragment>
  <Fragment slot="tab.svelte">Svelte</Fragment>
  <Fragment slot="tab.vue">Vue</Fragment>

  <Fragment slot="panel.preact">Preact content</Fragment>
  <Fragment slot="panel.react">React content</Fragment>
  <Fragment slot="panel.solid">Solid content</Fragment>
  <Fragment slot="panel.svelte">Svelte content</Fragment>
  <Fragment slot="panel.vue">Vue content</Fragment>
</Tabs>

<Tabs client:visible storeKey="components">
  <Fragment slot="tab.preact">Preact</Fragment>
  <Fragment slot="tab.react">React</Fragment>
  <Fragment slot="tab.solid">Solid</Fragment>
  <Fragment slot="tab.svelte">Svelte</Fragment>
  <Fragment slot="tab.vue">Vue</Fragment>

  <Fragment slot="panel.preact">Preact content</Fragment>
  <Fragment slot="panel.react">React content</Fragment>
  <Fragment slot="panel.solid">Solid content</Fragment>
  <Fragment slot="panel.svelte">Svelte content</Fragment>
  <Fragment slot="panel.vue">Vue content</Fragment>
</Tabs>
