---
layout: ~/layouts/TutorialLayout.astro
title: Markdown Blog Posts
description: Using Markdown to create blog posts on your site.
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
---
BY THE END OF THIS SECTION YOU WILL HAVE:
- Written three blog posts in Markdown (`.md`) files
- Created a second Astro layout to display these Markdown files differently from your main pages
- Added an automatically generated list of your blog posts to your Blog page

Now that you have created a few pages for your website, let's add some blog posts!

### Summary

**Markdown** is a language that is popular for writing longer-form text like articles and blog posts. It includes shorthand symbols for common HTML elements such as headers, font styling, lists and even more complicated items like tables that several applications can render as HTML. Writing content with Markdown allows you to focus on your text, while providing some basic formatting options without the need to wrap words in standard HTML tags.

In Astro, you can add Markdown files (`.md`) anywhere within `src/pages` in your project to automatically create pages for your website. Because formatting options are limited in Markdown, Astro allows you to specify a specific `layout` property for each file, which can be your regular Astro layout component, or a special one, just for displaying Markdown files.

### Test your knowledge

Fill in the blanks with **layout**, **styles and formatting**, **Markdown**, **`src/pages/`** and **blog post**:

|| **Markdown** || is a popular language for writing long-form content such as articles and blog posts. Markdown lets you include some basic text || **styles and formatting** || using shorthand symbols instead of typing out full HTML element tags. 

The content of a || **blog post** || (or any page) in Astro can be written in an `.md` file and placed within || **`src/pages/`** || to create a page on your website. Don't forget to specify an Astro component as a || **layout** || for your file, or all you will see is your text content! 


### Checklist for moving on

<Checklist key="markdown">
- [ ] I am ready to add some blog posts to my Astro project!
</Checklist>

---

## Writing Markdown Blog Posts

BY THE END OF THIS SECTION YOU WILL HAVE:
- created Markdown (`.md`) files in a new `/posts/` folder
- added necessary YAML frontmatter to each Markdown file
- created new pages on your website by writing in Markdown


Now that you have built pages using `.astro` files, let's make some blog posts using `.md` files!

### Create your first `.md` file

1. Create a new directory at `src/pages/posts/`. 
2. Add a new (empty) file `post-1.md` inside your new `/posts/` folder.
3. Check your browser preview at the following address: `localhost:3000/posts/post-1`
:::note
If you are working in a cloud editor, then you can preview this page by adding `/posts/post-1` to the end of your existing preview URL
:::
4. Change the browser preview URL and view `localhost:3000/posts/post-2`. (This is a page you have not yet created.) Note the different output when previewing an "empty" page, and one that doesn't exist! This will help you troubleshoot in the future.

### Write Markdown content

1. Copy or type the following code into `post-1.md`
```markdown
---
// src/pages/posts/post-1.md

title: 'My First Blog Post'
pubDate: 2022-07-01
description: 'This is the first post of my new Astro blog.'
author: 'Astro Learner'
image:
    url: 'https://astro.build/assets/blog/astro-1-release-update/cover.jpeg' 
    alt: 'The Astro logo with the word One.'
tags: ["astro", "blogging", "learning in public"]
---
# My First Blog Post

Published on: 2022-07-01

Welcome to my new blog about learning Astro! Here, I will share my learning journey as I build a new website.

## Installing Astro

First, I created a new Astro project and set up my online accounts.

## Making Pages

I then learned how to make pages by creating new `.astro` files and placing them in the `src/pages/` folder.

## Making Blog Posts

This is my first blog post! I now have Astro pages and Markdown posts!
```
2. Check your browser preview again at `localhost:3000/posts/post-1` (or by adding `/posts/post-1` to the end of the current preview URL in your browser). You should have a brand new page!

### Test your knowledge

