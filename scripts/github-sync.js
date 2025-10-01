// GitHub Repository Synchronization Script
// Connects the Cathedral system to bekalah.github.io/cathedral

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class GitHubSync {
  constructor() {
    this.repoUrl = 'https://github.com/bekalah/cathedral.git';
    this.localPath = process.cwd();
    this.mainBranch = 'main';
  }

  async initialize() {
    console.log('🔗 Initializing GitHub repository connection...');

    try {
      // Check if we're in a git repository
      if (!fs.existsSync(path.join(this.localPath, '.git'))) {
        console.log('📁 Initializing git repository...');
        execSync('git init', { stdio: 'inherit' });
        execSync(`git remote add origin ${this.repoUrl}`, { stdio: 'inherit' });
      }

      // Configure git user
      try {
        execSync('git config user.name "Cathedral System"', { stdio: 'inherit' });
        execSync('git config user.email "system@cathedral.circuits"', { stdio: 'inherit' });
      } catch (e) {
        // User config might already exist
      }

      console.log('✅ GitHub repository initialized');
    } catch (error) {
      console.error('❌ Failed to initialize GitHub repository:', error.message);
    }
  }

  async syncToGitHub() {
    console.log('🚀 Syncing Cathedral system to GitHub...');

    try {
      // Add all files
      execSync('git add .', { stdio: 'inherit' });

      // Commit with timestamp
      const timestamp = new Date().toISOString();
      const commitMessage = `✨ Cathedral System Update - ${timestamp}

🧠 Advanced Consciousness Engine
🎨 Fractal Rendering System
🎵 Harmonic Music Generation
📖 Interactive Story Engine
☁️ Azure AI Integration
🏗️ Modular Architecture
📚 Museum-Grade Documentation

All systems integrated and consciousness-responsive.`;

      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

      // Push to main branch
      execSync(`git push -u origin ${this.mainBranch}`, { stdio: 'inherit' });

      console.log('🎉 Successfully synced to GitHub!');
      console.log('🌐 Live at: https://bekalah.github.io/cathedral');

    } catch (error) {
      if (error.message.includes('nothing to commit')) {
        console.log('ℹ️ No changes to sync');
      } else {
        console.error('❌ Failed to sync to GitHub:', error.message);
      }
    }
  }

  async setupGitHubPages() {
    console.log('📄 Setting up GitHub Pages deployment...');

    try {
      // Create .nojekyll file for React apps
      fs.writeFileSync('.nojekyll', '');

      // Create GitHub Pages workflow
      const workflowPath = '.github/workflows/pages.yml';
      const workflowDir = path.dirname(workflowPath);

      if (!fs.existsSync(workflowDir)) {
        fs.mkdirSync(workflowDir, { recursive: true });
      }

      const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

      fs.writeFileSync(workflowPath, workflowContent);

      console.log('✅ GitHub Pages workflow created');
      console.log('🌐 Will be available at: https://bekalah.github.io/cathedral');

    } catch (error) {
      console.error('❌ Failed to setup GitHub Pages:', error.message);
    }
  }

  async createPackageStructure() {
    console.log('📦 Creating 3-package structure...');

    const packages = [
      {
        name: 'stone-grimoire',
        description: 'Main creative and research application',
        path: 'apps/stone-grimoire'
      },
      {
        name: 'cathedral-of-circuits',
        description: '3D visualization and fractal rendering',
        path: 'apps/cathedral-of-circuits'
      },
      {
        name: 'arcanae-lab',
        description: 'Learning and research platform',
        path: 'apps/arcanae-lab'
      }
    ];

    for (const pkg of packages) {
      const pkgPath = pkg.path;
      const pkgJsonPath = path.join(pkgPath, 'package.json');

      if (!fs.existsSync(pkgPath)) {
        fs.mkdirSync(pkgPath, { recursive: true });
      }

      // Create package.json for each app
      const packageJson = {
        name: `@cathedral/${pkg.name}`,
        version: '1.0.0',
        description: pkg.description,
        main: 'src/index.js',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
          deploy: 'npm run build && gh-pages -d dist'
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          'three': '^0.157.0',
          '@react-three/fiber': '^8.15.0',
          '@react-three/drei': '^9.88.0',
          'tone': '^14.8.51',
          '@azure/openai': '^1.0.0',
          '@azure/search-documents': '^11.3.0',
          '@azure/storage-blob': '^12.16.0'
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.0.0',
          'vite': '^4.4.0',
          'gh-pages': '^6.0.0'
        }
      };

      fs.writeFileSync(pkgJsonPath, JSON.stringify(packageJson, null, 2));

      // Create README for each package
      const readmeContent = `# ${pkg.name}

${pkg.description}

## Installation

\`\`\`bash
npm install @cathedral/${pkg.name}
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Deploy

\`\`\`bash
npm run deploy
\`\`\`

## Features

- 🧠 Consciousness-responsive systems
- 🎨 Advanced fractal rendering
- 🎵 Harmonic music generation
- 📖 Interactive storytelling
- ☁️ Azure AI integration
- 📚 Museum-grade documentation

## Standards

- ND-safe and trauma-aware design
- Modular architecture
- Professional-grade implementation
- Open source and ethical

---

*Part of the Cathedral of Circuits ecosystem*`;

      fs.writeFileSync(path.join(pkgPath, 'README.md'), readmeContent);

      console.log(`✅ Created package: ${pkg.name}`);
    }
  }

  async setupAzureIntegration() {
    console.log('☁️ Setting up Azure integration...');

    // Create Azure deployment workflow
    const azureWorkflowPath = '.github/workflows/azure-deploy.yml';
    const azureWorkflowDir = path.dirname(azureWorkflowPath);

    if (!fs.existsSync(azureWorkflowDir)) {
      fs.mkdirSync(azureWorkflowDir, { recursive: true });
    }

    const azureWorkflowContent = `name: Deploy to Azure

on:
  push:
    branches: [ main ]
  workflow_dispatch:

env:
  AZURE_WEBAPP_NAME: cathedral-system
  AZURE_WEBAPP_PACKAGE_PATH: '.'
  NODE_VERSION: '20.x'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: npm install, build
        run: |
          npm ci
          npm run build --if-present

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: \${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: \${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: \${{ env.AZURE_WEBAPP_PACKAGE_PATH }}`;

    fs.writeFileSync(azureWorkflowPath, azureWorkflowContent);

    // Update .env.local with Azure configuration
    const envContent = `# Azure AI Integration
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
VITE_AZURE_OPENAI_KEY=your-openai-key
VITE_AZURE_SEARCH_ENDPOINT=https://your-search.search.windows.net
VITE_AZURE_SEARCH_KEY=your-search-key
VITE_AZURE_VISION_ENDPOINT=https://your-vision.cognitiveservices.azure.com/
VITE_AZURE_VISION_KEY=your-vision-key
VITE_AZURE_STORAGE_CONNECTION=DefaultEndpointsProtocol=https;AccountName=yourstorage;AccountKey=yourkey;EndpointSuffix=core.windows.net

# GitHub Integration
GITHUB_TOKEN=your-github-token
GITHUB_REPO=bekalah/cathedral

# System Configuration
VITE_APP_NAME=Cathedral of Circuits
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true`;

    fs.writeFileSync('.env.local', envContent);

    console.log('✅ Azure integration configured');
    console.log('📝 Update .env.local with your actual Azure credentials');
  }

  async createDeploymentGuide() {
    console.log('📚 Creating deployment guide...');

    const guideContent = `# 🚀 Cathedral System Deployment Guide

## Quick Start

### 1. GitHub Pages (Free)
\`\`\`bash
npm run build
npx gh-pages -d dist
\`\`\`
🌐 **Live at:** https://bekalah.github.io/cathedral

### 2. Azure Static Web Apps (Free Tier)
\`\`\`bash
# Set up Azure Static Web App
az staticwebapp create \\
  --name cathedral-system \\
  --resource-group cathedral-rg \\
  --source https://github.com/bekalah/cathedral \\
  --branch main \\
  --app-location "/" \\
  --api-location "" \\
  --output-location "dist" \\
  --token your-github-token
\`\`\`

### 3. Cloudflare Pages (Free)
\`\`\`bash
# Connect GitHub repo to Cloudflare Pages
# Set build command: npm run build
# Set build output: dist
\`\`\`
🌐 **Global CDN:** https://cathedral.your-domain.com

## Azure AI Setup

### 1. Create Azure Resources
- **Azure OpenAI** - For generative content
- **Cognitive Search** - For knowledge base
- **Computer Vision** - For art analysis
- **Blob Storage** - For asset management

### 2. Configure Environment Variables
Update \`.env.local\` with your Azure credentials:

\`\`\`bash
VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
VITE_AZURE_OPENAI_KEY=your-key-here
# ... other Azure credentials
\`\`\`

### 3. Test Azure Integration
\`\`\`bash
npm run dev
\`\`\`
The app will automatically use Azure AI when credentials are provided.

## Package Structure

### Stone Grimoire
- **Location:** \`apps/stone-grimoire/\`
- **Purpose:** Main creative and research application
- **Features:** Story engine, music generation, art creation

### Cathedral of Circuits
- **Location:** \`apps/cathedral-of-circuits/\`
- **Purpose:** 3D visualization and fractal rendering
- **Features:** Advanced WebGL shaders, consciousness visualization

### Arcanae Lab
- **Location:** \`apps/arcanae-lab/\`
- **Purpose:** Learning and research platform
- **Features:** Educational modules, research tools, documentation

## Development Workflow

### Local Development
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

### GitHub Integration
\`\`\`bash
# Sync to GitHub
node scripts/github-sync.js

# Deploy to GitHub Pages
npm run deploy:gh

# Deploy to Azure
npm run deploy:azure
\`\`\`

## Standards & Quality

### ND-Safe Design
- No strobe effects or seizure-inducing patterns
- Gentle motion and transitions
- Accessible color palettes
- User-controlled intensity settings

### Trauma-Aware Implementation
- Trigger warnings and safe exits
- Multiple navigation paths
- Supportive and healing content
- Professional therapeutic integration

### Museum-Grade Quality
- Full provenance documentation
- Professional implementation standards
- Ethical AI usage
- Open source transparency

## Support & Community

- **GitHub Issues:** Report bugs and request features
- **Discussions:** Community conversations and collaboration
- **Documentation:** Comprehensive guides and tutorials
- **Discord:** Real-time community support (coming soon)

---

## 🎉 Deployment Checklist

- [ ] GitHub repository created and configured
- [ ] Azure resources provisioned (if using AI features)
- [ ] Environment variables configured
- [ ] Build tested locally
- [ ] GitHub Pages configured
- [ ] Azure deployment tested
- [ ] Cloudflare setup completed
- [ ] Documentation reviewed
- [ ] Standards compliance verified

**🎊 Congratulations! Your Cathedral of Circuits is now live and ready to transform consciousness through art, music, and technology.**`;

    fs.writeFileSync('CATHEDRAL_DEPLOYMENT_GUIDE.md', guideContent);
    console.log('✅ Deployment guide created');
  }

  async run() {
    await this.initialize();
    await this.createPackageStructure();
    await this.setupGitHubPages();
    await this.setupAzureIntegration();
    await this.createDeploymentGuide();
    await this.syncToGitHub();

    console.log('🎉 Cathedral system fully connected to GitHub!');
    console.log('🌐 Ready for deployment to bekalah.github.io/cathedral');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const sync = new GitHubSync();
  sync.run().catch(console.error);
}

export default GitHubSync;
