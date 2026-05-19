---
title: "tRPC: End-to-End Type Safety Without the GraphQL Complexity"
date: 2026-03-13
tags: ['tRPC', 'TypeScript', 'API', 'Full Stack', 'Type Safety']
---

# tRPC: End-to-End Type Safety Without the GraphQL Complexity

tRPC is the API approach that TypeScript full-stack developers have been waiting for. End-to-end type safety, no schema generation, no code generation. Just TypeScript.

## The Problem tRPC Solves

Traditional API approach:

```typescript
// Backend defines endpoint
app.get('/api/users/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  res.json(user);
});

// Frontend makes the call — NO TYPE SAFETY
const response = await fetch(`/api/users/${id}`);
const user = await response.json(); // Type: any 😱
```

If you rename a field in the backend, TypeScript can't tell you the frontend is broken. You find out in production.

## The tRPC Approach

```typescript
// server/router.ts
import { z } from 'zod';
import { router, publicProcedure } from './trpc';

export const appRouter = router({
  user: router({
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.user.findUnique({ where: { id: input.id } });
      }),
    
    create: publicProcedure
      .input(z.object({ name: z.string(), email: z.string().email() }))
      .mutation(async ({ input }) => {
        return await db.user.create({ data: input });
      }),
  }),
});

// Export type — this is the magic
export type AppRouter = typeof appRouter;
```

```typescript
// client/app.tsx
import { trpc } from '../utils/trpc';

function UserProfile({ id }: { id: string }) {
  // Fully typed. Auto-complete works. TypeScript catches mismatches.
  const { data: user } = trpc.user.getById.useQuery({ id });
  
  // user is typed as the exact return type of the backend function
  // If you rename a field in the DB schema, TypeScript errors here
  return <h1>{user?.name}</h1>;
}

async function createUser() {
  await trpc.user.create.mutate({
    name: "Vivek",
    email: "vivek@example.com",
    // TypeScript error if you add an unexpected field
    // TypeScript error if email is not a valid email format
  });
}
```

## Setting Up With Next.js

```bash
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod
```

```typescript
// utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/router';

export const trpc = createTRPCReact<AppRouter>();
```

## When to Use tRPC

✅ Full-stack TypeScript (Next.js, Remix, SvelteKit)
✅ Team owns both frontend and backend
✅ Internal tools and applications

❌ Public API consumed by third parties (use REST or GraphQL)
❌ Teams with separate frontend/backend in different repos
❌ Non-TypeScript projects

## The Real Win

The refactoring experience with tRPC is unlike anything else. Rename a field. TypeScript immediately shows you every place in the codebase that breaks. Fix them all. Ship with confidence.

This is what "end-to-end type safety" actually means in practice.

