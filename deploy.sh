#!/bin/bash
# Deploy script - sets tokens, pushes to GitHub, deploys to Vercel
# Usage: ./deploy.sh

echo "Producer-Consumer Tutorial - Deploy Script"

# Check tokens
if [ -z "$VERCEL_TOKEN" ]; then
  echo "ERROR: VERCEL_TOKEN not set"
  echo "Set it with: export VERCEL_TOKEN=your_token"
  exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN not set"
  echo "Set it with: export GITHUB_TOKEN=your_token"
  exit 1
fi

# Init git if needed
if [ ! -d ".git" ]; then
  git init
  git add .
  git commit -m "Initial commit: Producer-Consumer C# tutorial site"
fi

# Push to GitHub (create repo first via gh or API)
git remote remove origin 2>/dev/null
git remote add origin https://$GITHUB_TOKEN@github.com/$(gh repo create producer-consumer-tutorial --public --source=. --push 2>&1 | grep -oP '[^/]+/[^/]+$' || echo "user/repo")
git push -u origin main 2>/dev/null || git push -u origin master

# Deploy to Vercel
npx vercel --prod --token $VERCEL_TOKEN --yes

echo "Deploy complete!"
