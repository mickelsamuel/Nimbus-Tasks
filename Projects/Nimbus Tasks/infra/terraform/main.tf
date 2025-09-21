terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }

  backend "s3" {
    # Backend configuration should be provided via backend config file
    # or terraform init -backend-config
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "nimbus-tasks"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# Generate random password for RDS
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Local values
locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  # Network configuration
  vpc_cidr = "10.0.0.0/16"

  availability_zones = slice(data.aws_availability_zones.available.names, 0, 3)

  # Public subnets for ALB and NAT Gateways
  public_subnet_cidrs = [
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24"
  ]

  # Private subnets for ECS tasks, RDS, ElastiCache
  private_subnet_cidrs = [
    "10.0.11.0/24",
    "10.0.12.0/24",
    "10.0.13.0/24"
  ]

  # Database subnets
  database_subnet_cidrs = [
    "10.0.21.0/24",
    "10.0.22.0/24",
    "10.0.23.0/24"
  ]
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  name_prefix              = local.name_prefix
  vpc_cidr                = local.vpc_cidr
  availability_zones      = local.availability_zones
  public_subnet_cidrs     = local.public_subnet_cidrs
  private_subnet_cidrs    = local.private_subnet_cidrs
  database_subnet_cidrs   = local.database_subnet_cidrs

  tags = local.common_tags
}

# Security Groups Module
module "security_groups" {
  source = "./modules/security"

  name_prefix = local.name_prefix
  vpc_id      = module.vpc.vpc_id

  tags = local.common_tags
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  name_prefix           = local.name_prefix
  db_password          = random_password.db_password.result
  subnet_group_name    = module.vpc.database_subnet_group_name
  security_group_ids   = [module.security_groups.rds_security_group_id]

  tags = local.common_tags
}

# ElastiCache Module
module "elasticache" {
  source = "./modules/elasticache"

  name_prefix           = local.name_prefix
  subnet_group_name     = module.vpc.elasticache_subnet_group_name
  security_group_ids    = [module.security_groups.elasticache_security_group_id]

  tags = local.common_tags
}

# S3 Module
module "s3" {
  source = "./modules/s3"

  name_prefix = local.name_prefix

  tags = local.common_tags
}

# CloudFront Module
module "cloudfront" {
  source = "./modules/cloudfront"

  name_prefix           = local.name_prefix
  s3_bucket_id         = module.s3.assets_bucket_id
  s3_bucket_domain     = module.s3.assets_bucket_domain_name
  origin_access_identity_path = module.s3.origin_access_identity_path

  tags = local.common_tags
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"

  name_prefix                 = local.name_prefix
  vpc_id                      = module.vpc.vpc_id
  public_subnet_ids           = module.vpc.public_subnet_ids
  private_subnet_ids          = module.vpc.private_subnet_ids
  alb_security_group_id       = module.security_groups.alb_security_group_id
  ecs_security_group_id       = module.security_groups.ecs_security_group_id

  # Environment variables for the app
  database_url                = module.rds.connection_string
  redis_url                   = module.elasticache.redis_connection_string
  s3_bucket_name             = module.s3.assets_bucket_id
  cloudfront_distribution_id  = module.cloudfront.distribution_id
  cloudfront_domain          = module.cloudfront.domain_name

  # Application configuration
  app_port                   = var.app_port
  app_image                  = var.app_image
  app_count                  = var.app_count
  app_cpu                    = var.app_cpu
  app_memory                 = var.app_memory

  tags = local.common_tags
}

# Secrets Manager
module "secrets" {
  source = "./modules/secrets"

  name_prefix   = local.name_prefix
  database_url  = module.rds.connection_string
  redis_url     = module.elasticache.redis_connection_string

  tags = local.common_tags
}

# Monitoring Module
module "monitoring" {
  source = "./modules/monitoring"

  name_prefix            = local.name_prefix
  app_domain             = module.ecs.app_domain
  ecs_cluster_name       = module.ecs.cluster_name
  ecs_service_name       = module.ecs.service_name

  tags = local.common_tags
}