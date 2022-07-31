---
layout: ~/layouts/TutorialLayout.astro
title: Interactivity in Astro
description: Using client-side Javascript and UI Framework components in Astro to provide interactivity.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
  import MultipleChoice from '~/components/tutorial/MultipleChoice.astro';
  import Option from '~/components/tutorial/Option.astro';
---

BY THE END OF THIS SECTION, YOU WILL HAVE:

- used client-side JavaScript in `<script>` tags to create a light/dark theme toggle and responsive mobile navigation header

- used the `astro-add` command to add an official Astro integration

- created an interactive UI framework (Preact) component that fetches data from an external API

- rendered Preact components on `index.astro`, controling each one's hydration method using a different `client:directive`

Now that you have a fully-featured blog, let's add some interactivity to extend your site!

### Summary

All the content on your site is **static**. A reader can navigate your site through links, but othwerwise, there is nothing for them to interact with.

You have used some build-time JavaScript to create and render parts of your site dynamically, but you do not yet have any client-side JavaScript, nor UI framework components (e.g. React, Svelte, Vue), that allow your readers to trigger any changes to the site.

Let's do that now!

### Test your knowledge

Fill in the blanks with: **`<script>`**, **JSX-like expressions**, **interactivity**, **build**, **code fences**, **browser**

`.astro` files can contain JavaScript between the || &nbsp &nbsp &nbsp &nbsp &nbsp **code fences** &nbsp &nbsp &nbsp &nbsp &nbsp || to define variables, receive props and run functions to help generate the HTML template. You can even write || **JSX-like expressions** || within the Astro component template to dynamically generate your HTML. But, all of this JavaScript is executed at || &nbsp &nbsp &nbsp &nbsp &nbsp **build** &nbsp &nbsp &nbsp &nbsp &nbsp || time, on the server, and is not available in the || &nbsp &nbsp &nbsp &nbsp &nbsp **browser** &nbsp &nbsp &nbsp &nbsp &nbsp ||.

For || &nbsp &nbsp &nbsp &nbsp &nbsp **interactivity** &nbsp &nbsp &nbsp &nbsp &nbsp || on your site, you need to write client-side JS (e.g in || &nbsp &nbsp &nbsp &nbsp &nbsp **`<script>`** &nbsp &nbsp &nbsp &nbsp &nbsp || tags) or use a UI framework component.


### Checklist for moving on

<Checklist key ="interactivity">
- [ ] I am ready to add some interactivity to my site!
</Checklist>

---

## Add Light / Dark Modes

BY THE END OF THIS SECTION YOU WILL HAVE:

- made a new theme toggle UI component to switch your site between light and dark mode

- defined global styles for both a light and a dark theme

- used JavaScript within a `<script>` tag to make your toggle button interactive

- refactored your JavaScript to a local project `.js` file

To give your blog readers the option of reading your site in either light mode or dark mode, let's create an interactive UI theme toggle switch. 

### Theme toggle component

1. Create a new file at `src/components/ThemeToggle.astro` and paste the following code into it:

    ```astro
    // src/components/ThemeToggle.astro
    <div class="toggle">
      <label class="switch">
        <input id="toggler" type="checkbox">
        <span class="slider"></span>
      </label>
    </div>
    ```

2. Add the theme toggle to `BaseLayout.astro` so that it will be displayed on all pages. Don't forget to import the component using its relative location!

    ```diff
    // src/layouts/BaseLayout.astro
      <Navigation />
    + <ThemeToggle />
      <h1>{title}</h1>

      <slot />

      <Footer />
    ```

3. Visit your browser preview at `localhost:3000` to see this component now rendered to your page, and try clicking on it.

    This theme toggle element is an HTML checkbox, but it won't look like one when we're done with it! 

    Using the CSS classes added to the HTML above, and some CSS definitions below, you will make this plain checkbox look like a sliding toggle instead. Don't worry if you find the CSS styles a little overwhelming. You can just copy and paste for now, and examine the details later!

### Style your toggle

Copy the following CSS into `global.css` to style the HTML input that will create the toggle switch:

```css
// src/styles/global.css
.toggle {
  margin-top: 2em;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 20px;
}

/* Hide default HTML checkbox */
.switch input {
  -webkit-appearance: none;
  appearance: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  border-radius: 20px;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: var(--toggler-color);
  border-radius: 50%;
  transition: .4s;
}

input:checked + .slider {
  background-color: #fff;
}

input:checked + .slider::before {
  transform: translateX(26px);
}

```

