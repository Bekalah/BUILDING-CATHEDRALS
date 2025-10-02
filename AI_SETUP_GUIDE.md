# AI Development Environment Setup Guide

## ✅ Current Status

- **Azure Authentication**: ✅ Signed in as rebeccaslemke@gmail.com
- **Azure Subscription**: ✅ Azure subscription 1 (88235353-b821-4046-9457-89f70c3d8e9e)
- **GitHub Authentication**: ✅ Logged in as Bekalah with Copilot scope
- **GitHub Copilot Pro**: ✅ Available (based on your subscription)
- **AI Foundry Access**: ✅ Connected with 100+ models available

## 🎯 Available AI Models

### For Coding (Recommended)

- **gpt-4o**: High-quality code generation and explanation
- **gpt-4o-mini**: Fast, efficient coding assistance
- **codex-mini**: Specialized for code completion
- **gpt-5-codex**: Advanced coding model (preview)

### For Reasoning Tasks

- **DeepSeek-R1**: Excellent reasoning capabilities
- **o1-mini**: OpenAI's reasoning model
- **Phi-4-reasoning**: Microsoft's reasoning model

### For Multimodal Tasks

- **gpt-4o**: Text + image understanding
- **Phi-4-multimodal-instruct**: Microsoft's multimodal model

## 🛠️ Development Container Setup

Your devcontainer now includes:

- Azure CLI with authentication
- Python environment
- Node.js for web development
- Git integration
- All essential VS Code extensions

## 🔧 Quick Start Commands

### Test Azure AI Foundry

```bash
# List available models
az ml model list --workspace-name <your-workspace>
```

### Test GitHub Copilot

1. Open any code file
2. Start typing a function or comment
3. Copilot should provide suggestions automatically
4. Use Cmd+I for inline chat (Copilot Chat)

### Connect to AI Foundry Models

```python
from azure.ai.inference import ChatCompletionsClient
from azure.identity import DefaultAzureCredential

# Example connection to GPT-4o
client = ChatCompletionsClient(
    endpoint="https://models.inference.ai.azure.com",
    credential=DefaultAzureCredential()
)
```

## 📁 Monorepo Structure

Your workspace spans three directories:

- `BOOKS/`: Main book content and cathedral documentation
- `BUILDING CATHEDRALS/`: Development files and configurations
- `Sunday-cathedral/`: Project-specific cathedral files

## 🎛️ VS Code Extensions (Installed)

- Azure MCP Server: Azure resource management
- AI Foundry: Model access and deployment
- GitHub Copilot & Copilot Chat: AI pair programming
- Python & Pylance: Python development
- GitLens: Enhanced Git integration

## 🚀 Next Steps

1. **Test Copilot**: Try coding in any file - suggestions should appear
2. **Access AI Foundry**: Use the AI Foundry extension to explore models
3. **Run Code**: Use the devcontainer for a consistent development environment
4. **Deploy**: Azure tools are ready for cloud deployment

## 🐛 Troubleshooting

If GitHub Copilot isn't working:

1. Check VS Code: Go to Extensions → GitHub Copilot → Check status
2. Restart VS Code
3. Use Command Palette: "GitHub Copilot: Sign in"

If Azure AI Foundry issues:

1. Verify subscription access in Azure portal
2. Check resource group permissions
3. Restart the AI Foundry extension

## 💡 Tips for Success

- Use specific comments to guide Copilot suggestions
- Leverage AI Foundry models for complex reasoning tasks
- Keep your Azure credentials up to date
- Use the devcontainer for consistent environments across your monorepo
