---
title: "Invoking Lambda functions with Lambda function URL"
weight: 8
chapter: false
pre: " <b> 8. </b> "
---

Previously, to invoke a Lambda function, you:

- open the Lambda function page (in the AWS management console) and invoke the Lambda function by clicking `Test` button.

    (This will use the AWS credential of the AWS account the you've logged in).

    ![alt text](/images/diagrams/workshop-1-invoke-with-management-console-low-level.drawio.svg)

- or use the AWS CLI and the function ARN to invoke the Lambda function.

    (This will use the AWS credential that you've configured with AWS CLI).

    ![alt text](/images/diagrams/workshop-1-invoke-with-with-cli-low-level.drawio.svg)

---
In previous step, we have created 5 functions URL, now we will invoke the function using a browser or any HTTP client (e.g. `curl`)

The architecture now looks like this

![alt text](/images/diagrams/workshop-1-function-urls.drawio.svg)
