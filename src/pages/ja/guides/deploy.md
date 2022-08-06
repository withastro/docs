---
layout: ~/layouts/MainLayout.astro
title: デプロイ
description: AstroのWebサイトをデプロイする複数の方法。
---

以下のガイドは、いくつかの共通の前提条件に基づいています。

- ビルドされたファイルはデフォルトの(`dist/`)に出力されています。この出力場所は、[`outDir`設定オプション](/ja/reference/configuration-reference/#outdir)を使って変更できます。
- npmを使用しています。Yarnや他のパッケージマネージャを使用している場合は、同等のコマンドでスクリプトを実行できます。
- Astroはプロジェクトのローカルのdev Dependencyにインストールされ、以下のnpmスクリプトが設定されています。

```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "astro": "astro"
  }
}
```

> これらのガイドでは、Astroサイトを静的にデプロイする手順を説明します。Astroは、SSR(Server Side Rendering)にも対応しています。
>
> 📚 [AstroプロジェクトでSSRを有効にする](/ja/guides/server-side-rendering/)についてもっと読む。

## アプリのビルド

`npm run build`コマンドを実行して、アプリをビルドします。

```bash
$ npm run build
```

デフォルトでは、ビルドされたアウトプットは`dist/`に生成されます。この`dist/`フォルダを、お好みのプラットフォームにデプロイできます。

## GitHub Pages

[GitHub Actions](https://github.com/features/actions)を使って、AstroサイトをGitHub Pagesにデプロイすると、自動的にサイトをビルドしてデプロイできます。これを行うには、ソースリポジトリがGitHubにホストされている必要があります。

1. `astro.config.mjs`で[`site`](/ja/reference/configuration-reference/#site)と、必要なら[`base`](/ja/reference/configuration-reference/#base)オプションを設定します。
    - `site`は`https://<あなたのユーザー名>.github.io/`のようなものになります。
    - `base`には、あなたのリポジトリの名前を指定します。(リポジトリ名が `<あなたのユーザー名>.github.io`ならば、`base`を含める必要はありません)。
1. プロジェクト内の`.github/workflows/deploy.yml`に新規ファイルを作成し、以下のYAMLを貼り付けます。

    ```yaml
    name: Github Pages Astro CI

    on:
      # `main`ブランチにプッシュするたびにワークフローを起動させる
      # 別のブランチ名を使う場合は`main`をあなたのブランチ名で置き換えてください。
      push:
        branches: [main]
      # GitHubのActionsタブから、このワークフローを手動で実行できるようにします。
      workflow_dispatch:

    jobs:
      deploy:
        runs-on: ubuntu-20.04

        # このジョブがあなたのリポジトリに変更をプッシュすることを許可する
        permissions:
          contents: write

        steps:
          - name: Check out your repository using git
            uses: actions/checkout@v2

          - name: Use Node.js 16
            uses: actions/setup-node@v2
            with:
              node-version: 16

          # npmを使っていない場合、`npm ci`を`yarn install`や`pnpm i`に置き換えてください。
          - name: Install dependencies
            run: npm ci

          # npmを使っていない場合、`npm run build`を`yarn build`や`pnpm run build`に置き換えてください。
          - name: Build Astro
            run: npm run build

          - name: Deploy to GitHub Pages
            uses: peaceiris/actions-gh-pages@v3
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              # `./dist`はAstroがデフォルトでアウトプットするディレクトリです。
              # 変更した場合は、こちらも更新してください。
              publish_dir: ./dist
    ```
    > 最後の"Deploy to GitHub Pages"ステップのさまざまな設定方法については、[GitHub Pages Actionのドキュメント](https://github.com/marketplace/actions/github-pages-action)をご覧ください。

1. 新しいワークフローファイルをコミットし、GitHubにプッシュします。
1. GitHubで、リポジトリの**Settings**タブに行き、**Pages**セクションを見つけます。
1. サイトの**Source**として`gh-pages`ブランチを選択し、**Save**を押します。

これであなたのサイトが公開されたはずです！ Astroプロジェクトのリポジトリに変更をプッシュすると、GitHub Actionが自動的にデプロイしてくれます。

### Travis CI

1. `astro.config.mjs`に正しい`.site`を設定します。
2. プロジェクトのルートに `.travis.yml`ファイルを作成します。
3. ローカルで`npm install`を実行し、生成されたlockfile(`package-lock.json`)をコミットします。
4. GitHub Pagesのデプロイプロバイダーテンプレートを使用し、[Travis CIのドキュメント](https://docs.travis-ci.com/user/deployment/pages/)に従ってください。

   ```yaml
   language: node_js
   node_js:
     - lts/*
   install:
     - npm ci
   script:
     - npm run build
   deploy:
     provider: pages
     skip_cleanup: true
     local_dir: dist
     # GitHubで生成されたトークンで、Travisがあなたのリポジトリにコードをプッシュすることを許可します。
     # あなたのリポジトリの Travis 設定ページで、セキュア変数として設定します。
     github_token: $GITHUB_TOKEN
     keep_history: true
     on:
       branch: master
   ```

## GitLab Pages

1. `astro.config.mjs`に正しい`.site`を設定します。
2. `astro.config.mjs`で現在の`dist`を`public`に設定し、現在の`public`を、現在 `public`にあるすべてのファイルを保持している新しい名前のフォルダーに設定します。その理由は、`public`はデフォルトでastroのセカンドソースフォルダなので、`public`に出力したい場合は、別のフォルダからパブリックアセットを引っ張ってくる必要があるからです。 `astro.config.mjs` は以下のような感じになります。

   ```js
   export default defineConfig({
     sitemap: true,
     site: 'https://astro.build/',
   });
   ```

3. プロジェクトのルートに`.gitlab-ci.yml`ファイルを作成し、以下のような内容を記述します。これにより、コンテンツを変更するたびにサイトをビルドし、デプロイできます。

   ```yaml
   image: node:14
   pages:
     cache:
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
     artifacts:
       paths:
         - public
     only:
       - main
   ```

## Netlify

デプロイの設定は、[Netlify website UI](#netlify-website-ui)と、ローカルプロジェクトの`netlify.toml`ファイルを使った2つの方法で行えます。

### `netlify.toml`ファイル

プロジェクトリポジトリのトップレベルに、以下の設定で`netlify.toml`ファイルを新規作成します。

```toml
[build]
  command = "npm run build"
  publish = "dist"
```
[`pnpm`をNetlifyで使っている](https://answers.netlify.com/t/using-pnpm-and-pnpm-workspaces/2759)場合、代わりに以下の設定にしてください。

```toml
[build.environment]
  NPM_FLAGS = "--version" # prevent Netlify npm install
[build]
  command = 'npx pnpm i --store=node_modules/.pnpm-store && npm run build'
  publish = 'dist'
```

新しい `netlify.toml` ファイルを、あなたのホストしているgitリポジトリにプッシュしてください。次に、[Netlify](https://netlify.com/) で、あなたのgitリポジトリ用に新しいプロジェクトを立ち上げてください。Netlifyはこのファイルを読み込んで、自動的にデプロイの設定を行います。

> Netlifyで古い[ビルドイメージ](https://docs.netlify.com/configure-builds/get-started/#build-image-selection)を使用している場合、Node.jsのバージョンが設定されていることを確認してください。

Node.jsのバージョンは以下で指定できます。
- [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc)ファイル(例: `node v14.17.6`) 
- Netlifyプロジェクトのダッシュボードで、サイトの設定に環境変数`NODE_VERSION`を追加します。

### Netlify Website UI

`netlify.toml`ファイルをスキップして、直接[Netlify](https://netlify.com/)にアクセスして、プロジェクトの設定を行えます。NetlifyはAstroプロジェクトを自動的に検出し、あなたに代わって設定をあらかじめ行ってくれるはずです。"Deploy"ボタンを押す前に、以下の設定が入力されていることを確認してください。

- **Build Command:** `astro build`または`npm run build`
- **Publish directory:** `dist`

## Google Cloud

[Google Cloud](https://cloud.google.com/)では、プロジェクトのデプロイにいくつかのUIクリックが必要です。(これらのアクションのほとんどは、gcloud CLIを使用しても実行できます)。

### Cloud Run

1. 新しいGCPプロジェクトを作成するか、すでに持っているプロジェクトを選択します。

2. Cloud Run APIが有効になっていることを確認します。

3. 新しいサービスを作成します。

4. Docker Hubからコンテナを利用するか、[Cloud Build](https://cloud.google.com/build)を使って自分でビルドします。

5. ファイルを提供するポートを設定します。

6. `allUsers`に`Cloud Run Invoker`という新しいパーミッションを追加し、パブリックアクセスを可能にします。

### Cloud Storage

1. 新しいGCPプロジェクトを作成するか、すでに持っているプロジェクトを選択します。

2. [Cloud Storage](https://cloud.google.com/storage)の下に新しいバケットを作成します。

3. 名前と必要な設定をします。

4. `dist`フォルダをアップロードするか、[Cloud Build](https://cloud.google.com/build)を使ってアップロードします。

5. `allUsers`に`Storage Object Viewer`という新しいパーミッションを追加して、一般公開を可能にします。

6. Webサイトの設定を編集し、エントリポイントとして`ìndex.html`を、エラーページとして`404.html`を追加します。

## Google Firebase

1. [firebase-tools](https://www.npmjs.com/package/firebase-tools)がインストールされていることを確認します。

2. プロジェクトのルートに、以下の内容で `firebase.json`と`.firebaserc`を作成します。

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": []
     }
   }
   ```

   `.firebaserc`:

   ```json
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. `npm run build`を実行した後、`firebase deploy`コマンドを使用してデプロイします。

## Surge

1. まず、[surge](https://www.npmjs.com/package/surge)をインストールしていない場合は、インストールしてください。

2. `npm run build`を実行します。

3. `surge dist`と入力してサージにデプロイします。

また、`surge dist yourdomain.com`を追加することで、[カスタムドメイン](http://surge.sh/help/adding-a-custom-domain)にデプロイすることもできます。

## Heroku

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)をインストールします。

2. [サインアップ](https://signup.heroku.com/)でHerokuのアカウントを作成します。

3. `heroku login`を実行し、Herokuの認証情報を入力します。

   ```bash
   $ heroku login
   ```

4. プロジェクトのルートに`static.json`ファイルを作成し、以下の内容を記述します。

   `static.json`:

   ```json
   {
     "root": "./dist"
   }
   ```

   これはサイトの設定です。詳しくは[heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static)をご覧ください。

5. Herokuのgitリモートをセットアップします。

   ```bash
   # version change
   $ git init
   $ git add .
   $ git commit -m "サイトのデプロイ準備が整いました。"
   
   # 指定された名前の新しいアプリを作成する。
   $ heroku apps:create example

   # 静的サイト用のbuildpackを設定する。
   $ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
   ```

6. サイトをデプロイします。

   ```bash
   # publish site
   $ git push heroku master

   # ブラウザを開いて、Heroku CIをダッシュボードで確認する
   $ heroku open
   ```

## Vercel

[Vercel](http://vercel.com/)へのAstroのデプロイは、CLIまたはVercelのgitインテグレーションを使用すれば、設定なしで可能です。

### CLI

1. [Vercel CLI](https://vercel.com/cli)をインストールし、`vercel`を実行してデプロイします。
2. Vercelは自動的にAstroを検出し、正しい設定を行います。
3. `Want to override the settings? [y/N]`と聞かれたら、"N"を選択します。
4. アプリケーションがデプロイされます！(例: [astro.vercel.app](https://astro.vercel.app/))。

```bash
$ npm i -g vercel
$ vercel
```

### Git

1. コードをgitリポジトリ(GitHub, GitLab, BitBucket)にプッシュする。
2. Vercelに[プロジェクトをインポートする](https://vercel.com/new)
3. Vercelは自動的にAstroを検出し、正しい設定を行います。
4. あなたのアプリケーションはデプロイされます！(例: [astro.vercel.app](https://astro.vercel.app/))

プロジェクトがインポートされ、デプロイされると、その後のブランチへのプッシュはすべて[プレビュー(Preview Deployments)](https://vercel.com/docs/concepts/deployments/environments#preview)を生成し、プロダクションブランチ（通称 "main" ）に加えられたすべての変更は[本番のデプロイ(Production Deployment)](https://vercel.com/docs/concepts/deployments/environments#production)を生成することになります。

Vercelの[Git Integration](https://vercel.com/docs/concepts/git)の詳細はこちらです。

## Azure Static Web Apps

Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps)でAstroプロジェクトをデプロイするには以下が必要です。

- Azureアカウントとサブスクリプションキー。[無料のAzureアカウントはこちら](https://azure.microsoft.com/free)で作成できます。
- アプリのコードを[GitHub](https://github.com/)にプッシュします。
- [Visual Studio Code](https://code.visualstudio.com/)に[SWA Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)をインストールします。

VS Codeに拡張機能をインストールし、アプリのルートに移動します。Static Web Apps拡張を開き、Azureにサインインして、「+」記号をクリックして、新しいStatic Web Appを作成します。使用するサブスクリプションキーを指定するプロンプトが表示されます。

拡張機能によって起動されるウィザードに従って、アプリの名前を付け、フレームワークのプリセットを選択し、アプリのルート（通常は `/` ）とビルドファイルの場所 `/dist` を指定します。ウィザードが実行されると、GitHub actionがあなたのリポジトリ内の`.github`フォルダに作成されます。

このアクションはアプリをデプロイするために動作します (リポジトリのActionsタブで進行状況を確認します)。正常に完了したら、GitHub actionの実行時に表示される'Browse Website'ボタンをクリックして、拡張機能の進行状況ウィンドウで指定したアドレスにアプリを表示できます。

## Cloudflare Pages

Astroプロジェクトを[Cloudflare Pages](https://pages.cloudflare.com/)にデプロイするには以下が必要です。

- Cloudflareのアカウント。まだ持っていない場合は、このガイドの中で無料のCloudflareアカウントを作成できます。
- アプリのコードが[GitHub](https://github.com/)または[GitLab](https://about.gitlab.com/)リポジトリにプッシュされていること。

次に、Cloudflare Pagesに新しいプロジェクトを立ち上げます。

以下のビルド設定を使用します。

- **フレームワークプリセット**: `Astro`
- **ビルドコマンド:** `npm run build`
- **ビルド出力ディレクトリ:** `dist`
- **環境変数(アドバンスド)**: 現在、Cloudflare Pagesは、ビルド環境において、デフォルトで`NODE_VERSION = 12.18.0`をサポートしています。Astroでは、`14.15.0`、`v16.0.0`以降が必要です。環境変数に **変数名** を`NODE_VERSION`とし、その **値** を[Astroと互換性のあるNodeバージョン](/ja/install/auto/#前提条件)とするか、プロジェクトのNodeバージョンを`.nvmrc`または`.node-version`ファイルで指定して追加できます。
次に、**保存してデプロイする** ボタンをクリックします。

## Render

以下の手順で、Astroプロジェクトを[Render](https://render.com/)上にデプロイできます。

1. [render.comアカウント](https://dashboard.render.com/)を作成し、サインインします。
2. ダッシュボードから **New +** ボタンをクリックし、**Static Site**を選択します。
3. [GitHub](https://github.com/)または[GitLab](https://about.gitlab.com/)リポジトリを接続するか、または公開リポジトリの公開URLを入力します。
4. ウェブサイトの名前を付け、ブランチを選択し、ビルドコマンドと公開ディレクトリを指定します。
   - **build command:** `npm run build`
   - **publish directory:** `dist`
5. **Create Static Site** ボタンをクリックします。

## Buddy

[Buddy](https://buddy.works/)を使って、Astroプロジェクトをデプロイできます。そのためには、以下のものが必要です。

1. **Buddy** のアカウントを[こちら](https://buddy.works/sign-up)から作成する。
2. 新しいプロジェクトを作成し、Gitリポジトリ（GitHub、GitLab、BitBucket、任意のプライベートGitリポジトリまたはBuddy Git Hostingを使用可能）に接続します。
3. 新しいパイプラインを追加します。
4. 新しく作成したパイプラインに **[Node.js](https://buddy.works/actions/node-js)** アクションを追加します。
5. このアクションの中に、以下を追加します。

   ```bash
   npm install
   npm run build
   ```

6. デプロイメントアクションを追加します - 選択肢はたくさんあります。それぞれの設定は異なりますが、**Source path** を`dist`に設定することを忘れないでください。
7. **Run** ボタンを押します。

## Layer0

以下の手順で、Astroプロジェクトをデプロイできます。

1. Layer0を追加します。

```bash
# 最初に、Layer0 CLIをグローバルにインストールします。
$ npm i -g @layer0/cli

# 次に、AstroサイトにLayer0を追加します。
$ 0 init
```

2. Layer0 Routerを更新します。

routes.tsに以下を貼り付けます。

```js
// routes.ts
import { Router } from '@layer0/core';

export default new Router()
  .get(
    '/:path*/:file.:ext(js|css|png|ico|jpg|gif|svg)',
    ({ cache, serveStatic }) => {
      cache({
        browser: {
          // ブラウザのjs, css, 画像を1時間キャッシュする...
          maxAgeSeconds: 60 * 60,
        },
        edge: {
          // ...そしてedgeは1年間キャッシュする
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      });
      serveStatic('dist/:path*/:file.:ext');
    }
  )
  .match('/:path*', ({ cache, serveStatic, setResponseHeader }) => {
    cache({
      // ブラウザがhtmlをキャッシュしないようにする...
      browser: false,
      edge: {
        // ...1年間、edgeにhtmlをキャッシュする。
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    });
    setResponseHeader('content-type', 'text/html; charset=UTF-8');
    serveStatic('dist/:path*');
  });
```

`layer0.config.js`からorigin backendを削除できます。

```js
module.exports = {};
```

3. Layer0にデプロイします。

Layer0にサイトをデプロイするため、以下を実行します。

```bash
# astroサイトの本番ビルドを作成する
$ npm run build

# それをLayer0にデプロイする
$ 0 deploy
```

## クレジット

このガイドはもともと、[Vite](https://vitejs.dev/)の文書化された静的デプロイガイドを元にしています。
****
