---
title: Deploy your Astro Site to AWS
description: How to deploy your Astro site to the web using AWS.
layout: ~/layouts/DeployGuideLayout.astro
---

[AWS](https://aws.amazon.com/) is a full-featured web app hosting platform that can be used to deploy an Astro site.

## How to deploy

Deploying your project to AWS requires using the [AWS console](https://aws.amazon.com/console/). (Most of these actions can also be done using the [AWS CLI](https://aws.amazon.com/cli/)). This guide will walk you through the steps to deploy your site to AWS from the most basic method then adding more services on top to improve cost efficiency and performance.

### S3 Bucket

S3 is the starting point of any application. It is where your project files and other assets are stored. S3 charges for file storage and number of requests. You can find more information about S3 in the [AWS documentation](https://aws.amazon.com/s3/).

1. Create an S3 bucket with your project's name.

    :::tip
    The bucket name should be globally unique. We recommend combination of your project name and the domain name of your site.
    :::

2. Disable "Block all public access". By default, AWS sets all buckets to be private. To make it public, you need to unchecked the "Block public access" checkbox in the bucket's properties.

3. Upload your built files located in `dist` to S3. You can do this manually in the console or use the AWS CLI. If you use the AWS CLI, you can use the following command. 

    ```
    aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
    ```

    :::caution
    Do not forget to replace `<BUCKET_NAME>` with the name of your bucket and to authenticate your CLI with your AWS credentials.
    :::

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

5. Enable website hosting for your bucket. You can find this setting in the bucket's **Settings > Static website hosting**. Set your index document to `index.html` and your error document to `404.html`. You can find your new website URL in the bucket's **Settings > Static website hosting**.

Your Astro site is now deployed to AWS. If you would like to configure a custom domain name for your site, read the next section [Route 53](#route-53). 

If you don't want to use a custom domain name, you can skip to [CloudFront](#cloudfront) to configure your site's CDN.

### Route 53

Route 53 is a DNS service that allows you to purchase and configure a custom domain name for your site.

1. Create a hosted zone in Route 53.
2. Create a record set with Simple routing policy.
3. Define a simple record in the record set with the following values:
    * Name: The domain/subdomain name you want to use.
    * Type: A
    * Value: Alias to S3 website endpoint.
    * Select the region where your bucket is located.
    * Select your bucket name.

### CloudFront

CloudFront is a web service that provides content delivery network (CDN) capabilities. It can be used to cache content of a web server and distribute it to end users. CloudFront charges for the amount of data transfer. Compared to S3, CloudFront is more cost-effective and provides a faster delivery.

In this guide, we will use CloudFront to wrap our S3 bucket to decrease the cost of serving your site from S3 and to provide a faster delivery of your site across the world.

1. Create a CloudFront distribution with the following values:
    * Origin domain: Your S3 bucket.
    * S3 bucket access: "Yes use OAI (bucket can restric access to only CloudFront)".
    * Origin access identity: Create a new origin access identity.
    * Viewer - Bucket policy: "No, I will update the bucket policy"
    * Viewer protocol policy: "Redirect to HTTPS".
    * Alternate domain name (Optional): Add domain name to your site if you want to use a custom domain name. e.g `www.example.com` and `example.com`.
    :::note 
    Do not forget to add a custom SSL certificate for alternate domain names to allow HTTPS requests.
    :::
    * Default root object: `index.html`
2. Update the **bucket policy** to allow CloudFront access.

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity <CLOUDFRONT_OAI_ID>"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::astro-aws/*"
        }
    ]
  }
  ``` 
  :::tip
   You can find the CloudFront Origin Access Identity ID in **CloudFront > Origin access identities**.
   :::

3. Block public access to your bucket.
4. Update your Route 53 record to point to the CloudFront distribution instead of the bucket.




### CloudFront functions

<!-- to do -->

### GitHub Actions

<!-- to do -->
