---
title: "Kubernetes for Web Developers: What You Actually Need to Know"
date: 2026-02-03
tags: ['Kubernetes', 'DevOps', 'Containers', 'Backend', 'Cloud']
---

# Kubernetes for Web Developers: What You Actually Need to Know

Kubernetes (k8s) feels like a DevOps thing that web developers don't need to understand. That's changing in 2026. Here's what actually matters.

## Why Web Developers Should Care

If you're on a team that deploys to k8s (and many do), you'll need to:
- Understand why your app crashed
- Configure health checks for your service
- Set resource limits so you don't take down other services
- Debug connection issues between services

## The Core Concepts (Simplified)

```
Cluster = A set of machines (nodes) running your apps
Pod     = One or more containers that run together
Deployment = Manages pods (restarts them, scales them)
Service = Network endpoint to reach your pods
```

## The Minimal Deployment You Need to Understand

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 3              # Run 3 copies
  selector:
    matchLabels:
      app: my-api
  template:
    metadata:
      labels:
        app: my-api
    spec:
      containers:
      - name: my-api
        image: myrepo/my-api:v1.2.3
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"  # Minimum needed
            cpu: "100m"
          limits:
            memory: "256Mi"  # Maximum allowed
            cpu: "500m"
        readinessProbe:      # k8s checks this before sending traffic
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
```

## The Health Check Endpoint You Must Have

```javascript
// Every service should have this
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});
```

Without this, k8s can't tell if your app is actually ready to receive traffic.

## Debug Commands That Save Lives

```bash
# See all pods
kubectl get pods

# See what's wrong with a pod
kubectl describe pod my-api-xyz123

# Read logs
kubectl logs my-api-xyz123 --tail=100 -f

# Shell into a running container
kubectl exec -it my-api-xyz123 -- sh
```

## The Honest Truth

You probably don't need to set up k8s yourself. Vercel, Railway, Render, and managed Kubernetes (GKE, EKS) handle the hard parts. But understanding the concepts makes you a much better collaborator with DevOps teams.

