---
title: Despliega tu proyecto de Astro en GitLab Pages
description: Cómo desplegar tu proyecto de Astro usando GitLab Pages.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Puedes usar [GitLab Pages](https://pages.gitlab.io/) para alojar un proyecto de Astro para tu proyecto, grupo, o cuenta de usuario en [GitLab](https://about.gitlab.com/).

:::tip[¿Buscas un ejemplo?]
¡Revisa [el proyecto de ejemplo de Astro en GitLab Pages](https://gitlab.com/pages/astro)!
:::

## Cómo desplegar

1. Establece el `.site` correcto en `astro.config.mjs`.
2. Cambia el directorio `dist` en `astro.config.mjs` por `public` y `public` en `astro.config.mjs` por un directorio nuevo que contenga todo lo que actualmente está en `public`. La razón es porque `public` es un directorio secundario en astro, por lo tanto, si deseas compilar a `public` necesitas extraer los archivos públicos de un directorio diferente. Tu `astro.config.mjs` podría terminar viéndose así:

   ```js
   export default defineConfig({
     sitemap: true,
     site: 'https://astro.build/',
   });
   ```

3. Crea un archivo llamado `.gitlab-ci.yml` en la raíz de tu proyecto con el siguiente contenido. Esto compilará y desplegará tu proyecto cada vez que realices cambios en el contenido:

   ```yaml
   image: node:14
   pages:
     cache:
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
     artifacts:
       paths:
         - public
     only:
       - main
   ```
