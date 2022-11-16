---
# NOTE: This file is auto-generated from 'scripts/error-docgen.mjs'
# Do not make edits to it directly, they will be overwritten.
# Instead, change this file: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
# Translators, please remove this note and the <DontEditWarning/> component.

layout: ~/layouts/MainLayout.astro
title: Error reference
i18nReady: true
githubURL: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
setup: |
  import Since from '../../../components/Since.astro';
  import DontEditWarning from '../../../components/DontEditWarning.astro';
---

<DontEditWarning />

The following reference covers all errors that can be emitted by Astro. To learn more about common pitfalls, see our guide on [Troubleshooting](/en/guides/troubleshooting/).

## Astro Errors

### StaticRedirectNotAllowed



> Redirects are only available when using output: 'server'. Update your Astro config if you need SSR features. (E03001)

#### What went wrong?
The `Astro.redirect` function is only available when [Server-side rendering](/en/guides/server-side-rendering/) is enabled.

To redirect on a static website, the [meta refresh attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) can be used. Certain hosts also provide config-based redirects (ex: [Netlify redirects](https://docs.netlify.com/routing/redirects/)).

**See Also:**
-  [Enabling SSR in Your Project](https\://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project)
-  [Astro.redirect](https\://docs.astro.build/en/guides/server-side-rendering/#astroredirect)


### ClientAddressNotAvailable



> Astro.clientAddress is not available in the `adapterName` adapter. File an issue with the adapter to add support. (E03002)

#### What went wrong?
The adapter you're using unfortunately does not support `Astro.clientAddress`.

**See Also:**
-  [Official integrations](https\://docs.astro.build/en/guides/integrations-guide/#official-integrations)
-  [Astro.clientAddress](https\://docs.astro.build/en/reference/api-reference/#astroclientaddress)


### StaticClientAddressNotAvailable



> Astro.clientAddress is only available when using output: 'server'. Update your Astro config if you need SSR features. (E03003)

#### What went wrong?
The `Astro.clientAddress` property is only available when [Server-side rendering](/en/guides/server-side-rendering/) is enabled.

Alternatively, to get the user's IP address in static mode, different APIs such as [Ipify](https://www.ipify.org/) can be used in a [Client-side script](/en/core-concepts/astro-components/#client-side-scripts) or it may be possible to get the user's IP using a serverless function hosted on your hosting provider.

**See Also:**
-  [Enabling SSR in Your Project](https\://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project)
-  [Astro.clientAddress](https\://docs.astro.build/en/reference/api-reference/#astroclientaddress)


### NoMatchingStaticPathFound



> A getStaticPaths route pattern was matched, but no matching static path was found for requested path `pathName`. (E03004)

#### What went wrong?
A [dynamic route](/en/core-concepts/routing/#dynamic-routes) was matched, but no corresponding path was found for the requested parameters. This is often caused by a typo in either the generated or the requested path.

**See Also:**
-  [getStaticPaths](https\://docs.astro.build/en/reference/api-reference/#getstaticpaths)


### OnlyResponseCanBeReturned



> Route returned a `returnedValue`. Only a Response can be returned from Astro files. (E03005)

#### What went wrong?
Only instances of [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned inside Astro files.
```astro title="pages/login.astro"
---
return new Response(null, {
 status: 404,
 statusText: 'Not found'
});

// Alternatively, for redirects, Astro.redirect also returns an instance of Response
return Astro.redirect('/login');
---
```

**See Also:**
-  [Response](https\://docs.astro.build/en/guides/server-side-rendering/#response)


### MissingMediaQueryDirective



> Media query not provided for "client\:media" directive. A media query similar to &lt;`componentName` client\:media="(max-width\: 600px)" /&gt; must be provided (E03006)

#### What went wrong?
A [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) parameter is required when using the `client:media` directive.

```astro
<Counter client:media="(max-width: 640px)" />
```

**See Also:**
-  [client\:media](https\://docs.astro.build/en/reference/directives-reference/#clientmedia)


### NoMatchingRenderer



> Unable to render `componentName`! There are `rendererCount` renderer(s) configured in your `astro.config.mjs` file, but none were able to server-side render `componentName` (E03007)

#### What went wrong?
None of the installed integrations were able to render the component you imported. Make sure to install the appropriate integration for the type of component you are trying to include in your page.

For JSX / TSX files, [@astrojs/react](/en/guides/integrations-guide/react/), [@astrojs/preact](/en/guides/integrations-guide/preact/) or [@astrojs/solid-js](/en/guides/integrations-guide/solid-js/) can be used. For Vue and Svelte files, the [@astrojs/vue](/en/guides/integrations-guide/vue/) and [@astrojs/svelte](/en/guides/integrations-guide/svelte/) integrations can be used respectively

**See Also:**
-  [Frameworks components](https\://docs.astro.build/en/core-concepts/framework-components/)
-  [UI Frameworks](https\://docs.astro.build/en/guides/integrations-guide/#official-integrations)


### NoClientEntrypoint



> `componentName` component has a \`client\:`clientDirective`\` directive, but no client entrypoint was provided by `rendererName`! (E03008)

#### What went wrong?
Astro tried to hydrate a component on the client, but the renderer used does not provide a client entrypoint to use to hydrate.

**See Also:**
-  [addRenderer option](https\://docs.astro.build/en/reference/integrations-reference/#addrenderer-option)
-  [Hydrating framework components](https\://docs.astro.build/en/core-concepts/framework-components/#hydrating-interactive-components)


### NoClientOnlyHint



> Unable to render `componentName`! When using the \`client\:only\` hydration strategy, Astro needs a hint to use the correct renderer. (E03009)

#### What went wrong?
`client:only` components are not ran on the server, as such Astro does not know (and cannot guess) which renderer to use and require a hint. Like such:

```astro
	<SomeReactComponent client:only="react" />
```

**See Also:**
-  [client\:only](https\://docs.astro.build/en/reference/directives-reference/#clientonly)


### InvalidStaticPathParam



> Invalid params given to getStaticPaths path. Expected an object, got `paramType` (E03010)

#### What went wrong?
The `params` property in `getStaticPaths`'s return value (an array of objects) should also be an object.

```astro title="pages/blog/[id].astro"
---
export async function getStaticPaths() {
	return [
		{ params: { slug: "blog" } },
		{ params: { slug: "about" } }
	];
}
---
```

**See Also:**
-  [`getStaticPaths()`](https\://docs.astro.build/en/reference/api-reference/#getstaticpaths)
-  [`params`](https\://docs.astro.build/en/reference/api-reference/#params)


### InvalidGetStaticPathsReturn



> Invalid type returned by getStaticPaths. Expected an array, got `returnType` (E03011)

#### What went wrong?
`getStaticPaths`'s return value must be an array of objects.

```ts title="pages/blog/[id].astro"
export async function getStaticPaths() {
	return [ // <-- Array
		{ params: { slug: "blog" } },
		{ params: { slug: "about" } }
	];
}
```

**See Also:**
-  [`getStaticPaths()`](https\://docs.astro.build/en/reference/api-reference/#getstaticpaths)
-  [`params`](https\://docs.astro.build/en/reference/api-reference/#params)


### GetStaticPathsRemovedRSSHelper



> The RSS helper has been removed from getStaticPaths! Try the new @astrojs/rss package instead. (E03012)

#### What went wrong?
`getStaticPaths` no longer expose an helper for generating a RSS feed. We recommend migrating to the [@astrojs/rss](/en/guides/rss/#setting-up-astrojsrss)integration instead.

**See Also:**
-  [RSS Guide](https\://docs.astro.build/en/guides/rss/)


### GetStaticPathsExpectedParams



> Missing or empty required params property on getStaticPaths route (E03013)

#### What went wrong?
Every route specified by `getStaticPaths` require a `params` property specifying the path parameters needed to match the route.

For instance, the following code:
```astro title="pages/blog/[id].astro"
---
export async function getStaticPaths() {
	return [
		{ params: { id: '1' } }
	];
}
---
```
Will create the following route: `site.com/blog/1`.

**See Also:**
-  [`getStaticPaths()`](https\://docs.astro.build/en/reference/api-reference/#getstaticpaths)
-  [`params`](https\://docs.astro.build/en/reference/api-reference/#params)


### GetStaticPathsInvalidRouteParam



> Invalid getStaticPaths route parameter for \``key`\`. Expected undefined, a string or a number, received \``typeof value`\` ("`value`") (E03014)

#### What went wrong?
Since `params` are encoded into the URL, only certain types are supported as values.

```astro title="/route/[id].astro"
---
export async function getStaticPaths() {
	return [
		{ params: { id: '1' } } // Works
		{ params: { id: 2 } } // Works
		{ params: { id: false } } // Does not work!
	];
}
---
```

In routes using [rest parameters](/en/core-concepts/routing/#rest-parameters), `undefined` can be used to represent a path with no parameters passed in the URL:

```astro title="/route/[...id].astro"
---
export async function getStaticPaths() {
	return [
		{ params: { id: 1 } } // /route/1
		{ params: { id: 2 } } // /route/2
		{ params: { id: undefined } } // /route/
	];
}
---
```

**See Also:**
-  [`getStaticPaths()`](https\://docs.astro.build/en/reference/api-reference/#getstaticpaths)
-  [`params`](https\://docs.astro.build/en/reference/api-reference/#params)


## CSS Errors

## Markdown Errors

### MarkdownFrontmatterParseError



> **Example error messages:**<br/>
can not read an implicit mapping pair; a colon is missed<br/>
unexpected end of the stream within a double quoted scalar<br/>
can not read a block mapping entry; a multiline key may not be an implicit key (E06001)

#### What went wrong?
Astro encountered an error while parsing the frontmatter of your Markdown file.
This is often caused by a mistake in the syntax, such as a missing colon,



