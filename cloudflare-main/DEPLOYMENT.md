# Deployment Guide

## Prerequisites

Before deploying to Cloudflare Workers, ensure you have:

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages)
2. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
3. Authenticated with Wrangler: `wrangler login`

## Step-by-Step Deployment

### 1. Create D1 Database

Create your production D1 database:

```bash
wrangler d1 create my-database
```

This will output a database ID. Copy it for the next step.

### 2. Update wrangler.toml

Update the `wrangler.toml` file with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "YOUR_ACTUAL_DATABASE_ID_HERE"  # Replace with the ID from step 1
```

### 3. Run Database Migrations

Apply the database schema to your production D1 database:

```bash
npm run d1:migrate:remote
```

This will create all the necessary tables (users, posts, ai_requests) in your production database.

### 4. Deploy to Cloudflare Workers

Deploy your worker:

```bash
npm run deploy
```

Wrangler will build your project and deploy it to Cloudflare's global network.

### 5. Test Your Deployment

After deployment, Wrangler will output your Worker's URL. Test it:

```bash
curl https://your-worker-name.your-subdomain.workers.dev/
```

You should see a response with the API information.

## Local Development

For local development with D1:

```bash
# Create local D1 database
wrangler d1 create my-database --local

# Run migrations locally
npm run d1:migrate:local

# Start local development server
npm run dev
```

## Environment Variables

If you need to add environment variables (API keys, secrets, etc.):

1. For local development, create a `.dev.vars` file:
   ```
   API_KEY=your-local-api-key
   ```

2. For production, use Wrangler secrets:
   ```bash
   wrangler secret put API_KEY
   ```

## Monitoring and Logs

View logs for your deployed worker:

```bash
wrangler tail
```

## Custom Domain

To use a custom domain:

1. Go to the Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select your worker
4. Go to Settings > Domains & Routes
5. Add your custom domain

## Troubleshooting

### Database Connection Issues

If you see D1 database errors:
- Verify the database_id in wrangler.toml is correct
- Ensure migrations have been run: `npm run d1:migrate:remote`

### AI Gateway Issues

If AI endpoints return errors:
- Ensure your Cloudflare account has Workers AI enabled
- Check that you're using supported AI models
- Verify the AI binding is configured correctly in wrangler.toml

### Type Errors

If you encounter TypeScript errors:
```bash
npm run type-check
```

### Build Errors

Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Cost Considerations

Cloudflare Workers offers generous free tiers:

- **Workers**: 100,000 requests/day on free tier
- **D1**: 5 GB storage, 5M reads, 100K writes/day on free tier
- **Workers AI**: Free tier available with rate limits

For production use, review [Cloudflare pricing](https://www.cloudflare.com/plans/developer-platform/).

## Additional Resources

- [Cloudflare Workers Dashboard](https://dash.cloudflare.com/?to=/:account/workers)
- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)
