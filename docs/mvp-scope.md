# MVP Scope

## Goal
Build a working serverless AWS application that allows external suppliers to upload documents securely and internal reviewers to review and update submission statuses.

## Included in MVP
- Supplier authentication with Amazon Cognito
- Reviewer authentication with Amazon Cognito
- Supplier document upload using pre-signed Amazon S3 URLs
- Metadata storage in Amazon DynamoDB
- Supplier ability to view their own submissions
- Reviewer ability to view all submissions
- Reviewer ability to update submission status
- SNS email notification when a new document is submitted
- Infrastructure provisioned with Terraform
- Basic logging with Amazon CloudWatch

## Excluded from MVP
- WAF
- Route 53 custom domain
- CloudFront
- Administrator dashboard
- Multi-region deployment
- SQS buffering
- SES templated emails
- OCR / AI document processing
- ERP integration
- Full CI/CD pipeline
- Advanced monitoring dashboards

## MVP Success Criteria
The MVP is complete when:
1. A supplier can log in
2. A supplier can request an upload URL
3. A supplier can upload a document to S3
4. Metadata is stored in DynamoDB
5. An SNS email notification is sent
6. A reviewer can log in
7. A reviewer can see submissions
8. A reviewer can update a submission status
9. Infrastructure can be deployed with Terraform