---
title: 'Astro DB'
description: Astro専用に設計された完全管理型SQLデータベース、Astro DBの使い方を学びましょう。
githubIntegrationURL: '[https://github.com/withastro/astro/tree/main/packages/db/](https://github.com/withastro/astro/tree/main/packages/db/)'
i18nReady: true
---

import { FileTree } from '@astrojs/starlight/components';
import PackageManagerTabs from '~~/components/tabs/PackageManagerTabs.astro';
import ReadMore from '~~/components/ReadMore.astro';
import Since from '\~/components/Since.astro';
import { Steps } from '@astrojs/starlight/components';

Astro DBは、Astroエコシステム向けに設計された完全管理型のSQLデータベースです。Astro内でローカル開発を行い、libSQL互換のデータベースへデプロイできます。

Astro DBは、データの設定、開発、クエリ実行をまとめて行える完全なソリューションです。`astro dev`を実行すると、`.astro/content.db`内にローカルデータベースが作成され、Dockerやネットワーク接続なしでデータを管理できます。

## インストール

組み込みの`astro add`コマンドを使って[`@astrojs/db`インテグレーション](/ja/guides/integrations-guide/db/)をインストールします。

<PackageManagerTabs>
  <Fragment slot="npm">
  ```sh
  npx astro add db
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```sh
  pnpm astro add db
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```sh
  yarn astro add db
  ```
  </Fragment>
</PackageManagerTabs>

## データベースを定義する

`astro add`コマンドで`@astrojs/db`をインストールすると、プロジェクト内に`db/config.ts`ファイルが自動作成され、ここでデータベーステーブルを定義します。

```ts title="db/config.ts"
import { defineDb } from 'astro:db';

export default defineDb({
  tables: { },
})
```

### テーブル

Astro DBでは、データはSQLテーブルを使って保存されます。テーブルはデータを行と列で構造化し、各列は行の値の型を制約します。

既存のlibSQLデータベース内のデータ、または新規データベースで収集するデータの構造を`db/config.ts`ファイル内で定義します。これにより、Astroはそのテーブルにクエリを投げるためのTypeScriptインターフェースを生成します。結果として、プロパティの自動補完や型チェック付きでデータへアクセスでき、完全なTypeScriptサポートが得られます。

データベーステーブルを設定するには、`astro:db`から`defineTable()`と`column`ユーティリティをインポートして使用します。その後、テーブルの名前（大文字小文字を区別）と各列に入るデータの型を定義します。

以下は、`author`と`body`という必須のテキスト列を持つ`Comment`テーブルを設定し、それを`defineDb()`のエクスポートでプロジェクト内で利用可能にする例です。

```ts title="db/config.ts" "Comment"
import { defineDb, defineTable, column } from 'astro:db';

const Comment = defineTable({
  columns: {
    author: column.text(),
    body: column.text(),
  }
})

export default defineDb({
  tables: { Comment },
})
```

