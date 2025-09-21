variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "health_check_url" {
  description = "URL to monitor for health checks"
  type        = string
}

variable "api_base_url" {
  description = "Base URL for API endpoint monitoring"
  type        = string
}

variable "app_url" {
  description = "Application URL for user journey testing"
  type        = string
}

variable "api_key" {
  description = "API key for authenticated endpoint testing"
  type        = string
  default     = ""
  sensitive   = true
}

variable "health_check_schedule" {
  description = "Schedule expression for health check canary"
  type        = string
  default     = "rate(5 minutes)"
}

variable "api_check_schedule" {
  description = "Schedule expression for API endpoint canary"
  type        = string
  default     = "rate(10 minutes)"
}

variable "user_journey_schedule" {
  description = "Schedule expression for user journey canary"
  type        = string
  default     = "rate(30 minutes)"
}

variable "alb_arn_suffix" {
  description = "ALB ARN suffix for CloudWatch metrics"
  type        = string
}

variable "ecs_cluster_name" {
  description = "ECS cluster name for monitoring"
  type        = string
}

variable "ecs_service_name" {
  description = "ECS service name for monitoring"
  type        = string
}

variable "rds_instance_id" {
  description = "RDS instance ID for monitoring"
  type        = string
}

variable "redis_cluster_id" {
  description = "ElastiCache cluster ID for monitoring"
  type        = string
}

variable "alarm_actions" {
  description = "List of ARNs to notify when alarm goes to ALARM state"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}