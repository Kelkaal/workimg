#!/bin/bash

# Server Initialization Script for Stock Keeping App Frontend
# This script should be run once on each server to set up the deployment environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Stock Keeping App Frontend - Server Initialization ===${NC}"

# Configuration
DEPLOY_USER=${1:-deploy}
DEV_PATH="/var/www/stock-keeping-dev"
STAGING_PATH="/var/www/stock-keeping-staging"
PROD_PATH="/var/www/stock-keeping"
NODE_VERSION="20"

# Function to print messages
log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
  log_error "This script must be run as root"
  exit 1
fi

# Create deployment directories
log_info "Creating deployment directories..."
mkdir -p "$DEV_PATH"
mkdir -p "$STAGING_PATH"
mkdir -p "$PROD_PATH"

# Set correct permissions
log_info "Setting directory permissions..."
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEV_PATH"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$STAGING_PATH"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$PROD_PATH"

chmod 755 "$DEV_PATH"
chmod 755 "$STAGING_PATH"
chmod 755 "$PROD_PATH"

# Check if Node.js is installed
log_info "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
  log_warn "Node.js not found. Please install Node.js version $NODE_VERSION"
  log_info "Visit: https://nodejs.org/"
  exit 1
else
  NODE_V=$(node -v)
  log_info "Node.js $NODE_V is installed"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  log_error "npm is not installed"
  exit 1
fi

# Check if PM2 is installed globally
log_info "Checking PM2 installation..."
if ! command -v pm2 &> /dev/null; then
  log_info "Installing PM2 globally..."
  npm install -g pm2
  log_info "PM2 installed successfully"
else
  PM2_V=$(pm2 -v)
  log_info "PM2 $PM2_V is already installed"
fi

# Setup PM2 startup
log_info "Configuring PM2 startup..."
pm2 startup || true
pm2 save || true

# Create ecosystem config file for easier PM2 management
log_info "Creating PM2 ecosystem configuration..."
cat > /tmp/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'stock-keeping-dev',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      cwd: '/var/www/stock-keeping-dev',
      env: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_API_URL: 'http://api.dev.soma.emerj.net:5001'
      },
      error_file: '/var/log/stock-keeping-dev-error.log',
      out_file: '/var/log/stock-keeping-dev-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'stock-keeping-staging',
      script: 'node_modules/.bin/next',
      args: 'start -p 3002',
      cwd: '/var/www/stock-keeping-staging',
      env: {
        NODE_ENV: 'staging',
        NEXT_PUBLIC_API_URL: 'http://api.staging.soma.emerj.net:5002'
      },
      error_file: '/var/log/stock-keeping-staging-error.log',
      out_file: '/var/log/stock-keeping-staging-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'stock-keeping',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/var/www/stock-keeping',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'http://api.soma.emerj.net:5000'
      },
      error_file: '/var/log/stock-keeping-error.log',
      out_file: '/var/log/stock-keeping-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
EOF

log_info "Ecosystem configuration created at /tmp/ecosystem.config.js"

# Create log directory
log_info "Creating log directory..."
mkdir -p /var/log
touch /var/log/stock-keeping-dev-error.log
touch /var/log/stock-keeping-dev-out.log
touch /var/log/stock-keeping-staging-error.log
touch /var/log/stock-keeping-staging-out.log
touch /var/log/stock-keeping-error.log
touch /var/log/stock-keeping-out.log

chown "$DEPLOY_USER:$DEPLOY_USER" /var/log/stock-keeping*.log

# Create .env template files
log_info "Creating .env template files..."

# Development environment
if [ ! -f "$DEV_PATH/.env.local" ]; then
  cat > "$DEV_PATH/.env.local.template" << 'EOF'
# Next.js Configuration - Development
NEXT_PUBLIC_API_URL=http://api.dev.soma.emerj.net:5001
NEXT_PUBLIC_APP_NAME=Stock Keeping App
NEXT_PUBLIC_APP_URL=http://dev.soma.emerj.net
EOF
  chown "$DEPLOY_USER:$DEPLOY_USER" "$DEV_PATH/.env.local.template"
  log_info ".env.local.template created at $DEV_PATH"
fi

# Staging environment
if [ ! -f "$STAGING_PATH/.env.local" ]; then
  cat > "$STAGING_PATH/.env.local.template" << 'EOF'
# Next.js Configuration - Staging
NEXT_PUBLIC_API_URL=http://api.staging.soma.emerj.net:5002
NEXT_PUBLIC_APP_NAME=Stock Keeping App
NEXT_PUBLIC_APP_URL=http://staging.soma.emerj.net
EOF
  chown "$DEPLOY_USER:$DEPLOY_USER" "$STAGING_PATH/.env.local.template"
  log_info ".env.local.template created at $STAGING_PATH"
fi

# Production environment
if [ ! -f "$PROD_PATH/.env.local" ]; then
  cat > "$PROD_PATH/.env.local.template" << 'EOF'
# Next.js Configuration - Production
NEXT_PUBLIC_API_URL=http://api.soma.emerj.net:5000
NEXT_PUBLIC_APP_NAME=Stock Keeping App
NEXT_PUBLIC_APP_URL=http://soma.emerj.net
EOF
  chown "$DEPLOY_USER:$DEPLOY_USER" "$PROD_PATH/.env.local.template"
  log_info ".env.local.template created at $PROD_PATH"
fi

# Create .gitignore for deployment directories if needed
log_info "Creating deployment directory structure..."
for path in "$DEV_PATH" "$STAGING_PATH" "$PROD_PATH"; do
  mkdir -p "$path/.next"
  mkdir -p "$path/public"
done

log_info "Setting up nginx configuration template (optional)..."
cat > /tmp/nginx-stock-keeping.conf.template << 'EOF'
# Add this to your nginx configuration
# Update your SSL certificates accordingly

upstream stock_keeping_dev {
    server 127.0.0.1:3001;
}

upstream stock_keeping_staging {
    server 127.0.0.1:3002;
}

upstream stock_keeping_prod {
    server 127.0.0.1:3000;
}

# Development Environment
server {
    listen 80;
    server_name dev.soma.emerj.net;

    location / {
        proxy_pass http://stock_keeping_dev;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Staging Environment
server {
    listen 80;
    server_name staging.soma.emerj.net;

    location / {
        proxy_pass http://stock_keeping_staging;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Production Environment
server {
    listen 80;
    server_name soma.emerj.net;

    location / {
        proxy_pass http://stock_keeping_prod;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

log_info "Nginx template saved to /tmp/nginx-stock-keeping.conf.template"

echo ""
log_info "=== Server Initialization Complete ==="
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Add your .env.local files to each deployment directory:"
echo "   - $DEV_PATH/.env.local"
echo "   - $STAGING_PATH/.env.local"
echo "   - $PROD_PATH/.env.local"
echo ""
echo "2. (Optional) Configure nginx using the template at /tmp/nginx-stock-keeping.conf.template"
echo ""
echo "3. Ensure GitHub SSH key is added to deploy user's ~/.ssh/authorized_keys"
echo ""
echo "4. Make sure ports 3000, 3001, 3002 are not in use or adjust in deployment configs"
echo ""
echo -e "${GREEN}The CI/CD pipeline is now ready for automated deployments!${NC}"
