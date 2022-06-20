---
title: Deploy your Astro Site to Google Firebase
description: How to deploy your Astro site to the web using Google Firebase.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
---
## Google Firebase

1. Make sure you have [firebase-tools](https://www.npmjs.com/package/firebase-tools) installed.

2. Create `firebase.json` and `.firebaserc` at the root of your project with the following content:

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": []
     }
   }
   ```

   `.firebaserc`:

   ```json
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. After running `npm run build`, deploy using the command `firebase deploy`.

<DeployGuidesNav />
