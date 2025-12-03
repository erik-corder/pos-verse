# Security Configuration Guide

## ⚠️ IMPORTANT: Credentials Management

This repository contains template configuration files with placeholder values. **NEVER commit actual credentials to source control.**

## Protected Files (Already in .gitignore)

### Backend
- `appsettings.json` - Contains Dataverse credentials
- `appsettings.Production.json` - Production credentials
- `appsettings.*.json` - Environment-specific credentials

### Frontend  
- `.env.local` - Local environment variables
- `.env.production` - Production environment variables
- `.env*.local` - All local environment files

## Setup Instructions

### Backend Configuration

1. Copy the example file:
   ```bash
   cd PosBackend
   # The appsettings.json exists with placeholders - update it with your credentials
   ```

2. **Option A: Update appsettings.json (Local Development Only)**
   ```json
   {
     "Dataverse": {
       "Url": "https://your-actual-org.api.crm.dynamics.com",
       "TenantId": "your-actual-tenant-id",
       "ClientId": "your-actual-client-id",
       "ClientSecret": "your-actual-client-secret"
     }
   }
   ```

3. **Option B: Use User Secrets (Recommended for Development)**
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "Dataverse:Url" "https://your-org.api.crm.dynamics.com"
   dotnet user-secrets set "Dataverse:TenantId" "your-tenant-id"
   dotnet user-secrets set "Dataverse:ClientId" "your-client-id"
   dotnet user-secrets set "Dataverse:ClientSecret" "your-client-secret"
   ```

4. **Option C: Use Environment Variables (Production)**
   ```bash
   export Dataverse__Url="https://your-org.api.crm.dynamics.com"
   export Dataverse__TenantId="your-tenant-id"
   export Dataverse__ClientId="your-client-id"
   export Dataverse__ClientSecret="your-client-secret"
   ```

### Frontend Configuration

1. Copy the example file:
   ```bash
   cd PosFrontend
   cp .env.example .env.local
   ```

2. Update `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://localhost:5001
   ```

## Azure Deployment

For GitHub Actions deployment, configure these secrets in your repository:

### GitHub Secrets (Settings → Secrets and variables → Actions → Secrets)
- `AZURE_CREDENTIALS` - Azure service principal JSON
- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription ID
- `AZUREAPPSERVICE_CONTAINERUSERNAME` - Container registry username
- `AZUREAPPSERVICE_CONTAINERPASSWORD` - Container registry password
- `DATAVERSE_SERVICE_URL` - Dataverse service URL
- `DATAVERSE_CLIENT_ID` - Dataverse app client ID
- `DATAVERSE_CLIENT_SECRET` - Dataverse app client secret
- `DATAVERSE_TENANT_ID` - Azure AD tenant ID

### GitHub Variables (Settings → Secrets and variables → Actions → Variables)
- `RESOURCE_GROUP` - Azure resource group name
- `CONTAINER_REGISTRY` - Container registry URL
- `BACKEND_CONTAINER_APP_NAME` - Backend container app name
- `FRONTEND_CONTAINER_APP_NAME` - Frontend container app name
- `FRONTEND_URL` - Frontend URL for CORS
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL

## Verification Checklist

Before committing:
- [ ] `appsettings.json` contains only placeholders (no real credentials)
- [ ] `.env.local` is not staged for commit
- [ ] `.gitignore` includes all sensitive files
- [ ] No secrets in any markdown documentation files
- [ ] User secrets or environment variables configured locally

## If You Accidentally Committed Secrets

1. **Immediately revoke/rotate the exposed credentials** in Azure Portal
2. Remove secrets from history:
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   # Or create a new repository with cleaned history
   ```
3. Add the file to `.gitignore` if not already present
4. Generate new credentials and configure them securely

## Best Practices

✅ **DO:**
- Use User Secrets for local development
- Use Azure Key Vault for production
- Use environment variables in CI/CD pipelines
- Keep `.gitignore` up to date
- Use template files with placeholders

❌ **DON'T:**
- Commit actual credentials to Git
- Share credentials via email or chat
- Hard-code secrets in source code
- Use production credentials in development
- Push to public repositories without checking for secrets

## Resources

- [GitHub Secret Scanning](https://docs.github.com/code-security/secret-scanning)
- [ASP.NET Core User Secrets](https://docs.microsoft.com/aspnet/core/security/app-secrets)
- [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/)
- [.NET Configuration](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/)
