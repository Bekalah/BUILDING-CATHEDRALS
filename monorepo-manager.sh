#!/bin/bash

# CODEX 144:99 Monorepo Management Tool
# Manages connections between research, artifacts, and technical repos

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/ai-config.json"

show_help() {
    echo "🏗️  CODEX 144:99 Monorepo Management Tool"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  sync          Sync all repositories to local monorepo"
    echo "  status        Show sync status and repo information"
    echo "  push          Push local changes back to respective repos"
    echo "  init          Initialize monorepo structure"
    echo "  research      Work with research repo specifically"
    echo "  artifacts     Work with artifacts repo specifically"
    echo "  technical     Work with technical repo specifically"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 sync                    # Sync all repos"
    echo "  $0 status                  # Check current status"
    echo "  $0 research pull           # Pull latest research"
    echo "  $0 artifacts push          # Push artifacts changes"
}

show_status() {
    echo "📊 CODEX 144:99 Monorepo Status"
    echo "================================"
    
    if [ -f "$SCRIPT_DIR/sync_manifest.json" ]; then
        echo "Last sync: $(jq -r '.last_sync' "$SCRIPT_DIR/sync_manifest.json")"
        echo ""
        echo "Repository Status:"
        jq -r '.synced_repos | to_entries[] | "  \(.key): \(.value.status) → \(.value.target)"' "$SCRIPT_DIR/sync_manifest.json"
    else
        echo "⚠️  No sync manifest found. Run 'sync' first."
    fi
    
    echo ""
    echo "Local Structure:"
    for dir in research datasets technical docs codex; do
        if [ -d "$SCRIPT_DIR/$dir" ]; then
            count=$(find "$SCRIPT_DIR/$dir" -type f | wc -l)
            echo "  $dir/: $count files"
        else
            echo "  $dir/: not found"
        fi
    done
}

sync_all() {
    echo "🔄 Starting full sync..."
    "$SCRIPT_DIR/sync-repos.sh"
}

push_changes() {
    local repo=$1
    local target_dir=""
    local repo_name=""
    
    case $repo in
        "research")
            target_dir="research"
            repo_name="cathedral-research"
            ;;
        "artifacts")
            target_dir="datasets"
            repo_name="ARTIFACTS-RESEARCH"
            ;;
        "technical")
            target_dir="technical"
            repo_name="cathedral-technical"
            ;;
        "docs")
            target_dir="docs"
            repo_name="cathedral-docs"
            ;;
        "codex")
            target_dir="codex"
            repo_name="codex-14499"
            ;;
        *)
            echo "❌ Unknown repo: $repo"
            return 1
            ;;
    esac
    
    if [ ! -d "$SCRIPT_DIR/$target_dir" ]; then
        echo "❌ Local $target_dir directory not found"
        return 1
    fi
    
    echo "📤 Pushing changes from $target_dir to $repo_name..."
    
    # Create temporary workspace
    temp_dir=$(mktemp -d)
    cd "$temp_dir"
    
    # Clone repo
    gh repo clone "Bekalah/$repo_name"
    cd "$repo_name"
    
    # Copy changes
    rsync -av --exclude='.git' "$SCRIPT_DIR/$target_dir/" ./
    
    # Check for changes
    if [ -n "$(git status --porcelain)" ]; then
        git add .
        git commit -m "Update from monorepo: $(date '+%Y-%m-%d %H:%M:%S')"
        git push origin main 2>/dev/null || git push origin master
        echo "✅ Changes pushed to $repo_name"
    else
        echo "ℹ️  No changes to push for $repo_name"
    fi
    
    # Cleanup
    cd "$SCRIPT_DIR"
    rm -rf "$temp_dir"
}

init_structure() {
    echo "🏗️  Initializing CODEX 144:99 monorepo structure..."
    
    # Create directories
    mkdir -p "$SCRIPT_DIR"/{research,datasets,technical,docs,codex}
    
    # Create README files
    cat > "$SCRIPT_DIR/research/README.md" << EOF
# Research Repository Sync
This directory contains research instructions synchronized from the cathedral-research repository.
Instructions are kept separate from datasets for better organization.
EOF

    cat > "$SCRIPT_DIR/datasets/README.md" << EOF
# Datasets & Artifacts Repository Sync  
This directory contains datasets and artifacts synchronized from the ARTIFACTS-RESEARCH repository.
This is private content separate from research instructions.
EOF

    cat > "$SCRIPT_DIR/technical/README.md" << EOF
# Technical Implementation Sync
This directory contains technical specifications synchronized from the cathedral-technical repository.
EOF

    cat > "$SCRIPT_DIR/docs/README.md" << EOF
# Documentation Sync
This directory contains documentation synchronized from the cathedral-docs repository.
EOF

    cat > "$SCRIPT_DIR/codex/README.md" << EOF
# Complete CODEX 144:99 Sync
This directory contains the complete CODEX 144:99 synchronized from the codex-14499 repository.
EOF

    echo "✅ Monorepo structure initialized"
    echo "📁 Created directories: research, datasets, technical, docs, codex"
}

# Main command handling
case $1 in
    "sync")
        sync_all
        ;;
    "status")
        show_status
        ;;
    "push")
        if [ -n "$2" ]; then
            push_changes "$2"
        else
            echo "Usage: $0 push [research|artifacts|technical|docs|codex]"
        fi
        ;;
    "init")
        init_structure
        ;;
    "research")
        case $2 in
            "pull")
                echo "🔄 Pulling research updates..."
                temp_dir=$(mktemp -d)
                cd "$temp_dir"
                gh repo clone Bekalah/cathedral-research
                rsync -av --exclude='.git' cathedral-research/ "$SCRIPT_DIR/research/"
                rm -rf "$temp_dir"
                echo "✅ Research updated"
                ;;
            "push")
                push_changes "research"
                ;;
            *)
                echo "Usage: $0 research [pull|push]"
                ;;
        esac
        ;;
    "artifacts")
        case $2 in
            "pull")
                echo "🔄 Pulling artifacts updates..."
                temp_dir=$(mktemp -d)
                cd "$temp_dir"
                gh repo clone Bekalah/ARTIFACTS-RESEARCH
                rsync -av --exclude='.git' ARTIFACTS-RESEARCH/ "$SCRIPT_DIR/datasets/"
                rm -rf "$temp_dir"
                echo "✅ Artifacts updated"
                ;;
            "push")
                push_changes "artifacts"
                ;;
            *)
                echo "Usage: $0 artifacts [pull|push]"
                ;;
        esac
        ;;
    "technical")
        case $2 in
            "pull")
                echo "🔄 Pulling technical updates..."
                temp_dir=$(mktemp -d)
                cd "$temp_dir"
                gh repo clone Bekalah/cathedral-technical
                rsync -av --exclude='.git' cathedral-technical/ "$SCRIPT_DIR/technical/"
                rm -rf "$temp_dir"
                echo "✅ Technical updated"
                ;;
            "push")
                push_changes "technical"
                ;;
            *)
                echo "Usage: $0 technical [pull|push]"
                ;;
        esac
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        show_help
        ;;
esac