#!/bin/bash

# 🏗️ Cathedral Workspace Manager
# Manages development workflow from BUILDING CATHEDRALS → Production Sites
# TECH STACK: Vite + React + Three.js (NEVER flat, NEVER SVG-only)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/ai-config.json"

show_help() {
    echo "🏗️  Cathedral Workspace Manager"
    echo ""
    echo "Managing: BUILDING CATHEDRALS → Production Cathedral Sites"
    echo "Tech Stack: Vite + React + Three.js (NEVER flat/SVG)"
    echo ""
    echo "Commands:"
    echo "  dev           Start development server"
    echo "  build         Build for production"
    echo "  deploy        Build and deploy to cathedral website"
    echo "  status        Show current workspace status"
    echo "  sync          Sync supporting repositories"
    echo "  standards     Run code standards check"
    echo "  install       Install/update dependencies"
    echo "  help          Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 dev                     # Start dev server"
    echo "  $0 build                   # Build for production"
    echo "  $0 deploy                  # Deploy to bekalah.github.io/cathedral"
    echo "  $0 status                  # Check current status"
}

show_status() {
    echo "🏗️  Cathedral Workspace Status"
    echo "=================================="
    echo "📍 Source: BUILDING CATHEDRALS"
    echo "🎯 Target: https://bekalah.github.io/cathedral/"
    echo "⚡ Stack: Vite + React + Three.js"
    echo "🚫 Never: Flat HTML, SVG-only designs"
    echo ""
    
    # Check if built
    if [ -d "$SCRIPT_DIR/dist" ]; then
        build_date=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$SCRIPT_DIR/dist" 2>/dev/null || echo "unknown")
        echo "📦 Last Build: $build_date"
    else
        echo "📦 Last Build: Not built yet"
    fi
    
    # Check deployment manifest
    if [ -f "$SCRIPT_DIR/deployment_manifest.json" ]; then
        last_deploy=$(jq -r '.deployment_time' "$SCRIPT_DIR/deployment_manifest.json" 2>/dev/null || echo "unknown")
        echo "🚀 Last Deploy: $last_deploy"
    else
        echo "🚀 Last Deploy: Never deployed"
    fi
    
    echo ""
    echo "📂 Workspace Structure:"
    for dir in src apps packages public; do
        if [ -d "$SCRIPT_DIR/$dir" ]; then
            count=$(find "$SCRIPT_DIR/$dir" -name "*.jsx" -o -name "*.tsx" -o -name "*.ts" -o -name "*.js" | wc -l)
            echo "  $dir/: $count files"
        else
            echo "  $dir/: not found"
        fi
    done
    
    echo ""
    echo "🔗 Connected Repositories:"
    echo "  Main Site: Bekalah/cathedral"
    echo "  Staging: Bekalah/BUILDING-CATHEDRALS"
    echo "  Technical: Bekalah/cathedral-technical"
    echo "  Research: Bekalah/cathedral-research"
    echo "  Docs: Bekalah/cathedral-docs"
}

start_dev() {
    echo "🔧 Starting development server..."
    echo "📍 BUILDING CATHEDRALS workspace"
    echo "⚡ Vite + React + Three.js"
    
    cd "$SCRIPT_DIR"
    
    # Ensure dependencies are installed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies first..."
        npm install
    fi
    
    # Start dev server
    npm run dev
}

build_project() {
    echo "🔨 Building cathedral for production..."
    echo "⚡ Using Vite + React + Three.js"
    
    cd "$SCRIPT_DIR"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi
    
    # Run type check
    echo "🔍 Running type check..."
    npm run type-check || {
        echo "⚠️  Type check failed - continuing with build"
    }
    
    # Build
    echo "🔨 Building with Vite..."
    NODE_ENV=production npm run build
    
    if [ -d "dist" ]; then
        echo "✅ Build successful"
        echo "📦 Output: dist/"
        
        # Show build info
        size=$(du -sh dist 2>/dev/null | cut -f1)
        echo "📊 Build size: $size"
    else
        echo "❌ Build failed"
        exit 1
    fi
}

deploy_cathedral() {
    echo "🚀 Deploying Cathedral to production..."
    
    # Build first
    build_project
    
    # Run deployment script
    "$SCRIPT_DIR/deploy-cathedral.sh"
}

sync_repos() {
    echo "🔄 Syncing supporting repositories..."
    
    # Check if sync script exists
    if [ -f "$SCRIPT_DIR/sync-repos.sh" ]; then
        "$SCRIPT_DIR/sync-repos.sh"
    else
        echo "⚠️  sync-repos.sh not found"
        echo "🔄 Performing basic repo sync..."
        
        # Pull research updates
        temp_dir=$(mktemp -d)
        cd "$temp_dir"
        
        echo "📥 Pulling cathedral-research..."
        gh repo clone Bekalah/cathedral-research
        rsync -av --exclude='.git' cathedral-research/ "$SCRIPT_DIR/research/" 2>/dev/null || true
        
        echo "📥 Pulling cathedral-docs..."
        gh repo clone Bekalah/cathedral-docs
        rsync -av --exclude='.git' cathedral-docs/ "$SCRIPT_DIR/docs/" 2>/dev/null || true
        
        cd "$SCRIPT_DIR"
        rm -rf "$temp_dir"
        
        echo "✅ Basic sync completed"
    fi
}

run_standards() {
    echo "🔍 Running code standards check..."
    echo "⚡ Checking Vite + React + Three.js code"
    
    cd "$SCRIPT_DIR"
    
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies first..."
        npm install
    fi
    
    # Run linting
    echo "🔍 Running ESLint..."
    npm run lint || {
        echo "❌ Linting failed"
        echo "💡 Run 'npm run lint:fix' to auto-fix issues"
    }
    
    # Run type checking
    echo "🔍 Running TypeScript check..."
    npm run type-check || {
        echo "❌ Type checking failed"
    }
    
    # Run formatting check
    echo "🔍 Running Prettier check..."
    npm run format || {
        echo "❌ Formatting failed"
    }
    
    echo "✅ Standards check completed"
}

install_deps() {
    echo "📦 Installing/updating dependencies..."
    echo "⚡ For Vite + React + Three.js stack"
    
    cd "$SCRIPT_DIR"
    
    # Install main dependencies
    npm install
    
    # Install workspace dependencies
    if [ -d "apps" ]; then
        echo "📦 Installing app dependencies..."
        for app_dir in apps/*/; do
            if [ -f "$app_dir/package.json" ]; then
                echo "📦 Installing: $app_dir"
                (cd "$app_dir" && npm install)
            fi
        done
    fi
    
    if [ -d "packages" ]; then
        echo "📦 Installing package dependencies..."
        for pkg_dir in packages/*/; do
            if [ -f "$pkg_dir/package.json" ]; then
                echo "📦 Installing: $pkg_dir"
                (cd "$pkg_dir" && npm install)
            fi
        done
    fi
    
    echo "✅ Dependencies installed"
}

# Main command handling
case $1 in
    "dev")
        start_dev
        ;;
    "build")
        build_project
        ;;
    "deploy")
        deploy_cathedral
        ;;
    "status")
        show_status
        ;;
    "sync")
        sync_repos
        ;;
    "standards")
        run_standards
        ;;
    "install")
        install_deps
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        show_help
        ;;
esac