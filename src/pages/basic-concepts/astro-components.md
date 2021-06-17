---
layout: ~/layouts/Main.astro
---

# Astro Components

## Partial Hydration

As a result of the island structure components can be rendered with different modes.

Astro components are mainly meant to be used for server-side rendering. That's why components with `.astro` extension don't support partial hydration.

The following modes are supported for components of:
- React
- Svelte
- Vue

### :idle

`<MyComponent:idle />`

### :load
`<MyComponent:load />`

### :visible
`<MyComponent:visible />`


## Default Frameworks
Astro allows to use the following Frameworks out of the box:
- Preact
- React
- Svelte
- Vue


However the integrations of these frameworks with Astro are implemented with a standardized interface. That's why it's possible to [extend Astro with your own framework](https://9df26f6f-108b-4c28-b959-a7e527d38198.vscode-webview-test.com/vscode-resource/file///Users/jan-martinfruehwacht/Dendron/personal/technology/tech.astro.documentation.extend.framework.md).

## Passing Data through properties
