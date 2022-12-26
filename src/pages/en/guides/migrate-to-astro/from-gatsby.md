---
title: Migrating from Gatsby
description: Tips for migrating an existing Gatsby project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: false
framework: Gatsby
setup: |
  import AstroJSXTabs from '~/components/tabs/AstroJSXTabs.astro'
  import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
---

After following the guidance on this page, you probably won't have your new Astro site exactly the way you want it yet.

But, this guide gives you some key concepts and migration strategies to help you get started. Use the rest of our docs and our [Discord community](https://astro.build/chat) to keep going!

## Key Similarities between Gatsby and Astro

Gatsby and Astro share some similarities that will help you migrate your project:

- The syntax of `.astro` files is similar to JSX. Writing Astro should feel familiar.

- Astro has built-in support for Markdown and an integration for using MDX files. Both Gatsby and Astro use [Remark](https://remark.js.org/) by default for Markdown manipulation and pre-processing, so you can continue to use many of your existing Remark plugins.

- Astro also has [official integrations for using React components](/en/guides/integrations-guide/react/). Note that in Astro, React files **must** have a `.jsx` or `.tsx` extension.

- Astro has support for installing NPM packages, including several for React. You may be able to keep some or all of your existing React components and dependencies.

- Astro projects can also be SSG or SSR. (Support for per-page rendering strategy is planned.)

## Key Differences between Gatsby and Astro

When you rebuild your Gatsby site in Astro, you will notice some important differences:

- [MPA vs SPA](/en/concepts/mpa-vs-spa/): Gatsby is a React single-page app, and uses `index.js` as your project's root. Astro is a multi-page site, and `index.astro` is your home page.

- [Astro components](/en/core-concepts/astro-components/) are not written as exported functions that return page templating. Instead, you'll split your code into a "code fence" and a body exclusively for the HTML you generate.

- [Local file data](/en/guides/imports/): Gatsby uses GraphQL to retrieve data from your project files. Astro uses ESM imports and a top-level await [`Astro.glob()`](/en/guides/imports/#astroglob) call to import data from your project files. GraphQL may be optionally be added to your Astro project, but is not included by default.


## Convert your Project Structure

### Get Started with Astro

- Option 1: **Create a new Astro project** 

  Use `npm create astro@latest` to launch Astro's CLI wizard or choose a community theme from the [Astro Theme Showcase](https://astro.build/themes). 
  
  
  You can also pass a `--template` argument to the `create-astro` command to start from an existing Astro repository on GitHub:

    <PackageManagerTabs>
      <Fragment slot="npm">
      ```shell
      npm create astro -- --template <github-username>/<github-repo>
      ```
      </Fragment>
      <Fragment slot="pnpm">
      ```shell
      pnpm create astro --template <github-username>/<github-repo>
      ```
      </Fragment>
      <Fragment slot="yarn">
      ```shell
      yarn create astro --template <github-username>/<github-repo>
      ```
      </Fragment>
    </PackageManagerTabs>
  
  Then, copy your existing Gatsby project files over to your new Astro project. (You may wish to add them in a separate folder outside of `src`, then only copy them in as needed.)

- Option 2: **Update your existing Gatsby project dependencies**

  Remove any Gatsby-related dependencies in `package.json` and follow all the steps to [install Astro manually](/en/install/manual/) in your existing repository. (You may wish to do this on a different branch.) 
  
  Make sure you have [these project files](/en/install/manual/#7-next-steps) and a working home page before continuing. 

:::tip
Prefer to explore in your browser instead? Visit https://astro.new for a variety of starter templates that can be opened and edited in StackBlitz, CodeSandbox or Gitpod.
:::

### Install integrations (optional)

You may find it useful to install some of [Astro's optional integrations](/en/guides/integrations-guide/) to use while converting your Gatsby project to Astro:

- **@astrojs/react**: to reuse some existing React UI components in your new Astro site, or keep writing with React components.

- **@astrojs/image**: to replace Gatsby's Image plugin with Astro's own image-optimizing components.

- **@astrojs/mdx**: to bring existing MDX files from your Gatsby project, or to use MDX in your new Astro site.

### Change `static/` to `public/`

1. **Delete** Gatsby's `public` folder. 
    
    Gatsby uses the `public` directory for its build output, so you can safely discard this folder. You will no longer need a built version of your Gatsby site. (Astro uses `dist/` by default for the build output.)

2. **Rename** Gatsby's `static` folder to `public`, and use it as Astro's `public/` folder. 

    Gatsby uses a directory named `static/`, whereas Astro uses `public/` for these static assets. You can alternatively copy the contents of `static/` into an existing Astro `public/` folder.


### Repurpose config files

Gatsby has several top-level configuration files for configuration options, site and page metadata and generating page routes. You will not use any of these `gatsby-*.js` files in your Astro project, but there may be some content that you can reuse:

- `gatsby-config.js`: Move your `siteMetadata: {}` into `src/data/siteMetadata.js` (or `siteMetadata.json`) to import data about your site (title, description, social accounts etc.) into page layouts.

- `gatsby-browser.js`: Consider adding anything used here directly into your main layout's `<head>` tag.

- `gatsby-node.js`: You will not need to create your own nodes in Astro, but viewing the schema in this file may help you with defining types in your Astro project.

- `gatsby-ssr.js`: If you choose to use SSR in Astro, you will add and configure the adapter of your choice directly in `astro.config.mjs`.

## Add your existing content files

Astro uses `src/pages` and file-based routing to create your site's pages and posts from `.astro`, `.md` and `.mdx` files.

You will not have to configure any routing behavior for your Astro, Markdown and MDX files.


### Convert JSX files to `.astro` files

Here are some tips for converting a Gatsby `.js` component into a `.astro` component:

1. Use only the `return()` of the existing Gatsby component function as your HTML template.

1. Change any [Gatsby or JSX syntax to Astro](#reference-convert-to-astro-syntax) (e.g. `<Link to="">`, `{children}`, `className`, inline style objects) or to HTML web standards.

1. Move any necessary JavaScript, including import statements, into a "code fence" (`---`). Note: JavaScript to [conditionally render content](/en/core-concepts/astro-components/#dynamic-html) is often written inside the HTML template directly in Astro.

4. Write an `Astro.props` statement to access any additional props that were previously passed to your Gatsby function.

4. Decide whether any imported components also need to be converted to Astro. With the official integration installed, you can [use existing React components in your Astro file](/en/guides/integrations-guide/react/). But, you may want to convert them to Astro, especially if they do not need to be interactive!

4. Remove any GraphQL queries. Instead, use import and `Astro.glob()` statements to query your local files. Update any [dynamic HTML content variables](/en/core-concepts/astro-components/#dynamic-html) to use Astro-specific properties instead.

You can find some [examples of converting code step-by-step](#examples-from-gatsby-blog-starter) at the end of this page.

### Compare: `.jsx` vs `.astro`

Compare the following Gatsby component and a corresponding Astro component:

<AstroJSXTabs>
  <Fragment slot="jsx">
    ```jsx title="component.jsx"
    import * as React from "react"
    import PropTypes from "prop-types"
    import { useStaticQuery, graphql } from "gatsby"

    import Header from "./header"
    import Footer from "./footer"
    import "./layout.css"

    const Component = ({ message, children }) => {
      const data = useStaticQuery(graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `)

      if (message === "denied") {
        return (
            <p>You are not authorized to see this page.</p>
        )
      }

      return (
        <>
          <Header siteTitle={data.site.siteMetadata.title} />
          <div style={{ 
            margin: `0 auto`,
            backgroundColor: `#f4f4f4`, 
            padding: `1em 1.5em`
            }}>{message}</div>  
          <div
            style={{
              margin: `0 auto`,
              maxWidth: 960,
              padding: `1.25rem`,
            }}
          >
            <main>{children}</main>
            </div>
          
          <Footer siteTitle={data.site.siteMetadata} />

        </>
      )
    }

    Component.propTypes = {
      children: PropTypes.node.isRequired,
    }

    export default Component
    ``` 
  </Fragment>

  <Fragment slot="astro">
    ```astro title="component.astro"
    ---
    import Header from "./Header.astro"
    import Footer from "./Footer.astro"
    import "../styles/stylesheet.css"
    import { site } from "../data/siteMetaData.js"
    const { message } = Astro.props
    ---
    {message === "denied"
      ? <p>You are not authorized to see this page.</p>

      : <Header siteTitle={site.title} />
        <div class="banner">{message}</div>  
        <div style="margin: 0 auto; max-width: 960; padding: 1.25rem;">
          <main>
            <slot />
          </main>
        </div>
        <Footer siteTitle={site.title} />
    }

    <style>
      .banner { 
        margin: 0 auto;
        background-color: #f4f4f4; 
        padding: 1em 1.5em;
      }  
    </style>
    ```
  </Fragment>
</AstroJSXTabs>

### Migrating Layout Files

In Astro, your layout must include a full page shell (`<html>`, `<head>` and `<body>` tags) and a `<slot/>` instead of React's `{children}` prop. Your Gatsby `layout.js` and templates will not include these. 

You can use the following code to provide these extra elements around an existing Gatsby layout file, or write your own:

```astro title="src/layouts/Layout.astro"
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

You may also wish to reuse code from Gatsby's `src/components/seo.js` to include additional site metadata.

### Migrating Pages and Posts

In Gatsby, your pages and posts may exist in `src/pages/` or outside of `src` in another folder, like `content`.

In Astro, **your pages should live within `src/pages/`**. You will not have to configure any routing behavior for your Astro, Markdown and MDX files.

Your existing Gatsby JSX (`.js`) pages will need to be [converted from JSX files to `.astro` pages](#convert-jsx-files-to-astro-files). Your existing Markdown and MDX files can also exist here as pages, but may require some adjustments to their frontmatter, such as adding [Astro's special `layout` frontmatter property](/en/core-concepts/layouts/#markdownmdx-layouts).

### Migrating Tests

As Astro outputs raw HTML, it is possible to write end-to-end tests using the output of the build step. Any end-to-end tests written previously might work out-of-the-box, if you have been able to match the markup of the older Gatsby site.

See Astro's [testing guide](/en/guides/testing/) for more.


## Reference: Convert to Astro Syntax

The following are some examples of Gatsby-specific syntax that you will need to convert to Astro. See more [differences between Astro and JSX](/en/core-concepts/astro-components/#differences-between-astro-and-jsx) in the guide to writing Astro components.

### Gatsby Links to Astro

Convert any Gatsby `<Link to="">`, `<NavLink>` etc. components to HTML `<a href="">` tags. 

Astro does not use any special component for links, although you are welcome to build custom link components. You can then import and use this `<Link>` just as you would any other component.

```astro title="src/components/Link.astro"
---
const { to } = Astro.props
---
<a href={to}><slot /></a>
```

### Gatsby Imports to Astro

Astro requires file imports to reference relative file paths exactly. This can be done using [import aliases](/en/guides/typescript/#import-aliases), or by writing out a relative path in full (e.g. `../../layouts/Layout.astro`). Note that `.astro` and several other file types must be imported with their full file extension.

### Gatsby Children Props to Astro

Convert any instances of `{children}` to an Astro `<slot />`. Astro does not need to receive `{children}` as a function prop and will automatically render child content in a `<slot />`. 

To access specific attributes passed to your component (e.g. `<Layout title="About Me"/>`), use `Astro.props`.

### Gatsby Styling to Astro

Convert any inline style objects (`style = {{fontWeight: "bold", }}`) to inline HTML style attributes (`style="font-weight:bold;"`). Or, use an Astro `<style>` tag for scoped CSS styles.

Global styling is achieved in Gatsby using CSS imports in `gatsby-browser.js`. In Astro, you will import `.css` files directly into a main layout component to achieve global styles.

### Gatsby Image Plugin to Astro

You will need to replace Gatsby's `<StaticImage />` and `<GatsbyImage />` components with [Astro's own image integration components](/en/guides/images/#astros-image-integration), or with a standard HTML `<img>` tag.

To continue using local images in Markdown using standard Markdown syntax (`![]()`), move your images into your `public/` folder. You may need to update the link to the relative URL.

You can learn more about [using images in Astro](/en/guides/images/) in the Images Guide.

### Gatsby GraphQL to Astro

Astro does not use GraphQL to query for data from files in your project. You will need to remove all references to GraphQL queries, and instead use [`Astro.glob()`](/en/guides/imports/#astroglob) for accessing data from your local files.

## Examples from Gatsby Blog Starter

Here are examples of three files from Gatsby's Blog Starter converted to Astro.

This does not convert the entire project, but shows how you could rewrite these individual files in `.astro`.

### Convert Gatsby `layout.js` to Astro

This example converts the main project layout (`layout.js`) to `src/layouts/Layout.astro`.

1. Identify the return()

  ```jsx {21-29} title="layout.js"
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

2. Create `Layout.astro` and add this `return` value, [converted to Astro syntax](#reference-convert-to-astro-syntax). 

  Note that:

  - `{new Date().getFullYear()}` just works 🎉
  - `{children}` becomes `<slot />` 🦥
  - `className` becomes `class` 📛
  - `Gatsby` becomes `Astro` 🚀

  ```astro title="src/layouts/Layout.astro" "<slot />" "class" "Astro" "astro.build"
  ---
  ---
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

3. add a page shell so that your layout provides each page with the necessary parts of an HTML document:

  ```astro title="src/layouts/Layout.astro" ins={3-10,20-21}
  ---
  ---
  <html>
    <head>
      <meta charset="utf-8" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="viewport" content="width=device-width" />
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

3. Add any needed JavaScript, props, imports.
  
  To conditionally render a header based on the page route and title in Astro:

  - Provide the props via `Astro.props`. (Remember: your Astro templating accesses props from its frontmatter, not passed into a function.) 
  - Use a ternary operator to show one heading if this is the home page, and a different heading otherwise. 
  - Remove variables for `{header}` and `{isRootPath}`, now they are no longer needed.
  - Replace Gatsby's `<Link/>` tags with `<a>` anchor tags.
  - Use `class` instead of `className`. 
  - Import a local stylesheet from your project for the class names to take effect.

  ```astro title="src/layouts/Layout.astro" ins={2-3, 15, 16, 20, 24} "class" "<a"
  ---
  import '../styles/style.css';
  const { title, pathname } = Astro.props
  ---
  <html>
    <head>
      <meta charset="utf-8" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="viewport" content="width=device-width" />
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

4. Update `index.astro` to use this new layout and pass it the necessary `title` and `pathname` props:

  ``` astro title="src/pages/index.astro"
  ---
  import Layout from '../layouts/Layout.astro';
  const pagePathname = Astro.url.pathname
  ---
  <Layout title="Home Page" pathname={pagePathname}>
      <p>Astro</p>
  </Layout>
  ```
  :::tip
  You can [get the current page's path using `Astro.url`](/en/reference/api-reference/#astrourl).
  :::

5. To test the conditional header, create a second page, `about.astro` using the same pattern:

  ``` astro title="src/pages/about.astro"
  ---
  import Layout from '../layouts/Layout.astro';
  const pagePathname = Astro.url.pathname
  ---
  <Layout title="About" pathname={pagePathname}>
      <p>About</p>
  </Layout>
  ```

### Convert Gatsby `blog-post.js` to Astro

This example converts Gatsby's blog post layout (`blog-post.js`) to `src/layouts/BlogPostLayout.astro`.

**[tl/dr]:**
1. Identify the return().
2. Convert JSX to Astro by replacing Gatsby or React syntax with Astro/HTML syntax.
3. Add any needed JavaScript, props, imports.

#### Identify the return()

```jsx title="src/templates/blog-post.js" {12-31}
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
  
#### Create `BlogPostLayout.astro` 

Use the return value of the Gatsby function. Convert any Gatsby or React syntax to Astro, including changing the case of any [HTML global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes).

Note that:

- `<Layout />` just works (if converted in the `layout.js` example).

- `dangerouslySetInnerHTML` becomes a `<slot />` for the blog post's Markdown content.

- The exported head content is replaced by additional SEO props passed to the layout (which is responsible for `<head>`).

```astro title="src/layouts/BlogPost.layout" del={13-16} ins={17} "description={description}"
---
---
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

#### Identify any necessary imports and props

:::note
For this example to work, you will also have to convert `src/components/bio.js` to an Astro component. Additionally, you will have to update `src/layouts/Layout.astro` to receive a `description` as props, and to include the `<SEO>` component inside `<head>`.
:::

```astro title="src/layouts/BlogPostLayout.astro"
---
import Bio from "../components/Bio.astro";
import Layout from "../layouts/Layout.astro";
const { frontmatter } = Astro.props
---
```

Replace the props used in your template with the appropriate [properties exported to a Markdown layout](/en/core-concepts/layouts/#markdown-layout-props).

```astro title="src/layouts/BlogPostLayout.astro" "frontmatter"
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

```markdown title="src/pages/posts/my-post.md" "layout:"
---
layout: '../../layouts/BlogPostLayout.astro'
title: 'My Markdown Post'
date: 2022-11-25
description: 'My first Markdown post written after converting my Gatsby blog to Astro.'
---
# Here is a Markdown post
It uses the layout specified above for page templating.
```

### Convert Gatsby `index.js` to Astro

Gatsby's Blog Starter index page displays a list of recent blog posts. Here's how to do that on `src/pages/index.astro`, replacing a GraphQL query with `Astro.glob()`.

**[tl/dr]:**
1. Identify the return().
2. Convert JSX to Astro by replacing Gatsby or React syntax with Astro/HTML syntax.
3. Add any needed JavaScript, props, imports.


```jsx title="src/pages/index.js" {22-55}
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

#### Create `index.astro`

Use the return value of the Gatsby function. Convert any Gatsby or React syntax to Astro, including changing the case of any [HTML global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes).

Note that:

- `<Layout />` just works (if previously converted in the `layout.js` example).

- `dangerouslySetInnerHTML` becomes `<p>{post.frontmatter.description}</p>`.

- `style={{ }}` objects become HTML `style=""` attributes, or an Astro `<style>` tag.

```astro title="src/pages/index.astro" del={24-31} ins={2, 32}
---
import Layout from '../layouts/Layout.astro'
---
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

#### Add any needed imports, props and JavaScript

:::note
For this example to work, you will also have to convert `src/components/bio.js` to an Astro component. Additionally, you will have to update `src/layouts/Layout.astro` to receive any new props for the `<SEO>` component, which will be rendered inside `<head>`.
:::

To retrieve data from your blog posts, use `Astro.glob()` instead of GraphQL.

```astro title="src/layouts/index.astro"
---
import Bio from "../components/Bio.astro";
import Layout from "../layouts/Layout.astro";
const posts = await Astro.glob('../pages/post/*.md'); 
---
```

Replace the data used in your template with the appropriate frontmatter variables and [properties exported by Markdown files](/en/guides/markdown-content/#exported-properties). Use conditional HTML rendering to keep the message shown when no blog posts exist.

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

## Community Resources 

- Blog Post: [Migrating to Astro was EZ](https://joelhooks.com/migrating-to-astro-was-ez).

- Blog Post: [My Switch from Gatsby to Astro](https://www.joshfinnie.com/blog/my-switch-from-gatsby-to-astro/).

- Blog Post: [Why I moved to Astro from Gatsby](https://dev.to/askrodney/why-i-moved-to-astro-from-gatsby-3fck).

- Blog Post: [Migrating my website from Gatsby to Astro](https://dev.to/flashblaze/migrating-my-website-from-gatsby-to-astro-2ej5).

:::note[have a resource to share?]
If you found (or made!) a helpful video or blog post about converting a Gatsby site to Astro, [edit this page](https://github.com/withastro/docs/blob/main/src/pages/en/guides/migrate-to-astro/from-gatsby.md) and add it here!
:::