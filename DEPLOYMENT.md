# Stock Keeping App - Deployment Guide

This document explains the automated CI/CD pipeline setup for the Stock Keeping App frontend.

## Overview

The CI/CD pipeline automatically deploys your application when you push to specific branches:

- **`dev` branch** → Deploys to **Development** server (port 3001)

  - URL: `http://dev.soma.emerj.net`
  - API: `http://api.dev.soma.emerj.net:5001`

- **`staging` branch** → Deploys to **Staging** server (port 3002)

  - URL: `http://staging.soma.emerj.net`
  - API: `http://api.staging.soma.emerj.net:5002`

- **`main` branch** → Deploys to **Production** server (port 3000)
  - URL: `http://soma.emerj.net`
  - API: `http://api.soma.emerj.net:5000`

## Prerequisites

### On Your Local Machine

- Git configured with SSH keys
- Push access to the repository

### On Servers

- Node.js 20+ installed
- npm installed
- PM2 installed globally (`npm install -g pm2`)
- SSH access for deploy user
- Ports 3000, 3001, 3002 available

## Initial Server Setup

### Step 1: Run Server Initialization Script

Copy the `scripts/init-server.sh` to your server and run it as root:

```bash
# On the server
sudo bash /path/to/init-server.sh deploy
```

This script will:

- Create deployment directories (`/var/www/stock-keeping*`)
- Install PM2 globally
- Set up PM2 startup configuration
- Create log directories
- Generate environment file templates
- Provide nginx configuration example

### Step 2: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
SSH_HOST        - Your server's IP address or hostname
SSH_USER      - The deploy user (default: deploy)
SSH_PRIVATE_KEY   - Private SSH key for the deploy user
```

To generate SSH keys for the deploy user:

```bash
# On the server as the deploy user
ssh-keygen -t ed25519 -C "github-deploy@stock-keeping" -f ~/.ssh/github_deploy
chmod 600 ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
```

Copy the contents of `~/.ssh/github_deploy` and add it as `SSH_PRIVATE_KEY` secret in GitHub.

### Step 3: Configure Environment Variables

The initialization script creates `.env.local.template` files in each directory with the correct API endpoints. Copy them to `.env.local`:

```bash
# On the server - Development
cd /var/www/stock-keeping-dev
cp .env.local.template .env.local

# Staging
cd /var/www/stock-keeping-staging
cp .env.local.template .env.local

# Production
cd /var/www/stock-keeping
cp .env.local.template .env.local
```

The templates already contain:

- **Development**: `NEXT_PUBLIC_API_URL=http://api.dev.soma.emerj.net:5001`
- **Staging**: `NEXT_PUBLIC_API_URL=http://api.staging.soma.emerj.net:5002`
- **Production**: `NEXT_PUBLIC_API_URL=http://api.soma.emerj.net:5000`

You can customize these if needed, but the defaults should work.

## Workflow

### Development Workflow

1. Create a feature branch from `dev`

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature
   ```

2. Commit and push your changes

   ```bash
   git add .
   git commit -m "Add your feature"
   git push origin feature/your-feature
   ```

3. Create a Pull Request on GitHub

   - This triggers the **CI Checks** (linting, building)
   - Your code must pass all checks before merging

4. Merge to `dev` branch
   - The **Deploy to DEV** workflow automatically triggers
   - Your changes are deployed to the development server

### Staging Workflow

1. Create PR from `dev` to `staging` branch

   - CI checks run automatically

2. Merge to `staging`
   - **Deploy to STAGING** workflow triggers
   - Changes deployed to staging server

### Production Workflow

1. Create PR from `staging` to `main` branch

   - All CI checks must pass

2. Merge to `main`
   - **Deploy to PROD** workflow triggers
   - Changes deployed to production server

## Deployment Process

Each deployment workflow performs these steps:

### Build Job

- Runs on `hng-13-runner`
- Installs dependencies
- Runs linting checks
- Builds the Next.js application

### Deploy Job (runs after Build succeeds)

- Checks out the code
- Builds the application
- Uploads build artifacts and dependencies to the server
- Installs production dependencies on the server
- Restarts the PM2 application

## Monitoring Deployments

### GitHub Actions

View workflow runs at: `https://github.com/your-repo/actions`

### Server Logs

Check PM2 status:

```bash
pm2 status
```

View application logs:

```bash
pm2 logs stock-keeping-dev
pm2 logs stock-keeping-staging
pm2 logs stock-keeping
```

View raw logs:

```bash
# Development
tail -f /var/log/stock-keeping-dev-error.log
tail -f /var/log/stock-keeping-dev-out.log

# Staging
tail -f /var/log/stock-keeping-staging-error.log
tail -f /var/log/stock-keeping-staging-out.log

# Production
tail -f /var/log/stock-keeping-error.log
tail -f /var/log/stock-keeping-out.log
```

## Troubleshooting

### Deployment fails with "Permission denied"

- Verify `SSH_PRIVATE_KEY` secret is correct
- Ensure the deploy user has write permissions to `/var/www`

### Build fails locally but passes in CI

- Run `npm ci` instead of `npm install`
- Check node version with `node -v` (should be 20+)
- Run linter: `npm run lint`

### Application won't start after deployment

- Check PM2 logs: `pm2 logs`
- Verify `.env.local` files exist and are correct
- Ensure ports 3000/3001/3002 are available
- Check Node.js version on server

### Port already in use

- Find process using the port:
  ```bash
  lsof -i :3000
  lsof -i :3001
  lsof -i :3002
  ```
- Update port numbers in workflow files if needed

## Manual Deployment

You can manually trigger a deployment without pushing code:

1. Go to GitHub Actions
2. Select the deployment workflow (Deploy to DEV/STAGING/PROD)
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Rollback

To rollback to a previous version:

```bash
# On the server
pm2 restart stock-keeping-dev
```

Or revert the commit and push again:

```bash
git revert <commit-hash>
git push origin dev
```

## Performance Tips

- Deployments typically take 2-5 minutes
- Build job runs on `hng-13-runner` (faster)
- Deploy job runs on `ubuntu-latest`
- Both .next build and node_modules are cached by GitHub Actions

## Security Notes

- Never commit secrets or `.env.local` files
- Use GitHub Secrets for sensitive data
- SSH keys should have appropriate permissions (600)
- Rotate deploy SSH keys regularly
- Use different SSH keys for each environment if possible

## Next Steps

1. Run initialization script on each server:

   ```bash
   sudo bash scripts/init-server.sh deploy
   ```

2. Add GitHub Secrets to your repository:

   - `SSH_HOST` - Your server's IP or hostname
   - `SSH_USER` - The deploy username (default: deploy)
   - `SSH_PRIVATE_KEY` - Private SSH key for the deploy user

3. On each server, create `.env.local` files:

   ```bash
   cp /var/www/stock-keeping-dev/.env.local.template /var/www/stock-keeping-dev/.env.local
   cp /var/www/stock-keeping-staging/.env.local.template /var/www/stock-keeping-staging/.env.local
   cp /var/www/stock-keeping/.env.local.template /var/www/stock-keeping/.env.local
   ```

4. Test a deployment by pushing to the dev branch

5. Monitor logs to ensure deployment succeeded:
   ```bash
   pm2 logs stock-keeping-dev
   ```

Your deployment pipeline is now ready to automatically deploy on every push!
