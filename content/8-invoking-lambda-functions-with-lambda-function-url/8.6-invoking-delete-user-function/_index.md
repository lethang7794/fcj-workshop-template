---
title: "Invoking delete-user function"
weight: 5
chapter: false
pre: " <b> 8.5. </b> "
---

> [!NOTE]
> Replace the URL with the function URL of your `delete-user` Lambda function.

1. Run

   ```shell
   curl 'https://5ywq2njgsehqpl3xl2nrs334ue0inscy.lambda-url.ap-southeast-1.on.aws/' \
     -H 'content-type: application/json' \
     -d '{ "id": "bcfe3cf9-1607-489e-8501-f99c194e6cc9" }'
   ```

   ![alt text](/images/workshop-1/lambda-invoke-with-curl--delete-user.jpg)

> [!NOTE]
> When invoke `delete-user` with `curl` you don't receive any message (The response doesn't have a body).

2. Verify the user is deleted with DynamoDB console.

   ![alt text](/images/workshop-1/lambda-invoke-with-curl--delete-user-verify.jpg)
