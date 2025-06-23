---
title: "Creating get-user function"
weight: 3
chapter: false
pre: " <b> 4.3. </b> "
---

Repeat the steps in [creating `create-users` function](/4-creating-lambda-functions/4.1-creating-create-user-function/), with the following differences:

1. Function name: `get-user`
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
       Lambda handler to get a user by id.
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
           result = table.get_item(Key={"id": user_id})
           item = result.get("Item")
           if not item:
               return response(404, {"error": "User not found."})
           return response(200, item)
       except Exception as e:
           return response(500, {"error": str(e)})
   ```

1. Permissions policy: `AmazonDynamoDBReadOnlyAccess`
