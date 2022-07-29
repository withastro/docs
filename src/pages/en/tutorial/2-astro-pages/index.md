---
layout: ~/layouts/TutorialLayout.astro
title: Astro Pages
description: Creating, styling and navigating between Astro pages.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
---

BY THE END OF THIS SECTION YOU WILL HAVE:
- created new Astro pages (About, Blog) for your site that are full HTML documents
- added content to an Astro page using HTML elements
- defined variables in Astro frontmatter and used them in the component template
- added scoped styling to an Astro page using Astro's `<style>` tags


Now that you have a working site on the web, let's add pages and content to make it your own!

### Summary

In this section, you will add new pages and content to your Astro website using your code editor in your workspace, either locally on your computer, or in your online cloud workspace.

Before writing any code, you will open your code editor and use its terminal to run Astro in **dev (development) mode** so that can preview your changes while you work. Using the **continuous integration/deployment** system we set up with GitHub and Netlify, any updates you **commit and push** (save) to your project's online repository at GitHub will be automatically discovered by Netlify and re-published to the web.

You will learn about the **two sections of a `.astro` file** and how they work together to create the content for a **single page** on your website. Want to make a new page? You'll add a new `.astro` file to your project!
| `.astro` Section | Language used | contents |
|---|---|---|
| Script (frontmatter) | JavaScript/TypeScript | imports, variables, functions...
| Template (body) | Astro (HTML with additional JSX-like features) | HTML elements, components

[.astro file example image, annotated]

### Test your knowledge

You want to add a new page to your website. Number the following steps in the correct order to explain how this happens:

|| &nbsp &nbsp 4 &nbsp &nbsp || Netlify will re-build my website including any updates, and deploy it at my URL.

|| &nbsp &nbsp 2 &nbsp &nbsp || I will create a new `.astro` file using my code editor.

|| &nbsp &nbsp 1 &nbsp &nbsp || I open my project in my code editor and run Astro in dev mode to see a live preview of my changes.

|| &nbsp &nbsp 3 &nbsp &nbsp || I will commit and push my changes to my repository stored on GitHub.


### Checklist for moving on

<Checklist key="pages">
- [ ] I am ready to make some new pages for my Astro website!
</Checklist>

## Creating new pages

BY THE END OF THIS SECTION YOU WILL HAVE:
- added two new pages to your website by creating two new `.astro` files
- added navigation links to access each page of your site from all pages
- committed your changes to GitHub
- deployed a new version of your website at your `.netlify.app` web address

Now that you know what has to happen to create a new page on your website, let's do it!

### Create a new `.astro` file

1. In the files pane of your code editor, navigate to the filepath `src/pages/` where you will see the existing file `index.astro`

2. In that same folder, create a new file named `about.astro`.

3. Copy, or retype the contents of `index.astro` into your new `about.astro` file.

    :::note
    Your editor might show a solid white circle on the tab label for this file. This means that the file is not yet "saved." Under the File menu, enable "Auto Save" and you should no longer need to save any files manually.
    :::

4. Add `/about` to your website preview's URL and check that you can see a page load there. 

    🖥️ `https://localhost:3000/about`

    🌐 e.g. `https://sdkelkk--github--3000.localwebcontainer.io/about` or `https://dfewi.sse.codesandbox.io/about`)

Right now, your "About" page should look exactly the same as the first page, but we're going to change that!

### Edit your page

Edit the HTML content to make this page about you!

The content you can see on your about page is determined by the HTML elements **rendered** between `<body></body>`. For the rest of this section of this tutorial, all HTML will be written between these `<body></body>` tags. You will leave the other code untouched.

To change or add more content, add more HTML element tags containing content. You can copy and paste the HTML code below between the existing `<body></body>` tags, or create your own!

```astro
<!-- src/pages/about.astro -->

<!-- <body> -->
  <h1>About Me</h1>
  <h2>... and my new Astro site!</h2>

  <p>I am working through Astro's introductory tutorial. This is the second page on my website, and it's the first one I built myself!</p>

  <p>This site will update as I complete more of the tutorial, so keep checking back and see how my journey is going!</p>
<!-- </body> -->
```

Now, visit your `/about` page in your browser tab again, and you should see your updated content!

