---
layout: ~/layouts/Main.astro
---

# Deploying with Netflify

- Create a git repository (Github, Gitlab, Bitbucket)
- Commit your project to the repository
- Create your account on Netlify if you don't have one already
- On the 'Team Overview' page click on 'New Site from Git'. Select your git hosting provider. When clicking on Github you can directly allow netlify access to the repository.
- Allow your Netlify account to access the repository with your Astro project
- Add an environment variable for the NODE_VERSION to 14 for the deployment
- The deployment should be successfully now if your project builds without errors.
