---
title: "Groundhog Day Edition: The Bugs That Come Back Every Year"
date: 2026-02-02
tags: ['Memes', 'Bugs', 'Dev', 'Humor', 'Software']
---

# Groundhog Day Edition: The Bugs That Come Back Every Year

Happy Groundhog Day. In honor of infinite loops of repetition, here's a celebration of the bugs that haunt every developer every single year.

## The Eternal Bugs

### The Timezone Bug

It works perfectly. Until someone in a different timezone opens it. Then the date is wrong by exactly one day.

```javascript
// Every dev eventually writes:
new Date('2026-02-02') 
// Returns: Feb 1st for users west of UTC. Always.

// The fix every dev eventually learns:
new Date('2026-02-02T00:00:00.000Z') // UTC
// OR use a proper date library like date-fns or Temporal API
```

### The Off-By-One Error

```python
# You want to iterate 1 through 10
for i in range(10):
    print(i)  # Prints 0-9. Not 1-10. Classic.

for i in range(1, 11):
    print(i)  # Finally. Correct.
```

This bug has been committed by literally every programmer who has ever lived.

### The Missing await

```javascript
async function getData() {
  const data = fetch('/api/data'); // 🔥 forgot await
  console.log(data); // Promise { <pending> }
}
```

### The State Mutation Bug

```javascript
// React dev classic
const [items, setItems] = useState([1, 2, 3]);

// Don't:
items.push(4); // Mutates state directly — React won't re-render

// Do:
setItems([...items, 4]); // New array = React is happy
```

### The n+1 Query

```javascript
// "Efficient" code that queries the DB once per item:
const users = await User.findAll();
for (const user of users) {
  const posts = await Post.findAll({ where: { userId: user.id } }); // N queries!
}
// With 1000 users = 1001 database queries. Always include. Use eager loading.
```

### The Production-Only Bug

```
works-on-my-machine.jpg
```

This one is immune to debugging because it refuses to reproduce locally.

## The Lesson

These bugs exist because programming is hard and human brains reliably make the same mistakes. Document your past bugs. Leave comments explaining the weird fix. Future you will thank present you.

Or you'll fix it again next Groundhog Day. Both are valid outcomes.

