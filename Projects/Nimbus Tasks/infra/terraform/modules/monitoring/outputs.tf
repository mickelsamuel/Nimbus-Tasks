output "synthetics_bucket_name" {
  description = "S3 bucket name for Synthetics artifacts"
  value       = aws_s3_bucket.synthetics.id
}

output "synthetics_role_arn" {
  description = "IAM role ARN for Synthetics canaries"
  value       = aws_iam_role.synthetics.arn
}

output "health_check_canary_name" {
  description = "Health check canary name"
  value       = aws_synthetics_canary.health_check.name
}

output "health_check_canary_arn" {
  description = "Health check canary ARN"
  value       = aws_synthetics_canary.health_check.arn
}

output "api_endpoints_canary_name" {
  description = "API endpoints canary name"
  value       = aws_synthetics_canary.api_endpoints.name
}

output "api_endpoints_canary_arn" {
  description = "API endpoints canary ARN"
  value       = aws_synthetics_canary.api_endpoints.arn
}

output "user_journey_canary_name" {
  description = "User journey canary name"
  value       = aws_synthetics_canary.user_journey.name
}

output "user_journey_canary_arn" {
  description = "User journey canary ARN"
  value       = aws_synthetics_canary.user_journey.arn
}

output "dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=${data.aws_region.current.name}#dashboards:name=${aws_cloudwatch_dashboard.main.dashboard_name}"
}

output "dashboard_name" {
  description = "CloudWatch dashboard name"
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}