Fill in the blanks with **Markdown (`.md`)**, **`src/pages/**, **HTML tags**, and **no content**:

I can put files in the || **`src/pages/`**|| directory, and in its sub-folders, to create pages on my website. Astro regognizes and builds a page for my site if a file exists here, even if it has || **no content** || to display. 

To create content for pages built with `.astro` files, I include standard HTML elements. But, when I create pages using || **Markdown (`.md`)** || files, I can write using a simplified syntax that does not require || **HTML tags** ||.   

### Checklist for moving on

<Checklist key="post">
- [ ] I can create a new folder within `src/pages/` for my blog posts
- [ ] I can create a new Markdown (`.md`) blog post file in this new folder with YAML frontmatter values
- [ ] I understand that Markdown is another language that, like Astro, produces HTML in my browser.
- [ ] I can read more about Markdown and YAML on my own if I need to!
</Checklist>

### Resources

[Markdown Cheat Sheet from The Markdown Guide](https://www.markdownguide.org/cheat-sheet/)  <Badge>external</Badge>

[YAML frontmatter](https://assemble.io/docs/YAML-front-matter.html)  <Badge>external</Badge>

---

## Markdown Layouts

BY THE END OF THIS SECTION YOU WILL HAVE:
- added additional metadata to a blog post
- passed YAML frontmatter values as props to an Astro layout component


Now that you have your first `.md.` blog post written, let's see how Astro can supercharge your standard Markdown pages!

### Pass frontmatter properties to a layout

Your frontmatter values are available to an Astro layout specified with the special `layout` frontmatter property.

1. Create a new file at `src/layouts/MarkdownPostLayout.astro`

2. Copy the following code into `MarkdownPostLayout.astro`

```astro
---
// src/layouts/MarkdownPostLayout.astro
const { content } = Astro.props
---
<h1>{content.title}</h1>
<p>Written by {content.author}</p>
<slot />
<p><a href="/">Home</a></p>
```
2. Add the following frontmatter property in `post-1.md`

```diff
---
// src/pages/posts/post-1.md
+ layout: ../../layouts/MarkdownPostLayout.astro
title: 'My First Blog Post'
pubDate: 2022-07-01
description: 'This is the first post of my new Astro blog.'
author: 'Astro Learner'
image:
    url: 'https://astro.build/assets/blog/astro-1-release-update/cover.jpeg' 
    alt: 'The Astro logo with the word One.'
tags: ["astro", "blogging", "learning in public"]
---
```

3. Check your browser preview again at `localhost:3000/posts/post-1` (or by adding `/posts/post-1` to the end of the current preview URL in your browser). You should notice two differences to your page, added by your layout:
- The post title and "Written by: Astro Learner" at the top of of the page, before your Markdown content
- A link to go back to your home page at the very bottom of your page, after your Markdown content 

### Analyze the pattern

1. Which content is now duplicated when you check your blog post in your browser preview? 

|| The title of the page appears twice. ||

2. What are the two different ways being used to get that content displayed?

i. || The title is written inside the Markdown content being injected into the layout `<slot />` ||

ii. || The title is written as a frontmatter value, and is being used by the layout component. ||

3. What change should be made to the existing code to remove this duplication?

|| Delete the line `# My First Blog Post` from the page Markdown. ||

4. Although you could remove the duplication another way, why is the answer above the better choice?

|| Keeping the page title in frontmatter YAML will give you more options to use the title in other ways and on other pages. It will also allow you to style the title independently. If the title only is written in Markdown, it is only available to the layout as `<slot />` content, which is less flexible. ||

With an Astro layout component, you can choose which content is written in Markdown and injected into your new layout's default slot, and which content is written in YAML frontmatter and sent to your Astro layout component! Remember to visually inspect your page preview, to avoid duplicated elements.

### Try it yourself - refactoring to create a common layout

Identify items common to every blog post, and use `MarkdownPostLayout.astro` to render them, instead of writing them in your Markdown in `post-1.md` and in every future blog post.

Here's an example of refactoring your code to include the `pubDate` in the layout component instead of writing it in the body of your Markdown:

```diff
// src/pages/posts/post-1.md
- Published on: 2022-07-01
```

```diff
---
// src/layouts/MarkdownPostLayout.astro

const { content } = Astro.props
---
<h1>{content.title}</h1>
+ <p>Published on: {content.pubDate.slice(0,10)}</p>
<p>Written by {content.author}</p>
<slot />
<p><a href="/">Home</a></p>
```

Refactor as much as you think is useful to you, and add as much to your layout as you want, remembering that everything that you add to your layout is one less thing you will write in each and every blog post!

Here is an example of a refactored layout that leaves only individual blog post content rendered by the slot. Feel free to use this, or create your own! 

```astro
---
// src/layouts/MarkdownPostLayout.astro

const { content } = Astro.props
---
<h1> {content.title}</h1>

<p>{content.pubDate.slice(0,10)}</p>

<p><em>{content.description}</em></p>

<p>Written by: {content.author}</p>

<img src={content.image.url} width="300" alt={content.image.alt} />
<slot />
<p><a href="/">Home</a></p>
```
:::note[avoid duplication]
 Anything rendered by your layout does **not** need to be typed into your blog post! If you notice any duplication when you check your browser preview, then be sure to remove content from your Markdown file.
 :::

### Test your knowledge
Fill in the blanks so that the following two components together produce working Astro code:

