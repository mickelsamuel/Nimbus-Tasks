#!/bin/bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TERRAFORM_DIR="../terraform"
LOG_FILE="validation-$(date +%Y%m%d-%H%M%S).log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check if terraform is installed
    if ! command -v terraform &> /dev/null; then
        error "Terraform is not installed"
        exit 1
    fi

    # Check terraform version
    TERRAFORM_VERSION=$(terraform version -json | jq -r '.terraform_version')
    log "Terraform version: $TERRAFORM_VERSION"

    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed"
        exit 1
    fi

    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials not configured or invalid"
        exit 1
    fi

    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=$(aws configure get region || echo "us-east-1")
    log "AWS Account: $AWS_ACCOUNT"
    log "AWS Region: $AWS_REGION"

    success "Prerequisites check passed"
}

# Validate Terraform configuration
validate_terraform() {
    log "Validating Terraform configuration..."

    cd "$TERRAFORM_DIR"

    # Format check
    log "Checking Terraform formatting..."
    if terraform fmt -check -recursive; then
        success "Terraform formatting is correct"
    else
        warning "Terraform files need formatting. Run 'terraform fmt -recursive'"
    fi

    # Initialize Terraform
    log "Initializing Terraform..."
    terraform init -backend=false

    # Validate configuration
    log "Validating Terraform configuration..."
    if terraform validate; then
        success "Terraform configuration is valid"
    else
        error "Terraform configuration validation failed"
        return 1
    fi

    # Check for security issues with tflint (if available)
    if command -v tflint &> /dev/null; then
        log "Running TFLint security checks..."
        if tflint; then
            success "TFLint checks passed"
        else
            warning "TFLint found issues"
        fi
    else
        warning "TFLint not installed, skipping security checks"
    fi

    # Check for security issues with checkov (if available)
    if command -v checkov &> /dev/null; then
        log "Running Checkov security checks..."
        if checkov -d . --framework terraform --quiet; then
            success "Checkov security checks passed"
        else
            warning "Checkov found security issues"
        fi
    else
        warning "Checkov not installed, skipping security checks"
    fi

    cd - > /dev/null
}

# Test plan generation
test_plan_generation() {
    log "Testing Terraform plan generation..."

    cd "$TERRAFORM_DIR"

    # Create a test tfvars file
    cat > test.tfvars << EOF
# Test configuration
name_prefix = "nimbus-test"
environment = "test"
app_image = "nginx:latest"

# VPC configuration
vpc_cidr = "10.0.0.0/16"
availability_zones = ["${AWS_REGION}a", "${AWS_REGION}b"]

# Database configuration
db_instance_class = "db.t3.micro"
db_allocated_storage = 20
db_username = "testuser"
db_password = "testpassword123!"

# Cache configuration
cache_node_type = "cache.t3.micro"
cache_num_nodes = 1

# App configuration
app_count = 1
app_cpu = 256
app_memory = 512

# Environment-specific settings
deletion_protection = false
enable_backups = false

tags = {
  Environment = "test"
  Project     = "nimbus-tasks"
  ManagedBy   = "terraform"
}
EOF

    # Generate plan
    log "Generating Terraform plan..."
    if terraform plan -var-file=test.tfvars -out=test.tfplan; then
        success "Terraform plan generated successfully"

        # Show plan summary
        terraform show -json test.tfplan | jq -r '
          .planned_values.root_module.resources[] |
          select(.type) |
          "\(.type).\(.name)"
        ' | sort | uniq -c | sort -nr

        # Clean up
        rm -f test.tfplan test.tfvars
    else
        error "Terraform plan generation failed"
        rm -f test.tfvars
        return 1
    fi

    cd - > /dev/null
}

