---
title: "Invoking update-user function"
weight: 4
chapter: false
pre: " <b> 6.4. </b> "
---

> [!NOTE]
> Remember to update the **function name** and the **id** of user with `Nguyen Van Dong` name.

1. Run

   ```shell
   aws lambda invoke \
       --function-name arn:aws:lambda:ap-southeast-1:971422684006:function:update-user \
       --cli-binary-format raw-in-base64-out \
       --payload '{ "id": "6c539686-de1c-4bef-85ef-f68a4b5aabe0", "name": "Nguyen Van Tay" }' \
       response.json
   ```

2. Check the response

   ```
   cat response.json
   ```

   ```json
   {"statusCode": 200, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}, "body": "{\"updated_at\": \"2025-05-14T10:45:09\", \"created_at\": \"2025-05-14T10:07:42\", \"email\": \"nguyenvandong@gmail.com\", \"id\": \"6c539686-de1c-4bef-85ef-f68a4b5aabe0\", \"name\": \"Nguyen Van Tay\"}"}%
   ```

   ![alt text](/images/workshop-1/lambda-invoke-with-aws-cli--update-user.jpg)

3. To verify that the user is updated, you can
   - Invoke `list-users` again.
   - Or use the DynamoDB console.
