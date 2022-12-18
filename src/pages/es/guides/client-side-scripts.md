---
title: Scripts y manejo de eventos
description: Cómo agregar interactividad del lado del cliente a los componentes de Astro usando las API de JavaScript nativas del navegador.
layout: ~/layouts/MainLayout.astro
i18nReady: true
---

Puedes agregar interactividad a tus componentes de Astro sin [usar un framework de interfaz de usuario](/es/core-concepts/framework-components/) como React, Svelte, Vue, etc. usando las etiquetas estándar HTML `<script>`. Esto te permite enviar JavaScript para ejecutar en el navegador y agregar funcionalidad a tus componentes de Astro.

## Usando `<script>` en Astro

En archivos `.astro`, puedes agregar JavaScript del lado del cliente agregando una (o más) etiquetas `<script>`.

En este ejemplo, agregar el componente `<Hello />` a una página registrará un mensaje en la consola del navegador.

```astro title="src/components/Hello.astro"
<h1>¡Bienvenido, mundo!</h1>

<script>
  console.log('¡Bienvenida, consola del navegador!');
</script>
```

### Empaquetado de scripts

De forma predeterminada, las etiquetas `<script>` son procesadas por Astro.

- Cualquier importación se empaquetará, permitiéndote importar archivos locales o módulos de Node.
- El script procesado se insertará en el `<head>` de tu página con [`type="module"`](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules).
- TypeScript es totalmente compatible, incluyendo la importación de archivos TypeScript.
- Si tu componente se usa varias veces en una página, el script solo se incluirá una vez.

```astro title="src/components/Example.astro"
<script>
  // ¡Procesado! ¡Empaquetado! ¡Compatible con TypeScript!
  // La importación de scripts locales y módulos de Node funciona.
</script>
```

:::note
Agregar `type=module` o cualquier otro atributo que no sea `src` a la etiqueta `<script>` desactivará el empaquetado predeterminado de Astro, tratando la etiqueta como si tuviera una directiva `is:line`.
:::

📚 Consulta nuestra página de [referencia de directivas](/es/reference/directives-reference/#script--style-directives) para obtener más información sobre las directivas disponibles en las etiquetas `<script>`.

## Cargando el script

Es posible que quieras escribir tus scripts como archivos separados `.js`/`.ts` o necesites referenciar un script externo. Puedes hacerlo referenciandolos en una etiqueta `<script>` con el atributo `src`.

### Importando scripts locales

**Cuando usar esto:** Si tu script se encuentra dentro de `src`.

Astro empaquetara, optimizará y agregará estos scripts a la página por ti, siguiendo sus [reglas de empaquetado](#empaquetado-de-scripts).

```astro title="src/components/LocalScripts.astro"
<!-- ruta relativa al script en `src/scripts/local.js` -->
<script src="../scripts/local.js"></script>

<!-- también funciona para archivos TypeScript locales -->
<script src="./script-with-types.ts"></script>
```

### Cargando scripts externos


