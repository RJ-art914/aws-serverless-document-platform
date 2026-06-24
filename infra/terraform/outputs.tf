output "aws_region" {
  description = "AWS region in use"
  value       = var.aws_region
}

output "name_prefix" {
  description = "Common name prefix for resources"
  value       = local.name_prefix
}

output "documents_bucket_name" {
  description = "Name of the S3 bucket for uploaded documents"
  value       = aws_s3_bucket.documents.bucket
}

output "submissions_table_name" {
  description = "Name of the DynamoDB table for submission metadata"
  value       = aws_dynamodb_table.submissions.name
}

output "notifications_topic_arn" {
  description = "ARN of the SNS notifications topic"
  value       = aws_sns_topic.notifications.arn
}