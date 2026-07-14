# Deployment Readiness Checklist

This document provides a step-by-step guide to prepare your Cloudflare Workers application for production deployment.

## 🎯 Current Status

Your deployment testing infrastructure is complete and working! Now let's get you ready for production deployment.

## ✅ Prerequisites Checklist

### 1. Cloudflare Account Setup
- [ ] **Cloudflare account created** - Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up/workers-and-pages)
- [ ] **Workers subscription** - Free tier is sufficient for testing
- [ ] **Account verified** - Email confirmed and account active

### 2. GitHub Repository Secrets
- [ ] **CLOUDFLARE_API_TOKEN** configured in GitHub Secrets
- [ ] **CLOUDFLARE_ACCOUNT_ID** configured in GitHub Secrets

### 3. D1 Database Configuration
- [ ] **D1 database created** using `wrangler d1 create my-database`
- [ ] **Database ID updated** in `wrangler.toml` (replace "your-database-id")
- [ ] **Database migrations applied** to production database

### 4. Code and Configuration
- [ ] **Type checking passes** - Run `npm run type-check`
- [ ] **Local testing successful** - Run `npm run dev` and test endpoints
- [ ] **Dry-run deployment passes** - Run `npx wrangler deploy --dry-run`

## 📋 Step-by-Step Deployment Guide

### Step 1: Install Dependencies Locally

```bash
# Navigate to your project directory
cd /path/to/your/cloudflare/project

# Install dependencies
npm install
```

### Step 2: Authenticate with Cloudflare

```bash
# Login to Cloudflare via Wrangler
npx wrangler login
```

This will open a browser for authentication.

### Step 3: Create D1 Database

```bash
# Create the database
npx wrangler d1 create my-database
```

**IMPORTANT**: Save the output! You'll get something like:

```
✅ Successfully created DB 'my-database'!

[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` (the UUID).

### Step 4: Update wrangler.toml

Edit `wrangler.toml` and replace the placeholder:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # ← Your actual database ID here
```

Commit this change:

```bash
git add wrangler.toml
git commit -m "Configure production D1 database"
git push
```

### Step 5: Apply Database Migrations

Run the migrations against your production database:

```bash
npx wrangler d1 migrations apply my-database --remote
```

This creates the tables (users, posts, ai_requests) in your production database.

### Step 6: Get Cloudflare API Credentials

#### Get API Token:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your profile icon (top right) → **My Profile**
3. Select **API Tokens** in the left sidebar
4. Click **Create Token**
5. Use **Edit Cloudflare Workers** template
6. Configure:
   - **Permissions**: 
     - Account → Workers Scripts → Edit
     - Account → Account Settings → Read
   - **Account Resources**: Include → Your Account
7. Click **Continue to summary** → **Create Token**
8. **Copy the token immediately** (you won't see it again!)

#### Get Account ID:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on **Workers & Pages** (or any site)
3. Look on the right side for **Account ID**
4. Click to copy it

### Step 7: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these two secrets:

**Secret 1:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: [Your API token from Step 6]

**Secret 2:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: [Your Account ID from Step 6]

### Step 8: Test Deployment Configuration

Before deploying, validate everything is configured correctly:

```bash
# Type check
npm run type-check

# Dry-run deployment test
npx wrangler deploy --dry-run
```

Both should pass without errors.

### Step 9: Deploy to Production

You have **three options** to deploy:

#### Option A: Merge to Main (Automatic Deployment) ✨ Recommended

```bash
# Ensure you're on your feature branch
git checkout copilot/test-deployment-functionality

# Create a pull request on GitHub, get it reviewed, then merge to main
# Deployment happens automatically on merge!
```

#### Option B: Manual Deployment via GitHub Actions

1. Go to **Actions** tab in GitHub
2. Click **Deploy to Cloudflare Workers**
3. Click **Run workflow**
4. Select branch: `copilot/test-deployment-functionality`
5. Select deployment_type: **deploy**
6. Click **Run workflow**

#### Option C: Local Manual Deployment

```bash
npm run deploy
```

### Step 10: Verify Deployment

After deployment:

1. **Check GitHub Actions logs** for deployment status
2. **Find your worker URL** in the logs (format: `https://cloudflare-workers-d1-ai.YOUR-SUBDOMAIN.workers.dev`)
3. **Test the health endpoint**:

```bash
curl https://cloudflare-workers-d1-ai.YOUR-SUBDOMAIN.workers.dev/
```

Expected response:
```json
{
  "status": "ok",
  "message": "Cloudflare Workers with D1 and AI Gateway",
  "endpoints": {
    "users": "/users",
    "posts": "/posts",
    "ai": "/ai"
  }
}
```

4. **Test creating a user**:

```bash
curl -X POST https://cloudflare-workers-d1-ai.YOUR-SUBDOMAIN.workers.dev/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

5. **View Cloudflare Dashboard**:
   - Go to Workers & Pages
   - Find your worker
   - Check logs and metrics

## 🚨 Common Issues and Solutions

### Issue: "database_id still contains placeholder value"

**Solution**: Complete Step 3 and Step 4 above to create a real D1 database and update wrangler.toml.

### Issue: "Authentication error" in GitHub Actions

**Solution**: Verify your GitHub secrets are set correctly (Step 7).

### Issue: "Database not found" error

**Solution**: Make sure you've applied migrations (Step 5).

### Issue: Type checking fails

**Solution**: 
```bash
npm run type-check
# Fix any TypeScript errors shown
```

## 🎉 Post-Deployment

Once deployed successfully:

1. **Share your worker URL** with your team
2. **Monitor logs** in Cloudflare Dashboard → Workers → Your Worker → Logs
3. **Set up monitoring** (optional) - Configure alerts in Cloudflare
4. **Update documentation** with your production URL
5. **Test all endpoints** to ensure everything works in production

## 📊 Deployment Methods Comparison

| Method | When to Use | Pros | Cons |
|--------|-------------|------|------|
| **Merge to Main** | Standard workflow | Automatic, CI/CD, tested | Requires PR process |
| **GitHub Actions Manual** | Quick updates | On-demand, no git operations | Manual trigger needed |
| **Local Deployment** | Development/testing | Immediate, full control | No CI/CD validation |

## 🔐 Security Best Practices

- ✅ Never commit API tokens to git
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate API tokens regularly (every 90 days)
- ✅ Use minimal required permissions for API tokens
- ✅ Enable branch protection on main branch
- ✅ Require PR reviews before merging

## 📚 Additional Resources

- [TESTING_DEPLOYMENT.md](TESTING_DEPLOYMENT.md) - Test deployments before production
- [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) - Detailed GitHub Actions setup
- [README.md](README.md) - Project overview and API documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)

## 🚀 Quick Start (If You Already Have Everything)

If you've already completed all prerequisites:

```bash
# Test locally
npm run dev

# Validate configuration  
npm run type-check
npx wrangler deploy --dry-run

# Deploy!
npm run deploy

# OR merge your PR to main for automatic deployment
```

## 🆘 Need Help?

1. Review the error messages carefully
2. Check the [Troubleshooting section](#common-issues-and-solutions)
3. Verify all prerequisites are completed
4. Check Cloudflare status page: https://www.cloudflarestatus.com/
5. Review GitHub Actions logs for detailed error information

---

**Ready to deploy?** Start with Step 1 and work through the checklist above!