### Add CSS styling for each theme

To make your toggler, text and background different colors in each theme, define some CSS variables.

1. Define style colors for both a light (default) and dark theme in `global.css`. You can choose your own, or copy and paste:

    ```css title="src/styles/global.css"
    /* Default Light Mode Theme */
    :root, [data-theme="default"] {
      --body-bg-color: #E2CAF1;
      --text-color: #333;
      --toggler-color: #fff;
    }

    /* Dark Mode Theme */
    [data-theme="dark"] {
      --body-bg-color: #0D0950;
      --text-color: #fff;
      --toggler-color: #333;
    }
    ```

2. Edit your existing CSS so that both the text and background colors for your entire website are defined by CSS variables, which now depend on your theme choice:

    ```diff title="src/styles/global.css"
    body {
    -  background-color: #E2CAF1;    
    +  background-color: var(--body-bg-color);
    +  transition: background-color .45s ease-in;    
    }

    + * {
    +  color: var(--text-color);
    + }
    ```

3. Visit your site in your browser preview and click the theme toggle. Notice what does or does not change!

    Now, you have a styled HTML element at the top of your page, under your navigation links. It is still functionally a checkbox, so clicking on it does *something.* (Remember, an HTML checkbox can toggle between displaying an empty box and a checked box.) But, an HTML input element can only change its own appearance. 

    You will need JavaScript to monitor whether the toggle switch has been clicked, and then change the properties of *other* HTML elements in response.

### Add client-side interactivity

To provide **client-side JavaScript** (interactivity that can be prompted by the user), use a `<script>` tag in an Astro component template. 

#### Using JS in script tags

1. Add the following `<script>` tag in `src/layouts/BaseLayout.astro`:

    ```diff
    // src/layouts/BaseLayout.astro
    + <script>
    +   document.getElementById('toggler').addEventListener('change', (event) => {
    +     event.target.checked 
    +       ? document.body.setAttribute('data-theme', 'dark')
    +       : document.body.removeAttribute('data-theme')
    +   });
    + </script>
    </body>
    ```

    This script "listens" for a change to the checkbox, and sets or removes a `data-theme` dark mode attribute to the page `<body>` in response.

2. Check your browser preview at `localhost:3000` and click the theme toggle. Verify that you can change between light and dark modes.

    Your site now has an interactive UI element, thanks to a `<script>` tag in your HTML template!

:::note
Although you have already used some JavaScript to build parts of your site (e.g. mapping through a list of skills on the About page, fetching information from your Markdown files, creating page routes dynamically), those commands are all executed **at build time to create static HTML for your site**, and then the code is "thrown away." 

This is the first JavaScript for your site that is sent to the browser, and is available to run, and re-run, based on user interactions like refreshing a page or toggling an input.
:::

#### Importing a `.js` file

Just like you can refactor parts of your template into smaller Astro components, you can also move the contents of `<script>` tags into separate `.js` files. Then, you can import that file into your `<script>` tag.


1. Create `src/scripts/toggle-theme.js` (you will have to create a new folder) and move your JavaScript into it.

    ```js
    // src/scripts/toggle-theme.js
    document.getElementById('toggler').addEventListener('change', (event) => {
        event.target.checked 
        ? document.body.setAttribute('data-theme', 'dark')
        : document.body.removeAttribute('data-theme')
    });
    ```

2. Replace the contents of the `<script>` tag in `BaseLayout.astro` with this file import (note the relative location used, as with other imports from files within your project).

    ```astro
    // src/layouts/BaseLayout.astro
    <script>import '../scripts/theme-toggle.js'</script>
    ```

3. Check your browser preview again and verify that the theme toggle still works. 

:::note[limitations]
Although this toggle works on every page, your theme choice does not persist across pages or page refreshes. Writing the toggle state to `localStorage` is one way you can add this functionality to your website, but it is beyond the scope of this introductory tutorial.
:::

### Test your knowledge

Fill in the blanks with the following terms:  **code fences**, **build-time**, **written or imported**, **browser**, **JavaScript**, 

|| **JavaScript** || is a programming language that can add dynamic and interactive elements to websites.  Astro uses JavaScript first at || **build-time** || to create your site (e.g. to build dynamic routes, to map over arrays of data to display lists, to fetch data and to define variables). Then, Astro can optionally send JavaScript to the || **browser** || (also known as client-side JavaScript) which allows users to interact with your website and change parts of your built site (e.g. toggling switches, clicking on buttons).

