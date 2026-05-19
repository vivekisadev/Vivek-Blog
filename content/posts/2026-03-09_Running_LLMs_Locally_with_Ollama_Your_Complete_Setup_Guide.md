---
title: "Running LLMs Locally with Ollama: Your Complete Setup Guide"
date: 2026-03-09
tags: ['Ollama', 'LLM', 'Privacy', 'Local AI', 'Open Source']
---

# Running LLMs Locally with Ollama: Your Complete Setup Guide

Privacy-sensitive code, corporate firewalls, or just wanting control over your AI tools — local LLMs via Ollama are the answer. Here's the setup guide.

## What Is Ollama?

Ollama is a tool that makes running open-source LLMs locally as simple as `ollama run modelname`. It handles:
- Model downloading and storage
- Quantization (making large models fit on consumer hardware)
- A local API server (OpenAI-compatible)
- GPU acceleration (NVIDIA, AMD, Apple Silicon)

## Installation

```bash
# macOS / Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download installer from ollama.ai

# Verify
ollama --version
```

## Running Your First Model

```bash
# Pull and run Llama 3 (8B)
ollama run llama3

# Interactive chat
>>> What is the time complexity of quicksort?

# Pull without running
ollama pull mistral

# List downloaded models
ollama list

# Remove a model
ollama rm mistral
```

## Model Selection by Hardware

```
RAM Available → Recommended Model
8GB           → llama3:8b (quantized)
16GB          → llama3:13b, mistral:7b
32GB          → llama3:70b (quantized)
64GB+         → llama3:70b (full precision)
```

The quantized versions (4-bit, 8-bit) are significantly smaller with ~5-10% quality reduction. Worth the tradeoff for most use cases.

## Using the API

Ollama runs an OpenAI-compatible API at `localhost:11434`:

```python
import requests

response = requests.post('http://localhost:11434/api/chat', json={
    'model': 'llama3',
    'messages': [
        {'role': 'user', 'content': 'Review this code for security issues: ...'}
    ]
})

# Or with OpenAI SDK (drop-in replacement)
from openai import OpenAI
client = OpenAI(base_url='http://localhost:11434/v1', api_key='ollama')
response = client.chat.completions.create(
    model='llama3',
    messages=[{'role': 'user', 'content': 'Hello!'}]
)
```

## Best Models for Developers in 2026

```bash
# General coding
ollama pull deepseek-coder:6.7b

# Better coding (needs 16GB)  
ollama pull deepseek-coder:33b

# General assistant
ollama pull llama3:8b

# Fast responses
ollama pull phi3:mini

# Python specialist
ollama pull codellama:python
```

## Privacy Use Cases

- **Sensitive code review** — your company's code stays local
- **Private documents** — legal, medical, financial docs
- **Corporate networks** — no external API calls to explain
- **Air-gapped systems** — works completely offline

Local LLMs have crossed the "good enough" threshold for many tasks. The setup takes 10 minutes. The privacy benefit is permanent.

