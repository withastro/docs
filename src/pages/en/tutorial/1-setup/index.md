---
layout: ~/layouts/TutorialLayout.astro
title: Create and Deploy an Astro Site
description: Create an Astro site, and deploy it to the web.
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---

Now that you have the required tools and accounts to begin building an Astro website, let's put all the pieces together!

<Goals>
  - created a new Astro project and be ready to code in an editor
  - created a repository in an online code hosting platform, and connected it to a web host
  - published a live, Astro site on the web!
</Goals>

### Summary

After completing these steps, you will have created a new project that is **stored online in GitHub** and **connected to Netlify**. 

Netlify will use the files in your GitHub repository to build your website, and then publish it on the internet at a unique address where anyone can view it!

Netlify will continuously monitor your GitHub repository for any committed changes, and will rebuild and republish your site to reflect those changes.

[diagram of relationship of interconnected tools/services]

### Test your knowledge

Fill in the blanks with **Netlify**, **VS Code** and **GitHub**:

1. || **VS Code** || is a code editor, where I will make changes to my project files and their content.
2. || **GitHub** || is an online storage provider for my repository.
3. || **Netlify** || is a web host, for deploying my website to the internet at a unique web address.


### Checklist for moving on

<Checklist key="setup">
- [ ] I am excited to build with Astro!
</Checklist>

---

## Create a new project

<Goals>
  - run the `create-astro` setup wizard to install an Astro project in a local or cloud workspace
  - started the Astro server in development (dev) mode
  - viewed a live preview of your website in your browser
  - made your first edit to your new website!
</Goals>

### Prepare your Development Environment

This tutorial will include instructions for two types of development environments: ***local*** and ***cloud***.

#### 🖥️ Developing locally

If you are **developing locally**, using files and applications that exist on your own computer, then your development environment includes **the terminal application** for your computer's operating system and your **code editor**. In this tutorial, we will use VS Code as the code editor. You will use a web browser to preview your work as you build.

You will have a local copy of your files, and your repository on GitHub will be a copy kept in sync with your local project.

#### 🌐 Developing in the cloud

If you are **developing in the cloud**, using StackBlitz or CodeSandbox, then your development environment is your **project workspace running in that browser tab**, which will provide a terminal console and an online version of VS Code in your browser. You will also have a simple browser pane to preview your work as you build. 

There will be no local copy of your files, but there will be a working copy stored in your online account, which you will keep in sync with your source repository on GitHub.

:::tip[working in the cloud?]
There's no local development to set up! Your project will automatically run in development mode and display a website preview when you open the "Completely Empty" template from https://astro.new in StackBlitz or CodeSandbox. 

