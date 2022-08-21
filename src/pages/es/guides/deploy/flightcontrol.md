---
title: Despliega tu projecto de Astro en AWS con Flightcontrol
description: Cómo desplegar tu projecto de Astro en AWS con Flightcontrol
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Puedes desplegar tu projecto de Astro utilizando [Flightcontrol](https://www.flightcontrol.dev?ref=astro), que proporciona despliegues totalmente automatizados en tu cuenta de AWS.

Es compatible con sitios estáticos y SSR.

1. Crea una cuenta de Flightcontrol en [app.flightcontrol.dev/signup](https://app.flightcontrol.dev/signup?ref=astro)
1. Vaya a [app.flightcontrol.dev/projects/new/1](https://app.flightcontrol.dev/projects/new/1)
1. Conecta tu cuenta de Github y selecciona tu repositorio
1. Seleccione el "Tipo de configuración" deseado:
    - `GUI` (toda la configuración administrada a través de flightcontrol dashboard) donde seleccionará el preajuste `Astro Static` o `Astro SSR`
    - `flightcontrol.json` (opción "infraestructura como código" donde toda la configuración está alojada en tu repositorio) donde seleccionará una configuración ejemplo de Astro, luego la agregará al repositorio como `flightcontrol.json`
1. Ajuste cualquier configuración según sea necesario
1. Haga clic en "Crear proyecto" y complete los pasos necesarios, como vincular su cuenta de AWS.

### Configuración SSR

Para desplegar tu projecto como SSR, asegúrate de configurar primero el adaptador [`@astro/node`](/es/guides/integrations-guide/node/). Luego, siga los pasos anteriores para elegir las configuraciones apropiadas para Astro SSR.
