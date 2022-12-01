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

- **StaticRedirectNotAvailable** (E03001)<br/>[`Astro.redirect` is not available in static mode.](../errors/StaticRedirectNotAvailable)
- **ClientAddressNotAvailable** (E03002)<br/>[`Astro.clientAddress` is not available in current adapter.](../errors/ClientAddressNotAvailable)
- **StaticClientAddressNotAvailable** (E03003)<br/>[`Astro.clientAddress` is not available in static mode.](../errors/StaticClientAddressNotAvailable)
- **NoMatchingStaticPathFound** (E03004)<br/>[No static path found for requested path.](../errors/NoMatchingStaticPathFound)
- **OnlyResponseCanBeReturned** (E03005)<br/>[Invalid type returned by Astro page.](../errors/OnlyResponseCanBeReturned)
- **MissingMediaQueryDirective** (E03006)<br/>[Missing value for `client:media` directive.](../errors/MissingMediaQueryDirective)
- **NoMatchingRenderer** (E03007)<br/>[No matching renderer found.](../errors/NoMatchingRenderer)
- **NoClientEntrypoint** (E03008)<br/>[No client entrypoint specified in renderer.](../errors/NoClientEntrypoint)
- **NoClientOnlyHint** (E03009)<br/>[Missing hint on `client:only` directive.](../errors/NoClientOnlyHint)
- **InvalidGetStaticPathParam** (E03010)<br/>[Invalid value returned by a `getStaticPaths` path.](../errors/InvalidGetStaticPathParam)
- **InvalidGetStaticPathsReturn** (E03011)<br/>[Invalid value returned by getStaticPaths.](../errors/InvalidGetStaticPathsReturn)
- **GetStaticPathsRemovedRSSHelper** (E03012)<br/>[getStaticPaths RSS helper is not available anymore.](../errors/GetStaticPathsRemovedRSSHelper)
- **GetStaticPathsExpectedParams** (E03013)<br/>[Missing params property on `getStaticPaths` route.](../errors/GetStaticPathsExpectedParams)
- **GetStaticPathsInvalidRouteParam** (E03014)<br/>[Invalid value for `getStaticPaths` route parameter.](../errors/GetStaticPathsInvalidRouteParam)
- **GetStaticPathsRequired** (E03015)<br/>[`getStaticPaths()` function required for dynamic routes.](../errors/GetStaticPathsRequired)
- **ReservedSlotName** (E03016)<br/>[Invalid slot name.](../errors/ReservedSlotName)
- **NoAdapterInstalled** (E03017)<br/>[Cannot use Server-side Rendering without an adapter.](../errors/NoAdapterInstalled)
- **NoMatchingImport** (E03018)<br/>[No import found for component.](../errors/NoMatchingImport)
- **FailedToLoadModuleSSR** (E04001)<br/>[Could not import file.](../errors/FailedToLoadModuleSSR)
- **InvalidGlob** (E04002)<br/>[Invalid glob pattern.](../errors/InvalidGlob)
## CSS Errors

- **CSSSyntaxError** (E05001)<br/>[CSS Syntax Error.](../errors/CSSSyntaxError)
## Markdown Errors

- **MarkdownFrontmatterParseError** (E06001)<br/>[Failed to parse Markdown frontmatter.](../errors/MarkdownFrontmatterParseError)
- **ConfigNotFound** (E07001)<br/>[Specified configuration file not found.](../errors/ConfigNotFound)
- **ConfigLegacyKey** (E07002)<br/>[Legacy configuration detected.](../errors/ConfigLegacyKey)
