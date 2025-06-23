---
title: "Invoking delete-user function"
weight: 5
chapter: false
pre: " <b> 5.5. </b> "
---

1. Open the [AWS Lambda functions](https://console.aws.amazon.com/lambda/home?#/functions) management console
2. Click `delete-user` function.
3. Open the `Test` tab.
4. In the `Test event` section,

   - Event name: Fill in `delete-user-event`
   - Event JSON: Replace the placeholder event with

     ```json
     {
       "id": "18d35ef6-a7ae-415b-a97d-34dc069a840d"
     }
     ```

> [!NOTE]
> Replace the user id with yours, you can get it in the DynamoDB `Explorer items` or in the response after invoking `list-users`.

5. Click `Save`
6. Click the `Test` button.

   ![alt text](/images/workshop-1/lambda-invoke-with-console--delete-user-event.jpg)

7. Verify that the user is updated.

   - Open the [`Explore items` page](https://console.aws.amazon.com/dynamodbv2/home#item-explorer) of the DynamoDB management console.
   - Click refresh.
   - Verify that `Nguyen Van Anh` is no longer existed.

   ![alt text](/images/workshop-1/lambda-invoke-with-console--delete-user-verify.jpg)
