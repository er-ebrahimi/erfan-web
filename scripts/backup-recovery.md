# Code Recovery and Backup Guide

## 🚨 Immediate Recovery Options

### 1. Recover from Git Stash

```bash
# List all stashes
git stash list

# View what's in a specific stash
git stash show -p "stash@{0}"

# Apply a stash (keeps the stash)
git stash apply "stash@{0}"

# Pop a stash (removes it from stash list)
git stash pop "stash@{0}"
```

### 2. Recover from Git History

```bash
# See recent commits
git log --oneline -10

# See all recent activity
git reflog --oneline -20

# Reset to a previous commit (CAREFUL!)
git reset --hard <commit-hash>

# Create a new branch from a previous commit
git checkout -b recovery-branch <commit-hash>
```

### 3. Recover from IDE Auto-save

- Check your IDE's local history
- Look for auto-saved versions
- Check temporary files

## 🛡️ Prevention Strategies

### 1. Git Configuration

```bash
# Set up automatic stashing
git config --global stash.autoStash true

# Set up push on every commit
git config --global push.autoSetupRemote true

# Set up branch protection
git config --global branch.autosetupmerge always
```

### 2. IDE Settings

- Enable auto-save
- Enable local history
- Set up automatic backups
- Configure auto-commit

### 3. Backup Strategy

```bash
# Create a backup script
echo "#!/bin/bash
git add .
git commit -m 'Auto-backup: $(date)'
git push origin $(git branch --show-current)" > backup.sh
chmod +x backup.sh
```

## 🔧 Recovery Commands

### If you lost uncommitted changes:

```bash
# Check for stashes
git stash list

# Check for any uncommitted changes
git status

# Check git reflog for recent activity
git reflog
```

### If you lost committed changes:

```bash
# Find the commit you want to recover
git log --oneline --all

# Create a new branch from that commit
git checkout -b recovery-branch <commit-hash>

# Or reset to that commit (CAREFUL!)
git reset --hard <commit-hash>
```

### If you lost files completely:

```bash
# Check if files exist in git history
git log --follow -- <file-path>

# Recover a specific file
git checkout <commit-hash> -- <file-path>
```

## 📋 Daily Workflow to Prevent Loss

1. **Before starting work:**

   ```bash
   git status
   git stash push -m "Work in progress backup"
   ```

2. **During work:**

   ```bash
   # Commit frequently
   git add .
   git commit -m "WIP: feature description"
   ```

3. **After work:**
   ```bash
   git push origin $(git branch --show-current)
   ```

## 🚨 Emergency Recovery

If you think you've lost code:

1. **DON'T PANIC** - Git keeps history
2. Check `git reflog` for recent activity
3. Check `git stash list` for stashed changes
4. Look for auto-saved files in your IDE
5. Check if files exist in previous commits

## 📞 Quick Recovery Checklist

- [ ] Check `git status`
- [ ] Check `git stash list`
- [ ] Check `git reflog`
- [ ] Check IDE local history
- [ ] Check for auto-saved files
- [ ] Check previous commits with `git log`
