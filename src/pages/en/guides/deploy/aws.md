---
title: Deploy your Astro Site to AWS
description: How to deploy your Astro site to the web using AWS.
layout: ~/layouts/DeployGuideLayout.astro
---

[AWS](https://aws.amazon.com/) is a full-featured web app hosting platform that can be used to deploy an Astro site.

Deploying your project to AWS requires using the [AWS console](https://aws.amazon.com/console/). (Most of these actions can also be done using the [AWS CLI](https://aws.amazon.com/cli/)). This guide will walk you through the steps to deploy your site to AWS from the most basic method then adding more services on top to improve cost efficiency and performance.


## S3 static website hosting

S3 is the starting point of any application. It is where your project files and other assets are stored. S3 charges for file storage and number of requests. You can find more information about S3 in the [AWS documentation](https://aws.amazon.com/s3/).

1. Create an S3 bucket with your project's name.

    :::tip
    The bucket name should be globally unique. We recommend a combination of your project name and the domain name of your site.
    :::

2. Disable **"Block all public access"**. By default, AWS sets all buckets to be private. To make it public, you need to uncheck the "Block public access" checkbox in the bucket's properties.

3. Upload your built files located in `dist` to S3. You can do this manually in the console or use the AWS CLI. If you use the AWS CLI, you can use the following command after [authenticating with your AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

    ```
    aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
    ```

4. Update your bucket policy to allow public access. You can find this setting in the bucket's **Permissions > Bucket policy**.

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
    Do not forget to replace `<BUCKET_NAME>` with the name of your bucket.
    :::

5. Enable website hosting for your bucket. You can find this setting in the bucket's **Settings > Static website hosting**. Set your index document to `index.html` and your error document to `404.html`. Finally, you can find your new website URL in the bucket's **Settings > Static website hosting**.

    :::note
    If you are deploying a single-page application (SPA) set your error document to `index.html`.
    :::

<!-- Your Astro site is now deployed to AWS. If you would like to configure a custom domain name for your site, read the next section [Route 53](#route-53).  -->

<!-- If you don't want to use a custom domain name, you can skip to [CloudFront](#cloudfront) to configure your site's CDN. -->

<!--
#### I am considering deleting this section ####

### Route 53

Route 53 is a DNS service that allows you to purchase and configure a custom domain name for your site.

1. Create a Hosted Zone in Route 53.
2. Create a Record Set with Simple routing policy.
3. Define a Simple Record in the Record Set with the following values:
    * **Name:** The domain/subdomain name you want to use.
    * **Type:** A record type of CNAME.
    * **Value:** Alias to S3 website endpoint.
    * Select the region where your bucket is located.
    * Select your bucket name.

:::note
This configuration is not required if you don't want to use a custom domain name.
::: -->
## S3 with CloudFront

CloudFront is a web service that provides content delivery network (CDN) capabilities. It is used to cache content of a web server and distribute it to end users. CloudFront charges for the amount of data transferred. Adding CloudFront to your S3 bucket is more cost-effective and provides a faster delivery.

We will use CloudFront to wrap our S3 bucket to serve our project's files using Amazon global CDN network. This will reduce the cost of serving your project's files and will increase the performance of your site.

### S3 setup

1. Create an S3 bucket with your project's name.

    :::tip
    The bucket name should be globally unique. We recommend a combination of your project name and the domain name of your site.
    :::
2. Upload your built files located in `dist` to S3. You can do this manually in the console or use the AWS CLI. If you use the AWS CLI, you can use the following command after [authenticating with your AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

    ```
    aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
    ```

3. Update your bucket policy to allow **Cloudfront Access**. You can find this setting in the bucket's **Permissions > Bucket policy**. 

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
    Do not forget to replace `<CLOUDFRONT_OAI_ID>` with the name of your CloudFront Origin Access Identity ID. You can find the CloudFront Origin Access Identity ID in **CloudFront > Origin access identities** after setting up Cloudfront.
    :::

### Cloudfront setup

1. Create a CloudFront distribution with the following values:
    * **Origin domain:** Your S3 bucket
    * **S3 bucket access:** "Yes use OAI (bucket can restric access to only CloudFront)"
    * **Origin access identity:** Create a new origin access identity
    * **Viewer - Bucket policy:** "No, I will update the bucket policy"
    * **Viewer protocol policy:** "Redirect to HTTPS"
    * **Default root object:** `index.html`

This configuration will block access to your S3 bucket from the public internet and serve your site using the global CDN network. You can find your CloudFront distribution URL in the bucket's **Distributions > Domain name**.

### CloudFront functions setup

Unfortunately, CloudFront does not support multi-page `sub-folder/index` routing by default. To configure it, we will use cloudfront functions to point the request to the desired object in S3.

1. Create a new cloudFront function with the following code snippet. You can find cloudfront functions in **CloudFront > Functions**.

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
  2. Attach your function to the CloudFront distribution. You can find this option in your cloudfront distribution's settings > Behaviors > Edit > Function associations.
        * **Viewer request - Function type:** Cloudfront Function.
        * **Viewer request - Function ARN:** Select the function you created in the previous step.

## Continuous deployment with GitHub Actions

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
