# Azure AI + DeepSeek Integration Setup Guide

## Overview
This guide will help you set up Azure OpenAI with DeepSeek model integration for your Cathedral of Circuits project, making the most of your free Azure credits.

## Prerequisites
- Azure subscription with free credits
- GitHub account
- VS Code with Azure extensions

## Step 1: Azure OpenAI Resource Setup

### 1.1 Create Azure OpenAI Resource
1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Azure OpenAI"
3. Click "Create"
4. Fill in:
   - **Subscription**: Your Azure subscription
   - **Resource group**: Create new: `cathedral-rg`
   - **Region**: East US 2 (or your preferred region)
   - **Name**: `cathedral-openai`
   - **Pricing tier**: Standard (S0)

### 1.2 Deploy DeepSeek Model
1. In your Azure OpenAI resource, go to "Model deployments"
2. Click "Manage deployments"
3. Click "Create new deployment"
4. Select **"DeepSeek-R1"** or **"DeepSeek-V3"** (when available)
5. Choose deployment name: `deepseek-r1`
6. Set capacity: Start with 1 (you can scale up)

## Step 2: Environment Configuration

### 2.1 Update .env file
```bash
cp .env.example .env
```

Edit `.env` with your Azure details:
```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://cathedral-openai.openai.azure.com/
AZURE_OPENAI_KEY=your-actual-key-from-azure-portal
AZURE_OPENAI_DEPLOYMENT=deepseek-r1

# Client configuration
VITE_APP_NAME=Cathedral of Circuits
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=true
```

### 2.2 Get Your Azure OpenAI Key
1. In Azure Portal, go to your OpenAI resource
2. Navigate to "Keys and Endpoint"
3. Copy **Key 1** value
4. Replace `your-actual-key-from-azure-portal` in `.env`

## Step 3: VS Code Configuration

### 3.1 Install Required Extensions
Open VS Code and install:
- **Azure Account** (ms-vscode.azure-account)
- **Azure CLI Tools** (ms-vscode.azurecli)
- **Azure Resources** (ms-vscode.azure-resources)
- **GitHub Copilot** (github.copilot)
- **GitHub Pull Requests** (ms-vscode.vscode-github-pull-request)

### 3.2 Sign into Azure
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "Azure: Sign In"
3. Follow authentication steps

### 3.3 Configure Workspace Settings
Your workspace is already configured in `UPDATINGCATHEDRAL.code-workspace` with:
- All repository folders
- Recommended extensions
- Azure resource group settings

## Step 4: GitHub Integration

### 4.1 Push New Repositories
```bash
# Push research repository
cd ../cathedral-research
git remote add origin https://github.com/Bekalah/cathedral-research.git
git push -u origin main

# Push technical repository
cd ../cathedral-technical
git remote add origin https://github.com/Bekalah/cathedral-technical.git
git push -u origin main

# Push documentation repository
cd ../cathedral-docs
git remote add origin https://github.com/Bekalah/cathedral-docs.git
git push -u origin main
```

### 4.2 GitHub Actions Setup
Create `.github/workflows/` directory in each repository for automated deployments.

## Step 5: DeepSeek Integration Code

### 5.1 Update Azure Client Configuration
```javascript
// api/_shared/azureClients.js
export function getDeepSeekClient() {
  const client = getOpenAIClient();
  return {
    generateStory: async (prompt) => {
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "deepseek-r1";
      return await client.getCompletions(deployment, [prompt], {
        maxTokens: 380,
        temperature: 0.7,
        topP: 0.9
      });
    }
  };
}
```

### 5.2 Enhanced Story Generation
```javascript
// api/generateStory/index.js
import { getDeepSeekClient } from "../_shared/azureClients.js";

export default async function (context, req) {
  const client = getDeepSeekClient();

  const result = await client.generateStory(prompt);

  context.res = {
    body: {
      content: result.choices[0].text,
      metadata: {
        model: "deepseek-r1",
        therapeutic: true,
        ndSafe: true
      }
    }
  };
};
```

## Step 6: Testing Your Setup

### 6.1 Test Azure Connection
```bash
# Install Azure CLI if not already installed
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Test your OpenAI resource
az cognitiveservices account show \
  --name cathedral-openai \
  --resource-group cathedral-rg
```

### 6.2 Test DeepSeek Integration
1. Start your local development server
2. Make a test request to `/api/generateStory`
3. Verify the response includes DeepSeek metadata

## Step 7: Automation Setup

### 7.1 GitHub Actions for Auto-deployment
Create `.github/workflows/deploy.yml` in your main repository:

```yaml
name: Deploy to Azure
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
```

### 7.2 Automated Repository Updates
Create a script to sync all repositories:

```bash
#!/bin/bash
# scripts/sync-all-repos.sh

echo "Syncing all Cathedral repositories..."

# Update main repo
cd /path/to/BUILDING-CATHEDRALS
git pull origin main

# Update research repo
cd ../cathedral-research
git pull origin main

# Update technical repo
cd ../cathedral-technical
git pull origin main

# Update docs repo
cd ../cathedral-docs
git pull origin main

echo "All repositories updated!"
```

## Step 8: Cost Optimization (Free Tier)

### 8.1 Azure Free Credits Usage
- **Azure OpenAI**: ~$0.005 per 1K tokens
- **Static Web Apps**: Free for first 100GB bandwidth
- **Storage**: Free for first 5GB

### 8.2 Monitor Your Usage
1. Set up Azure Cost Alerts
2. Use `az monitor` commands to track usage
3. Monitor in Azure Portal > Cost Management

## Troubleshooting

### Common Issues

**"Model not found" error:**
- Verify DeepSeek deployment exists in Azure Portal
- Check deployment name matches in .env file

**Authentication errors:**
- Ensure you're logged into Azure CLI
- Verify API key is correct in .env
- Check Azure subscription has OpenAI access

**VS Code extension issues:**
- Reload VS Code window
- Check extension permissions in settings

## Next Steps

1. ✅ Complete Azure OpenAI + DeepSeek setup
2. ⏳ Set up automated deployments
3. ⏳ Configure monitoring and alerts
4. ⏳ Set up backup strategies
5. ⏳ Plan for scaling beyond free tier

## Support Resources

- [Azure OpenAI Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [DeepSeek Model Information](https://deepseek.ai)
- [Azure Free Tier Details](https://azure.microsoft.com/en-us/free/)
- [VS Code Azure Extensions](https://code.visualstudio.com/docs/azure/extensions)

---

**Note**: Keep your `.env` file secure and never commit API keys to version control. Use Azure Key Vault for production secrets.
