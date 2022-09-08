---
title: Despliega tu projecto de Astro en AWS
description: Cómo desplegar tu projecto de Astro en AWS.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

[AWS](https://aws.amazon.com/) es una plataforma de hosting de aplicaciones web con muchas funcionalidades para desplegar tu proyecto de Astro.

Desplegar tu proyecto en AWS requiere el uso de la [consola de AWS](https://aws.amazon.com/console/). (La mayoría de estas acciones también se pueden realizar mediante el [CLI de AWS](https://aws.amazon.com/cli/)). Esta guía lo guiará a través de los pasos para implementar tu proyecto en AWS, comenzando con el método más básico. Luego, agregará servicios adicionales para mejorar la rentabilidad y el rendimiento.

## AWS Amplify

AWS Amplify es un conjunto de herramientas que permiten a los desarrolladores web y móviles crear aplicaciones completas en AWS de manera rápida y fácil.

1. Crea un nuevo proyecto en Amplify.
2. Conecta tu repositorio a Amplify.
3. Modifica el directorio de salida de compilación `baseDirectory` a `/dist`.

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

Amplify desplegará automáticamente tu proyecto y lo actualizará al empujar los cambios a tu repositorio.

## Alojando contenido estático en S3

S3 es el punto de partida de cualquier aplicación. Es donde se almacenan los archivos de tu proyecto. S3 cobra por el almacenamiento de archivos y la cantidad de solicitudes a estos archivos. Puedes encontrar más información sobre S3 en la [documentación de AWS](https://aws.amazon.com/s3/).

1. Cree un depósito S3 con el nombre de su proyecto.

    :::tip
    El nombre del depósito debe ser único globalmente. Recomendamos una combinación del nombre del proyecto y el dominio de tu proyecto.
    :::

2. Desactive **"Block all public access"**. De forma predeterminada, AWS establece que todos los buckets sean privados. Para hacerlo público, debes desmarcar la casilla de verificación "Block public access" en las propiedades del bucket.

3. Cargue los archivos construidos ubicados en `dist` a S3. Puedes hacerlo manualmente desde la consola o usar la CLI de AWS. Si usas la CLI, puedes usar el siguiente comando después de [autenticarse en AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html):

    ```
    aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
    ```

4. Actualice la política del bucket para permitir acceso público. Puedes encontrar esta configuración en **Permissions > Bucket policy** del bucket.

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

    :::caution
    No olvides reemplazar `<BUCKET_NAME>` con el nombre de tu bucket.
    :::

5. Habilite el alojamiento de sitios web para tu bucket. Puedes encontrar esta configuración en **Settings > Static website hosting** del bucket. Establezca el documento index a `index.html` y el documento error a `404.html`. Finalmente, puedes encontrar la URL de tu nuevo sitio web en **Settings > Static website hosting** del bucket.

    :::note
    Si estás desplegando una aplicación de una sola página (SPA), establezca el documento de error a `index.html`.
    :::

## S3 y CloudFront

CloudFront es un servicio web que proporciona capacidades de red de entrega de contenido (CDN). Se utiliza para almacenar en caché el contenido de un servidor web y distribuirlo a los usuarios finales. CloudFront cobra por la cantidad de datos transferidos. Agregar CloudFront a tu S3 bucket es más rentable y proporciona una entrega más rápida.

Usaremos CloudFront para envolver nuestro S3 bucket para servir los archivos de nuestro proyecto usando la red CDN global de Amazon. Esto reducirá el costo de servir los archivos de tu proyecto y aumentará el rendimiento de su sitio.

### Configuración de S3

1. Crea un bucket en S3 con el nombre de tu proyecto.

    :::tip
    El nombre del depósito debe ser único globalmente. Recomendamos una combinación del nombre del proyecto y el dominio de tu proyecto.
    :::

2. Cargue los archivos construidos ubicados en `dist` a S3. Puedes hacerlo manualmente usando la consola o usar la CLI de AWS. Si usas la CLI, puedes usar el siguiente comando después de [autenticarse en AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html):

    ```
    aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
    ```

3. Actualice la política del bucket para permitir **acceso a CloudFront**. Puedes encontrar esta configuración en **Permissions > Bucket policy** del bucket.

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

    :::caution
    No olvides reemplazar `<CLOUDFRONT_OAI_ID>` con el nombre de tu CloudFront Origin Access ID. Puedes encontrar el ID en **CloudFront > Origin access identities** después de configurar CloudFront.
    :::

### Configuración de CloudFront

1. Cree una distribución de CloudFront con los siguientes valores:
    * **Origin domain:** Tu S3 bucket
    * **S3 bucket access:** "Yes use OAI (bucket can restrict access to only CloudFront)"
    * **Origin access identity:** Create a new origin access identity
    * **Viewer - Bucket policy:** "No, I will update the bucket policy"
    * **Viewer protocol policy:** "Redirect to HTTPS"
    * **Default root object:** `index.html`

Esta configuración bloqueará el acceso al S3 bucket desde la Internet pública y atenderá tu proyecto mediante la red CDN global. Puede encontrar la URL de la distribución de CloudFront en **Distributions > Domain name** del bucket.

### Configuración de CloudFront functions

Desafortunadamente, CloudFront no es compatible con enrutamiento de "subcarpetas/índices" de forma predeterminada. Para configurarlo, usaremos CloudFront Functions para interceptar la solicitud connectarla al objeto deseado en S3.

1. Crea una nueva CloudFront function con el siguiente fragmento de código. Puedes encontrar las CloudFront functions en **CloudFront > Functions**.

    ```js
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Comprueba si al URI le falta el nombre del archivo.
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      } 
      // Compruebe si al URI le falta una extensión de archivo.
      else if (!uri.includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    }
    ```

2. Adjunte la función a la distribución de CloudFront. Puedes encontrar esta opción en las asociaciones bajo **Settings > Behaviors > Edit > Function** de la distribución de CloudFront.
         * **Viewer request - Function type:** CloudFront Function.
         * **Viewer request - Function ARN:** Seleccione la función que creó en el paso anterior.

## Despliegue continuo con GitHub Actions

Hay muchas formas de configurar despliegue continuo en AWS. Una posibilidad si el código esta alojado en GitHub es usar [GitHub Actions](https://github.com/features/actions) que desplegará tu proyecto cada vez que hagas un push.

1. Crea una nueva política en tu cuenta de AWS utilizando [IAM](https://aws.amazon.com/iam/) con los siguientes permisos. Esta política te permitirá cargar los nuevos archivos en tu S3 bucket e invalidar los archivos antiguos de la distribución de CloudFront al desplegar.

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

    :::caution
    No olvides reemplazar `<DISTRIBUTION_ARN>` y `<BUCKET_NAME>`. Puedes encontrar el ARN en **CloudFront > Distributions > Details**.
    :::

2. Crea un nuevo usuario de IAM y adjunte la política al usuario. Esto te proporcionará el `AWS_SECRET_ACCESS_KEY` y el `AWS_ACCESS_KEY_ID`.

3. Agregue el siguiente workflow a tu repositorio en `.github/workflows/deploy.yml` y envíelo a GitHub. Deberás agregar `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BUCKET_ID` y `DISTRIBUTION_ID` como "secrets" a tu repositorio en GitHub en **Settings** > **Secrets** > **Actions**.. Haga clic en <kbd>New repository secret</kbd> para agregar cada uno.

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

    :::note
    El `BUCKET_ID` es el nombre de bucket en S3. El `DISTRIBUTION_ID` es el ID de la distribución de CloudFront. Puedes encontrar el ID de la distribución de CloudFront en **CloudFront > Distributions > ID**
    :::
