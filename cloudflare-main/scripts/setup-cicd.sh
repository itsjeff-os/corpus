#!/bin/bash

# CI/CD Setup Assistant
# Guides you through configuring automatic deployment

set -e

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║         Automatic CI/CD Deployment Setup Assistant              ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "This script will help you set up automatic CI/CD deployment."
echo "When complete, every push to 'main' will automatically deploy!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Track completion
STEPS_COMPLETE=0
TOTAL_STEPS=3

echo -e "${BLUE}📋 Prerequisites Checklist${NC}"
echo ""

# Check 1: GitHub Secrets
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Step 1/3: GitHub Secrets Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You need to add these secrets to your GitHub repository:"
echo "  • CLOUDFLARE_API_TOKEN"
echo "  • CLOUDFLARE_ACCOUNT_ID"
echo ""
echo "How to get them:"
echo "  1. API Token: https://dash.cloudflare.com/profile/api-tokens"
echo "     → Create Token → Use 'Edit Cloudflare Workers' template"
echo ""
echo "  2. Account ID: https://dash.cloudflare.com/"
echo "     → Workers & Pages → Copy Account ID from right side"
echo ""
echo "How to add them to GitHub:"
echo "  1. Go to your repository on GitHub"
echo "  2. Settings → Secrets and variables → Actions"
echo "  3. Click 'New repository secret'"
echo "  4. Add both secrets"
echo ""

read -p "Have you added both GitHub secrets? (yes/no): " secrets_added

if [[ "$secrets_added" == "yes" || "$secrets_added" == "y" ]]; then
    echo -e "${GREEN}✓${NC} GitHub secrets configured"
    ((STEPS_COMPLETE++))
else
    echo -e "${YELLOW}⚠${NC} Please add the GitHub secrets before continuing"
    echo "   Follow the instructions above and run this script again."
    exit 1
fi

echo ""

# Check 2: D1 Database
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Step 2/3: D1 Database Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check current database_id
if grep -q "your-database-id" wrangler.toml; then
    echo -e "${YELLOW}⚠${NC} Database ID is still the placeholder value"
    echo ""
    echo "Let's create a D1 database now..."
    echo ""
    
    read -p "Do you want to create the D1 database now? (yes/no): " create_db
    
    if [[ "$create_db" == "yes" || "$create_db" == "y" ]]; then
        echo ""
        echo "Creating D1 database..."
        echo ""
        
        # Create database
        DB_OUTPUT=$(npx wrangler d1 create my-database 2>&1)
        echo "$DB_OUTPUT"
        echo ""
        
        # Extract database ID
        DB_ID=$(echo "$DB_OUTPUT" | grep "database_id" | sed 's/.*database_id = "\(.*\)".*/\1/')
        
        if [ ! -z "$DB_ID" ]; then
            echo -e "${GREEN}✓${NC} Database created successfully!"
            echo ""
            echo "Database ID: $DB_ID"
            echo ""
            
            # Update wrangler.toml
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s/your-database-id/$DB_ID/" wrangler.toml
            else
                # Linux
                sed -i "s/your-database-id/$DB_ID/" wrangler.toml
            fi
            
            echo -e "${GREEN}✓${NC} wrangler.toml updated with database ID"
            echo ""
            echo -e "${YELLOW}Important:${NC} Remember to commit this change:"
            echo "  git add wrangler.toml"
            echo "  git commit -m 'Configure production D1 database ID'"
            echo "  git push"
            echo ""
            
            ((STEPS_COMPLETE++))
        else
            echo -e "${RED}✗${NC} Failed to create database or extract ID"
            echo "   Please create it manually:"
            echo "   npx wrangler d1 create my-database"
            exit 1
        fi
    else
        echo ""
        echo "Please create the database manually:"
        echo "  1. Run: npx wrangler d1 create my-database"
        echo "  2. Copy the database_id from output"
        echo "  3. Update wrangler.toml with the real ID"
        echo "  4. Run this script again"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Database ID is configured"
    ((STEPS_COMPLETE++))
fi

echo ""

# Check 3: Database Migrations
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Step 3/3: Apply Database Migrations${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Now we need to create the database tables in production."
echo ""

read -p "Apply database migrations now? (yes/no): " apply_migrations

if [[ "$apply_migrations" == "yes" || "$apply_migrations" == "y" ]]; then
    echo ""
    echo "Applying migrations to production database..."
    echo ""
    
    npx wrangler d1 migrations apply my-database --remote
    
    echo ""
    echo -e "${GREEN}✓${NC} Database migrations applied"
    ((STEPS_COMPLETE++))
else
    echo ""
    echo -e "${YELLOW}⚠${NC} Remember to apply migrations before deploying:"
    echo "   npx wrangler d1 migrations apply my-database --remote"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                      Setup Complete!                             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

if [ $STEPS_COMPLETE -eq $TOTAL_STEPS ]; then
    echo -e "${GREEN}✓ All steps completed! ($STEPS_COMPLETE/$TOTAL_STEPS)${NC}"
    echo ""
    echo "🎉 Your CI/CD pipeline is now active!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "How it works:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Create a Pull Request:"
    echo "   → GitHub Actions runs tests and validation"
    echo "   → Dry-run deployment (doesn't deploy)"
    echo ""
    echo "2. Merge to main branch:"
    echo "   → Automatic deployment to production! 🚀"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Next Steps:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Verify configuration:"
    echo "   npm run check-deployment"
    echo ""
    echo "2. Commit wrangler.toml changes (if not already done):"
    echo "   git add wrangler.toml"
    echo "   git commit -m 'Configure production D1 database ID'"
    echo "   git push"
    echo ""
    echo "3. Test the CI/CD pipeline:"
    echo "   • Create a test PR"
    echo "   • Watch it run tests in GitHub Actions"
    echo "   • Merge to main to trigger deployment"
    echo ""
    echo "4. Monitor deployments:"
    echo "   • GitHub: Actions tab"
    echo "   • Cloudflare: https://dash.cloudflare.com/"
    echo ""
    echo "📚 For more details, see: CI_CD_SETUP.md"
    echo ""
else
    echo -e "${YELLOW}⚠ Setup incomplete ($STEPS_COMPLETE/$TOTAL_STEPS steps completed)${NC}"
    echo ""
    echo "Please complete the remaining steps and run this script again."
    echo ""
    echo "For detailed instructions, see: CI_CD_SETUP.md"
fi
