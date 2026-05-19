import { useState, useEffect } from 'react';

export function useLike(postId: string) {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    // Initialize from local storage
    const storedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}');
    setLiked(!!storedLikes[postId]);

    const storedLikeCounts = JSON.parse(localStorage.getItem('postLikeCounts') || '{}');
    setLikeCount(storedLikeCounts[postId] || 0);
  }, [postId]);

  const toggleLike = () => {
    setLiked(prevLiked => {
      const newLiked = !prevLiked;
      const storedLikes = JSON.parse(localStorage.getItem('postLikes') || '{}');
      const storedLikeCounts = JSON.parse(localStorage.getItem('postLikeCounts') || '{}');

      if (newLiked) {
        storedLikes[postId] = true;
        storedLikeCounts[postId] = (storedLikeCounts[postId] || 0) + 1;
      } else {
        delete storedLikes[postId];
        storedLikeCounts[postId] = Math.max(0, (storedLikeCounts[postId] || 0) - 1);
      }

      localStorage.setItem('postLikes', JSON.stringify(storedLikes));
      localStorage.setItem('postLikeCounts', JSON.stringify(storedLikeCounts));
      setLikeCount(storedLikeCounts[postId]);
      return newLiked;
    });
  };

  return { liked, likeCount, toggleLike };
}