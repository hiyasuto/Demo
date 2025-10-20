# Deployment Guide

This guide walks you through deploying the Azure Sales Negotiation Log application to Azure.

## Prerequisites

- Azure subscription
- Azure CLI installed and configured
- GitHub account with repository access
- Domain name (optional, for custom domains)

## Step 1: Create Azure Resources

### 1.1 Resource Group

```bash
az group create --name azure-sales-log-rg --location eastus
```

### 1.2 Azure SQL Database

```bash
# Create SQL Server
az sql server create \
  --name azure-sales-log-sql \
  --resource-group azure-sales-log-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password <YourSecurePassword>

# Create Database
az sql db create \
  --resource-group azure-sales-log-rg \
  --server azure-sales-log-sql \
  --name AzureSalesLog \
  --service-objective S0

# Configure firewall (allow Azure services)
az sql server firewall-rule create \
  --resource-group azure-sales-log-rg \
  --server azure-sales-log-sql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 1.3 Azure Storage Account

```bash
# Create storage account
az storage account create \
  --name azuresaleslogstorage \
  --resource-group azure-sales-log-rg \
  --location eastus \
  --sku Standard_LRS

# Create container for attachments
az storage container create \
  --name attachments \
  --account-name azuresaleslogstorage \
  --auth-mode login
```

### 1.4 App Service Plan

```bash
az appservice plan create \
  --name azure-sales-log-plan \
  --resource-group azure-sales-log-rg \
  --location eastus \
  --sku B1 \
  --is-linux
```

### 1.5 App Services

```bash
# Frontend Web App
az webapp create \
  --name azure-sales-log-web \
  --resource-group azure-sales-log-rg \
  --plan azure-sales-log-plan \
  --runtime "NODE|20-lts"

# API Web App
az webapp create \
  --name azure-sales-log-api \
  --resource-group azure-sales-log-rg \
  --plan azure-sales-log-plan \
  --runtime "DOTNET|9.0"
```

### 1.6 Application Insights (Optional)

```bash
az monitor app-insights component create \
  --app azure-sales-log-insights \
  --location eastus \
  --resource-group azure-sales-log-rg
```

## Step 2: Configure Azure AD App Registration

1. Go to Azure Portal → Azure Active Directory → App registrations
2. Create new registration:
   - Name: `Azure Sales Log`
   - Redirect URIs:
     - `https://azure-sales-log-web.azurewebsites.net`
     - `http://localhost:3000` (for development)
3. Note the Application (client) ID and Directory (tenant) ID
4. Under "Certificates & secrets", create a new client secret
5. Under "Expose an API":
   - Add scope: `access_as_user`
   - Add authorized client applications
6. Under "API permissions":
   - Add Microsoft Graph → User.Read

## Step 3: Configure Application Settings

### 3.1 Frontend App Settings

```bash
az webapp config appsettings set \
  --name azure-sales-log-web \
  --resource-group azure-sales-log-rg \
  --settings \
    NEXT_PUBLIC_AZURE_AD_CLIENT_ID="<your-client-id>" \
    NEXT_PUBLIC_AZURE_AD_TENANT_ID="<your-tenant-id>" \
    NEXT_PUBLIC_AZURE_AD_REDIRECT_URI="https://azure-sales-log-web.azurewebsites.net" \
    NEXT_PUBLIC_API_BASE_URL="https://azure-sales-log-api.azurewebsites.net/api"
```

### 3.2 API App Settings

```bash
# Get connection strings
SQL_CONNECTION_STRING=$(az sql db show-connection-string \
  --server azure-sales-log-sql \
  --name AzureSalesLog \
  --client ado.net \
  --output tsv)

STORAGE_CONNECTION_STRING=$(az storage account show-connection-string \
  --name azuresaleslogstorage \
  --resource-group azure-sales-log-rg \
  --output tsv)

# Configure API settings
az webapp config appsettings set \
  --name azure-sales-log-api \
  --resource-group azure-sales-log-rg \
  --settings \
    "ConnectionStrings__DefaultConnection=$SQL_CONNECTION_STRING" \
    "AzureAd__TenantId=<your-tenant-id>" \
    "AzureAd__ClientId=<your-client-id>" \
    "AzureAd__Domain=<your-tenant>.onmicrosoft.com" \
    "Frontend__Url=https://azure-sales-log-web.azurewebsites.net" \
    "AzureStorage__ConnectionString=$STORAGE_CONNECTION_STRING" \
    "AzureStorage__ContainerName=attachments"
```

### 3.3 Enable CORS on API

```bash
az webapp cors add \
  --name azure-sales-log-api \
  --resource-group azure-sales-log-rg \
  --allowed-origins "https://azure-sales-log-web.azurewebsites.net"
```

## Step 4: Configure GitHub Actions

### 4.1 Get Publish Profiles

```bash
# Frontend publish profile
az webapp deployment list-publishing-profiles \
  --name azure-sales-log-web \
  --resource-group azure-sales-log-rg \
  --xml

# API publish profile
az webapp deployment list-publishing-profiles \
  --name azure-sales-log-api \
  --resource-group azure-sales-log-rg \
  --xml
```

### 4.2 Configure GitHub Secrets

Add the following secrets to your GitHub repository:

