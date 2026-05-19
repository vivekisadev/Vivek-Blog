"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { PostsByYear } from "@/types/post"
import Link from "next/link"
import { getPostsByYearAction} from "@/app/actions/posts"
import { delay } from "@/app/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { Tag } from "@/components/tag"
import { Header } from "@/components/header"
import type { ArchiveContentProps } from "@/types/archive"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function useTags(initialTags: Array<{ tag: string; count: number }>) {
  const [allTags, setAllTags] = useState(initialTags);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTagClick = useCallback(async (tag: string | null) => {
    setIsTransitioning(true);
    setSelectedTag(tag);
    await delay(300);
    setIsTransitioning(false);
  }, []);

  return {
    allTags,
    selectedTag,
    isTransitioning,
    handleTagClick
  };
}

function usePosts(initialPosts: PostsByYear, selectedTag: string | null) {
  const [postsByYear, setPostsByYear] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTag === null) {
      setPostsByYear(initialPosts);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const posts = await getPostsByYearAction(selectedTag);
        setPostsByYear(posts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('The loading article failed, please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTag, initialPosts]);

  return {
    postsByYear,
    loading,
    error
  };
}

export function ArchiveContent({ initialData }: ArchiveContentProps) {
  const { allTags, selectedTag, isTransitioning, handleTagClick } = useTags(initialData.tags);
  const { postsByYear, loading, error } = usePosts(initialData.postsByYear, selectedTag);

  const tagElements = useMemo(() => (
    <div className="mb-8 w-full sm:w-[200px]">
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
    <div className={`space-y-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
      {loading && Object.keys(postsByYear).length === 0 ? (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-6 w-20" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
      ) : Object.entries(postsByYear).length > 0 ? (
        Object.entries(postsByYear)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, posts]) => (
          <div key={year} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{year}</h2>
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-grow" />
            </div>
            <div className="space-y-1">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 -mx-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-300"
                >
                  <div className="flex items-start sm:items-center gap-4 mr-4 flex-1">
                    <time className="text-sm text-zinc-400 dark:text-zinc-500 flex-shrink-0 font-mono tabular-nums w-12 pt-1 sm:pt-0">
                      {format(new Date(post.date), "MM/dd")}
                    </time>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <span className="text-base font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {post.title}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 sm:mt-0 whitespace-nowrap">
                        {post.readingTime || 1} min read
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:block opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          No posts found for this tag.
        </p>
      )}
    </div>
  ), [loading, error, postsByYear, isTransitioning]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Header showBackButton={true} title="all" />

      <main>
        {}
        {allTags.length > 0 && tagElements}

        {}
        {postElements}
      </main>

      <Footer />
    </div>
  )
}