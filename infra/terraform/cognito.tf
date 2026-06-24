resource "aws_cognito_user_pool" "main" {
  name = "${local.name_prefix}-user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-user-pool"
  })
}

resource "aws_cognito_user_pool_client" "frontend" {
  name         = "${local.name_prefix}-frontend-client"
  user_pool_id = aws_cognito_user_pool.main.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  generate_secret = false

  prevent_user_existence_errors = "ENABLED"
}

resource "aws_cognito_user_group" "supplier" {
  name         = "supplier"
  user_pool_id = aws_cognito_user_pool.main.id
  description  = "Suppliers can upload documents and view their own submissions"
}

resource "aws_cognito_user_group" "reviewer" {
  name         = "reviewer"
  user_pool_id = aws_cognito_user_pool.main.id
  description  = "Reviewers can view all submissions and update statuses"
}

