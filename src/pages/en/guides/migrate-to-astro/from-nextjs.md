---
title: Migrating from Next.js
description: Tips for migrating an existing Next.js project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: false
framework: Next.js
---

[Next.js](https://nextjs.org) is a framework for building web applications on top of React.

## Key Similarities between Next.js and Astro

Next.js and Astro share some similarities that will help you migrate your project:

- The syntax of `.astro` files is similar to JSX. Writing Astro should feel familiar.
- Astro is component-based. As such, your markup structure will likely align closely before and after your migration.

- Astro uses file-based routing, and [allows specially named pages to create dynamic routes](/en/core-concepts/routing/#dynamic-routes).
- Astro also has [official integrations for using React components](/en/guides/integrations-guide/react/). Note that in Astro, React files **must** have a `.jsx` or `.tsx` extension.
- Astro projects can also be SSG or SSR. (Support for per-page rendering strategy is planned.)
- Astro has support for NPM package usage, including several for React. You may be able to keep some or all of your existing React components and dependencies.

## Key Differences between Next.js and Astro

When you rebuild your Next.js site in Astro, you will notice some important differences:

- [MPA vs SPA](/en/concepts/mpa-vs-spa/): Next.js is a React-based SPA (single-page application). Astro sites are multi-page apps built using `.astro` components, but can also support React, Preact, Vue.js, Svelte, SolidJS, AlpineJS, Lit and raw HTML templating.

- [Astro components](/en/core-concepts/astro-components/) are not written as exported functions that return page templating. Instead, you'll split your code into a "code fence" and a body exclusively for the HTML you generate.

- [Content-focus](/en/concepts/why-astro/): Astro was designed primarily for content-focused sites. An existing Next.js app might be built for high client-side interactivity and may include items that are difficult to replicate in Astro, such as dashboards.


### React App vs MPA

Next.js is a React app, and uses `index.js` as your project's root. While Next.js ships pre-populated HTML to the client regardless of rendering mode (SSR or SSG), it also re-initializes React for all of the content on-screen, including static portions.

Astro is a multi-page site, and `index.astro` is your home page. It generates HTML pages for each configured route but, in contrast to Next.js, only initializes JavaScript on the interactive elements on-screen.

### Page routing

Because of the differences between React apps and Astro MPA apps, you don't need to know any domain-specific knowledge to link between different pages. Instead of Next's custom `<Link href="/path">` component, you'll use the HTML standard `<a href="/path">` tag.

In addition, should you need to access information about the current route within an Astro component, [you're able to use `Astro.url`](/en/reference/api-reference/#astrourl), which exposes a [web-standard `URL` class](https://developer.mozilla.org/en-US/docs/Web/API/URL). This is in contrast to Next.js requiring you to use an `useRouter` hook in page components.

### React components vs Astro components
Next's `.js` or `.jsx` components (including pages and layouts) are exported functions that return page templating.

Astro's `.astro` pages, layouts and components are not written as exported functions. Instead, JavaScript is contained within a "code fence" and the body is exclusively for the HTML you generate.

### Project `src/` folder

Astro uses a `src/` folder at the root of your project to contain all your source code files, and a `public/` folder for non-code assets such as fonts and images.

Next places all folders at the root of your project, and `public/` exists alongside your code folders.

Here are some tips for converting a Next.js project to Astro. This is not a full, step-by-step walkthrough, but it will guide you through some changes you will have to make. 

## Switch from Next.js to Astro

You can start migrating from Next to Astro in a few ways. Here are two different ways you could choose to get started:
- **Create a new Astro project** using `npm create astro@latest -- --template minimal` to start from scratch, or `npm create astro@latest -- --template blog` for a Markdown/MDX blog structure pre-built. Then, copy your existing Next project files over to your new Astro project. (You may wish to add them in a separate folder outside of `src`, then only copy them in as needed.)

- **Update your existing Next project dependencies** in `package.json`. Remove any Next-related dependencies and follow all the steps to [install Astro manually](/en/install/manual/) in your existing Next project. Make sure you have [these project files](/en/install/manual/#7-next-steps) and that you have a working home page before continuing. (You may wish to do this on a different branch.)

### Put your source code in `src`

1. **Keep** Next's `public` folder untouched. 
   
    Astro uses the `public` directory for static assets, just like Next. There is no change needed to this folder, nor its contents.

2. **Copy or Move** Next's other files and folders (e.g. `pages`, `styles` etc.) into Astro's `src/` folder.

    Like Next, Astro's `src/pages` folder is a special folder used for file-based routing. All other folders are optional, and you can organize the contents of your `src/` folder any way you like. Other common folders in Astro projects include `src/layouts/`, `src/components`, `src/styles`, `src/scripts`.


### Repurpose config file

Astro, like Next, [has a configuration file at the root of your project called `astro.config.mjs`](/en/guides/configuring-astro/). This is used only for configuring your Astro project and any installed integrations, including [SSR adapters](/en/guides/deploy/).


### Converting JSX files to `.astro` files

Here are some common actions you will perform when you convert a Next `.js` component into a `.astro` component:

1. Use the returned JSX of the existing Next.js component function as the basis for your HTML template
2. Change any [Next or JSX syntax to Astro](#convert-nextjs-syntax-to-astro) (e.g. `<Link>`, `<Script>`, `{children}`, `className`, inline style objects) or to HTML web standards.
3. Move any necessary JavaScript, including import statements, into a "code fence" (`---`). This includes:
   - Rewriting any Next function props to use `Astro.props`.
   - Converting any imported components to Astro themselves, too.
   - Migrating `getStaticProps` logic out of a function and into the code fence. 
   - Migrate JavaScript used to conditionally render content inside the HTML template directly.

#### Example: JSX to Astro

Compare the following Next component and a corresponding Astro component:

```jsx title="Page.jsx"
import Header from "./header";
import Footer from './footer';
import "./layout.css";

export async function getStaticProps() {
    const res = await fetch('https://api.github.com/repos/withastro/astro')
    const json = await res.json()
    return {
        props: {
            message: json.message,
            stars: json.stargazers_count || 0,
        },
    }
}

const Component = ({
    stars,
    message,
}) => {
    if (message === "Not Found") return (
        <p>The repository you're looking up doesn't exist</p>
    )

    return (
        <>
            <Header />
            <p style={{
                backgroundColor: `#f4f4f4`,
                padding: `1em 1.5em`,
                textAlign: `center`,
                marginBottom: `1em`
            }}>Astro has {stars} 🧑‍🚀</p>
            <Footer />
        </>
    )
}

export default Component;
```

```astro title="Page.astro"
---
import Header from "./header";
import Footer from './footer';
import "./layout.css";

const res = await fetch('https://api.github.com/repos/withastro/astro')
const json = await res.json()
const message = json.message;
const stars = json.stargazers_count || 0;
---

{message === "Not Found" ? 
       <p>The repository you're looking up doesn't exist</p> :
       <>
            <Header />
            <p class="banner">Astro has {stars} 🧑‍🚀</p>
            <Footer />
        </> 
}

<style>
  .banner {
    background-color: #f4f4f4; 
    padding: 1em 1.5em;
    text-align: center;
    margin-bottom: 1em;
  }
<style>
```

See more [examples from Next's starter templates converted step-by-step](#examples-from-nextjs).

### Migrating Layout Files

You may find it helpful to start by converting your Next.js layouts and templates into Astro layout components.

Next.js has two different methods of creating layout files:

- The `pages` directory

- [The `/app` directory (in beta)](https://beta.nextjs.org/docs/routing/pages-and-layouts#layouts)

Each differs from how Astro handles layouts and both require some level of code separation.

Astro consolidates access to the `<html>`, `<head>`, and `<body>` tags by allowing component markup to reflect standard HTML tags:  

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

Because each Astro page explicitly requires these tags to be present, it's common to take this code and place it into a file like `src/layouts/Layout.astro` and reuse it across pages.

#### Migrating from Next.js' `pages` directory

In Next.js' `pages` directory, it's common to have a `_document.jsx` file in order to customize the app's `<head>` contents like so:

```jsx title="pages/_document.jsx"
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

Notice how this code sample requires you to import non-standard React components for `Html`, `Head`, and `Main`. This `_document` component can be migrated to an Astro layout file by replacing these elements with `<html>`, `<head>`, and `<slot>` HTML standard tags, respectively.

You're also able to remove the `NextScript` import entirely, since Astro does not ship JavaScript to the client by default. 

```astro title="src/layouts/Document.astro"
<html lang="en">
	<head>
	    <link rel="icon" href="/favicon.ico" />
	</head>
	<body>
		<slot/>
	</body>
</html>
```

<!-- TODO: Should I mention the Next.js limitation of not putting `Head` subcontents into components? -->

#### Migrating from Next.js' `/app` directory

Next.js' `/app` directory layout files are created with two files: a `layout.jsx` file to customize the `<html>` and `<body>` contents, and a `body.jsx` file to customize the `<head>` element contents.

```jsx title="app/layout.jsx"
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```jsx title="app/head.jsx"
export default function Head() {
  return (
    <>
      <title>My Page</title>
    </>
  );
}
```

In Astro, this is replaced with a single layout file that contains all three:

```astro title="src/layouts/Layout.astro"
<html lang="en">
	<head>
	    <title>My Page</title>
	</head>
	<body>
		<slot/>
	</body>
</html>
```

<!-- TODO: Should I mention the Next.js limitation of not putting `Head` subcontents into components? -->

### Migrating Pages and Posts

In Next.js, your posts either live in `/pages` or `/app/routeName/page.jsx`.

In Astro, **all of your pages live within `/src/pages`**. Your existing Next JSX (`.js`) pages will need to be [converted from JSX files to `astro` pages](#converting-jsx-files-to-astro-files).

One way in which Astro's file-based routing is more feature-rich than Next.js' is its Markdown support. 

Next.js has no built-in support for Markdown, which requires you to manually create pages for each Markdown-generated route. Meanwhile, Astro supports `.md` and `.mdx` ([with an official integration](/en/guides/integrations-guide/mdx/)) as valid files to create routes from.

These files will create page routes based on the file path and name. For example, `src/pages/posts/first-post.md` will create a page at the URL `www.my-domain.com/posts/first-post/`. 

:::note
Either of these files will create a page at `www.my-domain.com/about/`:

- `/src/pages/about.astro|.md|.mdx`
- `/src/pages/about/index.astro|.md|.mdx`
:::

You can use project folders with file-based routing to create your desired URLs. Or, you can use Astro's [dynamic routing](/en/core-concepts/routing/#dynamic-routes) for more control over page slugs that do not need to correspond exactly to your folder structure.

With dynamic routing, your Markdown posts may even exist outside of `src/pages/` but they should still be kept within your project source folder (e.g. `src/posts/`) so that the dynamic page file (e.g. `src/pages/blog/[slug].astro` can import their data.)

## Convert Next.js Syntax to Astro

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

React components that pass multiple sets of children can be migrated to an Astro component using [named slots](/en/core-concepts/astro-components/#named-slots):

```jsx title="pageheader.jsx"
export const PageHeader = ({navItems, children}) => {
	return (
		<header>
			{children}
			<nav>
				<ul>
					<li><Link to="/">Home</a></li>
					{navItems}
				</ul>
			</nav>
		</header>
	)
}
```

```jsx title="app.jsx"
import {PageHeader} from './pageheader';

export const App = () => {
	return (
		// ...
		<PageHeader navItems={<li><Link to="/blog">Blog</a></li>}>
			<Link to="/">CompanyCo</a>
		</PageHeader>
		// ...
	)
}
```

The above component can be reproduced in Astro by using a `slot=""` attribute to pass data to a particular named `<slot />` placeholder component.

```astro title="src/components/PageHeader.astro"
<header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <slot name="navItems"/>
        </ul>
    </nav>
	<slot/>
</header>
```

```astro title="src/components/Component.astro"
---
import PageHeader from './PageHeader.astro';
---

<PageHeader>
	<a href="/">CompanyCo</a>
	<li slot="navItems"><a href="/blog">Blog</a></li>
</PageHeader>

<!-- ... -->
```

See more about [specific `<slot />` usage in Astro](/en/core-concepts/astro-components/#slots) for details.

### Next Data Fetching to Astro

Astro uses `Astro.glob()` and ESM import statements to access data from other files in your project source. These data requests are done in the Astro frontmatter of the Astro component using the data.

<!-- TODO: Add mention of `getStaticProps` -->

### Next Styling to Astro

Styling in both Next and Astro comes in a few different flavors:

- Inline styles
- Component-specific styling
- Global styling

#### Inline Styles

Convert any inline style objects in React (`style={{fontWeight: "bold", }}`) to inline HTML style attributes (`style="font-weight:bold;"`).

```jsx
// JSX
<p style={{fontWeight: "bold"}}>Hello, world</p>
```

```astro
// Astro
<p style="font-weight: bold;">Hello, world</p>
```

#### Component-specific styling

One of Astro's unique capabilities enables you to use standard `<style>` tags for scoped CSS styles.

```astro
<p>Hello, world</p>

<!-- The following will only apply to this component -->
<style>
p {
   font-weight: bold;
}
</style>
```

However, you can extract your styling to a [CSS Module file](/en/guides/imports/#css-modules) and import that instead.

```astro title="src/components/Hello.astro"
---
import styles from './Hello.module.css';
---

<p>Hello, world</p>
```

 ```css title="src/components/Hello.module.css"
p {
   font-weight: bold;
}
 ```

#### Global Styling

Global styling is applied similarly between Next and Astro by importing a `css` file within a layout file.

```astro title="src/layouts/Layout.astro" {2}
---
import "global.css";
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
    <slot/>
  </body>
</html>
```

```css title="src/layouts/global.css"
p {
    font-weight: bold;
}
```

#### CSS Preprocessors

[Astro supports the most popular CSS preprocessors right out of the box](/en/guides/styling/#css-preprocessors) by installing them as a dev dependency.

As an example, to use Sass, you would run:

```shell
npm install -D sass
```

Just like you would when configuring Sass for a NextJS site. After doing so in your Astro site, you're then able to import `.scss` or `.sass` files without modification from your Gatsby site.

### Next Code Comments to Astro

An Astro file uses JavaScript code comments in the frontmatter `//` but HTML code comments in the template body. (`<!-- -->`)

### Next Image Plugin to Astro

Astro provides a native Image integration for optimizing and working with images. This can be installed into an existing Astro project using the command line, and provides an `<Image />` component to finely control the display of a single image and a `<Picture />` component for responsive images in any `.astro` or `.mdx` file. You will need to replace Next's `<Image />` component with one of these two components (and update its required attributes), or with an HTML `<img>` tag. 

Note that Astro's image integration does not include any default configuration for image properties, so each individual image component should contain any necessary attributes directly. Alternatively, you can [create custom Astro image components](/en/guides/images/#setting-default-values) for reusable image defaults.



<!-- TODO: Add mention of https://nextjs.org/docs/api-reference/next/head limitation -->

## Examples from Next.js

Here are some example of converting files from Next's example templates into their corresponding Astro files.

### Convert Next `_document` to Astro

Convert the application layout (`/pages/_document.js`) to `src/layouts/Layout.astro` which receives props from pages on your site.

#### Identify the return

```jsx title="_document.js"
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head lang="en">
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            </Head>
            <body>
                <div className="screen">
                    <div className='screen-contents'>
                        <Main />
                    </div>
                </div>
                <NextScript />
            </body>
        </Html>
    )
}
```

Start to build `Layout.astro` using only this `return` value, converting it to Astro syntax (HTML with JSX-like expressions). 

Note that:

- `<Html>` becomes `<html>`
- `<Head>` becomes `<head>`
- `<Main />` becomes `<slot />`
- `className` becomes `class`
- We do not need `<NextScript>`

```astro title="src/layouts/Layout.astro" "<slot ></pre>" "class" "html" "body"
<html>
    <head lang="en">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    </head>
    <body>
        <div class="screen">
            <div class='screen-contents'>
                <slot />
            </div>
        </div>
    </body>
</html>
```

In addition to the `_document` file, the NextJS application has a `_app.js` file that imports global styling via a CSS import:

```jsx title="pages/_app.js"
import '../styles/index.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

This CSS import can be moved to the Astro Layout component:

```astro ins={0-3} title="src/layouts/Layout.astro" 
---
import '../styles/index.css'
---

<html>
    <head lang="en">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    </head>
    <body>
        <div class="screen">
            <div class='screen-contents'>
                <slot />
            </div>
        </div>
    </body>
</html>
```

### Convert a Next.js `getStaticProps` Page to Astro

This is a page that lists the first 151 Pokémon using [the REST PokéAPI](https://pokeapi.co/).

```jsx title="pages/index.js"
import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/poke-list.module.css';

export default function Home({ pokemons }) {
    return (
        <>
            <Head>
                <title>Pokedex: Generation 1</title>
            </Head>
            <ul className={`plain-list ${styles.pokeList}`}>
                {pokemons.map((pokemon) => (
                    <li className={styles.pokemonListItem} key={pokemon.name}>
                        <Link className={styles.pokemonContainer} as={`/pokemon/${pokemon.name}`} href="/pokemon/[name]">
                            <p className={styles.pokemonId}>No. {pokemon.id}</p>
                            <img className={styles.pokemonImage} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={`${pokemon.name} picture`}></img>
                            <h2 className={styles.pokemonName}>{pokemon.name}</h2>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export const getStaticProps = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    const resJson = await res.json();
    const pokemons = resJson.results.map(pokemon => {
        const name = pokemon.name;
        // https://pokeapi.co/api/v2/pokemon/1/
        const url = pokemon.url;
        const id = url.split("/")[url.split("/").length - 2];
        return {
            name,
            url,
            id
        }
    });
    return {
        props: {
            pokemons,
        },
    }
}
```

#### Move Next Page Templating to Astro

To start migrating this page to Astro, start with the returned JSX and place it within an `.astro` file:

```astro title="src/pages/index.astro"
---
import styles from '../styles/poke-list.module.css';
---

<head>
    <title>Pokedex: Generation 1</title>
</head>
<ul class={`plain-list ${styles.pokeList}`}>
    {pokemons.map((pokemon) => (
        <li class={styles.pokemonListItem} key={pokemon.name}>
            <a class={styles.pokemonContainer} href={`/pokemon/${pokemon.name}`}>
                <p class={styles.pokemonId}>No. {pokemon.id}</p>
                <img class={styles.pokemonImage} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={`${pokemon.name} picture`}></img>
                <h2 class={styles.pokemonName}>{pokemon.name}</h2>
            </Link>
        </li>
    ))}
</ul>
```

During the migration to Astro templating, this example also:

- Imported styles move to the code fence
- Removed the `<>` container fragment, as it is not needed in Astro's template.
- Changed `className` to a more standard `class` attribute.
- Migrated the Next `<Link>` component to an `<a>` HTML element.

Now move the `<head>` into your existing `layout.astro` file. To do this, we can:

1. Pass the `title` property to the `layout.astro` file via `Astro.props`
2. Import the layout file in `/src/pages/index.astro`
3. Wrap the Astro page's template in the Layout component

```astro ins={4,10} title="src/layouts/Layout.astro" 
---
import '../styles/index.css'

const {title} = Astro.props;
---

<html>
    <head lang="en">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>{title}</title>
    </head>
    <body>
        <div class="screen">
            <div class='screen-contents'>
                <slot />
            </div>
        </div>
    </body>
</html>
```

```astro  ins={3,6,18} title="src/pages/index.astro"
---
import styles from '../styles/poke-list.module.css';
import Layout from '../layouts/layout.astro';
---

<Layout title="Pokedex: Generation 1">
    <ul class={`plain-list ${styles.pokeList}`}>
        {pokemons.map((pokemon) => (
            <li class={styles.pokemonListItem} key={pokemon.name}>
                <a class={styles.pokemonContainer} href={`/pokemon/${pokemon.name}`}>
                    <p class={styles.pokemonId}>No. {pokemon.id}</p>
                    <img class={styles.pokemonImage} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={`${pokemon.name} picture`}></img>
                    <h2 class={styles.pokemonName}>{pokemon.name}</h2>
                </Link>
            </li>
        ))}
    </ul>
</Layout>
```

#### Move Next Page Logic Requests to Astro

This is the `getStaticProps` method from the NextJS page:

```jsx
export const getStaticProps = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    const resJson = await res.json();
    const pokemons = resJson.results.map(pokemon => {
        const name = pokemon.name;
        // https://pokeapi.co/api/v2/pokemon/1/
        const url = pokemon.url;
        const id = url.split("/")[url.split("/").length - 2];
        return {
            name,
            url,
            id
        }
    });
    return {
        props: {
            pokemons,
        },
    }
}
```

This then passes the `props` into the `Home` component that's been defined:

```jsx
export default function Home({ pokemons }) {
	// ...
}
```

In Astro, this process is different. Instead of using a dedicated `getStaticProps` function, move the props logic into the code fence of our Astro page:

```astro ins={4-16} title="src/pages/index.astro"
---
import styles from '../styles/poke-list.module.css';
import Layout from '../layouts/layout.astro';
const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
const resJson = await res.json();
const pokemons = resJson.results.map(pokemon => {
    const name = pokemon.name;
    // https://pokeapi.co/api/v2/pokemon/1/
    const url = pokemon.url;
    const id = url.split("/")[url.split("/").length - 2];
    return {
        name,
        url,
        id
    }
});
---

<Layout title="Pokedex: Generation 1">
    <ul class={`plain-list ${styles.pokeList}`}>
        {pokemons.map((pokemon) => (
            <li class={styles.pokemonListItem} key={pokemon.name}>
                <a class={styles.pokemonContainer} href={`/pokemon/${pokemon.name}`}>
                    <p class={styles.pokemonId}>No. {pokemon.id}</p>
                    <img class={styles.pokemonImage} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={`${pokemon.name} picture`}></img>
                    <h2 class={styles.pokemonName}>{pokemon.name}</h2>
                </Link>
            </li>
        ))}
    </ul>
</Layout>
```

You should now have a fully working Pokédex entries screen.

### Convert a Next.js `getStaticPaths` Page to Astro

This is a Next.js dynamic page that generates a detail screen for each of the first 151 Pokémon using [the REST PokéAPI](https://pokeapi.co/).

```jsx title="pages/pokemon/[name].js"
import { useRouter } from 'next/router';
import Head from 'next/head'
import styles from '../../styles/pokemon-entry.module.css';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Pokemon({ pokemon }) {
  const router = useRouter();
  const title = `Pokedex: ${pokemon.name}`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <button onClick={() => router.back()} className={styles.backBtn} aria-label="Go back"></button>
      <img className={styles.pokeImage} src={pokemon.image} alt={`${pokemon.name} picture`} />
      <div className={styles.infoContainer}>
        <h1 className={styles.header}>No. {pokemon.id}: {pokemon.name}</h1>
        <table className={styles.pokeInfo}>
          <tbody>
            <tr>
              <th>Types</th>
              <td>{pokemon.types}</td>
            </tr>
            <tr>
              <th>Height</th>
              <td>{pokemon.height}</td>
            </tr>
            <tr>
              <th>Weight</th>
              <td>{pokemon.weight}</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.flavor}>{pokemon.flavorText}</p>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const resJson = await res.json();
  const pokemons = resJson.results;

  return {
    paths: pokemons.map(({ name }) => ({
      params: { name },
    }))
  }
}

export const getStaticProps = async (context) => {
  const { name } = context.params
  const [pokemon, species] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(res => res.json())
  ])

  return {
    props: {
      pokemon: {
        id: pokemon.id,
        image: pokemon.sprites.front_default,
        name: capitalize(pokemon.name),
        height: pokemon.height,
        weight: pokemon.weight,
        flavorText: species.flavor_text_entries[0].flavor_text,
        types: pokemon.types.map(({ type }) => type.name).join(', ')
      },
    },
  }
}
```

#### Move Next Page Templating to Astro

To start migrating this page to Astro, start with the returned JSX and place it within an `.astro` file:

```astro title="src/pages/pokemon/[name].astro"
---
import styles from '../../styles/pokemon-entry.module.css';
---

<Layout title={`Pokedex: ${pokemon.name}`}>
  <button onclick="history.go(-1)" class={styles.backBtn} aria-label="Go back"></button>
  <img class={styles.pokeImage} src={pokemon.image} alt={`${pokemon.name} picture`} />
  <div class={styles.infoContainer}>
    <h1 class={styles.header}>No. {pokemon.id}: {pokemon.name}</h1>
    <table class={styles.pokeInfo}>
      <tbody>
        <tr>
          <th>Types</th>
          <td>{pokemon.types}</td>
        </tr>
        <tr>
          <th>Height</th>
          <td>{pokemon.height}</td>
        </tr>
        <tr>
          <th>Weight</th>
          <td>{pokemon.weight}</td>
        </tr>
      </tbody>
    </table>
    <p class={styles.flavor}>{pokemon.flavorText}</p>
  </div>
</Layout>
```

Like before:

- Imported styles are moved to the code fence.
- `className` becomes `class`.
- `<Head>` contents are moved into `<Layout>`.
- `{pokemon.id}` values are interpolated the same as before.

However, in addition, now:

- [HTML's standard `onclick`](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers#using_onevent_properties) function is used to call [the browser's `history.go` function](https://developer.mozilla.org/en-US/docs/Web/API/History/go) to navigate back.

#### Move Next `getStaticPaths` to Astro

Astro supports a function called `getStaticPaths` to generate dynamic paths, similar to Next.

Given a Next page:

```jsx title="pages/pokemon/[name].js"
export const getStaticPaths = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const resJson = await res.json();
  const pokemons = resJson.results;

  return {
    paths: pokemons.map(({ name }) => ({
      params: { name },
    }))
  }
}
```

Migrate the `getStaticPaths` method to Astro by removing the `paths` route prefix and returning an array:

```astro ins={9-11} title="src/pages/pokemon/[name].astro"
---
import styles from '../../styles/pokemon-entry.module.css';

