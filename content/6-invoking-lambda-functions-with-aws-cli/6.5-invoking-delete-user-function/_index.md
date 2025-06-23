---
title: "Invoking delete-user function"
weight: 5
chapter: false
pre: " <b> 6.5. </b> "
---

> [!NOTE]
> Remember to update the **function name** and the **id** of user with `Nguyen Van Dong` name.

1. Run

   ```shell
   aws lambda invoke \
       --function-name arn:aws:lambda:ap-southeast-1:971422684006:function:delete-user \
       --cli-binary-format raw-in-base64-out \
       --payload '{ "id": "6c539686-de1c-4bef-85ef-f68a4b5aabe0" }' \
       response.json
   ```

2. Check the response

   ```
   cat response.json
   ```

   ```json
   {"statusCode": 204, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}}%
   ```

   ![alt text](/images/workshop-1/lambda-invoke-with-aws-cli--delete-user.jpg)

3. To verify that the user is no longer existed, you can
   - Invoke `list-users` again.
   - Or use the DynamoDB console.
