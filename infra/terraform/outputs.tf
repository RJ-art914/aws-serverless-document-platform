output "aws_region" {
  description = "AWS region in use"
  value       = var.aws_region
}

output "name_prefix" {
  description = "Common name prefix for resources"
  value       = local.name_prefix
}