---
title: "Invoking create-user function"
weight: 1
chapter: false
pre: " <b> 8.1. </b> "
---

> [!NOTE]
> Replace the URL with the function URL of your `create-user` Lambda function.

1. Run

   ```shell
   curl 'https://zvybyad2wvq5dto3upm2mgtcwa0epmul.lambda-url.ap-southeast-1.on.aws/' \
     -H 'content-type: application/json' \
     -d '{ "name": "First Cloud Journey", "email": "fcj@example.com" }'
   ```

   ```json
   {"id": "bcfe3cf9-1607-489e-8501-f99c194e6cc9", "name": "First Cloud Journey", "email": "fcj@example.com", "created_at": "2025-05-14T16:46:29", "updated_at": "2025-05-14T16:46:29"}%
   ```

   ![alt text](/images/workshop-1/lambda-invoke-with-curl--create-user.jpg)

1. Verify that a new user is created with DynamoDB console.

   ![alt text](/images/workshop-1/lambda-invoke-with-curl--create-user-verify.jpg)
