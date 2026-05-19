---
title: "React 19 Deep Dive: The Features Actually Worth Your Attention"
date: 2026-03-05
tags: ['React', 'React 19', 'Frontend', 'JavaScript', 'Dev']
---

# React 19 Deep Dive: The Features Actually Worth Your Attention

React 19 shipped and the ecosystem is catching up. Here's what actually changes your day-to-day development.

## The `use()` Hook

The biggest new primitive. `use()` can read promises and context:

```jsx
import { use, Suspense } from 'react';

function UserProfile({ userPromise }) {
  // Suspend until promise resolves
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}

// Usage — create promise outside render
const userPromise = fetch('/api/user').then(r => r.json());

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

Unlike `useEffect`, `use()` integrates with React's Suspense system properly.

## Server Actions (Stable)

Functions running on the server, called from the client:

```tsx
// actions.ts — runs on server
'use server';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });
  revalidatePath('/posts');
}

// Component — client or server
function CreatePost() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

No API route. No fetch. The function runs on server. Data revalidates. The simplicity is remarkable.

## `useOptimistic` — Instant UI Updates

```tsx
function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }]
  );

  async function handleAdd(formData) {
    const todo = { text: formData.get('text') };
    addOptimistic(todo);  // Show immediately
    await addTodo(todo);  // Actually save (might fail)
  }

  return (
    <form action={handleAdd}>
      {optimisticTodos.map(todo => (
        <li style={{ opacity: todo.pending ? 0.7 : 1 }}>{todo.text}</li>
      ))}
      <input name="text" /><button>Add</button>
    </form>
  );
}
```

The UI updates instantly. If the server action fails, it rolls back. Zero extra code.

## `useFormStatus`

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}
```

Knows when the parent form is submitting. No prop drilling.

## The Direction

React 19 is pushing toward less client-side state management and more server-centric patterns. Less useEffect, less useState for data fetching, less loading state management.

It's a meaningful shift in mental model. The learning curve is worth it.

