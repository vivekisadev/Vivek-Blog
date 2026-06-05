"use client"

import { useLike } from "@/hooks/use-like"
import { useShare } from "@/hooks/use-share"
import { Heart, Share2 } from "lucide-react"

interface LikeShareButtonsProps {
  id: string
  title: string
  excerpt: string
  initialLikes?: number
}

export function LikeShareButtons({ id, title, excerpt, initialLikes }: LikeShareButtonsProps) {
  const postUrl = typeof window !== "undefined" ? window.location.href : "";
  const { liked, likeCount, toggleLike } = useLike(id, initialLikes);
  const { share } = useShare({ url: postUrl, title, text: excerpt });

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleLike}
          className={`group transition-transform duration-200 hover:scale-110 active:scale-95 ${
            liked ? "text-red-500" : "text-zinc-400 hover:text-red-400 dark:text-zinc-500 dark:hover:text-red-400"
          }`}
          aria-label="Like post"
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-200 ${liked ? "fill-current" : ""}`} 
          />
        </button>
        <span className={liked ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"}>
          {likeCount}
        </span>
      </div>
      
      <button
        onClick={share}
        className="group text-zinc-400 dark:text-zinc-500 transition-all duration-200 hover:scale-110 active:scale-95 hover:text-blue-500 dark:hover:text-blue-400 flex items-center"
        aria-label="Share post"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  )
}