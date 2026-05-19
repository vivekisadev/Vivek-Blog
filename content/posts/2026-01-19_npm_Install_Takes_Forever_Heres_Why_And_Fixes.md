---
title: "npm Install Takes Forever? Here's Why (And Fixes)"
date: 2026-01-19
tags: ['npm', 'Node.js', 'Dev', 'Memes', 'Performance']
---

# npm Install Takes Forever? Here's Why (And Fixes)

You've been there. `npm install`. 30 seconds. 60 seconds. The cursor blinks. Your entire will to live drains. Let's talk about why this happens and how to actually fix it.

## Why npm Is Slow (The Real Reasons)

### 1. The node_modules Problem

node_modules is infamous. The joke about it being the heaviest object in the universe exists because a simple React app can have **1,000+ packages** and **100,000+ files**.

```bash
# The horror
du -sh node_modules
# 487MB for a "simple" project

ls node_modules | wc -l  
# 1,247 packages
```

### 2. Serial Installation (Legacy npm Behavior)

Old npm installed packages one-by-one. Modern npm parallelizes, but the overhead of resolving 1,247 packages is still significant.

### 3. Network Latency to npm Registry

Every package requires a registry request. With deep dependency trees, this adds up.

## The Fixes

### Switch to Bun (Fastest)

```bash
# Install bun
curl -fsSL https://bun.sh/install | bash

# Same command, 10x faster
bun install
```

### Use pnpm (Middle Ground)

```bash
npm i -g pnpm
pnpm install
```

pnpm uses hard links and a global store — it doesn't download the same package twice across projects.

### Cache Your CI Pipeline

```yaml
# GitHub Actions caching
- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
```

### Audit Your Dependencies

```bash
# See what's actually large
npx cost-of-modules

# Find unused packages  
npx depcheck
```

## The Honest Meme Situation

```
time npm install
real    1m 23.467s
user    0m 45.231s

time bun install
real    0m 3.891s
```

That's not a meme. That's a benchmark. Bun wins.

## Bottom Line

The npm slowness is a solved problem — you just have to opt into the solution. Try Bun. Your development experience will thank you.

