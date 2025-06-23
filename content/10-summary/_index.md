+++
title = "Summary"
weight = 10
chapter = false
pre = "<b>10. </b>"
+++

In this workshop, you have hands-on experience about:

{{<figure src="/images/workshop-1/Amazon-DynamoDB.svg" title="Amazon DynamoDB" width=100pc >}}

- DynamoDB service

  - Creating a **DynamoDB table**.
  - Interact with a DynamoDB table from a Lambda functions.
  - Explore the items of a DynamoDB table using AWS Management Console.

{{<figure src="/images/workshop-1/AWS-Lambda.svg" title="AWS Lambda" width=100pc >}}

- Lambda service:

  - Creating **Lambda functions**.
  - _Directly_ invoking Lambda functions:
    - Using AWS Management Console
    - Using AWS CLI
    - Using any HTTP client, e.g. a browser, `curl`, and _function URL_.
  - Using _function URL_ to expose Lambda functions to public, unauthenticated users (that doesn't have AWS credential).

{{<figure src="/images/workshop-1/AWS-Identity-and-Access-Management.svg" title="AWS Identity and Access Management" width=100pc >}}

You also understand about IAM works with Lambda and DynamoDB:

- _access permissions_ - permissions for other entities to access your functions - in other words, it's how the IAM authenticate and authorize the invocation of your Lambda functions.

  - When invoking a Lambda function using AWS Management Console, you're using the permission of the IAM credential you've logged in.
  - When invoking a Lambda function using AWS CLI, you're using the permission of the IAM credential you've configured for AWS CLI.
  - When invoking a Lambda function using its public function, IAM still needs to authenticate/authorize that invocation (although IAM allow any principle which including unauthenticated users).

- _execution role_ - which provide permissions for functions to access other resources, e.g. DynamoDB table.

---

In the next workshop of this series, you will learn about:

- Protecting the Lambda's functions URL with IAM.
- Managing the Lambda functions into a REST API with API Gateway.
