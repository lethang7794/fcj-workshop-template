---
title: "Creating list-user function"
weight: 2
chapter: false
pre: " <b> 4.2. </b> "
---

Repeat the steps in [creating `create-users` function](/4-creating-lambda-functions/4.1-creating-create-user-function/), with the following differences:

1. Function name: `list-users`
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
       Lambda handler to list all users with pagination.
       Supports query parameters 'limit' and 'last_key'.
       """

       try:
           params = json.loads(event["body"]) if "body" in event else event
       except json.JSONDecodeError:
           return response(400, {"error": "Invalid JSON body: " + event["body"]})

       limit = int(params["limit"]) if "limit" in params else 10
       last_key = params.get("last_key")

       scan_kwargs = {"Limit": limit}
       if last_key:
           # last_key expected to be the id of the last evaluated item
           scan_kwargs["ExclusiveStartKey"] = {"id": last_key}

       try:
           response_db = table.scan(**scan_kwargs)
           items = response_db.get("Items", [])
           last_evaluated = response_db.get("LastEvaluatedKey")
           result = {"users": items}
           if last_evaluated:
               result["last_key"] = last_evaluated.get("id")
           return response(200, result)
       except Exception as e:
           return response(500, {"error": str(e)})
   ```

1. Permissions policy: `AmazonDynamoDBReadOnlyAccess`
