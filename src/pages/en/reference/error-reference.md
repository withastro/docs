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
  import DontEditWarning from '../../../components/DontEditWarning.astro';
---

<DontEditWarning />

The following reference is a complete list of the errors you may encounter while using Astro. For additional assistance, including common pitfalls, please also see our [Troubleshooting Guide](/en/guides/troubleshooting/).

## Astro Errors

- **StaticRedirectNotAvailable** (E03001)<br/>[`Astro.redirect` is not available in static mode.](/en/reference/errors/StaticRedirectNotAvailable)
- **ClientAddressNotAvailable** (E03002)<br/>[`Astro.clientAddress` is not available in current adapter.](/en/reference/errors/ClientAddressNotAvailable)
- **StaticClientAddressNotAvailable** (E03003)<br/>[`Astro.clientAddress` is not available in static mode.](/en/reference/errors/StaticClientAddressNotAvailable)
- **NoMatchingStaticPathFound** (E03004)<br/>[No static path found for requested path.](/en/reference/errors/NoMatchingStaticPathFound)
- **OnlyResponseCanBeReturned** (E03005)<br/>[Invalid type returned by Astro page.](/en/reference/errors/OnlyResponseCanBeReturned)
- **MissingMediaQueryDirective** (E03006)<br/>[Missing value for `client:media` directive.](/en/reference/errors/MissingMediaQueryDirective)
- **NoMatchingRenderer** (E03007)<br/>[No matching renderer found.](/en/reference/errors/NoMatchingRenderer)
- **NoClientEntrypoint** (E03008)<br/>[No client entrypoint specified in renderer.](/en/reference/errors/NoClientEntrypoint)
- **NoClientOnlyHint** (E03009)<br/>[Missing hint on `client:only` directive.](/en/reference/errors/NoClientOnlyHint)
- **InvalidGetStaticPathParam** (E03010)<br/>[Invalid value returned by a `getStaticPaths` path.](/en/reference/errors/InvalidGetStaticPathParam)
- **InvalidGetStaticPathsReturn** (E03011)<br/>[Invalid value returned by getStaticPaths.](/en/reference/errors/InvalidGetStaticPathsReturn)
- **GetStaticPathsRemovedRSSHelper** (E03012)<br/>[getStaticPaths RSS helper is not available anymore.](/en/reference/errors/GetStaticPathsRemovedRSSHelper)
- **GetStaticPathsExpectedParams** (E03013)<br/>[Missing params property on `getStaticPaths` route.](/en/reference/errors/GetStaticPathsExpectedParams)
- **GetStaticPathsInvalidRouteParam** (E03014)<br/>[Invalid value for `getStaticPaths` route parameter.](/en/reference/errors/GetStaticPathsInvalidRouteParam)
- **GetStaticPathsRequired** (E03015)<br/>[`getStaticPaths()` function required for dynamic routes.](/en/reference/errors/GetStaticPathsRequired)
- **ReservedSlotName** (E03016)<br/>[Invalid slot name.](/en/reference/errors/ReservedSlotName)
- **NoAdapterInstalled** (E03017)<br/>[Cannot use Server-side Rendering without an adapter.](/en/reference/errors/NoAdapterInstalled)
- **NoMatchingImport** (E03018)<br/>[No import found for component.](/en/reference/errors/NoMatchingImport)
- **FailedToLoadModuleSSR** (E04001)<br/>[Could not import file.](/en/reference/errors/FailedToLoadModuleSSR)
- **InvalidGlob** (E04002)<br/>[Invalid glob pattern.](/en/reference/errors/InvalidGlob)
## CSS Errors

- **CSSSyntaxError** (E05001)<br/>[CSS Syntax Error.](/en/reference/errors/CSSSyntaxError)
## Markdown Errors

- **MarkdownFrontmatterParseError** (E06001)<br/>[Failed to parse Markdown frontmatter.](/en/reference/errors/MarkdownFrontmatterParseError)
- **ConfigNotFound** (E07001)<br/>[Specified configuration file not found.](/en/reference/errors/ConfigNotFound)
- **ConfigLegacyKey** (E07002)<br/>[Legacy configuration detected.](/en/reference/errors/ConfigLegacyKey)
