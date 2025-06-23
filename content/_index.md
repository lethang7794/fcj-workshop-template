---
title: "CRUD with AWS Lambda and Amazon DynamoDB"
weight: 1
chapter: false
---

# CRUD with AWS Lambda and Amazon DynamoDB

This workshop will guide you to create a serverless CRUD APIs with only 2 AWS services:

- AWS Lambda
- Amazon DynamoDB

You will also learn about

- _directly_ invoking Lambda functions in 3 ways
- who can invoke your Lambda functions (aka _access permissions_)
- how your Lambda functions access other AWS resources (e.g. DynamoDB table)

The high level architecture looks like this:

![alt text](/diagrams/workshop-1-high-level.drawio.svg)

### Content

1. [Introduction](1-introduction)
2. [Preparation](2-preparation)
3. [Creating a DynamoDB table](3-creating-a-dynamodb-table)
4. [Creating Lambda functions](4-creating-lambda-functions)
5. [Invoking Lambda functions with AWS Management Console](5-invoking-lambda-functions-with-aws-management-console)
6. [Invoking Lambda functions with AWS CLI](6-invoking-lambda-functions-with-aws-cli)
7. [Creating functions URLs](7-creating-function-urls)
8. [Invoking Lambda functions with Lambda function Url](8-invoking-lambda-functions-with-lambda-function-url)
9. [Clean up resources](9-clean-up-resources)
10. [Summary](10-summary)
