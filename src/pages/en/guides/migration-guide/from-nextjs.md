---
title: Migrating from Next.js
description: Tips for migrating an existing Next.js project to Astro
layout: ~/layouts/CMSLayout.astro
stub: false
framework: Nextjs
---

Here are some tips for converting a Next.js project to Astro. This is not a full, step-by-step walkthrough, but it will guide you through some changes you will have to make. 

## Key Differences

### React App vs MPA 

Next is a React single-page app, and uses `index.js` as your project's root.

Astro is a multi-page site, and `index.astro` is your home page. 

### React components vs Astro components
Next's `.js` or `.jsx` components (including pages and layouts) are exported functions that return page templating.

Astro's `.astro` pages, layouts and components are not written as exported functions. Instead, you'll split your code into a "code fence" and a body exclusively for the HTML you generate.

### Project `src/` folder

Astro uses a `src/` folder at the root of your project to contain all your source code files, and a `public/` folder for non-code assets such as fonts and images.

Next places all folders at the root of your project, and `public/` exists alongside your code folders.

## Key Similarities

- The syntax of `.astro` files is similar to JSX. Writing Astro should feel familiar.

- Astro is component-based. 

- Astro uses a `pages` folder for file-based routing, and allows a page to create dynamic routes. Astro projects can also be SSG or SSR. (Support for per-page is planned.)

- Astro has support for installing NPM packages, including several for React. You may be able to keep some or all of your existing React components and dependencies.

## Switch to Astro

You can start migrating from Next to Astro in a few ways. Here are two different ways you could choose to get started:
- **Create a new Astro project** using `npm create astro@latest -- --template minimal` to start from scratch, or `npm create astro@latest -- --template blog` for a Markdown/MDX blog structure pre-built. Then, copy your existing Next project files over to your new Astro project. (You may wish to add them in a separate folder outside of `src`, then only copy them in as needed.)

