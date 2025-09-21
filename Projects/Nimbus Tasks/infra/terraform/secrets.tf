# Application Secrets
# NextAuth Secret
resource "random_password" "nextauth_secret" {
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "nextauth_secret" {
  name        = "${var.project_name}-${var.environment}-nextauth-secret"
  description = "NextAuth secret for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.project_name}-${var.environment}-nextauth-secret"
  }
}

resource "aws_secretsmanager_secret_version" "nextauth_secret" {
  secret_id     = aws_secretsmanager_secret.nextauth_secret.id
  secret_string = random_password.nextauth_secret.result
}

# Database URL
resource "aws_secretsmanager_secret" "database_url" {
  name        = "${var.project_name}-${var.environment}-database-url"
  description = "Database URL for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.project_name}-${var.environment}-database-url"
  }
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id = aws_secretsmanager_secret.database_url.id
  secret_string = "postgresql://${var.db_username}:${random_password.db_password.result}@${aws_db_instance.main.endpoint}/${var.db_name}?schema=public"

  depends_on = [aws_db_instance.main]
}

# Google OAuth Secrets (optional)
resource "aws_secretsmanager_secret" "google_client_id" {
  name        = "${var.project_name}-${var.environment}-google-client-id"
  description = "Google OAuth Client ID for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.project_name}-${var.environment}-google-client-id"
  }
}

resource "aws_secretsmanager_secret" "google_client_secret" {
  name        = "${var.project_name}-${var.environment}-google-client-secret"
  description = "Google OAuth Client Secret for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.project_name}-${var.environment}-google-client-secret"
  }
}

# Sentry DSN (for error tracking)
resource "aws_secretsmanager_secret" "sentry_dsn" {
  name        = "${var.project_name}-${var.environment}-sentry-dsn"
  description = "Sentry DSN for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.project_name}-${var.environment}-sentry-dsn"
  }
}

# Honeycomb API Key (for observability)
resource "aws_secretsmanager_secret" "honeycomb_api_key" {
  name        = "${var.project_name}-${var.environment}-honeycomb-api-key"
  description = "Honeycomb API Key for ${var.project_name} ${var.environment}"

  tags = {
    Name = "${var.project_name}-${var.environment}-honeycomb-api-key"
  }
}