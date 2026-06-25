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

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.frontend.id
}

output "lambda_function_name" {
  description = "Name of the API Lambda function"
  value       = aws_lambda_function.api.function_name
}

output "lambda_function_arn" {
  description = "ARN of the API Lambda function"
  value       = aws_lambda_function.api.arn
}

output "api_gateway_url" {
  description = "Base URL of the HTTP API"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}

output "health_endpoint_url" {
  description = "Health check endpoint URL"
  value       = "${aws_apigatewayv2_api.http_api.api_endpoint}/health"
}

