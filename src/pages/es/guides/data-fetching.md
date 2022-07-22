---
layout: ~/layouts/MainLayout.astro
title: Obtención de datos
description: Aprenda como obtener datos remotos con Astro utilizando la API de fetch.
i18nReady: true
---

Los archivos `.astro` pueden obtener datos remotos al momento de la compilación para ayudar a generar sus páginas.

## `fetch()` en Astro

Todos los [componentes de Astro](/es/core-concepts/astro-components/) tienen acceso a la función global [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) en el script de su componente para realizar solicitudes HTTP a las APIs. Esta llamada se ejecutará en el momento de la compilación y los datos estarán disponibles en su componente para generar el HTML dinámico.

💡 Aproveche el [**top-level await**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await) dentro del script de su componente de Astro.

💡 Pase los datos obtenidos a los componentes de Astro u otros UI frameworks, como props.

```astro
---
// src/components/User.astro
import Contact from '../components/Contact.jsx';
import Location from '../components/Location.astro';

const response = await fetch('https://randomuser.me/api/');
const data = await response.json();
const randomUser = data.results[0]
---
<!-- Los datos obtenidos en la compilación pueden ser usados en el HTML -->
<h1>User</h1>
<h2>{randomUser.name.first} {randomUser.name.last}</h2>

<!-- Los datos obtenidos en la compilación pueden ser pasados como props a otros componentes -->
<Contact client:load email={randomUser.email} />
<Location city={randomUser.location.city} />
```

### Consultas en GraphQL

Astro también puede usar `fetch()` para consultar a un servidor GraphQL con cualquier query de GraphQL válida.

```astro
---
const response = await fetch("https://graphql-weather-api.herokuapp.com",
  {
    method:'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      query: `
        query getWeather($name:String!) {
            getCityByName(name: $name){
              name
              country
              weather {
                summary {
                    description
                }
              }
            }
          }
        `,
      variables: {
          name: "Toronto",
      },
    }),
  })

const json = await response.json();
const weather = json.data
---
<h1>Obtenega datos sobre el clima en el momento de la compilación</h1>
<h2>{weather.getCityByName.name}, {weather.getCityByName.country}</h2>
<p>Clima: {weather.getCityByName.weather.summary.description}</p>
```

:::note
Recuerde, todos los datos en los componentes de Astro se recuperan cuando el componente es renderizado.

Al desplegar su proyecto, Astro solicitará los datos **una sola vez en el momento de la compilación**. En desarrollo, verá nuevas solicitudes de datos al actualizar los componentes. Si necesita volver a obtener datos varias veces del lado del cliente, use un [componente de framework](/es/core-concepts/framework-components/) o un [script del lado del cliente](/es/core-concepts/astro-components/#scripts-del-lado-del-cliente) en un componente de Astro.
:::

## `fetch()` en componentes de framework

La función `fetch()` también está disponible globalmente para cualquier [componentes de framework](/es/core-concepts/framework-components/):

```tsx
// Movies.tsx
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';

const data = await fetch('https://example.com/movies.json').then((response) =>
  response.json()
);

// Los componentes que se renderizan en tiempo de compilación también se registran en la CLI.
// Cuando se representan con una directiva client:*, también se registran en la consola del navegador.
console.log(data);

const Movies: FunctionalComponent = () => {
// Envía el resultado a la página.
  return <div>{JSON.stringify(data)}</div>;
};

export default Movies;
```
