---
title: "Invoking get-user function"
weight: 3
chapter: false
pre: " <b> 5.3. </b> "
---

1. Open the [AWS Lambda functions](https://console.aws.amazon.com/lambda/home?#/functions) management console
2. Click `get-user` function.
3. Open the `Test` tab.
4. In the `Test event` section,

   - Event name: Fill in `get-user-event`
   - Event JSON: Replace the placeholder event with id of user with `Nguyen Van An` name.

     ```json
     {
       "id": "18d35ef6-a7ae-415b-a97d-34dc069a840d"
     }
     ```

> [!NOTE]
> Replace the user id with yours, you can get it in the DynamoDB `Explorer items` or in the response after invoking `list-users`.

5. Click `Save`
6. Click the `Test` button.

   ![alt text](/images/workshop-1/lambda-invoke-with-console--get-user-event.jpg)

7. Verify that the user is returned.

   ![alt text](/images/workshop-1/lambda-invoke-with-console--get-user-detail.jpg)
