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

output "cognito_domain" {
  description = "Cognito User Pool domain"
  value       = aws_cognito_user_pool_domain.main.domain
}

output "cognito_hosted_ui_base_url" {
  description = "Base URL for Cognito Hosted UI"
  value       = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "cognito_login_url" {
  description = "Hosted UI login URL for deployed frontend"
  value       = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com/login?client_id=${aws_cognito_user_pool_client.frontend.id}&response_type=token&scope=openid+email+profile&redirect_uri=https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cognito_logout_url" {
  description = "Hosted UI logout URL for deployed frontend"
  value       = "https://${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com/logout?client_id=${aws_cognito_user_pool_client.frontend.id}&logout_uri=https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "frontend_bucket_name" {
  description = "Name of the frontend hosting bucket"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_website_url" {
  description = "S3 static website URL for the frontend"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "frontend_cloudfront_domain_name" {
  description = "CloudFront domain name for the frontend"
  value       = aws_cloudfront_distribution.frontend.domain_name
}