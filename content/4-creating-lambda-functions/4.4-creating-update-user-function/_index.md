---
title: "Creating update-user function"
weight: 4
chapter: false
pre: " <b> 4.4. </b> "
---

Repeat the steps in [creating `create-users` function](/4-creating-lambda-functions/4.1-creating-create-user-function/), with the following differences:

1. Function name: `update-user`
1. The code

   ```python
   import datetime
   import os
   import json
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
       Lambda handler to update a user by id.
       Expects path parameter 'id' and JSON body with attributes to update.
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
           if not data:
               raise ValueError("No update data provided.")
       except (json.JSONDecodeError, ValueError) as e:
           return response(400, {"error": str(e)})

       data.pop("id", None)  # Remove id from data to avoid updating it
       data["updated_at"] = getCurrentTime()  # Add updated_at timestamp

       # Build UpdateExpression
       update_expr = "SET " + ", ".join(f"#k{i} = :v{i}" for i, _ in enumerate(data))
       expr_attr_names = {f"#k{i}": k for i, k in enumerate(data)}
       expr_attr_values = {f":v{i}": v for i, v in enumerate(data.values())}

       try:
           result = table.update_item(
               Key={"id": user_id},
               UpdateExpression=update_expr,
               ExpressionAttributeNames=expr_attr_names,
               ExpressionAttributeValues=expr_attr_values,
               ConditionExpression="attribute_exists(id)",
               ReturnValues="ALL_NEW",
           )
           return response(200, result.get("Attributes"))
       except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
           return response(404, {"error": "User not found."})
       except Exception as e:
           return response(500, {"error": str(e)})
   ```

1. Permissions policy: `AmazonDynamoDBFullAccess`
