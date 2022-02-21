---
setup: |
    import Button from '../../components/Button.astro'
    import { Markdown, Code, Prism } from 'astro/components'
layout: ~/layouts/MainLayout.astro
title: Getting Started
description: A basic intro to Astro.
---
<style>
    table {
       border: none;
    }

    tr:nth-child(odd) {
        background-color: var(--theme-bg);
        padding: 2em;
    }
    .hidden {
        display: none;
    }
    .active {
        background-color: var(--theme-accent);
        color: white;
        font-weight: bold;
        border-top-left-radius: 1em;
        border-top-right-radius: 1em;
        padding: 3em;
    }
    .code-container {
        background-color: var(--theme-divider); 
        display:flex;
        justify-content: flex-start;
        margin-bottom:0;
        padding: 0.5em;
        padding-bottom: 0;
        border-top-left-radius: 1em;
        border-top-right-radius: 1em;

    }

    .code {
        margin-top:0;
        padding-left: 0.5em;
        max-width: 100vw;
        overflow: hidden;
        background-color: hsla(217, 19%, 27%, 1);
    }
    .toggle {
        padding: 0.5em;
        padding-left: 1em;
        padding-bottom: 0;
        cursor: pointer;
        width: 20%;
    
    }

</style>


## Try Astro

Static Site Generator  🚀  Bring your own Framework  🚀  Ship Less JavaScript

### Online Playgrounds

You can get a feel for Astro by launching a starter project in either StackBlitz or CodeSandbox: online cloud IDEs with terminal, console, and hot module reloading.

| | |
|:---:|:---:|
|<Button text="Open in CodeSandbox" link="https://astro.new/starter?on=codesandbox" />| <Button text="Open in StackBlitz" link="https://astro.new/starter?on=stackblitz" />|

*Choose from the **full list of starter templates** at [astro.new](https://astro.new/).*

### Install Astro Locally

<div class="code-container">
<div id="install-npm" class="active toggle"><h5>npm</h5></div>
<div id="install-yarn" class="toggle"><h5>yarn</h5></div>
</div>
<div id="npm" class="code"><Markdown content={`

    # prerequisite: check that Node.js is 14.15.0+, or 16+
    node --version
    
    # Make a new project directory, and navigate into it
    mkdir my-astro-project && cd $_

    # prepare for liftoff...
    npm init astro

    # install dependencies
    npm install

    # start developing!
    npm run dev
`}/ >
       </div>
<div id="yarn" class="code hidden"><Markdown content={`


   
    # prerequisite: check that Node.js is 14.15.0+, or 16+
    node --version

    # Make a new project directory, and navigate into it
    mkdir my-astro-project && cd $_

    # prepare for liftoff...
    yarn create astro

    # install dependencies
    yarn install

    # start developing!
    yarn start
    `}/>
</div>

Please [read our installation guide](/en/installation) for more details.


### Edit the home page 

Astro is an HTML-like language designed to feel familiar to anyone with HTML or JSX experience. Every starter template includes a welcome page written in Astro located at `src/pages/index.astro` and most include css files located in `src/styles/`. 


```
└── src/
    ├── pages/
    |   └── index.astro    // Your site's home page!
    └── styles/
        ├── global.css
        └── home.css
```

Edit the content of these files to start customizing your site!

⚠️ ***Your project must contain a file called*** **`index.astro`** ***in the*** **`/pages/`** ***directory.***

## Start building with Astro

Jump right in and add some content and features to your site!

🏗️ Add new [Astro (.astro) pages](/en/core-concepts/astro-pages) and/or [Markdown (.md) pages](/en/guides/markdown-content) to your site.

🏗️ Create your first [Layout](/en/core-concepts/layouts).

🏗️ Add additional [CSS and styling](/en/guides/styling) to your site. 

*... see more How-To Guides*



## Learn Astro

See examples of some of the key concepts and patterns of an Astro site!

📚 Read more about Astro’s [project structure.](/en/core-concepts/project-structure)

📚 Learn more about Astro’s [built-in components.](/en/reference/builtin-components)

📚 Explore Astro’s [API.](/en/reference/api-reference)

*... see more reference material*

## Combine with Astro

Explore different integrations that our users have combined with Astro!

🧰 Use a CMS with your Astro project.

🧰 Set up eCommerce.

🧰 Connect a database to your site.

*... see more [third-party integrations](/en/guides/integrations)*



## Discuss Astro

Join us in the [Astro Discord](https://astro.build/chat) to share with and get help from an active, friendly community!

Say hi in our `#introduce-yourself` channel and let us know who you are!

Ask a question in our `#support` channel to automatically receive your own thread and attention from our Support Squad!

Share what you've been working on (no matter how big or how small, finished or in-progress!) in our `#showcase` channel. Ask for feedback, or just soak up the praise! 


## Current Version

### Announcements

Keep up with new feature announcements on our [blog](https://astro.build/blog/).

### Changelog 

You can find a detailed changelog for every release in our [`CHANGELOG.md`](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md).


### Upgrading

Need to migrate from a previous version of Astro? Check the [migration guide](/en/migrate) for key changes upgrading to v0.21+.

<script type="module">
document.getElementById("install-npm").addEventListener("click", () => {
    document.getElementById("npm").classList.remove("hidden");
    document.getElementById("yarn").classList.add("hidden");
    document.getElementById("install-npm").classList.add("active");
    document.getElementById("install-yarn").classList.remove("active");
    console.log("click");
  });
  
  document.getElementById("install-yarn").addEventListener("click", () => {
    document.getElementById("yarn").classList.remove("hidden");
    document.getElementById("npm").classList.add("hidden");
    document.getElementById("install-yarn").classList.add("active");
    document.getElementById("install-npm").classList.remove("active");
    console.log("click");
  });
  </script>