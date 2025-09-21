# S3 Bucket for Synthetics artifacts
resource "aws_s3_bucket" "synthetics" {
  bucket        = "${var.name_prefix}-synthetics-${random_string.bucket_suffix.result}"
  force_destroy = true

  tags = var.tags
}

resource "aws_s3_bucket_public_access_block" "synthetics" {
  bucket = aws_s3_bucket.synthetics.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "synthetics" {
  bucket = aws_s3_bucket.synthetics.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# IAM Role for Synthetics
resource "aws_iam_role" "synthetics" {
  name = "${var.name_prefix}-synthetics-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "synthetics_execution" {
  role       = aws_iam_role.synthetics.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchSyntheticsExecutionRolePolicy"
}

resource "aws_iam_role_policy" "synthetics_s3" {
  name = "${var.name_prefix}-synthetics-s3"
  role = aws_iam_role.synthetics.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.synthetics.arn,
          "${aws_s3_bucket.synthetics.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
      }
    ]
  })
}

# Health Check Canary
resource "aws_synthetics_canary" "health_check" {
  name                 = "${var.name_prefix}-health-check"
  artifact_s3_location = "s3://${aws_s3_bucket.synthetics.bucket}/health-check/"
  execution_role_arn   = aws_iam_role.synthetics.arn
  handler              = "apiCanaryBlueprint.handler"
  zip_file             = data.archive_file.health_check_canary.output_path
  runtime_version      = "syn-nodejs-puppeteer-6.2"

  schedule {
    expression                = var.health_check_schedule
    duration_in_seconds       = 0
  }

  run_config {
    timeout_in_seconds    = 60
    memory_in_mb         = 960
    active_tracing       = true

    environment_variables = {
      HEALTH_CHECK_URL = var.health_check_url
    }
  }

  failure_retention_period = 30
  success_retention_period = 2

  tags = var.tags
}

# API Endpoint Canary
resource "aws_synthetics_canary" "api_endpoints" {
  name                 = "${var.name_prefix}-api-endpoints"
  artifact_s3_location = "s3://${aws_s3_bucket.synthetics.bucket}/api-endpoints/"
  execution_role_arn   = aws_iam_role.synthetics.arn
  handler              = "apiCanaryBlueprint.handler"
  zip_file             = data.archive_file.api_endpoints_canary.output_path
  runtime_version      = "syn-nodejs-puppeteer-6.2"

  schedule {
    expression                = var.api_check_schedule
    duration_in_seconds       = 0
  }

  run_config {
    timeout_in_seconds    = 120
    memory_in_mb         = 960
    active_tracing       = true

    environment_variables = {
      API_BASE_URL = var.api_base_url
      API_KEY      = var.api_key
    }
  }

  failure_retention_period = 30
  success_retention_period = 2

  tags = var.tags
}

# User Journey Canary
resource "aws_synthetics_canary" "user_journey" {
  name                 = "${var.name_prefix}-user-journey"
  artifact_s3_location = "s3://${aws_s3_bucket.synthetics.bucket}/user-journey/"
  execution_role_arn   = aws_iam_role.synthetics.arn
  handler              = "pageLoadBlueprint.handler"
  zip_file             = data.archive_file.user_journey_canary.output_path
  runtime_version      = "syn-nodejs-puppeteer-6.2"

  schedule {
    expression                = var.user_journey_schedule
    duration_in_seconds       = 0
  }

  run_config {
    timeout_in_seconds    = 300
    memory_in_mb         = 960
    active_tracing       = true

    environment_variables = {
      BASE_URL = var.app_url
    }
  }

  failure_retention_period = 30
  success_retention_period = 2

  tags = var.tags
}

# Canary scripts
data "archive_file" "health_check_canary" {
  type        = "zip"
  output_path = "/tmp/health_check_canary.zip"
  source {
    content = templatefile("${path.module}/scripts/health_check.js", {
      health_check_url = var.health_check_url
    })
    filename = "nodejs/node_modules/apiCanaryBlueprint.js"
  }
}

