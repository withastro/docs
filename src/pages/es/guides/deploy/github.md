---
title: Despliega tu proyecto de Astro en GitHub pages
description: Cómo desplegar tu proyecto de Astro usando GitHub Pages.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Puedes usar [GitHub pages](https://pages.github.com/) para desplegar tu proyecto de Astro directamente desde un repositorio en [GitHub.com](https://github.com/).

## Cómo desplegar

Puedes desplegar un proyecto de Astro en GitHub pages usando [GitHub Actions](https://github.com/features/actions) para construir y desplegar tu proyecto automáticamente. Para hacer esto, tu código fuente debe estar alojado en GitHub.

Astro mantiene la action oficial `withastro/action` para desplegar tu proyecto con muy poca configuración. Siga las instrucciones a continuación para desplegar tu proyecto de Astro en GitHub pages y consulte el [README](https://github.com/withastro/action) si necesitas más información.

1. Configure las opciones [`site`](/es/reference/configuration-reference/#site) y, si es necesario, [`base`](/es/reference/configuration-reference/#base) en `astro.config.mjs`.
     - `site` debe ser algo así como `https://<TU_NOMBRE_DE_USUARIO>.github.io`
     - `base` debe ser el nombre de su repositorio comenzando con una barra diagonal, por ejemplo `/my-repo`.
    
     :::note
     Si tu repositorio se llama `<SU_NOMBRE_DE_USUARIO>.github.io`, no necesitas incluir `base`.
     :::
     
2. Crea un nuevo archivo en tu proyecto en `.github/workflows/deploy.yml`, copie y pegue en el código YAML a continuación.

    ```yaml
    name: Github Pages Astro CI

    on:
      # Active el workflow cada vez que hay un push a la rama `main`
      # ¿Usas un nombre diferente a main? Reemplace `main` con el nombre de tu rama
      push:
        branches: [ main ]
      # Te permite ejecutar este workflow manualmente desde la pestaña Acciones en GitHub.
      workflow_dispatch:
      
    # Permite clonar el repositorio y crear una despligue del proyecto
    permissions:
      contents: read
      pages: write
      id-token: write

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout your repository using git
            uses: actions/checkout@v2          
          - name: Install, build, and upload your site
            uses: withastro/action@v0

      deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        steps:
          - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v1
    ```
    
    :::caution
    La [action oficial de Astro](https://github.com/withastro/action) busca un archivo lockfile para detectar tu gestor de paquetes (`npm`, `yarn` o `pnpm`). Debes tener el archivo `package-lock.json`, `yarn.lock` o `pnpm-lock.yaml`, generado automáticamente por tu gestor de paquetes, en tu repositorio.
    :::

3. Confirme el nuevo workflow y envíelo a GitHub.

4. En GitHub, vaya a la pestaña **Configuración** de tu repositorio y busque la sección **Páginas**.

5. Elija la rama `gh-pages` y la carpeta `"/" (raíz)` como **Source** de tu proyecto y presione **Guardar**.

¡Tu proyecto esta listo para ser desplegado! Cuando haya cambios en tu repositorio, GitHub Action los implementará automáticamente por ti.

:::tip[configurar un dominio personalizado]
Opcionalmente, puedes configurar un dominio personalizado agregando el siguiente archivo `./public/CNAME` a su proyecto:

```txt title="público/CNAME"
sub.midominio.com
```

Esto desplegará tu proyecto en el dominio personalizado en lugar de `user.github.io`. No olvides también [configurar el DNS en el proveedor de dominio](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain).
:::
