# Cloudflare Workers with D1 Database and AI Gateway

A comprehensive Cloudflare Workers application demonstrating integration with D1 database and AI Gateway for serverless computing with built-in database and AI capabilities.

## 🚀 Quick Start - Automatic CI/CD Deployment

**Want automatic deployment on every push to main?** 

Run the setup assistant:
```bash
npm run setup-cicd
```

Or follow the manual steps:
1. **Fork this repository** to your GitHub account
2. **Create a Cloudflare account** at [dash.cloudflare.com](https://dash.cloudflare.com/)
3. **Configure CI/CD** - Run `npm run setup-cicd` or see [CI/CD Setup Guide](CI_CD_SETUP.md)
4. **Push to main branch** - automatic deployment! 🚀

👉 **[Complete CI/CD Setup Guide](CI_CD_SETUP.md)** - Enable automatic deployment in 3 steps!

## Features

- 🚀 **Cloudflare Workers**: Serverless edge computing
- 💾 **D1 Database**: SQLite-based serverless database
- 🤖 **AI Gateway**: Built-in AI capabilities (text generation, classification, embeddings, translation, summarization)
- 📝 **RESTful API**: Full CRUD operations for users and posts
- 🔄 **TypeScript**: Type-safe development
- 📊 **Request Logging**: Track AI usage and requests
- ⚡ **Automatic CI/CD**: Deploy on every push to main

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a D1 database:
```bash
# Create the database
wrangler d1 create my-database

# This will output a database_id. Copy it and update wrangler.toml
```

3. Update `wrangler.toml` with your database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "YOUR_DATABASE_ID_HERE"
```

4. Run migrations:
```bash
# For local development
npm run d1:migrate:local

# For production
npm run d1:migrate:remote
```

## Development

Start the development server:
```bash
npm run dev
```

The worker will be available at `http://localhost:8787`

## API Endpoints

### Health Check
- `GET /` - Health check and API information

### User Management
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `PUT /users/:id` - Update user
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- `DELETE /users/:id` - Delete user

### Posts
- `GET /posts` - Get all posts (optional: `?user_id=1`)
- `POST /posts` - Create a new post
  ```json
  {
    "user_id": 1,
    "title": "My First Post",
    "content": "Hello, World!"
  }
  ```

### AI Endpoints

#### Text Generation
- `POST /ai/generate` - Generate text using AI
  ```json
  {
    "prompt": "Write a short story about a robot",
    "model": "@cf/meta/llama-2-7b-chat-int8",
    "user_id": 1
  }
  ```

#### Text Classification
- `POST /ai/classify` - Classify text sentiment
  ```json
  {
    "text": "This is an amazing product!"
  }
  ```

#### Generate Embeddings
- `POST /ai/embeddings` - Generate text embeddings
  ```json
  {
    "text": "Hello, world!"
  }
  ```
  or for multiple texts:
  ```json
  {
    "text": ["Hello", "World"]
  }
  ```

#### Translation
- `POST /ai/translate` - Translate text
  ```json
  {
    "text": "Hello, how are you?",
    "source_lang": "english",
    "target_lang": "french"
  }
  ```

#### Summarization
- `POST /ai/summarize` - Summarize text
  ```json
  {
    "text": "Long text to summarize...",
    "max_length": 1024
  }
  ```

#### AI Request History
- `GET /ai/history?limit=10` - Get AI request history

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### AI Requests Table
```sql
CREATE TABLE ai_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT,
  tokens_used INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Available AI Models

The application includes several pre-configured AI models:

- **Text Generation**: `@cf/meta/llama-2-7b-chat-int8`
- **Text Classification**: `@cf/huggingface/distilbert-sst-2-int8`
- **Embeddings**: `@cf/baai/bge-base-en-v1.5`
- **Image Classification**: `@cf/microsoft/resnet-50`
- **Translation**: `@cf/meta/m2m100-1.2b`
- **Summarization**: `@cf/facebook/bart-large-cnn`

## Deployment

### 🚀 Ready to Deploy?

Before deploying, check if you're ready:

```bash
./scripts/check-deployment-readiness.sh
```

This will validate your configuration and ensure everything is set up correctly.

👉 **[Complete deployment readiness guide](DEPLOYMENT_READINESS.md)** - Start here for your first deployment!

### Option 1: Deploy via GitHub Actions (Recommended) 🚀

Set up automatic deployment using GitHub Actions for a seamless CI/CD experience:

1. Add your Cloudflare API token and Account ID as GitHub secrets
2. Push to the `main` branch
3. GitHub Actions automatically deploys your worker

👉 **[See detailed GitHub deployment guide](GITHUB_DEPLOYMENT.md)**

### Option 2: Deploy Manually

Deploy directly from your local machine:
```bash
npm run deploy
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed manual deployment instructions.

## Project Structure

```
.
├── src/
│   ├── index.ts      # Main worker entry point
│   ├── database.ts   # D1 database service
│   ├── ai.ts         # AI Gateway service
│   └── types.ts      # TypeScript type definitions
├── migrations/
│   └── 0001_initial_schema.sql  # Database schema
├── wrangler.toml     # Wrangler configuration
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## Testing

### Type Checking and Unit Tests

Type check:
```bash
npm run type-check
```

Run tests:
```bash
npm test
```

### Testing Deployment

Before deploying to production, you can test your deployment configuration:

**Local testing:**
```bash
# Start local dev server
npm run dev

# Test deployment configuration (dry-run)
npx wrangler deploy --dry-run
```

**Automatic testing on pull requests:**
- Create a PR - GitHub Actions will automatically validate your deployment
- No actual deployment happens on PRs
- Checks configuration, builds the worker, and validates everything works

**Manual deployment testing:**
- Go to Actions tab → Deploy to Cloudflare Workers → Run workflow
- Select "dry-run" to test without deploying
- Select "deploy" to actually deploy to production

👉 **[Complete deployment testing guide](TESTING_DEPLOYMENT.md)**

## Environment Variables

You can add environment variables in `wrangler.toml`:
```toml
[vars]
API_KEY = "your-api-key"
```

Or use `.dev.vars` for local development (not committed to git):
```
API_KEY=your-api-key
```

## Resources

- [**🚀 CI/CD Setup Guide**](CI_CD_SETUP.md) - **Enable automatic deployment in 3 steps!**
- [**Deployment Readiness Guide**](DEPLOYMENT_READINESS.md) - **📋 Complete pre-deployment checklist and setup**
- [**Quick Start Guide**](QUICK_START.md) - **Choose your deployment method**
- [Testing Deployment Guide](TESTING_DEPLOYMENT.md) - **Test deployments before going to production**
- [GitHub Deployment Guide](GITHUB_DEPLOYMENT.md) - Set up automatic CI/CD deployment
- [API Usage Examples](EXAMPLES.md) - Comprehensive examples and code samples
- [Manual Deployment Guide](DEPLOYMENT.md) - Step-by-step manual deployment instructions
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [D1 Database Documentation](https://developers.cloudflare.com/d1/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)

## License

MIT