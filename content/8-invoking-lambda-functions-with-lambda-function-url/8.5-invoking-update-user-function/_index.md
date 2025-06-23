---
title: "Invoking update-user function"
weight: 4
chapter: false
pre: " <b> 8.4. </b> "
---

> [!NOTE]
> Replace the URL with the function URL of your `update-user` Lambda function.

1. Run

   ```shell
   curl 'https://hk3icryf6br2ociwan5ier2gqe0gyaoi.lambda-url.ap-southeast-1.on.aws/' \
     -H 'content-type: application/json' \
     -d '{ "id": "bcfe3cf9-1607-489e-8501-f99c194e6cc9", "email": "fcj@aws.com" }'
   ```

   ```json
   {"updated_at": "2025-05-14T16:51:03", "created_at": "2025-05-14T16:46:29", "email": "fcj@aws.com", "id": "bcfe3cf9-1607-489e-8501-f99c194e6cc9", "name": "First Cloud Journey"}%
   ```

   ![alt text](/images/workshop-1/lambda-invoke-with-curl--update-user.jpg)

1. Verify that the user is updated with DynamoDB console.

   ![alt text](/images/workshop-1/lambda-invoke-with-curl--update-user-verify.jpg)
