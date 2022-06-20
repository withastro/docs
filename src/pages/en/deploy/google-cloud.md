---
title: Deploy your Astro Site to Google Cloud
description: How to deploy your Astro site to the web using Google Cloud.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
---
## Google Cloud

Different from most available deploy options here, [Google Cloud](https://cloud.google.com/) requires some UI clicks to deploy projects. (Most of these actions can also be done using the gcloud CLI).

### Cloud Run

1. Create a new GCP project, or select one you already have.

2. Make sure the Cloud Run API is enabled.

3. Create a new service.

4. Use a container from Docker Hub or build your own using [Cloud Build](https://cloud.google.com/build).

5. Configure a port from which the files are served.

6. Enable public access by adding a new permission to `allUsers` called `Cloud Run Invoker`.

### Cloud Storage

1. Create a new GCP project, or select one you already have.

2. Create a new bucket under [Cloud Storage](https://cloud.google.com/storage).

3. Give it a name and other required settings.

4. Upload your `dist` folder into it or upload using [Cloud Build](https://cloud.google.com/build).

5. Enable public access by adding a new permission to `allUsers` called `Storage Object Viewer`.

6. Edit the website configuration and add `ìndex.html` as entrypoint and `404.html` as errorpage.

<DeployGuidesNav />
