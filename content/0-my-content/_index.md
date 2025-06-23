---
title: "CRUD with AWS Lambda and Amazon DynamoDB"
weight: 2
chapter: false
pre: " <b> 0.0. </b> "
---



## Creating a DynamoDB table

- Login to AWS Management Console using your [console sign-in link and IAM credential](https://000002.awsstudygroup.com/2-create-admin-user-and-group/2.3-login-admin-user/).
- Open the [DynamoDB console](https://console.aws.amazon.com/dynamodbv2/home).
- Open the `Tables` section in the navigation drawer.
- Click `Create table`

  ![alt text](/images/workshop-1/dynamodb-create-table.png)

- In the `Table details` section, enter:

  - Table name: `UsersTable`
  - Partition key: `id`

  ![alt text](/images/workshop-1/dynamodb-create-table--detail.png)

- In the `Table settings` section, select `Default settings` which has:

  - Table class of `DynamoDB Standard`
  - Capacity mode of `On-demand`

- Click `Create table`

  ![alt text](/images/workshop-1/dynamodb-create-table--default-settings.png)

- Wait for Status of the table to change from `Creating` to `Active`.

  ![alt text](/images/workshop-1/dynamodb-create-table--successful.png)

## Creating Lambda functions

### Creating `create-user` function

- Open the [`Functions` section](https://console.aws.amazon.com/lambda/home#/functions) of [Lambda console](https://console.aws.amazon.com/lambda/home)
- Click `Create function`

  ![alt text](/images/workshop-1/lambda-create-function--functions-page.png)

- Choose `Author from scratch`
- In the `Basic information` section, enter:
  - Function name: `create-user`
  - Runtime: `Python 3.13`
  - Architecture: Keep `x86_64`
  - Permissions - `Change default execution role`: Keep `Create a new role with basic Lambda permissions` to let Lambda create new execution role for the function.
- Click `Create function`

  ![alt text](/images/workshop-1/lambda-create-function--options.png)

- After the function is created, you will be redirected to the detail page for the function.

  ![alt text](/images/workshop-1/lambda-create-function--function-detail.png)

- In the `Code` tab, `Code source` section:

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

- Open the `Configuration` tab
- Open the `Permissions` section
- In the `Execution Role`, click on the role name `create-user-role-XXXXXXXX` to open the page of the IAM role.

  ![alt text](/images/workshop-1/lambda-create-function--execution-role.png)

- In the page of the IAM role, `Permissions` tab, click the `Add permissions` button, choose `Attach Polices`.

  ![alt text](/images/workshop-1/lambda-create-function--attach-permission-policy.png)

- Search for `AmazonDynamoDBFullAccess` policy.
- Select `AmazonDynamoDBFullAccess` policy.
- Click `Add permissions` to attach the IAM policy to the IAM Role.

  ![alt text](/images/workshop-1/lambda-create-function--permission-policy-for-dynamodb.png)

### Creating `list-users` function

Repeat the steps in [creating `create-users` function](#creating-create-user-function), with the following differences:

- Function name: `list-users`
- The code

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

- Permissions policy: `AmazonDynamoDBReadOnlyAccess`

### Creating `get-user` function

Repeat the steps in [creating `create-users` function](#creating-create-user-function), with the following differences:

- Function name: `get-user`
- The code

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

- Permissions policy: `AmazonDynamoDBReadOnlyAccess`

### Creating `update-user` function

Repeat the steps in [creating `create-users` function](#creating-create-user-function), with the following differences:

- Function name: `update-user`
- The code

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

- Permissions policy: `AmazonDynamoDBFullAccess`

### Creating `delete-user` function

Repeat the steps in [creating `create-users` function](#creating-create-user-function), with the following differences:

- Function name: `delete-user`
- The code

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

- Permissions policy: `AmazonDynamoDBFullAccess`

---

At this point, check [Functions section of Lambda console](https://console.aws.amazon.com/lambda/home?#/functions) and verify you have 5 Lambda functions.

![alt text](/images/workshop-1/lambda--list-functions.png)

The architecture now looks like this:

![alt text](/diagrams/workshop-1-low-level.drawio.svg)

## Invoking the Lambda functions

### Using Lambda management console (testing the Lambda functions)

![alt text](/diagrams/workshop-1-invoke-with-management-console.drawio.svg)

#### Invoking `create-user` with management console

- Open the [Functions section of Lambda console](https://console.aws.amazon.com/lambda/home?#/functions)

- Click `create-user` function.
- Open the `Test` tab
- In the `Test event` section,

  - Event name: Fill in `create-user-event`
  - Event JSON: Replace the placeholder event with

    ```json
    {
      "email": "nguyenvanan@gmail.com",
      "name": "Nguyen Van An"
    }
    ```

- Click `Save`

  ![alt text](/images/workshop-1/lambda-invoke-with-console--test-event.png)

- Click `Test`
- In the `Execution functions` banner, click `Details`.

  ![alt text](/images/workshop-1/lambda-invoke-with-console--invoke.png)

- You can check the response of the Lambda function and information about the execution of the Lambda function

  ![alt text](/images/workshop-1/lambda-invoke-with-console--exection-detail.jpg)

- Verify that a new user is created in DynamoDB table `UsersTable`

  - Open the [`Explore items` page](https://console.aws.amazon.com/dynamodbv2/home#item-explorer) of the DynamoDB management console.
  - Select the `UsersTable` table
  - The Scan operation should be automatically run.
  - Verify that a new user is created (in other words, a new DynamoDB item is created.)

  ![alt text](/images/workshop-1/lambda-invoke-with-console--verify-user-created.jpg)

---

- Invoke the `create-user` Lambda function in this step with different `Event JSON` to create some more users:

  ```json
  {
    "email": "nguyenvanbinh@gmail.com",
    "name": "Nguyen Van Binh"
  }
  ```

  ```json
  {
    "email": "nguyenvancanh@gmail.com",
    "name": "Nguyen Van Canh"
  }
  ```

  ```json
  {
    "email": "nguyenvandong@gmail.com",
    "name": "Nguyen Van Dong"
  }
  ```

  ```json
  {
    "email": "nguyenvanem@gmail.com",
    "name": "Nguyen Van Em"
  }
  ```

- After invoking the `create-user` Lambda function with these 4 events, you should have 5 users.

  - Open the [`Explore items` page](https://console.aws.amazon.com/dynamodbv2/home#item-explorer) of the DynamoDB management console.
  - Select the `UsersTable` table
  - Click Refresh button
  - Verify that there are 5 items in the DynamoDB table.

    ![alt text](/images/workshop-1/lambda-invoke-with-console--verify-dynamodb-items.jpg)

#### Invoking `list-user` with management console

- Open the [AWS Lambda functions](https://console.aws.amazon.com/lambda/home?#/functions) management console
- Click `list-user` function.
- Open the `Test` tab.
- Click the `Test` button.

  ![alt text](/images/workshop-1/lambda-invoke-with-console--list-users.jpg)

- Verify that a list of users are returned.

  ![alt text](/images/workshop-1/lambda-invoke-with-console--list-users-execution.jpg)

#### Invoking `get-user` with management console

- Open the [AWS Lambda functions](https://console.aws.amazon.com/lambda/home?#/functions) management console
- Click `get-user` function.
- Open the `Test` tab.
- In the `Test event` section,

  - Event name: Fill in `get-user-event`
  - Event JSON: Replace the placeholder event with id of user with `Nguyen Van An` name.

    ```json
    {
      "id": "18d35ef6-a7ae-415b-a97d-34dc069a840d"
    }
    ```

> [!NOTE]
> Replace the user id with yours, you can get it in the DynamoDB `Explorer items` or in the response after invoking `list-users`.

- Click `Save`
- Click the `Test` button.

  ![alt text](/images/workshop-1/lambda-invoke-with-console--get-user-event.jpg)

- Verify that the user is returned.

  ![alt text](/images/workshop-1/lambda-invoke-with-console--get-user-detail.jpg)

#### Invoking `update-user` with management console

- Open the [AWS Lambda functions](https://console.aws.amazon.com/lambda/home?#/functions) management console
- Click `update-user` function.
- Open the `Test` tab.
- In the `Test event` section,

  - Event name: Fill in `update-user-event`
  - Event JSON: Replace the placeholder event with id of user with `Nguyen Van An` name but with new email and name.

    ```json
    {
      "id": "18d35ef6-a7ae-415b-a97d-34dc069a840d",
      "email": "nguyenvananh@gmail.com",
      "name": "Nguyen Van Anh"
    }
    ```

> [!NOTE]
> Replace the user id with yours, you can get it in the DynamoDB `Explorer items` or in the response after invoking `list-users`.

- Click `Save`
- Click the `Test` button.

  ![alt text](/images/workshop-1/lambda-invoke-with-console--update-user-event.jpg)

- Verify that the user is updated.

  - Open the [`Explore items` page](https://console.aws.amazon.com/dynamodbv2/home#item-explorer) of the DynamoDB management console.
  - Click refresh.
  - Verify that:

    - `Nguyen Van An` is updated to `Nguyen Van Anh`
    - `nguyenvanan@gmail.com` is updated to `nguyenvananh@gmail.com`

    ![alt text](/images/workshop-1/lambda-invoke-with-console--update-user-verify.jpg)

#### Invoking `delete-user` with management console

- Open the [AWS Lambda functions](https://console.aws.amazon.com/lambda/home?#/functions) management console
- Click `delete-user` function.
- Open the `Test` tab.
- In the `Test event` section,

  - Event name: Fill in `delete-user-event`
  - Event JSON: Replace the placeholder event with

    ```json
    {
      "id": "18d35ef6-a7ae-415b-a97d-34dc069a840d"
    }
    ```

> [!NOTE]
> Replace the user id with yours, you can get it in the DynamoDB `Explorer items` or in the response after invoking `list-users`.

- Click `Save`
- Click the `Test` button.

  ![alt text](/images/workshop-1/lambda-invoke-with-console--delete-user-event.jpg)

- Verify that the user is updated.

  - Open the [`Explore items` page](https://console.aws.amazon.com/dynamodbv2/home#item-explorer) of the DynamoDB management console.
  - Click refresh.
  - Verify that `Nguyen Van Anh` is no longer existed.

  ![alt text](/images/workshop-1/lambda-invoke-with-console--delete-user-verify.jpg)

### Using `AWS CLI` and AWS credentials

![alt text](/diagrams/workshop-1-invoke-with-with-cli.drawio.svg)

#### Invoking `list-users` using AWS CLI

- Run

  ```shell
  aws lambda invoke \
      --function-name arn:aws:lambda:ap-southeast-1:971422684006:function:list-users \
      response.json
  ```

> [!NOTE]
> Replace `ap-southeast-1` with your AWS region, `971422684006` with your AWS account number.
>
> Or replace the whole `arn:aws:lambda:ap-southeast-1:971422684006:function:list-users` with the function ARN from the management console.

- If the terminal shows:

  ```shell
  {
      "StatusCode": 200,
      "ExecutedVersion": "$LATEST"
  }
  ```

  You have successfully invoked a Lambda function with AWS CLI.

- Check the Lambda function response payload

  ```
  cat response.json
  ```

  ```json
  {"statusCode": 200, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}, "body": "{\"users\": [{\"updated_at\": \"2025-05-14T10:07:42\", \"created_at\": \"2025-05-14T10:07:42\", \"id\": \"6c539686-de1c-4bef-85ef-f68a4b5aabe0\", \"email\": \"nguyenvandong@gmail.com\", \"name\": \"Nguyen Van Dong\"}, {\"updated_at\": \"2025-05-14T10:07:29\", \"created_at\": \"2025-05-14T10:07:29\", \"id\": \"a3127179-6ba4-4c3b-855a-4f65d4ee6345\", \"email\": \"nguyenvancanh@gmail.com\", \"name\": \"Nguyen Van Canh\"}, {\"updated_at\": \"2025-05-14T10:07:51\", \"created_at\": \"2025-05-14T10:07:51\", \"id\": \"e1f0cca8-cd19-4d8b-9124-70a63c351e3a\", \"email\": \"nguyenvanem@gmail.com\", \"name\": \"Nguyen Van Em\"}, {\"updated_at\": \"2025-05-14T10:07:15\", \"created_at\": \"2025-05-14T10:07:15\", \"id\": \"bb15f9cb-1379-4783-9f6f-23616d633d2a\", \"email\": \"nguyenvanbinh@gmail.com\", \"name\": \"Nguyen Van Binh\"}]}"}%
  ```

  You should see the users you created in previous step.

- [Optional] The response payload is in JSON, you can use `jq` to have a pretty print of it

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

#### Invoking `get-user` using AWS CLI

- Run

  ```shell
  aws lambda invoke \
      --function-name arn:aws:lambda:ap-southeast-1:971422684006:function:get-user \
      --cli-binary-format raw-in-base64-out \
      --payload '{ "id": "6c539686-de1c-4bef-85ef-f68a4b5aabe0" }' \
      response.json
  ```

> [!NOTE]
> Remember to update
>
> - the **function name** (function ARN)
> - the **id** of user with `Nguyen Van Dong` name.

- Check the response

  ```
  cat response.json
  ```

  ```json
  {"statusCode": 200, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}, "body": "{\"updated_at\": \"2025-05-14T10:07:42\", \"created_at\": \"2025-05-14T10:07:42\", \"id\": \"6c539686-de1c-4bef-85ef-f68a4b5aabe0\", \"email\": \"nguyenvandong@gmail.com\", \"name\": \"Nguyen Van Dong\"}"}%
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-aws-cli--get-user.jpg)

#### Invoking `update-user` using AWS CLI

- Run

  ```shell
  aws lambda invoke \
      --function-name arn:aws:lambda:ap-southeast-1:971422684006:function:update-user \
      --cli-binary-format raw-in-base64-out \
      --payload '{ "id": "6c539686-de1c-4bef-85ef-f68a4b5aabe0", "name": "Nguyen Van Tay" }' \
      response.json
  ```

> [!NOTE]
> Remember to update
>
> - the **function name** (function ARN)
> - the **id** of user with `Nguyen Van Dong` name.

- Check the response

  ```
  cat response.json
  ```

  ```json
  {"statusCode": 200, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}, "body": "{\"updated_at\": \"2025-05-14T10:45:09\", \"created_at\": \"2025-05-14T10:07:42\", \"email\": \"nguyenvandong@gmail.com\", \"id\": \"6c539686-de1c-4bef-85ef-f68a4b5aabe0\", \"name\": \"Nguyen Van Tay\"}"}%
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-aws-cli--update-user.jpg)

- To verify that the user is updated, you can
  - Invoke `list-users` again.
  - Or use the DynamoDB console.

#### Invoking `delete-user` using AWS CLI

- Run

  ```shell
  aws lambda invoke \
      --function-name arn:aws:lambda:ap-southeast-1:971422684006:function:delete-user \
      --cli-binary-format raw-in-base64-out \
      --payload '{ "id": "6c539686-de1c-4bef-85ef-f68a4b5aabe0" }' \
      response.json
  ```

> [!NOTE]
> Remember to update
>
> - the **function name** (function ARN)
> - the **id** of user with `Nguyen Van Dong` name.

- Check the response

  ```
  cat response.json
  ```

  ```json
  {"statusCode": 204, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}}%
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-aws-cli--delete-user.jpg)

- To verify that the user is no longer existed, you can
  - Invoke `list-users` again.
  - Or use the DynamoDB console.

### Using `curl` and Lambda's function URL

<!-- TODO: Add diagram -->

- Previously, to invoke a Lambda function, you:

  - open the Lambda function page (in the AWS management console) and invoke the Lambda function by clicking `Test` button.

    (This will use the AWS credential of the AWS account the you've logged in).

    ![alt text](/diagrams/workshop-1-invoke-with-management-console-low-level.drawio.svg)

  - or use the AWS CLI and the function ARN to invoke the Lambda function.

    (This will use the AWS credential that you've configured with AWS CLI).

    ![alt text](/diagrams/workshop-1-invoke-with-with-cli-low-level.drawio.svg)

- In this step, you will create a _public_ **function URL** (for each Lambda function) and invoke the function using a browser or any HTTP client (e.g. `curl`)

> [!NOTE]
> A function URL is a dedicated HTTP(S) endpoint for your Lambda function.
>
> - When you create a function URL, Lambda automatically generates a unique URL endpoint for you.
>
> You can control access to your Lambda function URLs using the AuthType parameter:
>
> - When you configure your function URL, you must specify one of the following AuthType options:
>   - `AWS_IAM` – Lambda uses AWS Identity and Access Management (IAM) to authenticate and authorize requests based on the IAM principal's identity policy and the function's resource-based policy. Choose this option if you want only authenticated users and roles to invoke your function via the function URL.
>   - `NONE` – Lambda doesn't perform any authentication before invoking your function. However, your function's resource-based policy is always in effect and must grant public access before your function URL can receive requests. Choose this option to allow public, unauthenticated access to your function URL.
>
> In this workshop, we will create functions URL with `AuthType` of `NONE`.
>
> See
>
> - [Create a signed AWS API request - AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-create-signed-request.html)

#### Creating function URLs

![alt text](/diagrams/workshop-1-function-urls-high-level.drawio.svg)

- To create the function URL for `list-users` Lambda function:

  - Open the [Functions section of Lambda console](https://console.aws.amazon.com/lambda/home?#/functions)

  - Click `list-users` function.

  - Open the `Configuration` tab
  - Open the `Function URL` section
  - Click `Create function URL`

    ![alt text](/images/workshop-1/lambda-function-url--create.jpg)

  - In the `Configure Function URL` page, choose `Auth type` of `NONE`.

  - Click `Save`

    ![alt text](/images/workshop-1/lambda-function-url--configure.jpg)

  - After the function URL is created, you can see it in the `Function overview` section or in the `Configuration` / `Function URL` section.

    ![alt text](/images/workshop-1/lambda-function-url--location.jpg)

  - Copy the function URL, you will need it for the next step.

- Repeat this process to create the function URLs for other Lambda function: `create-user`, `get-user`, `update-user`, `delete-user`.

#### Invoking `list-users` using `curl`

![alt text](/diagrams/workshop-1-function-urls.drawio.svg)

> [!NOTE]
> Replace the URL with the function URL of your `list-users` Lambda function.

- To invoke `list-users` you can use any HTTP client, e.g. `curl`.

  ```shell
  curl 'https://u2z6j6noy3vnrynejsjqmkgiry0asnnm.lambda-url.ap-southeast-1.on.aws/'
  ```

  ```json
  {"users": [{"updated_at": "2025-05-14T10:07:29", "created_at": "2025-05-14T10:07:29", "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345", "email": "nguyenvancanh@gmail.com", "name": "Nguyen Van Canh"}, {"updated_at": "2025-05-14T10:07:51", "created_at": "2025-05-14T10:07:51", "id": "e1f0cca8-cd19-4d8b-9124-70a63c351e3a", "email": "nguyenvanem@gmail.com", "name": "Nguyen Van Em"}, {"updated_at": "2025-05-14T10:07:15", "created_at": "2025-05-14T10:07:15", "id": "bb15f9cb-1379-4783-9f6f-23616d633d2a", "email": "nguyenvanbinh@gmail.com", "name": "Nguyen Van Binh"}]}%
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--list-users.jpg)

> [!TIP]
> The response is JSON, pipe it to `jq` to have it pretty print.

> [!NOTE]
> You can invoke the `list-users` Lambda function by open its function URL in a browser.
>
> ![alt text](/images/workshop-1/lambda-invoke-with-browser--list-users.jpg)

#### Invoking `get-user` using `curl`

> [!NOTE]
> Replace the URL with the function URL of your `get-user` Lambda function.

- `get-user` expects the id of the user in the HTTP request's body, choose id of one user from the response of `list-users`.

  ```shell
  curl 'https://qzpsv22gd3s4qbnfwz2v5yefoy0dmipa.lambda-url.ap-southeast-1.on.aws/' \
    -H 'content-type: application/json' \
    -d '{ "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345" }'
  ```

  ```json
  {
    "updated_at": "2025-05-14T10:07:29",
    "created_at": "2025-05-14T10:07:29",
    "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345",
    "email": "nguyenvancanh@gmail.com",
    "name": "Nguyen Van Canh"
  }
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--get-user.jpg)

> [!IMPORTANT]
> When invoke the lambda function with a function URL, you can use any HTTP method: GET, POST, DELETE, PATCH, PUT..., Lambda will treat all of them as the same.
>
> - Try it with `GET`
>
>   ```shell
>   curl 'https://qzpsv22gd3s4qbnfwz2v5yefoy0dmipa.lambda-url.ap-southeast-1.on.aws/' \
>     -X GET \
>     -H 'content-type: application/json' \
>     -d '{ "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345" }'
>   ```
>
> - Or `POST`
>
>   ```shell
>   curl 'https://qzpsv22gd3s4qbnfwz2v5yefoy0dmipa.lambda-url.ap-southeast-1.on.aws/' \
>     -X GET \
>     -H 'content-type: application/json' \
>     -d '{ "id": "a3127179-6ba4-4c3b-855a-4f65d4ee6345" }'
>   ```
>
> You requests will all succeed and you will receive the same response.

#### Invoking `create-user` using `curl`

> [!NOTE]
> Replace the URL with the function URL of your `create-user` Lambda function.

- Run

  ```shell
  curl 'https://zvybyad2wvq5dto3upm2mgtcwa0epmul.lambda-url.ap-southeast-1.on.aws/' \
    -H 'content-type: application/json' \
    -d '{ "name": "First Cloud Journey", "email": "fcj@example.com" }'
  ```

  ```json
  {"id": "bcfe3cf9-1607-489e-8501-f99c194e6cc9", "name": "First Cloud Journey", "email": "fcj@example.com", "created_at": "2025-05-14T16:46:29", "updated_at": "2025-05-14T16:46:29"}%
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--create-user.jpg)

- Verify that a new user is created with DynamoDB console.

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--create-user-verify.jpg)

#### Invoking `update-user` using `curl`

> [!NOTE]
> Replace the URL with the function URL of your `update-user` Lambda function.

- Run

  ```shell
  curl 'https://hk3icryf6br2ociwan5ier2gqe0gyaoi.lambda-url.ap-southeast-1.on.aws/' \
    -H 'content-type: application/json' \
    -d '{ "id": "bcfe3cf9-1607-489e-8501-f99c194e6cc9", "email": "fcj@aws.com" }'
  ```

  ```json
  {"updated_at": "2025-05-14T16:51:03", "created_at": "2025-05-14T16:46:29", "email": "fcj@aws.com", "id": "bcfe3cf9-1607-489e-8501-f99c194e6cc9", "name": "First Cloud Journey"}%
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--update-user.jpg)

- Verify that the user is updated with DynamoDB console.

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--update-user-verify.jpg)

#### Invoking `delete-user` using `curl`

> [!NOTE]
> Replace the URL with the function URL of your `delete-user` Lambda function.

- Run

  ```shell
  curl 'https://5ywq2njgsehqpl3xl2nrs334ue0inscy.lambda-url.ap-southeast-1.on.aws/' \
    -H 'content-type: application/json' \
    -d '{ "id": "bcfe3cf9-1607-489e-8501-f99c194e6cc9" }'
  ```

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--delete-user.jpg)

> [!NOTE]
> When invoke `delete-user` with `curl` you don't receive any message (The response doesn't have a body).

- Verify the user is deleted with DynamoDB console.

  ![alt text](/images/workshop-1/lambda-invoke-with-curl--delete-user-verify.jpg)

## Cleanup

> [!NOTE]
> If you want to do the next workshop in the series, keep these resources.

<!-- TODO: link to next workshop -->

You need to cleanup the following resources:

- The **DynamoDB table**

  - Open the [_Tables_ section](https://console.aws.amazon.com/dynamodbv2/home?#tables) of DynamoDB console
  - Select `UsersTable` table
  - Click `Delete`

    ![alt text](/images/workshop-1/cleanup-dynamodb--resources.jpg)

  - Type `confirm`
  - Click `Delete`

    ![alt text](/images/workshop-1/cleanup-dynamodb--confirm.jpg)

- The **Lambda functions**:

  - Open the [_Functions_ section](https://console.aws.amazon.com/lambda/home#/functions) of Lambda console.
  - Select 5 functions: `create-user`, `list-user`, `get-user`, `update-user`, `delete-user`.
  - Click `Actions`, choose `Delete`.

    ![alt text](/images/workshop-1/cleanup-lambda--resources.jpg)

  - Type `confirm`, click `Delete`.

    ![alt text](/images/workshop-1/cleanup-lambda--confirm.jpg)

- The **IAM roles** used as execution roles for Lambda functions

  - Open the [_Roles_ section](https://console.aws.amazon.com/iam/home#/roles) of IAM console
  - Select 5 roles: `create-user-role-XXXXXXX`, `delete-user-role-XXXXXXX`, `get-user-role-XXXXXXX`, `list-users-role-XXXXXXX`, `update-user-role-XXXXXXX`
  - Click `Delete`.

    ![alt text](/images/workshop-1/cleanup-iam-role--resources.jpg)

  - Type `delete`, click `Delete`

    ![alt text](/images/workshop-1/cleanup-iam-role--confirm.jpg)

## Summary

In this workshop, you have hands-on experience about:

- Creating a **DynamoDB table**.
- Creating **Lambda functions**.
- _Directly_ invoking Lambda functions:
  - Using AWS Management Console
  - Using AWS CLI
  - Using any HTTP client, e.g. a browser, `curl`, and _function URL_.
- Using _function URL_ to expose Lambda functions to public, unauthenticated users (that doesn't have AWS credential).

You also understand

- _access permissions_ - permissions for other entities to access your functions - in other words, it's how the IAM authenticate and authorize the invocation of your Lambda functions.

  - When invoking a Lambda function using AWS Management Console, you're using the permission of the IAM credential you've logged in.
  - When invoking a Lambda function using AWS CLI, you're using the permission of the IAM credential you've configured for AWS CLI.
  - When invoking a Lambda function using its public function, IAM still needs to authenticate/authorize that invocation (although IAM allow any principle which including unauthenticated users).

- _execution role_ - which provide permissions for functions to access other resources, e.g. DynamoDB table.

In the next workshop of this series, you will learn about:

- Protecting the Lambda's functions URL with IAM.
- Managing the Lambda functions into a REST API with API Gateway.
