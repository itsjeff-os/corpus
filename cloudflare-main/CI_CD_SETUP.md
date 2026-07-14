# Automatic CI/CD Deployment Setup

This guide will help you enable **automatic CI/CD deployment** for your Cloudflare Workers application. Once configured, every push to the `main` branch will automatically deploy to production!

## 🎯 What You'll Get

✅ **Automatic deployment** when merging to `main`  
✅ **Automatic testing** on every pull request  
✅ **Configuration validation** before deployment  
✅ **Deployment dry-run** on PRs (no actual deployment)  
✅ **Manual deployment** trigger option via GitHub Actions

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Cloudflare Credentials

You need two pieces of information from Cloudflare:

#### 1.1 Get Your API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template
4. Click **Continue to summary** → **Create Token**
5. **Copy the token** (you can only see it once!)

#### 1.2 Get Your Account ID

1. Go to https://dash.cloudflare.com/
2. Click **Workers & Pages** in the left sidebar
3. Copy the **Account ID** shown on the right side

### Step 2: Configure GitHub Secrets

Add your Cloudflare credentials to GitHub:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these two secrets:

**First Secret:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: [Paste your API token]
- Click **Add secret**

**Second Secret:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: [Paste your Account ID]
- Click **Add secret**

### Step 3: Configure D1 Database

The last blocker is the database configuration. Run these commands locally:

```bash
# Login to Cloudflare
npx wrangler login

# Create D1 database
npx wrangler d1 create my-database
```

This will output something like:
```
✅ Successfully created DB 'my-database'!

[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id`** (the UUID) and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # ← Paste your real ID here
```

Then commit and push:

```bash
git add wrangler.toml
git commit -m "Configure production D1 database ID"
git push
```

### Step 4: Apply Database Migrations

Create the tables in your production database:

```bash
npx wrangler d1 migrations apply my-database --remote
```

## ✅ Verify Setup

Run the readiness check:

```bash
npm run check-deployment
```

If everything passes, you're ready!

## 🎉 Enable Automatic Deployment

Once prerequisites are complete, automatic CI/CD is enabled! Here's how it works:

### Automatic Deployment Workflow

```
Developer creates PR
       ↓
GitHub Actions runs:
  ✓ Type checking
  ✓ Configuration validation  
  ✓ Dry-run deployment test
  ✗ NO actual deployment
       ↓
PR gets reviewed & approved
       ↓
PR merged to main branch
       ↓
GitHub Actions runs:
  ✓ Type checking
  ✓ Configuration validation
  ✓ DEPLOYS TO PRODUCTION! 🚀
       ↓
Worker is live at:
  https://your-worker.workers.dev
```

### Testing the CI/CD Pipeline

1. **Create a test change:**
   ```bash
   git checkout -b test-cicd
   echo "// Test comment" >> src/index.ts
   git add src/index.ts
   git commit -m "Test CI/CD pipeline"
   git push origin test-cicd
   ```

2. **Create a Pull Request** on GitHub

3. **Watch GitHub Actions**:
   - Go to **Actions** tab
   - See the workflow run
   - Verify dry-run passes ✓
   - Notice it does NOT deploy (PR mode)

4. **Merge the PR** to `main`

5. **Watch Automatic Deployment**:
   - Go to **Actions** tab
   - See new workflow run
   - Watch it deploy! 🚀
   - Get your worker URL from logs

## 📊 CI/CD Workflow Behavior

| Event | Type Check | Validation | Dry-Run | Deploy |
|-------|-----------|------------|---------|--------|
| Pull Request | ✅ | ✅ | ✅ | ❌ |
| Push to main | ✅ | ✅ | ❌ | ✅ |
| Manual (dry-run) | ✅ | ✅ | ✅ | ❌ |
| Manual (deploy) | ✅ | ✅ | ❌ | ✅ |

## 🔄 Development Workflow with CI/CD

### For New Features

1. Create feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes and test locally:
   ```bash
   npm run dev
   npm run type-check
   ```

3. Push and create PR:
   ```bash
   git push origin feature/my-feature
   # Create PR on GitHub
   ```

4. CI/CD automatically:
   - ✓ Validates your code
   - ✓ Tests deployment configuration
   - ✓ Reports any issues

5. After approval, merge to `main`:
   - ✓ Automatic deployment to production!

### For Hotfixes

1. Create hotfix branch from main:
   ```bash
   git checkout -b hotfix/critical-fix
   ```

2. Make fix and test locally

3. Option A - Full CI/CD (Recommended):
   ```bash
   git push origin hotfix/critical-fix
   # Create PR, review, merge to main
   # Automatic deployment happens
   ```

4. Option B - Emergency Manual Deploy:
   - Go to **Actions** → **Deploy to Cloudflare Workers**
   - Click **Run workflow**
   - Select branch: `hotfix/critical-fix`
   - Select: **deploy**
   - Click **Run workflow**

## 🛡️ Safety Features Built In

Your CI/CD pipeline includes safety checks:

✅ **Type checking** - Catches TypeScript errors before deploy  
✅ **Configuration validation** - Ensures wrangler.toml is correct  
✅ **Dry-run testing** - Tests deployment on PRs without deploying  
✅ **Branch protection** - Only main branch deploys automatically  
✅ **Manual approval** - PRs require review before merge  

## 🔧 Advanced Configuration

### Enable Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - ☑️ Require pull request reviews before merging
   - ☑️ Require status checks to pass before merging
   - ☑️ Require branches to be up to date before merging

### Multiple Environments

Want staging and production environments?

Edit `wrangler.toml`:

```toml
name = "my-worker"