1. `src/pages/posts/learning-astro.md`
```markdown
---
// src/pages/posts/learning-astro.md

layout: ../../__________/MyMarkdownLayout.astro
title: "Learning About Markdown in Astro"
_____ : "My first attempt using Markdown in Astro"
author: Astro Learner
date: 2022-08-08
---
# {_______.date}

{frontmatter.description}

I learned so much today! Astro allows me to write in Markdown, but also use variables from the frontmatter. I can even even access those values in an Astro layout component.
```
2.  `src/layouts/MarkdownLayout.astro`
```astro
---
// src/layouts/MarkdownLayout.astro

import ____________ from '../components/Footer.astro'
const { ___________ } = Astro.props
---
<h1>{content.title}</h1>
<p>Written by:{content.______ }</p>
< _______ />
<Footer />
```

### Checklist for moving on

<Checklist key="frontmatter">
- [ ] I can add meta data to a blog post by creating a property in its YAML frontmatter.
- [ ] I can create a separate layout for Markdown posts that renders the file's Markdown content in a `<slot />`.
- [ ] I can use values from a blog post's frontmatter in that Markdown post's layout component.
- [ ] I can create a basic blog template within a Markdown post layout to render common elements and avoid typing them into each individual blog post.
</Checklist>

### Resources

[Markdown Layouts in Astro](/en/guides/markdown-content/#markdown-layouts)

[Frontmatter as props](/en/guides/markdown-content/#frontmatter-as-props)

[Introduction to YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) <Badge>external</Badge>

---

## Combining Layouts

BY THE END OF THIS SECTION YOU WILL HAVE:
- created two new blog pages for your site
- created nested layouts to render your layout for Markdown posts inside your main page layout
- passed each blog post's title to `BaseLayout.astro` for updating page metadata


Now that you have your first `.md.` blog post written, let's make it look like the rest of the pages on your website!

### Nesting Layouts

You already have a `BaseLayout.astro` for defining the overall layout of your pages. 

`MarkdownPostLayout.astro` gives you some additional templating for common post content such as `title` and `date`, but your blog posts don't look like the other pages on your site. You can fix that with **nested layouts**.


1. Import `BaseLayout` in `src/layouts/MarkdownPostLayout.astro` and use it to wrap the entire template content:
```diff
---
// src/layouts/MarkdownPostLayout.astro

+ import BaseLayout from './BaseLayout.astro';
const { content } = Astro.props;
---
+ <BaseLayout>
    <h1>{content.title}</h1>
    <p>{content.pubDate.slice(0,10)}</p>
    <p><em>{content.description}</em></p>
    <p>Written by: {content.author}</p>
    <img src={content.postImage} width="300" />
    <slot />
    <p><a href="/">Home</a></p>
+ </BaseLayout>
```

2. Check your browser preview at `localhost:3000/posts/post-1`. Now you should see content rendered by:

    - Your main page layout, including your styles, navigation links and social footer.
    - Your blog post layout, including frontmatter properties like the description, date, title and image
    - Your individual blog post Markdown content, including just the text written in this post
    
3. Make any adjustments to your `MarkdownLayout.astro` necessary to ensure that the same content is not being rendered in two places.

Notice that your page title is now displayed twice, once by each layout. And, now that you have navigation links at the top of your page, you no longer need the link back to your home page at the bottom of your blog post layout. 

Remove these unnecessary lines from `MarkdownPostLayout.astro`:

```diff
// src/layouts/MarkdownPostLayout.astro

<BaseLayout>
-   <h1>{content.title}</h1>
    <p>{content.pubDate.slice(0,10)}</p>
    <p><em>{content.description}</em></p>
    <p>Written by: {content.author}</p>
    <img src={content.postImage} width="300" />
    <slot />
-   <p><a href="/">Home</a></p>
</BaseLayout>
```

Check your browser preview again at `localhost:3000/posts/post-1` and verify that this link is no longer displayed and that your title is only displayed once. Make any other adjustments necessary to ensure that you do not have any duplicated content.

### Linking to your posts

In order to see your blog post, you have been navigating directly to the URL by typing `localhost:3000/posts/post-1`, which isn't very convenient.

The Blog page will be used to add links to individual blog posts (including new ones you will create).

1. Add the following links inside the component template `src/pages/blog.astro`
```diff
---
// src/pages/blog.astro

import BaseLayout from '../layouts/BaseLayout.astro'
title = "My Astro Learning Blog"
---
<BaseLayout title={title}>
    <p>This is where I will post about my journey learning Astro.</p>
+    <ul>
+        <li><a href="/posts/post-1/">Post 1</a></li>
+        <li><a href="/posts/post-2/">Post 2</a></li>
+        <li><a href="/posts/post-3/">Post 3</a></li>
+    </ul>
</BaseLayout>
```
2. Now, add two more files in `src/posts/`: `post-2.md` and `post-3.md`. Here is some sample code you can copy and paste into your files, or, you can create your own!
```
---
// src/pages/posts/post-2.md

layout: ../../layouts/MarkdownPostLayout.astro
title: My Second Blog Post
author: Astro Learner
description: "After learning some Astro, I couldn't stop!"
image: 
    url: "https://astro.build/assets/blog/astro-showcase/astro-showcase-screenshot.jpg"
    alt: "Thumbnails of websites from the Astro Showcase site."
pubDate: 2022-07-08
tags: ["astro", "blogging", "learning in public","successes"]
---
After a successful first week learning Astro, I decided to try some more. I wrote and imported a small component from memory!
```
```
---
// src/pages/posts/post-3.md

layout: ../../layouts/MarkdownPostLayout.astro
title: My Third Blog Post
author: Astro Learner
description: "I had some challenges, but asking in the community really helped!"
image: 
    url: "https://astro.build/assets/blog/community-day/cover.jpg"
    alt: "The word community with a heart."
pubDate: 2022-07-15
tags: ["astro", "learning in public", "setbacks", "community"]
---
It wasn't always smooth sailing, but I'm enjoying building with Astro. And, the [Discord community](https://astro.build/chat) is really friendly and helpful!
```

3. Check your browser preview and make sure:

- All your links for Post 1, Post 2 and Post 3 lead to a working page on your site. (If you find a mistake, check your links on `blog.astro` or your Markdown file names!)

- Each blog post shows the same page template, and no content is missing. (If one of your blog posts is missing content, check its frontmatter properties!)

- No content is duplicated on a page. (If something is being rendered twice, then be sure to remove it from `MarkdownPostLayout.astro`.)

If you'd like to customize your page template, you can!

4. Now check your browser preview for each of your six pages (3 Astro pages and 3 Markdown posts). If you look up at the browser tab itself, or inspect the `<title>` property in dev tools, what text is displayed for each page?

Home: ||Home Page||

About: ||About Me||

Blog: ||My Astro Learning Blog||

Post 1: ||Astro||

Post 2: ||Astro||

Post 3: ||Astro||

### Analyze the Pattern

1. Where is the `title` of a Markdown post defined? 

|| _`title` is defined in the frontmatter of the `.md` file_ ||

2. Which file receives that `title` property in a `content` object? 

|| _`title` is passed to the layout defined by the Markdown file, in this case, `MarkdownPostLayout.astro`_ ||

3. Which file determines the metadata `<title>` property located in your page `<head>`? 

|| _`BaseLayout.astro`_ ||

4. How can the `title` property defined in your Markdown frontmatter be passed along so that it eventually ends up available to update the `<title>` tag? 

|| _It needs to be passed as props to the Markdown layout, then passed again to the BaseLayout_ ||

### Passing the `title` prop

1. Update `src/layouts/MarkdownPostLayout.astro` so that it **passes each blog post's title** to `<BaseLayout>` by adding a component attribute:
```astro
// src/layouts/MarkdownPostLayout.astro

<BaseLayout title={content.title}>
```
2. Check your browser preview for all of your blog posts again, and your page metadata should be updated. Either visually confirm the text displayed in your browser tab, or inspect the page and look in the HTML for the `<title>` tag inside your page `<head>`.


### Test your knowledge
Fill in the blanks using the following words or phrases: **`.md`**, **blog**, **component attribute**, **props**, **`BaseLayout`**, **component-based design**, 

Because Astro uses || **component-based design** ||, you can nest one layout inside another and take advantage of working with modular pieces. This is particularly helpful when creating a || **blog** ||, so that a || **`BaseLayout`** || can just concern itself with main page styling, while a `MarkdownPostLayout` can focus on specific templating that is only used for your Markdown posts. 

This means that some values defined in a ||  **`.md`**  ||  file might need to be passed as || **props** ||  through multiple layers of layouts, first to its immediate `layout` inside a `content` object. Then, from there, it can be passed to any other Astro component, including another layout, as a ||   **component attribute**   ||.


### Checklist for moving on

<Checklist key="pages">
- [ ] I can create multiple blog posts, and I can access them all through individual links on my Blog page.
- [ ] I can display the blog post's title in the `<title>` property, which I can see in the browser tab and/or in dev tools.
</Checklist>

### Resources

[Nesting Layouts in Astro](/en/core-concepts/layouts/#nesting-layouts)
