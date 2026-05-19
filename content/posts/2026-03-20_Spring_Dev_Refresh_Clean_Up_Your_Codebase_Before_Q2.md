---
title: "Spring Dev Refresh: Clean Up Your Codebase Before Q2"
date: 2026-03-20
tags: ['Dev', 'Code Quality', 'Refactoring', 'Best Practices', 'Productivity']
---

# Spring Dev Refresh: Clean Up Your Codebase Before Q2

Spring is here. Time to clean up. Not just your desk — your codebase. Here's a practical guide to technical debt cleanup before Q2 heats up.

## The Technical Debt Inventory

First, understand what you're dealing with:

```bash
# Find files with no tests
find src -name "*.ts" -not -name "*.test.ts" -not -name "*.spec.ts"

# Find TODO comments (hidden debt)
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts"

# Find dead code (TypeScript)
npx ts-prune

# Dependency vulnerabilities
npm audit

# Outdated packages
npm outdated
```

## The Quick Wins (One Day Each)

### 1. Delete Dead Code

Every codebase accumulates unused functions, commented-out blocks, and orphaned files.

```bash
# Find unused exports (TypeScript)
npx ts-prune --ignore 'index.ts'

# Remove unused CSS classes
npx purgecss --css src/styles.css --content 'src/**/*.tsx'
```

### 2. Update Trivial Dependencies

```bash
# Update minor/patch versions safely
npx npm-check-updates -u --target patch
npm install
npm test  # Make sure nothing breaks
```

### 3. Standardize Error Handling

Find every `catch(e) {}` empty catch block and add at minimum a log:

```typescript
// Before (danger)
try {
  await processPayment();
} catch (e) {}  // Silent failure!

// After (safer)
try {
  await processPayment();
} catch (error) {
  logger.error('Payment processing failed', { error, userId });
  throw error; // Re-throw so callers know
}
```

### 4. Add Indexes to Slow Queries

Run your ORM's query analysis:

```typescript
// Prisma — find slow queries
// Add: logging: ['query'] to PrismaClient
// Look for queries over 100ms

// Add index in schema.prisma
model User {
  email String @unique
  @@index([createdAt, status])  // Compound index for common queries
}
```

### 5. Write the Missing Tests

Find the highest-risk untested paths (auth, payment, data mutations) and add tests:

```typescript
// Minimum viable test coverage: the happy path + the most likely failure
it('should reject invalid email on signup', async () => {
  const response = await request(app)
    .post('/auth/register')
    .send({ email: 'not-an-email', password: 'valid123' });
  
  expect(response.status).toBe(400);
  expect(response.body.error).toContain('email');
});
```

## The Bigger Picture

Technical debt compounds like interest. A day of cleanup now prevents a week of crisis later.

Schedule it. Protect the time. Ship it.

