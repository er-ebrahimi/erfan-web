#!/bin/bash

# Quick Recovery Script for ErfanWeb
# This script helps you quickly recover lost code

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚨 Code Recovery Assistant${NC}"
echo -e "${BLUE}========================${NC}"

# Navigate to project directory
cd "C:\Users\erfan\OneDrive\Documents\GitHub\ErfanWeb"

# Check git status
echo -e "${YELLOW}📊 Current Git Status:${NC}"
git status --short

echo ""
echo -e "${YELLOW}🔍 Checking for recovery options...${NC}"

# Check for stashes
echo -e "${BLUE}1. Checking Git Stashes:${NC}"
if [ -n "$(git stash list)" ]; then
    echo -e "${GREEN}✅ Found stashes:${NC}"
    git stash list --oneline
    echo ""
    echo -e "${YELLOW}💡 To recover from stash:${NC}"
    echo -e "   git stash apply \"stash@{0}\""
    echo -e "   git stash pop \"stash@{0}\""
else
    echo -e "${RED}❌ No stashes found${NC}"
fi

echo ""

# Check reflog
echo -e "${BLUE}2. Recent Git Activity:${NC}"
echo -e "${GREEN}✅ Recent commits and resets:${NC}"
git reflog --oneline -10

echo ""

# Check for uncommitted changes
echo -e "${BLUE}3. Uncommitted Changes:${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ You have uncommitted changes:${NC}"
    git status --porcelain
    echo ""
    echo -e "${YELLOW}💡 To save your changes:${NC}"
    echo -e "   git add ."
    echo -e "   git commit -m \"Recovery: save current work\""
else
    echo -e "${RED}❌ No uncommitted changes${NC}"
fi

echo ""

# Show recent commits
echo -e "${BLUE}4. Recent Commits:${NC}"
echo -e "${GREEN}✅ Last 5 commits:${NC}"
git log --oneline -5

echo ""
echo -e "${YELLOW}🛠️  Recovery Commands:${NC}"
echo -e "${BLUE}To recover from a specific commit:${NC}"
echo -e "   git checkout -b recovery-branch <commit-hash>"
echo ""
echo -e "${BLUE}To reset to a previous commit:${NC}"
echo -e "   git reset --hard <commit-hash>"
echo ""
echo -e "${BLUE}To recover a specific file:${NC}"
echo -e "   git checkout <commit-hash> -- <file-path>"
echo ""
echo -e "${GREEN}🎉 Recovery options displayed above!${NC}"
