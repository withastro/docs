---
layout: ~/layouts/MainLayout.astro
title: 数据获取
description: 学习如何使用 Astro fetch API 获取远程数据。
---

构建时，`.astro` 文件可以获取远程数据来辅助页面生成。


## Astro 中的 `fetch()`

所有 [Astro 组件](/zh-cn/core-concepts/astro-components/) 都可以在它们的组件 script 中使用[全局 `fetch()` 函数](https://developer.mozilla.org/en-US/docs/Web/API/fetch)发生 API 请求。Fetch 调用将会在构建时执行，组件模板中所有有效数据都会用于生成动态 HTML。

💡 在 Astro 组件 script 中[使用**顶层 await**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await) 的优势。

💡 将获取的数据作为参数传递给 Astro 和框架组件。

```astro
---
// src/components/User.astro
import Contact from '../components/Contact.jsx';
import Location from '../components/Location.astro';

const response = await fetch('https://randomuser.me/api/');
const data = await response.json();
const randomUser = data.results[0]
---
<!-- 获取的数据可以在构建时在 HTML 中渲染 -->
<h1>User</h1>
<h2>{randomUser.name.first} {randomUser.name.last}</h2>

<!-- 获取的数据可以在构建时传递给组件作为参数 -->
<Contact client:load email={randomUser.email} />
<Location city={randomUser.location.city} />
```

### GraphQL 查询

Astro 也可以使用 `fetch()` 和任一有效的 GraphQL 查询来查询 GraphQL 服务器。

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
<h1>Fetching Weather at build time</h1>
<h2>{weather.getCityByName.name}, {weather.getCityByName.country}</h2>
<p>Weather: {weather.getCityByName.weather.summary.description}</p>
```

:::note
记住，Astro 组件中所有数据都是在组件被渲染时获取的。

你部署在 Astro 站点将只会在**构建时获取一次数据**。在开发中，你会在组件刷新时看到数据获取。如果你需要在客户端中多次重新获取数据，请在 Astro 组件中使用[框架组件](/zh-cn/core-concepts/framework-components/)或[客户端 script](/zh-cn/core-concepts/astro-components/#客户端脚本)。
:::


## 在框架组件中使用 `fetch()`

在任意[框架组件](/zh-cn/core-concepts/framework-components/)中也都可以使用 `fetch()` 函数：

```tsx
// Movies.tsx
import type { FunctionalComponent } from 'preact';
import { h } from 'preact';

const data = await fetch('https://example.com/movies.json').then((response) =>
  response.json()
);

// 构建时渲染的组件也会输出日志到 CLI。
// 当用 client:* 指令渲染时，它们也会输出到浏览器控制台。
console.log(data);

const Movies: FunctionalComponent = () => {
// Output the result to the page
  return <div>{JSON.stringify(data)}</div>;
};

export default Movies;
```
