# Project configuration
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "nimbus-tasks"
}

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either 'staging' or 'production'."
  }
}

# AWS configuration
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

# Application configuration
variable "app_image" {
  description = "Docker image for the application"
  type        = string
  default     = "nginx:latest" # Will be overridden in CI/CD
}

variable "app_port" {
  description = "Port the application listens on"
  type        = number
  default     = 3000
}

variable "app_count" {
  description = "Number of application instances"
  type        = number
  default     = 2
}

variable "app_cpu" {
  description = "CPU units for the application task"
  type        = number
  default     = 512
}

variable "app_memory" {
  description = "Memory in MB for the application task"
  type        = number
  default     = 1024
}

# Database configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS instance in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for RDS autoscaling in GB"
  type        = number
  default     = 100
}

# Cache configuration
variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes in the Redis cluster"
  type        = number
  default     = 1
}

# Monitoring configuration
variable "enable_detailed_monitoring" {
  description = "Enable detailed CloudWatch monitoring"
  type        = bool
  default     = true
}

variable "log_retention_in_days" {
  description = "CloudWatch logs retention period in days"
  type        = number
  default     = 7
}

# Security configuration
variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access the application"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Should be restricted in production
}

# Domain configuration (optional)
variable "domain_name" {
  description = "Custom domain name for the application"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "SSL certificate ARN for custom domain"
  type        = string
  default     = ""
}

# Feature flags
variable "enable_deletion_protection" {
  description = "Enable deletion protection for critical resources"
  type        = bool
  default     = true
}

variable "enable_backup" {
  description = "Enable automated backups"
  type        = bool
  default     = true
}

variable "backup_retention_period" {
  description = "Number of days to retain automated backups"
  type        = number
  default     = 7
}

# SES configuration
variable "ses_domain" {
  description = "Domain for SES email sending"
  type        = string
  default     = ""
}

variable "from_email" {
  description = "From email address for application emails"
  type        = string
  default     = "noreply@example.com"
}