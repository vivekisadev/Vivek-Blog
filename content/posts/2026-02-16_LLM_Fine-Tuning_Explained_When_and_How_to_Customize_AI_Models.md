---
title: "LLM Fine-Tuning Explained: When and How to Customize AI Models"
date: 2026-02-16
tags: ['LLM', 'Fine-tuning', 'AI', 'ML', 'Dev']
---

# LLM Fine-Tuning Explained: When and How to Customize AI Models

Fine-tuning is often misunderstood. Many devs reach for it when prompting is sufficient. Here's the clear picture of when fine-tuning actually helps.

## Fine-Tuning vs Prompting: The Real Difference

```
Prompting: Give the model instructions at inference time
Fine-tuning: Train the model's weights on examples

Prompting is better for:
- Following complex instructions
- Incorporating new information
- One-off or varied tasks

Fine-tuning is better for:
- Consistent format/style output
- Domain-specific behavior at scale
- Reducing prompt length (thus cost)
- Behavior that's hard to describe in a prompt
```

## When Fine-Tuning Actually Makes Sense

### 1. Consistent Format
You need the model to always output JSON in a specific schema, or always follow a specific response structure.

### 2. Domain-Specific Language
Medical notes, legal documents, code in a proprietary language — domains where the base model's examples are scarce.

### 3. Cost Reduction at Scale
A fine-tuned smaller model can match a larger base model's performance on your specific task, at fraction of the cost.

### 4. Tone and Personality
If you need a consistent brand voice, fine-tuning is more reliable than prompting.

## How Fine-Tuning Works (Conceptually)

```
1. Collect training examples:
   {
     "messages": [
       {"role": "user", "content": "Categorize: The server crashed"},
       {"role": "assistant", "content": "category: infrastructure, severity: high"}
     ]
   }

2. Submit 50-1000+ examples to OpenAI/Anthropic fine-tuning API

3. Model weights are updated (LoRA or full fine-tune)

4. New model inherits base capabilities + learned behavior
```

## Practical Numbers

- OpenAI fine-tuning: ~$0.008 per 1K training tokens + inference costs
- Minimum useful dataset: ~50 examples (better with 200+)
- Training time: 20 minutes to 2 hours depending on dataset

## The Lazy (Good) Option

Before fine-tuning, try:
1. Better system prompts
2. Few-shot examples in context
3. RAG for domain knowledge

Fine-tuning is a last resort for when everything else doesn't achieve the quality you need. Most teams fine-tune too early.

