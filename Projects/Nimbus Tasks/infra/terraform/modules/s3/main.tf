# S3 Bucket for file uploads and assets
resource "aws_s3_bucket" "assets" {
  bucket        = "${var.name_prefix}-assets-${random_string.bucket_suffix.result}"
  force_destroy = !var.deletion_protection

  tags = var.tags
}

# Versioning
resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Disabled"
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# Public access block (block all public access)
resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CORS configuration for web uploads
resource "aws_s3_bucket_cors_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag", "x-amz-meta-custom-header"]
    max_age_seconds = 3000
  }
}

# Lifecycle configuration
resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    id     = "assets_lifecycle"
    status = "Enabled"

    # Delete incomplete multipart uploads after 7 days
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }

    # Transition to IA after 30 days
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    # Transition to Glacier after 90 days
    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    # Delete old versions after 365 days
    noncurrent_version_expiration {
      noncurrent_days = 365
    }

    # Delete expired delete markers
    expiration {
      expired_object_delete_marker = true
    }
  }
}

# Notification configuration for processing
resource "aws_s3_bucket_notification" "assets" {
  count  = var.notification_topic_arn != null ? 1 : 0
  bucket = aws_s3_bucket.assets.id

  topic {
    topic_arn = var.notification_topic_arn
    events    = ["s3:ObjectCreated:*", "s3:ObjectRemoved:*"]
  }
}

# CloudWatch metrics
resource "aws_s3_bucket_metric" "assets" {
  bucket = aws_s3_bucket.assets.id
  name   = "assets-metrics"

  filter {
    prefix = "uploads/"
  }
}

# Intelligent tiering for cost optimization
resource "aws_s3_bucket_intelligent_tiering_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  name   = "assets-intelligent-tiering"

  filter {
    prefix = "uploads/"
  }

  tiering {
    access_tier = "ARCHIVE_ACCESS"
    days        = 90
  }

  tiering {
    access_tier = "DEEP_ARCHIVE_ACCESS"
    days        = 180
  }
}

# CloudWatch log group for S3 access logs
resource "aws_cloudwatch_log_group" "s3_access" {
  name              = "/aws/s3/${var.name_prefix}/access-logs"
  retention_in_days = var.log_retention_days

  tags = var.tags
}

# Random string for unique bucket names
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Data source for bucket policy
data "aws_iam_policy_document" "bucket_policy" {
  # Allow CloudFront OAC access
  statement {
    sid    = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.assets.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [var.cloudfront_distribution_arn]
    }
  }

  # Deny insecure connections
  statement {
    sid    = "DenyInsecureConnections"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:*"
    ]

    resources = [
      aws_s3_bucket.assets.arn,
      "${aws_s3_bucket.assets.arn}/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

# Apply bucket policy
resource "aws_s3_bucket_policy" "assets" {
  bucket = aws_s3_bucket.assets.id
  policy = data.aws_iam_policy_document.bucket_policy.json
}

# CloudWatch alarms
resource "aws_cloudwatch_metric_alarm" "s3_errors" {
  alarm_name          = "${var.name_prefix}-s3-4xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4xxErrors"
  namespace           = "AWS/S3"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors S3 4xx errors"
  alarm_actions       = var.alarm_actions

  dimensions = {
    BucketName = aws_s3_bucket.assets.id
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "s3_requests" {
  alarm_name          = "${var.name_prefix}-s3-high-requests"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "AllRequests"
  namespace           = "AWS/S3"
  period              = "300"
  statistic           = "Sum"
  threshold           = "1000"
  alarm_description   = "This metric monitors S3 request count"
  alarm_actions       = var.alarm_actions

  dimensions = {
    BucketName = aws_s3_bucket.assets.id
  }

  tags = var.tags
}