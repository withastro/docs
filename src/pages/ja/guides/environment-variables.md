---
layout: ~/layouts/MainLayout.astro
title: 環境変数
description: Astroプロジェクトでの環境変数の使い方を学ぶ
i18nReady: true
---

Astroは環境変数をViteを使用してサポートしており、[Viteのいずれかの方法で](https://vitejs.dev/guide/env-and-mode.html)環境変数の取得や設定ができます。

サーバ側のコードでは _すべて_ の環境変数が使えますが、クライアント側のコードではセキュリティのために`PUBLIC_`というプレフィックスを持つ環境変数のみが使えることに注意してください。

ベストプラクティスについては、公式の[環境変数の例](https://github.com/withastro/astro/tree/main/examples/env-vars)をご覧ください。

```ini
SECRET_PASSWORD=password123
PUBLIC_ANYBODY=there
```

この例では、`PUBLIC_ANYBODY`（`import.meta.env.PUBLIC_ANYBODY`でアクセス可能）はサーバサイドでもクライアントサイドでも利用でき、`SECRET_PASSWORD`（`import.meta.env.SECRET_PASSWORD`でアクセス可能）はサーバサイドでのみ利用できます。

## デフォルト環境変数

Astroでは、いくつかの環境変数をすぐに利用できます。

- `import.meta.env.MODE` (`development` | `production`): サイトが動作しているモードです。これは`astro dev`を実行している場合は`development`で、`astro build`を実行している場合は`production`になります。
- `import.meta.env.BASE_URL` (`string`): あなたのサイトの配信元のベースURLです。これは、[`base`オプション](/ja/reference/configuration-reference/#base)によって決まります。
- `import.meta.env.PROD` (`boolean`): あなたのサイトが本番環境で動作しているかどうかです。
- `import.meta.env.DEV` (`boolean`): 開発中のサイトかどうかです（常に`import.meta.env.PROD`の反対）。
- `import.meta.env.SITE` (`string`): プロジェクトの`astro.config`で指定された[`site`オプション](/ja/reference/configuration-reference/#site).

## 環境変数を設定する

環境変数は、プロジェクトディレクトリの`.env`ファイルから読み込めます。

また、`.env.production`や`.env.development`のように、ファイル名にモード(`production`または`development`)を付けることもできます。この場合、環境変数はそのモードでのみ有効になります。

プロジェクトディレクトリに`.env`ファイルを作成し、そこにいくつかの変数を追加するだけです。

```bash
# .env
# これはサーバー上で実行したときのみ有効です！
DB_PASSWORD="foobar"
# これはどこからでも呼び出せます！
PUBLIC_POKEAPI="https://pokeapi.co/api/v2"
```

```ini
.env                # すべてのケースで読み込まれます。
.env.local          # すべてのケースで読み込まれ、gitにはignoreされます。
.env.[mode]         # 指定したモードのみで読み込まれます。
.env.[mode].local   # 指定したモードのみで読み込まれ、gitにはignoreされます。
```

## 環境変数を取得する

Viteでは`process.env`の代わりに、ES2020で追加された`import.meta`機能を使用した`import.meta.env`を使用します。

:::tip[ブラウザサポートのことは心配しないでください！]
Viteは`import.meta.env`の記述をすべて静的な値に置き換えます。
:::

例えば、環境変数`PUBLIC_POKEAPI`を取得するには、`import.meta.env.PUBLIC_POKEAPI`を使用します。

```js
// import.meta.env.SSR === true のとき
const data = await db(import.meta.env.DB_PASSWORD);

// import.meta.env.SSR === false のとき
const data = fetch(`${import.meta.env.PUBLIC_POKEAPI}/pokemon/squirtle`);
```

:::caution
Viteは`import.meta.env`を静的に置き換えるので、`import.meta.env[key]`のような動的なキーでアクセスすることはできません。
:::

## TypeScriptのインテリセンス

デフォルトで、Viteは`vite/client.d.ts`の中で`import.meta.env`の型定義を提供します。

`.env.[mode]`ファイルではより多くのカスタム環境変数を定義できますが、`PUBLIC_`をプレフィックスとするユーザーが定義した環境変数のTypeScriptインテリセンスを取得したいと思うかもしれません。

これを実現するには、`src/`に`env.d.ts`を作成し、`ImportMetaEnv`を以下のように設定します。

```ts
interface ImportMetaEnv {
  readonly DB_PASSWORD: string;
  readonly PUBLIC_POKEAPI: string;
  // その他の環境変数...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```
