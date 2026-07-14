# Testing Deployment Guide

This guide explains how to test your Cloudflare Workers deployment without actually deploying to production.

## Overview

The deployment workflow now includes several testing capabilities:

1. **Automatic Dry-Run on Pull Requests** - Every PR automatically tests the deployment configuration
2. **Manual Dry-Run Testing** - Manually trigger a test deployment from GitHub Actions
3. **Configuration Validation** - Automatic validation of wrangler.toml and deployment settings
4. **Local Testing** - Test your worker locally before deploying

## Testing Methods

### 1. Automatic Testing on Pull Requests

When you create a pull request, GitHub Actions automatically:
- ✅ Runs TypeScript type checking
- ✅ Validates your deployment configuration
- ✅ Performs a dry-run deployment test
- ❌ Does NOT deploy to production

**How to use:**
1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. Push and create a pull request:
   ```bash
   git push origin feature/my-feature
   ```

4. GitHub Actions will automatically run tests including deployment validation

5. Check the "Deploy to Cloudflare Workers" workflow in the Actions tab to see:
   - Type check results
   - Configuration validation
   - Dry-run deployment results

### 2. Manual Dry-Run Testing

You can manually trigger a test deployment from GitHub Actions.

**Steps:**
1. Go to your repository's **Actions** tab
2. Click on **Deploy to Cloudflare Workers** workflow
3. Click **Run workflow** button (top right)
4. Select **deployment_type**:
   - **dry-run** - Test deployment without actually deploying (default)
   - **deploy** - Actually deploy to production
5. Click **Run workflow**

**What happens in dry-run mode:**
- ✅ Validates wrangler.toml configuration
- ✅ Checks for placeholder values in configuration
- ✅ Builds the worker
- ✅ Validates the deployment bundle
- ✅ Confirms deployment would succeed
- ❌ Does NOT publish to Cloudflare

### 3. Local Development Testing

Test your worker locally using Wrangler's dev server.

**Setup:**
```bash
# Install dependencies
npm install

# Run database migrations locally
npm run d1:migrate:local

# Start local development server
npm run dev
```

**What you can test locally:**
- All API endpoints
- D1 database interactions (using local SQLite)
- AI Gateway functionality (requires Cloudflare account)
- CORS configuration
- Request routing and error handling

**Test endpoints:**
```bash
# Health check
curl http://localhost:8787/

# Create a user
curl -X POST http://localhost:8787/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Get all users
curl http://localhost:8787/users

# Create a post
curl -X POST http://localhost:8787/posts \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"title":"My Post","content":"Post content"}'
```

### 4. Configuration Validation Only

Test just the configuration without building or deploying.

**Using npm script:**
```bash
# Validate configuration with dry-run
npx wrangler deploy --dry-run
```

**What this checks:**
- wrangler.toml syntax
- Binding configurations (D1, AI)
- Worker name and compatibility date
- TypeScript compilation
- Dependencies

## Understanding Deployment Workflow

### Workflow Triggers

| Trigger | Type Check | Config Validation | Dry-Run | Production Deploy |
|---------|-----------|-------------------|---------|-------------------|
| Pull Request | ✅ | ✅ | ✅ | ❌ |
| Push to main | ✅ | ✅ | ❌ | ✅ |
| Manual (dry-run) | ✅ | ✅ | ✅ | ❌ |
| Manual (deploy) | ✅ | ✅ | ❌ | ✅ |

### Configuration Validation

The workflow automatically checks:

1. **File existence** - Verifies wrangler.toml exists
2. **Placeholder values** - Warns if database_id is still "your-database-id"
3. **Syntax validation** - Ensures wrangler.toml is valid TOML
4. **Build validation** - Confirms TypeScript compiles successfully
5. **Deployment readiness** - Verifies worker can be deployed

## Common Testing Scenarios

### Scenario 1: Testing Configuration Changes

**When:** You update wrangler.toml (e.g., change worker name, add bindings)

**How to test:**
1. Make changes to wrangler.toml
2. Run locally:
   ```bash
   npm run dev
   ```
3. Create a PR to trigger automatic validation
4. Check workflow logs for any configuration issues

### Scenario 2: Testing Code Changes

**When:** You modify TypeScript code in src/

**How to test:**
1. Run type check locally:
   ```bash
   npm run type-check
   ```
2. Test locally with dev server:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Create a PR for automatic deployment testing

### Scenario 3: Testing Database Changes

**When:** You add or modify database migrations

**How to test:**
1. Test migrations locally:
   ```bash
   npm run d1:migrate:local
   ```
