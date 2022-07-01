---
layout: ~/layouts/MainLayout.astro
title: Sharing State
i18nReady: false
setup: |
  import Tabs from '~/components/tabs/Tabs'
  import Tab from '~/components/tabs/Tab'
  import TabPanel from '~/components/tabs/TabPanel'
---

Boats!

<Tabs client:load>
  <Fragment slot="tabs">
    <Tab id="react" client:only="preact">Tab one!</Tab>
    <Tab id="preact" client:only="preact">Tab two!</Tab>
    <Tab id="vue" client:only="preact">Tab three!</Tab>
  </Fragment>
  <Fragment slot="panels">
    <TabPanel id="react" client:only="preact">Panel 1</TabPanel>
    <TabPanel id="preact" client:only="preact">Panel 2</TabPanel>
    <TabPanel id="vue" client:only="preact">Panel 3</TabPanel>
  </Fragment>
</Tabs>
<Tabs client:load>
  <Fragment slot="tabs">
    <Tab id="react" client:only="preact">Tab one!</Tab>
    <Tab id="preact" client:only="preact">Tab two!</Tab>
    <Tab id="vue" client:only="preact">Tab three!</Tab>
  </Fragment>
  <Fragment slot="panels">
    <TabPanel id="react" client:only="preact">Panel 1</TabPanel>
    <TabPanel id="preact" client:only="preact">Panel 2</TabPanel>
    <TabPanel id="vue" client:only="preact">Panel 3</TabPanel>
  </Fragment>
</Tabs>

<!-- 
<Tabs storeKey="ui-frameworks">
  <Fragment slot="tabs">
    <Tab>React</Tab>
    <Tab>Preact</Tab>
    <Tab>Vue</Tab>
    <Tab>Svelte</Tab>
    <Tab>Solid</Tab>
  </Fragment>
  <Fragment slot="panels">
    <TabPanel>
      React example
    </TabPanel>
    <TabPanel>
      Preact example
    </TabPanel>
    <TabPanel>
      Vue example
    </TabPanel>
    <TabPanel>
      Svelte example
    </TabPanel>
    <TabPanel>
      Solid example
    </TabPanel>
  </Fragment>
</Tabs> -->
