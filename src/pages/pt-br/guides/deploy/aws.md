---
Título: Deploy seu Site Astro na AWS
descrição: Como fazer o deploy do seu Astro Site na web usando AWS.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

[AWS](https://aws.amazon.com/) é uma plataforma com todos os recursos necessários para a hospedagem de aplicativos da Web que pode ser usada para implantar um site Astro.

Para _Deployar_ seu projeto na AWS será necessário a utilização do [AWS console](https://aws.amazon.com/console/). (A maioria dessas ações também pode ser feitas usando o [AWS CLI](https://aws.amazon.com/cli/)). Esse guia irá lhe mostrar o passo-a-passo para deployar seu site na AWS, começando pelo método mais simples. Em seguida, demonstrará alguns passos adicionais para melhorar a eficiência de custos e desempenho. 

## AWS Amplify 

AWS Amplify é um conjunto de ferramentas e funcionalidades especialmente concebidas para os programadores front-end web e mobile construírem de forma rápida e fácil aplicações completas no AWS. 

1. Criar um novo projeto Amplify Hosting .
2. Conectar seu repositório ao Amplify.
3. Modificar seu diretório de saída de _build_ de `baseDirectory` para `/dist`.

    ```yaml
    version: 1
    frontend:
      phases:
        preBuild:
          # Not using npm? Change `npm ci` to `yarn install` or `pnpm i`
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: /dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*

    ```

Amplify irá _deployar_ automaticamente o seu site e o atualizará quando você _commitar_ um push no seu repositório. 

## S3 static website hosting

S3 é o ponto de partida para qualquer aplicação. É onde såo armazenados as pastas do seu projeto outros itens. O S3  cobra por quantidade de documentos armazenados e requisições feitas. Você pode encontrar mais informações sobre o S3 em [AWS documentation](https://aws.amazon.com/pt/s3/?nc1=h_ls).

1. Crie um S3 bucket com o nome do seu projeto.

    :::Dica: 
     O nome do bucket deve ser global e único. Nós recomendamos uma combinação do nome do seu projeto e o nome do domínio do seu site.
    :::

2. Desabilite **"bloquear todo acesso público"**. Por padrão, a AWS define todos os buckets como privados. Para torná-lo público, você deve desmarcar a opção "Bloquear acesso público" nas propriedades do seu _bucket_. 

3. Carregue seus arquivos _buildados_ localizados em `dist` para S3. Você pode fazer isso manualmente através do console ou usando o AWS CLI. Se você usar o AWS CLI, você pode usar o seguinte comando após [autenticar-se com suas credenciais AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html):

    ```
    aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
    ```

4. Atualize a política do seu _bucket_ para permitir o acesso público. Você pode encontrar esta configuração no seu bucket's **Permissions > Bucket policy**.

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::<BUCKET_NAME>/*"
        }
      ]
    }
    ```

    :::atenção
    Não se esqueça de substituir `<BUCKET_NAME>` com o nome do seu _bucket_.
    :::

5. Habilite hospedagem de site para o seu _bucket_. Você pode encontrar esta configuração no seu bucket's **Settings > Static website hosting**. Defina seu documento de index para `index.html` e seu documento de erro para `404.html`. Por fim, você pode encontrar a URL do seu site no bucket's **Settings > Static website hosting**.

    :::nota
    Se você estiver _deployando_ uma _single-page application_ (SPA), defina seu documento de erro para `index.html`.
    :::

## S3 with CloudFront

CloudFront é um serviço web que oferece capacidades de rede de distribuição de conteúdo (CDN). É usado para armazenar o conteúdo de um servidor web e distribuí-lo aos usuários finais. CloudFront cobra por quantidade de dados transferidos. Adicionando CloudFront ao seu S3 _bucket_ é mais econômico e proporciona uma entrega mais rápida.

Usaremos o CloudFront para empacotar nosso S3 _bucket_ para servir os arquivos de nosso projeto usando a rede global CDN da Amazon. Isso irá reduzir os custos de entrega e aumentará a performance do seu site.

### S3 Configurações

1. Crie um S3 bucket com o nome do seu projeto.

    :::Dica: 
     O nome do bucket deve ser global e único. Nós recomendamos uma combinação do nome do seu projeto e o nome do domínio do seu site.
    :::
2. Carregue seus arquivos _buildados_ localizados em `dist` para S3. Você pode fazer isso manualmente através do console ou usando o AWS CLI. Se você usar o AWS CLI, você pode usar o seguinte comando após [autenticar-se com suas credenciais AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html):

    ```
    aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
    ```

3. Atualize a política do seu _bucket_ para permitir **CloudFront Access**. Você pode encontrar esta configuração no seu bucket's **Permissions > Bucket policy**. 

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {
          "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity <CLOUDFRONT_OAI_ID>"
        },
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::astro-aws/*"
      }]
    }
    ```

    :::atenção
    Não se esqueça de substituir `<CLOUDFRONT_OAI_ID>` com o nome do seu CloudFront Origin Access Identity ID. Você pode encontrar o CloudFront Origin Access Identity ID em **CloudFront > Origin access identities** depois de configurar o CloudFront.
    :::

### CloudFront setup

1. Criar uma distribuição CloudFront com os seguintes valores:
    * **Origin domain:** Seu S3 _bucket_
    * **S3 bucket access:** "Yes use OAI (bucket can restrict access to only CloudFront)"
    * **Origin access identity:** Create a new origin access identity
    * **Viewer - Bucket policy:** "No, I will update the bucket policy"
    * **Viewer protocol policy:** "Redirect to HTTPS"
    * **Default root object:** `index.html`

Esta configuração bloqueará o acesso ao seu S3 _bucket_ da internet pública e servirá seu site usando a rede global CDN. Você pode encontrar sua URL de distribuição CloudFront no bucket's **Distributions > Domain name**.

### Configuração das funções CloudFront

Infelizmente, o CloudFront não suporta por padrão roteamento de várias páginas `sub-folder/index`. Para configurá-lo, utilizaremos as Funções CloudFront para apontar o pedido para o objeto desejado no S3.

1. Crie uma nova função CloudFront com o seguinte código snippet. Você pode encontrar funções CloudFront em **CloudFront > Functions**.

    ```js
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Check whether the URI is missing a file name.
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      } 
      // Check whether the URI is missing a file extension.
      else if (!uri.includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    }
    ```
  2. Anexe sua função à distribuição CloudFront. Você pode encontrar esta opção nas associações da sua distribuição CloudFront **Settings > Behaviors > Edit > Function**.
        * **Viewer request - Function type:** Função CloudFront.
        * **Viewer request - Function ARN:** Selecione a função que você criou no passo anterior.

## Implantação contínua com GitHub Actions

Há muitas maneiras de se estabelecer uma implantação contínua para AWS. Uma possibilidade de código hospedado no GitHub é usar [GitHub Actions](https://github.com/features/actions) para implantar seu website toda vez que você fizer um _push_ em um _commit_.

1. Crie uma nova política em sua conta AWS usando [IAM](https://aws.amazon.com/iam/) com as seguintes permissões. Esta política permitirá que você carregue arquivos _buildados_ para seu S3 _bucket_ e invalide os arquivos de distribuição do CloudFront quando você fizer um _push_ em um _commit_.

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "VisualEditor0",
              "Effect": "Allow",
              "Action": [
                  "s3:PutObject",
                  "s3:ListBucket",
                  "cloudfront:CreateInvalidation"
              ],
              "Resource": [
                  "<DISTRIBUTION_ARN>",
                  "arn:aws:s3:::<BUCKET_NAME>/*",
                  "arn:aws:s3:::<BUCKET_NAME>"
              ]
          }
      ]
    }
    ```

    :::atenção
    Não se esqueça de substituir `<DISTRIBUTION_ARN>` e `<BUCKET_NAME>`. Você pode encontrar o ARN em **CloudFront > Distributions > Details**.
    :::

2. Criar um novo usuário IAM e anexar a política ao usuário. Isto disponibilizará seu `AWS_SECRET_ACCESS_KEY` e `AWS_ACCESS_KEY_ID`.

3. Adicione este exemplo de fluxo de trabalho ao seu repositório em `.github/workflows/deploy.yml` e faça o _push_ no GitHub. Você precisará acrescentar `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BUCKET_ID`, e `DISTRIBUTION_ID` como _“secrets”_ no seu repositório no GitHub em  **Settings** > **Secrets** > **Actions**. Clique em <kbd>New repository secret</kbd> para adicionar cada um deles.

    ```yaml
    name: Deploy Website

    on:
      push:
        branches:
          - main

    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v3
          - name: Configure AWS Credentials
            uses: aws-actions/configure-aws-credentials@v1
            with:
              aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
              aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
              aws-region: us-east-1
          - name: Install modules
            run: npm ci
          - name: Build application
            run: npm run build
          - name: Deploy to S3
            run: aws s3 sync ./dist/ s3://${{ secrets.BUCKET_ID }}
          - name: Create CloudFront invalidation
            run: aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/*"
    ```

    :::nota
    Seu `BUCKET_ID` é o nome do seu S3 bucket. Seu `DISTRIBUTION_ID` é o seu CloudFront distribution ID (ID de distribuição do CloudFront). Você pode encontrar seu CloudFront distribution ID em **CloudFront > Distribuições > ID**
    :::
