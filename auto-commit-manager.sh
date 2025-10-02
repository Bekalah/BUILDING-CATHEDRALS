#!/bin/bash

# 🔄 AUTO-COMMIT REPOSITORY MANAGER
# Comprehensive system for auto-committing and pushing to multiple repositories
# with intelligent change detection, code standards validation, and deployment
#
# Never Flat, Never SVG - Always Vite + React + Three.js
# Based on sacred mathematics principles and ND-safe design
#
# @author Rebecca Respawn 
# @business THE CATHEDRAL OF CIRCUITS
# @system 144:99 Fusion Kink Heaven Auto-Deployment

set -e

# 🎯 Configuration and Sacred Constants
WORKSPACE_ROOT="/Users/rebeccalemke/Library/Mobile Documents/com~apple~CloudDocs/BUILDING CATHEDRALS"
BOOKS_ROOT="/Users/rebeccalemke/Library/Mobile Documents/com~apple~CloudDocs/BOOKS"
SUNDAY_ROOT="/Users/rebeccalemke/Downloads/Sunday-cathedral"

# Sacred Mathematics - Codex 144:99
MANIFESTATION_NODES=144
DISSOLUTION_DEPTHS=99
SACRED_RATIO=$(echo "scale=10; 144/99" | bc -l) # 1.454545...
SPINE_VERTEBRAE=33
TAROT_CARDS=78

# Repository Configuration  
REPO_NAMES=("BUILDING-CATHEDRALS" "cathedral" "cathedral-technical" "cathedral-research" "cathedral-docs" "codex-14499" "ARTIFACTS-RESEARCH")
REPO_URLS=("Bekalah/BUILDING-CATHEDRALS" "Bekalah/cathedral" "Bekalah/cathedral-technical" "Bekalah/cathedral-research" "Bekalah/cathedral-docs" "Bekalah/codex-14499" "Bekalah/ARTIFACTS-RESEARCH")

# Function to get repo URL by name
get_repo_url() {
    local repo_name="$1"
    for i in "${!REPO_NAMES[@]}"; do
        if [ "${REPO_NAMES[$i]}" = "$repo_name" ]; then
            echo "${REPO_URLS[$i]}"
            return
        fi
    done
}

# Change Detection Patterns
CRITICAL_FILES=(
    "packages/synthesis-engine/arcana-music-modes.js"
    "packages/bridge-system/mystery-house-codex-mirror.js" 
    "packages/art-engine/arcana-art-synthesis-labs.js"
    "packages/science-engine/oscilloscope-fractal-engine.js"
    "vite.config.js"
    "package.json"
    "deploy-cathedral.sh"
    "cathedral-manager.sh"
)

# Color codes for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Initialize logging
LOG_FILE="$WORKSPACE_ROOT/auto-commit-log.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID=$(date +%s)

echo -e "${PURPLE}🌀📊 AUTO-COMMIT REPOSITORY MANAGER${NC}"
echo -e "${CYAN}⚡ Codex 144:99 Fusion Kink Heaven Auto-Deployment${NC}"
echo -e "${BLUE}🏗️ Never Flat, Never SVG - Always Interactive 3D${NC}"
echo ""
echo -e "${YELLOW}📍 Workspace: ${WORKSPACE_ROOT}${NC}"
echo -e "${YELLOW}🎯 Sacred Ratio: ${SACRED_RATIO}${NC}"
echo -e "${YELLOW}🕐 Session: ${SESSION_ID}${NC}"
echo ""

