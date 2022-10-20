---
layout: ~/layouts/MainLayout.astro
title: Complete this tutorial in your web browser
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import PreCheck from '~/components/tutorial/PreCheck.astro';
---

You can also complete this tutorial using a web browser **instead of installing any local software**.

<PreCheck>
- [Created all the online accounts you will need](#create-your-online-accounts)
- [Started a new Astro project](#open-a-new-astro-project)
- [Edited your first page](#edit-your-home-page)
- [Stored your repository on GitHub](#store-your-project-repository-on-github)
- [Deployed your site to the web](#deploy-your-website-on-netlify)
</PreCheck>

## Create your online accounts

To complete this tutorial in a web browser, you will need three online accounts that will work together to store, develop, and publish your site to the web. You can use other online services, but this tutorial will provide instructions for working with GitHub, StackBlitz and Netlify.


### 1. Storing your Project: GitHub

Many software projects use `git`, a version control system to track changes in a project over time. In this tutorial, you will use **GitHub.com**, a free online git provider and will not need to know how to use git commands in the terminal. All git actions in this tutorial will be performed through StackBlitz menu items and will sync your **repository** (files and version history) to the cloud.

1. Create a free account at [GitHub](https://github.com).

    Make a note of your username. You will view your account, and any projects you create at `https://github.com/<username>`
    
### 2. Developing your site: StackBlitz

1. Sign in to [StackBlitz](https://stackblitz.com) using your GitHub credentials. This site will provide you with two different software tools that you will need to build your site:
 - a **code editor** (an alternative to locally-installed software like VS Code) where you will edit your files.
 - a **terminal pane** for running server commands.


### 3. Publishing your site: Netlify

Once your project is stored online, you will connect your GitHub repository to a free **web host** to build and deploy your site live on the web every time you commit a change to your code. This tutorial will use **Netlify**, but you are welcome to use your preferred hosting service for deploying your site to the internet.

1. Create a free account at [Netlify](https://netlify.com) (or your preferred hosting service).

    Make a note of your username. You will view your dashboard and any sites you create at `https://app.netlify.com/teams/username`


## Open a new Astro project

Instead of using the setup wizard, you will open a new project in StackBlitz. Your project will automatically run in development mode and display a website preview.


1. Visit [stackblitz.com](https://stackblitz.com) and sign in with your GitHub account.

2. Visit [astro.new](https://astro.new) and click the button to open the "Empty Project" template in StackBlitz. (This will launch in StackBlitz.)

3. In the upper left of the StackBlitz editor window, click to "fork" the template (save to your own account dashboard).

4. Wait for the project to load, and you will see a live preview of the "Empty Project" starter. This is now your project, and you can access it any time from your StackBlitz dashboard.


## Edit your home page

1. Navigate in the Explorer file pane to `src/pages/index.astro` and click on it to open the file's contents in an editable tab.

    The contents of your `index.astro` file should look like this:

    ```astro title="src/pages/index.astro"
    ---
    ---

    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type ="image/svg+xml" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width" />
        <meta name="generator" content = {Astro.generator} >
        <title>Astro</title>
      </head>
      <body>
        <h1>Astro</h1>
      </body>
    </html>
    ```

2. Edit the content of your page `<body>`.

Type in the editor to change the heading text on your page and save the change.

    ```astro title="src/pages/index.astro" del={2} ins={3}
    <body>
      <h1>Astro</h1>
      <h1>My Astro Site</h1>
    </body>
    ```

3. The preview window should update automatically and you should see the new text.

Congratulations! You are now an Astro developer!

## Store your project repository on GitHub

Now you will be able to create a GitHub repository right from your StackBlitz workspace.

Press the <kbd>Connect Repository</kbd> button at the top of your list of files, enter a new name for your repository, and click <kbd>Create repo & push</kbd>. 

When you have changes to be saved back to GitHub, a "Commit" button will appear at the top left of your workspace. Click to save your changes locally, then click the commit button and enter a commit message. This will automatically update your repository on GitHub.


## Deploy your website on Netlify

Here, you will connect your GitHub repository to Netlify. Netlify will use that project to create a live, public website. 

### Create a new Netlify site

1. Log in to https://app.netlify.com/.

2. Click <kbd>Add new site</kbd> > <kbd>Import an existing project</kbd>.

    You will be asked to connect to a Git provider. Choose GitHub and follow the steps onscreen to authenticate your GitHub account. Then, choose your Astro project's GitHub repository from the list provided.

3. At the final step, Netlify will show you your app's site settings. The defaults should be correct for your Astro project, so you can scroll down and click <kbd>Deploy site</kbd>.

Congratulations, you have an Astro website!

### Change your project name

On your site's overview page in Netlify, you will see your randomly-generated project name, and your website URL of the form `https://project-name-123456.netlify.app`. You can change your project name to something more memorable, and this will automatically update your URL.

### Visit your new website

Click on the URL in your site settings, or type it in to a browser window to view your new website.

## Before you go

### Test your knowledge

You want to update the home page of your website. Number the following steps in the correct order to explain how this happens:

|| &nbsp &nbsp 4 &nbsp &nbsp || Netlify will respond to any changes on GitHub, and will automatically re-build my website from the most recent version of my repository. Then, Netlify will deploy the updated version of my website at my URL.

|| &nbsp &nbsp 2 &nbsp &nbsp || I make changes to `index.astro` using my code editor and check the browser preview to make sure I can see the changes.

|| &nbsp &nbsp 1 &nbsp &nbsp || I open my project folder in my code editor and run Astro in dev mode to see a live preview of my changes.

|| &nbsp &nbsp 3 &nbsp &nbsp || I commit and push my changes to my repository stored on GitHub.


### Checklist for moving on

<Checklist>

- [ ] I have connected all three online services, and my Astro website is published on the web.

- [ ] I am ready to skip to [Unit 2](/en/tutorial/2-pages/) and start coding!

</Checklist>

### Resources

- <p>[FreeCodeCamp.org](https://freecodecamp.org) <Badge>external</Badge> — a free educational site with full courses or quick refreshers in HTML, CSS, JS and more.</p>

- <p>[A step-by-step guide to deploying on Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/) <Badge>external</Badge></p>

