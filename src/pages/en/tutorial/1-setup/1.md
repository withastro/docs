---
layout: ~/layouts/MainLayout.astro
title: Create a new project
---

## Goals

BY THE END OF THIS SECTION YOU WILL HAVE
- run the `create-astro` setup wizard to install an Astro project in a local or cloud workspace
- started the Astro server in development (dev) mode
- viewed a live preview of your website in your browser
- made your first edit to your new website!

## Prepare your Development Environment

This tutorial will include instructions for two types of development environments: ***local*** and ***cloud***.

:computer: If you are **developing locally**, using files and applications that exist on your own computer, then your environment includes the terminal application for your computer's operating system and your code editor. In this tutorial, we will use VS Code as the code editor. You will have a local copy of your files, and your repository on GitHub will be a copy kept in sync with your local project.

:cloud: If you are **developing in the cloud**, using StackBlitz, CodeSandbox or Gitpod, then your environment is your project workspace running in that website, which will provide a terminal console and an online version of VS Code in your browser. There will be no local copy of your files, but there will be a working copy stored in your cloud environment, which you will keep in sync with your repository on GitHub or delete at the end of each working session.

> Working in the cloud? There's no local development to set up! And, your project will automatically run in development mode and display a website preview when you open it in StackBlitz or CodeSandbox. Skip ahead to Edit your Astro page.

## Run the create-astro setup wizard

The preferred way to create a new Astro site is through our `create-astro` setup wizard. This walks you step-by-step through installing a new Astro project and offers you a chance to choose some customizations.

1. In the command line of your terminal, run the command:
`npm create astro@latest`
2. Confirm `y` that you will install `create-astro`
3. When the prompt asks, "Where would you like to create your app?" type in the name of a folder to create a new directory for your project:
`./astro-site`
> A new Astro project can only be created in a completely empty folder, so choose a folder that does not already exist!

You should now see a short list of starter templates to choose from, and the question "Which app template would you like to use?"

Use the arrow keys (up and down) to navigate to the "Completely empty" template, and then press return (enter) to submit your choice. 

4. When the prompt asks, "Would you like us to run npm install?" type `y`
After a few seconds, you should see the confirmation "Packages installed!"

5. When the prompt asks, "Initialize a git repository?" type `y`.

When the create-astro install wizard is complete, you should see some recommended instructions ("Next Steps") on your screen to follow that will help you complete setup and start your new project. We will follow those steps inside VS Code, instead of continuing in this Terminal.


## Prepare your Code Editor

### Open your Project Folder in VS Code

When you start VS Code, you will be prompted to open a folder. Choose the folder that you created during the setup wizard. Your project workspace now contains all the files necessary for an Astro website. You should see these files in the Explorer pane in VS Code.

### Install the Astro language extension
If this is your first time opening an Astro project, you should see a pop-up notification asking you if you would like to install recommended extensions. Click to see the recommended extensions, and choose the offical Astro support for Visual Studio Code.  (You can always add this later)

### Make the terminal visible
If this is your first time using VS Code, you might not realize that you can now use the terminal built right into this window, instead of your computer's Terminal program!

This pane will be hidden (minimized) by default. You can make it visible through the navigation menu items under View > Terminal.  

You should see the command prompt indicating that you are in your project folder, such as:

`user@machine:~/astro-site$ `

## Run Astro

In order to preview your project files _as a website_ while you work, you will need Astro to be running in development (dev) mode.

### Start the dev server

Run the command to start the Astro dev server by typing:
`npm run dev`

Now you should see confirmation in the terminal that Astro is running in develompent mode :rocket: , as well as which version of Astro you have installed.

### View a preview of your website

Your project files contain all the code necessary to display an Astro website, but it's your web browser that **renders** your site. The browser is responsible for displaying your site as web pages.

Open a new tab in your internet browser and type in the address `https://localhost:3000` to see a live preview of your new Astro website!

> Developing in the cloud? You will see small preview window of your site opened automatically! Click "Fork" to save this project to your own account, where you can make changes and save your work.

Here's what the Astro "Completely empty" starter website should look like in your browser:
[screenshot alt="A blank white page with the word Astro at the top"]

Now, let's test to make sure everything is working and running properly!

## Edit your page

1. Find the file `index.astro` located at the file path `astro-site/src/pages` and click on it to open the file's contents in an editable tab. You should be able to see its file contents: a short snippet of HTML.

> Tip! VS code has many screen sections available to you all at once. You may want to resize these panes to make the terminal smaller (you won't use it often while running in dev mode) or to minimize your list of files to give you the most area for your code. [see a tutorial or something on using VS code]

The contents of your `index.astro` file should look like this:

```astro
---
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
3. Go back to the browser window and you should see your page content updated to the new text.

That's it! Now you are ready to make and see changes to your code and build your very own Astro website!

## Before you go

### Checklist for moving on

#### PREPARING THE DEVELOPMENT ENRIVONMENT

[ ] I used my computer's Terminal application to run the `create-astro` setup wizard.

[ ] I opened my project folder in VS Code and installed the recommended Astro language extension.

[ ] I made the terminal pane visible, and started the Astro dev server.

OR

[ ] I opened the "Completely Empty" starter template in StackBlitz or CodeSandbox from [astro.new](https://astro.new).

#### USING THE DEVELOPMENT ENVIRONMENT

[ ] I edited the content of `index.astro` and can see my updated Astro website in the browser at `localhost:3000` (or in the preview pane in my cloud editor's workspace).
