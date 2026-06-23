# MVP Scope

## Included
- Supplier login with Amazon Cognito
- Reviewer login with Amazon Cognito
- Secure document upload using pre-signed S3 URLs
- Metadata storage in DynamoDB
- Reviewer ability to view submissions
- Reviewer ability to update submission status
- SNS email notification on new submission
- Infrastructure provisioned with Terraform

## Excluded from MVP
- WAF
- Route 53 custom domain
- CloudFront (can be added later)
- Admin dashboard
- Multi-region deployment
- SQS buffering
- SES templated emails
- OCR / AI document processing
- ERP integration