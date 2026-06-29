#!/bin/bash
# Cloud Initialization Helper Script for OpenAI and Zep Agent

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo "════════════════════════════════════════════════════════"
echo "   OpenAI and Zep Agent - Cloud Initialization Helper   "
echo "════════════════════════════════════════════════════════"
echo ""

# Check prerequisites
print_info "Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed"
    exit 1
fi
print_success "Python 3 is installed: $(python3 --version)"

# Check pip
if ! command -v pip3 &> /dev/null; then
    print_error "pip3 is not installed"
    exit 1
fi
print_success "pip3 is installed"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    print_success "Docker is installed: $(docker --version)"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker is not installed (optional for containerized deployment)"
    DOCKER_AVAILABLE=false
fi

echo ""

# Deployment method selection
print_info "Select deployment method:"
echo "1) Local (for testing)"
echo "2) Docker Compose (recommended for local/dev)"
echo "3) AWS (ECS, Lambda, etc.)"
echo "4) Google Cloud Platform (Cloud Run, GKE)"
echo "5) Azure (Container Instances, App Service)"
echo "6) Heroku"
echo "7) Custom (manual setup)"
read -p "Enter choice [1-7]: " deployment_choice

echo ""

# Environment setup
print_info "Setting up environment configuration..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
    else
        print_error ".env.example not found"
        exit 1
    fi
else
    print_info ".env file already exists"
fi

# Prompt for OpenAI API key
echo ""
print_info "API Key Configuration"
read -sp "Enter your OpenAI API key (or press Enter to skip): " openai_key
echo ""

if [ ! -z "$openai_key" ]; then
    # Update .env file
    if grep -q "^OPENAI_API_KEY=" .env; then
        sed -i "s/^OPENAI_API_KEY=.*/OPENAI_API_KEY=$openai_key/" .env
    else
        echo "OPENAI_API_KEY=$openai_key" >> .env
    fi
    print_success "OpenAI API key configured"
else
    print_warning "OpenAI API key not configured. You'll need to set it manually in .env"
fi

# Zep configuration
echo ""
read -p "Do you want to use Zep Cloud or self-hosted Zep? [cloud/self/skip]: " zep_choice

case $zep_choice in
    cloud)
        read -p "Enter Zep Cloud API URL: " zep_url
        read -sp "Enter Zep Cloud API Key: " zep_key
        echo ""
        
        if grep -q "^ZEP_API_URL=" .env; then
            sed -i "s|^ZEP_API_URL=.*|ZEP_API_URL=$zep_url|" .env
        else
            echo "ZEP_API_URL=$zep_url" >> .env
        fi
        
        if [ ! -z "$zep_key" ]; then
            if grep -q "^ZEP_API_KEY=" .env; then
                sed -i "s/^ZEP_API_KEY=.*/ZEP_API_KEY=$zep_key/" .env
            else
                echo "ZEP_API_KEY=$zep_key" >> .env
            fi
        fi
        print_success "Zep Cloud configured"
        ;;
    self)
        print_info "Self-hosted Zep will use docker-compose setup"
        if grep -q "^ZEP_API_URL=" .env; then
            sed -i "s|^ZEP_API_URL=.*|ZEP_API_URL=http://localhost:8000|" .env
        fi
        ;;
    *)
        print_warning "Zep configuration skipped. Agent will work without persistent memory."
        ;;
esac

echo ""

# Install dependencies
print_info "Installing Python dependencies..."
if pip3 install -r requirements.txt; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo ""

# Deployment-specific steps
case $deployment_choice in
    1)
        print_info "=== Local Deployment ==="
        print_info "You can now run the agent locally:"
        echo ""
        echo "  Basic example:        python3 example.py"
        echo "  Enhanced agent:       python3 example_enhanced.py"
        echo "  Advanced examples:    python3 examples_advanced.py"
        echo ""
        print_info "Make sure your .env file is properly configured"
        ;;
    
    2)
        print_info "=== Docker Compose Deployment ==="
        if [ "$DOCKER_AVAILABLE" = true ]; then
            print_info "Building and starting services..."
            if docker-compose up -d; then
                print_success "Services started successfully"
                echo ""
                echo "Services running:"
                docker-compose ps
                echo ""
                print_info "View logs with: docker-compose logs -f"
                print_info "Stop services with: docker-compose down"
            else
                print_error "Failed to start services"
                exit 1
            fi
        else
            print_error "Docker is required for this deployment method"
            exit 1
        fi
        ;;
    
    3)
        print_info "=== AWS Deployment ==="
        print_info "Please follow the AWS deployment guide in CLOUD_DEPLOYMENT.md"
        print_info "Key steps:"
        echo "  1. Build Docker image: docker build -t openai-zep-agent ."
        echo "  2. Push to ECR: aws ecr get-login-password | docker login ..."
        echo "  3. Deploy to ECS or Lambda"
        echo ""
        print_info "See CLOUD_DEPLOYMENT.md for detailed instructions"
        ;;
    
    4)
        print_info "=== Google Cloud Platform Deployment ==="
        print_info "Please follow the GCP deployment guide in CLOUD_DEPLOYMENT.md"
        print_info "Key steps:"
        echo "  1. Build with Cloud Build: gcloud builds submit --tag gcr.io/PROJECT/openai-zep-agent"
        echo "  2. Deploy to Cloud Run: gcloud run deploy ..."
        echo ""
        print_info "See CLOUD_DEPLOYMENT.md for detailed instructions"
        ;;
    
    5)
        print_info "=== Azure Deployment ==="
        print_info "Please follow the Azure deployment guide in CLOUD_DEPLOYMENT.md"
        print_info "Key steps:"
        echo "  1. Create resource group: az group create ..."
        echo "  2. Deploy container: az container create ..."
        echo ""
        print_info "See CLOUD_DEPLOYMENT.md for detailed instructions"
        ;;
    
    6)
        print_info "=== Heroku Deployment ==="
        print_info "Please follow the Heroku deployment guide in CLOUD_DEPLOYMENT.md"
        print_info "Key steps:"
        echo "  1. Create app: heroku create openai-zep-agent"
        echo "  2. Set config: heroku config:set OPENAI_API_KEY=..."
        echo "  3. Deploy: git push heroku main"
        echo ""
        print_info "See CLOUD_DEPLOYMENT.md for detailed instructions"
        ;;
    
    7)
        print_info "=== Custom Deployment ==="
        print_info "For custom deployment, refer to CLOUD_DEPLOYMENT.md"
        print_info "Configuration files created:"
        echo "  - Dockerfile"
        echo "  - docker-compose.yml"
        echo "  - .env (configured)"
        ;;
esac

echo ""

# Run tests
print_info "Running tests to verify installation..."
if python3 -m pytest test_enhanced.py -v 2>/dev/null || python3 test_enhanced.py; then
    print_success "All tests passed!"
else
    print_warning "Some tests failed. Check your configuration."
fi

echo ""
echo "════════════════════════════════════════════════════════"
print_success "Initialization complete!"
echo "════════════════════════════════════════════════════════"
echo ""
print_info "Next steps:"
echo "  1. Review your .env configuration"
echo "  2. Check CLOUD_DEPLOYMENT.md for detailed deployment guides"
echo "  3. Test locally before deploying to cloud"
echo "  4. Monitor your deployment after launch"
echo ""
print_info "Documentation:"
echo "  - Quick Start:         QUICKSTART.md"
echo "  - Cloud Deployment:    CLOUD_DEPLOYMENT.md"
echo "  - Architecture:        ARCHITECTURE.md"
echo "  - Full Guide:          README.md"
echo ""
print_success "Happy deploying! 🚀"
