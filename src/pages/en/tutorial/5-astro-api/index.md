---
layout: ~/layouts/TutorialLayout.astro
title: Working with Data
description: Fetching and using data from project files to dynamically generate page content and routes.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
  import Goals from '~/components/tutorial/Goals.astro';
  import MultipleChoice from '~/components/tutorial/MultipleChoice.astro';
  import Option from '~/components/tutorial/Option.astro';
---

<Goals>
  - used `Astro.glob()` to fetch data about all your Markdown files at once and create a blog post archive
  - generated multiple pages with a single Astro component with dynamic route paramaters using `getStaticPaths()`
  - created an RSS feed for your blog at `rss.xml`
</Goals>

Now that you have some blog posts, let's use Astro's API to add some typical blog features!

### Summary

Astro's runtime API gives you access to some handy, pre-made functions you can use for common blog features like making a list of all your posts, creating individual pages for each blog post tag, and creating an RSS feed so that users can subscribe to your new posts in a feed reader. 

The functions you will see in this unit are `Astro.glob()` which allows you to access multiple files of your site at the same time, and `getStaticPaths()` which allows you to multiple create pages (route paths) on your site from one single file. Then you will use Astro's provided `rss()` function which uses both of these to create your blog's feed.

### Test your knowledge

Match the Astro global function with the task it performs for you:

1. `rss()` || C ||   -    A. loads the information from multiple files at once into your Astro component script

2. `Astro.glob()` || B || -  B. generates multiple pages on your website from one single file

3. `getStaticPaths()` || A || - C. creates an RSS .xml document that can be interpreted by feed readers

### Checklist for moving on

<Checklist>
- [ ] I am ready to add some blog features to my Astro project!
</Checklist>

---

## Fetching and using local files

<Goals>
  - used `Astro.glob()` to fetch content from all your Markdown (`.md`) files at once
  - used the array returned by `Astro.glob()` to render a sorted list of posts on your Blog page
  - refactored each post listing into a `<PostItem />` component imported and rendered on your blog page
</Goals>

Now that you have a few blog posts to list, let's configure the Blog page to create the list automatically!

### Use `Astro.glob()` to fetch data

In order to generate a list of all your blog posts, we'll need information about all your Markdown files.

Add the following code into the Astro component script of `blog.astro` which will fetch information about every `.md` file located in `src/pages/posts/`:

```astro
---
// src/pages/blog.astro

const allPosts = await Astro.glob('../pages/posts/*.md');
---
```

### Dynamically render blog post titles

1. In your Astro component template, change the title of your first blog post to be **dynamically generated** using the array returned by `Astro.glob()` with the following expression:

    ```diff
    // src/pages/blog.astro

      <ul>
    -   <li><a href="/posts/post-1">Post 1</a></li>    
    +   <li><a href="/posts/post-1">{allPosts[0].frontmatter.title}</a></li>
        <li><a href="/posts/post-2">Post 2</a></li>
        <li><a href="/posts/post-3">Post 3</a></li>
      </ul>
    ```

2. Check your browser preview and verify that your page content did not change. 

    Your title is now being generated dynamically, using the `title` property of the first blog post (`[0]`) returned by the `Astro.glob()` request.

3. Make the same update for Post 2 and Post 3. Remember that the items in arrays are numbered starting at zero!

### Dynamically render a list of posts

1. To generate the entire list dynamically, and not just the titles, replace your individual `<li>` tags with the following Astro code:

    ```diff
    // src/pages/blog.astro
      <ul>  
    -   <li><a href="/posts/post-1">{allPosts[0].frontmatter.title}</a></li>
    -   <li><a href="/posts/post-2">{allPosts[1].frontmatter.title}</a></li>
    -   <li><a href="/posts/post-3">{allPosts[2].frontmatter.title}</a></li>

    +   {allPosts.map((post) => <li><a href="post.url">{post.frontmatter.title}</a></li>)}
      </ul>
    ```

2. Check your browser preview and verify that your page content did not change.

    Your entire list of blog posts is now being generated dynamically, by mapping over the array returned by `Astro.glob()`.