In Astro, JavaScript that is only meant to build your site is written between the || **code fences** ||, is run on a server (e.g. Netlify), and then discarded once your site is published. JavaScript that is meant to control interactive elements on your site is || **written or imported** || between open and close `<script>` tags.

### Checklist for moving on

<Checklist key="theme">
- [ ] I can create small Astro UI components and include them on multiple pages by importing and using them in a layout.
- [ ] I can define CSS variables, and update my existing CSS to use them.
- [ ] I can add client-side interactivity on my site by writing JavaScript within a `<script>` tag
- [ ] I can write JavaScript in a `.js` file elsewhere within my project `src`, and import it into a `<script>` tag.
</Checklist>

### Resources

- [Client-side `<script>` in Astro](/en/core-concepts/astro-components/#client-side-scripts)

- [CSS Variables and How to Use Them](https://www.freecodecamp.org/news/what-are-css-variables-and-how-to-use-them/) <Badge>external</Badge>

---

## Responsive Navigation

BY THE END OF THIS SECTION YOU WILL HAVE:

- used component-based design principles to create a responsive Header for your site

- used semantic HTML tags to write clearer, more accessible, code

- used mobile-first, responsive design principles to style your Header component for different screen sizes

- written a `<script>` to allow your site visitor to open and close the navigation menu

### Using modern design principles

Astro was designed to help you to build projects using modern design principles, including **component-based composition** and **mobile-first responsiveness**. 

As a superset of HTML, Astro syntax also encourages you to build with **semantic HTML tags** that give your browser (and other developers!) key information about the purpose and content of the elements on your page. 

Sketching all these elements out first, in **pseudocode** can also be helpful to organize your thoughts and provide a roadmap. Let's see what it looks like to build with these ideas in mind!

### Header Component

1. Create a new Header component.

    <details>
    <summary>Give me more specific instructions!</summary>

    Create a file named `Header.astro` in `src/components/`
    </details>

2. Use semantic HTML elements to create the pattern of a `<nav></nav>` nested inside a `<header><header/>`.

    <details>
    <summary>Show me the code!</summary>

    ```astro
    ---
    // src/components/Header.astro
    ---
    <header>
      <nav>
      </nav>
    <header>
    ```
    </details>


3. Import and add two components: a "coming soon" `<Hamburger />` component and your existing `<Navigation />` component inside the `<nav>`. 

    Don't worry about the fact that you haven't built the Hamburger component yet. This is another example of writing **pseudocode**: code that simply reveals our intentions first, allowing us to add details later. So, don't bother to check your browser preview yet. It won't work!

    <details>
    <summary>Show me the code!</summary>

    ```astro
    ---
    // src/components/Navigation.astro
    import Hamburger from '../components/Hamburger.astro';
    import Navigation from '../components/Navigation.astro';
    ---
    <header>
      <nav>
        <Hamburger />
        <Navigation />
      </nav>
    <header>
    ```
    </details>

### Hamburger Component

1. Create the missing `<Hamburger />` component.

    <details>
    <summary>Give me more specific instructions!</summary>

    Create a file named `Hamburger.astro` in `src/components/`
    </details>

2. Copy the following code into your component. This will represent your 3-line "hamburger" menu to open and close your navigation links on mobile. (You will add new CSS styles to your `.global.css` later.)

    ```astro
    ---
    // src/components/Hamburger.astro
    ---
    <div class="hamburger">
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
    </div>
    ```

### Navigation Component

1. Update `Header.astro` in preparation for using CSS styles to create a responsive, mobile header. Wrap the existing navigation links in a `<div> ` with the class `nav-links`.

    <details>
    <summary>Show me the code!</summary>

    ```astro
    ---
    // src/components/Header.astro
    ---
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/blog">Blog</a>
    <div>
    ```
    </details>


### CSS

1. Copy the CSS styles below into `global.css`. These styles:

    - create lines for the hamburger menu
    - style and position the navigation links for mobile
    - include an `expanded` class that can be toggled to display or hide the links on mobile
    - use a `@media` query to define different styles for larger screen sizes

    Note that responsive, mobile-first desgin starts by defining what should happen on small screen sizes first. Then, styles are adjusted to accommodate larger screen sizes. This is because smaller screen sizes require simpler layouts. If you design the complicated case first, then you have to work backwards to try to make it simple again.

    ```css
    // src/styles/global.css
    /* nav styles */
    .nav {
      align-items: center;
      padding-top: 20px;
    }

    .hamburger {
      padding-right: 20px;
      cursor: pointer;
    }

    .hamburger .line {
      display: block;
      width: 40px;
      height: 5px;
      margin-bottom: 10px;
      background-color: var(--text-color);
    }

    .nav-links {
      width: 100%;
      top: 5rem;
      left: 48px;
      background-color: #ff9776;
      display: none;
      margin: 0;
    }

    .nav-links a {
      display: block;
      text-align: center;
      padding: 10px 0;
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: bold;
      text-transform: uppercase;
    }

    .nav-links a:hover, a:focus {
      background-color: #ff9776;
    }

    .expanded {
      display: unset;
    }

    @media screen and (min-width: 636px) {
      .nav-links {
        margin-left: 5em;
        display: block;
        position: static;
        width: auto;
        background: none;
      }

      .nav-links a {
        display: inline-block;
        padding: 15px 20px;
      }

      .hamburger {
        display: none;
      }
    }
    ```

2. Check your browser preview at `localhost:3000` and verify that your header is now styled!

    Resize your window and look for different styles being applied at different screen widths. Your header is now **responsive** to screen size! `@media` queries allow the appearance to update dynamically, but the CSS classes do not change, meaning that it will always have one single appearance at each screen size.

### Script

Your header is not yet **interactive** because it can't respond to user input, like clicking on the hamburger menu to show or hide the navigation links. You need to add a `<script>` tag to provide client-side JavaScript to "listen" for this user event and then change an element's CSS styles accordingly.

1. Add a second `<script>` tag to `BaseLayout.astro`

    ```diff
    // src/layouts/BaseLayout.astro
      <script src='../scripts/theme-toggle.js'></script>
    + <script>
    +   document.querySelector('.hamburger').addEventListener('click', () => {
    +     document.querySelector('.nav-links').classList.toggle('expanded');
    +   });
    + </script>
    ```

    This script reacts to the `<Hamburger />` component being clicked, and toggles the CSS class of the`<Navigation />` component.

2. Check your browser preview again at various sizes, and verify that you have a working navigation menu that is both responsive to screen size and responds to user input.

### Test your knowledge

Answer the following multiple choice questions:

1. Mobile-first is a popular modern web design strategy because

    <MultipleChoice>
      <Option>
        many people will visit your website using their phones.
      </Option>
      <Option>
        mobile screen sizes are smaller, and this allows us to start with the most essential elements in a simple layout first, and prioritize important site features and interactions.
      </Option>
      <Option>
        cell phones may be less powerful than computers, requiring mobile versions of your site to be more scaled-back than desktop versions. It is easier to add complexity (e.g. hover states, additional panels).
      </Option>
      <Option>
        websites that have been designed **for mobile viewing** will naturally look better on mobile, and visitors will have more confidence in your organization or company if your site looks and feels fully-functional.
      </Option>
      <Option isCorrect>
        all of the above! In fact, there is no good reason *not* to design mobile-first!📱
      </Option>
    </MultipleChoice>

2. Which of the following is **not** an example of a semantic HTML element:

    <MultipleChoice>
      <Option>
        `<header>` 
        <!-- This is a semantic tag. It tells you about its specific usage or purpose. -->
      </Option>
      <Option isCorrect>
        `<div>`
        <!-- Correct! This element doesn't tell you very much about its purpose. -->
      </Option>
      <Option>
        `<article>` 
        <!-- This is a semantic tag. It tells you about its specific usage or purpose. -->
      </Option>
      <Option>
        `<section>` 
        <!-- This is a semantic tag. It tells you about its specific usage or purpose. -->
      </Option>
      <Option>
        `<aside>` 
        <!-- This is a semantic tag. It tells you about its specific usage or purpose. -->
      </Option>
    </MultipleChoice>

### Checklist for moving on

<Checklist key="nav">
- [ ] I can use semantic HTML tags instead of generic ones to better describe my code. 
- [ ] I can think about mobile-first, responsive design principles when creating my website.
- [ ] I can use multiple `<script>` tags in the same Astro component.
</Checklist>

### Resources

- [Component-based Design](https://www.droptica.com/blog/component-based-design/) <Badge>external</Badge>

- [Semantic HTML Tags](https://www.dofactory.com/html/semantics) <Badge>external</Badge>

- [Mobile-first Design](https://www.mobileapps.com/blog/mobile-first-design) <Badge>external</Badge>

---

## Using Other Frameworks in Astro

BY THE END OF THIS SECTION YOU WILL HAVE:

- used the `astro add` command to add an official integration (Preact) to your site

- created two UI Framework components (using Preact) and rendered them on an Astro page

- used different `client:directives` to customize the JavaScript hydration of your framework components, and renered a component with no directive at all to compare the output

Astro components are **templating components only**, so they require `<script>` tags to execute JavaScript in the browser. 

But, Astro can also render components from other popular UI frameworks, like the one above. For each individual UI framework component, Astro can individually and selectively execute **its** JavaScript, its own island, with a `client:directive` component attribute.

### Add a UI Framework Component

1. Quit the dev server (`CTRL + C`) to have access to the terminal. Then, type the following command to automatically add the ability to use Preact components in your Astro project:

    ```shell
    npx astro add preact
    ```

2. Follow the command line instructions to confirm (Y) two times -- once to add Preact to your `astro.config.mjs` file configuration, and then once to install the package itself.

3. Create a new file in `src/components/` named `Greeting.jsx`

    Note the `.jsx` file extension used by Preact. This file will be written in JSX, not Astro syntax. You can even add existing `.jsx` files from other projects directly in to your Astro project (though, some libraries and external packages may not be supported).

### Preact Greeting Banner

This component will randomly select a greeting from an array received as props, and render it in a welcome message.

1. Add the following code to the `Greeting.jsx` file you created in the previous section.

    ```jsx
    // src/components/Greeting.jsx
    import { h } from 'preact'

    export default function Banner({messages}) {
      const greeting = messages[(Math.floor(Math.random() * 4))];
      return (
        <h3>{greeting}! Thank you for visiting!</h3>
      );
    }
    ```

2. Import and use this component in your component template on your Home page `index.astro`:

    ```diff
    ---
    // src/pages/index.astro
    import BaseLayout from '../layouts/BaseLayout.astro';
    + import Greeting from '../components/Greeting.jsx';
    ---
    <BaseLayout title="Home Page">
      <h2>My awesome blog subtitle</h2>
    + <Greeting messages={["Hi", "Hello", "Howdy", "Hola"]} />
    </BaseLayout>
    ```

    Notice that this component, like many of your Astro components, *uses* JavaScript to render HTML. But, it doesn't necessarily **need** any JavaScript sent to the client because your user will not interact with it. 

    To generate a single random message chosen every time your site builds, this Preact component functions exactly like an Astro component.

    However, you **can** add a `client:load` attribute on your component which will cause the component to execute, and the message to update, on every page rerender, just like it would do in a typical JavaScript SPA (single page application).

3. Add a second `<Greeting />` component with the `client:load` directive.

    ```diff
    ---
    // src/pages/index.astro
    import BaseLayout from '../layouts/BaseLayout.astro';
    import Greeting from '../components/Greeting.jsx';
    ---
    <BaseLayout title="Home Page">
      <h2>My awesome blog subtitle</h2>
      <Greeting messages={["Hi", "Hello", "Howdy", "Hola"]} />
    + <Greeting client:load messages={["Hi", "Hello", "Howdy", "Hola"]} />
    </BaseLayout>
    ```

    To see the difference in behaviour, you will need to view your built site, live on the web.

4. Commit your current progress to GitHub, and wait for Netlify to automatically build and republish your site to the web.

5. Visit your live website at your `netlify.app` URL. Refresh the page several times and compare the two greeting messages. 

#### Analyze the Pattern

Consider an Astro component with the following code:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import AstroBanner from '../components/AstroBanner.astro';
import PreactBanner from '../components/PreactBanner.jsx';
import SvelteCounter from '../components/SvelteCounter.svelte';
---
<BaseLayout>
  <AstroBanner />
  <PreactBanner />
  <PreactBanner client:load />
  <SvelteCounter />
  <SvelteCounter client:visible />
</BaseLayout>
```

1. Which of the five components will be **hydrated**, sending JavaScript to the client?

    || `<PreactBanner client:load />` and `<SvelteCounter client:visible />` will be hydrated. ||

2. In what way(s) will the two `<PreactBanner />` components be the same? In what way(s) will they be different? 

    || Same: They both render the same HTML elements and look the same. Different: One will be generated at build time and will not rerender until your site is rebuilt. It will show the same message until your site is rebuilt. The one with a client directive will reload on every page refresh, showing a new message each time. ||

3. If you couldn't see your website's code, only the live published page, how would you tell which `<SvelteCounter />` component used a `client:directive`? 

    || Try clicking the buttons, and see which one is interactive. The one that is interactive has a client directive. ||


### Preact Quote Generator

This component is interactive, written using Preact using popular hooks like `useState()` and `useEffect()`. It fetches a random quotation from an external API on page refresh, and also in response to a button click.

1. Copy the code below and paste it into a new file named `Quote.jsx` in `src/components`:

    ```jsx
    // src/components/Quote.jsx 
    import { h } from 'preact';
    import { useState, useEffect } from 'preact/hooks';

    export default function Quotable() {
      const [data, setData] = useState(null);

      async function updateQuote() {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        setData(data);
      }

      useEffect(() => {
        updateQuote();
      }, []);

      if (!data) return null;

      return (
        <div>
          <figure>
            <blockquote>{data.content}</blockquote>
            <figcaption>— {data.author}</figcaption>
          </figure>
          <button onClick={updateQuote}>New Quote</button>
        </div>
      );
    }
    ```

2. Import and add this component to your Home page at `index.astro`.

    ```diff
    ---
    // src/pages/index.astro 
    import BaseLayout from '../layouts/BaseLayout.astro';
    import Greeting from '../components/Greeting.jsx';
    + import Quote from '../components/Quote.jsx';
    ---
    <BaseLayout title="Home Page">
      <h2>My awesome blog subtitle</h2>
      <Greeting messages={["Hi", "Hello", "Howdy", "Hola"]} />
      <Greeting client: load messages={["Hi", "Hello", "Howdy", "Hola"]} />
    + <Quote client:only="preact" />
    </BaseLayout>
    ```

3. Check your browser preview at `localhost:3000` and verify that your component automatically fetches a random quotation on page load, and in response to clicking the <kbd>New Quote</kbd> button.

4. Commit your changes to GitHub and wait for Netlify to automatically build and republish your site to the web.

5. Visit your live website at your `netlify.app` URL. Refresh the page several times and click the <kbd>New Quote</kbd> button and verify that both events fetch a new random quotation from the API.

### Test your knowledge

Choose whether each of the following statements describes Astro `<script>` tags, UI framework components or both.

1. They provide interactive UI elements on your website.

    <MultipleChoice>
      <Option>
        Astro `<script>` tags
      </Option>
      <Option>
        UI framework components
      </Option>
      <Option isCorrect>
        both
      </Option>
    </MultipleChoice>

2. They allow you to "try out" a new framework without requiring you to start an entire new project using that tech stack.

    <MultipleChoice>
      <Option>
        Astro `<script>` tags
      </Option>
      <Option isCorrect>
        UI framework components
      </Option>
      <Option>
        both
      </Option>
    </MultipleChoice>

3. They can be reused on multiple pages by adding them to several Astro components, and/or in an Astro layout component.

    <MultipleChoice>
      <Option>
        Astro `<script>` tags
      </Option>
      <Option>
        UI framework components
      </Option>
      <Option isCorrect>
        both
      </Option>
    </MultipleChoice>

4. They allow you to bring components you have written in other frameworks and drop them right into your site.

    <MultipleChoice>
      <Option>
        Astro `<script>` tags
      </Option>
      <Option isCorrect>
        UI framework components
      </Option>
      <Option>
        both
      </Option>
    </MultipleChoice>

5. They allow you to create a fully-functional, interactive and dynamic website without needing to know or learn any other JavaScript frameworks.

    <MultipleChoice>
      <Option isCorrect>
        Astro `<script>` tags
      </Option>
      <Option>
        UI framework components
      </Option>
      <Option>
        both
      </Option>
    </MultipleChoice>

### Checklist for moving on

<Checklist key="framework">
- [ ] I can install an Astro integration using the command `astro add` in the terminal.
- [ ] I can write UI framework components in their own language, with their own native extention then import and use them in `.astro` components alongside my Astro components.
- [ ] I can choose whether to use a `client:directive` to control hydration on my UI framework component, depending on when I want its JavaScript to run.
- [ ] I can make an interactive element on my website by using either JavaScript inside a `<script>` tag, or by writing and hydrating a UI framework component.
</Checklist>

### Resources

- [Astro Integrations Guide](/en/guides/integrations-guide/)

- [Using UI Framework Components in Astro](/en/core-concepts/framework-components/#using-framework-components)

- [Astro client directives reference](/en/reference/directives-reference/#client-directives)
