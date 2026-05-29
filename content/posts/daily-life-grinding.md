---
title: "Something out of my daily life grinding"
date: "2026-05-29"
excerpt: "I was going through one of my project and I found out like it stores each view count and like count on to the database, so whenever user clicks to see the post or clicks to like the post it sends an API request..."
tags: ["database", "redis", "react"]
---

I was going through one of my project and I found out like it stores each view count and like count on to the database, so whenever user clicks to see the post or clicks to like the post it sends an API request to the database to increment the view or like count and the same way whenever the page reloads it fetches the like count and view count, in short these many get and post requests can be overwhelming for the database resulting in slow loading of the important data like the content of the post and overall performance of the website is affected due to this and so I learned about two simple ways to reduce the number of requests to my database,

1- **Frontend debouncing** to store only the authorised or relevant like count, suppose a user clicks on the like button 20 times so it will not post the like increment request 20 times it will check if the user has already liked and if the user has liked the post then it will not send the request and it will send the request if the user has not yet liked the post.

Here is how the logic works in plain JavaScript/React.

```jsx
import { useState, useRef } from 'react';

export function LikeButton({ blogId }) {
  const [likes, setLikes] = useState(0);
  const pendingLikesRef = useRef(0);
  const debounceTimerRef = useRef(null);

  const handleLike = () => {
    // 1. UI updates instantly so it feels snappy to the user
    setLikes((prev) => prev + 1);
    
    // 2. Keep track of how many likes need to be sent to the backend
    pendingLikesRef.current += 1;

    // 3. Clear the previous timer if they click again before time runs out
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 4. Set a new timer to fire 1 second after the last click
    debounceTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/blog/${blogId}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ incrementBy: pendingLikesRef.current }),
        });
        
        // Reset the counter once the request is successfully sent
        pendingLikesRef.current = 0;
      } catch (error) {
        console.error("Failed to sync likes to database:", error);
      }
    }, 1000); // 1000ms delay
  };

  return <button onClick={handleLike}>❤️ {likes}</button>;
}
```

2- **Redis in-memory caching** so here what what I did as like I created cache in memory cache and what it will do is it will check the redis for the like or view count before sending the request to the database, if the redis contains the count it will not send the request and if doesn't have the count it will redirect the request to the database and stores it for future use.

Here is how the pseudo would look like if you're going to implement it in your server.

```javascript
import { createClient } from 'redis';
const redisClient = createClient(); // Connect to your Redis instance

app.get('/api/blog/:id', async (req, res) => {
  const blogId = req.params.id;
  const cacheKey = `blog:${blogId}:data`;

  try {
    // Step 1: Check if data exists in Redis cache
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      // Cache Hit! Serve instantly from RAM, don't touch the DB.
      return res.json(JSON.parse(cachedData));
    }

    // Step 2: Cache Miss! Fetch from your primary database
    const dbBlogData = await myPrimaryDatabase.find({ id: blogId });

    if (!dbBlogData) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Step 3: Save it to Redis so next time is a Cache Hit
    // EX: 3600 sets an expiration time of 1 hour so the cache doesn't get stale forever
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(dbBlogData));

    // Step 4: Return the database data to the user
    return res.json(dbBlogData);

  } catch (error) {
    // Fallback: If Redis fails, go to DB so the site doesn't crash
    const dbBlogData = await myPrimaryDatabase.find({ id: blogId });
    return res.json(dbBlogData);
  }
});
```

**Thanks for reading !!**
