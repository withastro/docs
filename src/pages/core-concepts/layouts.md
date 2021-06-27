---
layout: ~/layouts/Main.astro
title: Layouts
---

Within Astro layouts provide a possibility to reuse standardized website 
structures and its appeareance.

A layout can be used for two cases:

- create a frame, a wrapper which can be reused across multiple pages of your website to contain
- create a frame for markdown files

## Slots

To define in which part of the page different content (i.e. for multiple blog posts) is redendered,
it is necessary to explicitly define a place in an astro file where the particular content is rendered.
To do this a slot is used. Currently only one slot for a Layout is allowed. This keeps your layout pretty simple.

## A basic layout example

Astro proposes to put layout files into a layouts folder of the `src` folder in your astro project.
The following example is a very basic HTML layout with a slot defined.

````html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Title of your website</title>
  </head>

  <body>
    <header>
      <h1>Header</h1>
    </header>

    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Posts</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
     </nav>

    <main>

      <article>
        <slot></slot>
      </article>

      <aside>
        <h2>Side Navigation</h2>
      </aside>

    </main>

    <footer>
      <p>©Copyright 2021 All rights reversed.</p>
    </footer>

  </body>
</html>
````

## Using a layout in an astro file

In astro files layouts need to be imported like normal [astro-components](/basic-concepts/astro-components).

Example:
````html
---
import DefaultLayout from '../layouts/default.astro'
---
<DefaultLayout>
    <main>
        <h1>Welcome to the Astro blog</h1>
    </main>
</DefaultLayout>
````

## Using a layout in a markdown file

In markdown files layouts can be reference in the frontmatter part of the file.

Example:

````markdown
---
layout: ../layouts/default.astro
title: Blog Post
---

# Welcome to the first Astro blog post

With Astro our blog have a high boost of speed as there is no JavaScript served anymore
for most of the pages. When needed it's possible to easily load JavaScript for a certain
interactive part of the page.
````