<ReadMore>[テーブル設定リファレンス](/ja/guides/integrations-guide/db/#table-configuration-reference)を参照してください。</ReadMore>

### 列（カラム）

Astro DBは以下の列タイプをサポートしています。

```ts title="db/config.ts" "column.text()" "column.number()" "column.boolean()" "column.date()" "column.json()"
import { defineTable, column } from 'astro:db';

const Comment = defineTable({
  columns: {
    // テキスト文字列。
    author: column.text(),
    // 整数値。
    likes: column.number(),
    // 真偽値。
    flagged: column.boolean(),
    // JavaScriptのDateオブジェクトとしてクエリされる日時値。
    published: column.date(),
    // 型指定されていないJSONオブジェクト。
    metadata: column.json(),
  }
});
```

<ReadMore>[テーブル列リファレンス](/ja/guides/integrations-guide/db/#table-configuration-reference)も参照してください。</ReadMore>

### テーブル参照

テーブル間のリレーションは、データベース設計における一般的なパターンです。たとえば、`Blog`テーブルは`Comment`、`Author`、`Category`といった他のテーブルと密接に関連する場合があります。

テーブル間の関係は**参照カラム**を使って定義し、データベーススキーマ内に保存できます。リレーションを確立するには、以下が必要です。

- 参照される側のテーブルに**識別子カラム**（通常は`primaryKey`プロパティを持つ`id`カラム）があること。
- 基本テーブルに**参照する`id`を保存するカラム**を設置すること。このカラムは`references`プロパティを使用して関係を確立します。

以下は、`Comment`テーブルの`authorId`カラムが`Author`テーブルの`id`カラムを参照している例です。

```ts title="db/config.ts" {3, 10}
const Author = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  }
});

const Comment = defineTable({
  columns: {
    authorId: column.number({ references: () => Author.columns.id }),
    body: column.text(),
  }
});
```

## 開発用データベースのシード

開発環境では、AstroはDB設定を使用してスキーマに基づいたローカル型を生成します。これらの型は開発サーバー起動時に毎回シードファイルから新しく生成され、型安全性とオートコンプリート付きでデータのクエリや操作ができます。

開発中に[リモートデータベースへ接続](#リモートデータベースへの接続)しない限り、本番データへアクセスすることはできません。これによりデータを保護しつつ、型安全性のある動作データベースを用いたテスト・開発が可能になります。

テストやデバッグ用の開発データをAstroプロジェクトにシードするには、`db/seed.ts`ファイルを作成します。`astro:db`から定義済みの`db`オブジェクトやテーブルをインポートし、各テーブルに初期データを`insert`します。この開発用データは、データベーススキーマおよび本番データの形式と一致させる必要があります。

以下の例では、`Comment`テーブルと`Author`テーブルにそれぞれ2行の開発用データを定義しています。

```ts title="db/seed.ts"
import { db, Comment, Author } from 'astro:db';

export default async function() {
  await db.insert(Author).values([
    { id: 1, name: "Kasim" },
    { id: 2, name: "Mina" },
  ]);

  await db.insert(Comment).values([
    { authorId: 1, body: 'Hope you like Astro DB!' },
    { authorId: 2, body: 'Enjoy!'},
  ])
}
```

開発サーバーはこのファイルの変更を検知すると自動的にデータベースを再起動し、型を再生成し、`seed.ts`から新たに開発データをシードします。

## 本番用のlibSQLデータベースに接続する

Astro DBは、ローカルのlibSQLデータベース、またはlibSQLリモートプロトコルを公開しているマネージド・セルフホスト型サーバーのどちらにも接続できます。

Astro DBをlibSQLデータベースに接続するには、データベースプロバイダーから取得した以下の環境変数を設定します。

- `ASTRO_DB_REMOTE_URL`: ローカルまたはリモートlibSQL DBの接続URL。このURLには、同期や暗号化などの[URL設定オプション](#リモートurl設定オプション)をパラメータとして含めることができます。
- `ASTRO_DB_APP_TOKEN`: libSQLサーバーの認証トークン。これはリモートデータベースに必要であり、[ローカルDB（ファイルまたはメモリ内）](#urlスキームとホスト)には不要です。

サービスによってはCLIやWeb UIを使ってこれらの値を取得できます。以下では、例としてTursoを使用し、この値を設定する手順を示しますが、他のプロバイダーも自由に利用できます。

### Tursoの始め方

Tursoは、Astro DBを支えるオープンソースのSQLiteフォーク[libSQL](https://github.com/tursodatabase/libsql)の開発元です。完全管理型のlibSQLデータベースプラットフォームを提供し、Astroと完全互換です。

以下の手順では、Turso CLIのインストール、ログイン（またはサインアップ）、新しいデータベースの作成、必要な環境変数の取得、スキーマのリモートデータベースへのプッシュ方法を案内します。

<Steps>

1. [Turso CLI](https://docs.turso.tech/cli/installation)をインストールします。

2. Tursoに[ログインまたはサインアップ](https://docs.turso.tech/cli/authentication)します。

3. 新しいデータベースを作成します。例として、データベース名を`andromeda`とします。

   ```sh "andromeda"
   turso db create andromeda
   ```

4. `show`コマンドを実行して、新しく作成したデータベースの情報を確認します。

   ```sh "andromeda"
   turso db show andromeda
   ```

   出力される`URL`値をコピーし、`ASTRO_DB_REMOTE_URL`に設定します。

   ```dotenv title=".env" "libsql://andromeda-houston.turso.io"
   ASTRO_DB_REMOTE_URL=libsql://andromeda-houston.turso.io
   ```

5. データベースへのリクエストを認証する新しいトークンを作成します。

   ```sh "andromeda"
   turso db tokens create andromeda
   ```

   コマンド出力をコピーし、`ASTRO_DB_APP_TOKEN`に設定します。

   ```dotenv title=".env" add={2} "eyJhbGciOiJF...3ahJpTkKDw"
   ASTRO_DB_REMOTE_URL=libsql://andromeda-houston.turso.io
   ASTRO_DB_APP_TOKEN=eyJhbGciOiJF...3ahJpTkKDw
   ```

6. DBスキーマとメタデータを新しいTursoデータベースにプッシュします。

   ```sh
   astro db push --remote
   ```

7. 接続が完了しました！少し休憩しましょう。👾

   ```sh
   turso relax
   ```

</Steps>

Tursoの詳細機能については、[Tursoドキュメント](https://docs.turso.tech)を参照してください。

## リモートデータベースへの接続

Astro DBでは、ローカルおよびリモートのデータベースへの接続が可能です。デフォルトでは、Astroは`dev`および`build`コマンド用にローカルデータベースファイルを使用し、毎回テーブルを再作成して開発用のシードデータを挿入します。

ホスティングされたリモートデータベースに接続するには、`--remote`フラグを使用します。このフラグにより、リモートデータベースへの読み取りおよび書き込みアクセスが有効化され、本番環境で[ユーザーデータを受け取り、永続化](#インサート)できます。

ビルドコマンドに`--remote`フラグを追加して構成します。

```json title="package.json" "--remote"
{
  "scripts": {
    "build": "astro build --remote"
  }
}
```

また、コマンドラインで直接フラグを使用することもできます。

```bash
# リモート接続でビルド
astro build --remote

# リモート接続で開発
astro dev --remote
```

`--remote`フラグは、ローカルのビルド中およびサーバー上の両方でリモートDBへの接続を使用します。ローカル開発環境とデプロイメントプラットフォームの両方に必要な環境変数を必ず設定してください。

Astro DBプロジェクトをデプロイする際は、デプロイメントプラットフォームのビルドコマンドを`npm run build`（または使用するパッケージマネージャーの同等のコマンド）に設定し、`package.json`内で構成済みの`--remote`フラグを利用できるようにしてください。

### リモートURL設定オプション

`ASTRO_DB_REMOTE_URL`環境変数は、データベースの場所および同期や暗号化などの他のオプションを構成します。

#### URLスキームとホスト

libSQLは、リモートサーバー用のトランスポートプロトコルとしてHTTPおよびWebSocketの両方をサポートしています。また、ローカルファイルやインメモリDBの使用も可能です。これらは接続URL内の以下のスキームで構成できます。

- `memory:` → インメモリDBを使用（この場合ホストは空）。
- `file:` → ローカルファイルを使用（ホストはファイルへのパス例：`file:path/to/file.db`）。
- `libsql:` → ライブラリが推奨するプロトコルでリモートサーバーを使用（バージョンによって異なる場合あり）。ホストはサーバーのアドレス（例：`libsql://your.server.io`）。
- `http:` → HTTP経由でリモートサーバーを使用。`https:`を使用するとセキュアな接続が可能。ホストは`libsql:`と同じ。
- `ws:` → WebSocket経由でリモートサーバーを使用。`wss:`を使用するとセキュアな接続が可能。ホストは`libsql:`と同じ。

libSQL接続の詳細（例：暗号化キー、レプリケーション、同期間隔）は、リモート接続URL内のクエリパラメータとして構成できます。

たとえば、暗号化されたローカルファイルをlibSQLサーバーの埋め込みレプリカとして使用する場合、以下の環境変数を設定します。

```dotenv title=".env"
ASTRO_DB_REMOTE_URL=file://local-copy.db?encryptionKey=your-encryption-key&syncInterval=60&syncUrl=libsql%3A%2F%2Fyour.server.io
ASTRO_DB_APP_TOKEN=token-to-your-remote-url
```

#### `encryptionKey`

libSQLは暗号化データベースをネイティブにサポートしています。この検索パラメータを渡すことで、指定したキーを使用して暗号化が有効になります。

```dotenv title=".env"
ASTRO_DB_REMOTE_URL=file:path/to/file.db?encryptionKey=your-encryption-key
```

#### `syncUrl`

埋め込みレプリカは、libSQLクライアントの機能で、ローカルファイルまたはインメモリ上に完全に同期されたデータベースのコピーを作成し、超高速読み取りを実現します。書き込みは`syncUrl`で定義されたリモートデータベースに送信され、ローカルコピーと同期されます。

このプロパティを使用して、別のデータベースの埋め込みレプリカに変換するための接続URLを渡します。使用できるのは`file:`および`memory:`スキームのみです。パラメータはURLエンコードする必要があります。

たとえば、`libsql://your.server.io`上のデータベースのインメモリ埋め込みレプリカを作成する場合、次のように接続URLを設定します。

```dotenv title=".env"
ASTRO_DB_REMOTE_URL=memory:?syncUrl=libsql%3A%2F%2Fyour.server.io
```

#### `syncInterval`

埋め込みレプリカの同期間隔（秒単位）。デフォルトでは起動時と書き込み後のみ同期されます。

このプロパティは`syncUrl`が設定されている場合のみ使用されます。たとえば、1分ごとに同期するインメモリ埋め込みレプリカを設定するには、次の環境変数を指定します。

```dotenv title=".env"
ASTRO_DB_REMOTE_URL=memory:?syncUrl=libsql%3A%2F%2Fyour.server.io&syncInterval=60
```

## データベースをクエリする

プロジェクト内の任意の[Astroページ](/ja/basics/astro-pages/#astro-pages)、[エンドポイント](/ja/guides/endpoints/)、または[アクション](/ja/guides/actions/)から、提供されている`db` ORMおよびクエリビルダーを使用してデータベースをクエリできます。

### Drizzle ORM

```ts
import { db } from 'astro:db';
```

Astro DBには組み込みの[Drizzle ORM](https://orm.drizzle.team/)クライアントが含まれています。クライアントを使うために特別なセットアップや手動設定は不要です。Astroを実行すると、Astro DBの`db`クライアントはローカル・リモート両方のデータベースと通信するよう自動的に設定されます。データベーススキーマ定義を基に、存在しない列やテーブルを参照した際にはTypeScriptエラーを出す型安全なSQLクエリが実行されます。

### Select

次の例は`Comment`テーブルの全行を選択します。これは`db/seed.ts`からシードされた開発データの完全な配列を返し、ページテンプレート内で使用できます。

```astro title="src/pages/index.astro"
---
import { db, Comment } from 'astro:db';

const comments = await db.select().from(Comment);
---

<h2>Comments</h2>

{
  comments.map(({ author, body }) => (
    <article>
      <p>Author: {author}</p>
      <p>{body}</p>
    </article>
  ))
}
```

<ReadMore>[Drizzleの`select()` APIリファレンス](https://orm.drizzle.team/docs/select)を参照してください。</ReadMore>

### インサート

フォームリクエストの処理やリモートデータベースへのデータ挿入など、ユーザー入力を受け付けるには、Astroプロジェクトを[オンデマンドレンダリング](/ja/guides/on-demand-rendering/)用に設定し、[デプロイ環境に応じたアダプター](/ja/guides/on-demand-rendering/#add-an-adapter)を追加します。

次の例は、パースされたフォームのPOSTリクエストに基づき`Comment`テーブルに行を挿入する例です。

```astro
---
// src/pages/index.astro
import { db, Comment } from 'astro:db';

if (Astro.request.method === 'POST') {
  const formData = await Astro.request.formData();
  const author = formData.get('author');
  const body = formData.get('body');
  if (typeof author === 'string' && typeof body === 'string') {
    await db.insert(Comment).values({ author, body });
  }
}

const comments = await db.select().from(Comment);
---

<form method="POST" style="display: grid">
	<label for="author">Author</label>
	<input id="author" name="author" />

	<label for="body">Body</label>
	<textarea id="body" name="body"></textarea>

	<button type="submit">Submit</button>
</form>

<!-- `comments`をレンダリング -->
```

また、[Astroアクション](/ja/guides/actions/)を使用してAstro DBテーブルにデータを挿入することもできます。次の例はアクションを使用して`Comment`テーブルに行を挿入する例です。

```ts
// src/actions/index.ts
import { db, Comment } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  addComment: defineAction({
    input: z.object({
      author: z.string(),
      body: z.string(),
    }),
    handler: async (input) => {
      const updatedComments = await db
        .insert(Comment)
        .values(input)
        .returning();
      return updatedComments;
    },
  }),
};
```

<ReadMore>[Drizzleの`insert()` APIリファレンス](https://orm.drizzle.team/docs/insert)を参照してください。</ReadMore>

### Delete

APIエンドポイントからデータベースをクエリすることもできます。次の例は、`id`パラメータに基づいて`Comment`テーブルから行を削除する例です。

```ts
// src/pages/api/comments/[id].ts
import type { APIRoute } from "astro";
import { db, Comment, eq } from 'astro:db';

export const DELETE: APIRoute = async (ctx) => {
  await db.delete(Comment).where(eq(Comment.id, ctx.params.id ));
  return new Response(null, { status: 204 });
}
```

<ReadMore>[Drizzleの`delete()` APIリファレンス](https://orm.drizzle.team/docs/delete)を参照してください。</ReadMore>

### フィルタリング

特定のプロパティに基づいてテーブル結果をクエリするには、[Drizzleの部分選択用オプション](https://orm.drizzle.team/docs/select#partial-select)を使用します。たとえば、`select()`クエリに[`.where()`呼び出し](https://orm.drizzle.team/docs/select#filtering)を追加し、比較条件を渡します。

以下の例では、`Comment`テーブル内の`body`に"Astro DB"というフレーズを含む全行をクエリしています。[`like()`演算子](https://orm.drizzle.team/docs/operators#like)を使用して、フレーズが含まれているかを確認します。

```astro title="src/pages/index.astro"
---
import { db, Comment, like } from 'astro:db';

const comments = await db.select().from(Comment).where(
    like(Comment.body, '%Astro DB%')
);
---
```

### Drizzleユーティリティ

クエリ構築用のすべてのDrizzleユーティリティは`astro:db`モジュールから提供されます。これには以下が含まれます。

- `eq()`や`gt()`のような[フィルタ演算子](https://orm.drizzle.team/docs/operators)
- `count()`のような[集約ヘルパー](https://orm.drizzle.team/docs/select#aggregations-helpers)
- 生のSQLクエリを書くための[`sql`ヘルパー](https://orm.drizzle.team/docs/sql)

```ts
import { eq, gt, count, sql } from 'astro:db';
```

### リレーション

SQLのjoinを使って複数のテーブルから関連データをクエリできます。joinクエリを作成するには、`db.select()`ステートメントにjoin演算子を追加します。各関数は結合するテーブルと、2つのテーブル間で行を一致させる条件を受け取ります。

以下の例では、`innerJoin()`関数を使用し、`Comment`の著者と、それに関連する`Author`情報を`authorId`列を基に結合しています。これにより、各`Author`および`Comment`行がトップレベルのプロパティとして含まれるオブジェクトの配列が返されます。

```astro title="src/pages/index.astro"
---
import { db, eq, Comment, Author } from 'astro:db';

const comments = await db.select()
  .from(Comment)
  .innerJoin(Author, eq(Comment.authorId, Author.id));
---

<h2>Comments</h2>

{
  comments.map(({ Author, Comment }) => (
    <article>
      <p>Author: {Author.name}</p>
      <p>{Comment.body}</p>
    </article>
  ))
}
```

<ReadMore>[Drizzleのjoinリファレンス](https://orm.drizzle.team/docs/joins#join-types)ですべての利用可能なjoin演算子や設定オプションを確認できます。</ReadMore>

### バッチトランザクション

すべてのリモートデータベースクエリはネットワークリクエストとして行われます。大量のクエリをまとめて単一のトランザクションにまとめたい場合や、クエリの一部が失敗した際に自動ロールバックを行いたい場合があります。

以下の例では、`db.batch()`メソッドを使って単一のリクエストで複数の行をシードしています。

```ts
// db/seed.ts
import { db, Author, Comment } from 'astro:db';

export default async function () {
  const queries = [];
  for (let i = 0; i < 100; i++) {
    queries.push(db.insert(Comment).values({ body: `Test comment ${i}` }));
  }
  await db.batch(queries);
}
```

<ReadMore>[Drizzleの`db.batch()`ドキュメント](https://orm.drizzle.team/docs/batch-api)で詳細を確認してください。</ReadMore>

## データベースへの変更をプッシュする

開発中に行った変更をデータベースにプッシュできます。

### テーブルスキーマをプッシュする

プロジェクトが成長するにつれて、テーブルスキーマは変化する可能性があります。設定変更をローカルで安全にテストし、デプロイ時にリモートデータベースへプッシュできます。

ローカルのスキーマ変更をリモートデータベースにプッシュするには、CLIで`astro db push --remote`コマンドを使用します。

<PackageManagerTabs>
  <Fragment slot="npm">
  ```sh
  npm run astro db push --remote
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```sh
  pnpm astro db push --remote
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```sh
  yarn astro db push --remote
  ```
  </Fragment>
</PackageManagerTabs>

このコマンドは、ローカルの変更がデータ損失なしに適用できるか検証し、必要に応じて安全にスキーマ変更を行う方法を提案します。

#### 互換性のないスキーマ変更をプッシュする

リモートデータベース上の既存データと互換性のない形でテーブルスキーマを変更する場合は、本番データベースをリセットする必要があります。

互換性のないスキーマ更新をプッシュするには、`--force-reset`フラグを追加して本番データをすべてリセットします。

<PackageManagerTabs>
  <Fragment slot="npm">
  ```sh
  npm run astro db push --remote --force-reset
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```sh
  pnpm astro db push --remote --force-reset
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```sh
  yarn astro db push --remote --force-reset
  ```
  </Fragment>
</PackageManagerTabs>

### テーブルの名前変更

スキーマをリモートデータベースにプッシュした後でもテーブル名を変更できます。

**重要な本番データがない場合**は、`--force-reset`フラグを使用して[データベースをリセット](#互換性のないスキーマ変更をプッシュする)できます。このフラグはデータベース内のすべてのテーブルを削除し、新しいスキーマに基づいて再作成します。

本番データを保持したままテーブル名を変更する場合は、非破壊的な変更を段階的に行う必要があります。

以下は`Comment`テーブルを`Feedback`に名前を変え、古いテーブルを非推奨にする例です。

<Steps>

1. データベース設定ファイル内で、リネーム対象のテーブルに`deprecated: true`プロパティを追加します。

   ```ts title="db/config.ts" ins={2}
   const Comment = defineTable({
     deprecated: true,
   	columns: {
   		author: column.text(),
   		body: column.text(),
   	}
   });
   ```

2. 既存テーブルのプロパティと完全に一致する新しい名前のテーブルスキーマを追加します。

   ```ts title="db/config.ts" ins={8-14}
   const Comment = defineTable({
     deprecated: true,
     columns: {
     	author: column.text(),
     	body: column.text(),
     }
   });
   const Feedback = defineTable({
     columns: {
       author: column.text(),
       body: column.text(),
     }
   });
   ```

3. `astro db push --remote`で[リモートデータベースへプッシュ](#テーブルスキーマをプッシュする)します。これにより、新しいテーブルが追加され、古いテーブルが非推奨としてマークされます。

4. プロジェクト内のコードをすべて新しいテーブルを使用するよう更新します。必要に応じてデータ移行も行います。

5. 古いテーブルがプロジェクト内で完全に使用されなくなったことを確認したら、`config.ts`からスキーマを削除します。
   \`\`\`ts title="db/config.ts" del={1-7}
   const Comment = defineTable({
   deprecated: true,
   columns: {
   author: column.text(),
   body: column.text(),
   }
   });

   const Feedback = defineTable({
   columns: {
   author: column.text(),
   body: column.text(),
   }
   });

   ```
   ```

6. 再度`astro db push --remote`でリモートデータベースにプッシュします。古いテーブルは削除され、新しい名前のテーブルだけが残ります。

   </Steps>

### テーブルデータをプッシュする

シードやデータマイグレーションのためにリモートデータベースにデータをプッシュする必要がある場合があります。`astro:db`モジュールを使って型安全なクエリを記述した`.ts`ファイルを作成し、`astro db execute <ファイルパス> --remote`コマンドで実行します。

以下のコメントは、`astro db execute db/seed.ts --remote`コマンドでシードできます。

```ts
// db/seed.ts
import { Comment } from 'astro:db';

export default async function () {
  await db.insert(Comment).values([
    { authorId: 1, body: 'Hope you like Astro DB!' },
    { authorId: 2, body: 'Enjoy!' },
  ])
}
```

<ReadMore>[CLIリファレンス](/ja/guides/integrations-guide/db/)ですべてのコマンドを確認できます。</ReadMore>

## Astro DBインテグレーションを構築する

[Astroインテグレーション](/ja/reference/integrations-reference/)を使って、追加のAstro DBテーブルやシードデータをユーザープロジェクトに拡張できます。

`astro:db:setup`フック内の`extendDb()`メソッドを使用して、追加のAstro DB設定やシードファイルを登録します。`defineDbIntegration()`ヘルパーを使うと、`astro:db:setup`フック内でTypeScriptサポートとオートコンプリートが利用できます。

```js {8-13}
// my-integration/index.ts
import { defineDbIntegration } from '@astrojs/db/utils';

export default function MyIntegration() {
  return defineDbIntegration({
    name: 'my-astro-db-powered-integration',
    hooks: {
      'astro:db:setup': ({ extendDb }) => {
        extendDb({
          configEntrypoint: '@astronaut/my-package/config',
          seedEntrypoint: '@astronaut/my-package/seed',
        });
      },
    },
  });
}
```

インテグレーションの[設定](#データベースを定義する)および[シード](#開発用データベースのシード)ファイルは、ユーザー定義のものと同じ形式です。

### インテグレーション内の型安全な操作

インテグレーション開発中は、`astro:db`からエクスポートされるAstro生成のテーブル型を利用できない場合があります。完全な型安全性を確保するためには、`asDrizzleTable()`ユーティリティを使い、データベース操作用のテーブル参照オブジェクトを作成します。

たとえば、以下のように`Pets`データベーステーブルをセットアップするインテグレーションの場合:

```js
// my-integration/config.ts
import { defineDb, defineTable, column } from 'astro:db';

export const Pets = defineTable({
  columns: {
    name: column.text(),
    species: column.text(),
  },
});

export default defineDb({ tables: { Pets } });
```

シードファイルでは`Pets`をインポートし、`asDrizzleTable()`を使って型チェック付きで行を挿入できます。

```js {2,7} /typeSafePets(?! )/
// my-integration/seed.ts
import { asDrizzleTable } from '@astrojs/db/utils';
import { db } from 'astro:db';
import { Pets } from './config';

export default async function() {
  const typeSafePets = asDrizzleTable('Pets', Pets);

  await db.insert(typeSafePets).values([
    { name: 'Palomita', species: 'cat' },
    { name: 'Pan', species: 'dog' },
  ]);
}
```

`asDrizzleTable('Pets', Pets)`で返される値は`import { Pets } from 'astro:db'`と同等ですが、Astroの型生成が実行できない場合でも利用可能です。データベースへのクエリや挿入が必要なインテグレーションコード内で使用できます。

## Migrate from Astro Studio to Turso

<Steps>

1. In the [Studio dashboard](https://studio.astro.build/), navigate to the project you wish to migrate. In the settings tab, use the "Export Database" button to download a dump of your database.
2. Follow the official instructions to [install the Turso CLI](https://docs.turso.tech/cli/installation) and [sign up or log in](https://docs.turso.tech/cli/authentication) to your Turso account.
3. Create a new database on Turso using the `turso db create` command.
   ```sh
   turso db create [database-name]
   ```
4. Fetch the database URL using the Turso CLI, and use it as the environment variable `ASTRO_DB_REMOTE_URL`.
   ```sh
   turso db show [database-name]
   ```
   ```dotenv
   ASTRO_DB_REMOTE_URL=[your-database-url]
   ```
5. Create a token to access your database, and use it as the environment variable `ASTRO_DB_APP_TOKEN`.
   ```sh
   turso db tokens create [database-name]
   ```
   ```dotenv
   ASTRO_DB_APP_TOKEN=[your-app-token]
   ```
6. Push your DB schema and metadata to the new Turso database.
   ```sh
   astro db push --remote
   ```
7. Import the database dump from step 1 into your new Turso DB.
   ```sh
   turso db shell [database-name] < ./path/to/dump.sql
   ```
8. Once you have confirmed your project connects to the new database, you can safely delete the project from Astro Studio.

</Steps>
