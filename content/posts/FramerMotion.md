---
title: "Framer Motion - A library allowing devs to create smooth animation."
date: "2025-07-04"
tags: ["Tech","JS","Blog","Animations","React"]
---

# Framer Motion - A godlike webstie containing animated elements with their source code and implementation

Framer Motion is a powerful animation library for React that allows developers to create smooth and interactive animations with a simple and declarative syntax.
It provides a high-level API that simplifies adding animations and gestures while keeping the code minimal and readable.
Framer Motion integrates seamlessly with React and offers features like gesture handling, layout animations, and drag animations, making it a preferred choice for building fluid UI interactions, dynamic animations, and responsive user experiences.
The library uses motion components, which are similar to standard JSX elements but come with special animation props such as animate, transition, hover, and tap gestures.


## Why Framer Motion?

Most developers have felt the pain of animating in CSS or using bulky libraries that complicate the animation process. Framer Motion flips the script by offering:

- ✨ **Simple API** – Declarative, readable, and React-friendly.
- ⚡ **Performance** – Hardware-accelerated animations with minimal effort.
- 🧠 **Intelligent Transitions** – Smart orchestration of enter/exit animations.
- 🎯 **Variants & Gestures** – Animate on hover, tap, drag, and more.
- 💥 **Layout Animations** – Animate changes in layout effortlessly.

## Getting Started

Install it with:

```bash
npm install framer-motion
```
or yarn it 
```bash
yarn add framer-motion
```

then import it
```jsx
import { motion } from "framer-motion";
```

Example: A Simple Fade In
Here's a basic component that fades in when it mounts:
```jsx
import { motion } from "framer-motion";

function FadeInBox() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="box"
    >
      Hello, I'm animated!
    </motion.div>
  );
}
```
Clean, concise, and readable. That's Framer Motion's strength.

**Variants – Animate Multiple States with Ease**
Variants help you define animation states in one place:
```jsx
const boxVariants = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0 }
};

function AnimatedBox() {
  return (
    <motion.div
      variants={boxVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6 }}
      className="box"
    >
      Sliding In!
    </motion.div>
  );
}
```

**Page Transitions Made Easy**
With AnimatePresence, you can animate components out of the DOM when they’re removed:
```jsx
import { AnimatePresence, motion } from "framer-motion";

function Modal({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="modal"
        >
          I’m a modal!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Advanced Features**

🕹️ Drag & Drop Support – motion.div can be made draggable with just one prop.

🎛️ Scroll-based animations – Animate elements on scroll using useScroll().

📏 Layout animations – Animate layout changes seamlessly using layout prop.

**Check out more of the animations on the website** - **https://motion.dev/**
