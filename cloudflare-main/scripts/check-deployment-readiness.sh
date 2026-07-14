#!/bin/bash

# Pre-Deployment Validation Script
# Checks if the repository is ready for production deployment

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     Cloudflare Workers Deployment Readiness Check           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Helper functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

check_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Checking Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    check_pass "Dependencies installed (node_modules found)"
else
    check_fail "Dependencies not installed. Run: npm install"
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    check_pass "package.json exists"
else
    check_fail "package.json not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Checking Configuration Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if wrangler.toml exists
if [ -f "wrangler.toml" ]; then
    check_pass "wrangler.toml exists"
    
    # Check for placeholder database_id
    if grep -q "your-database-id" wrangler.toml; then
        check_fail "Database ID is still placeholder 'your-database-id'"
        check_info "Action required: Run 'wrangler d1 create my-database' and update wrangler.toml"
    else
        check_pass "Database ID is configured (not placeholder)"
    fi
    
    # Check if name is set
    if grep -q "^name = " wrangler.toml; then
        WORKER_NAME=$(grep "^name = " wrangler.toml | cut -d '"' -f 2)
        check_pass "Worker name configured: $WORKER_NAME"
    else
        check_warn "Worker name not found in wrangler.toml"
    fi
else
    check_fail "wrangler.toml not found"
fi

# Check for TypeScript config
if [ -f "tsconfig.json" ]; then
    check_pass "tsconfig.json exists"
else
    check_warn "tsconfig.json not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Checking Source Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for main source file
if [ -f "src/index.ts" ]; then
    check_pass "Main worker file exists (src/index.ts)"
else
    check_fail "Main worker file not found (src/index.ts)"
fi

# Check for migrations directory
if [ -d "migrations" ]; then
    MIGRATION_COUNT=$(find migrations -name "*.sql" -type f 2>/dev/null | wc -l)
    if [ "$MIGRATION_COUNT" -gt 0 ]; then
        check_pass "Database migrations found ($MIGRATION_COUNT files)"
    else
        check_warn "No migration files found in migrations/"
    fi
else
    check_warn "Migrations directory not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Running Type Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm run type-check > /dev/null 2>&1; then
    check_pass "TypeScript type checking passed"
else
    check_fail "TypeScript type checking failed. Run 'npm run type-check' for details"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Testing Dry-Run Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npx wrangler deploy --dry-run > /dev/null 2>&1; then
    check_pass "Dry-run deployment successful"
else
    check_fail "Dry-run deployment failed. Run 'npx wrangler deploy --dry-run' for details"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Checking GitHub Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if .github/workflows/deploy.yml exists
if [ -f ".github/workflows/deploy.yml" ]; then
    check_pass "GitHub Actions workflow exists"
    
    # Check if workflow has required secrets referenced
    if grep -q "CLOUDFLARE_API_TOKEN" .github/workflows/deploy.yml && \
       grep -q "CLOUDFLARE_ACCOUNT_ID" .github/workflows/deploy.yml; then
        check_pass "Workflow configured with required secrets"
        check_warn "Verify secrets are set in GitHub: Settings → Secrets → Actions"
    else
        check_fail "Required secrets not found in workflow file"
    fi
else
    check_fail "GitHub Actions workflow not found (.github/workflows/deploy.yml)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Checking Git Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if there are uncommitted changes
if git diff-index --quiet HEAD -- 2>/dev/null; then
    check_pass "No uncommitted changes"
else
    check_warn "Uncommitted changes detected. Consider committing before deployment"
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
check_info "Current branch: $CURRENT_BRANCH"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                     Validation Summary                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Ready for deployment!${NC}"
    echo ""
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
        echo "  Review the warnings above, but deployment can proceed."
        echo ""
    fi
    
    echo "Next steps:"
    echo "  1. Ensure GitHub secrets are configured:"
    echo "     - CLOUDFLARE_API_TOKEN"
    echo "     - CLOUDFLARE_ACCOUNT_ID"
    echo ""
    echo "  2. Choose deployment method:"
    echo "     • Automatic: Merge PR to main branch"
    echo "     • Manual: Actions → Deploy to Cloudflare Workers → Run workflow → deploy"
    echo "     • Local: npm run deploy"
    echo ""
    echo "For detailed instructions, see DEPLOYMENT_READINESS.md"
    exit 0
else
    echo -e "${RED}✗ Not ready for deployment${NC}"
    echo ""
    echo -e "${RED}$ERRORS error(s) found${NC}"
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}$WARNINGS warning(s) found${NC}"
    fi
    
    echo ""
    echo "Please fix the errors above before deploying."
    echo "For help, see DEPLOYMENT_READINESS.md"
    exit 1
fi