**Next Steps**: 
1. Click the button to "fork" the template (save to your own account dashboard).
2. Skip ahead to [view a preview of your site](#view-a-preview-of-your-website).
:::

### Run the create-astro setup wizard

The preferred way to create a new Astro site is through our `create-astro` setup wizard.

1. In the command line of your terminal, run the command:
`npm create astro@latest`
2. Confirm `y` to install `create-astro`
3. When the prompt asks, "Where would you like to create your app?" type in the name of a folder to create a new directory for your project:
`./astro-site`

    :::note
    A new Astro project can only be created in a completely empty folder, so choose a folder that does not already exist!
    :::

3. You will see a short list of starter templates to choose from. Use the arrow keys (up and down) to navigate to the "Completely Empty" template, and then press return (enter) to submit your choice. 

4. When the prompt asks, "Would you like us to run npm install?" type `y`.


5. When the prompt asks, "Initialize a git repository?" type `y`.

When the create-astro install wizard is complete, you will see some recommended instructions ("Next Steps") on your screen to follow that will help you complete setup and start your new project. You will follow those steps inside of VS Code, instead of continuing in this Terminal.


### Prepare your Code Editor

#### Open your Project Folder in VS Code

When you start VS Code, you will be prompted to open a folder. Choose the folder that you created during the setup wizard. Your project workspace now contains all the files necessary for an Astro website. You should see these files in the Explorer pane in VS Code.

#### Install the Astro language extension
If this is your first time opening an Astro project, you should see a pop-up notification asking you if you would like to install recommended extensions. Click to see the recommended extensions, and choose the offical Astro support for Visual Studio Code.  (You can always add this later)

#### Make the terminal visible
If this is your first time using VS Code, you might not realize that you can now use the terminal built right into this window, instead of your computer's Terminal program!

This pane might be hidden (minimized) by default. You can make it visible through the navigation menu items under <kbd>View</kbd> > <kbd>Terminal</kbd>.

You should see the command prompt indicating that you are in your project folder, such as:

```sh
user@machine:~/astro-site$
```

### Run Astro

In order to preview your project files _as a website_ while you work, you will need Astro to be running in development (dev) mode.

#### Start the dev server

1. Run the command to start the Astro dev server by typing into VS Code's terminal:

    ```sh
    npm run dev
    ```

    Now you should see confirmation in the terminal that Astro is running in dev mode. 🚀

### View a preview of your website

Your project files contain all the code necessary to display an Astro website, but it's your web browser that **renders** your site. The browser is responsible for displaying your site as web pages.

:::tip[developing in the cloud?]
You will see small preview window of your site opened automatically! 

You can also click the icon in the upper right corner of the preview pane, or copy and paste the preview's URL, to open your site in a new browser tab.
:::

1. Open a new tab in your internet browser and type in the address `https://localhost:3000` to see a live preview of your new Astro website!

    Here's what the Astro "Completely empty" starter website should look like in your browser:

    ![A blank white page with the word Astro at the top.](/tutorial/minimal.png)


### Edit your page

1. Find the file `index.astro` located at the file path `astro-site/src/pages` and click on it to open the file's contents in an editable tab. You should be able to see its file contents: a short snippet of HTML.

    The contents of your `index.astro` file should look like this:

    ```astro
    ---
    // src/pages/index.astro
    ---
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Astro</title>
      </head>
      <body>
        <h1>Astro</h1>
      </body>
    </html>
    ```

2. Edit the content of your page `<body>`
Type in the editor to change the the header text on your page and save the change.

    ```diff
    - <h1>Astro</h1>
    + <h1>My Astro Site</h1>
    ```

3. Check the browser preview and you should see your page content updated to the new text.

That's it! Now you are ready to make and see changes to your code and build your very own Astro website!

:::note[customize your view]
VS code has many screen sections available to you all at once. You may want to resize these panes to make the terminal smaller (you won't use it often while running in dev mode) or to minimize your list of files to give you the most area for your code.
:::

### Checklist for moving on

#### Preparing the Development Environment

<Checklist key="preparation">
- [ ] I used my computer's Terminal application to run the `create-astro` setup wizard.
- [ ] I opened my project folder in VS Code and installed the recommended Astro language extension.
- [ ] I made the terminal pane visible, and started the Astro dev server.
<Fragment slot="alternative">
- [ ] I opened and forked the "Completely Empty" starter template in StackBlitz or CodeSandbox from [astro.new](https://astro.new).
</Fragment>
</Checklist>

#### Using the Development Environment

<Checklist key="usage">
- [ ] I edited the content of `index.astro` and can see my updated Astro website in the browser at `localhost:3000` (or in the preview pane in my cloud editor's workspace).
</Checklist>

### Resources

- <p>[Getting Started with Visual Studio Code](https://code.visualstudio.com/docs/introvideos/basics) <Badge>external</Badge> — a video tutorial for installing, setting up and working with VS Code</p>

---

## Storing and Deploying your Project

<Goals>
  - stored your project repository on GitHub
  - added your GitHub repository as a new Netlify app
  - deployed your Astro site to the web
</Goals>

### Store your repository on GitHub

🖥️ If you are **developing locally**, then you will **import your local project on GitHub's website**. Your files will "live" on your machine, and you will open VS Code when you want to work on your project. You will be managing two copies of your work, and you are responsible for keeping GitHub up-to-date and in sync with your local copy.

🌐 If you are **developing in the cloud**, you will **export your forked site to a new repository on GitHub**. Your files will "live" in your online account, and you will open your workspace from your dashboard every time you work on your project. You will be managing two copies of your work, and you are responsible for keeping GitHub up-to-date and in sync with your cloud copy.


#### Create a repository on GitHub

##### 🖥️ Developing locally

Although there are a few ways to get your local code stored in GitHub, we will choose a method that does not require using git in the command line.

1. Log in to GitHub.com in a browser and click the <kbd>+</kbd> in the upper right of the screen to make a new repository. 

2. Choose a name for your repository. This does not have to be the same name as your project.

3. You will be presented with options, but you do not need to change any of the defaults. Scroll down and click the button to <kbd>Create Repository</kbd>.

4. You will be presented with various setup next steps, but you won't need to use any of them. You can now exit this page without doing anything.

##### 🌐 Developing in the cloud

If you have forked an Astro starter template on StackBlitz or CodeSandbox, you will be able to create a GitHub repository right from your project workspace, without visiting GitHub.com.

**CodeSandbox**: Press the GitHub icon in the sidebar, enter a new name for your repository, and click <kbd>Create Repository</kbd>. This will automatically open a new sandbox that is now synced to the GitHub repository. You will once again have to fork *this* sandbox in order to make changes, because you cannot make direct changes to a GitHub sandbox directly. Read more about [using GitHub immutable sandboxes](https://codesandbox.io/docs/git).

**StackBlitz**: Press the <kbd>Connect Repository</kbd> button at the top of your list of files, enter a new name for your repository, and click <kbd>Create repo & push</kbd>.


#### Commit your code to GitHub

##### 🖥️ Developing locally

In the last section, you made a change to your page's content. This means that your project files have changed, and VS Code should show a number on top of the "Source" menu icon. This source tab is where you will reguarly go to send your files to GitHub. 

[IMAGE OF VS CODE LEFT NAVIGATION, WITH CHANGES]

1. Click the Source Control tab in your VS Code to see a list of files that have changed. 

2. Click the <kbd>•••</kbd> "3 dots" menu above the commit message and choose <kbd>Remote</kbd> > <kbd>Add Remote</kbd>.

3. Select <kbd>Add remote from GitHub</kbd>.

4. You may need to authorize the GitHub extension to log in to GitHub and see your repositories. Follow the steps to allow this, then return to VS Code.

5. Now, when you try to <kbd>Add a remote from GitHub</kbd> again, you should see a list of all your repositories on GitHub. Choose the one you created for this project.

6. At the top of this menu pane, there will be a place to enter a **commit message** (description of your file changes). Type in `initial commit to GitHub` and press the <kbd>Commit</kbd> button to commit these changes.

7. You may see a message telling you that you have no "staged" commits, and asking you if you want to stage them. Click <kbd>Always</kbd> and continue.

8. Lastly, the list of changed files should be replaced with a <kbd>Publish</kbd> button. Click this to send your committed changes to GitHub.

##### 🌐 Developing in the cloud

As you make changes to your project, you will see a visual indication that some files are no longer in sync with your repository at GitHub.com.

**CodeSandbox**: When there are changes to be committed back to GitHub, the GitHub tab will display a notification. When you first click on the GitHub tab in CodeSandbox, you will be asked to "Link" your sandbox back to your repository. 

After that, clicking on the GitHub tab will list any files with changes that have not been synced back to your GitHub repository. It will allow you to enter a commit message (summary) describing your changes or intention, and an optional description. Make sure that "Commit directly to the main branch" is selected, then press "Commit changes."

**StackBlitz**: When there are changes to be committed back to GitHub, a "Commit" button will appear at the top left of your workspace. Clicking on this will allow you to enter a commit message, describing your changes or intention. Click "Commit" to send these changes back to GitHub and update your repository.


##### 🖥️ 🌐 Verify your work

To verify that your project is successfully stored on GitHub, visit GitHub.com again in a browser window and look under your account for a list of your repositories. Choose the new one you created, and verify that it contains your Astro project files.

### Deploy your website on Netlify

Here, you will import your Astro project from GitHub. Netlify will use that project to create a live, public website. 

#### Create a new Netlify site

1. Log in to https://app.netlify.com/.

2. Click <kbd>Add new site</kbd> > <kbd>Import an existing project</kbd>.

    You will be asked to connect to a Git provider. Choose GitHub (or your chosen git provider) and, if necessary, follow the steps onscreen to authenticate your GitHub account. Then, choose the new GitHub repository you made to store your `astro-site` project from the list provided.

3. At the final step, Netlify will show you your app's site settings. The defaults should be correct for your Astro project, so you can scroll down and click <kbd>Deploy site</kbd>.

Congratulations, you have an Astro website!

#### Make changes locally 

On your Site overview page, you will see your randomly-generated project name, and your website URL in the form `https://project-name-123456.netlify.app`. You can change your project name to something more memorable, and this will automatically update your URL.

#### Visit your updated website

Click on the URL in your site settings, or type it in to a browser window to view your new website.

### Checklist for moving on

<Checklist key="deploy">
- [ ] I have stored my Astro project in a repository on GitHub, and can see my files on GitHub.com
- [ ] My Astro website is available on the web at a `.netlify.app` URL
</Checklist>

### Resources

- <p>[A step-by-step guide to deploying on Netlify](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/) <Badge>external</Badge></p>

---

## Starting a new working session

<Goals>
  - opened your project on your computer, or in your cloud environment
  - started the dev (development) server, if necessary
  - opened a browser preview at `localhost:3000` or in your cloud environment
</Goals>

### Working locally

If your project is not currently open and running in dev mode, open and start your project.

1. Open your astro project (e.g. `astro-site`) in your code editor (e.g. VS Code).
Make the terminal pane visible and you should see a command prompt, ready to run commands (e.g. `:~/astro-site$`)

2. Type and enter (run) the start command 

    ```sh
    npm run dev
    ```
    This will start the Astro dev server, and will prepare your code for viewing. While the dev server is running, your terminal will provide feedback such as which page it is rendering while you visit in the browser, and any error messages.

3. Check your browser preview by visiting `https://localhost:3000` in a browser tab.

    This is where you can always view a live, updating preview of your website. Open this URL in a browser tab when you want to see how your code changes are rendered to the page. You may need to refresh the tab to see changes take effect.

### Working in the cloud

If you are working on your project using a code editor in your web browser (e.g. CodeSandbox or StackBlitz), you will need to log in to your account in a browser tab and find your project.

1. Navigate to your dashboard and open your project repository:

    **CodeSandbox**: fork your immuntable GitHub sandbox: https://codesandbox.io/dashboard/repositories

    **StackBlitz**: open your recent project: https://stackblitz.com/dashboard


2. Wait for the project to load in dev mode

    Your project should automatically run the Astro start command for you. 

    (If not, or if you ever need to restart the dev server, you can type the start command `astro run dev` in your terminal pane.


3. Check your on-screen browser preview.

    This is where you can always view a live, updated version of your website. You may need to refresh the browser preview to see changes take effect.

    This preview window visits a URL from the online site you are using (e.g. `https://sdkelkk--github--3000.localwebcontainer.io/` or `https://dfewi.sse.codesandbox.io/`). 

    When your project has finished loading, this will be a live preview of your project. You also have the option to copy this URL into a separate browser tab to view your preview at full size.


### Using the Astro dev server

While the Astro server is running in dev mode, you will NOT be able to run commands in your terminal window. Instead, this pane will give you feedback as you preview your site.

You can stop the dev server at any time and return to the command prompt by typing `CTRL+C`.

### Troubleshooting

Sometimes the dev server will stop on its own while you are working. If your live preview at `localhost:3000` or in your online editor preview stops working, go back to the terminal and restart the dev server by typing `npm run dev`.

### Checklist for moving on

<Checklist key="session">
- [ ] I know how to open my project to start a working session, either locally or in an online Code Editor.
- [ ] I can start and stop the dev server, both when I first start working and if I run into trouble while working.
- [ ] I can view a preview of my website at `localhost:3000` or in my online code editor's preview pane.
</Checklist>
