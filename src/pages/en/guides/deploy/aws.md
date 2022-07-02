---
title: Deploy your Astro Site to AWS
description: How to deploy your Astro site to the web using AWS.
layout: ~/layouts/DeployGuideLayout.astro
---

[AWS](https://cloud.google.com/) is a full-featured web app hosting platform that can be used to deploy an Astro site.

## How to deploy

Deploying your project to AWS requires using the [AWS console](https://aws.amazon.com/console/). (Most of these actions can also be done using the [AWS CLI](https://aws.amazon.com/cli/)). This guide will walk you through the steps to deploy your site to AWS from the most basic method then adding more services on top to improve cost efficiency and performance.

### S3 Bucket

S3 is the starting point of any application. It is where your project files and other assets are stored. S3 charges for file storage and number of requests. You can find more information about S3 in the [AWS documentation](https://aws.amazon.com/s3/).

1. Create an S3 bucket with your project's name.

    :::note
    The bucket name should be globally unique. We recommend combination of your project name and the domain name of your site.
    :::

2. Disable "Block all public access". By default, AWS sets all buckets to be private. To make it public, you need to unchecked the "Block public access" checkbox in the bucket's properties.

3. Upload your built files located in `dist` to S3. You can do this manually in the console or use the AWS CLI. If you use the AWS CLI, you can use the following command. 

    ```
    aws s3 cp dist/ s3://<BUCKET_NAME>/ --recursive
    ```

    :::note
    Do not forget to replace `<BUCKET_NAME>` with the name of your bucket and to authenticate your CLI with your AWS credentials.
    :::

4. Update your bucket policy to allow public access. You can find this setting in bucket's Permissions > Bucket policy.

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

5. Enable website hosting for your bucket. You can find this setting in the bucket's Settings > "Static website hosting". Set your index document to `index.html` and your error document to `404.html`. You can find your new website URL in the bucket's Settings > "Static website hosting".

You Astro site is now deployed to AWS if you would like to configure a custom domain name for your site read the next section [Route 53](#route-53). 

If you don't want to use a custom domain name, you can skip to [CloudFront](#cloudfront) to configure your site's CDN.

### Route 53

Route 53 is a DNS service that allows you to purchase and configure a custom domain name for your site.



### CloudFront

<!-- to do -->

### CloudFront functions

<!-- to do -->

### GitHub Actions

<!-- to do -->
