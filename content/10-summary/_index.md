+++
title = "Summary"
weight = 10
chapter = false
pre = "<b>10. </b>"
+++

In this workshop, you have hands-on experience about:

- Creating a **DynamoDB table**.
- Creating **Lambda functions**.
- _Directly_ invoking Lambda functions:
  - Using AWS Management Console
  - Using AWS CLI
  - Using any HTTP client, e.g. a browser, `curl`, and _function URL_.
- Using _function URL_ to expose Lambda functions to public, unauthenticated users (that doesn't have AWS credential).

You also understand

- _access permissions_ - permissions for other entities to access your functions - in other words, it's how the IAM authenticate and authorize the invocation of your Lambda functions.

  - When invoking a Lambda function using AWS Management Console, you're using the permission of the IAM credential you've logged in.
  - When invoking a Lambda function using AWS CLI, you're using the permission of the IAM credential you've configured for AWS CLI.
  - When invoking a Lambda function using its public function, IAM still needs to authenticate/authorize that invocation (although IAM allow any principle which including unauthenticated users).

- _execution role_ - which provide permissions for functions to access other resources, e.g. DynamoDB table.

In the next workshop of this series, you will learn about:

- Protecting the Lambda's functions URL with IAM.
- Managing the Lambda functions into a REST API with API Gateway.
