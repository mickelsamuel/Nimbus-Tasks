# Nimbus Tasks Infrastructure

This directory contains the Terraform infrastructure code for deploying Nimbus Tasks to AWS.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           Internet                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
            ┌─────────────────────┐
            │    CloudFront CDN   │
            │   (Static Assets)   │
            └─────────────────────┘
                      │
                      ▼
            ┌─────────────────────┐
            │        ALB          │
            │  (Load Balancer)    │
            └─────────────────────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │   ECS   │ │   ECS   │ │   ECS   │
    │ Fargate │ │ Fargate │ │ Fargate │
    │ Task 1  │ │ Task 2  │ │ Task N  │
    └─────────┘ └─────────┘ └─────────┘
          │           │           │
          └───────────┼───────────┘
                      │
                      ▼
    ┌─────────────────────────────────────┐
    │              VPC                    │
    │  ┌─────────────┐  ┌─────────────┐   │
    │  │   Private   │  │   Private   │   │
    │  │  Subnet 1   │  │  Subnet 2   │   │
    │  │             │  │             │   │
    │  │ ┌─────────┐ │  │ ┌─────────┐ │   │
    │  │ │   RDS   │ │  │ │  Redis  │ │   │
    │  │ │Postgres │ │  │ │ElastiC. │ │   │
    │  │ └─────────┘ │  │ └─────────┘ │   │
    │  └─────────────┘  └─────────────┘   │
    └─────────────────────────────────────┘
                      │
                      ▼
            ┌─────────────────────┐
            │         S3          │
            │ (File Uploads)      │
            └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** 1.6+ installed
3. **Docker** for building images
4. **pnpm** for Node.js package management

### Initial Setup

1. **Clone and navigate to infrastructure directory**:
   ```bash
   cd infra/terraform
   ```

2. **Copy and configure variables**:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your specific values
   ```

3. **Initialize Terraform**:
   ```bash
   terraform init
   ```

4. **Plan the deployment**:
   ```bash
   terraform plan
   ```

5. **Apply the infrastructure**:
   ```bash
   terraform apply
   ```

## 📁 File Structure

```
infra/terraform/
├── main.tf                 # Main infrastructure configuration
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── terraform.tfvars.example # Example configuration
├── rds.tf                  # Database configuration
├── ecs.tf                  # Container service configuration
├── alb.tf                  # Load balancer configuration
├── s3.tf                   # Storage configuration
├── redis.tf                # Redis cache configuration
└── secrets.tf              # Secrets management
```

## 🔧 Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `project_name` | Project name | `nimbus-tasks` |
| `environment` | Environment name | `prod` |
| `aws_region` | AWS region | `us-east-1` |
| `app_image` | Docker image URL | `123456789012.dkr.ecr.us-east-1.amazonaws.com/nimbus-tasks:latest` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `app_count` | Number of ECS tasks | `2` |
| `fargate_cpu` | CPU units for Fargate | `512` |
| `fargate_memory` | Memory for Fargate | `1024` |
| `db_instance_class` | RDS instance class | `db.t3.micro` |
| `redis_node_type` | ElastiCache node type | `cache.t3.micro` |

## 🏃‍♂️ Deployment Process

### 1. Build and Push Docker Image

```bash
# From project root
docker build -t nimbus-tasks:latest .

# Tag for ECR
docker tag nimbus-tasks:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/nimbus-tasks:latest

# Push to ECR
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/nimbus-tasks:latest
```

### 2. Update Infrastructure

```bash
cd infra/terraform
terraform apply -var="app_image=YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/nimbus-tasks:latest"
```

### 3. Deploy New Version

The GitHub Actions workflow automatically:
1. Builds the Docker image
2. Pushes to ECR
3. Updates the ECS service
4. Runs database migrations
5. Performs health checks

## 🔐 Security

### Network Security
- All resources are deployed in private subnets
- ALB provides the only public entry point
- Security groups restrict traffic between services

### Data Security
- RDS encryption at rest enabled
- Redis encryption in transit enabled
- Secrets stored in AWS Secrets Manager
- S3 buckets have public access blocked

### Application Security
- Container runs as non-root user
- Security headers applied via middleware
- Input validation on all endpoints
- Rate limiting enabled

## 📊 Monitoring

### CloudWatch Logs
- ECS tasks log to CloudWatch
- Log retention: 30 days
- Structured logging with request IDs

### Metrics
- ECS service metrics
- RDS performance insights
- ALB access logs
- Custom application metrics

### Alerts
Configure CloudWatch alarms for:
- High CPU/memory usage
- Database connection errors
- 5xx error rates
- Response time thresholds

## 💰 Cost Optimization

### Current Costs (estimated monthly)

| Service | Configuration | Estimated Cost |
|---------|---------------|----------------|
| ECS Fargate | 2 tasks, 0.5 vCPU, 1GB | $25 |
| RDS | db.t3.micro | $15 |
| ElastiCache | cache.t3.micro | $15 |
| ALB | Standard load balancer | $20 |
| S3 | Storage and requests | $5-20 |
| **Total** | | **~$80-95/month** |

### Cost Optimization Tips

1. **Right-size instances**: Monitor utilization and adjust
2. **Use Reserved Instances**: For predictable workloads
3. **Enable S3 lifecycle policies**: Archive old files
4. **Optimize images**: Use multi-stage builds
5. **Monitor data transfer**: Consider CloudFront for static assets

## 🚨 Troubleshooting

### Common Issues

#### ECS Tasks Not Starting
```bash
# Check ECS service events
aws ecs describe-services --cluster nimbus-tasks-prod --services nimbus-tasks-prod-service

# Check task logs
aws logs get-log-events --log-group-name /ecs/nimbus-tasks-prod
```

#### Database Connection Issues
```bash
# Check RDS status
aws rds describe-db-instances --db-instance-identifier nimbus-tasks-prod

# Test connectivity from ECS
aws ecs execute-command --cluster nimbus-tasks-prod --task TASK_ID --container nimbus-tasks-app --interactive --command "/bin/sh"
```

#### High Response Times
```bash
# Check ALB metrics
aws cloudwatch get-metric-statistics --namespace AWS/ApplicationELB --metric-name TargetResponseTime

# Check ECS metrics
aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name CPUUtilization
```

## 🔄 Maintenance

### Regular Tasks

1. **Update dependencies**: Monthly security patches
2. **Rotate secrets**: Quarterly or when compromised
3. **Review logs**: Weekly for errors and patterns
4. **Backup verification**: Monthly restore tests
5. **Cost review**: Monthly spending analysis

### Backup Strategy

- **RDS**: Automated backups (7 days retention)
- **S3**: Versioning enabled
- **Secrets**: Backup to secure location
- **Infrastructure**: Terraform state in S3

## 🆘 Emergency Procedures

### Rollback Deployment
```bash
# Revert to previous image
terraform apply -var="app_image=PREVIOUS_IMAGE_URI"

# Or use AWS Console to update ECS service
```

### Scale Up Quickly
```bash
# Increase task count
terraform apply -var="app_count=5"

# Or use AWS CLI
aws ecs update-service --cluster nimbus-tasks-prod --service nimbus-tasks-prod-service --desired-count 5
```

### Database Recovery
```bash
# Restore from backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier nimbus-tasks-prod-restored \
  --db-snapshot-identifier SNAPSHOT_ID
```

## 📞 Support Contacts

- **Infrastructure Team**: devops@company.com
- **AWS Support**: Enterprise Support Plan
- **Emergency Hotline**: +1-XXX-XXX-XXXX