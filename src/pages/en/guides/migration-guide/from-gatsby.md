---
title: Migrating from Gatsby
description: Tips for migrating an existing Gatsby project to Astro
layout: ~/layouts/CMSLayout.astro
stub: false
framework: Gatsby
---

Here are some tips for converting a Gatsby project to Astro. This is not a full, step-by-step walkthrough, but it will guide you through some changes you will have to make. 

(THESE ARE SARAH'S ROUGH NOTES)

## Key Differences

### React App vs MPA 

Gatsby is a React single-page app, and uses `index.js` as your project's root.

Astro is a multi-page site, and `index.astro` is your home page. 

### React components vs Astro components
Gatsby's `.js` or `.jsx` components (including pages and layouts) are exported functions that return page templating.

Astro's `.astro` pages, layouts and components are not written as exported functions. Instead, you'll split your code into a "code fence" and a body exclusively for the HTML you generate.

### Imports and Data Fetching

Gatsby uses GraphQL to retrieve data from your project files. Additionally, Gatsby sites typically use several plugins and packages to read the file system, transform Markdown etc. 

Astro uses ESM imports and a top-level await [`Astro.glob()`]() call to import data from your project files. GraphQL may be optionally be added to your project, but is not included by default. Astro has some external packages and integrations, but many core features are built-in and available from the API. 

## Key Similarities

- The syntax of `.astro` files is similar to JSX. Writing Astro should feel familiar.

- Astro is component-based. 

- Astro has built-in support for Markdown, and official integrations for using MDX files and React components. Note that in Astro, React files **must** have a `.jsx` or `.tsx` extention.

- Astro has support for installing NPM packages, including several for React. You may be able to keep some or all of your existing React components and dependencies.

## Installing Astro

You can start migrating from Gatsby to Astro in a few ways. Here are two different ways you could choose to get started:
- **Create a new Astro project** using `npm create astro@latest -- --template minimal` to start from scratch, or `npm create astro@latest -- --template blog` for a Markdown/MDX blog structure pre-built. Then, copy your existing Gatsby project files over to your new Astro project. (You may wish to add them in a separate folder outside of `src`, then only copy them in as needed.)

- **Update your existing Gatsby project dependencies** in `package.json`. Remove any Gatsby-related dependencies and follow all the steps to [install Astro manually](/en/install/manual/) in your existing Gatsby project. Make sure you have [these project files](/en/install/manual/#7-next-steps) and that you have a working home page before continuing. (You may wish to do this on a different branch.)

## Configuring your `public/` and build directories

1. **Delete** Gatsby's `public` folder. 
    
    Gatsby uses the `public` directory for its build output, so you can safely discard this folder. You will no longer need a built version of your Gatsby site. (Astro uses `dist/` by default for the build output.)

2. **Rename** Gatsby's `static` folder to `public`, and use it as Astro's `public/` folder. 

    Gatsby uses a directory named `static/`, whereas Astro uses `public/` for these static assets. You can alternatively copy the contents of `static/` into an existing Astro `public/` folder.


## Site Config

Gatsby has several top-level configuration files (`gatsby-config.js`, `gatsby-browser.js`, `gatsby-node.js`, `gasby-ssr.js`) for configuration options, site and page metadata and generating page routes.

In Astro, many of these features are not handled by separate configuration files, and `astro.config.mjs` is used only for configuring your Astro project and any installed integrations, including SSR adapters. 

The contents of `astro.config.mjs` are not available to other files in your project, so you will write `.astro` components or separate data files (e.g. `.js`, `.json`) for storing site metadata to be used in within your project. You have access to every page `<head>` directly, so you can add font sources and stylesheets as needed in individual pages or layout components. Page routing for your blog posts based on GraphQL queries defined in `gatsby-node.js` is replaced with Astro's built-in, automatic file-based routing for files located within `src/pages/`.

Your Astro project will not use any of these `gatsby-` files, but there may be some content that you can reuse:

- `gatsby-config.js`: Move your `siteMetadata: {}` into `src/data/siteMetadata.js` (or `siteMetadata.json`) to import data about your site (title, description, social accounts etc.) into page layouts.

- `gatsby-browser.js`: Consider adding anything used here directly into your main layout's `<head>` tag.

- `gatsby-node.js`: You will not need to create your own nodes in Astro, but viewing the schema in this file may help you with defining types in your Astro project.

- `gatsby-ssr.js`: If you choose to use SSR in Astro, you will add and configure the adapter of your choice directly in `astro.config.mjs`.


## Migrating Pages and Posts

In Gatsby, your pages and posts may exist in `src/pages/` or outside of `src` in another folder, like `content`.

In Astro, **your pages should live within `src/pages/`**. Astro's file-based routing will create a page for each file located in `pages` or any subdirectory. Only `.astro`, `.md` (or `.mdx` after installing the MDX integration) files here will create page routes. Your `js` pages will need to be [converted from JSX files to `astro` pages](#converting-jsx-files-to-astro-files).

These files will create page routes based on the file path and name. For example, `src/pages/posts/first-post.md` will create a page at the URL `www.my-domain.com/posts/first-post/`. 

:::note
Either of these files will create a page at `www.my-domain.com/about/`:

- `/src/pages/about.astro|.md|.mdx`
- `/src/pages/about/index.astro|.md|.mdx`
:::

You can use project folders with file-based routing to create your desired URLs. Or, you can use Astro's [dynamic routing](/en/core-concepts/routing/#dynamic-routes) for more control over page slugs that do not need to correspond exactly to your folder structure. [MAYBE USE THIS AS AN EXAMPLE https://github.com/Charca/astro-blog-template/blob/main/src/pages/blog/%5Bslug%5D.astro]

With dynamic routing, your posts may even exist outside of `src/pages/` but they should still be kept within your project source folder (e.g. `src/posts`) so that the dynamic page file (e.g. `src/pages/blog/[slug].astro` can import their data.)

## Converting Syntax

### Gatsby Links

Convert any Gatsby `<Link to="">`, `<NavLink>` etc. components to HTML `<a href="">` tags.

### Relative Imports

Astro requires file imports to reference relative file paths exactly. This can be done using [import aliases](/en/guides/typescript/#import-aliases), or by writing out a relative path in full (e.g. `../../layouts/Layout.astro`)

### Children props

Convert any instances of `{children}` to an Astro `<slot />`

### Style Objects

Convert any inline style objects (`style = {{fontWeight: "bold", }}`) to inline HTML style attributes (`style="font-weight:bold;"`). Or, use an Astro `<style>` tag for scoped CSS styles.

### Code Comments

An Astro file uses JavaScript code comments in the frontmatter `//` but HTML code comments in the template body. (`<!-- -->`)

## Images 

### Gatsby Image Plugin

talk about using the integration here

### Images in Markdown

Gatsby allows you reference images in your project source using standard Markdown syntax (`![](./)`). In Astro, only images in your `public/` folder are available. To continue using local images in Markdown:

1. Move your images into your `public/` folder.
2. Update your Markdown image references by removing the `.` to reference them by their relative URL path (e.g. `![alt text](/images/space.jpg)`) instead of a relative file path.

## Data Fetching

Astro does not use GraphQL to query for data from files in your project. You will need to remove all references to GraphQL queries, and instead use [`Astro.glob()`](/en/guides/imports/#astroglob) for accessing data about your files.


## SEO

Mention the external package here

## Migrating Layout Files

In Gatsby, your main layout (`layout.js`) is normally located in `src/components/` or a dedicated layouts folder, and you may have further `.js` layout files in `src/templates`.

In Astro, you would normally create `src/layouts/` for any layout files, but this is not required. You can copy any existing layouts and templates into this folder, then [convert them to Astro components](#converting-jsx-files-to-astro-files).


## Converting JSX files to `.astro` files

To convert a Gatsby `.js` component into a `.astro` component, you will:

1. Use only the `return()` of the existing function as your HTML template.

2. Change any Gatsby or JSX syntax to Astro (e.g. `<Link to="">`, `{children}`, `className`, inline style objects) or HTML web standards.

3. Move any necessary JavaScript, including props and imports, into a "code fence" (`---`) or into the template itself. Note that some previously imported components may need to be converted to Astro!

4. Ensure that all props are written as Astro imported properties, and do not use GraphQL syntax.

### Do a small, contrived example here

Include

- a Header or Footer component
- an imported React package



## Examples from Gatsby's Blog Starter

Here are some example of converting files from Gatsby's Blog Starter into their corresponding Astro files.

### Convert Gatsby layout.js to Astro

Convert the main page layout (`layout.js`) to `src/layouts/Layout.astro` which receives props from pages on your site.

#### Identify the return()

```jsx ins={24-32} title="layout.js"
import * as React from "react"
import { Link } from "gatsby"

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
        <a href="https://www.gatsbyjs.com">Gatsby</a>
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
- `Gatsby` becomes `Astro` 🚀

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

To conditionally render a header based on props in Astro, we need to first provide the props via `Astro.props`. Then, we can use a ternary operator to show one heading if this is the home page, and a different heading otherwise. Now, we no longer need variables for `{header}` and `{isRootPath}`. Remember to replace Gatsby's `<Link/>` tags with `<a>` anchor tags, and use `class` instead of `className`. Import a local stylesheet from your project for the class names to take effect.

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

### Gatsby blog-post.js layout to Astro

Gatsby's Blog Post layout receives props from Markdown or MDX files. Here's how that translates to Astro, with built-in support for specifying a layout right in your frontmatter, then accessing these values in a `frontmatter` object.

Like in the previous example:
1. Identify the return().
2. Convert JSX to Astro by replacing Gatsby or React syntax with Astro/HTML syntax.
3. Add any needed JavaScript, props, imports.


```jsx title="src/templates/blog-post.js" {15-34}
import * as React from "react"
import { Link, graphql } from "gatsby"

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
Start building your `BlogPost.layout` component using only the return value of the Gatsby function. Convert any Gatsby or React syntax to Astro, including changing the case of any [HTML global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes).

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
With Astro's React integration installed, you can bring many of your Gatsby/React components into an Astro project. But, since Gatsby relies on GraphQL for data fetching, components that access other files in your project should be converted to Astro for compatibility and ease of use.
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
description: 'My first Markdown post written after converting my Gatsby blog to Astro.'
---
# Here is a Markdown post

It uses the layout specified above for page templating.
```

### Convert index.js to Astro

Gatsby's Blog Starter index page displays a list of recent blog posts. Here's how to do that in Astro, replacing a GraphQL query with `Astro.glob`.

Like in the previous examples:
1. Identify the return().
2. Convert JSX to Astro by replacing Gatsby or React syntax with Astro/HTML syntax.
3. Add any needed JavaScript, props, imports.


```jsx title="src/pages/index.js" {26-60}
import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
```

Start building your `index.astro` component using only the return value of the Gatsby function. Convert any Gatsby or React syntax to Astro, including changing the case of any [HTML global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes).

Notice that we:

- Keep the `<Layout />` component (converted in the `layout.js` example) that provides our page shell.

- Replace React's `dangerouslySetInnerHTML` with `<p>{post.frontmatter.description}</p>`  to show a post's description.

- Convert a style object into an HTML style attribute.

```astro title="src/pages/index.astro" del={22-29} ins={30}
<Layout location={location} title={siteTitle}>
  <Bio />
  <ol style="list-style: none;">
    {posts.map(post => {
      const title = post.frontmatter.title || post.fields.slug

      return (
        <li key={post.fields.slug}>
          <article
            class="post-list-item"
            itemscope
            itemtype="http://schema.org/Article"
          >
            <header>
              <h2>
                <a href={post.fields.slug} itemprop="url">
                  <span itemprop="headline">{title}</span>
                </a>
              </h2>
              <small>{post.frontmatter.date}</small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: post.frontmatter.description || post.excerpt,
                }}
                itemProp="description"
              />
            </section>
            <p>{post.frontmatter.description}</p>
          </article>
        </li>
      )
    })}
  </ol>
</Layout>
```

Identify the imports we need to produce this template, and add these to the frontmatter. 

(Note that for this example to work, you will also have to convert `src/components.bio.js` to an Astro component. Additionally, you will have to update `src/layouts/Layout.astro` to receive any new props for the `<SEO>` component, which will be rendered in there, inside `<head>`.)

```astro title="src/layouts/index.astro"
---
import Bio from "../components/Bio.astro";
import Layout from "../layouts/Layout.astro";

const posts = await Astro.glob('../pages/post/*.md'); 
---
```
:::tip
With Astro's React integration installed, you can bring many of your Gatsby/React components into an Astro project. But, since Gatsby relies on GraphQL for data fetching, components that access other files in your project should be converted to Astro for compatibility and ease of use.
:::


Replace the data used in your template with the appropriate frontmatter variables and [properties exported by Markdown files](/en/guides/markdown-content/#exported-properties).

```astro title="src/pages/index.astro"
---
import Bio from "../components/Bio.astro";
import Layout from "../layouts/Layout.astro";

const posts = await Astro.glob('../pages/posts/*.md'); 
const pathName = Astro.url.pathname
const siteTitle = "Blog Index"
---
<Layout pathname={pathName} title={siteTitle}>
  <Bio />
  {posts.length === 0 
    ? <p>No blog posts found. Add some markdown posts!</p>

    : <ol style="list-style: none;">
        {posts.map(post => 
            <li>
              <article
                class="post-list-item"
                itemscope
                itemtype="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <a href={post.url} itemprop="url">
                      <span itemprop="headline">{post.frontmatter.title}</span>
                    </a>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <p>{post.frontmatter.description}</p>
              </article>
            </li>
          )
        }
      </ol>
  }
</Layout>
```
### Convert SEO.js to Astro

```jsx
/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Seo = ({ description, title, children }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            social {
              twitter
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:creator"
        content={site.siteMetadata?.social?.twitter || ``}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {children}
    </>
  )
}

export default Seo
```

Here is a comparable Astro SEO component. Notice that it:

- Does not require anything in place of `{children}`. This component would be rendered within the `<head>` of your `<Layout>` component.

- Defines a `siteMetadata` object directly in the frontmatter. However, this could be written in a separate `.js` file and imported here instead.

```astro title="src/components/SEO.astro"
----
const { description, title } = Astro.props

const siteMetadata = {
  title: `Astro Starter Blog`,
  author: {
    name: `Fred K. Schott`,
    summary: `CEO of HTML`,
  },
  description: `A Gatsby starter blog converted to Astro.`,
  siteUrl: `https://astro.build/`,
  social: {
    twitter: `astrodotbuild`,
  },
}
const metaDescription = description || site.siteMetadata.description
const defaultTitle = site.siteMetadata?.title
---
<title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
<meta name="description" content={metaDescription} />
<meta property="og:title" content={title} />
<meta property="og:description" content={metaDescription} />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary" />
<meta
  name="twitter:creator"
  content={site.siteMetadata?.social?.twitter || ``}
/>
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={metaDescription} />
```


## Community Resources 

- Blog Post: [Migrating to Astro was EZ](https://joelhooks.com/migrating-to-astro-was-ez).

- Blog Post: [My Switch from Gatsby to Astro](https://www.joshfinnie.com/blog/my-switch-from-gatsby-to-astro/).
