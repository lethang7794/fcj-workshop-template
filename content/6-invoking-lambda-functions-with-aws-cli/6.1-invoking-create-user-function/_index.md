---
title: "Invoking create-user function"
weight: 1
chapter: false
pre: " <b> 6.1. </b> "
---

> [!NOTE]
> Replace `ap-southeast-1` with your AWS region, `971422684006` with your AWS account number, or replace the whole `arn:aws:lambda:ap-southeast-1:971422684006:function:create-user` with the function ARN from the management console.

1. Run

   ```shell
   aws lambda invoke \
       --function-name arn:aws:lambda:ap-southeast-1:971422684006:function:create-user \
       --cli-binary-format raw-in-base64-out \
       --payload '{ "email": "nguyenvandong@gmail.com", "name": "Nguyen Van Dong" }' \
       response.json
   ```

2. Check the response

   ```
   cat response.json
   ```

   ```json
   {"statusCode": 200, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}, "body": "{\"updated_at\": \"2025-05-14T10:07:42\", \"created_at\": \"2025-05-14T10:07:42\", \"id\": \"6c539686-de1c-4bef-85ef-f68a4b5aabe0\", \"email\": \"nguyenvandong@gmail.com\", \"name\": \"Nguyen Van Dong\"}"}%
   ```

3. To verify that the user is updated, you can
   - Invoke `list-users` again.
   - Or use the DynamoDB console.
