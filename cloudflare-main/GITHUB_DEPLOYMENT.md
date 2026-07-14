# GitHub Actions Deployment Guide

This guide explains how to set up automatic deployment to Cloudflare Workers using GitHub Actions.

## Overview

The repository includes a GitHub Actions workflow that automatically:
- Runs TypeScript type checking on every push
- Validates deployment configuration
- Tests deployment with dry-run on pull requests
- Deploys to Cloudflare Workers when code is pushed to the `main` branch
- Can be manually triggered from the GitHub Actions tab

💡 **Want to test your deployment before going to production?** See the [Testing Deployment Guide](TESTING_DEPLOYMENT.md) for comprehensive testing options.

## Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages)
2. A GitHub repository with this code
3. Cloudflare API credentials

## Setup Instructions

### Step 1: Create a D1 Database

First, create your D1 database using Wrangler locally:

```bash
# Install dependencies
npm install

# Create the database
wrangler d1 create my-database
```

This will output a database ID. **Save this for later.**

### Step 2: Update wrangler.toml

Update the `wrangler.toml` file with your database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "your-actual-database-id-here"  # Replace with your database ID
```

Commit this change to your repository:

```bash
git add wrangler.toml
git commit -m "Update D1 database ID"
git push
```

### Step 3: Run Database Migrations

Apply the database schema to your production database:

```bash
wrangler d1 migrations apply my-database --remote
```

This creates the necessary tables (users, posts, ai_requests) in your production database.

### Step 4: Get Your Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your profile icon (top right) → **My Profile**
3. Go to **API Tokens** in the left sidebar
4. Click **Create Token**
5. Use the **Edit Cloudflare Workers** template
6. Configure the token:
   - **Permissions**: 
     - Account → Workers Scripts → Edit
     - Account → Account Settings → Read
   - **Account Resources**: Include → [Your Account]
   - **Zone Resources**: All zones (or specific zones if preferred)
7. Click **Continue to summary** → **Create Token**
8. **Copy the token immediately** (you won't be able to see it again)

### Step 5: Get Your Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select any website or go to Workers & Pages
3. On the right side, you'll see **Account ID**
4. Click to copy it

### Step 6: Add GitHub Secrets

Add your Cloudflare credentials as GitHub secrets:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add two secrets:

   **Secret 1: CLOUDFLARE_API_TOKEN**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: Your Cloudflare API token from Step 4
   - Click **Add secret**

   **Secret 2: CLOUDFLARE_ACCOUNT_ID**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: Your Cloudflare Account ID from Step 5
   - Click **Add secret**

### Step 7: Enable GitHub Actions

If GitHub Actions aren't already enabled:

1. Go to your repository's **Actions** tab
2. If prompted, click **I understand my workflows, go ahead and enable them**

### Step 8: Deploy!

Now you're ready to deploy. You have three options:

#### Option A: Push to Main Branch

Simply push your code to the `main` branch:

```bash
git push origin main
```

GitHub Actions will automatically run the deployment workflow.

#### Option B: Manual Trigger

1. Go to your repository's **Actions** tab
2. Click on **Deploy to Cloudflare Workers** workflow
3. Click **Run workflow** → **Run workflow**

#### Option C: Merge a Pull Request

When you merge a pull request into `main`, the deployment will trigger automatically.

### Step 9: Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. Click on the most recent workflow run
3. Watch the deployment progress in real-time
4. Once complete, you'll see a green checkmark ✅

### Step 10: Access Your Deployed Worker

After successful deployment, your worker will be available at:

```
https://cloudflare-workers-d1-ai.your-subdomain.workers.dev
```

The exact URL will be shown in the GitHub Actions logs. You can also find it in your [Cloudflare Workers Dashboard](https://dash.cloudflare.com/?to=/:account/workers).

## Workflow File Explained

The `.github/workflows/deploy.yml` file contains the deployment configuration:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main          # Deploy on push to main
  pull_request:
    branches:
      - main          # Run checks on PRs (but don't deploy)
  workflow_dispatch:  # Allow manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

## Development Workflow

### For New Features

1. Create a new branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. Push to GitHub:
   ```bash
   git push origin feature/my-new-feature
   ```

4. Create a Pull Request on GitHub

5. GitHub Actions will run type checks automatically

6. After approval, merge the PR to `main`

7. Automatic deployment to production will trigger!

### For Quick Fixes

1. Make changes on the `main` branch (or hotfix branch)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Fix critical bug"
   git push origin main
   ```
