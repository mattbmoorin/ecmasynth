#!/bin/bash

# Files to remove from Git history
files_to_remove=(
    ".DS_Store"
    "ecmasynth_backend/.DS_Store"
    "ECMASynth.API/bin"
    "ECMASynth.API/obj"
    "node_modules"
    "package-lock.json"
    "yarn.lock"
    ".env"
    ".env.local"
    ".env.development.local"
    ".env.test.local"
    ".env.production.local"
    "ecmasynth-client/package-lock.json"
    "ecmasynth_backend/config/master.key"
    "ecmasynth_backend/config/credentials.yml.enc"
    "ecmasynth_backend/log"
    "ecmasynth_backend/tmp"
)

# Create a temporary branch
git checkout --orphan temp_branch

# Add all files
git add -A

# Commit
git commit -m "Initial commit"

# Delete the old branch
git branch -D main

# Rename temp branch to main
git branch -m main

# Remove files from history
for file in "${files_to_remove[@]}"
do
    git filter-branch --force --index-filter \
    "git rm -rf --cached --ignore-unmatch $file" \
    --prune-empty --tag-name-filter cat -- --all
done

# Force push
echo "Review the changes. If everything looks correct, run:"
echo "git push origin --force --all" 