### Add Navigation Links

To make it easier to preview all your pages, add HTML page navigation links at the top of both of your pages (`index.astro` and `about.astro`):

```diff
+ <a href="/">Home</a>
+ <a href="/about/">About</a>

<h1>About Me</h1>
<h2>... and my new Astro site!</h2>
```

Visit your site preview in your browser (at `localhost:3000` if you are developing locally) and check that you can click these links to move back and forth etween pages.

:::note
Astro uses standard HTML `<a>` elements to navigate between routes. There is no `<Link>` component.
:::

### Try It Yourself!

Can you add a third page `blog.astro` to your site, following the [same steps as above](#create-a-new-astro-file)? Try it now!

(Don't forget to add a third navigation link to every page!)

<details>
<summary>Show me the steps.</summary>
1. Create a new file at `src/pages/blog.astro`.
2. Copy the entire contents of `index.astro` and paste them into `blog.astro`.
3. [Add a third navigation link](#add-navigation-links) to the top of every page:

```diff
  <a href="/">Home</a>
  <a href="/about/">About</a>
+ <a href="/blog/">Blog</a>
```
</details>

You should now have a website with three pages that all link to each other. Let's add some content to the Blog page.

Update the page content (under your navigation links) at `blog.astro` with:
```astro
<!-- src/pages/blog.astro -->
<h1>My Astro Learning Blog</h1>
<p>This is where I will post about my journey learning Astro.</p>
```

Preview your entire site by visiting all three pages in your browser preview and check that:
- every page correctly links to all three pages
- your two new pages each have their own descriptive title 
- your two new pages each have their own paragraph text

Now, you have a three-page website!

### Publish your changes to the web
When you are happy with the way your preview looks, and you want to publish your changes to your live website, you will **commit** your changes to your online repository at GitHub. 

1. See a list of any files that have changed since your last commit to GitHub. 

    🖥️ Go to the Source Control tab in VS Code

    🌐 CodeSandbox: Go to the GitHub tab.  (n/a in StackBlitz: Press the Commit button.) 

    You should see `about.astro` and `blog.astro` listed as files that have changed.

2. Enter a commit message (e.g. "Added two new pages - about and blog") in the text box, and press `CTRL+Enter` to commit the change to your current workspace. (n/a in StackBlitz: Enter a commit message and click "Commit.")
3. Click the button to "Sync Changes" to GitHub. (n/a in StackBlitz)
4. After waiting a few minutes, visit your Netilify URL to verify that your changes are published live.

[Can add a link to more info re checking builds/deployment on Netlify.com]

:::tip[commit and deploy regularly]
Follow these steps every time you stop working! Your changes will be updated in your GitHub repository, and your Netlify website will be rebuilt and republished.
:::

### Test your knowledge

Fill in the blanks with: ~~ **HTML** ~~ **`<body></body>`** ~~  **`src/pages/`** ~~ **copying and pasting** ~~

To make a new page I need to first create a new `.astro` file in the || **`src/pages/`** || folder. Then, I need to make sure that file contains a full || **HTML** || document so that the web browser can display its content properly. 

If I am unsure what to write, can always start by || **copying and pasting** || the entire contents of an existing file, then editing content between the || **`<body></body>`** || tags to give my new page its own page content.


### Checklist for moving on

<Checklist key="script">
- [ ] I can open my project and run the dev server to start working on it.
- [ ] I can create a new page for my website, and link to it from an existing page.
- [ ] I can commit my changes back to GitHub, and verify that my live website at Netlify has updated.
</Checklist>

### Resources

[File-based Routing in Astro](/en/core-concepts/astro-pages/#file-based-routing)

[Astro page HTML](/en/core-concepts/astro-pages/#page-html)


## Writing dynamic HTML

BY THE END OF THIS SECTION YOU WILL HAVE:
- defined variables in your `about.astro` file's script and then used them in its HTML template
- rendered a combination of static and dynamic content on your About page
- used values defined in script to conditionally render HTML elements on your About page

Now that you have a multi-page website with HTML content, let's add some **Astro Script**!

Any HTML file is valid Astro language. You can write any text inside HTML elements and Astro will render that **static** (unchanging) content to the page. But, you can do more with Astro than just regular HTML!

We will use the top part of our `.astro` file, the component script, to add **dynamic** content to our page. This is content that depends on and is determined by **values defined elsewhere**, not static text typed directly into your element.


### Define and use a variable

Open `about.astro` which should look like this:

```astro
// src/pages/about.astro
---

---
<html lang="en">
    <head>
        <meta charset ="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Astro</title>
    </head>
    <body>
        <a href="/">Home</blog>
        <a href="/about/">About</blog>
        <a href="/blog/">Blog</blog>
        <h1>About Me</h1>
        <h2>... and my new Astro site!</h2>

        <p>I am working through Astro's introductory tutorial. This is the second page on my website, and it's the first one I built myself!</p>

        <p>This site will update as I complete more of the tutorial, so keep checking back and see how my journey is going!</p>
    </body>
</html>
```

1. Add the following line of JavaScript to your Astro script (at the top of your file, between the **code fences**):

    ```astro
    ---
    // src/pages/about.astro
    const pageTitle = "About Me"
    ---
    ```

2. Replace the static "About Me" heading in the body of your HTML with the dynamic variable `{pageTitle}`.

    ```diff
    <!-- src/pages/about.astro -->
    - <h1>About Me</h1>
    + <h1>{pageTitle}</h1>
    ```

3. Check the live preview of your `/about` page
Your site should look the same! 

Instead of typing text directly into HTML tags, you just **defined and used a variable** in the two sections of your `.astro` file, respectively.

> **Define** variables in your Astro script using JavaScript or TypeScript expressions.
>
>
> **Use** these variables in your Astro template inside curly braces { } to tell Astro you're using some script.

> Astro script syntax is similar to JSX syntax. If you're ever wondering how to use your script, then searching for how it is done in JSX is probably a good starting point!


### Script expressions

1. Add the following lines to your component script to **define variables**:

    ```astro
    ---
    // src/pages/about.astro
    const goal = 3
    const time = "days"
    const happy = true
    const finished = false
    ---
    ```

2. Then, add the following Astro syntax using these variables to your component template, below your existing `<p>` tags:

    ```astro
    <!--  src/pages/about.astro -->
    <p>I want to finish this tutorial in {goal} {time}.</p> 
    <p>But, it's ok if it takes me twice as long, and I finish in {goal*2}!</p>
    ```

3. Check the site preview in your browser, and you should now see these two new sentences appear:

    > - I want to finish this tutorial in 3 days.
    > - But, it's ok if it takes me twice as long, and I finish in 6!

#### Analyze the patterns
1. How do you **define a value** for use inside an Astro component?

    || _use a `const` statement in the component script, between the code fences_ ||

2. Which pair of symbols tells Astro that you want to **use script** instead of plain text inside your HTML elements?

    || _curly braces_ ||

### Conditional Rendering

You can also use your script variables to choose **whether or not** to render individual elements of your HTML `<body>` content:

Add the following lines of Astro within the `<body></body>` tags of `about.astro`, below your existing paragraphs.

Then, check the live preview in your browser tab to see what is **rendered** to the page:

```astro
<!--  src/pages/about.astro -->
{happy && <p>I am happy to be learning Astro!</p>}

{finished && <p>I finished this tutorial!</p>}

{goal === 3 ? <p>My goal is 3 days.</p> : <p>My goal is not 3 days.</p>}
```
:::note
Regular JavaScript patterns and expressions will work in Astro!
:::

Commit your changes to GitHub before moving on. Do this any time you want to save your work and update your live website!

### Test your knowledge:
Given the following `.astro` script:
```astro
---
operatingSystem = "Linux"
quantity = 3
clothing = "shoes"
student = false
---
```

1. For each Astro template expression, write out trhe HTML output that will be rendered in the browser:
```astro
a. <p>{operatingSytem}</p> 
```
||  `<p>Linux</p>` ||

```astro
b. {student && <p>I am still in school.</p>}
```
|| nothing! ||

```astro
c. <p>I have {quantity+8} pairs of {clothing}</p>
```
||  `<p>I have 11 pairs of shoes</p>` ||

```astro
d. {operatingSystem === "MacOS" ? <p>I am using a Mac.</p> : <p>I am not using a Mac.</p>}
```

|| `<p>I am not using a Mac.</p>` ||

### Checklist for moving on

<Checklist key="dynamic">
- [ ] I can define values in my Astro script and render these values in HTML elements.
- [ ] I can conditionally render entire HTML elements using JavaScript expressions and logical operators.
</Checklist>

### Resources

[Dynamic expressions in Astro](/en/core-concepts/astro-components/#jsx-expressions)


## Common JavaScript patterns

BY THE END OF THIS SECTION YOU WILL HAVE:
- defined objects and arrays in your Astro script
- displayed object properties and array items on a page
- used the JavaScript `map()` function to render a list of items from an array

Now that you can define and use values to render dynamic content, let's explore some common rendering patterns!

Using Astro syntax, we can also render values from objects and arrays defined in our Astro script.

We will use more complicated data values in our script and JavaScript functions to render even more dynamic content.

### Objects and Arrays

You can also render objects and arrays defined in Astro script.

Open `about.astro` which should look like this:

```astro
---
// src/pages/about.astro
---
<html lang="en">
  <head>
    <meta charset ="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro</title>
  </head>
  <body>
    <a href="/">Home</blog>
    <a href="/about/">About</blog>
    <a href="/blog/">Blog</blog>
    <h1>My Astro Learning Journey</h1>

    <p>This is where I will blog about my journey learning Astro.</p>
  </body>
</html>
```

1. Using what you learned in the last lesson, write the necessary JavaScript between the code fences to **dynamically render** your Blog page's title. (Define and use `pageTitle`.) Check your results in your browser preview. The page should look exactly the same!

1. Add the following lines of JavaScript to your Astro script, between the **code fences**:

(You can customize the code for yourself, but this tutorial will use the following example.)

    ```astro
    ---
    // src/pages/about.astro
    const identity = {
        firstName: "Sarah",
        country: "Canada",
        occupation: "Technical Writer",
        hobbies: ["photography", "birdwatching", "baseball"],
    }
    ---
    ```

2. Underneath your existing paragraph, within the `<body></body>` tags, add the following code:

    ```astro
    <!-- src/pages/about.astro -->
    <p>Here are a few facts about me:<p>
    <ul>
        <li>{My name is {identity.firstName}}</li>
        <li>{I live in {identity.country} and I work as a {identity.occupation}}</li>
        {identity.hobbies.length >=2 && 
            <li>{Two of my hobbies are: {identity.hobbies[0]} and {identity.hobbies[1]}}</li>
        } 
    </ul>
    ```

3. Check the live preview of your `/about` page to see your changes.


### Rendering Multiple Items with `map()`

In the example above, you rendered list itmes in an unordered list using values from an object. You wrote out each individual line item, and referenced the values to be listed.

This time, we will use JavaScript's `map()` function to go through each item in an array, and return the same HTML element (`<li></li>`) for each item, all in one expression.

1. Add the following line to your component script which defines an array of skills:

    ```astro
    ---
    const skills = ["HTML", "CSS", "JavaScript", "React", "Astro", "Writing Docs"]
    ---
    ```

2. Then, add the following Astro code to your HTML template, below your existing content:

    ```astro
    <!-- src/pages/about.astro -->
    <p>My skills are:<p>
    <ul>
        {skills.map( (skill) => <li>{skill}</li>}
    </ul>
    ```
3. Check the site preview in your browser, and you should now see a list of all the skills defined in your script:

    > My skills are:
    > - HTML
    > - CSS
    > - JavaScript
    > - React
    > - Astro
    > - Writing Docs

Not ony did you save time by not typing out the entire list, but your code is shorter and you might find it easier to read or change in the future!

### Writing JavaScript in your Astro Script

So far, you have defined values in your code fences, but you can write any legal JavaScript (or TypeScript) there, too! Let's move some JavaScript we have already written in our HTML template up into the code fences.

1. In `about.astro` and look for the following line of code:

    ```astro
    <!-- src/pages/about.astro -->
    <p>{But, it's ok if it takes me twice as long, and I finish in {goal*2}!}</p>
    ```

2. Replace the JavaScript calculation `goal*2` with the value `double`.

    ```astro
    <p>{But, it's ok if it takes me twice as long, and I finish in {double}!}</p>
    ```

3. Define `double` in your component script as `goal*2`

    ```astro
    ---
    // src/pages/about.astro
    const double = goal*2
    ---
    ```

    :::note
    You can define `double` anywhere in the list of all the other values you are defining in `about.astro`, as long as it is **after you have defined `goal`** (so that the calculation `goal * 2` makes sense.)
    :::

4. Go back and check your browser preview, and you should see that the page still looks the same. 

It didn't matter whether your JavaScript calculation occured in the Astro script, or in the HTML template. In your `.astro` file, both places can contain JavaScript.

But, notice that you do **not need curly braces** when you write your JS within the code fences. Everything written in your Astro script section is JavaScript.

You will only use (and, you **must** use) curly braces when you are writing JavaScript expressions in the HTML template of your `.astro` file. Curly braces tell Astro that you are writing JavaScript in your template instead of plain HTML.

#### KEY TAKEAWAYS
1. Writing an Astro template is very much like **writing HTML**.
2. With a little JavaScript knowledge, you can **dynamically render** content efficiently.
3. You can use all modern Javascript **logical operators**, **expressions** and **functions** in either section of your `.astro` file.

Make any changes or additions you want to the content of your Blog and About page by adding HTML elements, either statically or dynamically. When you are happy with this page, commit your changes to GitHub before moving on to the next lesson.

### Test your knowledge

Fill in the blanks with: **expressions** ~~ **curly braces** ~~ **objects and values** ~~ **JavaScript** 

`.astro` files have two sections: one where || **JavaScript** || is assumed, and one where you must use || **curly braces** || to tell Astro when you are writing JavaScript.

Even though plain HTML is all you need to write in your `.astro` files, Astro lets you define || **objects and values** ||, and supports all modern JavaScript logical operators, || **expressions** || and functions.

### Checklist for moving on

<Checklist key="jsx">
- [ ] I can define objects and arrays in my Astro script and render their contents in HTML elements.
- [ ] I can use the JavaScript `map()` function to iterate over an array and produce the same HTML element for each one. 
</Checklist>

### Resources

[Astro syntax vs JSX - comparison](/en/comparing-astro-vs-other-tools/#astro-vs-jsx)

## Using scoped and global styles

BY THE END OF THIS SECTION YOU WILL HAVE:
- Used Astro `<style></style>` tags to style items on the page
- Defined and used CSS variables using `define:vars` directive
- Applied some styles globally by adding a `global.css` file

Now that you have more content on your page, let's style it!

Using Astro's own `<style></style>` tags, you can style items on your page. Adding *attributes* and *directives* gives you even more ways to style!

### Styling an Individual Page

1. Copy the following code and paste it into `src/pages/about.astro` immediately after the code fence, before the `<html>` tag:

    ```astro
    <!-- src/pages/about.astro -->
    <style>
        h1 {
            color: purple;
        }
    </style>
    ```

    Check all three pages in your browser preview. Which color is the page title of:

    - your Home page?  || _black_ ||
    - your About page? || _purple_ ||
    - your Blog page? || _black_ ||

    :::tip
    If you are unable to determine colors visually, you can use the dev tools in your browser to inspect the `<h1>` title elements and verify the text color applied!
    :::

2. Copy the following code and past it into `src/pages/blog.astro` immediately after the code fence, before the `<html>` tag:

    ```astro
    <!-- src/pages/about.astro-->
    <style>
        .skill {
          color: green;
          font-weight: bold;
        }
    </style>
    ```

    Visit your blog page in your browser and you should not notice any changes. That's because there are no HTML elements with the class name of `skill` yet.

3. Update your unordered list of skills on your blog page by adding the class name `skill` to the generated line items. Your code should now look like this:

    ```astro
    <!-- src/pages/about.astro -->
    <p>My skills are:<p>
    <ul>
        {skills.map( (skill) => <li class="skill">{skill}</li>)}
    </ul>
    ```

    Visit your blog page in your browser again, and verify, through visual inspection or through dev tools, that each item in your list of skills is now green and bold.

### CSS Variables
The Astro `<style>` tag can also reference any variables from your component script using the `define:vars={...}` directive. You can **define variables** within your code fence, then use them in your style tag.

1. Add the following code into the component script of `src/pages/about.astro`

    ```astro
    ---
    const skillColor = "green";
    ---
    ```

2. Update your existing `<style>` tag below to define, then use this `skillColor` variable.

    ```astro
    <!-- src/pages/about.astro -->
    <style define:vars={{skillColor}}>
        .skill {
          color: var(--skillColor);
          font-weight: bold;
        }
    </style>
    ```

3. Check your Blog page in your browser preview, and and once again, you should not notice any changes! The color green is still being applied, but now through the `define:vars` directive.

### Try it Yourself!
 
 Update the `<style>` tag on your Blog page so that it matches the one below. Then, add any missing variable definitions in your component script so that your new `<style>` tag successfully applies these styles to your list of skills:
 - the text color is green
 - the text is bold
 - the items are in all-caps (all uppercase letters)
 - the list bullets are asterisks (*)
```astro
<!-- src/pages/blog.astro -->
<style define:vars={{skillColor, fontWeight, textCase, bulletStyle}}>
    .skill {
       color: var(--skillColor);
       font-weight: var(--fontWeight);
       text-transform: var(--textCase);
    }
    ul::li marker {
        content: var(--bulletStyle);
    }
</style>
```
[ANSWER]
```astro
---
// src/pages/blog.astro

const skillColor = "green"
const fontWeight = "bold"
const textCase = "uppercase"
const bulletStyle = "*"
---
```
### Global Styles
You have seen that the Astro `<style>` tag is **scoped by default**, meaning that it only affects the elements in its own file. But, you will probably want some styles defined globally, throughout your entire project. 

There are a few ways to do this in Astro, but in this tutorial, we will create and import a `global.css` file into each of our pages. This combination of stylesheet and `<style>` tag gives us the ability to control some styles site-wide, and to apply some specific styles exactly where we want them.

1. Create a new file at the location `src/styles/global.css` (You may have to create a new folder first.)

2. Copy the following code into your new file, `global.css`

    ```astro
    <!-- src/styles/global.css -->
    html {
        background-color: #00539F;
    }
    body {
        background-color: #E2CAF1;
        margin: 0 auto;
        width: 80%;
        max-width: 80ch;
        padding: 1em;
        border: 5px solid black;
    }

    h1 {
        margin: 0;
        padding: 20px 0;
        color: #00539F;
        text-shadow: 3px 3px 1px grey;
    }
    ```

    ```astro
    ---
    // src/pages/about.astro

    import '../styles/global.css'
    ---
    ```

4. Check the browser preview of your About page, and you should now see new styles applied!

### Try it Yourself
Add the necessary line of code to your project to apply your styles to every page of your site!

<details>
<summary>Show me the code!</summary>
1. Add the following import statement to the two other page files: `src/pages/index.astro` and `src/pages/blog.astro`

```astro
---
// src/pages/index.astro
import '../styles/global.css'
---
```
</details>
 

### Analyze the Pattern
Your About page is now styled using *both* the imported `global.css` file *and* a `<style>` tag.

- Are styles from both styling methods being applied? 

    || Yes ||

- Are there any conflicting styles, and if so, which are applied?

    || Yes, `h1` is defined as black globally, but purple locally in the `<style>` tag. The purple color is applied.  ||

- Describe how `global.css` and `<style>` work together.

    || When conflicting styles are defined both globally and in a page's local `<script>` tag, the local styles will often overwrite any global styles. Always visually inspect your site to make sure your styles are properly applied!  ||

- How would you choose whether to declare a style in a `global.css` file or a `<style>` tag?

    || If you want a style to be applied site-wide, you would choose to use a `global.css` file. However, if you want styles to apply to only a single component, and not affect other elements on your site, you would choose a `<style>` tag. ||

### Checklist for moving on:

<Checklist key="style">
- [ ] I can add CSS styles to HTML elements on a page using an Astro `<style>` tag.
- [ ] I can use variables from my component script in my CSS to style elements on the page.
- [ ] I can define global CSS styles in a `.css` file located elsewhere in my project, and I understand how they work with local `<style>` tags.
</Checklist>

### Resources

[Astro `<style>` tag](/en/guides/styling/#styling-in-astro)

[CSS variables in Astro](/en/guides/styling/#css-variables)
