---
title: "Function URL and HTTP methods"
weight: 4
chapter: false
pre: " <b> 8.4. </b> "
---

When invoke the lambda function with a function URL, you can use any HTTP method: GET, POST, DELETE, PATCH, PUT..., Lambda will treat all of them as the same.

- Try it with `GET`

  ```shell
  curl 'https://qzpsv22gd3s4qbnfwz2v5yefoy0dmipa.lambda-url.ap-southeast-1.on.aws/' \
    -X GET \
    -H 'content-type: application/json' \
    -d '{ "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345" }'
  ```

- Or `POST`

  ```shell
  curl 'https://qzpsv22gd3s4qbnfwz2v5yefoy0dmipa.lambda-url.ap-southeast-1.on.aws/' \
    -X GET \
    -H 'content-type: application/json' \
    -d '{ "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345" }'
  ```

You requests will all succeed and you will receive the same response.
