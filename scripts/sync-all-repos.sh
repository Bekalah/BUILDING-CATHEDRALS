#!/bin/bash

# Cathedral Repository Sync Script
# This script keeps all Cathedral repositories synchronized

set -e  # Exit on any error

echo "🔄 Starting Cathedral repository synchronization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_REPO_DIR="$(dirname "$SCRIPT_DIR")"

print_status "Main repository directory: $MAIN_REPO_DIR"

# Function to sync a repository
sync_repo() {
    local repo_path="$1"
    local repo_name="$2"

    if [ ! -d "$repo_path" ]; then
        print_warning "Repository $repo_name not found at $repo_path"
        return 1
    fi

    print_status "Syncing $repo_name repository..."
    cd "$repo_path"

    # Check if git repository
    if [ ! -d ".git" ]; then
        print_warning "$repo_name is not a git repository"
        return 1
    fi

    # Fetch latest changes
    if git remote get-url origin >/dev/null 2>&1; then
        print_status "Fetching updates for $repo_name..."
        if git fetch origin; then
            print_success "Fetched updates for $repo_name"
        else
            print_warning "Failed to fetch updates for $repo_name"
        fi
    else
        print_warning "No remote origin configured for $repo_name"
    fi

    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "You have uncommitted changes in $repo_name"
        print_status "Stashing changes..."
        if git stash push -m "Auto-stash before sync"; then
            print_success "Stashed changes in $repo_name"
        fi
    fi

    # Pull latest changes
    if git pull origin main 2>/dev/null || git pull origin master 2>/dev/null; then
        print_success "Updated $repo_name"
    else
        print_warning "No remote tracking branch found for $repo_name"
    fi

    # Restore stashed changes if any
    if git stash list | grep -q "Auto-stash"; then
        print_status "Restoring stashed changes in $repo_name..."
        if git stash pop; then
            print_success "Restored changes in $repo_name"
        fi
    fi
}

# Sync main repository
sync_repo "$MAIN_REPO_DIR" "BUILDING-CATHEDRALS"

# Sync research repository
sync_repo "$MAIN_REPO_DIR/../cathedral-research" "cathedral-research"

# Sync technical repository
sync_repo "$MAIN_REPO_DIR/../cathedral-technical" "cathedral-technical"

# Sync documentation repository
sync_repo "$MAIN_REPO_DIR/../cathedral-docs" "cathedral-docs"

# Check for any issues
print_status "Checking repository status..."

cd "$MAIN_REPO_DIR"

# Verify all repositories are clean
REPOS_CLEAN=true

for repo in "BUILDING-CATHEDRALS:." "cathedral-research:../cathedral-research" "cathedral-technical:../cathedral-technical" "cathedral-docs:../cathedral-docs"; do
    IFS=':' read -r name path <<< "$repo"
    cd "$MAIN_REPO_DIR/$path"

    if [ -n "$(git status --porcelain)" ]; then
        print_warning "$name has uncommitted changes"
        REPOS_CLEAN=false
    fi

    if ! git diff --quiet HEAD origin/main 2>/dev/null && ! git diff --quiet HEAD origin/master 2>/dev/null; then
        print_warning "$name is ahead of remote"
        REPOS_CLEAN=false
    fi
done

cd "$MAIN_REPO_DIR"

if [ "$REPOS_CLEAN" = true ]; then
    print_success "All repositories are synchronized and clean!"
else
    print_warning "Some repositories may need attention"
fi

print_status "Repository sync completed!"

# Optional: Display current branch and status for each repo
echo ""
print_status "Current status of all repositories:"
for repo in "BUILDING-CATHEDRALS:." "cathedral-research:../cathedral-research" "cathedral-technical:../cathedral-technical" "cathedral-docs:../cathedral-docs"; do
    IFS=':' read -r name path <<< "$repo"
    cd "$MAIN_REPO_DIR/$path"
    branch=$(git branch --show-current)
    echo -e "  ${name}: ${GREEN}$branch${NC}"
done

cd "$MAIN_REPO_DIR"

print_success "🎉 Cathedral repository synchronization complete!"