export const getStaticPaths = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const resJson = await res.json();
  const pokemons = resJson.results;

  return pokemons.map(({ name }) => ({
      params: { name },
    }))
}
---

<Layout title={`Pokedex: ${pokemon.name}`}>
  <button onclick="history.go(-1)" class={styles.backBtn} aria-label="Go back"></button>
  <img class={styles.pokeImage} src={pokemon.image} alt={`${pokemon.name} picture`} />
  <div class={styles.infoContainer}>
    <h1 class={styles.header}>No. {pokemon.id}: {pokemon.name}</h1>
    <table class={styles.pokeInfo}>
      <tbody>
        <tr>
          <th>Types</th>
          <td>{pokemon.types}</td>
        </tr>
        <tr>
          <th>Height</th>
          <td>{pokemon.height}</td>
        </tr>
        <tr>
          <th>Weight</th>
          <td>{pokemon.weight}</td>
        </tr>
      </tbody>
    </table>
    <p class={styles.flavor}>{pokemon.flavorText}</p>
  </div>
</Layout>
```

Then, similar to the previous page, migrate the `getStaticProps` method to non-function-wrapped code in the Astro page's code fence.

Given the Next page logic:
```jsx title="pages/pokemon/[name].js"
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getStaticProps = async (context) => {
  const { name } = context.params
  const [pokemon, species] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(res => res.json())
  ])

  return {
    props: {
      pokemon: {
        id: pokemon.id,
        image: pokemon.sprites.front_default,
        name: capitalize(pokemon.name),
        height: pokemon.height,
        weight: pokemon.weight,
        flavorText: species.flavor_text_entries[0].flavor_text,
        types: pokemon.types.map(({ type }) => type.name).join(', ')
      },
    },
  }
}
```

Migrate this to the Astro page's code fence:

:::tip
Use `Astro.props` to access the `params` returned from the `getStaticPaths` function
:::

```astro ins={14-32} title="src/pages/pokemon/[name].astro"
---
import styles from '../../styles/pokemon-entry.module.css';

