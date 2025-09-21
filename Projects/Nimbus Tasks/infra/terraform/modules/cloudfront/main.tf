# CloudFront Origin Access Control for S3
resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.name_prefix}-s3-oac"
  description                       = "OAC for S3 bucket access"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  comment             = "${var.name_prefix} CDN"
  default_root_object = "index.html"
  enabled             = true
  http_version        = "http2and3"
  is_ipv6_enabled     = true
  price_class         = var.price_class
  retain_on_delete    = false
  wait_for_deployment = var.wait_for_deployment

  # S3 Origin for static assets
  origin {
    domain_name              = var.s3_bucket_domain_name
    origin_id                = "S3-${var.s3_bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id

    custom_header {
      name  = "X-Custom-Header"
      value = var.name_prefix
    }
  }

  # ALB Origin for API and SSR
  origin {
    domain_name = var.alb_dns_name
    origin_id   = "ALB-${var.name_prefix}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "X-Forwarded-Host"
      value = var.domain_name != null ? var.domain_name : "${var.name_prefix}.example.com"
    }
  }

  # Default cache behavior for API/SSR
  default_cache_behavior {
    target_origin_id       = "ALB-${var.name_prefix}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "CloudFront-Forwarded-Proto", "Host", "User-Agent", "X-Forwarded-For"]

      cookies {
        forward = "all"
      }
    }

    # Short TTL for dynamic content
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 86400

    # Security headers
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Cache behavior for static assets
  ordered_cache_behavior {
    path_pattern           = "/assets/*"
    target_origin_id       = "S3-${var.s3_bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]

      cookies {
        forward = "none"
      }
    }

    # Long TTL for static assets
    min_ttl     = 0
    default_ttl = 86400    # 1 day
    max_ttl     = 31536000 # 1 year
  }

  # Cache behavior for API endpoints
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "ALB-${var.name_prefix}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }

    # No caching for API
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0

    # Apply cache policy for API
    cache_policy_id = aws_cloudfront_cache_policy.api.id
  }

  # Geographic restrictions
  restrictions {
    geo_restriction {
      restriction_type = var.geo_restriction_type
      locations        = var.geo_restriction_locations
    }
  }

  # SSL/TLS configuration
  viewer_certificate {
    acm_certificate_arn            = var.certificate_arn
    cloudfront_default_certificate = var.certificate_arn == null
    minimum_protocol_version       = "TLSv1.2_2021"
    ssl_support_method             = var.certificate_arn != null ? "sni-only" : null
  }

  # Custom domain aliases
  aliases = var.domain_name != null ? [var.domain_name] : []

  # Logging configuration
  logging_config {
    bucket          = var.logging_bucket
    include_cookies = false
    prefix          = "cloudfront-logs/"
  }

  # Custom error pages
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
    error_caching_min_ttl = 300
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
    error_caching_min_ttl = 300
  }

  # Security and performance settings
  web_acl_id = var.web_acl_id

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-cloudfront"
  })
}

# Response Headers Policy for Security
resource "aws_cloudfront_response_headers_policy" "security" {
  name    = "${var.name_prefix}-security-headers"
  comment = "Security headers for ${var.name_prefix}"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 63072000 # 2 years
      include_subdomains         = true
      preload                   = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }

  cors_config {
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["Authorization", "Content-Type", "X-Amz-Date", "X-Amz-Security-Token", "X-Api-Key"]
    }

    access_control_allow_methods {
      items = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"]
    }

    access_control_allow_origins {
      items = var.cors_allowed_origins
    }

    access_control_max_age_sec = 86400
    origin_override           = false
  }

  custom_headers_config {
    items {
      header   = "X-Content-Type-Options"
      value    = "nosniff"
      override = true
    }

    items {
      header   = "X-XSS-Protection"
      value    = "1; mode=block"
      override = true
    }

    items {
      header   = "Permissions-Policy"
      value    = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
      override = true
    }
  }
}

# Cache Policy for API endpoints
resource "aws_cloudfront_cache_policy" "api" {
  name        = "${var.name_prefix}-api-cache-policy"
  comment     = "Cache policy for API endpoints"
  default_ttl = 0
  max_ttl     = 0
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    query_strings_config {
      query_string_behavior = "all"
    }

    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Authorization", "Content-Type", "X-Forwarded-For", "User-Agent"]
      }
    }

    cookies_config {
      cookie_behavior = "all"
    }
  }
}

# CloudWatch Log Group for CloudFront logs
resource "aws_cloudwatch_log_group" "cloudfront" {
  name              = "/aws/cloudfront/${var.name_prefix}"
  retention_in_days = var.log_retention_days

  tags = var.tags
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "cloudfront_errors" {
  alarm_name          = "${var.name_prefix}-cloudfront-4xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors CloudFront 4xx error rate"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DistributionId = aws_cloudfront_distribution.main.id
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "cloudfront_cache_hit_rate" {
  alarm_name          = "${var.name_prefix}-cloudfront-low-cache-hit-rate"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "3"
  metric_name         = "CacheHitRate"
  namespace           = "AWS/CloudFront"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors CloudFront cache hit rate"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DistributionId = aws_cloudfront_distribution.main.id
  }

  tags = var.tags
}