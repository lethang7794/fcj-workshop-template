---
title: "Creating delete-user function"
weight: 5
chapter: false
pre: " <b> 4.5. </b> "
---

Repeat the steps in [creating `create-users` function](/4-creating-lambda-functions/4.1-creating-create-user-function/), with the following differences:

1. Function name: `delete-user`
1. The code

   ```python
   import os
   import json
   import boto3

   # Initialize DynamoDB resource and table
   dynamodb = boto3.resource("dynamodb")
   TABLE_NAME = os.environ.get("USERS_TABLE", "UsersTable")
   table = dynamodb.Table(TABLE_NAME)


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
       Lambda handler to delete a user by id.
       Expects path parameter 'id'.
       """
       try:
           data = json.loads(event["body"]) if "body" in event else event
       except json.JSONDecodeError:
           return response(400, {"error": "Invalid JSON body: " + event["body"]})

       try:
           user_id = data["id"]
       except (KeyError, json.JSONDecodeError):
           return response(400, {"error": "Invalid request body; id is required."})

       try:
           table.delete_item(
               Key={"id": user_id}, ConditionExpression="attribute_exists(id)"
           )
           return response(204)
       except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
           return response(404, {"error": "User not found."})
       except Exception as e:
           return response(500, {"error": str(e)})
   ```

1. Permissions policy: `AmazonDynamoDBFullAccess`

---

At this point, check [Functions section of Lambda console](https://console.aws.amazon.com/lambda/home?#/functions) and verify you have 5 Lambda functions.

![alt text](/images/workshop-1/lambda--list-functions.png)
