"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { PostMeta, NoteMeta } from "@/types/post"
import Link from "next/link"
import { MessageSquare } from "lucide-react"
import { formatDate } from "@/app/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { PaginationButtons } from "@/components/pagination-buttons"
import { Tag } from "@/components/tag"
import type { HomeContentProps } from "@/types/home"
import { articleStyles } from "@/styles/article"
import { CalendarHeatmapFloating } from "@/components/calendar-heatmap-floating"
import { useLike } from "@/hooks/use-like"
import { NewsletterSubscribe } from "@/components/newsletter-subscribe"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ViewCounter } from "@/components/view-counter"

const PAGE_SIZE = 10

function useTags(initialTags: Array<{ tag: string; count: number }>) {
  const [allTags] = useState(initialTags);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = useCallback((tag: string | null) => {
    setSelectedTag(tag);
  }, []);

  return {
    allTags,
    selectedTag,
    handleTagClick
  };
}

function usePosts(initialPosts: PostMeta[], allPosts: PostMeta[], selectedTag: string | null, initialCurrentPage: number, initialTotalPages: number) {
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [posts, setPosts] = useState(initialPosts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const filteredPosts = selectedTag
      ? allPosts.filter(post => post.tags.includes(selectedTag))
      : allPosts;

    const newTotalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
    setTotalPages(newTotalPages);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setPosts(filteredPosts.slice(startIndex, endIndex));
    setLoading(false);
  }, [currentPage, selectedTag, allPosts]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    currentPage,
    posts,
    totalPages,
    loading,
    error,
    handlePageChange
  };
}

export function HomeContent({ initialData }: HomeContentProps) {
  const { allTags, selectedTag, handleTagClick } = useTags(initialData.tags);
  const { currentPage, posts, totalPages, loading, error, handlePageChange } = usePosts(
    initialData.posts,
    initialData.allPosts,
    selectedTag,
    initialData.currentPage,
    initialData.totalPages
  );

  function LikeCountDisplay({ id, initialLikes }: { id: string, initialLikes?: number }) {
    const { likeCount } = useLike(id, initialLikes);
    return (
      <span className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.835 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        {likeCount}
      </span>
    );
  }

  const tagElements = useMemo(() => (
    <div className="w-full sm:w-[200px]">
      <Select
        value={selectedTag || "all"}
        onValueChange={(value) => handleTagClick(value === "all" ? null : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tags</SelectItem>
          {allTags.map(({ tag }) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ), [allTags, selectedTag, handleTagClick]);

  const postElements = useMemo(() => (
    <div className="space-y-4">
      {loading ? (
        <>
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <article key={index} className={articleStyles.baseClass}>
              <div className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </article>
          ))}
        </>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <article
            key={post.slug}
            className={articleStyles.baseClass}
          >
            <Link href={`/posts/${post.slug}`} className="group block">
              <h2 className="text-base font-normal text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
                {post.title}
              </h2>
              <div className="flex items-center text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                <time className="block mr-2">
                  {formatDate(post.date)}
                </time>
                <span className="mr-2">•</span>
                <span className="mr-2">{post.readingTime || 1} min read</span>
                <span className="mr-2">•</span>
                <ViewCounter slug={post.slug} initialViews={initialData.stats?.[post.slug]?.views || 0} />
                <span className="ml-2">
                  <LikeCountDisplay id={post.slug} initialLikes={initialData.stats?.[post.slug]?.likes || 0} />
                </span>
              </div>
            </Link>
          </article>
        ))
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          No article yet.
        </p>
      )}
    </div>
  ), [loading, error, posts]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
        <main className="lg:col-span-8 min-h-[200px]">
          <div className="mb-8">
            {allTags.length > 0 && tagElements}
          </div>

          <div className="mb-8">
            <CalendarHeatmapFloating posts={initialData.allPosts} notes={initialData.notes || []} />
          </div>

          <div className="min-h-[100px]">
            {postElements}
          </div>

          {!loading && !error && totalPages > 1 && (
            <div className="mt-4">
              <PaginationButtons 
                key={currentPage + '-' + totalPages}
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
                className="animate-in fade-in duration-300"
              />
            </div>
          )}
        </main>
        
        <aside className="lg:col-span-4 space-y-8">
          {/* Guestbook Promotional Banner */}
          <Link href="/guestbook" className="group flex flex-col p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/80 dark:to-zinc-800/80 border border-zinc-200/60 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.03)] overflow-hidden relative block">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10 mb-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 group-hover:shadow-indigo-500/10">
                <MessageSquare className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg flex items-center gap-2">
                Sign my Guestbook! ✨
              </h3>
            </div>
            
            <p className="text-sm text-zinc-500 dark:text-zinc-400 relative z-10 leading-relaxed mb-6">
              Drop a message, say hi, or share your thoughts with other visitors. I'd love to hear from you!
            </p>
            
            <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors relative z-10">
              Leave a message <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </Link>

          <NewsletterSubscribe />
        </aside>
      </div>

      <Footer />
    </div>
  )
}