3. Add a new blog post by creating a new `post-4.md` file in `src/pages/posts/` and including frontmatter properties for `layout`, `title` and `date`. (You may choose to include more properties, or to copy and paste the entire content of an existing `.md` file.)

4. Revisit your blog page in your browser preview at `localhost:3000/blog` and look for an updated list with four items, including your new blog post!

### Challenge: Create a BlogPost component

Try on your own to make the all necessary changes to your Astro project so that you can use the following code to generate your list of blog posts:

```diff
// src/pages/blog.astro

<ul>
-   {allPosts.map((post) => <li><a href="post.url">{post.frontmatter.title}</a></li>)}
+   {allPosts.map((post) => <BlogPost title={post.frontmatter.title} url={post.url}/>)}
</ul>
```

<details>
<summary>Expand to see the steps</summary>

1. Create a new component in `src/components/`.

    <details>
    <summary>Show the filename</summary>
    ```
    BlogPost.astro
    ```
    </details>

2. Write a line in your component script so that this component will be able to receive the necessary `Astro.props`, as written in the example.

    <details>
    <summary>Show the code</summary>
    ```astro
    ---
    // src/components/BlogPost.astro
    const { title, url } = Astro.props
    ---
    ```
    </details>

3. Add the templating used to create each item in your blog post list.

    <details>
    <summary>Show the code</summary>
    ```astro
    <!-- src/components/BlogPost.astro -->
    <li><a href={url}>{title}</a></li>
    ```
    </details>

4. Import the new component into your Blog page.

    <details>
    <summary>Show the code</summary>
    ```astro
    // src/pages/blog.astro
    ---
    import BlogPost from '../components/BlogPost.astro'
    ---
    ```
    </details>

5. Check Yourself: see the finished component code.

    <details>
    <summary>Show the code</summary>
    ```astro
    ---
    // src/components/BlogPost.astro
    const { title, url } = Astro.props
    ---
    <li><a href={url}>{title}</a></li>
    ```
    </details>
</details>

### Test your knowledge

Write the syntax corresponding to the following descriptions of data returned by 

```astro
---
const myPosts = await Astro.glob('../pages/posts/*.md');
---
```

1. The title of the third blog post.  

    || `myPosts[2].frontmatter.title` ||

2. The text "First Post!!" linking to the URL of the first blog post. 

    || `<a href={myPosts[0].url}>First Post!!</a>` ||

3. A LastUpdated component (written inside `myPosts.map()` ) that receives a blog post's date as props 

    || `<LastUpdated date={post.frontmatter.date} />` ||


### Checklist for moving on

<Checklist key="glob">
- [ ] I can use `Astro.glob()` to return an array of all `.md` files in a specified directory.
- [ ] I can access the data returned by `Astro.glob()` to dynamically render values from my Markdown files.
- [ ] I can refactor my template to reduce duplication, by mapping over an array instead of listing each item individually.
- [ ] I can replace HTML templating with a custom component, and pass values received from `Astro.glob()` to it as props using component attributes.
</Checklist>

### Resources

