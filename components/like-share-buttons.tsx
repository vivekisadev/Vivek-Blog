"use client"

import { useLike } from "@/hooks/use-like"
import { useShare } from "@/hooks/use-share"
import { Button } from "@/components/ui/button"

interface LikeShareButtonsProps {
  id: string
  title: string
  excerpt: string
}

export function LikeShareButtons({ id, title, excerpt }: LikeShareButtonsProps) {
  const postUrl = typeof window !== "undefined" ? window.location.href : "";
  const { liked, likeCount, toggleLike } = useLike(id);
  const { share } = useShare({ url: postUrl, title, text: excerpt });

  return (
    <div className="flex items-center space-x-6">
      <Button
        onClick={toggleLike}
        variant="ghost"
        size="icon"
        className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.835 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        <span>{likeCount}</span>
      </Button>
      <Button
        onClick={share}
        variant="ghost"
        size="icon"
        className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186A2.25 2.25 0 0 1 16.5 12a2.25 2.25 0 0 0 0 2.186m-9.283-2.186 9.283 2.186m0 0A2.25 2.25 0 1 1 16.5 10.5a2.25 2.25 0 0 1 0 2.186m0 0-9.283-2.186m0 0 9.283-2.186M12 12.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z"
          />
        </svg>
        <span>Share</span>
      </Button>
    </div>
  )
}