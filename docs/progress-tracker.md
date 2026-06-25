# Progress Tracker

## Phase 0 — Environment and Setup
- [x] Create implementation repo
- [x] Clone repo locally
- [x] Create folder structure
- [x] Add .gitignore
- [x] Confirm AWS CLI
- [x] Confirm Terraform
- [x] Confirm AWS identity with STS
- [x] Set region to eu-central-1
- [x] Create MVP scope doc
- [x] Create progress tracker
- [x] Push initial structure to GitHub

## Phase 1 — MVP and Functional Design
- [x] Finalize MVP scope
- [x] Define user roles and flows
- [x] Define API endpoints
- [x] Define submission status values
- [x] Define DynamoDB schema
- [x] Define Cognito groups
- [x] Define Lambda responsibilities
- [x] Define Lambda environment variables
- [x] Create Terraform starter files

## Phase 2 — Core AWS Resources
- [x] Create S3 document bucket
- [x] Enable S3 public access block
- [x] Enable S3 versioning
- [x] Enable S3 server-side encryption
- [x] Create DynamoDB submissions table
- [x] Create SNS notifications topic
- [x] Deploy resources with Terraform
- [x] Verify resources in AWS Console

## Phase 3 — Authentication with Cognito
- [x] Create Cognito User Pool
- [x] Create Cognito User Pool Client
- [x] Create supplier group
- [x] Create reviewer group
- [x] Deploy Cognito resources with Terraform
- [x] Verify Cognito resources in AWS Console

## Phase 4 — Lambda and IAM
- [x] Create initial Python Lambda handler
- [x] Package Lambda deployment artifact
- [x] Create IAM assume-role policy
- [x] Create Lambda execution role
- [x] Grant Lambda access to S3, DynamoDB, SNS, and CloudWatch Logs
- [x] Deploy Lambda with Terraform
- [x] Verify Lambda and IAM resources in AWS Console
- [x] Test Lambda successfully

## Phase 5 — API Gateway
- [x] Update Lambda to handle health endpoint
- [x] Rebuild Lambda deployment package
- [x] Create API Gateway HTTP API
- [x] Create Lambda integration
- [x] Create /health route
- [x] Create default stage
- [x] Grant API Gateway permission to invoke Lambda
- [x] Deploy API Gateway resources with Terraform
- [x] Test health endpoint successfully

## Phase 6 — Core API Functionality
- [x] Implement POST /upload-url
- [x] Implement GET /submissions
- [x] Implement PATCH /submissions/{submission_id}/status
- [x] Generate pre-signed S3 upload URLs
- [x] Store submission metadata in DynamoDB
- [x] Publish SNS notifications on new submission
- [x] Add API Gateway routes for core endpoints
- [x] Test upload URL generation
- [x] Test direct S3 upload
- [x] Test submission retrieval
- [x] Test submission status update

