---
title: "Vector Databases Explained: The Memory Layer of AI Applications"
date: 2026-03-06
tags: ['Vector DB', 'AI', 'RAG', 'Embeddings', 'Architecture']
---

# Vector Databases Explained: The Memory Layer of AI Applications

If you're building any AI-powered application in 2026, you'll likely need a vector database. Here's the complete picture.

## Why Regular Databases Don't Work for AI

You want to find documents similar to a user's question. A normal database can find exact matches:

```sql
SELECT * FROM documents WHERE text LIKE '%machine learning%';
```

But if the user asks "how does AI learn?", this query misses every document about machine learning that doesn't contain those exact words.

Vector databases store meaning, not text:

```python
# Convert text to a vector (list of numbers representing meaning)
embedding = embed("how does AI learn?")
# → [0.23, -0.14, 0.89, 0.02, ...] (1536 numbers)

# Search for semantically similar vectors
results = vector_db.similarity_search(embedding, top_k=5)
# Returns documents about machine learning, gradient descent, training, etc.
```

## How Embeddings Work

An embedding model converts text to a vector where:
- Similar meanings = similar vectors (close in vector space)
- Different meanings = different vectors (far in vector space)

```
"dog"   → [0.91, 0.23, -0.14, ...]
"puppy" → [0.89, 0.21, -0.12, ...]  // Similar to "dog"
"cat"   → [0.42, 0.87, 0.33, ...]   // Different direction
"car"   → [-0.23, 0.14, 0.91, ...]  // Very different
```

## RAG (Retrieval-Augmented Generation) Pattern

```python
# The most common AI app pattern in 2026:

async def answer_question(user_question: str):
    # 1. Embed the question
    question_vector = await embeddings.embed(user_question)
    
    # 2. Find relevant documents
    relevant_docs = await vector_db.similarity_search(
        vector=question_vector,
        top_k=5
    )
    
    # 3. Ask LLM with context
    response = await llm.complete(f'''
    Context: {relevant_docs}
    
    Question: {user_question}
    
    Answer based on the context above:
    ''')
    
    return response
```

This is how ChatGPT with custom knowledge bases works. How corporate wikis with AI search work. How code search works.

## Popular Vector Databases

| Database | Type | Best For |
|----------|------|---------|
| Pinecone | Managed cloud | Production, simplest setup |
| Weaviate | Open source / cloud | Self-hosting, full-featured |
| Chroma | Open source | Local development, prototyping |
| pgvector | PostgreSQL extension | Already on Postgres |
| Qdrant | Open source | High performance |

## Getting Started (5 Minutes)

```python
import chromadb
from openai import OpenAI

client = OpenAI()
chroma = chromadb.Client()
collection = chroma.create_collection("docs")

# Add documents
docs = ["AI learns through gradient descent", "Neural networks have layers"]
embeddings = [client.embeddings.create(input=d, model="text-embedding-3-small").data[0].embedding for d in docs]
collection.add(documents=docs, embeddings=embeddings, ids=["1", "2"])

# Search
query_embed = client.embeddings.create(input="how do machines learn?", model="text-embedding-3-small").data[0].embedding
results = collection.query(query_embeddings=[query_embed], n_results=1)
print(results['documents'])  # Returns the relevant document
```

If you're building anything AI-powered, learn this pattern. It's everywhere.

