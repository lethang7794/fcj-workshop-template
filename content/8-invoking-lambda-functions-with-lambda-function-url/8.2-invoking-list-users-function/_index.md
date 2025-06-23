---
title: "Invoking list-user function"
weight: 2
chapter: false
pre: " <b> 8.2. </b> "
---

> [!NOTE]
> Replace the URL with the function URL of your `list-users` Lambda function.

- To invoke `list-users` you can use any HTTP client, e.g. `curl`.

  ```shell
  curl 'https://u2z6j6noy3vnrynejsjqmkgiry0asnnm.lambda-url.ap-southeast-1.on.aws/'
  ```

  ```json
  {"users": [{"updated_at": "2025-05-14T10:07:29", "created_at": "2025-05-14T10:07:29", "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345", "email": "nguyenvancanh@gmail.com", "name": "Nguyen Van Canh"}, {"updated_at": "2025-05-14T10:07:51", "created_at": "2025-05-14T10:07:51", "id": "e1f0cca8-cd19-4d8b-9124-70a63c351e3a", "email": "nguyenvanem@gmail.com", "name": "Nguyen Van Em"}, {"updated_at": "2025-05-14T10:07:15", "created_at": "2025-05-14T10:07:15", "id": "bb15f9cb-1379-4783-9f6f-23616d633d2a", "email": "nguyenvanbinh@gmail.com", "name": "Nguyen Van Binh"}]}%
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--list-users.jpg)

> [!TIP]
> The response is JSON, pipe it to `jq` to have it pretty print.

> [!NOTE]
> You can invoke the `list-users` Lambda function by open its function URL in a browser.
>
> ![alt text](/images/workshop-1/lambda-invoke-with-browser--list-users.jpg)
