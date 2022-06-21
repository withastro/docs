---
title: Deploy your Astro Site to Buddy
description: How to deploy your Astro site to the web using Buddy.
layout: ~/layouts/DeployGuideLayout.astro
---

You can deploy your Astro project using [Buddy](https://buddy.works/), a CI/CD solution that can host websites.

## How to deploy

1. Create a **Buddy** account [here](https://buddy.works/sign-up).
2. Create a new project and connect it with a git repository (GitHub, GitLab, BitBucket, any private Git Repository or you can use Buddy Git Hosting).
3. Add a new pipeline.
4. In the newly created pipeline add a **[Node.js](https://buddy.works/actions/node-js)** action.
5. In this action add:

   ```bash
   npm install
   npm run build
   ```

6. Add a deployment action - there are many to choose from, you can browse them [here](https://buddy.works/actions). Although their can settings differ, remember to set the **Source path** to `dist`.
7. Press the **Run** button.
