# GitHub Actions Deployment Guide

This repository contains GitHub Actions workflows for automated deployment to Azure Container Apps.

## Workflows

### 1. `deploy-backend.yml` - Backend Only Deployment
Triggers on:
- Push to `main` branch with changes in `PosBackend/**`
- Manual workflow dispatch

### 2. `deploy-frontend.yml` - Frontend Only Deployment
Triggers on:
- Push to `main` branch with changes in `PosFrontend/**`
- Manual workflow dispatch

### 3. `deploy-all.yml` - Full Stack Deployment
Triggers on:
- Push to `main` branch (any changes)
- Manual workflow dispatch

## Required GitHub Secrets

Add these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Azure Credentials
- `AZURE_CREDENTIALS` - Azure service principal credentials (JSON format)
  ```json
  {
    "clientId": "<client-id>",
    "clientSecret": "<client-secret>",
    "subscriptionId": "<subscription-id>",
    "tenantId": "<tenant-id>"
  }
  ```
- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription ID

### Container Registry
- `AZUREAPPSERVICE_CONTAINERUSERNAME` - Container registry username
- `AZUREAPPSERVICE_CONTAINERPASSWORD` - Container registry password

### Dataverse (Backend)
- `DATAVERSE_SERVICE_URL` - Dataverse service URL (e.g., https://your-org.crm.dynamics.com)
- `DATAVERSE_CLIENT_ID` - Dataverse app client ID
- `DATAVERSE_CLIENT_SECRET` - Dataverse app client secret
- `DATAVERSE_TENANT_ID` - Azure AD tenant ID

## Required GitHub Variables

Add these variables in your GitHub repository settings (Settings → Secrets and variables → Actions → Variables):

### Infrastructure
- `RESOURCE_GROUP` - Azure resource group name (e.g., rg-pos-prod)
- `CONTAINER_REGISTRY` - Container registry URL (e.g., yourregistry.azurecr.io)
- `BACKEND_CONTAINER_APP_NAME` - Backend container app name (e.g., aca-pos-backend)
- `FRONTEND_CONTAINER_APP_NAME` - Frontend container app name (e.g., aca-pos-frontend)

### Application URLs
- `FRONTEND_URL` - Frontend URL for CORS (e.g., https://pos.example.com)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (e.g., https://api-pos.example.com)

## Setup Steps

### 1. Create Azure Service Principal

```bash
az ad sp create-for-rbac \
  --name "github-actions-pos" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
  --sdk-auth
```

Copy the JSON output to `AZURE_CREDENTIALS` secret.

### 2. Create Azure Container Registry

```bash
az acr create \
  --resource-group rg-pos-prod \
  --name yourposregistry \
  --sku Basic \
  --admin-enabled true
```

Get credentials:
```bash
az acr credential show --name yourposregistry
```

### 3. Create Azure Container Apps

```bash
# Create Container Apps Environment
az containerapp env create \
  --name pos-env \
  --resource-group rg-pos-prod \
  --location eastus

# Create Backend Container App
az containerapp create \
  --name aca-pos-backend \
  --resource-group rg-pos-prod \
  --environment pos-env \
  --image yourposregistry.azurecr.io/pos-backend:latest \
  --target-port 8080 \
  --ingress external \
  --registry-server yourposregistry.azurecr.io \
  --query properties.configuration.ingress.fqdn

# Create Frontend Container App
az containerapp create \
  --name aca-pos-frontend \
  --resource-group rg-pos-prod \
  --environment pos-env \
  --image yourposregistry.azurecr.io/pos-frontend:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server yourposregistry.azurecr.io \
  --query properties.configuration.ingress.fqdn
```

### 4. Register Dataverse Application

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Click "New registration"
3. Set redirect URIs and API permissions
4. Create client secret
5. Copy Application (client) ID, Directory (tenant) ID, and client secret

### 5. Configure GitHub Secrets and Variables

Add all secrets and variables listed above to your GitHub repository.

### 6. Create Production Environment

1. Go to your GitHub repository → Settings → Environments
2. Click "New environment"
3. Name it `production`
4. Add protection rules (optional):
   - Required reviewers
   - Wait timer
   - Deployment branches (only `main`)

## Manual Deployment

You can manually trigger deployments from the GitHub Actions tab:

1. Go to Actions → Select workflow
2. Click "Run workflow"
3. Select branch (usually `main`)
4. Click "Run workflow"

## Monitoring Deployments

- View workflow runs in the Actions tab
- Check Azure Container Apps logs:
  ```bash
  az containerapp logs show \
    --name aca-pos-backend \
    --resource-group rg-pos-prod \
    --follow
  ```

## Troubleshooting

### Build Fails
- Check that all secrets and variables are correctly set
- Verify Dockerfile paths are correct
- Check Docker build logs in workflow output

### Deployment Fails
- Verify Azure credentials are valid
- Check that Container Apps exist
- Verify registry credentials
- Check Container App logs for runtime errors

### Application Not Working
- Verify environment variables in Container Apps
- Check CORS settings match frontend URL
- Verify Dataverse credentials and permissions
- Check network/firewall rules

## Local Testing

Test Docker builds locally before pushing:

```bash
# Backend
cd PosBackend
docker build -t pos-backend:local .
docker run -p 8080:8080 pos-backend:local

# Frontend
cd PosFrontend
docker build -t pos-frontend:local .
docker run -p 3000:3000 pos-frontend:local
```

## Rollback

If a deployment fails, rollback to previous version:

```bash
# List revisions
az containerapp revision list \
  --name aca-pos-backend \
  --resource-group rg-pos-prod

# Activate previous revision
az containerapp revision activate \
  --revision <revision-name> \
  --resource-group rg-pos-prod
```
