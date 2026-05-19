---
title: "Modern CI/CD: From Code to Production in Minutes"
date: 2026-03-10
tags: ['CI/CD', 'DevOps', 'GitHub Actions', 'Docker', 'Automation']
---

# Modern CI/CD: From Code to Production in Minutes

CI/CD has gone from "nice to have" to table stakes. Here's how to build a modern pipeline that actually ships with confidence.

## The Goal

```
Developer pushes code
  ↓
Tests run automatically
  ↓
Build and lint checks
  ↓
Preview deployment (staging)
  ↓
Merge to main
  ↓
Production deployment
  ↓
Monitoring and alerting
```

This entire flow should complete in under 10 minutes.

## GitHub Actions: The Practical Setup

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'  # Cache node_modules
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - name: Deploy to staging
        run: # Your deployment script
        env:
          DEPLOY_KEY: ${{ secrets.STAGING_DEPLOY_KEY }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - name: Deploy to production
        run: # Your production deployment
        env:
          DEPLOY_KEY: ${{ secrets.PROD_DEPLOY_KEY }}
```

## The Branch Strategy

```
feature/xyz → develop (auto-deploy to staging)
develop → main (requires PR + review + manual approval for production)
```

## Docker in CI

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: |
      myrepo/myapp:latest
      myrepo/myapp:${{ github.sha }}
    cache-from: type=gha     # Use GitHub's cache
    cache-to: type=gha,mode=max
```

Tagging with `github.sha` means every deployment is traceable to an exact commit.

## The Monitoring Must-Have

```javascript
// In your app — track deployment success
console.log(`[DEPLOY] App starting. Version: ${process.env.GIT_SHA}`);

// Health endpoint CI/CD calls to verify deployment
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: process.env.GIT_SHA });
});
```

CI/CD is only as good as the checks you run. Invest in your test suite first. The automation amplifies both your quality and your mistakes.