[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "production-database-id"

# Staging environment
[env.staging]
name = "my-worker-staging"

[[env.staging.d1_databases]]
binding = "DB"
database_name = "my-database-staging"
database_id = "staging-database-id"
```

Create `.github/workflows/deploy-staging.yml`:

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

Now:
- Push to `develop` → Deploy to staging
- Push to `main` → Deploy to production

## 📈 Monitoring Your Deployments

### GitHub Actions Dashboard

- Go to **Actions** tab
- See all deployment runs
- Click any run to see logs
- Monitor success/failure rates

### Cloudflare Dashboard

1. Go to https://dash.cloudflare.com/
2. Click **Workers & Pages**
3. Find your worker
4. View:
   - Request metrics
   - Error rates
   - Real-time logs
   - Performance data

## 🚨 Troubleshooting

### Deployment Fails: "Authentication Error"

**Cause:** GitHub secrets not set or incorrect

**Fix:**
1. Verify secrets are set in GitHub: Settings → Secrets → Actions
2. Regenerate API token if needed
3. Update the secret in GitHub

### Deployment Fails: "Database Not Found"

**Cause:** Database ID in wrangler.toml is incorrect or placeholder

**Fix:**
1. Run: `npx wrangler d1 list`
2. Copy correct database ID
3. Update wrangler.toml
4. Commit and push

### Type Check Fails in CI

**Cause:** TypeScript errors in code

**Fix:**
1. Run locally: `npm run type-check`
2. Fix errors shown
3. Commit and push fixes

### PR Tests Pass but Main Branch Deploy Fails

**Cause:** Secrets only available on main branch or environment differences

**Fix:**
1. Ensure secrets are available to all branches (not environment-specific)
2. Check if wrangler.toml was updated in PR

## 📋 Quick Reference

### Check if CI/CD is Ready
```bash
npm run check-deployment
```

### Test Locally Before Push
```bash
npm run dev                    # Local development server
npm run type-check             # Type checking
npx wrangler deploy --dry-run  # Test deployment
```

### View Deployment Logs
```bash
npx wrangler tail              # Real-time logs
```

### Manual Deploy (Bypass CI/CD)
```bash
npm run deploy
```

## 🎓 CI/CD Best Practices

1. **Always create PRs** - Don't push directly to main
2. **Write clear commit messages** - Helps track what was deployed
3. **Test locally first** - Catch issues before CI/CD runs
4. **Monitor after deployment** - Check logs and metrics
5. **Use semantic versioning** - Tag releases with versions
6. **Keep dependencies updated** - Regularly update packages
7. **Review deployment logs** - Understand what was deployed

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Workers CI/CD](https://developers.cloudflare.com/workers/platform/deployments/)
- [Wrangler Commands](https://developers.cloudflare.com/workers/wrangler/commands/)
- [DEPLOYMENT_READINESS.md](DEPLOYMENT_READINESS.md) - Complete setup guide
- [TESTING_DEPLOYMENT.md](TESTING_DEPLOYMENT.md) - Testing strategies

## ✨ You're All Set!

Once you complete the 3 setup steps above, your CI/CD pipeline is active!

Every push to `main` = Automatic deployment 🚀

Happy deploying! 🎉
