---
title: "WebSockets vs Server-Sent Events vs Long Polling: Real-Time Architecture Guide"
date: 2026-02-25
tags: ['WebSockets', 'SSE', 'Real-time', 'Backend', 'Architecture']
---

# WebSockets vs Server-Sent Events vs Long Polling: Real-Time Architecture Guide

Real-time features — chat, notifications, live dashboards — require choosing the right transport. Here's the practical breakdown.

## Long Polling (The Legacy Approach)

Client repeatedly asks server "anything new?"

```javascript
// Client
async function longPoll() {
  while (true) {
    const res = await fetch('/api/events?lastId=' + lastId);
    const events = await res.json();
    processEvents(events);
  }
}

// Simple but wastes bandwidth. Every request has HTTP overhead.
// Works everywhere. Zero special setup.
```

**Use when:** You need simplicity and your events are infrequent.

## Server-Sent Events (SSE)

One-directional: server pushes events to client over a persistent HTTP connection.

```javascript
// Server (Node.js/Express)
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}

`);
  };
  
  const interval = setInterval(() => {
    sendEvent({ time: Date.now(), updates: getUpdates() });
  }, 1000);
  
  req.on('close', () => clearInterval(interval));
});

// Client
const eventSource = new EventSource('/stream');
eventSource.onmessage = (e) => {
  const data = JSON.parse(e.data);
  updateUI(data);
};
```

**Pros:** Simple, auto-reconnects, works through HTTP proxies and CDNs.
**Cons:** Server → client only. No client → server messages on the same connection.

**Use when:** You need server-push but clients don't need to send frequent data (dashboards, notifications, live feeds).

## WebSockets (Full Duplex)

Bidirectional, persistent connection. Real two-way communication.

```javascript
// Server (with ws library)
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Client
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (e) => updateChat(JSON.parse(e.data));
ws.send(JSON.stringify({ type: 'message', text: 'Hello!' }));
```

**Pros:** Full bidirectional communication, lowest latency, efficient for high-frequency messages.
**Cons:** Harder to scale (stateful connection), doesn't play well with some CDNs.

## Decision Matrix

```
Client → Server messages needed?    → WebSockets
High-frequency updates (<100ms)?    → WebSockets  
Push-only (notifications, feeds)?   → SSE
Need CDN/proxy compatibility?       → SSE
Simple, low-frequency events?       → Long polling or SSE
Chat, collaborative editing?        → WebSockets
```

## The Modern Default

For most applications: **SSE for push, fetch for sends.** It's simpler to implement, scales better with serverless, and covers 80% of real-time use cases.

Reserve WebSockets for genuinely bidirectional high-frequency use cases (games, collaborative tools, trading platforms).

