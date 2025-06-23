---
title: "Invoking get-user function"
weight: 3
chapter: false
pre: " <b> 8.3. </b> "
---

> [!NOTE]
> Replace the URL with the function URL of your `get-user` Lambda function.

- `get-user` expects the id of the user in the HTTP request's body, choose id of one user from the response of `list-users`.

  ```shell
  curl 'https://qzpsv22gd3s4qbnfwz2v5yefoy0dmipa.lambda-url.ap-southeast-1.on.aws/' \
    -H 'content-type: application/json' \
    -d '{ "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345" }'
  ```

  ```json
  {
    "updated_at": "2025-05-14T10:07:29",
    "created_at": "2025-05-14T10:07:29",
    "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345",
    "email": "nguyenvancanh@gmail.com",
    "name": "Nguyen Van Canh"
  }
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--get-user.jpg)
