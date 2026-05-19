---
title: "Next.js 15 Features Every Developer Should Know"
date: 2026-01-09
tags: ['Next.js', 'React', 'Frontend', 'Vercel', 'Web']
---

# Next.js 15 Features Every Developer Should Know

Next.js keeps shipping. Version 15 brought some significant changes — and a few breaking ones. Here's the complete rundown.

## Major Changes

### 1. Async Request APIs (Breaking)

`cookies()`, `headers()`, and `params` are now async:

```tsx
// ❌ Old (sync)
import { cookies } from 'next/headers';
const cookieStore = cookies();

// ✅ New (async)
import { cookies } from 'next/headers';
const cookieStore = await cookies();
```

This change enables better server infrastructure optimization.

### 2. Turbopack for `next dev` (Stable)

Turbopack is now the default dev server. Speed improvements:

- Local server startup: **76.7% faster**
- Code updates (HMR): **96.3% faster**

Finally stable and battle-tested.

### 3. New Caching Defaults

Fetch requests are **NOT cached by default** anymore:

```ts
// Next.js 14 — cached by default
fetch('/api/data');

// Next.js 15 — no cache by default
fetch('/api/data'); // equivalent to { cache: 'no-store' }

// Opt in explicitly
fetch('/api/data', { cache: 'force-cache' });
```

This aligns Next.js with how most developers expect HTTP to work.

### 4. React 19 Support

Full React 19 compatibility including:
- `use()` hook for promise unwrapping
- Form Actions
- Optimistic updates with `useOptimistic`
- New `<form>` behavior

### 5. `after()` API

Run code after the response is sent — perfect for logging and analytics:

```ts
import { after } from 'next/server';

export async function GET() {
  after(async () => {
    // Runs after response, doesn't block the user
    await logRequest();
  });
  
  return Response.json({ data: 'hello' });
}
```

## Migration Tips

1. Run `npx @next/codemod@canary upgrade latest` for auto-migrations
2. Update all `cookies()`, `headers()`, `params` to async
3. Audit caching behavior — your app might get more data fetches
4. Test with Turbopack locally before deploying

Next.js 15 is a solid release. The caching changes especially make the mental model cleaner. Worth upgrading.

