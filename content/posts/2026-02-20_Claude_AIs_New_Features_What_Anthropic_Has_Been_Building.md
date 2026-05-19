---
title: "Claude AI's New Features: What Anthropic Has Been Building"
date: 2026-02-20
tags: ['Claude', 'Anthropic', 'AI', 'Features', 'LLM']
---

# Claude AI's New Features: What Anthropic Has Been Building

Anthropic has been quietly building features that change how Claude can be used in real workflows. Here's what's actually useful.

## Model Context Protocol (MCP)

The biggest infrastructure move Anthropic made in 2025. MCP is an open protocol that lets Claude connect to external tools and data sources.

```json
// MCP server example — Claude can now call your tools
{
  "name": "database-tool",
  "description": "Query the production database",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" }
    }
  }
}
```

What this enables:
- Claude reading your filesystem and editing files
- Claude querying your databases
- Claude using your existing APIs
- Claude integrating with GitHub, Slack, Notion, etc.

This is why Cursor's Claude integration is so powerful — it uses MCP for file access.

## Extended Thinking

Claude 3.7 Sonnet has extended thinking — it reasons through complex problems step by step before responding. For hard math, complex coding, and multi-step reasoning tasks, this is meaningfully better.

```python
# Via API
response = anthropic.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{"role": "user", "content": "Solve this complex problem..."}]
)
```

## Computer Use (Beta)

Claude can control a computer — moving the mouse, clicking, typing, reading screens. It's not perfect, but it works for reliable automation tasks.

## Projects

In Claude.ai, Projects lets you give Claude persistent context — your codebase, your writing style, your company docs — across conversations.

This eliminates the "re-explain everything" tax on each new conversation.

## What's Coming

Anthropic's research focus is on:
- More capable reasoning (extended thinking improvements)
- Better tool use reliability
- Longer context (> 200K tokens)
- Faster inference at lower cost

The gap between capability and reliability is narrowing faster than the gap between capabilities is widening. Good sign.

