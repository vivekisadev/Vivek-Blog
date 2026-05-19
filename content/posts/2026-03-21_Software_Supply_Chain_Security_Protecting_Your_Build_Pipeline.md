---
title: "Software Supply Chain Security: Protecting Your Build Pipeline"
date: 2026-03-21
tags: ['Supply Chain', 'Security', 'CI/CD', 'DevOps', 'npm']
---

# Software Supply Chain Security: Protecting Your Build Pipeline

Your application is a chain of dependencies, build tools, and third-party services. Any link can be compromised. Here's how to protect yours.

## The Threat Model

Modern software supply chains are attack surfaces:

```
Your Code
  + npm/pip/cargo packages (1000s of them)
  + Build tools (webpack, babel, etc.)
  + CI/CD systems (GitHub Actions, etc.)
  + Container base images
  + Cloud services
  + Third-party APIs
= A chain as secure as its weakest link
```

## Dependency Security

### Lockfiles Are Non-Negotiable

```bash
# Commit package-lock.json / yarn.lock / Cargo.lock
# Always use exact install in CI
npm ci            # Uses lockfile exactly
pip install -r requirements.txt  # Pin all versions

# Never:
npm install  # Can pull newer version than expected
pip install requests  # No version pin
```

### Signed Commits and Packages

```bash
# Verify npm package integrity
npm audit

# For critical packages, verify signatures
npm view react dist-tags
```

### Dependency Pinning (Aggressive Version)

```json
// Instead of:
"express": "^4.18.0"  // Allows auto-minor/patch updates

// Use:
"express": "4.18.2"   // Exact version — you control updates
```

## SBOM (Software Bill of Materials)

Generate a manifest of every component in your software:

```bash
# Generate SBOM
npx @cyclonedx/cyclonedx-npm --output-format json --output-file sbom.json

# Submit to dependency track for continuous monitoring
```

This lets you instantly identify affected software when a new CVE is published.

## CI/CD Pipeline Security

```yaml
# GitHub Actions security hardening
on: push

permissions:
  contents: read    # Minimum permissions needed
  
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false  # Don't expose git credentials
      
      # Pin action versions by SHA (not tags — tags can move!)
      - uses: actions/setup-node@11f8f9e8dcc4b56cd8b819930068e13b5ada12ab
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm audit --audit-level=critical
```

## Container Security

```dockerfile
# Pin base image digest (not just tag)
FROM node:20.11.0-alpine@sha256:abc123...  # SHA doesn't change

# Run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Scan before deploying
# trivy image myapp:latest
```

## The Minimal Viable Supply Chain Security

1. ✅ Commit lockfiles
2. ✅ `npm ci` in CI
3. ✅ `npm audit` failing on critical
4. ✅ Dependabot for automated updates
5. ✅ Pin CI action versions
6. ✅ Non-root containers

This takes half a day to implement. Do it.

