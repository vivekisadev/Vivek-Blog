"use client"

import { useState } from "react"
import { useLike } from "@/hooks/use-like"
import { useShare } from "@/hooks/use-share"
import { Heart, Share2, Copy, Check, Twitter, MessagesSquare } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LikeShareButtonsProps {
  id: string
  title: string
  excerpt: string
  initialLikes?: number
  date?: string
  readingTime?: number
}

export function LikeShareButtons({ id, title, excerpt, initialLikes, date, readingTime }: LikeShareButtonsProps) {
  const postUrl = typeof window !== "undefined" ? window.location.href : "";
  const { liked, likeCount, toggleLike } = useLike(id, initialLikes);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const cleanExcerpt = excerpt
    .replace(/[#*`~_]/g, '')
    .replace(/\n/g, ' ')
    .trim()
    .substring(0, 100) + (excerpt.length > 100 ? '...' : '');

  const ogImageUrl = `/api/og.png?title=${encodeURIComponent(title)}${date ? `&date=${encodeURIComponent(date)}` : ''}${readingTime ? `&readingTime=${readingTime}` : ''}&excerpt=${encodeURIComponent(cleanExcerpt)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, '_blank');
  };

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
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="group text-zinc-400 dark:text-zinc-500 transition-all duration-200 hover:scale-110 active:scale-95 hover:text-blue-500 dark:hover:text-blue-400 flex items-center"
            aria-label="Share post"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-zinc-100">Share this post</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-2">
            <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={ogImageUrl} 
                alt="Post preview card" 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={postUrl}
                className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              />
              <Button size="icon" onClick={copyToClipboard} variant="secondary" className="shrink-0 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={shareToTwitter} className="w-full border-zinc-200 dark:border-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" onClick={shareToWhatsApp} className="w-full border-zinc-200 dark:border-zinc-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400">
                <MessagesSquare className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}