export const getStaticPaths = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const resJson = await res.json();
  const pokemons = resJson.results;

  return pokemons.map(({ name }) => ({
      params: { name },
    }))
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const { name } = Astro.props;
const [pokemonData, species] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(res => res.json())
])

const pokemon = {
    id: pokemonData.id,
    image: pokemonData.sprites.front_default,
    name: capitalize(pokemonData.name),
    height: pokemonData.height,
    weight: pokemonData.weight,
    flavorText: species.flavor_text_entries[0].flavor_text,
    types: pokemonData.types.map(({ type }) => type.name).join(', ')
};
---

<Layout title={`Pokedex: ${pokemon.name}`}>
  <button onclick="history.go(-1)" class={styles.backBtn} aria-label="Go back"></button>
  <img class={styles.pokeImage} src={pokemon.image} alt={`${pokemon.name} picture`} />
  <div class={styles.infoContainer}>
    <h1 class={styles.header}>No. {pokemon.id}: {pokemon.name}</h1>
    <table class={styles.pokeInfo}>
      <tbody>
        <tr>
          <th>Types</th>
          <td>{pokemon.types}</td>
        </tr>
        <tr>
          <th>Height</th>
          <td>{pokemon.height}</td>
        </tr>
        <tr>
          <th>Weight</th>
          <td>{pokemon.weight}</td>
        </tr>
      </tbody>
    </table>
    <p class={styles.flavor}>{pokemon.flavorText}</p>
  </div>
</Layout>
```

You have now fully migrated a Pokédex application from Next to Astro.

## Community Resources 

- Video: [NextJS to Astro: more control = faster sites](https://www.youtube.com/watch?v=PSzCtdM20Fc).

- Video: [How Astro made my site 100x faster](https://www.youtube.com/watch?v=cOxA3kMYtkM).
