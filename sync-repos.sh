#!/bin/bash

# CODEX 144:99 Monorepo Sync Script
# This script syncs your local monorepo with the research and artifacts repositories

set -e

echo "🏗️  CODEX 144:99 Monorepo Sync Starting..."

# Configuration
WORKSPACE_ROOT="/Users/rebeccalemke/Library/Mobile Documents/com~apple~CloudDocs/BUILDING CATHEDRALS"
TEMP_DIR="$WORKSPACE_ROOT/temp_sync"

# Create sync directories if they don't exist
mkdir -p "$WORKSPACE_ROOT/research"
mkdir -p "$WORKSPACE_ROOT/datasets" 
mkdir -p "$WORKSPACE_ROOT/technical"
mkdir -p "$WORKSPACE_ROOT/docs"
mkdir -p "$TEMP_DIR"

echo "📥 Syncing Research Repository (cathedral-research)..."
if [ -d "$TEMP_DIR/cathedral-research" ]; then
    cd "$TEMP_DIR/cathedral-research"
    git pull origin main
else
    cd "$TEMP_DIR"
    gh repo clone Bekalah/cathedral-research
fi

# Sync research content
echo "🔄 Updating research artifacts..."
rsync -av --exclude='.git' "$TEMP_DIR/cathedral-research/" "$WORKSPACE_ROOT/research/"

echo "📥 Syncing Artifacts Research Repository (ARTIFACTS-RESEARCH)..."
if [ -d "$TEMP_DIR/ARTIFACTS-RESEARCH" ]; then
    cd "$TEMP_DIR/ARTIFACTS-RESEARCH"
    git pull origin main
else
    cd "$TEMP_DIR"
    gh repo clone Bekalah/ARTIFACTS-RESEARCH
fi

# Sync artifacts/datasets content
echo "🔄 Updating datasets and artifacts..."
rsync -av --exclude='.git' "$TEMP_DIR/ARTIFACTS-RESEARCH/" "$WORKSPACE_ROOT/datasets/"

echo "📥 Syncing Technical Repository (cathedral-technical)..."
if [ -d "$TEMP_DIR/cathedral-technical" ]; then
    cd "$TEMP_DIR/cathedral-technical"
    git pull origin master
else
    cd "$TEMP_DIR"
    gh repo clone Bekalah/cathedral-technical
fi

# Sync technical content
echo "🔄 Updating technical implementation..."
rsync -av --exclude='.git' "$TEMP_DIR/cathedral-technical/" "$WORKSPACE_ROOT/technical/"

echo "📥 Syncing Documentation Repository (cathedral-docs)..."
if [ -d "$TEMP_DIR/cathedral-docs" ]; then
    cd "$TEMP_DIR/cathedral-docs"
    git pull origin main
else
    cd "$TEMP_DIR"
    gh repo clone Bekalah/cathedral-docs
fi

# Sync documentation content
echo "🔄 Updating documentation..."
rsync -av --exclude='.git' "$TEMP_DIR/cathedral-docs/" "$WORKSPACE_ROOT/docs/"

echo "📥 Syncing Complete CODEX (codex-14499)..."
if [ -d "$TEMP_DIR/codex-14499" ]; then
    cd "$TEMP_DIR/codex-14499"
    git pull origin main
else
    cd "$TEMP_DIR"
    gh repo clone Bekalah/codex-14499
fi

# Sync codex content
echo "🔄 Updating complete codex..."
rsync -av --exclude='.git' "$TEMP_DIR/codex-14499/" "$WORKSPACE_ROOT/codex/"

# Update manifest file
echo "📝 Updating sync manifest..."
cat > "$WORKSPACE_ROOT/sync_manifest.json" << EOF
{
  "last_sync": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "synced_repos": {
    "cathedral-research": {
      "status": "✅ synced",
      "target": "research/",
      "purpose": "Research instructions and methodologies"
    },
    "ARTIFACTS-RESEARCH": {
      "status": "✅ synced", 
      "target": "datasets/",
      "purpose": "Private datasets and complete codex",
      "access": "private"
    },
    "cathedral-technical": {
      "status": "✅ synced",
      "target": "technical/", 
      "purpose": "Implementation and technical specs"
    },
    "cathedral-docs": {
      "status": "✅ synced",
      "target": "docs/",
      "purpose": "Documentation and guides"
    },
    "codex-14499": {
      "status": "✅ synced",
      "target": "codex/",
      "purpose": "Complete CODEX 144:99"
    }
  },
  "monorepo_structure": {
    "research/": "Research instructions separate from datasets",
    "datasets/": "Private datasets and artifacts",
    "technical/": "Technical implementation and specs", 
    "docs/": "Documentation and user guides",
    "codex/": "Complete CODEX 144:99 canonical reference"
  }
}
EOF

# Clean up temp directory
echo "🧹 Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "✅ CODEX 144:99 Monorepo sync completed successfully!"
echo "📊 Check sync_manifest.json for details"
echo "📁 Organized structure:"
echo "   - research/ (from cathedral-research)"
echo "   - datasets/ (from ARTIFACTS-RESEARCH, private)"
echo "   - technical/ (from cathedral-technical)"
echo "   - docs/ (from cathedral-docs)"
echo "   - codex/ (from codex-14499)"