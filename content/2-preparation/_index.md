---
title: "Preparation"
weight: 2
chapter: false
pre: " <b> 2. </b> "
---

Before starting this workshop, you need:

1. An IAM user with `AdministratorAccess` permissions that you can login with to AWS Management Console.

   ![alt text](/images/workshop-1/IAM-user-login-and-permissions.png)

   If you haven't create an IAM user, follow [Create IAM Group and IAM User :: MANAGING ACCESS CONTROL WITH AWS IAM (IDENTITY AND ACCESS MANAGEMENT)](https://000002.awsstudygroup.com/2-create-admin-user-and-group/) to create one.

1. AWS CLI installed and configured with the credential for that IAM user.

   - Run `aws sts get-caller-identity` to verify it:

     ![alt text](/images/workshop-1/AWS-CLI--verify-credential.png)

   - Your output may looks a little bit different than mine.

   - If you can't run `aws sts get-caller-identity`, follow [Install AWS CLI :: GETTING STARTED WITH THE AWS CLI](https://000011.awsstudygroup.com/3-installcli/).
