---
title: Netlify CMS & Astro
description: Using Netlify CMS in your Astro project
setup: |
    const currentPage = Astro.url.pathname;
    const filePath = `src/pages${currentPage.replace(/\/$/, '')}.md`;
    const editURL = `https://github.com/withastro/docs/blob/main/${filePath}`;
layout: ~/layouts/CMSLayout.astro
stub: true
---

[Netlify CMS](https://www.netlifycms.org/) is an open-source, Git-based content management system.
## Community Resources 

- Use the unofficial [astro-netlify-cms](https://github.com/delucis/astro-netlify-cms) integration to add Netlify CMS to your project.

- You can get started with the [Astro Blog Starter with Netlify CMS](https://github.com/delucis/astro-netlify-cms-starter).

