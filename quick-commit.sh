#!/bin/bash

set -e

echo "=== Staging all changes ==="
git add -A
git --no-pager status

echo ""
read -p "Enter commit message: " commit_message

if [ -z "$commit_message" ]; then
    echo "Error: Commit message cannot be empty"
    exit 1
fi

echo ""
echo "=== Committing changes ==="
git commit -m "$commit_message"

echo ""
echo "=== Pushing to remote (dry run) ==="
git push --dry-run

echo ""
echo "=== Done (dry run - no changes pushed) ==="
