---
layout: ~/layouts/MainLayout.astro
---

## Goals

BY THE END OF THIS SECTION YOU WILL HAVE:

- used `Astro.glob()` to fetch content from all your Markdown (`.md`) files at once

- used the array returned by `Astro.glob()` to render a sorted list of posts on your Blog page

- refactored each post listing into a `<PostItem />` component imported and rendered on your blog page

Now that you have a few blog posts to list, let's configure the Blog page to create the list automatically!

## Use `Astro.glob()` to fetch data

In order to generate a list of all your blog posts, we'll need information about all your Markdown files.

Add the following code into the Astro component script of `blog.astro` which will fetch information about every `.md` file located in `src/pages/posts/`:

```astro
---
const allPosts = await Astro.glob('../pages/posts/*.md');
---
```

### Dynamically render blog post titles

2. In your Astro component template, change the title of your first blog post to be **dynamically generated** using the array returned by `Astro.glob()` with the following expression:

```diff
    <ul>
-       <li><a href="/posts/post-1">Post 1</a></li>    
+       <li><a href="/posts/post-1">{allPosts[0].frontmatter.title}</a></li>
        <li><a href="/posts/post-2">Post 2</a></li>
        <li><a href="/posts/post-3">Post 3</a></li>
    </ul>
```

3. Check your browser preview and verify that your page content did not change. 

Your title is now being generated dynamically, using the `title` property of the first blog post (`[0]`)returned by the `Astro.glob()` request.

4. Make the same update for Post 2 and Post 3. Remember that the items in arrays are numbered starting at zero!

### Dynamically render a list of posts

1. To generate the entire list dynamically, and not just the titles, replace your individual `<li>` tags with the following Astro code:
```diff
    <ul>  
-       <li><a href="/posts/post-1">{allPosts[0].frontmatter.title}</a></li>
-       <li><a href="/posts/post-2">{allPosts[1].frontmatter.title}</a></li>
-       <li><a href="/posts/post-3">{allPosts[2].frontmatter.title}</a></li>

+       {allPosts.map((post) => <li><a href="post.url">{post.frontmatter.title}</a></li>)}
    </ul>
```
2. Check your browser preview and verify that your page content did not change.

Your entire list of blog posts is now being generated dynamically, by mapping over the array returned by `Astro.glob()`.

3. Add a new blog post by creating a new `post-4.md` file in `src/pages/posts/` and including frontmatter properties for `layout`, `title` and `date`. (You may choose to include more properties, or to copy and past the entire content of an existing `.md` file.)

4. Revisit your blog page in your browser preview at `localhost:3000/blog` and look for an updated list with four items, including your new blog post!

## Challenge: Create a BlogPost component

Try on your own to make the all necessary changes to your Astro project so that you can use the following code to generate your list of blog posts:

```diff
<ul>
-   {allPosts.map((post) => <li><a href="post.url">{post.frontmatter.title}</a></li>)}
+   {allPosts.map((post) => <BlogPost title={post.frontmatter.title} url={post.url}/>)}
</ul>
```
<details>
<summary>Expand to see the steps</summary>

1. Create a new component in `src/components/` .

<details>
<summary>Show the filename</summary>
```
`BlogPost.astro`
```
</details>

2. Write a line in your component script so that this component will be able to receive the necessary `Astro.props`, as written in the example.
<details>
<summary>Show the code</summary>
```astro
---
const { title, url } = Astro.props
---
```
</details>

3. Add the templating used to create each item in your blog post list.
<details>
<summary>Show the code</summary>
```astro
<li><a href={url}>{title}</a></li>
```
</details>

4. Import the new component into your Blog page.
<details>
<summary>Show the code</summary>
```astro
---
import BlogPost from '../components/BlogPost.astro'
---
```
</details>

</details>

## Before You Go

### Test your knowledge

Write the syntax corresponding to the following descriptions of data returned by 

```astro
---
const myPosts = await Astro.glob('../pages/posts/*.md');
---
```

1. The title of the third blog post.  _`myPosts[2].frontmatter.title`_

2. The text "First Post!!" linking to the URL of the first blog post. _`<a href={myPosts[0].url}>First Post!!</a>`_

3. A LastUpdated component (written inside `myPosts.map()` ) that receives a blog post's date as props _`<LastUpdated date={post.frontmatter.date} />`_


### Checklist for moving on

[ ] I can use `Astro.glob()` to return an array of all `.md` files in a specified directory.

[ ] I can access the data returned by `Astro.glob()` to dynamically render values from my Markdown files.

[ ] I can refactor my template to reduce duplication, by mapping over an array instead of listing each item individually.

[ ] I can replace HTML templating with a custom component, and pass values received from `Astro.glob()` to it as props using component attributes.
