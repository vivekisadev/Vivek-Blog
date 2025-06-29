---
title: "⚛️ React Bits: Tiny Pieces That Make You a Better React Developer"
date: "2025-06-29"
tags: ["React","Tech","JS"]
---

Hey friends! 👋

If you're diving into React or already building cool stuff with it, this blog is for you. I'm putting together a series I call React Bits — small, digestible pieces of React knowledge that helped me write cleaner, smarter, and more maintainable React code.

In this post, I'll walk you through:

1. Setting up a React app the modern way

2. Best folder structures

3. Core concepts (like useState, useEffect, and props)

4. Smart practices I wish I knew earlier

Let’s go bit by bit. 😉

🛠️ Setting Up React – Quick and Clean
There are multiple ways to get started with React, but my go-to (and the one I recommend) is Vite. It’s blazing fast and much simpler than older setups like Create React App (CRA).

✅ Option 1: React with Vite (Recommended)
```bash

npm create vite@latest react-bits -- --template react
cd react-bits
npm install
npm run dev

```
Your app is live on localhost:5173.

🌀 Option 2: React with CRA (If you're already familiar)
```bash

npx create-react-app react-bits
cd react-bits
npm start

```
🧱 Folder Structure That Actually Makes Sense
Here’s a simple folder layout I use to keep things clean:

```
react-bits/
├── src/
│   ├── components/       # Reusable UI bits
│   ├── pages/            # Route-based views
│   ├── hooks/            # Custom React hooks
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```
As your project grows, this keeps your code organized without going full "enterprise mode."

🔤 JSX – Looks Like HTML, Feels Like JS
JSX lets us write HTML in our JavaScript. It's what makes React super intuitive.

```jsx

const Welcome = () => {
  return <h1>Hello, React Bits!</h1>;
};
```
💡 Tip: JSX always needs one parent element. Use <> </> fragments if needed.

⚙️ Core React Concepts You’ll Use Daily
🔁 useState: For Keeping Track of Values
```jsx

const [count, setCount] = useState(0);

```
🧠 useEffect: For Side Effects (like fetching data)
```jsx

useEffect(() => {
  console.log("Component mounted");
  return () => console.log("Component unmounted");
}, []);

```
📦 Props: Pass Data Between Components
```jsx

const Greet = ({ name }) => <h2>Hello, {name}!</h2>;

```
🧩 Composing Components
```jsx

function App() {
  return <Greet name="React Bits Reader" />;
}
```

💡 React Bits – Practices That Help a Lot
Here are some “bits” that really improved my React code over time:

1. Destructure Props Early
Cleaner and more readable:

```jsx

const Card = ({ title, description }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);
```
2. Avoid Inline Functions in JSX
Avoid this:

```jsx

<button onClick={() => handleClick(id)}>Click</button> // ❌
```

Use this:

```jsx

const handleClickId = (id) => () => handleClick(id);
<button onClick={handleClickId(id)}>Click</button> // ✅

```

3. Always Cleanup Effects
When using setInterval, setTimeout, or external subscriptions:

```jsx

useEffect(() => {
  const interval = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(interval); // 🔁 Cleanup
}, []);
```

4. Use Unique Keys in Lists
```jsx

items.map((item) => <ListItem key={item.id} data={item} />);
```

Using indexes as keys can cause UI bugs, especially when items change order.

5. Create Custom Hooks to Reuse Logic
```jsx

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}
```

🎯 Why These Bits Matter
These small improvements — like organizing files better, avoiding anonymous functions, or writing custom hooks — might seem minor, but over time they make your codebase more scalable, testable, and fun to work with.

That's what React Bits is all about.