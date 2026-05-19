---
title: "Edge Computing Explained: Why Your Code Is Moving Closer to Users"
date: 2026-02-19
tags: ['Edge', 'Cloudflare', 'CDN', 'Performance', 'Architecture']
---

# Edge Computing Explained: Why Your Code Is Moving Closer to Users

Edge computing is going from buzzword to architecture reality. Here's what it actually means and why you should care.

## The Problem Edge Solves

Traditional web app request flow:

```
User in Mumbai 
  → Request to server in Virginia (200ms)
  → Server processes request
  → Response back to Mumbai (200ms)
  → Total: 400ms+ latency
```

Edge computing puts compute closer:

```
User in Mumbai
  → Request to Mumbai edge node (~5ms)
  → Edge runs your code
  → Response (~5ms)
  → Total: 10-20ms latency
```

This isn't theoretical — it's 20x real-world improvement.

## What "Edge" Means in Practice

Edge != CDN (though CDNs were the first edge)

| Layer | What It Does | Example |
|-------|-------------|---------|
| CDN | Cache and serve static assets | Cloudflare, AWS CloudFront |
| Edge Functions | Run code at edge nodes | Cloudflare Workers, Vercel Edge |
| Edge DB | Data available at the edge | Cloudflare D1, PlanetScale |

## Cloudflare Workers: The Leading Platform

```javascript
// Runs in 300+ locations globally
// Cold start: ~0ms (always warm)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // A/B test at the edge — no origin needed
    if (Math.random() < 0.5) {
      return new Response('Variant A');
    }
    
    // Geo-routing at the edge
    const country = request.cf?.country;
    if (country === 'IN') {
      return Response.redirect('https://in.yourapp.com');
    }
    
    return fetch(request); // Pass through to origin
  }
};
```

## Real Edge Use Cases

- **Personalization** — Show different content based on user's country/device without origin hits
- **Auth middleware** — Verify JWTs at the edge before requests reach your server
- **A/B testing** — Split traffic without JS flicker
- **Rate limiting** — Block bad actors before they reach your origin
- **Response caching** — Cache personalized responses (edge state)
- **API aggregation** — Combine multiple backend calls at the edge

## The Limitations

- **Restricted runtime** — No Node.js APIs. Workers use Web APIs only.
- **Limited CPU time** — 50ms CPU time limit per request on free tier
- **No stateful connections** — WebSockets need workarounds (Durable Objects)
- **Cold edge data** — Edge KV stores have eventual consistency

## Is It Worth the Complexity?

For global apps with latency-sensitive operations: **Yes.**
For apps with 90%+ of users in one region: **Often not.**

Edge is a tool, not a default architecture. Apply it where latency actually matters.