2. Verify database schema:
   ```bash
   npx wrangler d1 execute DB --local --command "SELECT * FROM sqlite_master WHERE type='table'"
   ```
3. Test API endpoints that use the database
4. Create a PR to validate deployment configuration

### Scenario 4: Pre-Production Validation

**When:** Before deploying to production, you want to ensure everything works

**Steps:**
1. Create a PR with all your changes
2. Wait for automatic tests to pass
3. Manually trigger a dry-run deployment:
   - Go to Actions tab
   - Run workflow with "dry-run" option
4. Review all check results
5. If all tests pass, merge to main (auto-deploys) or manually trigger with "deploy" option

## Interpreting Test Results

### ✅ Successful Dry-Run

Example output:
```
🔍 Validating deployment configuration...
✅ Database ID is configured
✅ Configuration validation complete

🧪 Running deployment in dry-run mode...
This will validate the deployment without publishing to Cloudflare.
✅ Dry-run deployment successful!
   The worker configuration is valid and ready to deploy.
```

**What this means:**
- Configuration is valid
- TypeScript compiles successfully
- Worker bundle can be created
- Deployment would succeed if triggered

**Next steps:**
- Safe to merge PR or deploy to production

### ⚠️ Warning: Placeholder Values

Example output:
```
⚠️  Warning: database_id still contains placeholder value
   Please update wrangler.toml with your actual database ID
   Run: wrangler d1 create my-database
```

**What this means:**
- Configuration has placeholder values
- Deployment might fail or use wrong resources

**Next steps:**
1. Create a D1 database:
   ```bash
   wrangler d1 create my-database
   ```
2. Update wrangler.toml with the actual database_id
3. Commit and push the change

### ❌ Failed Validation

Example output:
```
Error: Type checking failed
src/index.ts:10:5 - error TS2322: Type 'string' is not assignable to type 'number'
```

**What this means:**
- Code has errors
- Deployment cannot proceed

**Next steps:**
1. Fix the errors locally
2. Run `npm run type-check` to verify
3. Commit and push the fix

## Best Practices

### 1. Always Test Before Deploying
- Create PRs for all changes
- Review automatic test results
- Don't merge failing tests

### 2. Use Dry-Run for Major Changes
- Manual dry-run before big updates
- Verify configuration changes
- Test after updating dependencies

### 3. Test Locally First
- Use `npm run dev` for rapid iteration
- Test all endpoints and features
- Verify database interactions

### 4. Progressive Testing
1. Local testing (`npm run dev`)
2. Type checking (`npm run type-check`)
3. Unit tests (`npm test`)
4. PR automatic validation
5. Manual dry-run (if needed)
6. Production deployment

### 5. Monitor After Deployment
- Check GitHub Actions logs
- Review Cloudflare Workers dashboard
- Test production endpoints
- Monitor for errors in logs

## Troubleshooting

### Dry-Run Fails But Local Dev Works

**Possible causes:**
- Environment differences
- Missing dependencies in package.json
- Configuration issues

**Solutions:**
1. Ensure all dependencies are listed in package.json
2. Check wrangler.toml for correct bindings
3. Verify no environment-specific code

### Configuration Validation Passes But Deployment Fails

**Possible causes:**
- Missing secrets (API tokens)
- Account permissions
- Resource quotas

**Solutions:**
1. Verify GitHub secrets are set:
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
2. Check Cloudflare account status
3. Verify API token permissions

### Local Testing Works But PR Tests Fail

**Possible causes:**
- Uncommitted files
- Local environment variables not in repository
- Git ignored files needed for build

**Solutions:**
1. Check `.gitignore` - ensure necessary files aren't ignored
2. Verify all source files are committed
3. Remove dependencies on local-only files

## Additional Resources

- [GitHub Actions Workflow File](.github/workflows/deploy.yml)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Deployment Guide](GITHUB_DEPLOYMENT.md)

## Quick Reference

### Commands

```bash
# Local development
npm run dev

# Type checking
npm run type-check

# Run tests
npm test

# Local DB migrations
npm run d1:migrate:local

# Dry-run deployment
npx wrangler deploy --dry-run

# Actual deployment
npm run deploy
```

### GitHub Actions Triggers

- **Pull Request** → Automatic validation + dry-run
- **Push to main** → Automatic production deployment
- **Manual dry-run** → Actions → Run workflow → Select "dry-run"
- **Manual deploy** → Actions → Run workflow → Select "deploy"

## Support

If you encounter issues with deployment testing:
1. Check workflow logs in Actions tab
2. Review configuration validation output
3. Test locally with `npm run dev`
4. Consult [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) for setup
5. Check [Troubleshooting section](#troubleshooting) above