- `AZURE_AD_CLIENT_ID`: Azure AD application client ID
- `AZURE_AD_TENANT_ID`: Azure AD tenant ID
- `FRONTEND_URL`: https://azure-sales-log-web.azurewebsites.net
- `API_BASE_URL`: https://azure-sales-log-api.azurewebsites.net/api
- `AZURE_WEBAPP_NAME_FRONTEND`: azure-sales-log-web
- `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND`: (XML from publish profile)
- `AZURE_WEBAPP_NAME_API`: azure-sales-log-api
- `AZURE_WEBAPP_PUBLISH_PROFILE_API`: (XML from publish profile)

## Step 5: Deploy Database Schema

```bash
# Option 1: Deploy from local machine
cd app/api
dotnet ef database update --connection "<your-connection-string>"

# Option 2: Use SQL scripts
az sql db query \
  --server azure-sales-log-sql \
  --name AzureSalesLog \
  --admin-user sqladmin \
  --admin-password <password> \
  --query-text @Migrations/InitialCreate.sql
```

## Step 6: Deploy Applications

### 6.1 Automatic Deployment

Push to main branch to trigger GitHub Actions:

```bash
git push origin main
```

### 6.2 Manual Deployment

#### Frontend

```bash
cd app/web
npm install
npm run build

# Using Azure CLI
az webapp deployment source config-zip \
  --resource-group azure-sales-log-rg \
  --name azure-sales-log-web \
  --src ./out.zip
```

#### API

```bash
cd app/api
dotnet publish --configuration Release --output ./publish

# Using Azure CLI
cd publish
zip -r ../api.zip .
cd ..
az webapp deployment source config-zip \
  --resource-group azure-sales-log-rg \
  --name azure-sales-log-api \
  --src api.zip
```

## Step 7: Verify Deployment

1. Navigate to `https://azure-sales-log-web.azurewebsites.net`
2. Login with your Azure AD credentials
3. Verify all features are working:
   - Dashboard loads
   - Can create customers
   - Can create deals
   - Can log interactions
   - Search functionality works
   - CSV export works

## Step 8: Configure Custom Domain (Optional)

```bash
# Map custom domain
az webapp config hostname add \
  --webapp-name azure-sales-log-web \
  --resource-group azure-sales-log-rg \
  --hostname sales.yourdomain.com

# Enable HTTPS
az webapp update \
  --name azure-sales-log-web \
  --resource-group azure-sales-log-rg \
  --https-only true
```

## Monitoring and Logging

### View Logs

```bash
# Frontend logs
az webapp log tail \
  --name azure-sales-log-web \
  --resource-group azure-sales-log-rg

# API logs
az webapp log tail \
  --name azure-sales-log-api \
  --resource-group azure-sales-log-rg
```

### Application Insights

Configure Application Insights for monitoring:

```bash
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app azure-sales-log-insights \
  --resource-group azure-sales-log-rg \
  --query instrumentationKey \
  --output tsv)

# Add to app settings
az webapp config appsettings set \
  --name azure-sales-log-api \
  --resource-group azure-sales-log-rg \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=$INSTRUMENTATION_KEY"
```

## Scaling

### Scale Up (Vertical Scaling)

```bash
az appservice plan update \
  --name azure-sales-log-plan \
  --resource-group azure-sales-log-rg \
  --sku P1V2
```

### Scale Out (Horizontal Scaling)

```bash
az appservice plan update \
  --name azure-sales-log-plan \
  --resource-group azure-sales-log-rg \
  --number-of-workers 3
```

## Backup and Disaster Recovery

### Database Backup

Azure SQL Database automatic backups are enabled by default.

To restore:

```bash
az sql db restore \
  --resource-group azure-sales-log-rg \
  --server azure-sales-log-sql \
  --name AzureSalesLog \
  --dest-name AzureSalesLog-Restored \
  --time "2025-01-15T10:00:00Z"
```

### Storage Backup

Enable blob versioning and soft delete:

```bash
az storage account blob-service-properties update \
  --account-name azuresaleslogstorage \
  --enable-versioning true \
  --enable-delete-retention true \
  --delete-retention-days 7
```

## Cost Optimization

1. Use Azure Reserved Instances for predictable workloads
2. Enable auto-scaling based on demand
3. Use Azure SQL Database serverless tier for development/test
4. Monitor and optimize storage usage
5. Use Azure CDN for static assets

## Security Checklist

- [ ] Enable Azure AD authentication
- [ ] Configure HTTPS only
- [ ] Set up firewall rules for SQL Database
- [ ] Enable Application Insights
- [ ] Configure backup and disaster recovery
- [ ] Set up Azure Key Vault for secrets
- [ ] Enable managed identities
- [ ] Configure network security groups
- [ ] Enable Azure DDoS Protection
- [ ] Set up Azure Security Center

## Troubleshooting

### Common Issues

**Issue**: Cannot connect to database
- Check firewall rules
- Verify connection string
- Ensure Azure services are allowed

**Issue**: Authentication fails
- Verify Azure AD configuration
- Check redirect URIs
- Verify client ID and tenant ID

**Issue**: API CORS errors
- Add frontend URL to CORS settings
- Check API base URL configuration

## Support

For deployment issues:
1. Check Azure Portal diagnostics
2. Review Application Insights logs
3. Check GitHub Actions workflow logs
4. Contact Azure support if needed
