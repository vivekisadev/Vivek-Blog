---
title: "Advanced Framer Motion: Scroll Animations, Drag, and Layout Magic"
date: 2026-01-24
tags: ['Framer Motion', 'React', 'Animation', 'Frontend', 'CSS']
---

# Advanced Framer Motion: Scroll Animations, Drag, and Layout Magic

The basics of Framer Motion are approachable. The advanced features are where it gets magical. Let's go beyond `animate` and `transition`.

## Scroll-Based Animations with `useScroll`

```jsx
import { useScroll, useTransform, motion } from "framer-motion";

function ParallaxSection() {
  const { scrollY } = useScroll();
  
  // Map scroll 0-500px to opacity 1-0
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  // Map scroll 0-500px to y position 0 to -100px
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <motion.div style={{ opacity, y }} className="hero">
      I fade and float as you scroll!
    </motion.div>
  );
}
```

## Drag with Constraints

```jsx
function DraggableCard() {
  return (
    <motion.div
      drag
      dragConstraints={{
        top: -50, left: -50,
        right: 50, bottom: 50,
      }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
      className="card"
    >
      Drag me around!
    </motion.div>
  );
}
```

## Layout Animations — The Secret Weapon

```jsx
import { motion, AnimatePresence } from "framer-motion";

function FilteredList({ items }) {
  return (
    <ul>
      <AnimatePresence>
        {items.map(item => (
          <motion.li
            key={item.id}
            layout              // 🔥 Animate layout changes automatically
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {item.name}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
```

When items are filtered, the remaining items smoothly animate to their new positions. No calculations. Just `layout`.

## Staggered Children with Variants

```jsx
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,  // Each child delays by 0.1s
      delayChildren: 0.3,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function StaggeredList({ items }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map(i => (
        <motion.li key={i.id} variants={item}>{i.name}</motion.li>
      ))}
    </motion.ul>
  );
}
```

## Gestures + Spring Physics

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me with spring!
</motion.button>
```

Spring physics make interactions feel physical and satisfying. This should be your default transition.

Framer Motion rewards experimentation. The API surface is large but discoverable. Start animating.