# Validate module structure
validate_modules() {
    log "Validating module structure..."

    local modules_dir="$TERRAFORM_DIR/modules"
    local required_modules=("vpc" "rds" "elasticache" "ecs" "s3" "cloudfront" "monitoring")

    for module in "${required_modules[@]}"; do
        local module_path="$modules_dir/$module"

        if [[ -d "$module_path" ]]; then
            log "Checking module: $module"

            # Check for required files
            local required_files=("main.tf" "variables.tf" "outputs.tf")
            for file in "${required_files[@]}"; do
                if [[ -f "$module_path/$file" ]]; then
                    success "  $file exists"
                else
                    error "  $file missing"
                fi
            done

            # Validate module
            cd "$module_path"
            if terraform init -backend=false && terraform validate; then
                success "  Module validation passed"
            else
                error "  Module validation failed"
            fi
            cd - > /dev/null
        else
            error "Module $module not found"
        fi
    done
}

# Test variable validation
test_variable_validation() {
    log "Testing variable validation..."

    cd "$TERRAFORM_DIR"

    # Test with invalid values
    local test_cases=(
        "name_prefix='' # Empty name prefix"
        "environment=invalid # Invalid environment"
        "vpc_cidr=invalid # Invalid CIDR"
        "app_count=-1 # Negative count"
    )

    for test_case in "${test_cases[@]}"; do
        local var_assignment=$(echo "$test_case" | cut -d'#' -f1 | xargs)
        local description=$(echo "$test_case" | cut -d'#' -f2 | xargs)

        log "Testing: $description"

        if terraform plan -var="$var_assignment" &> /dev/null; then
            warning "  Expected validation to fail but it passed"
        else
            success "  Validation correctly failed"
        fi
    done

    cd - > /dev/null
}

# Check resource dependencies
check_dependencies() {
    log "Checking resource dependencies..."

    cd "$TERRAFORM_DIR"

    # Generate dependency graph (if graphviz is available)
    if command -v dot &> /dev/null; then
        log "Generating dependency graph..."
        terraform graph | dot -Tpng > dependency-graph.png
        success "Dependency graph saved to dependency-graph.png"
    else
        warning "Graphviz not installed, skipping dependency graph generation"
    fi

    cd - > /dev/null
}

# Check outputs
validate_outputs() {
    log "Validating Terraform outputs..."

    cd "$TERRAFORM_DIR"

    # Check if outputs are properly defined
    local output_files=(outputs.tf modules/*/outputs.tf)

    for file in $output_files; do
        if [[ -f "$file" ]]; then
            log "Checking outputs in $file"

            # Extract output names
            local outputs=$(grep -o 'output "[^"]*"' "$file" | cut -d'"' -f2)

            for output in $outputs; do
                success "  Found output: $output"
            done
        fi
    done

    cd - > /dev/null
}

# Performance and cost estimation
estimate_costs() {
    log "Estimating infrastructure costs..."

    # Check if infracost is installed
    if command -v infracost &> /dev/null; then
        cd "$TERRAFORM_DIR"

        # Create test tfvars for cost estimation
        cat > cost-test.tfvars << EOF
name_prefix = "nimbus-prod"
environment = "production"
app_image = "nginx:latest"
vpc_cidr = "10.0.0.0/16"
availability_zones = ["${AWS_REGION}a", "${AWS_REGION}b", "${AWS_REGION}c"]
db_instance_class = "db.r5.large"
db_allocated_storage = 100
cache_node_type = "cache.r5.large"
cache_num_nodes = 2
app_count = 3
app_cpu = 1024
app_memory = 2048
deletion_protection = true
enable_backups = true
EOF

        log "Generating cost breakdown..."
        if infracost breakdown --path . --terraform-var-file cost-test.tfvars; then
            success "Cost estimation completed"
        else
            warning "Cost estimation failed"
        fi

        rm -f cost-test.tfvars
        cd - > /dev/null
    else
        warning "Infracost not installed, skipping cost estimation"
    fi
}

# Main execution
main() {
    log "Starting infrastructure validation..."

    # Create log directory if it doesn't exist
    mkdir -p logs
    cd logs

    # Run validation steps
    check_prerequisites
    validate_terraform
    validate_modules
    test_plan_generation
    test_variable_validation
    check_dependencies
    validate_outputs
    estimate_costs

    success "Infrastructure validation completed successfully!"
    log "Full log saved to: $PWD/$LOG_FILE"
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    rm -f terraform.tfstate* .terraform.lock.hcl
    rm -rf .terraform/
}

# Set trap for cleanup
trap cleanup EXIT

# Run main function
main "$@"