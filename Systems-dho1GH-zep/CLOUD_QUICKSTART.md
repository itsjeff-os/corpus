# Quick Cloud Deployment Guide

Get your OpenAI and Zep Agent running in the cloud in minutes!

## 🚀 Quick Start Options

### Option 1: One-Command Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/dho1GH/Systems.git
cd Systems

# Run the initialization script
chmod +x init_cloud.sh
./init_cloud.sh
```

The script will:
- ✅ Check prerequisites
- ✅ Configure environment variables
- ✅ Install dependencies
- ✅ Guide you through deployment options
- ✅ Run tests to verify setup

### Option 2: Docker Compose (Fastest for Local/Dev)

```bash
# 1. Set your API key
export OPENAI_API_KEY="sk-your-key-here"

# 2. Start everything (includes Zep + PostgreSQL)
docker-compose up -d

# 3. View logs
docker-compose logs -f agent

# 4. Test it
curl -X POST http://localhost:5000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

### Option 3: Manual Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 3. Run locally
python example.py
# Or run as API server
python api.py
```

## 🌐 Cloud Platform Quick Deploy

### AWS (5 minutes)

```bash
# Build and push to ECR
aws ecr create-repository --repository-name openai-zep-agent
docker build -t openai-zep-agent .
docker tag openai-zep-agent:latest $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/openai-zep-agent:latest
docker push $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/openai-zep-agent:latest

# Deploy to ECS Fargate
aws ecs create-service \
  --cluster my-cluster \
  --service-name openai-agent \
  --task-definition openai-agent \
  --launch-type FARGATE
```

### Google Cloud (3 minutes)

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/$PROJECT_ID/openai-zep-agent
gcloud run deploy openai-zep-agent \
  --image gcr.io/$PROJECT_ID/openai-zep-agent \
  --platform managed \
  --set-env-vars OPENAI_API_KEY=$OPENAI_API_KEY
```

### Heroku (2 minutes)

```bash
# Login and create app
heroku login
heroku create my-openai-agent

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-...

# Deploy
git push heroku main
```

## 📋 Required Configuration

Only one environment variable is required:

```bash
OPENAI_API_KEY=sk-your-openai-key-here
```

Optional configurations:
```bash
ZEP_API_URL=http://localhost:8000  # Zep server (optional)
ZEP_API_KEY=your-zep-key           # If using Zep Cloud
OPENAI_MODEL=gpt-4                 # Or gpt-3.5-turbo
MAX_TOKENS=2000                    # Response length limit
TEMPERATURE=0.7                    # Creativity level
```

## 🧪 Testing Your Deployment

### Test Basic Chat
```bash
curl -X POST http://your-deployment-url/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "session_id": "test-session"
  }'
```

### Test Enhanced Agent with Graph
```bash
curl -X POST http://your-deployment-url/api/v1/chat/enhanced \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about Python",
    "session_id": "test-session",
    "use_dynamic_context": true,
    "enable_graph": true
  }'
```

### Check Health
```bash
curl http://your-deployment-url/health
```

## 📚 API Endpoints

Once deployed, your agent exposes these REST endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/chat` | POST | Basic chat |
| `/api/v1/chat/enhanced` | POST | Enhanced chat with graph |
| `/api/v1/session/:id/clear` | POST | Clear session memory |
| `/api/v1/session/:id/graph` | GET | Get conversation graph |
| `/api/v1/sessions` | GET | List active sessions |

## 🔧 Troubleshooting

**"OPENAI_API_KEY is required" error:**
```bash
# Set it in your environment
export OPENAI_API_KEY="sk-..."

# Or add to .env file
echo "OPENAI_API_KEY=sk-..." >> .env
```

**Docker build fails:**
```bash
# Make sure you're in the project directory
cd Systems

# Try building with no cache
docker build --no-cache -t openai-zep-agent .
```

**Tests failing:**
```bash
# Install test dependencies
pip install pytest

# Run tests
pytest test_enhanced.py -v
```

## 📖 Next Steps

1. **Read the full guides:**
   - [CLOUD_DEPLOYMENT.md](CLOUD_DEPLOYMENT.md) - Comprehensive deployment guide
   - [README.md](README.md) - Full documentation
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

2. **Customize your agent:**
   - Modify system prompts in `config.py`
   - Add custom endpoints in `api.py`
   - Extend features in `agent_enhanced.py`

3. **Set up monitoring:**
   - Configure logging in your cloud platform
   - Set up alerts for errors
   - Monitor API usage and costs

4. **Scale your deployment:**
   - Add load balancing
   - Configure auto-scaling
   - Implement caching

## 💡 Pro Tips

1. **Start with GPT-3.5-turbo** to save costs during development
2. **Use Zep Cloud** if you don't want to manage the Zep server
3. **Enable dynamic context** for long conversations to optimize tokens
4. **Monitor your OpenAI usage** to control costs
5. **Back up your Zep database** regularly

## 🆘 Need Help?

- **Documentation**: Check the full guides in this repository
- **Issues**: Create an issue on GitHub
- **OpenAI API**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Zep Docs**: [docs.getzep.com](https://docs.getzep.com)

## 🎉 Success!

Once deployed, you'll have:
- ✅ A working AI agent with persistent memory
- ✅ REST API for easy integration
- ✅ Conversational graph tracking
- ✅ Dynamic context management
- ✅ Scalable cloud infrastructure

Happy deploying! 🚀
