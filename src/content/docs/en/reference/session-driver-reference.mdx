---
title: Astro Session Driver API
sidebar:
  label: Session Driver API
i18nReady: true
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 4
---
import Since from '~/components/Since.astro';

Astro [sessions](/en/guides/sessions/) allow you to share data between requests for on-demand rendered pages. They require an Astro Session Driver to store session data.

## Built-in drivers

Astro exports built-in session drivers from `astro/config`:

```js
import { sessionDrivers } from 'astro/config'
```

Any [unstorage driver](https://unstorage.unjs.io/drivers) can be used, for example:

```js title="astro.config.mjs" ins={5-7} ins=" sessionDrivers "
import { defineConfig, sessionDrivers } from 'astro/config'

export default defineConfig({
    session: {
        driver: sessionDrivers.redis({
            url: process.env.REDIS_URL
        }),
    }
})
```

:::note
Some drivers may need extra packages to be installed. Some drivers may also require environment variables or credentials to be set. See the [Unstorage documentation](https://unstorage.unjs.io/drivers) for more information.
:::

## Building a session driver

A session driver is made of two parts:

- The [driver config](#the-session-driver-config), which lets Astro know what implementation to use at runtime and what config to forward
- The [driver implementation](#the-session-driver-implementation), which handles the storage logic at runtime

### The session driver config

A `SessionDriverConfig` is an object containing a required runtime [`entrypoint`](#entrypoint) and an optional [`config`](#config). The preferred method for implementing it is to export a function that returns this object and takes the configuration as an optional parameter.

The following example defines a memory driver config:

```ts title="driver/config.ts"
import type { SessionDriverConfig } from 'astro'

export interface Config {
    max?: number;
}

export function memoryDriver(config: Config = {}): SessionDriverConfig {
    return {
        entrypoint: new URL('./runtime.js', import.meta.url),
        config,
    }
}
```

It is then registered in the Astro config:

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config'
import { memoryDriver } from './driver/config'

export default defineConfig({
    session: {
        driver: memoryDriver({
            max: 500
        })
    }
})
```

#### `entrypoint`

<p>

**Type:** `string | URL`
<Since v="6.0.0" />
</p>

Defines the entrypoint for the [driver implementation](#the-session-driver-implementation).

#### `config`

<p>

**Type:** `Record<string, any> | undefined`
<Since v="6.0.0" />
</p>

Defines the serializable config passed to [driver implementation](#the-session-driver-implementation) at runtime.

### The session driver implementation

A `SessionDriver` is an object responsible for [storing](#setitem), [retrieving](#getitem) and [deleting](#removeitem) data when [using sessions at runtime](/en/reference/api-reference/#session) (e.g. `context.session.set()`). You can implement it in your session driver module by exporting a default function that takes the [driver config](#config) as parameter.

The following example implements a memory driver:

```ts title="driver/runtime.ts"
import type { SessionDriver } from 'astro'
import type { Config } from './config'
import { LRUCache } from 'lru-cache'

export default function(config: Config): SessionDriver {
    const cache = new LRUCache({ max: config.max })
    return {
        setItem: async (key, value) => {
            cache.set(key, value)
        },
        getItem: async (key) => {
            return cache.get(key)
        },
        removeItem: async (key) => {
            cache.delete(key)
        },
    }
}
```

#### `setItem()`

<p>

**Type:** `(key: string, value: any) => Promise<void>`
<Since v="6.0.0" />
</p>

Defines a function that sets session data by key.

#### `getItem()`

<p>

**Type:** `(key: string) => Promise<any>`
<Since v="6.0.0" />
</p>

Defines a function that retrieves session data by key.

#### `removeItem()`

<p>

**Type:** `(key: string) => Promise<void>`
<Since v="6.0.0" />
</p>

Defines a function that removes session data by key.

## Unstorage compatibility

The [built-in drivers](#built-in-drivers) provide the same drivers as Unstorage. When you need greater customization, you can [build your own driver](#building-a-session-driver) based on any [Unstorage driver](https://unstorage.unjs.io/drivers).

Install the `unstorage` package and pass the driver specifier as the [entrypoint](#entrypoint):

```ts title="driver/config.ts" {5}
import type { SessionDriverConfig } from "astro";

export function configuredRedisDriver(): SessionDriverConfig {
  return {
    entrypoint: "unstorage/drivers/redis",
    config: {
      tls: true,
    },
  };
}
```

You can also import an Unstorage driver and wrap it in your own implementation. This can be useful if you want to add extra logic to the driver or [override the configuration at runtime](/en/guides/sessions/#overriding-the-configuration-at-runtime).

The following example implements a Redis driver with a default `ttl` of 7 days:

```ts title="driver/runtime.ts"
import type { SessionDriver } from "astro";
import redisDriver, { type RedisOptions } from "unstorage/drivers/redis";

export default function (config: RedisOptions): SessionDriver {
  const driver = redisDriver({
    ...config,
    ttl: config.ttl ?? 60 * 60 * 24 * 7, // default to 7 days
  });

  return {
    async getItem(key) {
      return await driver.getItem(key);
    },
    async setItem(key, value) {
      await driver.setItem?.(key, value, {});
    },
    async removeItem(key) {
      await driver.removeItem?.(key, {});
    },
  };
}
```
