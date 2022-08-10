---
layout: ~/layouts/MainLayout.astro
title: Implemente su sitio Astro
description: Cómo implementar su sitio Astro en la web.
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
i18nReady: true
---
**¿Listo para construir e implementar su sitio Astro?** Siga una de nuestras guías para diferentes servicios de implementación o desplácese hacia abajo para obtener orientación general sobre la implementación de un sitio Astro.

<DeployGuidesNav />

## Opciones de implementación rápida

Puede crear e implementar un sitio de Astro en varios hosts rápidamente utilizando la interfaz de usuario del panel de su sitio web o una CLI.

### Sitio Web UI 

Una forma rápida de implementar su sitio web es conectar el repositorio Git en línea de su proyecto Astro (por ejemplo, GitHub, GitLab, Bitbucket) a un proveedor de alojamiento y aprovechar la implementación continua con Git.

Estas plataformas de host detectan automáticamente las inserciones en el repositorio de origen de su proyecto Astro, construyen su sitio y lo implementan en la web en una URL personalizada o en su dominio personal. A menudo, configurar una implementación en estas plataformas seguirá pasos como los siguientes:

1. Agregue su repositorio a un proveedor de Git en línea (por ejemplo, en GitHub, GitLab, Bitbucket)

1. Elija un host que admita **implementación continua** (por ejemplo, [Netlify](/es/guides/deploy/netlify/) o [Vercel](/es/guides/deploy/vercel/)) e importe su repositorio Git como un nuevo sitio/proyecto.

    Muchos hosts comunes reconocerán su proyecto como un sitio de Astro y deben elegir los ajustes de configuración apropiados para construir e implementar su sitio como se muestra a continuación. (De lo contrario, estos ajustes se pueden cambiar).

    :::note[Configuración de implementación]
    - **Comando de construcción:** `astro build` o `npm run build`
    - **Directorio de publicación:** `dist`
    :::

1. Haga clic en "Implementar" y su nuevo sitio web se creará en una URL única para ese host (por ejemplo, `new-astro-site.netlify.app`).


El host se configurará automáticamente para observar la rama principal de su proveedor de Git en busca de cambios, y para reconstruir y volver a publicar su sitio en cada nueva confirmación. Estos ajustes normalmente se pueden configurar en la interfaz de usuario del panel de control de su proveedor de alojamiento.

### Implementación de CLI

Algunos hosts tendrán su propia interfaz de línea de comandos (CLI) que puede instalar globalmente en su máquina usando npm. A menudo, el uso de una CLI para implementar se parece a lo siguiente:

1. Instale la CLI de su host globalmente, por ejemplo:

    ```bash
    npm install --global netlify-cli
    ```

1. Ejecute la CLI y siga las instrucciones de autorización, configuración, etc.

1. Cree su sitio e impleméntelo en su host

    Muchos anfitriones comunes construirán e implementarán su sitio por usted. Por lo general, reconocerán su proyecto como un sitio de Astro y deben elegir los ajustes de configuración apropiados para construir e implementar como se muestra a continuación. (De lo contrario, estos ajustes se pueden cambiar).

    :::note[Configuración de implementación]
    - **Comando de construcción:** `astro build` o `npm run build`
    - **Directorio de publicación:** `dist`
    :::


    Otros anfitriones requerirán que [construyas tu sitio localmente](#construyendo-su-sitio-localmente) e implementar usando la línea de comando.

## Construyendo su sitio localmente

Muchos hosts como Netlify y Vercel construirán su sitio para usted y luego publicarán el resultado de la construcción en la web. Sin embargo, algunos sitios requerirán que cree localmente y luego ejecute un comando de implementación o cargue su resultado de compilación.

También es posible que desee compilar localmente para obtener una vista previa de su sitio o para detectar posibles errores y advertencias en su propio entorno.

Ejecute el comando `npm run build` para construir su sitio Astro.

```bash
npm run build
```

De forma predeterminada, la salida de compilación se colocará en `dist/`. Esta ubicación se puede cambiar usando el [Opción de configuración `outDir`](/es/reference/configuration-reference/#outdir). 

## Adición de un adaptador para SSR

:::note
Antes de implementar su sitio Astro con [SSR (representación del lado del servidor)](/es/guides/server-side-rendering/) habilitado, asegúrese de tener:

    - instaló el [adaptador apropiado](/es/guides/server-side-rendering/#habilitando-ssr-en-su-proyecto) a las dependencias de su proyecto
    - [agregó el adaptador](/es/reference/configuration-reference/#integrations) a la importación y exportación predeterminada de su archivo `astro.config.mjs`
:::