3. Deployment happens automatically

## Troubleshooting

### Deployment Fails with "Authentication Error"

- **Check**: Verify your `CLOUDFLARE_API_TOKEN` secret is correct
- **Fix**: Regenerate the API token and update the GitHub secret

### Deployment Fails with "Account ID Invalid"

- **Check**: Verify your `CLOUDFLARE_ACCOUNT_ID` secret is correct
- **Fix**: Copy the Account ID from Cloudflare Dashboard and update the secret

### Type Check Fails

- **Check**: Run `npm run type-check` locally to see the errors
- **Fix**: Fix TypeScript errors before pushing

### "Database Not Found" Error

- **Check**: Ensure you've updated `wrangler.toml` with your actual database ID
- **Check**: Ensure you've run migrations with `wrangler d1 migrations apply DB --remote`

### Worker Deploys But Returns Errors

- **Check**: View logs in Cloudflare Dashboard → Workers → Your Worker → Logs
- **Check**: Ensure D1 migrations have been applied
- **Check**: Verify the database binding name matches in `wrangler.toml`

## Viewing Deployment Logs

### In GitHub

1. Go to **Actions** tab
2. Click on the workflow run
3. Click on the **Deploy** job
4. Expand each step to see detailed logs

### In Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click on your worker
4. Go to **Logs** tab
5. Use **Real-time Logs** or **Trace a Request**

## Multiple Environments

### Setting Up Staging Environment

You can create separate environments for staging and production:

1. **Create a separate D1 database for staging:**
   ```bash
   wrangler d1 create my-database-staging
   ```

2. **Update `wrangler.toml` with environment-specific config:**
   ```toml
   name = "cloudflare-workers-d1-ai"
   
   [[d1_databases]]
   binding = "DB"
   database_name = "my-database"
   database_id = "production-database-id"
   
   [env.staging]
   name = "cloudflare-workers-d1-ai-staging"
   
   [[env.staging.d1_databases]]
   binding = "DB"
   database_name = "my-database-staging"
   database_id = "staging-database-id"
   ```

3. **Create a separate workflow file** `.github/workflows/deploy-staging.yml`:
   ```yaml
   name: Deploy to Staging
   
   on:
     push:
       branches:
         - develop
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
         - run: npm ci
         - run: npm run type-check
         - uses: cloudflare/wrangler-action@v3
           with:
             apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
             accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
             environment: 'staging'
   ```

4. **Push to `develop` branch** for staging, `main` for production

## Security Best Practices

1. **Never commit API tokens** to the repository
2. **Use GitHub Secrets** for all sensitive data
3. **Rotate API tokens** regularly
4. **Use scoped tokens** with minimal required permissions
5. **Enable branch protection** on `main` to require PR reviews
6. **Use environment secrets** for different deployment environments

## Cost Considerations

GitHub Actions provides:
- **2,000 minutes/month free** for private repositories
- **Unlimited minutes** for public repositories

This workflow typically uses **2-3 minutes per deployment**, so you can deploy many times per month on the free tier.

## Advanced Configuration

### Auto-Deploy on Tags

To deploy only on version tags (e.g., `v1.0.0`):

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Deploy Multiple Workers

If you have multiple workers in one repository:

```yaml
- name: Deploy Worker 1
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    workingDirectory: 'worker1'

- name: Deploy Worker 2
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    workingDirectory: 'worker2'
```

### Slack Notifications

Add Slack notifications for deployments:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment to Cloudflare Workers'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Wrangler Action](https://github.com/cloudflare/wrangler-action)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Review workflow logs in the Actions tab
3. Check Cloudflare Worker logs in the dashboard
4. Consult [Cloudflare Workers Community](https://community.cloudflare.com/)
