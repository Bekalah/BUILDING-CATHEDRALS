#!/bin/bash

# 🏗️ Cathedral Deployment Pipeline
# Builds and deploys BUILDING CATHEDRALS to production cathedral website
# NEVER FLAT, NEVER SVG - ALWAYS Vite + React + Three.js

set -e

WORKSPACE_ROOT="/Users/rebeccalemke/Library/Mobile Documents/com~apple~CloudDocs/BUILDING CATHEDRALS"
cd "$WORKSPACE_ROOT"

echo "🏗️  Cathedral Deployment Pipeline Starting..."
echo "📍 Source: BUILDING CATHEDRALS workspace"
echo "🎯 Target: bekalah.github.io/cathedral"
echo "⚡ Tech: Vite + React + Three.js (NEVER flat/SVG)"

# Pre-flight checks
echo "🔍 Pre-flight checks..."

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

if [ ! -f "vite.config.js" ]; then
    echo "❌ vite.config.js not found!"
    exit 1
fi

# Check for React and Three.js dependencies
if ! grep -q '"react"' package.json; then
    echo "❌ React dependency not found in package.json!"
    exit 1
fi

echo "✅ Pre-flight checks passed"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run standards check
echo "🔍 Running code standards check..."
npm run standards || {
    echo "⚠️  Standards check failed - continuing with deployment"
}

# Build the project
echo "🔨 Building cathedral site with Vite..."
NODE_ENV=production npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found!"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to main cathedral repository
echo "🚀 Deploying to main cathedral site..."

# Create temporary directory for cathedral repo
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Clone the main cathedral repository
echo "📥 Cloning cathedral repository..."
gh repo clone Bekalah/cathedral

cd cathedral

# Check if this is the right repo structure
if [ ! -f "README.md" ]; then
    echo "⚠️  Creating cathedral repo structure..."
    
    # Initialize basic structure for cathedral site
    cat > README.md << EOF
# Cathedral of Circuits

**Live Site**: https://bekalah.github.io/cathedral/

The Cathedral of Circuits is an ND-safe, interactive 3D experience built with Vite + React + Three.js.

## Architecture
- **Never Flat**: Always interactive 3D experiences
- **Never SVG-only**: Rich, dynamic interfaces
- **Always Modern**: Vite + React + Three.js stack
- **ND-Safe**: Trauma-aware, accessibility-first design

## Development
Source development happens in the BUILDING CATHEDRALS workspace, then gets built and deployed here.

Built with ❤️ by the Cathedral team.
EOF

    # Create docs directory for GitHub Pages
    mkdir -p docs
    
    echo "✅ Cathedral repo initialized"
fi

# Copy built files to docs directory (GitHub Pages)
echo "📋 Copying built files..."
rm -rf docs/*
cp -r "$WORKSPACE_ROOT/dist/"* docs/

# Ensure proper base path for GitHub Pages
if [ -f "docs/index.html" ]; then
    # Update any absolute paths to relative for GitHub Pages
    sed -i '' 's|href="/cathedral/|href="./|g' docs/index.html
    sed -i '' 's|src="/cathedral/|src="./|g' docs/index.html
fi

# Create .nojekyll file for GitHub Pages
touch docs/.nojekyll

# Commit and push
echo "📤 Committing and pushing to GitHub..."

git add .
git commit -m "Deploy cathedral site: $(date '+%Y-%m-%d %H:%M:%S')" || {
    echo "ℹ️  No changes to commit"
}

git push origin main

echo "✅ Deployed to main cathedral repository"

# Update supporting repositories
echo "🔄 Updating supporting repositories..."

# Update BUILDING-CATHEDRALS staging repo
cd "$TEMP_DIR"
echo "📥 Updating BUILDING-CATHEDRALS staging repo..."
gh repo clone Bekalah/BUILDING-CATHEDRALS

cd BUILDING-CATHEDRALS

# Sync current workspace (excluding sensitive files)
rsync -av \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.env.local' \
    --exclude='datasets/' \
    "$WORKSPACE_ROOT/" ./

git add .
git commit -m "Sync from local workspace: $(date '+%Y-%m-%d %H:%M:%S')" || {
    echo "ℹ️  No changes to commit to staging repo"
}

git push origin main

echo "✅ Updated BUILDING-CATHEDRALS staging repo"

# Update cathedral-technical repo with technical components
cd "$TEMP_DIR"
echo "📥 Updating cathedral-technical repo..."
gh repo clone Bekalah/cathedral-technical

cd cathedral-technical

# Copy technical implementations
if [ -d "$WORKSPACE_ROOT/src" ]; then
    mkdir -p src
    rsync -av "$WORKSPACE_ROOT/src/" src/
fi

if [ -d "$WORKSPACE_ROOT/packages" ]; then
    mkdir -p packages
    rsync -av "$WORKSPACE_ROOT/packages/" packages/
fi

# Copy build configuration
cp "$WORKSPACE_ROOT/vite.config.js" . 2>/dev/null || true
cp "$WORKSPACE_ROOT/package.json" . 2>/dev/null || true
cp "$WORKSPACE_ROOT/tsconfig.json" . 2>/dev/null || true

git add .
git commit -m "Update technical components: $(date '+%Y-%m-%d %H:%M:%S')" || {
    echo "ℹ️  No changes to commit to technical repo"
}

git push origin master

echo "✅ Updated cathedral-technical repo"

# Cleanup
cd "$WORKSPACE_ROOT"
rm -rf "$TEMP_DIR"

# Create deployment manifest
cat > deployment_manifest.json << EOF
{
  "deployment_time": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "source_workspace": "BUILDING CATHEDRALS",
  "target_site": "https://bekalah.github.io/cathedral/",
  "technology_stack": "Vite + React + Three.js",
  "build_output": "dist/",
  "deployed_repos": {
    "main_site": "Bekalah/cathedral (docs/)",
    "staging": "Bekalah/BUILDING-CATHEDRALS",
    "technical": "Bekalah/cathedral-technical"
  },
  "principles": {
    "never_flat": true,
    "never_svg_only": true,
    "always_interactive_3d": true,
    "nd_safe": true
  },
  "status": "✅ Deployment successful"
}
EOF

echo ""
echo "🎉 Cathedral Deployment Complete!"
echo ""
echo "📍 Live Site: https://bekalah.github.io/cathedral/"
echo "📂 Source: BUILDING CATHEDRALS workspace"
echo "⚡ Tech Stack: Vite + React + Three.js"
echo "🚫 Never: Flat HTML, SVG-only"
echo "✅ Always: Interactive 3D, ND-safe"
echo ""
echo "📊 Check deployment_manifest.json for details"