# 🔍 Function: Detect Changes with Intelligence
detect_changes() {
    local repo_path="$1"
    local repo_name="$2"
    
    echo -e "${BLUE}🔍 Detecting changes in ${repo_name}...${NC}"
    
    cd "$repo_path"
    
    # Check if git repo exists
    if [ ! -d ".git" ]; then
        echo -e "${YELLOW}⚠️  No git repository found, initializing...${NC}"
        git init
        local repo_url=$(get_repo_url "$repo_name")
        git remote add origin "https://github.com/${repo_url}.git" 2>/dev/null || true
    fi
    
    # Check for unstaged changes
    local unstaged_changes=$(git diff --name-only)
    local staged_changes=$(git diff --cached --name-only)
    local untracked_files=$(git ls-files --others --exclude-standard)
    
    # Count changes
    local change_count=0
    [ -n "$unstaged_changes" ] && change_count=$((change_count + $(echo "$unstaged_changes" | wc -l)))
    [ -n "$staged_changes" ] && change_count=$((change_count + $(echo "$staged_changes" | wc -l)))
    [ -n "$untracked_files" ] && change_count=$((change_count + $(echo "$untracked_files" | wc -l)))
    
    if [ $change_count -eq 0 ]; then
        echo -e "${GREEN}✅ No changes detected in ${repo_name}${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}📝 Found ${change_count} changes in ${repo_name}:${NC}"
    
    # Show changes with context
    if [ -n "$unstaged_changes" ]; then
        echo -e "${CYAN}  Unstaged Changes:${NC}"
        echo "$unstaged_changes" | sed 's/^/    /'
    fi
    
    if [ -n "$staged_changes" ]; then
        echo -e "${CYAN}  Staged Changes:${NC}"
        echo "$staged_changes" | sed 's/^/    /'
    fi
    
    if [ -n "$untracked_files" ]; then
        echo -e "${CYAN}  Untracked Files:${NC}"
        echo "$untracked_files" | sed 's/^/    /'
    fi
    
    return 0
}

# 🧪 Function: Run Standards Check
run_standards_check() {
    local repo_path="$1"
    local repo_name="$2"
    
    echo -e "${BLUE}🧪 Running standards check for ${repo_name}...${NC}"
    
    cd "$repo_path"
    
    local standards_passed=true
    
    # Check for critical files that should not be flat/SVG
    for critical_file in "${CRITICAL_FILES[@]}"; do
        if [ -f "$critical_file" ]; then
            # Check for SVG-only content (red flag)
            if grep -q "svg.*width.*height" "$critical_file" 2>/dev/null && \
               ! grep -q "Three.js\|WebGL\|canvas\|oscilloscope\|synthesis" "$critical_file" 2>/dev/null; then
                echo -e "${RED}❌ WARNING: ${critical_file} appears to be flat/SVG-only${NC}"
                standards_passed=false
            fi
            
            # Check for Three.js integration (good!)
            if grep -q "Three.js\|THREE\|WebGL\|oscilloscope\|synthesis\|fractal" "$critical_file" 2>/dev/null; then
                echo -e "${GREEN}✅ ${critical_file} contains interactive 3D content${NC}"
            fi
        fi
    done
    
    # Check package.json for proper dependencies
    if [ -f "package.json" ]; then
        if grep -q '"react".*"three".*"vite"' package.json 2>/dev/null || \
           (grep -q '"react"' package.json && grep -q '"three"' package.json && grep -q '"vite"' package.json); then
            echo -e "${GREEN}✅ Proper tech stack: React + Three.js + Vite${NC}"
        else
            echo -e "${YELLOW}⚠️  Check tech stack - ensure React + Three.js + Vite${NC}"
        fi
    fi
    
    # Check for ND-safe principles
    local nd_safe_indicators=0
    if grep -r "accessibility\|ND-safe\|trauma.aware\|inclusive" . --include="*.js" --include="*.md" --include="*.json" 2>/dev/null >/dev/null; then
        ((nd_safe_indicators++))
        echo -e "${GREEN}✅ ND-safe design principles detected${NC}"
    fi
    
    # Check for sacred mathematics
    if grep -r "144.*99\|sacred.ratio\|manifestation.nodes\|dissolution.depths" . --include="*.js" 2>/dev/null >/dev/null; then
        echo -e "${GREEN}✅ Sacred mathematics (144:99) integrated${NC}"
    fi
    
    # Run npm standards if available
    if [ -f "package.json" ] && command -v npm &> /dev/null; then
        echo -e "${BLUE}📦 Running npm standards check...${NC}"
        if npm run standards 2>/dev/null >/dev/null || npm run lint 2>/dev/null >/dev/null; then
            echo -e "${GREEN}✅ NPM standards check passed${NC}"
        else
            echo -e "${YELLOW}⚠️  NPM standards check not available or failed${NC}"
        fi
    fi
    
    if [ "$standards_passed" = true ]; then
        echo -e "${GREEN}✅ Standards check passed for ${repo_name}${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Standards check completed with warnings for ${repo_name}${NC}"
        return 0  # Continue with commit even with warnings
    fi
}

