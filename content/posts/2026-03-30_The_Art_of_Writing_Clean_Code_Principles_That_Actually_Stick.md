---
title: "The Art of Writing Clean Code: Principles That Actually Stick"
date: 2026-03-30
tags: ['Clean Code', 'Dev', 'Best Practices', 'Software', 'Refactoring']
---

# The Art of Writing Clean Code: Principles That Actually Stick

Everyone says "write clean code." Nobody agrees on what that means. Here's the practical version — principles that survive contact with real deadlines.

## Naming Is 80% of Readability
```typescript
// What does this do?
const d = new Date();
const x = u.filter(i => i.a && !i.d);

// Obvious at a glance
const today = new Date();
const activeUsers = users.filter(user => user.isActive && !user.isDeleted);
```

One rule: if you need a comment to explain a variable name, rename the variable.

## Functions Should Do One Thing
```typescript
// Does three things at once
async function processUser(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  await sendWelcomeEmail(user.email);
  await db.user.update({ where: { id: userId }, data: { emailSent: true } });
  return user;
}

// Each function has one responsibility
async function getUser(userId: string) {
  return db.user.findUnique({ where: { id: userId } });
}

async function markEmailSent(userId: string) {
  return db.user.update({ where: { id: userId }, data: { emailSent: true } });
}

async function onboardUser(userId: string) {
  const user = await getUser(userId);
  await sendWelcomeEmail(user.email);
  await markEmailSent(userId);
  return user;
}
```

## The Boy Scout Rule

Leave every file slightly better than you found it. Fix the variable name while you are there. Extract that inline magic number into a named constant. Small improvements compound.

## Avoid Magic Numbers
```typescript
// What is 86400?
if (diff > 86400) expireSession();

// Self-documenting
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
if (diff > ONE_DAY_IN_SECONDS) expireSession();
```

## Error Messages Are Documentation
```typescript
// Useless
throw new Error("Invalid input");

// Actionable
throw new Error(`Invalid email format: "${email}". Expected format: user@domain.com`);
```

## Comments Explain Why, Not What
```typescript
// Explains what (obvious from code)
// Loop through users
for (const user of users) { }

// Explains why (not obvious)
// Skip deleted users — soft deletes are preserved for audit compliance
for (const user of users.filter(u => !u.deletedAt)) { }
```

## The Real Metric

Clean code is code your teammate can understand, modify, and debug without asking you questions. Write for the next person. That person is often future you at 2am.

