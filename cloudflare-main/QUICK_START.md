# Quick Deployment Reference

Choose your preferred deployment method:

## 🚀 Option 1: GitHub Actions (Recommended)

**Best for:** Automated deployments, team collaboration, production use

### Quick Setup (5 minutes)

1. **Get Cloudflare credentials:**
   - API Token: [Create here](https://dash.cloudflare.com/profile/api-tokens) (Use "Edit Cloudflare Workers" template)
   - Account ID: Found in [Cloudflare Dashboard](https://dash.cloudflare.com/) (right sidebar)

2. **Add GitHub Secrets:**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add: `CLOUDFLARE_API_TOKEN`
   - Add: `CLOUDFLARE_ACCOUNT_ID`

3. **Create D1 Database:**
   ```bash
   wrangler d1 create my-database
   ```
   Update `wrangler.toml` with the database ID

4. **Run Migrations:**
   ```bash
   wrangler d1 migrations apply my-database --remote
   ```

5. **Deploy:**
   ```bash
   git push origin main
   ```

✅ **That's it!** GitHub Actions will automatically deploy your worker.

📖 [Full GitHub deployment guide →](GITHUB_DEPLOYMENT.md)

---

## 💻 Option 2: Manual Deployment

**Best for:** Local development, quick testing, one-time deployments

### Quick Setup (3 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Create D1 Database:**
   ```bash
   wrangler d1 create my-database
   ```
   Update `wrangler.toml` with the database ID

4. **Run Migrations:**
   ```bash
   npm run d1:migrate:remote
   ```

5. **Deploy:**
   ```bash
   npm run deploy
   ```

✅ **Done!** Your worker is live.

📖 [Full manual deployment guide →](DEPLOYMENT.md)

---

## 🖥️ Option 3: Self-Hosted Server

**Important Note:** Cloudflare Workers are designed to run on Cloudflare's edge network, not on self-hosted servers. 

However, if you need to run this code on your own server, you can adapt it to run as a standard Node.js application:

### Converting to Node.js Server

1. **Install Express:**
   ```bash
   npm install express
   ```

2. **Create a server adapter** (`server.js`):
   ```javascript
   const express = require('express');
   const app = express();
   
   // Import your worker code
   const worker = require('./dist/index.js');
   
   app.use(async (req, res) => {
     const request = new Request(req.url, {
       method: req.method,
       headers: req.headers,
       body: req.body
     });
     
     const response = await worker.default.fetch(request, env, {});
     res.status(response.status).send(await response.text());
   });
   
   app.listen(3000, () => {
     console.log('Server running on http://localhost:3000');
   });
   ```

3. **Handle D1 Database:**
   - D1 is Cloudflare-specific. Replace with SQLite or PostgreSQL
   - Update `src/database.ts` to use a different database client

**Recommendation:** Use GitHub Actions (Option 1) or Manual Deployment (Option 2) to deploy to Cloudflare Workers as designed. Self-hosting requires significant modifications.

---

## 🔄 Development Workflow

### Local Development
```bash
npm run dev
```
Access at: http://localhost:8787

### Type Checking
```bash
npm run type-check
```

### Testing
```bash
npm test
```

---

## 📊 Comparison

| Feature | GitHub Actions | Manual | Self-Hosted |
|---------|---------------|--------|-------------|
| Setup Time | 5 min | 3 min | 30+ min |
| Auto-deploy | ✅ Yes | ❌ No | ❌ No |
| Team-friendly | ✅ Yes | ⚠️ Partial | ⚠️ Partial |
| Cost | Free tier | Free tier | Server cost |
| CI/CD | ✅ Built-in | ❌ None | ⚠️ Manual |
| Edge Network | ✅ Yes | ✅ Yes | ❌ No |
| Maintenance | ✅ Low | ⚠️ Medium | ❌ High |
| Recommended | ✅ Production | ✅ Development | ❌ Not advised |

---

## 🆘 Need Help?

- **GitHub Actions issues:** See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md)
- **Manual deployment issues:** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **API usage:** See [EXAMPLES.md](EXAMPLES.md)
- **General setup:** See [README.md](README.md)

---

## 📝 Next Steps After Deployment

1. **Test your API:**
   ```bash
   curl https://your-worker.workers.dev/
   ```

2. **Create a user:**
   ```bash
   curl -X POST https://your-worker.workers.dev/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Test User", "email": "test@example.com"}'
   ```

3. **Try AI features:**
   ```bash
   curl -X POST https://your-worker.workers.dev/ai/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello, AI!"}'
   ```

4. **View logs:**
   - Cloudflare Dashboard → Workers → Your Worker → Logs

5. **Monitor usage:**
   - Cloudflare Dashboard → Workers → Analytics

---

**Choose the deployment method that works best for you and get started! 🚀**
