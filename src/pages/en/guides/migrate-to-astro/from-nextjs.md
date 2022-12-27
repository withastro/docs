---
title: Migrating from Next.js
description: Tips for migrating an existing Next.js project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: false
framework: Next.js
setup: |
  import AstroJSXTabs from '~/components/tabs/AstroJSXTabs.astro'
  import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
---

After following the guidance on this page, you probably won't have your new Astro site exactly the way you want it yet.

But, this guide gives you some key concepts and migration strategies to help you get started. Use the rest of our docs and our [Discord community](https://astro.build/chat) to keep going!

## Key Similarities between Next.js and Astro

Next.js and Astro share some similarities that will help you migrate your project:

- The syntax of `.astro` files is similar to JSX. Writing Astro should feel familiar.
- Astro projects can also be SSG or SSR. (Support for per-page rendering strategy is planned.)
- Astro uses file-based routing, and [allows specially named pages to create dynamic routes](/en/core-concepts/routing/#dynamic-routes).
- Astro is component-based, and your markup structure will be similar before and after your migration.
- Astro has [official integrations for using React components](/en/guides/integrations-guide/react/). Note that in Astro, React files **must** have a `.jsx` or `.tsx` extension.
- Astro has support for NPM packages, including several for React. You may be able to keep some or all of your existing React components and dependencies.

## Key Differences between Next.js and Astro

When you rebuild your Next.js site in Astro, you will notice some important differences:

- [MPA vs SPA](/en/concepts/mpa-vs-spa/): Next.js is a React-based SPA (single-page application). Astro sites are multi-page apps built using `.astro` components, but can also support React, Preact, Vue.js, Svelte, SolidJS, AlpineJS, Lit and raw HTML templating.

- [Astro components](/en/core-concepts/astro-components/) are not written as exported functions that return page templating. Instead, you'll split your code into a "code fence" and a body exclusively for the HTML you generate.

- [Content-focus](/en/concepts/why-astro/): Astro was designed primarily for content-focused sites. An existing Next.js app might be built for high client-side interactivity and may include items that are difficult to replicate in Astro, such as dashboards.

## Convert your Project

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
  
  Then, copy your existing Next project files over to your new Astro project in a separate folder outside of `src`.

- Option 2: **Update your existing Gatsby project dependencies**

  Remove any Next or React-related dependencies in `package.json` and follow all the steps to [install Astro manually](/en/install/manual/) in your existing repository. (You may wish to do this on a different branch.) 
  
  Make sure you have [these project files](/en/install/manual/#7-next-steps) and a working home page before continuing. 

:::tip
Prefer to explore in your browser instead? Visit https://astro.new for a variety of starter templates that can be opened and edited in StackBlitz, CodeSandbox or Gitpod.
:::

### Install integrations (optional)

You may find it useful to install some of [Astro's optional integrations](/en/guides/integrations-guide/) to use while converting your Next project to Astro:

- **@astrojs/react**: to reuse some existing React UI components in your new Astro site, or keep writing with React components.

- **@astrojs/image**: to replace Next's Image plugin with Astro's own image-optimizing components.

- **@astrojs/mdx**: to bring existing MDX files from your Next project, or to use MDX in your new Astro site.

### Put your source code in `src`

1. **Keep** Next's `public/` folder untouched. 
   
    Astro uses the `public/` directory for static assets, just like Next. There is no change needed to this folder, nor its contents.

2. **Copy or Move** Next's other files and folders (e.g. `pages`, `styles` etc.) into Astro's `src/` folder.

    Like Next, Astro's `src/pages/` folder is a special folder used for file-based routing. All other folders are optional, and you can organize the contents of your `src/` folder any way you like. Other common folders in Astro projects include `src/layouts/`, `src/components`, `src/styles`, `src/scripts`.


### Repurpose config file

Astro has a configuration file at the root of your project called [`astro.config.mjs`](/en/guides/configuring-astro/). This is used only for configuring your Astro project and any installed integrations, including [SSR adapters](/en/guides/deploy/).

### Convert JSX files to `.astro` files

Here are some tips for converting a Next `.js` component into a `.astro` component:

1. Use the returned JSX of the existing Next.js component function as the basis for your HTML template.

2. Change any [Next or JSX syntax to Astro](#convert-nextjs-syntax-to-astro) (e.g. `<Link>`, `<Script>`, `{children}`, `className`, inline style objects) or to HTML web standards.

1. Move any necessary JavaScript, including import statements, into a "code fence" (`---`). Note: JavaScript to [conditionally render content](/en/core-concepts/astro-components/#dynamic-html) is often written inside the HTML template directly in Astro.

4. Write an `Astro.props` statement to access any additional props that were previously passed to your Gatsby function.

4. Decide whether any imported components also need to be converted to Astro. With the official integration installed, you can [use existing React components in your Astro file](/en/guides/integrations-guide/react/). But, you may want to convert them to Astro, especially if they do not need to be interactive!

See [examples from Next's starter templates converted step-by-step](#examples-from-nextjs).

#### Compare: JSX vs Astro

Compare the following Next component and a corresponding Astro component:

<AstroJSXTabs>
  <Fragment slot="jsx">
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
  </Fragment>
  <Fragment slot="astro">
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
  </Fragment>
</AstroJSXTabs>

### Migrating Layout Files

You may find it helpful to start by converting your Next.js layouts and templates into Astro layout components.

Next has two different methods for creating layout files, each of which handles layouts differently than Astro:

- The `pages` directory

- [The `/app` directory (in beta)](https://beta.nextjs.org/docs/routing/pages-and-layouts#layouts)

Each Astro page explicitly requires `<html>`, `<head>`, and `<body>` tags to be present, so it is common to reuse a layout file across pages. Astro uses a `<slot />` for page content, with no import statement required. Note the standard HTML templating, and direct access to `<head>`:  

```astro title="src/layouts/Layout.astro"
---
---
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

#### Migrating from Next.js' `pages` directory

Your Next project may have a `pages/_document.jsx` file that imports React components to customize your app's `<head>`:

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

1. Make a new Astro layout file using only the returned JSX.

2. Replace any React components with `<html>`, `<head>`, `<slot>`, and other HTML standard tags.


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

#### Migrating from Next.js' `/app` directory

Next.js' `app/` directory layout files are created with two files: a `layout.jsx` file to customize the `<html>` and `<body>` contents, and a `body.jsx` file to customize the `<head>` element contents.

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

1. Make a new Astro layout file using only the returned JSX.

2. Replace both these files with a single Astro layout file that contains a page shell (`<html>`, `<head>`, and `<body>` tags) and a `<slot/>` instead of React's `{children}` prop:

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

### Migrating Pages and Posts

In Next.js, your posts either live in `/pages` or `/app/routeName/page.jsx`.

In Astro, **your pages must live within `src/pages/`**. You will not have to configure any routing behavior for your Astro, Markdown and MDX files.

#### React pages

Your existing Gatsby JSX (`.js`) pages will need to be [converted from JSX files to `.astro` pages](#convert-jsx-files-to-astro-files).

#### Markdown and MDX pages

Next.js has no built-in support for Markdown and an optional integration for MDX files. If your existing project contains Markdown or MDX files, you no longer need to manually create pages for each Markdown-generated route. However, your existing Markdown and MDX pages may require some adjustments to their frontmatter, such as adding [Astro's special `layout` frontmatter property](/en/core-concepts/layouts/#markdownmdx-layouts).

With dynamic routing, your Markdown posts may exist outside of `src/pages/` but they should still be kept within your project source folder (e.g. `src/posts/`) so that the dynamic page file (e.g. `src/pages/blog/[slug].astro` can import their data.)

### Migrating Tests

As Astro outputs raw HTML, it is possible to write end-to-end tests using the output of the build step. Any end-to-end tests written previously might work out-of-the-box, if you have been able to match the markup of your Next site. Testing libraries such as Jest and React Testing Library can be imported and used in Astro to test your React components.

See Astro's [testing guide](/en/guides/testing/) for more.

## Reference: Convert Next.js Syntax to Astro

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

If necesssary, update any file imports to reference relative file paths exactly. This can be done using [import aliases](/en/guides/typescript/#import-aliases), or by writing out a relative path in full (e.g. `../../layouts/Layout.astro`). Note that `.astro` and several other file types must be imported with their full file extension.

### Next Children Props to Astro

Convert any instances of `{children}` to an Astro `<slot />`. Astro does not need to receive `{children}` as a function prop and will automatically render child content in a `<slot />`.

React components that pass multiple sets of children can be migrated to an Astro component using [named slots](/en/core-concepts/astro-components/#named-slots):

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

See more about [specific `<slot />` usage in Astro](/en/core-concepts/astro-components/#slots).

### Next Data Fetching to Astro

Convert any instances of `getStaticProps()` to `Astro.glob()` to access data from other files in your project source. These data requests are made in the frontmatter of the Astro component using the data.

See more about [local files imports with `Astro.glob()`](/en/guides/imports/#astroglob).

### Next Styling to Astro

Convert any inline style objects (`style = {{fontWeight: "bold", }}`) to inline HTML style attributes (`style="font-weight:bold;"`). Or, use an Astro `<style>` tag for scoped CSS styles. Import `.css` files directly into a main layout component to achieve global styles.

You may also need to replace any CSS-in-JS libraries (e.g. styled components) with other available CSS options in Astro.

<!-- TODO: CSS in JS?? replacements for styled components-->

See more about [Styling in Astro](/en/guides/styling/).

### Next Image Plugin to Astro

Convert any Next `<Image />` components with [Astro's own image integration components](/en/guides/images/#astros-image-integration), or with a standard HTML `<img>` tag.

You can learn more about [using images in Astro](/en/guides/images/) in the Images Guide.

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
