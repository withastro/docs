---
title: Despliega tu projecto de Astro en render
description: Cómo desplegar tu projecto de Astro en render
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Puedes desplegar tu proyecto de Astro en [Render](https://render.com/), un servicio para crear sitios web con certificados TLS gratuitos, una CDN global, protección DDoS, redes privadas y despliegues automáticos desde Git.

## Cómo desplegar

1. Crea una [cuenta de render.com](https://dashboard.render.com/) e inicie sesión
2. Haga clic en el botón **New +** en el dashboard y seleccione **Static Site**
3. Conecta tu repositorio de [GitHub](https://github.com/) o [GitLab](https://about.gitlab.com/) o, alternativamente, ingrese la URL pública del repositorio
4. Asigne un nombre a tu sitio web, seleccione la rama y especifique el comando de compilación y el directorio de publicación
    - **build command:** `npm run build`
    - **publish directory:** `dist`
5. Haga clic en el botón **Create Static Site**
