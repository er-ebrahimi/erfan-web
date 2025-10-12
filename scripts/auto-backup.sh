#!/bin/bash

# Auto-backup script for ErfanWeb project
# This script creates automatic backups of your work

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Starting auto-backup process...${NC}"

# Navigate to project directory
cd "C:\Users\erfan\OneDrive\Documents\GitHub\ErfanWeb"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not in a git repository!${NC}"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📋 Current branch: $CURRENT_BRANCH${NC}"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected. Creating backup...${NC}"
    
    # Create a timestamp for the backup
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    
    # Stash current changes with timestamp
    git stash push -m "Auto-backup: $TIMESTAMP"
    
    echo -e "${GREEN}✅ Changes backed up to stash${NC}"
    
    # Show stash list
    echo -e "${YELLOW}📦 Available stashes:${NC}"
    git stash list --oneline
    
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi

# Check if we need to push
if [ -n "$(git log origin/$CURRENT_BRANCH..HEAD)" ]; then
    echo -e "${YELLOW}📤 Pushing changes to remote...${NC}"
    git push origin $CURRENT_BRANCH
    echo -e "${GREEN}✅ Changes pushed to remote${NC}"
else
    echo -e "${GREEN}✅ Local branch is up to date with remote${NC}"
fi

echo -e "${GREEN}🎉 Auto-backup completed successfully!${NC}"
echo -e "${YELLOW}💡 Tip: Run this script regularly to keep your work safe${NC}"
