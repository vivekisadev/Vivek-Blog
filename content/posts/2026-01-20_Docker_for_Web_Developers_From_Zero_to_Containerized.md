---
title: "Docker for Web Developers: From Zero to Containerized"
date: 2026-01-20
tags: ['Docker', 'DevOps', 'Containers', 'Web', 'Backend']
---

# Docker for Web Developers: From Zero to Containerized

Docker used to feel like infrastructure people stuff. Now it's table stakes for web developers. Here's the practical guide.

## Why Docker Matters for Dev

- **"It works on my machine" — eliminated**. Your container is the machine.
- **Consistent environments** across dev, staging, production
- **Easy onboarding** — one command and the app runs
- **Microservices** — each service in its own container

## The Core Concepts

```
Image     = Blueprint (read-only)
Container = Running instance of an image
Registry  = Where images are stored (Docker Hub, GHCR, ECR)
```

## Your First Dockerfile

```dockerfile
# Use official Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
```

## Docker Compose for Local Dev

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
    depends_on:
      - db
    volumes:
      - .:/app          # Hot reload in dev
      - /app/node_modules

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

```bash
# Start everything
docker-compose up

# Run in background
docker-compose up -d

# Stop everything
docker-compose down
```

## Essential Commands

```bash
docker build -t myapp .        # Build image
docker run -p 3000:3000 myapp  # Run container
docker ps                       # List running containers
docker logs <container-id>      # View logs
docker exec -it <id> sh         # Shell into container
docker system prune             # Clean up everything
```

## The .dockerignore File

```
node_modules
.git
.env
*.log
dist
.next
```

Don't copy `node_modules` into your image. Always.

## Final Thought

Learning Docker is a one-time investment that pays dividends forever. Spend a weekend on it and your dev workflow changes permanently.

