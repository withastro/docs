---
layout: ~/layouts/MainLayout.astro
title: Data Fetching
description: Learn how to fetch remote data with Astro using the fetch API.
---

`.astro` files can fetch remote data at build time to help generate your pages.

## `fetch()` in Astro

All [Astro components](/en/core-concepts/astro-components) have access to the [global `fetch()` function](https://developer.mozilla.org/en-US/docs/Web/API/fetch) in their component script to make HTTP requests to APIs. This fetch call will be executed at build time, and the data will be available to the component template for generating dynamic HTML. 

💡 Take advantage of [**top-level await**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await) inside of your Astro component script.

💡 Pass fetched data to both Astro and framework components, as props.

```astro
// src/components/User.astro
---
import Contact from '../components/Contact.jsx';
import Location from '../components/Location.astro';

const response = await fetch('https://randomuser.me/api/');
const data = await response.json();
const randomUser = data.results[0]
---
<!-- Data fetched at build can be rendered in HTML -->
<h1>User</h1>
<h2>{randomUser.name.first} {randomUser.name.last}</h2>

<!-- Data fetched at build can be passed to components as props -->
<Contact client:load email={randomUser.email} />
<Location city={randomUser.location.city} />
```

### GraphQL queries

Astro can also use `fetch()` to query a GraphQL server with any valid GraphQL query. 

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
  <h1>Fetching Weather at build time</h2>
  <h2>{weather.getCityByName.name}, {weather.getCityByName.country}</h3>
  <p>Weather: {weather.getCityByName.weather.summary.description}</p>
```
> 💡 Remember, all data in Astro components is fetched when a component is rendered. 

Your deployed Astro site will fetch data **once, at build time**. In dev, you will see data fetches on component refreshes. If you need to re-fetch data multiple times client-side, use a [framework component](/en/core-concepts/framework-components) or a (client-side script)[/en/core-concepts/astro-components/#client-side-scripts] in an Astro component. 

## `fetch()` in Framework Components

The `fetch()` function is also globally available to any [framework components](/en/core-concepts/framework-components):

```tsx
// Movies.tsx
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';

const data = await fetch('https://example.com/movies.json').then((response) =>
  response.json()
);

// Components that are build-time rendered also log to the CLI.
// When rendered with a client:* directive, they also log to the browser console.
console.log(data);

const Movies: FunctionalComponent = () => {
// Output the result to the page
  return <div>{JSON.stringify(data)}</div>;
};

export default Movies;
```
