import { useState, useEffect } from 'react';

export function useLike(postId: string, initialLikeCount?: number) {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount ?? 0);

  useEffect(() => {
    // Check local storage for user's personal like status
    const storedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}');
    setLiked(!!storedLikes[postId]);

    if (initialLikeCount !== undefined) return;

    // Fetch the total global like count from the database
    const fetchLikeCount = async () => {
      try {
        const res = await fetch(`/api/likes/${postId}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setLikeCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch like count", error);
      }
    };
    fetchLikeCount();
  }, [postId]);

  const toggleLike = async () => {
    // Optimistic UI update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));

    // Update local storage for personal status
    const storedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}');
    if (newLiked) {
      storedLikes[postId] = true;
    } else {
      delete storedLikes[postId];
    }
    localStorage.setItem('postLikes', JSON.stringify(storedLikes));

    // Update global database
    try {
      await fetch(`/api/likes/${postId}`, {
        method: newLiked ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
    } catch (error) {
      console.error("Failed to update like count", error);
      // Revert optimistic update on error
      setLiked(!newLiked);
      setLikeCount(prev => !newLiked ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  return { liked, likeCount, toggleLike };
}