- [`Astro.glob()` API documentation](/en/reference/api-reference/#astroglob)

---

## Generating pages dynamically

<Goals>
  - generated multiple page routes dynamically from a single Astro component
  - used `[bracket]` notation to identify the dynamic route parameter
  - exported a `getStaticPaths()` function to specify exactly which paths will be pre-rendered
</Goals>

### Dynamic Page Routing

Just like you used `Astro.glob()` to generate a list of all blog posts, you can create entire sets of pages dynamically using `getStaticPaths()`. This function written in an Astro component script returns an array of page routes, and all of the pages at those routes will use the same component template.

To start, you will create a **static** page for an individual blog tag. And then, you will convert this `.astro` file that builds one single page into a file that creates multiple routes dynamically: one for every blog tag you use on the site.

#### Create a static page placeholder

1. Create a new file at `src/pages/tags/` (you will make a new folder) with the filename `tag.astro` and add the following code:

    ```astro
    ---
    // src/pages/tags/tag.astro

    import BaseLayout from '../../layouts/BaseLayout.astro';
    let title = "tag"; 
    ---
    <BaseLayout title={title}>
      <p>Posts tagged with {title}</p>
    </BaseLayout>
    ```

2. Visit `localhost:3000/tags/tag` in your browser (or add `/tags/tag` to the end of your preview URL) and verify that you have a new page on your site.

### Create a Dynamic Page

1. Convert this static route (one file -> one page) to a dynamic route (one file -> many pages) by
    - **renaming the page to `[tag].astro`** (add brackets around the word "tag")
    - **exporting a `getStaticPaths()` function** in the component script.

    ```diff
    ---
    // src/pages/posts/tags/[tag].astro

    import BaseLayout from '../../layouts/BaseLayout.astro';

    + export async function getStaticPaths({ }) {
    +   return[
    +    {params: {tag: "astro"}},
    +    {params: {tag: "sucesses"}},
    +    {params: {tag: "community"}},
    +    {params: {tag: "learning in public"}}
    +   ]
    + }

    - let title = "tag"; 
    + const { tag } = Astro.params
    + let title = tag; 
    ---
    <BaseLayout title={title}>
      <p>Posts tagged with {title}</p>    
    </BaseLayout>
    ```

2. Visit `localhost:3000/tags/astro` in your browser preview and you should see a page, generated dynamically from `[tag].astro`. Check that you also have pages created at `/tags/successes`, `/tags/community`, and `/tags/learning%20in%20public`. 

    Each of these pages uses the same component template to create what you see on the page, which means they each have access to their parameter value of `tag` for that page, but nothing else... yet!

    In addition to defining a parameter for each route, let's give each page some props.

3. Add code to your `getStaticPaths()` function in order to make data from all your blog posts available to each page route.

    Be sure to give each route in your array the new props, and then make those props available to your component template outside of your function.

    ```diff
    // src/pages/posts/tags/[tag].astro

      export async function getStaticPaths({}){
    +  const allPosts = await Astro.glob('../posts/*.md');

      return [
        {params: {tag: "astro"}, props: {posts: allPosts}},
        {params: {tag: "sucesses"}, props: {posts: allPosts}},
        {params: {tag: "community"}, props: {posts: allPosts}},
        {params: {tag: "blogging"}, props: {posts: allPosts}},
        {params: {tag: "setbacks"}, props: {posts: allPosts}},
        {params: {tag: "learning in public"}, props: {posts: allPosts}}
      ]
    }

    + const { posts } = Astro.props
      const { tag } = Astro.params
    ```

### Analyze the pattern

For each of the following, state whether the code is written **inside** the `getStaticPath()` function, or **outside** of it, in your component script.

1. The `Astro.glob()` call to receive information about all your `.md` files to pass to each page route.

    <MultipleChoice>
    <Option isCorrect>inside `getStaticPaths`</Option>
    <Option>outside `getStaticPaths`</Option>
    </MultipleChoice>

2. The list of routes generated (returned) by `getStaticPaths()`

    <MultipleChoice>
    <Option isCorrect>inside `getStaticPaths`</Option>
    <Option>outside `getStaticPaths`</Option>
    </MultipleChoice>

3. Definitions of values to be used by each individual page in the component template.

    <MultipleChoice>
    <Option>inside `getStaticPaths`</Option>
    <Option isCorrect>outside `getStaticPaths`</Option>
    </MultipleChoice>

:::note[Takeaway]
To **give** information to a page route, write it **inside** `getStaticPaths()`.

To **use** information in the HTML template of a page route, write it **outside** `getStaticPaths()`.
:::

### Using props in dynamic routes

Now you can update your HTML template to include information from each blog post. 

1. To render a list of all posts on each of the dynamically-generated tag pages, add the following code to the template of `[tag].astro`:

    ```diff
    <!-- src/pages/posts/tags/[tag].astro -->

    <BaseLayout title={title}>   
      <p>Posts tagged with {title}</p>
    +  <ul>
    +    {posts.map(post => <li><a href={post.url}>{post.frontmatter.title}</a></li>)}
    +  </ul>
    </BaseLayout>
    ```

2. You can even refactor this to use your `<BlogPost />` component instead! (Don't forget to import this component at the top of `[tag].astro`, along with your layout, so that you can use it.)

    ```diff
    <!-- src/pages/posts/tags/[tag].astro -->

    <BaseLayout title={title}>
      <p>Posts tagged with {title}</p>
      <ul>
    -   {posts.map(post => <li><a href={post.url}>{post.frontmatter.title}</a></li>)}        
    +   {posts.map(post => <BlogPost url={post.url} title={post.frontmatter.title}/>)}
      </ul>
    </BaseLayout>
    ```

3. Check your browser preview and you should now see a list of all your blog posts on every tag page. 

    But, that's not very helpful! you would like to display only the posts that contain that particular tag.


### Advanced: Showing only posts with matching tags

:::note
Even if it looks challenging, try following along with the steps to build this function yourself! But, if you don't feel up for a little JavaScript right now, you can skip ahead to the [finished version of the code](#final-code-sample) and add it directly to your project.
:::

Let's start by planning out the steps.

Replace your existing `getStaticPaths()` with the following **pseudocode** (a description in words of what you would _like_ your code to do, but not the actual code to execute) in your `getStaticPaths()` function:

```astro
---
// src/pages/posts/tags/[tag].astro

export async function getStaticPaths() {
  // 1. Retrieve data from all Markdown posts.
 
  // 2. Create a new `Set` for holding all the tags used on the blog.
  
  // 3. Loop through all the Markdown files, and add any tags found to the Set of tags.

  // 4. Turn your Set of tags into an array you can map through.

  // 5. For each tag, filter for the blog posts that include it, then return
  //    the name of the tag (for defining the parameters your page route)
  //    an array of posts that include the tag (to be passed as props).
}
---
```
We will tackle each piece individually. Some of the steps you have already seen

#### Constructing `getStaticPaths()`

We have five tasks written in pseudocode to turn into code. Some will be shorter, and some will be longer.  Some of them you will be familiar with, but some of them might be new to you. That's OK! By the end, you'll have working code that you can inspect further if you need to.

Remember, each of these sections of code will be written _inside_ your `getStaticPaths()` function, in the order they appear.

#### 1. Retrieve data from all Markdown posts

This should look familiar! You have written this line of code before:

```js
// src/pages/posts/tags/[tag].astro

  // 1. Retrieve data from all Markdown posts.
  const allPosts = await Astro.glob('../pages/posts/*.md');
```

#### 2. Create a `Set` that will hold your tags

A `Set` is a JavaScript object that is a collection of unique items. It is similar to an array, but it igores repeats. Some of your blog posts may have the same tags (e.g. "learning in public"). But, you want to be able to list all the unique tags, only once each. 

```js
// src/pages/posts/tags/[tag].astro

  // 2. Create a new `Set` for holding all the tags used on the blog.
  const allTags = new Set();
```

#### 3. Add each post’s tags to your new `Set`

Because a `Set` ignores repeated values, you can add safely add every tag from every post to it. For each post, you will map through its collection of tags, and add every tag to your new tag set. Notice that you are mapping with in a map!

```js
// src/pages/posts/tags/[tag].astro

  // 3. Loop through all the Markdown files, and add any tags found to the Set of tags.
  allPosts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => allTags.add(tag));
  });
```

#### 4. Convert your `Set` of unique tags into an array

Creating and adding to a `Set` ensures you don't have any duplicates, but an array is useful for mapping through and using those items.

```js
// src/pages/posts/tags/[tag].astro

  // 4. Turn your Set of tags into an array you can map through.
  let uniqueTags = Array.from(allTags);
```

#### 5. Define the `return` value of the `getStaticPaths` function

What you want "returned" to us from any `getStaticPaths` function is an object containing `params` (what you should call each page route) and any `props` (data that you want passed into those pages), just like you had earlier in this lesson.

We still want each tag name to become a page on your website. But now, instead of listing out individually each page route's object to be returned, you want this list of objects to be generated automatically by mapping through all of your tags.

And, you want each of those page routes to "know about" only the blog posts that include that tag. So you also have to filter the posts before sending as props.

Complete the final section of pseudocode with the code below:

```js
// src/pages/posts/tags/[tag].astro

  // 5. For each tag, filter for the blog posts that include it, then return
  //    the name of the tag (for defining the parameters your page route)
  //    an array of posts that include the tag (to be passed as props).
  return uniqueTags.map((tag) => {
    const taggedPosts = allPosts.filter((post) => post.frontmatter.tags.includes(tag));
    return {
      params: { tag },
      props: { posts: taggedPosts },
    };
  });
```

### Final code sample

To check your work, or if you just want complete, correct code to copy into `[tag].astro`, here is what your Astro component should look like:

```astro
---
// src/pages/tags/[tag].astro

import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogPost from '../../components/BlogPost.astro'

export async function getStaticPaths() {
  const allPosts = await Astro.glob('../posts/*.md');
  const allTags = new Set();
  
  allPosts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => allTags.add(tag));
  });
  
  const uniqueTags = Array.from(allTags);

  return uniqueTags.map((tag) => {
    const taggedPosts = allPosts.filter((post) => post.frontmatter.tags.includes(tag));
    return {
      params: { tag },
      props: { posts: taggedPosts },
    };
  });
}

const { posts } = Astro.props;
const { tag } = Astro.params;

let title = tag; 
---
<BaseLayout title={title}>
  <p>Posts tagged with {title}</p>
  <ul>
    {posts.map((post) => <BlogPost url={post.url} title={post.frontmatter.title}/>)}
  </ul>
</BaseLayout>
```

Now, you should be able to visit any of your tag pages in your browser preview! 

Navigate to `localhost:3000/tags/community` and you should see a list of only your blog posts with the tag `community`. Similarly `localhost:3000/tags/learn%20in%20public` should display a list of the blog posts tagged `learning in public`.

In the next section, you will use `Astro.glob()` again to build a page that will generate a list of every tag, with each tag each linking to its own page, automatically.

### Test your knowledge

Match the following terms with their description

1. parameter || D || -  A. a function you can write inside an Astro component script that returns an array of page routes that can receive props.

2. psuedocode || E || -  B. in Astro, the process of creating multiple page routes from one function

3. dynamic routing || B || - C. a JavaScript object that is a collection of unique, non-repeating items

4. `getStaticPaths ()` || A || - D. a value that defines the name of a page route generated dynamically

5. `Set` || C || -  E. an informal way of writing code, not meant to be executed by machines

### Checklist for moving on

<Checklist key="parameter">
- [ ] I generate pages dynamically, using one `[parameter].astro` file to generate several pages on my site.
- [ ] I can pass `props` to each page route, and use these props in the common page template.
- [ ] I can plan my steps in pseudocode, creating a roadmap for future work.
</Checklist>

### Resources

- [Dynamic Page Routing in Astro](/en/core-concepts/routing/#dynamic-routes)

- [`getStaticPaths()` API documentation](/en/reference/api-reference/#getstaticpaths)

---

## Build a Tag Index Page

<Goals>
  - created a new page using the `/tags/index.astro` routing feature to list all your blog tags
  - used JavaScript to work with data received from an `Astro.glob()` call
  - used a `<style>` tag within a `<BaseLayout>` commponent to style elements in the page
  - updated your site with navigation links to this new Tags page
</Goals>

Now that you have an individual page for every tag, let's make a page to list all the tags and link to them!

### Page routes using `/folder/index.astro`

We used Astro's dynamic routing to create multiple pages, one for each tag, with the file `src/pages/tags/[tag].astro`. But, to create a web page with a tags list at `/tags`, you only need one single page. 

We know you can add a page to your website by creating a new file at `src/pages/tags.astro`. But, since you already have the directory `/tags/`, you can take advantage of another routing pattern in Astro, and keep all your files related to tags together.

1. Create a new file `index.astro` in the directory `src/pages/tags/`.

2. Navigate to `localhost:3000/tags` and verify that your site now contains a page at this URL. It will be empty, but it will exist!

3. Import and render your `<BaseLayout />` component to give this page your basic template. Give this page an appropriate `title`.

4. Try to create `src/pages/tags/index.astro` yourself! You have done this before!

    <details>
    <summary>See the code</summary>

    ```astro
    ---
    // src/pages/tags/index.astro

    import BaseLayout from '../../layouts/BaseLayout.astro';
    let title = 'Tag Index'
    ---
    <BaseLayout title={title}>
    </BaseLayout>
    ```
    </details>

5. Check your browser preview again and you should have a styled page, ready to add content to!


### Create an array of tags

You have already displayed items in a list from an array. You could add `const tags = ["astro","sucesses", "community", "setbacks", "learning in Public"]` to your component script to create a list of all your tags. But, then you would need to come back to this file and update your array every time you use a new tag in a future blog post.

Fortunately, you already know a way to grab the data from all your Markdown files in one line of code!

1. In `src/pages/tags/index.astro`, add the line of code to the component script that will give your page component access to the all frontmatter values in every `.md` file.

    <details>
    <summary>See the code</summary>
    ```diff
    ---
    // src/pages/tags/index.astro
      import BaseLayout from '../../layouts/BaseLayout.astro';
    +  const allPosts = await Astro.glob('../posts/*.md');
      let title = 'Tag Index'
    ---
    ```
    </details>

2. Add the following line of JavaScript at the bottom of your component script. This uses the information from `Astro.glob()` and return an array of all the tags it finds after mapping over all the `tags` properties from your Markdown files:

    ```js
    // src/pages/tags/index.astro
    const tags = [...new Set(allPosts.map((post) => post.frontmatter.tags).flat())];
    ```

    <details>
    <summary>Tell me what this line of code is doing in more detail!</summary>

    It's OK if this isn't something you would have written yourself yet! 

    It does something similar to what you did in the last section to get a list of tags without any duplication.

    It goes through each Markdown post, one-by-one, and combines each array of tags into one single larger array. Then, it makes a new `Set` from all the individual tags it found (to ignore repeated values). Finally, it turns that set into an array (with no duplications), that you can use to show a list of tags on your page.
    </details>

### Create your list of tags

With the array `tags` in your component script, you can render its list items in your page template, just as you have done before. 

This time, instead of creating one `<li></li>` for every item inside a main `<ul>`, create one `<p>` for each item, inside a `<div>`. The pattern should look familiar!

1. Add the following code to your component template:

    ```diff
    <!-- src/pages/tags/index.astro -->
      <BaseLayout title={title}>
    +   <div>
    +     {tags.map((tag) => (
    +       <p><a href={`/tags/${tag}`}>{tag}</a></p>
    +      ))}
    +    </div>
      </BaseLayout>
    ```

### Adding Styles

1. Add the CSS class of `tags` to the `div` above, and add the CSS class of `tag` to each `<p>` that will be generated. Note: Astro uses HTML syntax for adding class names! 

    ```astro
    <!-- src/pages/tags/index.astro -->
    <div class="tags">
    ```

    ```astro
    <!-- src/pages/tags/index.astro -->
    <p class="tag">
    ```

2. Add the following `<style>` tag within your `<BaseLayout>`:

    ```astro
    <!-- src/pages/tags/index.astro -->
    <style>
      a {
        color: #00539F;
      }
            
      .tags {
        display: flex; 
        flex-wrap: wrap; 
        margin: 0 auto;  
      }

      .tag {
        margin: 0.25em;
        border: dotted 1px #a1a1a1;
        border-radius: .5em;
        padding: .5em 1em;
        font-size: 1.15em;
        background-color: #F8FCFD;
      }
    </style>
    ```

3. Check your browser preview at `localhost:3000/tags` and verify that you have some new styles, and that each of the tags on the page has a working link.

### Final code sample

To check your work, or if you just want complete, correct code to copy into `src/pages/tags/index.astro`, here is what your Astro component should look like:

```astro
---
// src/pages/tags/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';

const allPosts = await Astro.glob('../posts/*.md');
const tags = [...new Set(allPosts.map((post) => post.frontmatter.tags).flat())];
let title = 'Tag Index';
---
<BaseLayout title={title}>
  <style>
    a {
      color: #00539F;
    }

    .tags {
      display: flex; 
      flex-wrap: wrap; 
      margin: 0 auto;  
    }

    .tag {
      margin: 0.25em;
      border: dotted 1px #a1a1a1;
      border-radius: .5em;
      padding: .5em 1em;
      font-size: 1.15em;
      background-color: #F8FCFD;
    }
   </style>

   <div class="tags">
      {tags.sort().map((tag) => (
        <p class="tag"><a href={`/tags/${tag}`}>{tag}</a></p>
      ))}
    </div>
</BaseLayout>
```

### Linking to this page

Right now, you can navigate to `localhost:3000/tags` and see this page. From this page, you can click on links to your individual tag pages.

But, you still need to make these pages discoverable from other pages on your website.

1. In your `Navigation.astro` component, follow the existing pattern to also include a link to this new tag index page.

    <details>
    <summary>Show me the code</summary>
    ```diff
    ---
    //src/components/Navigation.astro
    ---
      <a href="/">Home</a>
      <a href="/about/">About</a>
      <a href="/blog/">Blog</a>
    + <a href="/tags/">Tags</a>
    ```
    </details>

### Adding a tag list to each post

To make it even easier for readers to navigate your site, you can also display a list of each post's own tags. You have already built this on the Tag index page, so you can copy and paste your existing work.

Remember, to make changes that should appear on **all** your blog pages, you will edit your layout. Follow the steps below on your own, and then check your work by comparing it to the [final code sample](#final-code-sample-2).

1. Go to `src/pages/tags/index.astro` and copy the `<style>` tag. Paste it inside `MarkdownPostLayout.astro`.

2. Go back to `src/pages/tags/index.astro`  copy the entire `<div>`... `</div>` that renders your list of tags. Paste it into `MarkdownPostLayout.astro` just above the `<slot />` to display a list of tags above your blog post content.

Before this code will work, you need to make **one small edit**. Can you figure out what it is?

<details>
<summary>Give me a hint</summary>

How are the other properties received as props (e.g. title, author etc.) written in your layout template? How does your layout render content from an individual blog post?
</details>

<details>
<summary>Give me another hint!</summary>

In order to use props (values passed) from a `.md` blog post in your layout, like tags, you need to prefix the value with a certain word.

<details>
<summary>Show me the code!</summary>

```astro
    {content.tags.map((tag) => (
        <p class="tag"><a href={`/tags/${tag}`}>{tag}</a></p>
    ))}
```
</details>
</details>

### Final code sample

To check your work, or if you just want complete, correct code to copy into `MarkdownPostLayout.astro`, here is what your Astro component should look like:

```astro
---
// src/layouts/MarkdownPostLayout.astro

import BaseLayout from './BaseLayout.astro';
const {content} = Astro.props;
--- 
<BaseLayout title={content.title}>
  <style>
    a {
      color: #00539F;
    }

    .tags {
      display: flex; 
      flex-wrap: wrap; 
      margin: 0 auto;  
    }

    .tag {
      padding: .5em 1em; 
      margin: 0.25em; 
      font-size: 1.15em; 
      background-color:#F8FCFD; 
      border: dotted 1px #a1a1a1; 
      border-radius: .5em;
    }    
  </style>

  <p><em>{content.description}</em></p>
  <p>{content.pubDate.slice(0,10)}</p>
  <h1>{content.title}</h1>

  <p>Written by: {content.author}</p>

  <img src={content.postImage} width="300" /> 

  <div class="tags">
    {content.tags.map((tag) => (
      <p class="tag"><a href={`/tags/${tag}`}>{tag}</a></p>
    ))}
  </div>

  <slot />
</BaseLayout>

```

### Test your knowledge

Match each file path with a second file path from the list below that will create a page at the same route:

1. `src/pages/categories.astro` - || `/src/pages/categories/index.astro` ||

2. `src/pages/posts.astro` -  || `/src/pages/posts/index.astro` ||

3. `src/pages/products/shoes/index.astro` - || `src/pages/products/shoes.astro` ||

`src/pages/products/shoes.astro`, `src/pages/posts/post.astro` ,  `/src/pages/posts/index.astro`, `src/pages/products/shoes/`, `/src/pages/categories/index.astro`

### Checklist for moving on

<Checklist key="tags">
- [ ] I can use Astro's `/pages/folder/index.astro` routing feature to create static pages.
- [ ] I can add and fully integrate a new page to my Astro site, using features I have used previously including:
  - using `Astro.glob()` to fetch data about all my `.md` files
  - rendering HTML dynamically from values defined in my component script
  - adding styles to my page
  - updating my site navigation to include this new page
</Checklist>

### Resources

- [Static Routing in Astro](/en/core-concepts/routing/#static-routes)

---

## Add the Astro package for RSS

<Goals>
  - installed an Astro package for creating an RSS feed for your website
  - created a new file `rss.xml.js` that can be subscribed to and read by RSS feed readers
</Goals>

### Installing Astro's RSS package

Astro provdes a custom package to quickly add an RSS feed to your website. This official package generates a document with information about all of your blog posts that can be read by **feed readers** like Feedly, The Old Reader and more. This document is updated everytime your site is rebuilt. (Remember, this happens automatically when you commit to GitHub and Netlify rebuilds and redeploys your site.) 

Users can subscribe to your feed in a feed reader, and receive notification when you publish a new blog post on your site, making it a popular blog feature!

1. Quit the Astro development server by pressing `CTRL + C` to give you access to commands in the terminal.

2. Run the following command in the terminal to install Astro's RSS package, and wait for the package to successfully install.

    ```shell
    npm install @astrojs/rss
    ```

3. Restart the dev server to begin working on your Astro project again.

    ```shell
    npm run dev
    ```

### Create an `.xml` feed document

1. Create a new file in `src/pages/` called `rss.xml.js`

2. Copy the following code into this new document, replacing the `site` property with your site's own unique Netlify URL (You can customize the `title` and `description` properties, too!):

    ```js
    // src/pages/rss.xml.js

    import rss from '@astrojs/rss';

    export const get = () => rss({
      title: 'Astro Learner | Blog',
      description: 'My journey learning Astro',
      site: 'https://my-blog-site.netlify.app',
      items: import.meta.glob('./**/*.md'),
      customData: `<language>en-us</language>`,
    });
    ```

3. Vist `localhost:3000/rss.xml` (or, add `/rss.xml` to the end of your URL preview in your browser) and verify that you can see (unformatted!) text on the page with an `item` for each of your `.md` files. Each item shoud contain information such as `title`, `url` and `description`.

    If you want to see what your RSS feed looks like, you can download a feed reader, or sign up for an online feed reader service and subscribe to your site by adding the address `https://my-blog-site.netlify.app/rss.xml` using your own Netlify URL. You can also share this link with others so they can subscribe to your posts, and keep up with your journey learning Astro!

### Test your knowledge

Fill in the blanks with **dev server**, **packages**, **`npm run dev`**, **install**:

Astro has several official || **packages** || that can be installed via the terminal command line to extend a project. To access the command line in my code editor, I can quit the || **dev server** || by pressing `CTRL-C`. Then, I can type the appropriate || **install** || command for any Astro package and follow the instructions.

To begin working on my website again, I can type || **`npm run dev`** || like I do every time I start a new working session.

### Checklist for moving on

<Checklist key="rss">
- [ ] I can install an Astro integration using the command line.
- [ ] Create an RSS feed for my website that users can subscribe to using a feed reader.
</Checklist>

### Resources

- [RSS item generation in Astro](/en/guides/rss/#1-importmetaglob-result)