# 📝 Function: Generate Intelligent Commit Message
generate_commit_message() {
    local repo_path="$1"
    local repo_name="$2"
    local change_summary="$3"
    
    cd "$repo_path"
    
    # Analyze changes for intelligent messaging
    local has_synthesis=$(git diff --cached --name-only | grep -E "(synthesis|arcana|music)" || echo "")
    local has_art=$(git diff --cached --name-only | grep -E "(art|three|visual)" || echo "")
    local has_bridge=$(git diff --cached --name-only | grep -E "(bridge|mirror|mystery)" || echo "")
    local has_science=$(git diff --cached --name-only | grep -E "(oscilloscope|fractal|science)" || echo "")
    local has_config=$(git diff --cached --name-only | grep -E "(config|package|deploy)" || echo "")
    
    local commit_type=""
    local commit_scope=""
    local commit_description=""
    
    # Determine commit type and scope based on changes
    if [ -n "$has_synthesis" ]; then
        commit_type="🎵 synthesis"
        commit_scope="arcana-music-modes"
        commit_description="Enhanced Arcana synthesis engine with sacred frequencies and oscilloscope integration"
    elif [ -n "$has_art" ]; then
        commit_type="🎨 art"
        commit_scope="three-js-environments"
        commit_description="Updated 3D art laboratories with sacred geometry and interactive visualizations"
    elif [ -n "$has_bridge" ]; then
        commit_type="🔗 integration"
        commit_scope="mystery-house-bridge"
        commit_description="Improved Magical Mystery House ↔ Codex 144:99 mirroring system"
    elif [ -n "$has_science" ]; then
        commit_type="🌀 science"
        commit_scope="oscilloscope-fractals"
        commit_description="Advanced oscilloscope fractal engine with mathematical art generation"
    elif [ -n "$has_config" ]; then
        commit_type="⚙️ config"
        commit_scope="build-deploy"
        commit_description="Updated build configuration and deployment pipeline"
    else
        commit_type="✨ enhancement"
        commit_scope="cathedral-systems"
        commit_description="General improvements to Cathedral consciousness technology platform"
    fi
    
    # Include sacred mathematics in every commit
    local sacred_note="[144:99 Codex $(date +%m%d)]"
    
    # Generate final commit message
    local commit_message="${commit_type}: ${commit_description}

${sacred_note} - ${commit_scope}

Technical Architecture:
- Never Flat: Always interactive 3D experiences
- Never SVG-only: Rich, dynamic Vite + React + Three.js
- ND-Safe: Trauma-aware, accessibility-first design
- Sacred Math: Integrated 144:99 manifestation/dissolution ratio

Changes:
${change_summary}

Automated deployment: $(date '+%Y-%m-%d %H:%M:%S UTC')
Session: ${SESSION_ID}"

    echo "$commit_message"
}

