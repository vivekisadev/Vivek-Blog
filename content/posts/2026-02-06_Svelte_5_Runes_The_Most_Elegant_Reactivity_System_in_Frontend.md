---
title: "Svelte 5 Runes: The Most Elegant Reactivity System in Frontend"
date: 2026-02-06
tags: ['Svelte', 'Frontend', 'Runes', 'JavaScript', 'Framework']
---

# Svelte 5 Runes: The Most Elegant Reactivity System in Frontend

Svelte 5's rune system is a fundamental reimagining of how frontend reactivity works. It's the most interesting framework development of the past year.

## What Are Runes?

Runes are special signals that tell the Svelte compiler how to track and update reactive state. They're function-like syntax that compiles away.

```svelte
<script>
  // $state — reactive variable
  let count = $state(0);
  
  // $derived — computed from other state
  let doubled = $derived(count * 2);
  
  // $effect — side effects that re-run when deps change
  $effect(() => {
    console.log(`Count is now ${count}`);
  });
</script>

<button onclick={() => count++}>
  Count: {count} (doubled: {doubled})
</button>
```

Compare to React's equivalent:
```jsx
const [count, setCount] = useState(0);
const doubled = useMemo(() => count * 2, [count]);
useEffect(() => {
  console.log(`Count is now ${count}`);
}, [count]);
```

Svelte's version is more readable. No dependency arrays. No manual `setCount`.

## The Deep Reactivity Trick

```svelte
<script>
  let todos = $state([
    { text: 'Buy milk', done: false }
  ]);
  
  // This WORKS in Svelte 5 — deep reactivity
  todos[0].done = true; // UI updates automatically
</script>
```

In React, you'd need to create a new array. Svelte's $state uses proxies to track mutations deep in objects.

## Component Props with $props

```svelte
<script>
  // Replaces export let prop
  let { name, age = 25 } = $props();
</script>
```

## Why Svelte Matters

Svelte has zero virtual DOM overhead. The compiler generates surgical DOM update code instead of diff-and-patch. The result is smaller bundles and faster runtime performance.

For apps that need to run on lower-end devices or where bundle size matters, Svelte is compelling.

The rune system makes Svelte 5 genuinely enjoyable to write. Worth trying on your next side project.

