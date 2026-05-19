---
title: "Tailwind CSS v4 — What Changed and Is It Worth Upgrading?"
date: 2026-01-18
tags: ['Tailwind', 'CSS', 'Frontend', 'Design', 'Web']
---

# Tailwind CSS v4 — What Changed and Is It Worth Upgrading?

Tailwind v4 is the biggest rewrite of the framework since v1. It's faster, more flexible, and breaks some things. Here's everything you need to know.

## The Big Changes

### 1. CSS-First Configuration

No more `tailwind.config.js` for basic setup. Configuration now lives in CSS:

```css
/* Old way: tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#6366f1'
      }
    }
  }
}

/* New way: your main CSS file */
@import "tailwindcss";

@theme {
  --color-brand: #6366f1;
}
```

### 2. Oxide Engine (10x Faster)

The new build engine is written in Rust (via Lightning CSS and a custom Rust core). Cold build times dropped from seconds to milliseconds.

- Full rebuild: ~300ms → ~30ms
- Incremental: near-instant

### 3. Automatic Content Detection

No more `content: ['./src/**/*.{js,jsx,ts,tsx}']` configuration. Tailwind v4 auto-detects your template files.

### 4. Dynamic Utilities

Generate arbitrary values without brackets in more places:

```html
<!-- v3: needed brackets -->
<div class="mt-[17px]">

<!-- v4: can use native CSS values in more places -->
<div class="mt-17">
```

### 5. New Color System

Default color palette updated. `gray` now maps to a neutral gray (not blue-tinted). Migration script available.

## Breaking Changes

- Config file format changed
- Some v3 plugins need updates
- Default color changes affect existing designs
- `@apply` behavior slightly different

## Migration

```bash
npx @tailwindcss/upgrade@next
```

The codemod handles most of it automatically. Manual fixes needed for custom plugins.

## Worth Upgrading?

**For new projects: Yes, start with v4.**
**For existing projects: Wait for your dependencies to update, then migrate.** The performance gains are real but not urgent enough to break a working app.