# 💾 Function: Commit and Push Changes
commit_and_push() {
    local repo_path="$1"
    local repo_name="$2"
    
    echo -e "${BLUE}💾 Committing and pushing changes for ${repo_name}...${NC}"
    
    cd "$repo_path"
    
    # Add all changes
    git add .
    
    # Generate change summary
    local change_summary=$(git diff --cached --stat)
    
    # Generate intelligent commit message
    local commit_message=$(generate_commit_message "$repo_path" "$repo_name" "$change_summary")
    
    # Commit changes
    if git commit -m "$commit_message"; then
        echo -e "${GREEN}✅ Successfully committed changes to ${repo_name}${NC}"
        
        # Push to remote
        echo -e "${BLUE}📤 Pushing to remote repository...${NC}"
        
        # Determine default branch
        local default_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")
        
        # Push changes
        if git push origin "$default_branch" 2>/dev/null; then
            echo -e "${GREEN}✅ Successfully pushed ${repo_name} to remote${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Push failed, attempting to set upstream...${NC}"
            if git push --set-upstream origin "$default_branch"; then
                echo -e "${GREEN}✅ Successfully pushed ${repo_name} with upstream${NC}"
                return 0
            else
                echo -e "${RED}❌ Failed to push ${repo_name}${NC}"
                return 1
            fi
        fi
    else
        echo -e "${YELLOW}ℹ️  No changes to commit in ${repo_name}${NC}"
        return 1
    fi
}

# 🚀 Function: Deploy Cathedral Site
deploy_cathedral() {
    echo -e "${PURPLE}🚀 Deploying Cathedral site...${NC}"
    
    cd "$WORKSPACE_ROOT"
    
    if [ -f "deploy-cathedral.sh" ]; then
        chmod +x deploy-cathedral.sh
        if ./deploy-cathedral.sh; then
            echo -e "${GREEN}✅ Cathedral deployment successful${NC}"
        else
            echo -e "${RED}❌ Cathedral deployment failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  deploy-cathedral.sh not found${NC}"
    fi
}

# 📊 Function: Log Operation
log_operation() {
    local operation="$1"
    local repo_name="$2"
    local status="$3"
    local details="$4"
    
    # Create log entry
    local log_entry=$(cat <<EOF
{
  "timestamp": "$TIMESTAMP",
  "session_id": "$SESSION_ID",
  "operation": "$operation",
  "repository": "$repo_name",
  "status": "$status",
  "details": "$details",
  "sacred_ratio": "$SACRED_RATIO",
  "workspace": "$WORKSPACE_ROOT"
}
EOF
)
    
    # Append to log file (create if doesn't exist)
    if [ ! -f "$LOG_FILE" ]; then
        echo '[]' > "$LOG_FILE"
    fi
    
    # Add entry to JSON array
    jq --argjson entry "$log_entry" '. += [$entry]' "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"
}

# 🔄 Function: Sync Repositories  
sync_repositories() {
    echo -e "${BLUE}🔄 Syncing repositories...${NC}"
    
    cd "$WORKSPACE_ROOT"
    
    if [ -f "sync-repos.sh" ]; then
        chmod +x sync-repos.sh
        if ./sync-repos.sh; then
            echo -e "${GREEN}✅ Repository sync successful${NC}"
            log_operation "sync" "all" "success" "All repositories synced successfully"
        else
            echo -e "${YELLOW}⚠️  Repository sync completed with warnings${NC}"
            log_operation "sync" "all" "warning" "Repository sync completed with warnings"
        fi
    else
        echo -e "${YELLOW}⚠️  sync-repos.sh not found, skipping sync${NC}"
    fi
}

