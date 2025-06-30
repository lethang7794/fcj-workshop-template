---
title: "Creating function URLs for Lambda functions"
weight: 7
chapter: false
pre: " <b> 7. </b> "
---

{{% toc %}}

#### Function URL

A function URL is a dedicated HTTP(S) endpoint for your Lambda function.

- When you create a function URL, Lambda automatically generates a unique URL endpoint for you.

You can control access to your Lambda function URLs using the AuthType parameter:

- When you configure your function URL, you must specify one of the following AuthType options:
  - `AWS_IAM` – Lambda uses AWS Identity and Access Management (IAM) to authenticate and authorize requests based on the IAM principal's identity policy and the function's resource-based policy. Choose this option if you want only authenticated users and roles to invoke your function via the function URL.
  - `NONE` – Lambda doesn't perform any authentication before invoking your function. However, your function's resource-based policy is always in effect and must grant public access before your function URL can receive requests. Choose this option to allow public, unauthenticated access to your function URL.

> [!NOTE]
> In this workshop, to simplify the learning we will create functions URL with `AuthType` of `NONE` without implementing any authentication mechanism in the Lambda function.

> [!WARNING]
> Except some rare case that you may want your function URL to be public as a web hook, don't use `AuthType` of `NONE` for your function URL. And in these rare case, you still need to implement basic authentication mechanism in your Lambda function. See [Tutorial: Creating a webhook endpoint using a Lambda function URL - AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/urls-webhook-tutorial.html)

#### Creating function URLs

In this step, you will create 5 function URLs, one for each Lambda function.

![alt text](/images/diagrams/workshop-1-function-urls-high-level.drawio.svg)

1. To create the function URL for `list-users` Lambda function:

   - Open the [Functions section of Lambda console](https://console.aws.amazon.com/lambda/home?#/functions)

   - Click `list-users` function.

   - Open the `Configuration` tab
   - Open the `Function URL` section
   - Click `Create function URL`

     ![alt text](/images/workshop-1/lambda-function-url--create.jpg)

   - In the `Configure Function URL` page, choose `Auth type` of `NONE`.

   - Click `Save`

     ![alt text](/images/workshop-1/lambda-function-url--configure.jpg)

   - After the function URL is created, you can see it in the `Function overview` section or in the `Configuration` / `Function URL` section.

     ![alt text](/images/workshop-1/lambda-function-url--location.jpg)

   - Copy the function URL, you will need it for the next step.

1. Repeat this process to create the function URLs for other Lambda function: `create-user`, `get-user`, `update-user`, `delete-user`.
