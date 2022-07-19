---
layout: ~/layouts/MainLayout.astro
---

## Goals

BY THE END OF THIS SECTION YOU WILL HAVE:
- extracted common page elements into a layout component
- used an Astro `<slot />` element to send page contents to the layout
- passed page data as props to its layout using a component attribute


Now that you have some Astro components repeatedly rendered on every page, let's refactor again to create a single page layout!

## Create an Astro Layout 

1. Create a new file at the location `src/layouts/BaseLayout.astro`. (You may need to create a new `layouts` folder first.)
2. Copy the **entire contents** of `index.astro` into your new file, `BaseLayout.astro`.
```astro
---
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
const title = "Home Page"
---
<html lang = "en">
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width" />
        <title>Astro</title>
    </head>
    <body>
        <Navigation />
        <h1>{title}</h1>
        <Footer />
    </body>
</html>
```

3. Notice that **all** of those HTML elements are things we want to appear on every page, so we can remove most of the content from `index.astro` and still show the same page to the reader via only the `<Layout />` component. Replace the code at `src/pages/index.astro` with the following:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout></BaseLayout>
```
3. Check your browser preview and verify that your index page looks the same as it did before.

### Using a `<slot />`

1. Add the following subtitle to your page at `src/pages/index.astro`.

 ```diff
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout>
+<h2>My awesome blog subtitle</h2>
</BaseLayout>
```

Check the browser preview again to notice what did (or, spoiler alert: did _not_!) change.
    
2. Add a `<slot />` element to `src/layouts/BaseLayout.astro` just above the footer component, then check the browser preview of your Home page and notice what really _did_ change this time!

```diff
---
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
const title = "Home Page"
---
<html lang = "en">
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width" />
        <title>Astro</title>
    </head>
    <body>
        <Navigation />
        <h1>{title}</h1>
+       <slot />        
        <Footer />
    </body>
</html>
```

#### Analyze the pattern

1. What is the purpose of a `<slot />`?
2. You can use a `<slot />` in any Astro component to pass data to be rendered, but why is this a particularly useful feature for a layout?

### Pass page-specific values as props

1. Pass the page title to your layout component from `index.astro` using a component attribute: 
```diff
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
+<BaseLayout title="Home Page">
    <h2>My awesome blog subtitle</h2>
   <p>This site was built with Astro! :rocket </p>
   <img src=https://unsplash.com/image.jpg />
</BaseLayout>
```
 2. Change the script of your `BaseLayout.astro` layout component to receive a page title via `Astro.props` instead of defining it as a constant.
 ```diff
---
import Navigation from '../components/Navigation.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
- const title = "Home Page"
+ const { title } = Astro.props
---
```
 3. Check your browser preview to verify that your page title has not changed. It has the same value, but is now being rendered dynamically, and each individual page can specify its own title to the layout.

 #### Analyze the Pattern

 1. When would you choose to add a component attribute layout instead of just using a `<slot />`?
 2. What are the two steps required so that your layout component receives a value as props?
 
### Try it Yourself
Refactor your other pages (`blog.astro` and `about.astro`) so that they use your new `<BaseLayout>` component to render the common page elements!

Don't forget to: (these are just bullets spewed, not yet edited for language)
- pass a page title as props via a component attribute
- only keep in your component template the elements that are page-specific, because the layout will take care of the HTML rendering for common elements
 
## Before You Go

### Test your knowledge

1. An Astro component (`.astro` file) can function as a:

    a. page

    b. UI component

    c. layout

    d. all of the above, because Astro components are so functional!

2. To display a page title on the page, you can:

    a. use a standard HTML element on the page with static text -- `<h1>Home Page</h1>`

    b. use a standard HTML element on the page referring to a variable defined in your component script -- `<h1>{title}</h1>`

    c. use a layout component on the page, passing the title as a component attribute -- `<BaseLayout title="Home Page" />` or `<BaseLayout title={title} />`

    d. all of the above, because Astro lets you use plain HTML or supercharge it with some script and components!

3. Information can be passed from one component to another by:

    a. importing a UI component and rendering it in the template of another component

    b. passing props to a component where it is rendered via a component attribute

    c. sending HTML content to be rendered inside another component using a `<slot />` placeholder

    d. all of the above, because Astro was built to take advantage of component-based design!


### Checklist for moving on
[ ] I can create an Astro component with a `<slot />` that serves as a page layout.

[ ] I can send page-specific properties to a layout using a component attribute.

[ ] I can render page content inside a layout by "wrapping" my entire page HTML template in opening and closing layout component tags.
