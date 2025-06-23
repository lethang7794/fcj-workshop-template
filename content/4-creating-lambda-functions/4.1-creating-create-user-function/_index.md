---
title: "Creating create-user function"
weight: 1
chapter: false
pre: " <b> 4.1. </b> "
---

1. Open the [`Functions` section](https://console.aws.amazon.com/lambda/home#/functions) of [Lambda console](https://console.aws.amazon.com/lambda/home)
1. Click `Create function`

   ![alt text](/images/workshop-1/lambda-create-function--functions-page.png)

1. Choose `Author from scratch`
1. In the `Basic information` section, enter:
   - Function name: `create-user`
   - Runtime: `Python 3.13`
   - Architecture: Keep `x86_64`
   - Permissions - `Change default execution role`: Keep `Create a new role with basic Lambda permissions` to let Lambda create new execution role for the function.
1. Click `Create function`

   ![alt text](/images/workshop-1/lambda-create-function--options.png)

1. After the function is created, you will be redirected to the detail page for the function.

   ![alt text](/images/workshop-1/lambda-create-function--function-detail.png)

1. In the `Code` tab, `Code source` section:

   - Wait for the code editor to be loaded.
   - In the editor tab for `lambda_function.py`, replace all the placeholder code with the following code:

     ```python
     import datetime
     import os
     import json
     import uuid
     import boto3

     # Initialize DynamoDB resource and table
     dynamodb = boto3.resource("dynamodb")
     TABLE_NAME = os.environ.get("USERS_TABLE", "UsersTable")
     table = dynamodb.Table(TABLE_NAME)


     def getCurrentTime():
         return datetime.datetime.now().replace(microsecond=0).isoformat()


     def response(status_code, body=None):
         """
         Helper to build HTTP responses
         """
         resp = {
             "statusCode": status_code,
             "headers": {
                 "Content-Type": "application/json",
                 "Access-Control-Allow-Origin": "*",
             },
         }
         if body is not None:
             resp["body"] = json.dumps(body)
         return resp


     def lambda_handler(event, context):
         """
         Lambda handler to create a user and persist data in DynamoDB.
         Expects JSON body with 'id', 'name', 'email', and optionally other attributes.
         """
         try:
             data = json.loads(event["body"]) if "body" in event else event
         except json.JSONDecodeError:
             return response(400, {"error": "Invalid JSON body: " + event["body"]})

         now = getCurrentTime()
         id = uuid.uuid4()

         try:
             # Validate required fields
             name = data["name"]
             email = data["email"]
         except (KeyError, json.JSONDecodeError):
             return response(
                 400, {"error": "Invalid request body: name, and email are required."}
             )

         item = {
             "id": str(id),
             "name": name,
             "email": email,
             "created_at": now,
             "updated_at": now,
             **{k: v for k, v in data.items() if k not in ["name", "email"]},
         }

         try:
             table.put_item(Item=item, ConditionExpression="attribute_not_exists(id)")
             return response(201, item)
         except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
             return response(409, {"error": "User with given id already exists."})
         except Exception as e:
             return response(500, {"error": str(e)})
     ```

   - Click `Deploy (Ctrl + Shift + U)` to deploy the lambda function.

     ![alt text](/images/workshop-1/lambda-create-function--source-code-and-deploy.png)

1. Open the `Configuration` tab
1. Open the `Permissions` section
1. In the `Execution Role`, click on the role name `create-user-role-XXXXXXXX` to open the page of the IAM role.

   ![alt text](/images/workshop-1/lambda-create-function--execution-role.png)

1. In the page of the IAM role, `Permissions` tab, click the `Add permissions` button, choose `Attach Polices`.

   ![alt text](/images/workshop-1/lambda-create-function--attach-permission-policy.png)

1. Search for `AmazonDynamoDBFullAccess` policy.
1. Select `AmazonDynamoDBFullAccess` policy.
1. Click `Add permissions` to attach the IAM policy to the IAM Role.

   ![alt text](/images/workshop-1/lambda-create-function--permission-policy-for-dynamodb.png)
