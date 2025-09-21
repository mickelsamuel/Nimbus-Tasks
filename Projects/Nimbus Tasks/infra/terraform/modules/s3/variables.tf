variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "enable_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Enable deletion protection for the bucket"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch logs retention period in days"
  type        = number
  default     = 7
}

variable "notification_topic_arn" {
  description = "SNS topic ARN for S3 notifications"
  type        = string
  default     = null
}

variable "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN for bucket policy"
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