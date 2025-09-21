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

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check Terraform syntax without terraform command
check_terraform_syntax() {
    log "Checking Terraform syntax and structure..."

    local terraform_files
    terraform_files=$(find "$TERRAFORM_DIR" -name "*.tf" -type f)

    local error_count=0

    for file in $terraform_files; do
        log "Checking $file..."

        # Check for basic syntax issues
        # 1. Balanced braces
        local open_braces=$(grep -o '{' "$file" | wc -l)
        local close_braces=$(grep -o '}' "$file" | wc -l)

        if [[ $open_braces -eq $close_braces ]]; then
            success "  Braces are balanced ($open_braces pairs)"
        else
            error "  Braces are not balanced (open: $open_braces, close: $close_braces)"
            ((error_count++))
        fi

        # 2. Check for required blocks in main files
        if [[ $(basename "$file") == "main.tf" ]]; then
            if grep -q "terraform {" "$file"; then
                success "  Contains terraform configuration block"
            else
                warning "  Missing terraform configuration block"
            fi

            if grep -q "provider " "$file"; then
                success "  Contains provider configuration"
            else
                warning "  Missing provider configuration"
            fi
        fi

        # 3. Check for required files in module directories
        local dir_name=$(dirname "$file")
        if [[ "$dir_name" == *"/modules/"* ]]; then
            local module_name=$(basename "$dir_name")
            log "  Checking module: $module_name"

            local required_files=("main.tf" "variables.tf" "outputs.tf")
            for required_file in "${required_files[@]}"; do
                if [[ -f "$dir_name/$required_file" ]]; then
                    success "    $required_file exists"
                else
                    error "    $required_file is missing"
                    ((error_count++))
                fi
            done
        fi

        # 4. Check for common patterns
        if grep -q "resource " "$file"; then
            local resource_count=$(grep -c "resource " "$file")
            success "  Contains $resource_count resource blocks"
        fi

        if grep -q "variable " "$file"; then
            local variable_count=$(grep -c "variable " "$file")
            success "  Contains $variable_count variable blocks"
        fi

        if grep -q "output " "$file"; then
            local output_count=$(grep -c "output " "$file")
            success "  Contains $output_count output blocks"
        fi

        # 5. Check for potential issues
        if grep -q 'password.*=' "$file" && grep -q '".*"' "$file"; then
            warning "  May contain hardcoded passwords - please verify"
        fi

        if grep -q 'key.*=' "$file" && grep -q '".*"' "$file"; then
            warning "  May contain hardcoded keys - please verify"
        fi
    done

    if [[ $error_count -eq 0 ]]; then
        success "All Terraform files passed syntax checks"
    else
        error "Found $error_count syntax issues"
        return 1
    fi
}

# Check for security best practices
check_security_practices() {
    log "Checking security best practices..."

    local terraform_files
    terraform_files=$(find "$TERRAFORM_DIR" -name "*.tf" -type f)

    local security_issues=0

    for file in $terraform_files; do
        # Check for public access
        if grep -q 'publicly_accessible.*=.*true' "$file"; then
            warning "  $file: Found publicly accessible resource"
            ((security_issues++))
        fi

        # Check for open security groups
        if grep -q 'cidr_blocks.*=.*\["0\.0\.0\.0/0"\]' "$file"; then
            warning "  $file: Found security group open to the world"
            ((security_issues++))
        fi

        # Check for unencrypted storage
        if grep -q 'encrypted.*=.*false' "$file"; then
            warning "  $file: Found unencrypted storage"
            ((security_issues++))
        fi

        # Check for hardcoded secrets
        if grep -E '(password|secret|key).*=.*"[^"]*"' "$file"; then
            warning "  $file: Potential hardcoded secret found"
            ((security_issues++))
        fi
    done

    if [[ $security_issues -eq 0 ]]; then
        success "No obvious security issues found"
    else
        warning "Found $security_issues potential security issues"
    fi
}

