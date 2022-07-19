---
layout: ~/layouts/MainLayout.astro
---

## Goals

BY THE END OF THIS SECTION YOU WILL HAVE:
- added a new component that receives props passed by attribute
- rendered this new component multiple times, each time receiving different props
- styled this component


Now that you have used Astro components on a page, let's use a component within another component!

## Create a Social Media component
1. Create a new file at the location `src/components/Social.astro`.
2. Copy the following code into your new file, `Social.astro`.
```astro
---
const {platform, username} = Astro.props
---
<span><a href=`https://www.${platform}.com/${username}`>{platform}</a></span>
```
3. Change the code in `src/components/Footer.astro` to import, then render this new component three times, passing different **component attributes** as props each time:

```astro
---
import Social from './Social.astro'
---
<Social platform="twitter" username="astrodotbuild" />
<Social platform="github" username="withastro" />
<Social platform="youtube" username="astrodotbuild" />
```
4. Check each page in your browser preview, and you should see your new footer rendering links to these three platforms.
5. Add the following `<style>` tag to `src/components/social`:
```astro
<style>
    .social-platform {
        margin: 0.4em;
        padding: 1em;
        background-color: #ff9776;
        border-radius: 3px;
    }
    a {
        color: #00539F;
        text-decoration: none;
    }

</style>
```
6. Lastly, add some space in your footer to separate it from the rest of the page content. Add the following to `src/components/footer.astro`:
```diff
---
import Social from './Social.astro'
---
+<style>
+   .spacer {
+       height: 2em;
+   }
+</style>

+<div class="spacer"></div>
<Social platform="twitter" username="astrodotbuild" />
<Social platform="github" username="withastro" />
<Social platform="youtube" username="astrodotbuild" />
```
7. Check your browser preview again and confirm that each page shows an updated footer.

## Before You Go

### Analyze the Pattern

1. How is your `<Footer />` component similar to your `<Navigation />` component? How is it different?
2. Your website's footer and navigation each display three links. List three differences between these two sets of links. Think about things like _where the link text comes from_, _the appearance of the links on the page_ and _how the link's URL is determined_.
3. Describe how Astro uses **component-based design** to render a page.

### Checklist for moving on
[ ] I can create new `.astro` components in `src/components/`

[ ] I can import and render components inside other components.

[ ] I can send data (pass props) as component attributes to an Astro component so that it can dynamically generate HTML.
