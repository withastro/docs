---
layout: ~/layouts/MainLayout.astro
title: Data Fetching
description: Learn how to fetch remote data with Astro using the fetch API.


---

Astro pages can fetch remote data at build time to help generate your pages.

## Astro `fetch()`

[Astro Pages](/en/core-concepts/astro-pages) have access to the global `fetch()` function in their component script to make HTTP requests to APIs. This fetch call will be executed at page build time, and the data will be available to the component template for generating dynamic HTML. 

💡 [**Top-level await**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await) is supported in your Astro component script.

💡 Fetched data can be passed to both Astro and framework components, as props.

```astro
// src/pages/User.astro
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

### requestOptions

```astro
---
const headers = new Headers()
headers.append("API_KEY", import.meta.env.API_KEY)

const requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
  cors:"no-cors"
};

const response = await fetch(
  `https://api.ebird.org/v2/data/obs/CA-PE/recent/notable?detail=full`,
  requestOptions
);
const data = await response.json();
console.log(data);
---
<html> <!-- Your page --></html>
```

### GraphQL queries

Astro can also `fetch()` to query a GraphQL server at build time with any valid GraphQL query. 

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';

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
<BaseLayout title = "GraphQL API fetch in Astro" >
  <h1>Fetching Weather at build time</h2>
  <h2>City: {weather.getCityByName.name}</h3>
  <p>Weather summary: {weather.getCityByName.weather.summary.description}</p>
</BaseLayout>
```
> 💡 Remember, all data in Astro pages is **fetched once, at build time**. For data that can be re-fetched multiple times client side, use a [framework component](/en/core-concepts/framework-components).

## `fetch()` in Framework Components

The `fetch()` function is also globally available to any [framework components](/en/core-concepts/framework-components):

```tsx
// Movies.tsx
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';

const data = fetch('https://example.com/movies.json').then((response) =>
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