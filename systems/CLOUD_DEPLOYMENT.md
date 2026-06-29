# Cloud Deployment Guide

This guide covers deploying the OpenAI and Zep Agent to various cloud platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Google Cloud Platform](#google-cloud-platform)
- [Azure Deployment](#azure-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying to any cloud platform, ensure you have:

1. **OpenAI API Key**: Get it from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Cloud account** with appropriate permissions
3. **Docker** (optional, but recommended for containerized deployments)
4. **Git** for cloning the repository

## Docker Deployment

### Local Docker Setup

1. **Build and run with Docker Compose** (includes Zep):
```bash
# Set your OpenAI API key
export OPENAI_API_KEY="sk-..."

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f agent

# Stop services
docker-compose down
```

2. **Build and run standalone** (external Zep):
```bash
# Build the image
docker build -t openai-zep-agent .

# Run the container
docker run -it --rm \
  -e OPENAI_API_KEY="sk-..." \
  -e ZEP_API_URL="https://your-zep-instance.com" \
  -e ZEP_API_KEY="your-zep-key" \
  openai-zep-agent
```

### Push to Docker Registry

```bash
# Tag the image
docker tag openai-zep-agent:latest your-registry/openai-zep-agent:latest

# Push to registry
docker push your-registry/openai-zep-agent:latest
```

## AWS Deployment

### Option 1: AWS ECS (Elastic Container Service)

1. **Push Docker image to ECR**:
```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create repository
aws ecr create-repository --repository-name openai-zep-agent

# Tag and push
docker tag openai-zep-agent:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/openai-zep-agent:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/openai-zep-agent:latest
```

2. **Create ECS Task Definition** (`ecs-task-definition.json`):
```json
{
  "family": "openai-zep-agent",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "agent",
      "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/openai-zep-agent:latest",
      "essential": true,
      "environment": [
        {"name": "ZEP_API_URL", "value": "http://zep-service:8000"}
      ],
      "secrets": [
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:YOUR_ACCOUNT_ID:secret:openai-api-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/openai-zep-agent",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

3. **Register and run**:
```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create or update service
aws ecs create-service \
  --cluster your-cluster \
  --service-name openai-zep-agent \
  --task-definition openai-zep-agent \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}"
```

### Option 2: AWS Lambda (Serverless)

1. **Create Lambda deployment package**:
```bash
# Install dependencies
pip install -r requirements.txt -t lambda_package/
cp agent.py agent_enhanced.py config.py lambda_package/

# Create lambda_handler.py
cat > lambda_package/lambda_handler.py << 'EOF'
import json
from agent import ZepOpenAIAgent

def lambda_handler(event, context):
    session_id = event.get('session_id', 'default')
    message = event.get('message', '')
    
    agent = ZepOpenAIAgent(session_id=session_id)
    response = agent.chat(message)
    
    return {
        'statusCode': 200,
        'body': json.dumps({'response': response})
    }
EOF

# Create ZIP
cd lambda_package && zip -r ../lambda_function.zip . && cd ..
```

2. **Deploy to Lambda**:
```bash
aws lambda create-function \
  --function-name openai-zep-agent \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler lambda_handler.lambda_handler \
  --zip-file fileb://lambda_function.zip \
  --timeout 60 \
  --memory-size 512 \
  --environment Variables={OPENAI_API_KEY=sk-...,ZEP_API_URL=https://...}
```

## Google Cloud Platform

### Option 1: Cloud Run

1. **Build and push to Container Registry**:
```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Build using Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/openai-zep-agent
```

2. **Deploy to Cloud Run**:
```bash
gcloud run deploy openai-zep-agent \
  --image gcr.io/YOUR_PROJECT_ID/openai-zep-agent \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=sk-...,ZEP_API_URL=https://... \
  --memory 512Mi \
  --timeout 300
```

### Option 2: Google Kubernetes Engine (GKE)

1. **Create Kubernetes deployment** (`k8s-deployment.yaml`):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openai-zep-agent
spec:
  replicas: 2
  selector:
    matchLabels:
      app: openai-zep-agent
  template:
    metadata:
      labels:
        app: openai-zep-agent
    spec:
      containers:
      - name: agent
        image: gcr.io/YOUR_PROJECT_ID/openai-zep-agent:latest
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
        - name: ZEP_API_URL
          value: "http://zep-service:8000"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

2. **Deploy to GKE**:
```bash
# Create cluster
gcloud container clusters create agent-cluster --num-nodes=2

# Create secret
kubectl create secret generic openai-secret --from-literal=api-key=sk-...

# Deploy
kubectl apply -f k8s-deployment.yaml
```

## Azure Deployment

### Azure Container Instances

1. **Create resource group**:
```bash
az group create --name openai-agent-rg --location eastus
```

2. **Deploy container**:
```bash
az container create \
  --resource-group openai-agent-rg \
  --name openai-zep-agent \
  --image your-registry/openai-zep-agent:latest \
  --dns-name-label openai-agent-unique \
  --ports 80 \
  --environment-variables \
    ZEP_API_URL=https://... \
  --secure-environment-variables \
    OPENAI_API_KEY=sk-... \
  --cpu 1 \
  --memory 1.5
```

### Azure App Service

1. **Create App Service Plan**:
```bash
az appservice plan create \
  --name openai-agent-plan \
  --resource-group openai-agent-rg \
  --is-linux \
  --sku B1
```

2. **Create Web App**:
```bash
az webapp create \
  --resource-group openai-agent-rg \
  --plan openai-agent-plan \
  --name openai-agent-webapp \
  --deployment-container-image-name your-registry/openai-zep-agent:latest
```

3. **Configure environment variables**:
```bash
az webapp config appsettings set \
  --resource-group openai-agent-rg \
  --name openai-agent-webapp \
  --settings \
    OPENAI_API_KEY=sk-... \
    ZEP_API_URL=https://...
```

## Heroku Deployment

1. **Create Heroku app**:
```bash
heroku create openai-zep-agent
```

2. **Add PostgreSQL addon** (for Zep):
```bash
heroku addons:create heroku-postgresql:mini
```

3. **Set environment variables**:
```bash
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set ZEP_API_URL=https://your-zep-instance.com
```

4. **Deploy via Git or Container Registry**:

**Option A: Git Deploy**
```bash
git push heroku main
```

**Option B: Container Deploy**
```bash
heroku container:push web
heroku container:release web
```

## Environment Variables

Required environment variables for all deployments:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key |
| `ZEP_API_URL` | No | http://localhost:8000 | Zep service URL |
| `ZEP_API_KEY` | No | - | Zep API key (if required) |
| `OPENAI_MODEL` | No | gpt-4 | OpenAI model to use |
| `AGENT_NAME` | No | Assistant | Agent name |
| `MAX_TOKENS` | No | 2000 | Max tokens per response |
| `TEMPERATURE` | No | 0.7 | Response randomness (0-1) |

### Storing Secrets Securely

**AWS**: Use AWS Secrets Manager or Systems Manager Parameter Store
```bash
aws secretsmanager create-secret \
  --name openai-api-key \
  --secret-string "sk-..."
```

**GCP**: Use Secret Manager
```bash
echo -n "sk-..." | gcloud secrets create openai-api-key --data-file=-
```

**Azure**: Use Key Vault
```bash
az keyvault secret set \
  --vault-name your-keyvault \
  --name openai-api-key \
  --value "sk-..."
```

## Zep Deployment Options

### Option 1: Self-hosted Zep

Deploy Zep using Docker Compose (included in `docker-compose.yml`):
```bash
docker-compose up -d zep postgres
```

### Option 2: Zep Cloud

Sign up at [getzep.com](https://www.getzep.com) and use the provided API URL and key.

### Option 3: Deploy Zep to Cloud

Follow Zep's deployment guides for your preferred platform:
- [Zep Documentation](https://docs.getzep.com/)

## Monitoring and Logging

### CloudWatch (AWS)
```bash
aws logs tail /ecs/openai-zep-agent --follow
```

### Cloud Logging (GCP)
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=openai-zep-agent" --limit 50
```

### Azure Monitor
```bash
az monitor log-analytics query \
  --workspace YOUR_WORKSPACE_ID \
  --analytics-query "ContainerLog | where ContainerName == 'openai-zep-agent'"
```

## Troubleshooting

### Common Issues

**1. "OPENAI_API_KEY is required" error**
- Ensure environment variable is set correctly
- Check for typos in variable name
- Verify the secret/config is accessible in your cloud platform

**2. Zep connection failures**
- Verify `ZEP_API_URL` is correct and accessible
- Check network security groups/firewall rules
- Ensure Zep service is running and healthy

**3. Memory/Token limit errors**
- Adjust `MAX_TOKENS` environment variable
- Use the enhanced agent with dynamic context management
- Monitor memory usage and scale resources

**4. Container startup failures**
- Check logs for specific error messages
- Verify all dependencies are installed correctly
- Ensure sufficient memory/CPU allocation

### Health Checks

Test your deployment:
```bash
# Basic health check
curl -X POST https://your-deployment-url/health

# Test agent endpoint
curl -X POST https://your-deployment-url/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test", "message": "Hello"}'
```

## Scaling Considerations

1. **Horizontal Scaling**: Increase replicas/instances for higher load
2. **Vertical Scaling**: Increase CPU/memory for complex operations
3. **Load Balancing**: Use cloud provider's load balancer for distribution
4. **Caching**: Consider caching responses for common queries
5. **Rate Limiting**: Implement rate limiting to control API costs

## Cost Optimization

1. **Use spot instances** (AWS) or preemptible VMs (GCP) for non-critical workloads
2. **Auto-scaling**: Configure based on actual usage patterns
3. **Model selection**: Consider using GPT-3.5-turbo for cost-sensitive applications
4. **Token limits**: Set appropriate `MAX_TOKENS` to control costs
5. **Memory cleanup**: Clear old conversations regularly

## Next Steps

After deployment:

1. **Monitor performance**: Set up dashboards and alerts
2. **Test thoroughly**: Run integration tests against deployed instance
3. **Document endpoints**: Create API documentation for your team
4. **Set up CI/CD**: Automate deployments with GitHub Actions or similar
5. **Backup data**: Ensure Zep database is backed up regularly

## Support

For issues specific to:
- **This agent**: Create an issue in the repository
- **OpenAI API**: Check [OpenAI Documentation](https://platform.openai.com/docs)
- **Zep**: Check [Zep Documentation](https://docs.getzep.com/)
- **Cloud platforms**: Refer to their respective documentation