# 🏗️ Main Execution Function
main() {
    echo -e "${PURPLE}🏗️ Starting auto-commit process...${NC}"
    echo ""
    
    local total_repos=0
    local successful_commits=0
    local failed_commits=0
    
    # Initialize log
    log_operation "session_start" "all" "info" "Auto-commit session started"
    
    # Sync repositories first
    sync_repositories
    
    # Process each repository
    for repo_name in "${REPO_NAMES[@]}"; do
        echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
        echo -e "${CYAN}📂 Processing Repository: ${repo_name}${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
        
        total_repos=$((total_repos + 1))
        
        # Determine repo path
        local repo_path=""
        case "$repo_name" in
            "BUILDING-CATHEDRALS")
                repo_path="$WORKSPACE_ROOT"
                ;;
            "cathedral")
                repo_path="$BOOKS_ROOT/cathedral"
                ;;
            "cathedral-technical")
                repo_path="$WORKSPACE_ROOT/technical"
                ;;
            "cathedral-research")
                repo_path="$WORKSPACE_ROOT/research"
                ;;
            "cathedral-docs")
                repo_path="$WORKSPACE_ROOT/docs"
                ;;
            "codex-14499")
                repo_path="$WORKSPACE_ROOT/codex"
                ;;
            "ARTIFACTS-RESEARCH")
                repo_path="$WORKSPACE_ROOT/datasets"
                ;;
        esac
        
        if [ ! -d "$repo_path" ]; then
            echo -e "${YELLOW}⚠️  Repository path not found: ${repo_path}${NC}"
            log_operation "commit" "$repo_name" "skipped" "Repository path not found"
            continue
        fi
        
        # Detect changes
        if detect_changes "$repo_path" "$repo_name"; then
            # Run standards check
            run_standards_check "$repo_path" "$repo_name"
            
            # Commit and push
            if commit_and_push "$repo_path" "$repo_name"; then
                successful_commits=$((successful_commits + 1))
                log_operation "commit" "$repo_name" "success" "Changes committed and pushed successfully"
            else
                failed_commits=$((failed_commits + 1))
                log_operation "commit" "$repo_name" "failed" "Failed to commit or push changes"
            fi
        else
            log_operation "commit" "$repo_name" "no_changes" "No changes detected"
        fi
        
        echo ""
    done
    
    # Deploy Cathedral if BUILDING-CATHEDRALS was updated
    if [ $successful_commits -gt 0 ]; then
        echo -e "${PURPLE}🚀 Changes detected, triggering Cathedral deployment...${NC}"
        deploy_cathedral
    fi
    
    # Final summary
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${PURPLE}📊 AUTO-COMMIT SESSION SUMMARY${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}🎯 Total Repositories: ${total_repos}${NC}"
    echo -e "${GREEN}✅ Successful Commits: ${successful_commits}${NC}"
    echo -e "${RED}❌ Failed Commits: ${failed_commits}${NC}"
    echo -e "${YELLOW}🕐 Session ID: ${SESSION_ID}${NC}"
    echo -e "${YELLOW}📊 Sacred Ratio: ${SACRED_RATIO}${NC}"
    echo -e "${BLUE}📝 Log File: ${LOG_FILE}${NC}"
    echo ""
    
    if [ $successful_commits -gt 0 ]; then
        echo -e "${GREEN}🎉 Auto-commit session completed successfully!${NC}"
        echo -e "${CYAN}🌀 Cathedral consciousness technology platform updated${NC}"
        echo -e "${PURPLE}✨ Never Flat, Never SVG - Always Interactive 3D${NC}"
    else
        echo -e "${YELLOW}ℹ️  No changes committed in this session${NC}"
    fi
    
    # Log session end
    log_operation "session_end" "all" "success" "Auto-commit session completed: $successful_commits commits, $failed_commits failures"
    
    echo ""
    echo -e "${CYAN}🔗 Live Site: https://bekalah.github.io/cathedral/${NC}"
    echo -e "${CYAN}⚡ Tech Stack: Vite + React + Three.js${NC}"
    echo -e "${CYAN}🎨 Principles: ND-Safe, Sacred Mathematics, Interactive 3D${NC}"
    echo ""
}

# 🚀 Execute Main Function
main "$@"

# Make sure the script is executable
chmod +x "$0"

echo -e "${PURPLE}🌀 Cathedral Auto-Commit Manager ready for next session${NC}"