- **Update your existing Next project dependencies** in `package.json`. Remove any Next-related dependencies and follow all the steps to [install Astro manually](/en/install/manual/) in your existing Next project. Make sure you have [these project files](/en/install/manual/#7-next-steps) and that you have a working home page before continuing. (You may wish to do this on a different branch.)

### Put your source code in `src`

1. **Keep** Next's `public` folder untouched. 
    
    Astro uses the `public` directory for static assests, just like Next. There is no change needed to this folder, nor its contents.

2. **Copy or Move** Next's other files and folders (e.g. `pages`, `styles` etc.) into Astro's `src/` folder.

    Like Next, Astro's `src/pages` folder is a special folder used for file-based routing. All other folders are optional, and you can organize the contents of your `src/` folder any way you like. Common other folders in Astro projects include `src/layouts/`, `src/components`, `src/styles`, `src/scripts`, and for file-based routing of blog posts, Markdown or MDX files are contained within `pages`, for example `src/pages/posts/` or `src/pages/blog/` depending on the desired URL.


### Repurpose config file

Astro, like Next, has a configuration file at the rout of your project. This is used only for configuring your Astro project and any installed integrations, including SSR adapters. 

And, like Next, the contents of `astro.config.mjs` are not available to other files in your project, so you will write an `.astro` component or separate data file (e.g. `.js`, `.json`) inside `src` for storing site metadata to be used in within your project. 

## Migrating Next Files to Astro

You may find it helpful to start by converting your Next layouts and templates into Astro layout components. Each page in your Astro project requires its own page shell to produce a full HTML document. Astro projects typically use a base layout on every page which renders `<html>`, `<head>` and `<body>` tags. In order to be able to bring existing pages and posts from your Next site, you will need an Astro layout component that provides this. Other layout components (e.g. blog post template) and components (e.g. SEO component) can be combined with this base layout.


### Converting JSX files to `.astro` files

Here are some common actions you will perform when you convert a Next `.js` component into a `.astro` component:

1. Use only the `return()` of the existing Next component function as your HTML template.

2. Change any [Next or JSX syntax to Astro](#convert-syntax-to-astro) (e.g. `<Link>`, `<Script>`, `{children}`, `className`, inline style objects) or to HTML web standards.

3. Move any necessary JavaScript, including import statements, into a "code fence" (`---`). You will need to write an `Astro.props` statement to access any additional props that were previously passed to your Next function. Note that some imported components may need to be converted to Astro themselves, too. Other imported Next components may no longer required an import statement when rewritten as Astro (e.g. `<Script />`) JavaScript used to conditionally render content is often written inside the HTML template directly. 

4. Use import and `Astro.glob()` statements to query your local files instead of Next's data fetching functions such as`getStaticProps()`. Update any dynamic HTML content from your files to use Astro-specific properties.

#### Example: JSX to Astro

Compare the following Next component and a corresponding Astro component:

```jsx title="component.jsx"

Next component exampe here

```

See more [examples from Next's starter templates converted step-by-step](#examples-from-Nextjs).

### Migrating Layout Files

In Next, your main layout (`layout.js`) is normally located in `src/components/`.

In Astro, you would normally create a dedicated `src/layouts/` to store any layout files, but this is not required. You can copy any existing layouts and templates into this folder, then [convert them to Astro components](#converting-jsx-files-to-astro-files).

For a base layout component, remember that your HTML must include a full page shell (`<html>`, `<head>` and `<body>` tags) and a `<slot/>` instead of React's `{children}` prop. Your Next `layout.js` will not include these. Next provides a built-in `<Head>` component through its API, but in Astro, you will write your `<head>` content yourself. You may, however, choose to create an Astro component for common `head` content, and import it into your main layout.

As a starting point, you can use the following code to provide these extra page elements around an existing Next layout file. You may also wish to reuse code from Next's `src/components/seo.js` to include additional site metadata. You can enter your site data manually, import it from a file in your project `src`, or even create an Astro SEO component that provides your layout with `<meta>` amd `<link>` tags.

```astro title="src/layouts/Layout.astro"
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<slot />
	</body>
</html>
```

### Migrating Pages and Posts

In Next, your pages and posts existed in two separate folders at the root of your project.

In Astro, **your `pages/` folder becomes `src/pages/`**. Move Next's existing `posts` folder into `src/pages/` and Astro's file-based routing will create a page route for each `.astro`, `.md` (or `.mdx` after installing the MDX integration) file. Your existing Next JSX (`.js`) pages will need to be [converted from JSX files to `astro` pages](#converting-jsx-files-to-astro-files), but any Markdown and MDX files will be valid pages. Note that Astro provides a special `layout` frontmatter property for Markdown and MDX for styling that you may wish to add.

These files will create page routes based on the file path and name. For example, `src/pages/posts/first-post.md` will create a page at the URL `www.my-domain.com/posts/first-post/`. 

:::note
Either of these files will create a page at `www.my-domain.com/about/`:

- `/src/pages/about.astro|.md|.mdx`
- `/src/pages/about/index.astro|.md|.mdx`
:::

You can use project folders with file-based routing to create your desired URLs. Or, you can use Astro's [dynamic routing](/en/core-concepts/routing/#dynamic-routes) for more control over page slugs that do not need to correspond exactly to your folder structure.

With dynamic routing, your Markdown posts may even exist outside of `src/pages/` but they should still be kept within your project source folder (e.g. `src/posts/`) so that the dynamic page file (e.g. `src/pages/blog/[slug].astro` can import their data.)

## Convert Syntax to Astro

### Next Links to Astro

Convert any Next `<Link to="">`, `<NavLink>` etc. components to HTML `<a href="">` tags. 

Astro does not use any special component for links, although you are welcome to build custom link components. You can then import and use this `<Link>` just as you would any other component.

```astro title="src/components/Link.astro"
---
const { to } = Astro.props
---
<a href={to}><slot /></a>
```

### Next Imports to Astro

Astro requires file imports to reference relative file paths exactly. This can be done using [import aliases](/en/guides/typescript/#import-aliases), or by writing out a relative path in full (e.g. `../../layouts/Layout.astro`). Note that `.astro` and several other file types must be imported with their full file extension.

### Next Children Props to Astro

Convert any instances of `{children}` to an Astro `<slot />`. Astro does not need to receive `{children}` as a function prop and will automatically render child content in a `<slot />`. 

To access specific attributes passed to your component (e.g. `<Layout title="About Me"/>`), use `Astro.props`.

### Next Data Fetching to Astro

Astro uses `Astro.glob()` and ESM import statements to access data from other files in your project source. These data requests are done in the Astro frontmatter of the Astro component using the data.

### Next Styling to Astro

Convert any inline style objects (`style = {{fontWeight: "bold", }}`) to inline HTML style attributes (`style="font-weight:bold;"`). Or, use an Astro `<style>` tag (no import required) for scoped CSS styles. 

Next uses a custom `_app.js` for global CSS. In Astro, you will import `.css` files directly into a main layout component to achieve global styles.

### Next Code Comments to Astro

An Astro file uses JavaScript code comments in the frontmatter `//` but HTML code comments in the template body. (`<!-- -->`)

### Next Image Plugin to Astro

Astro provides a native Image integration for optimizing and working with images. This can be installed into an existing Astro project using the command line, and provides an `<Image />` component to finely control the display of a single image and a `<Picture />` component for responsive images in any `.astro` or `.mdx` file. You will need to replace Next's `<Image />` component with one of these two components (and update its required attributes), or with an HTML `<img>` tag. 

Note that Astro's image integration does not include any default configuration for image properties, so each individual image component should contain any necessary attributes directly. Alternatively, you can [create custom Astro image components](/en/guides/images/#setting-default-values) for reusable image defaults.

## Examples from Nextjs

Here are some example of converting files from Next's example templates into their corresponding Astro files.

### STILL GATSBY Convert Next `layout.js` to Astro

Convert the main page layout (`layout.js`) to `src/layouts/Layout.astro` which receives props from pages on your site.

#### Identify the return()

```jsx ins={24-32} title="layout.js"
import * as React from "react"
import { Link } from "Next"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        Home
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.Nextjs.com">Next</a>
      </footer>
    </div>
  )
}

export default Layout
```

Start to build `Layout.astro` using only this `return` value, converting it to Astro syntax (HTML with JSX-like expressions). 

Note that:

- `{new Date().getFullYear()}` just works
- `{children}` becomes `<slot />`
- `className` becomes `class`
- `Next` becomes `Astro` 🚀

```astro title="src/layouts/Layout.astro" "<slot />" "class" "Astro" "astro.build"
<div class="global-wrapper" data-is-root-path={isRootPath}>
  <header class="global-header">{header}</header>
  <main><slot /></main>
  <footer>
    © {new Date().getFullYear()}, Built with
    {` `}
    <a href="https://www.astro.build">Astro</a>
  </footer>
</div>
```

Next, add a page shell so that your layout provides each page with the necessary parts of an HTML document:

```astro title="src/layouts/Layout.astro" ins={1-3,13-14}
<html>
  <head>
    <meta charset="utf-8" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<meta name="viewport" content="width=device-width" />
	<meta name="generator" content={Astro.generator} />
	<title>Astro</title>
  </head>
  <body>
    <div class="global-wrapper" data-is-root-path={isRootPath}>
      <header class="global-header">{header}</header>
      <main><slot /></main>
      <footer>
        &#169; {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.astro.build">Astro</a>
      </footer>
    </div>
  </body>
</html>
```

#### Add any needed JavaScript

You can figure out which JavaScript or JSX you must bring over from `layout.js` by looking for what is required in the `Layout.astro` template: `{isRootPath}` and `{header}`. 

Your Astro templating accesses props through its frontmatter, not passed into a function.

To conditionally render a header based on props in Astro, we need to first provide the props via `Astro.props`. Then, we can use a ternary operator to show one heading if this is the home page, and a different heading otherwise. Now, we no longer need variables for `{header}` and `{isRootPath}`. Remember to replace Next's `<Link/>` tags with `<a>` anchor tags, and use `class` instead of `className`. Import a local stylesheet from your project for the class names to take effect.

```astro title="src/layouts/Layout.astro" {1-2, 8-18}
---
import '../styles/style.css';
const { title, pathname } = Astro.props
---
<html>
  <head>
    <meta charset="utf-8" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<meta name="viewport" content="width=device-width" />
	<meta name="generator" content={Astro.generator} />
	<title>Astro</title>
  </head>
  <body>
    <div class="global-wrapper">
      <header class="global-header">
        { pathname === "/" 
         ? 
           <h1 class="main-heading">
           <a href="/">{title}</a>
           </h1>
         : 
           <h1 class="main-heading">
           <a class="header-link-home" href="/">Home</a>
           </h1>
        }  
      </header>
      <main><slot /></main>
      <footer>
        &#169; {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.astro.build">Astro</a>
      </footer>
    </div>
  </body>
</html>
```

Update `index.astro` to use this new layout and pass it the necessary `title` and `pathname` props:

``` astro title="src/pages/index.astro"
---
import BaseLayout from '../layouts/BaseLayout.astro';
const pagePathname = Astro.url.pathname
---
<BaseLayout title="Home Page" pathname={pagePathname}>
    <p>Astro</p>
</BaseLayout>
```

To test the conditional header, create a second page, `about.astro` using the same pattern:

``` astro title="src/pages/about.astro"
---
import BaseLayout from '../layouts/BaseLayout.astro';
const pagePathname = Astro.url.pathname
---
<BaseLayout title="About" pathname={pagePathname}>
    <p>About</p>
</BaseLayout>
```

### STILL GATSBY Convert Next `blog-post.js` to Astro

Next's Blog Post layout receives props from Markdown or MDX files. Here's how that translates to Astro, with built-in support for specifying a layout right in your frontmatter, then accessing these values in a `frontmatter` object.

Like in the previous example:
1. Identify the return().
2. Convert JSX to Astro by replacing Next or React syntax with Astro/HTML syntax.
3. Add any needed JavaScript, props, imports.


```jsx title="src/templates/blog-post.js" {15-34}
import * as React from "react"
import { Link, graphql } from "Next"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({
  data: { site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
```
Start building your `BlogPost.layout` component using only the return value of the Next function. Convert any Next or React syntax to Astro, including changing the case of any [HTML global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes).

Notice that we:

- Keep the `<Layout />` component (converted in the previous example) that provides our page shell.

- Replace React's `dangerouslySetInnerHTML` with a `<slot />` for our blog post's Markdown content.

- Can choose to pass props for SEO through to our base layout, but do not render that component here.

```astro title="src/layouts/BlogPost.layout" del={11-14} ins={15} "description={description}"
<Layout location={location} title={siteTitle} description={description}>
  <article
  class="blog-post"
  itemscope
  itemtype="http://schema.org/Article"
  >
    <header>
        <h1 itemprop="headline">{post.frontmatter.title}</h1>
        <p>{post.frontmatter.date}</p>
    </header>
    <section
        dangerouslySetInnerHTML={{ __html: post.html }}
        itemprop="articleBody"
    />
    <slot />
    <hr />
    <footer>
        <Bio />
    </footer>
  </article>
</Layout>
```

Identify the imports and props we need to produce this template, and add these to the frontmatter. 

(Note that for this example to work, you will also have to convert `src/components.bio.js` to an Astro component. Additionally, you will have to update `src/layouts/Layout.astro` to receive a `description` as props, and to render the `<SEO>` component there, inside `<head>`.)

```astro title="src/layouts/BlogPost.layout"
---
import Bio from "../components/Bio.astro";
import Layout from "../layouts/Layout.astro";

const { frontmatter } = Astro.props
---
```
:::tip
With Astro's React integration installed, you can bring many of your Next/React components into an Astro project. But, since Next relies on GraphQL for data fetching, components that access other files in your project should be converted to Astro for compatibility and ease of use.
:::

Replace the props used in your template with the appropriate [properties exported to a Markdown layout](/en/core-concepts/layouts/#markdown-layout-props).

```astro title="src/layouts/BlogPost.layout" "frontmatter"
---
import Bio from "../components/Bio.astro";
import Layout from "../layouts/Layout.astro";

const { frontmatter } = Astro.props
---
<Layout pathname={frontmatter.url} title={frontmatter.title} description={frontmatter.description}>
  <article
  class="blog-post"
  itemscope
  itemtype="http://schema.org/Article"
  >
    <header>
        <h1 itemprop="headline">{frontmatter.title}</h1>
        <p>{frontmatter.date}</p>
    </header>
    <slot />
    <hr />
    <footer>
        <Bio />
    </footer>
  </article>
</Layout>
```

Now, you can use this layout as a frontmatter property in any Markdown or MDX file.

```markdown title="src/pages/posts/my-post.md"
---
layout: '../../layouts/BlogPostLayout.astro'
title: 'My Markdown Post'
date: 2022-11-25
description: 'My first Markdown post written after converting my Next blog to Astro.'
---
# Here is a Markdown post

It uses the layout specified above for page templating.
```

### Convert Next `index.js` to Astro

Here is a Next's index page that displays a list of recent blog posts. Here's how to do that in Astro, replacing `getStaticProps()` functionality with `Astro.glob()`.

Like in the previous examples:
1. Identify the return().
2. Convert JSX to Astro by replacing Next or React syntax with Astro/HTML syntax.
3. Add any needed JavaScript, props, imports.


```jsx title="pages/index.js" {10-35}
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
```

Start building your `index.astro` component using only the return value of the Next function. Convert any Next or React syntax to Astro, including changing the case of any [HTML global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes).

Notice that we:

- Keep the `<Layout />` component (converted in the `layout.js` example) that provides our page shell.

- Remove the `<Head>` component since our layout takes care of that.

- Convert `<Link>` to `<a>`

- Convert CSS classes to HTML syntax.

```astro title="src/pages/index.astro" 
<Layout home>
  <section class="headingMd">
    <p>[Your Self Introduction]</p>
    <p>
      (This is a sample website - you’ll be building a site like this in{' '}
      <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
    </p>
  </section>
  <section class="headingMd padding1px">
    <h2 class="headingLg">Blog</h2>
    <ul class="list">
      {allPostsData.map((post) => (
        <li class="listItem" key={post.id}>
          <a href={`/posts/${post.id}`}>{post.title}</a>
          <br />
          <small class="lightText">
            <Date dateString={post.date} />
          </small>
        </li>
      ))}
    </ul>
  </section>
</Layout>
```

Identify the imports we need to produce this template, and add these to the frontmatter. 

(Note that for this example to work, you will also have to convert `src/components/date.js` to an Astro component. (Or, install Astro's `@astrojs/react` integration and use the component as is.) 

```astro title="src/layouts/index.astro"
---
import Layout from "../layouts/Layout.astro";
import Date from '../components/Date.astro';
const allPostsData = await Astro.glob('../pages/post/*.md'); 
---
```
:::tip
With Astro's React integration installed, you can bring many of your Next/React components directly into an Astro project. But, components that only need to run on the server, at build time should be converted to Astro for optimal performance.
:::


Replace the data used in your template with the appropriate frontmatter variables and [properties exported by Markdown files](/en/guides/markdown-content/#exported-properties).

```astro title="src/pages/index.astro"
---
import Layout from "../layouts/Layout.astro";
import Date from '../components/Date.astro';
const allPostsData = await Astro.glob('../pages/post/*.md'); 
---
<Layout home>
  <section class="headingMd">
    <p>[Your Introduction]</p>
    <p>
      (This is a sample website.)
    </p>
  </section>
  <section class="headingMd padding1px">
    <h2 class="headingLg">Blog</h2>
    <ul class="list">
      {allPostsData.map((post) => (
        <li class="listItem" key={post.id}>
          <a href={`/posts/${post.id}`}>{post.title}</a>
          <br />
          <small class="lightText">
            <Date dateString={post.date} />
          </small>
        </li>
      ))}
    </ul>
  </section>
</Layout>
```

## Community Resources 

- Video: [NextJS to Astro: more control = faster sites](https://www.youtube.com/watch?v=PSzCtdM20Fc).