data "archive_file" "api_endpoints_canary" {
  type        = "zip"
  output_path = "/tmp/api_endpoints_canary.zip"
  source {
    content = templatefile("${path.module}/scripts/api_endpoints.js", {
      api_base_url = var.api_base_url
    })
    filename = "nodejs/node_modules/apiCanaryBlueprint.js"
  }
}

data "archive_file" "user_journey_canary" {
  type        = "zip"
  output_path = "/tmp/user_journey_canary.zip"
  source {
    content = templatefile("${path.module}/scripts/user_journey.js", {
      app_url = var.app_url
    })
    filename = "nodejs/node_modules/pageLoadBlueprint.js"
  }
}

# CloudWatch Alarms for Canaries
resource "aws_cloudwatch_metric_alarm" "health_check_failures" {
  alarm_name          = "${var.name_prefix}-health-check-failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Failed"
  namespace           = "CloudWatchSynthetics"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "Health check canary failures"
  alarm_actions       = var.alarm_actions

  dimensions = {
    CanaryName = aws_synthetics_canary.health_check.name
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "api_endpoint_failures" {
  alarm_name          = "${var.name_prefix}-api-endpoint-failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Failed"
  namespace           = "CloudWatchSynthetics"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "API endpoint canary failures"
  alarm_actions       = var.alarm_actions

  dimensions = {
    CanaryName = aws_synthetics_canary.api_endpoints.name
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "user_journey_failures" {
  alarm_name          = "${var.name_prefix}-user-journey-failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Failed"
  namespace           = "CloudWatchSynthetics"
  period              = "300"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "User journey canary failures"
  alarm_actions       = var.alarm_actions

  dimensions = {
    CanaryName = aws_synthetics_canary.user_journey.name
  }

  tags = var.tags
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.name_prefix}-monitoring"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", var.alb_arn_suffix],
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", var.alb_arn_suffix],
            ["AWS/ApplicationELB", "HTTPCode_Target_2XX_Count", "LoadBalancer", var.alb_arn_suffix],
            ["AWS/ApplicationELB", "HTTPCode_Target_4XX_Count", "LoadBalancer", var.alb_arn_suffix],
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", var.alb_arn_suffix]
          ]
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          title   = "Application Load Balancer Metrics"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", var.ecs_service_name, "ClusterName", var.ecs_cluster_name],
            ["AWS/ECS", "MemoryUtilization", "ServiceName", var.ecs_service_name, "ClusterName", var.ecs_cluster_name],
            ["AWS/ECS", "RunningTaskCount", "ServiceName", var.ecs_service_name, "ClusterName", var.ecs_cluster_name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          title   = "ECS Service Metrics"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 8
        height = 6

        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", var.rds_instance_id],
            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", var.rds_instance_id],
            ["AWS/RDS", "FreeableMemory", "DBInstanceIdentifier", var.rds_instance_id]
          ]
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          title   = "RDS Metrics"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 8
        y      = 6
        width  = 8
        height = 6

        properties = {
          metrics = [
            ["AWS/ElastiCache", "CPUUtilization", "CacheClusterId", var.redis_cluster_id],
            ["AWS/ElastiCache", "DatabaseMemoryUsagePercentage", "CacheClusterId", var.redis_cluster_id],
            ["AWS/ElastiCache", "CurrConnections", "CacheClusterId", var.redis_cluster_id]
          ]
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          title   = "ElastiCache Metrics"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 16
        y      = 6
        width  = 8
        height = 6

        properties = {
          metrics = [
            ["CloudWatchSynthetics", "SuccessPercent", "CanaryName", aws_synthetics_canary.health_check.name],
            ["CloudWatchSynthetics", "SuccessPercent", "CanaryName", aws_synthetics_canary.api_endpoints.name],
            ["CloudWatchSynthetics", "SuccessPercent", "CanaryName", aws_synthetics_canary.user_journey.name]
          ]
          view    = "timeSeries"
          stacked = false
          region  = data.aws_region.current.name
          title   = "Synthetics Success Rate"
          period  = 300
        }
      }
    ]
  })
}

# Random string for unique bucket names
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Data sources
data "aws_region" "current" {}