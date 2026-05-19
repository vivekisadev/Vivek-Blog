---
title: "API Rate Limiting: How to Build It and Why You Need It Yesterday"
date: 2026-04-02
tags: ['API', 'Rate Limiting', 'Backend', 'Security', 'Node.js']
---

# API Rate Limiting: How to Build It and Why You Need It Yesterday

Every public API without rate limiting is an invitation to abuse. Here is how to implement it properly.

## Why Rate Limiting Matters

Without it, a single bad actor can:
- Scrape your entire database in minutes
- Brute-force user passwords
- Run up your infrastructure costs
- Take your API down for legitimate users

## The Simple Version with Express and Redis
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  }
});

app.use('/api/', limiter);
```

## Tiered Rate Limits
```typescript
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
});

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.post('/auth/login', authLimiter, handleLogin);
app.use('/api/', apiLimiter);
```

## User-Based Rate Limiting
```typescript
const userLimiter = rateLimit({
  keyGenerator: (req) => req.user?.id || req.ip,
  max: (req) => {
    if (req.user?.plan === 'premium') return 1000;
    if (req.user?.plan === 'free') return 100;
    return 30;
  },
  windowMs: 60 * 60 * 1000,
});
```

## The Headers You Must Send
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 73
X-RateLimit-Reset: 1711234567
Retry-After: 3600

Clients need this to back off gracefully. Do not make them guess.

Rate limiting is non-negotiable for any production API. Implement it before launch, not after your first abuse incident.

