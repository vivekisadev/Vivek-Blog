---
title: "HTTPS Everywhere: Why HTTP Is Dead and What That Means for You"
date: 2026-03-08
tags: ['HTTPS', 'Security', 'SSL', 'TLS', 'Web']
---

# HTTPS Everywhere: Why HTTP Is Dead and What That Means for You

HTTP without TLS is effectively banned from the modern web. Here's the technical story and what you need to implement properly.

## Why HTTP Is No Longer Acceptable

On plain HTTP, anyone between the user and server can:
- Read all data in transit (passwords, session tokens, credit cards)
- Modify responses (inject ads, malware, content)
- Forge requests and responses

On public WiFi, at ISPs, in countries with surveillance infrastructure — this is not theoretical. It happens constantly.

## TLS in 2026

The current standard is **TLS 1.3** (deployed in 2018, now dominant):

```
TLS 1.0 / 1.1: Deprecated, blocked by modern browsers
TLS 1.2:       Still acceptable, should migrate away
TLS 1.3:       Current standard — faster, more secure
```

TLS 1.3 improvements:
- 1 round-trip handshake (vs 2 in TLS 1.2) — faster
- Removed legacy/weak cipher suites
- Forward secrecy by default
- 0-RTT session resumption (further optimization)

## Getting HTTPS Right

### For Simple Projects: Let's Encrypt

Free, automated, trusted CA (Certificate Authority):

```bash
# With Certbot
certbot --nginx -d yourdomain.com

# Auto-renewal
certbot renew --dry-run
# Add to cron: 0 0,12 * * * certbot renew
```

### Nginx Configuration for A+ Rating

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Modern TLS only
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    
    # HSTS — once set, browsers never do HTTP
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
}

# Redirect all HTTP to HTTPS
server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

### Security Headers (Often Missed)

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Test your configuration: **ssllabs.com** gives a detailed grade and recommendations.

## HSTS Preloading

After setting up HTTPS with HSTS headers, submit your domain to hstspreload.org. Browsers will never make an HTTP request to your domain — ever.

This is the final boss of HTTPS. Do it when your HTTPS setup is solid and you're committed.

