variable "aws_region" {
  description = "AWS region for the project"
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Short project name used in resource naming"
  type        = string
  default     = "doc-platform"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}