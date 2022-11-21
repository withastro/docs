---
title: Deploy your Astro Site with Cleavr
description: How to deploy your Astro site to your VPS server using Cleavr.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Puedes desplegar tu proyecto Astro en tu propio servidor privado virtual (VPS) usando [Cleavr](https://cleavr.io/), una herramienta de gestión de despliegues de servidores y aplicaciones.

:::tip
¡Revisa [la guía de Astro en la documentación de Cleavr](https://docs.cleavr.io/guides/astro)!
:::

## Prerrequisitos 

To get started, you will need:
Para comenzar, necesitarás:

- Una cuenta de Cleavr
- Un servidor en tu proveedor de VPS usando Cleavr

## Agrega tu sitio

1. En Cleavr, navega al servidor al que quieres agregar tu proyecto Astro.

2. Selecciona **Add Site** y completa los detalles de tu aplicación, como el nombre de dominio.

3. Para **App Type**, selecciona 'NodeJS Static' o 'NodeJS SSR' según cómo estés configurando tu aplicación de Astro.
   
4. Para las aplicaciones estáticas, establece **Artifact Folder** en `dist`.
   
5. Para las aplicaciones SSR:
   - Establece **Entry Point** en `entry.mjs`.
   - Establece **Artifact Folder** en `dist/server`.   

6. Selecciona **Add** para agregar el sitio a tu servidor.


## Configuración y despliegue

1. Una vez que se haya agregado tu nuevo sitio, haz clic en **Setup and deploy**.
   
2. Selecciona el **VC Profile**, **Repo**, y **Branch** para tu proyecto de Astro.
   
3. Realiza cualquier configuración adicional necesaria para tu proyecto.
   
4. Haz clic en la pestaña **Deployments** y luego haz clic en **Deploy**.

¡Felicitaciones, has desplegado tu aplicación de Astro!
