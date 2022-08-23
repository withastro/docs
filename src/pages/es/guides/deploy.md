---
layout: ~/layouts/MainLayout.astro
title: Implemente su sitio Astro
description: Cómo implementar su sitio Astro en la web.
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
i18nReady: true
---
**¿Listo para construir e implementar tu proyecto Astro?** Siga una de nuestras guías para diferentes servicios de implementación o desplácese hacia abajo para obtener orientación general sobre el despliegue de un proyecto de Astro.

<DeployGuidesNav />

## Opciones de despliegue rápida

Puedes crear y desplegar tu proyecto de Astro en varios hosts rápidamente utilizando la UI en su página web o la CLI.

### Web UI 

Una forma rápida de desplegar tu página web es conectar un repositorio de Git remoto a tu proyecto de Astro (por ejemplo, GitHub, GitLab, Bitbucket) a un servicio de hosting y aprovechar continuous integration con Git.

Estas plataformas de hosting detectan automáticamente los cambios en el repositorio de origen de tu proyecto de Astro, construyen tu proyecto y lo despliegan en una URL personalizada o en tu dominio personal. A menudo, configurar el despliegue en estas plataformas seguirá pasos como los siguientes:

1. Agregue su repositorio a un repositorio remoto de Git (por ejemplo, en GitHub, GitLab, Bitbucket)

1. Elija un host que admita **continuous integration** (por ejemplo, [Netlify](/es/guides/deploy/netlify/) o [Vercel](/es/guides/deploy/vercel/)) e importa tu repositorio Git como un nuevo sitio/proyecto.

    Muchos hosts comunes reconocerán su proyecto como un sitio de Astro y elegirán los ajustes de configuración apropiados para construir y desplegar tu proyecto como se muestra a continuación. (De lo contrario, estos ajustes se pueden cambiar).

    :::note[Configuración de implementación]
    - **Comando de construcción:** `astro build` o `npm run build`
    - **Directorio de publicación:** `dist`
    :::

1. Haga clic en "Desplegar" y tu nuevo sitio web se creará en una URL única para ese host (por ejemplo, `new-astro-site.netlify.app`).


El host se configurará automáticamente para observar la rama principal del repositorio de Git en busca de cambios, para reconstruir y volver a publicar tu proyecto en cada push. Estos ajustes normalmente se pueden configurar en la UI del panel de control de su proveedor de hosting.

### Despliegue desde el CLI

Algunos hosts tendrán su propia interfaz de línea de comandos (CLI) que puedes instalar globalmente en su máquina usando npm. A menudo, el uso de una CLI para desplegar se parece a lo siguiente:

1. Instale la CLI del host globalmente, por ejemplo:

    ```bash
    npm install --global netlify-cli
    ```

1. Ejecute la CLI y siga las instrucciones de autorización, configuración, etc.

1. Crea tu proyecto y despliegalo en el host

    Muchos proveedores de hosting construirán e desplegarán tu proyecto por ti. Por lo general, reconocerán tu proyecto como un sitio de Astro y elegirán los ajustes de configuración apropiados para construir e desplegar como se muestra a continuación. (De lo contrario, estos ajustes se pueden cambiar).

    :::note[Configuración de implementación]
    - **Comando de construcción:** `astro build` o `npm run build`
    - **Directorio de publicación:** `dist`
    :::


    Otros proveedores de hosting requerirán que [construyas tu sitio localmente](#construyendo-tu-proyecto-localmente) y deplegarás usando la línea de comando.

## Construyendo tu proyecto localmente

Muchos hosts como Netlify y Vercel construirán tu proyecto por ti y lo publicarán en la web automáticamente. Sin embargo, algunos hosts requerirán que construyas tu proyecto localmente y luego ejecutes el comando de despliegue o subas el resultado de la compilación.

También es posible que desees compilar tu proyecto localmente para obtener una vista previa o para detectar posibles errores y advertencias en el entorno.

Ejecute el comando `npm run build` para construir su sitio Astro.

```bash
npm run build
```

De forma predeterminada, el resultado de compilación se colocará en `dist/`. Esta ubicación se puede cambiar usando la [opción de configuración `outDir`](/es/reference/configuration-reference/#outdir). 

## Adición de un adaptador para SSR

:::note
Antes de implementar tu proyecto de Astro con [SSR (renderizado en el servidor)](/es/guides/server-side-rendering/) habilitado, asegúrese de tener:

    - El [adaptador apropiado](/es/guides/server-side-rendering/#habilitando-ssr-en-su-proyecto) a las dependencias de su proyecto
    - [Agregar el adaptador](/es/reference/configuration-reference/#integrations) a la importación y exportación predeterminada del archivo `astro.config.mjs`
:::

