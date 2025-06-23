---
title: "Creating a DynamoDB table"
weight: 3
chapter: false
pre: " <b> 3. </b> "
---

In this step, we will create a DynamoDB table to persist our data.

1. Login to AWS Management Console using your [console sign-in link and IAM credential](https://000002.awsstudygroup.com/2-create-admin-user-and-group/2.3-login-admin-user/).
1. Open the [DynamoDB console](https://console.aws.amazon.com/dynamodbv2/home).
1. Open the `Tables` section in the navigation drawer.
1. Click `Create table`

   ![alt text](/images/workshop-1/dynamodb-create-table.png)

1. In the `Table details` section, enter:

   - Table name: `UsersTable`
   - Partition key: `id`

   ![alt text](/images/workshop-1/dynamodb-create-table--detail.png)

1. In the `Table settings` section, select `Default settings` which has:

   - Table class of `DynamoDB Standard`
   - Capacity mode of `On-demand`

1. Click `Create table`

   ![alt text](/images/workshop-1/dynamodb-create-table--default-settings.png)

1. Wait for Status of the table to change from `Creating` to `Active`.

   ![alt text](/images/workshop-1/dynamodb-create-table--successful.png)
