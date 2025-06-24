+++
title = "Clean up resources"
weight = 9
chapter = false
pre = "<b>9. </b>"
+++

{{% toc %}}

> [!NOTE]
> If you want to do the next workshop in the series, keep these resources.

<!-- TODO: link to next workshop -->

You need to cleanup the following resources:

1. The **DynamoDB table**

   - Open the [_Tables_ section](https://console.aws.amazon.com/dynamodbv2/home?#tables) of DynamoDB console
   - Select `UsersTable` table
   - Click `Delete`

     ![alt text](/images/workshop-1/cleanup-dynamodb--resources.jpg)

   - Type `confirm`
   - Click `Delete`

     ![alt text](/images/workshop-1/cleanup-dynamodb--confirm.jpg)

1. The **Lambda functions**:

   - Open the [_Functions_ section](https://console.aws.amazon.com/lambda/home#/functions) of Lambda console.
   - Select 5 functions: `create-user`, `list-user`, `get-user`, `update-user`, `delete-user`.
   - Click `Actions`, choose `Delete`.

     ![alt text](/images/workshop-1/cleanup-lambda--resources.jpg)

   - Type `confirm`, click `Delete`.

     ![alt text](/images/workshop-1/cleanup-lambda--confirm.jpg)

1. The **IAM roles** used as execution roles for Lambda functions

   - Open the [_Roles_ section](https://console.aws.amazon.com/iam/home#/roles) of IAM console
   - Select 5 roles: `create-user-role-XXXXXXX`, `delete-user-role-XXXXXXX`, `get-user-role-XXXXXXX`, `list-users-role-XXXXXXX`, `update-user-role-XXXXXXX`
   - Click `Delete`.

     ![alt text](/images/workshop-1/cleanup-iam-role--resources.jpg)

   - Type `delete`, click `Delete`

     ![alt text](/images/workshop-1/cleanup-iam-role--confirm.jpg)
