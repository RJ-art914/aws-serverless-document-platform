# Functional Design

## User Roles

### Supplier
Can:
- Sign in
- Request an upload URL
- Upload a document
- View their own submissions and statuses

Cannot:
- View other suppliers' submissions
- Update review status

### Reviewer
Can:
- Sign in
- View all submissions
- Update submission status

Cannot:
- Upload supplier documents as part of the normal supplier workflow

## User Flows

### Supplier Flow
1. Supplier signs in through the frontend
2. Supplier selects a document and document type
3. Frontend requests a pre-signed upload URL from the backend API
4. Backend validates the supplier identity
5. Backend creates a submission record in DynamoDB
6. Backend returns a pre-signed S3 upload URL
7. Frontend uploads the file directly to S3
8. Backend sends an SNS notification to reviewers
9. Supplier can view their submission in the submissions list

### Reviewer Flow
1. Reviewer signs in through the frontend
2. Reviewer requests the list of submissions
3. Backend returns all submissions
4. Reviewer updates the status of a submission
5. Backend saves the new status in DynamoDB

## API Endpoints

### POST /upload-url
Purpose:
- Generate a pre-signed S3 upload URL
- Create a submission metadata record

Request body:
- file_name
- document_type

Allowed roles:
- Supplier

Response:
- submission_id
- upload_url
- s3_key

### GET /submissions
Purpose:
- Return submissions visible to the current user

Allowed roles:
- Supplier
- Reviewer

Behavior:
- Supplier sees only their own submissions
- Reviewer sees all submissions

### PATCH /submissions/{submission_id}/status
Purpose:
- Update the processing status of a submission

Request body:
- status

Allowed roles:
- Reviewer

## Submission Status Values

Allowed values:
- Received
- Under Review
- Approved
- Rejected


## DynamoDB Data Model

### Table Name
submissions

### Primary Key
- submission_id (string)

### Attributes
- submission_id
- supplier_id
- supplier_email
- document_type
- file_name
- s3_key
- upload_timestamp
- status

## Access Patterns
1. Supplier retrieves their own submissions
2. Reviewer retrieves all submissions
3. Reviewer updates a submission status
4. Backend retrieves a submission by submission_id


## Cognito Groups

### supplier
Permissions:
- Can call POST /upload-url
- Can call GET /submissions for their own records only

### reviewer
Permissions:
- Can call GET /submissions
- Can call PATCH /submissions/{submission_id}/status

## Backend Lambda Responsibilities

The backend Lambda function will:
- Read user identity and group claims from the API Gateway event
- Validate role-based access
- Generate pre-signed S3 upload URLs
- Create submission records in DynamoDB
- Retrieve submission records from DynamoDB
- Update submission status in DynamoDB
- Publish SNS notifications for new submissions

## Lambda Environment Variables

The API Lambda is expected to use:
- DOCUMENTS_BUCKET_NAME
- SUBMISSIONS_TABLE_NAME
- SNS_TOPIC_ARN
- AWS_REGION

