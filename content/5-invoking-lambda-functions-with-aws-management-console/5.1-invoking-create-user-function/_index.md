---
title: "Invoking create-user function"
weight: 1
chapter: false
pre: " <b> 5.1. </b> "
---

1. Open the [Functions section of Lambda console](https://console.aws.amazon.com/lambda/home?#/functions)

1. Click `create-user` function.
1. Open the `Test` tab
1. In the `Test event` section,

   - Event name: Fill in `create-user-event`
   - Event JSON: Replace the placeholder event with

     ```json
     {
       "email": "nguyenvanan@gmail.com",
       "name": "Nguyen Van An"
     }
     ```

1. Click `Save`

   ![alt text](/images/workshop-1/lambda-invoke-with-console--test-event.png)

1. Click `Test`
1. In the `Execution functions` banner, click `Details`.

   ![alt text](/images/workshop-1/lambda-invoke-with-console--invoke.png)

1. You can check the response of the Lambda function and information about the execution of the Lambda function

   ![alt text](/images/workshop-1/lambda-invoke-with-console--exection-detail.jpg)

1. Verify that a new user is created in DynamoDB table `UsersTable`

   - Open the [`Explore items` page](https://console.aws.amazon.com/dynamodbv2/home#item-explorer) of the DynamoDB management console.
   - Select the `UsersTable` table
   - The Scan operation should be automatically run.
   - Verify that a new user is created (in other words, a new DynamoDB item is created.)

   ![alt text](/images/workshop-1/lambda-invoke-with-console--verify-user-created.jpg)

1. Invoke the `create-user` Lambda function in this step with different `Event JSON` to create some more users:

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

1. After invoking the `create-user` Lambda function with these 4 events, you should have 5 users.

   - Open the [`Explore items` page](https://console.aws.amazon.com/dynamodbv2/home#item-explorer) of the DynamoDB management console.
   - Select the `UsersTable` table
   - Click Refresh button
   - Verify that there are 5 items in the DynamoDB table.

     ![alt text](/images/workshop-1/lambda-invoke-with-console--verify-dynamodb-items.jpg)