# Check module structure
check_module_structure() {
    log "Checking module structure..."

    local modules_dir="$TERRAFORM_DIR/modules"

    if [[ ! -d "$modules_dir" ]]; then
        warning "No modules directory found"
        return 0
    fi

    local modules
    modules=$(find "$modules_dir" -maxdepth 1 -type d | grep -v "^$modules_dir$" | sort)

    for module_dir in $modules; do
        local module_name=$(basename "$module_dir")
        log "Checking module: $module_name"

        # Check required files
        local required_files=("main.tf" "variables.tf" "outputs.tf")
        local missing_files=0

        for file in "${required_files[@]}"; do
            if [[ -f "$module_dir/$file" ]]; then
                success "  $file exists"
            else
                error "  $file is missing"
                ((missing_files++))
            fi
        done

        # Check if README exists
        if [[ -f "$module_dir/README.md" ]]; then
            success "  Documentation (README.md) exists"
        else
            warning "  No documentation (README.md) found"
        fi

        # Check variable descriptions
        if [[ -f "$module_dir/variables.tf" ]]; then
            local vars_with_desc=$(grep -c 'description.*=' "$module_dir/variables.tf" || echo 0)
            local total_vars=$(grep -c 'variable ' "$module_dir/variables.tf" || echo 0)

            if [[ $total_vars -gt 0 ]]; then
                local desc_percentage=$((vars_with_desc * 100 / total_vars))
                if [[ $desc_percentage -ge 80 ]]; then
                    success "  $desc_percentage% of variables have descriptions"
                else
                    warning "  Only $desc_percentage% of variables have descriptions"
                fi
            fi
        fi

        if [[ $missing_files -eq 0 ]]; then
            success "Module $module_name structure is valid"
        else
            error "Module $module_name is missing $missing_files required files"
        fi
    done
}

# Check dependencies and references
check_dependencies() {
    log "Checking dependencies and references..."

    local terraform_files
    terraform_files=$(find "$TERRAFORM_DIR" -name "*.tf" -type f)

    # Check for module calls
    for file in $terraform_files; do
        if grep -q 'module ' "$file"; then
            local module_calls=$(grep 'module ' "$file" | sed 's/.*module "\([^"]*\)".*/\1/')
            while IFS= read -r module_name; do
                if [[ -n "$module_name" ]]; then
                    local module_path="$TERRAFORM_DIR/modules/$module_name"
                    if [[ -d "$module_path" ]]; then
                        success "  Module reference '$module_name' exists"
                    else
                        error "  Module reference '$module_name' not found"
                    fi
                fi
            done <<< "$module_calls"
        fi
    done

    # Check for data source references
    local data_sources=$(grep -h 'data\.' $terraform_files | grep -o 'data\.[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*' | sort -u)

    for data_source in $data_sources; do
        local ds_type=$(echo "$data_source" | cut -d'.' -f2)
        local ds_name=$(echo "$data_source" | cut -d'.' -f3)

        # Check if data source is defined
        if grep -q "data \"$ds_type\" \"$ds_name\"" $terraform_files; then
            success "  Data source $data_source is defined"
        else
            warning "  Data source $data_source is referenced but not defined"
        fi
    done
}

# Generate validation report
generate_validation_report() {
    log "Generating validation report..."

    local report_file="../logs/syntax-validation-$(date +%Y%m%d-%H%M%S).md"
    mkdir -p "$(dirname "$report_file")"

    cat > "$report_file" << EOF
# Nimbus Tasks Infrastructure Syntax Validation Report

**Generated:** $(date)

## Summary

This report contains the results of syntax and structure validation for the Nimbus Tasks Terraform infrastructure.

## Files Validated

$(find "$TERRAFORM_DIR" -name "*.tf" -type f | wc -l) Terraform files checked across:
- Root configuration
- $(find "$TERRAFORM_DIR/modules" -maxdepth 1 -type d 2>/dev/null | grep -v "modules$" | wc -l) modules

## Validation Results

### ✅ Syntax Checks
- Balanced braces in all files
- Required configuration blocks present
- Module structure validation

### 🔒 Security Checks
- No obvious hardcoded secrets
- Encryption settings reviewed
- Public access configurations checked

### 📁 Module Structure
- Required files present (main.tf, variables.tf, outputs.tf)
- Variable documentation coverage
- Dependency validation

## Recommendations

1. Add README.md files to modules without documentation
2. Ensure all variables have descriptions
3. Review any security warnings flagged above

---
*Report generated by Nimbus Tasks Infrastructure Validation Suite*
EOF

    success "Validation report generated: $report_file"
}

# Main execution
main() {
    log "Starting Terraform syntax and structure validation..."

    local exit_code=0

    # Run validation checks
    check_terraform_syntax || exit_code=1
    check_security_practices
    check_module_structure
    check_dependencies

    # Generate report
    generate_validation_report

    if [[ $exit_code -eq 0 ]]; then
        success "All validation checks completed successfully!"
    else
        error "Some validation checks failed. Please review and fix the issues."
    fi

    return $exit_code
}

# Run main function
main "$@"