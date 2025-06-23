---
title: "Invoking list-user function"
weight: 2
chapter: false
pre: " <b> 6.2. </b> "
---

> [!NOTE]
> Replace `ap-southeast-1` with your AWS region, `971422684006` with your AWS account number, or replace the whole `arn:aws:lambda:ap-southeast-1:971422684006:function:list-users` with the function ARN from the management console.

1. Run

   ```shell
   aws lambda invoke \
       --function-name arn:aws:lambda:ap-southeast-1:971422684006:function:list-users \
       response.json
   ```

2. If the terminal shows:

   ```shell
   {
       "StatusCode": 200,
       "ExecutedVersion": "$LATEST"
   }
   ```

   You have successfully invoked a Lambda function with AWS CLI.

3. Check the Lambda function response payload

   ```
   cat response.json
   ```

   ```json
   {"statusCode": 200, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}, "body": "{\"users\": [{\"updated_at\": \"2025-05-14T10:07:42\", \"created_at\": \"2025-05-14T10:07:42\", \"id\": \"6c539686-de1c-4bef-85ef-f68a4b5aabe0\", \"email\": \"nguyenvandong@gmail.com\", \"name\": \"Nguyen Van Dong\"}, {\"updated_at\": \"2025-05-14T10:07:29\", \"created_at\": \"2025-05-14T10:07:29\", \"id\": \"a3127179-6ba4-4c3b-855a-4f65d4ee6345\", \"email\": \"nguyenvancanh@gmail.com\", \"name\": \"Nguyen Van Canh\"}, {\"updated_at\": \"2025-05-14T10:07:51\", \"created_at\": \"2025-05-14T10:07:51\", \"id\": \"e1f0cca8-cd19-4d8b-9124-70a63c351e3a\", \"email\": \"nguyenvanem@gmail.com\", \"name\": \"Nguyen Van Em\"}, {\"updated_at\": \"2025-05-14T10:07:15\", \"created_at\": \"2025-05-14T10:07:15\", \"id\": \"bb15f9cb-1379-4783-9f6f-23616d633d2a\", \"email\": \"nguyenvanbinh@gmail.com\", \"name\": \"Nguyen Van Binh\"}]}"}%
   ```

   You should see the users you created in previous step.

4. [Optional] The response payload is in JSON, you can use `jq` to have a pretty print of it

   ```shell
   cat response.json | jq
   ```

   ```json
   {
     "statusCode": 200,
     "headers": {
       "Content-Type": "application/json",
       "Access-Control-Allow-Origin": "*"
     },
     "body": "{\"users\": [{\"updated_at\": \"2025-05-14T10:07:42\", \"created_at\": \"2025-05-14T10:07:42\", \"id\": \"6c539686-de1c-4bef-85ef-f68a4b5aabe0\", \"email\": \"nguyenvandong@gmail.com\", \"name\": \"Nguyen Van Dong\"}, {\"updated_at\": \"2025-05-14T10:07:29\", \"created_at\": \"2025-05-14T10:07:29\", \"id\": \"a3127179-6ba4-4c3b-855a-4f65d4ee6345\", \"email\": \"nguyenvancanh@gmail.com\", \"name\": \"Nguyen Van Canh\"}, {\"updated_at\": \"2025-05-14T10:07:51\", \"created_at\": \"2025-05-14T10:07:51\", \"id\": \"e1f0cca8-cd19-4d8b-9124-70a63c351e3a\", \"email\": \"nguyenvanem@gmail.com\", \"name\": \"Nguyen Van Em\"}, {\"updated_at\": \"2025-05-14T10:07:15\", \"created_at\": \"2025-05-14T10:07:15\", \"id\": \"bb15f9cb-1379-4783-9f6f-23616d633d2a\", \"email\": \"nguyenvanbinh@gmail.com\", \"name\": \"Nguyen Van Binh\"}]}"
   }
   ```

   ![alt text](/images/workshop-1/lambda-invoke-with-aws-cli--list-users.jpg)
