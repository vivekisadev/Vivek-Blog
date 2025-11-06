"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { PostMeta, NoteMeta } from "@/types/post"
import Link from "next/link"
import { formatDate } from "@/app/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { PaginationButtons } from "@/components/pagination-buttons"
import { Tag } from "@/components/tag"
import { Header } from "@/components/header"
import type { HomeContentProps } from "@/types/home"
import { articleStyles } from "@/styles/article"
import { CalendarHeatmapFloating } from "@/components/calendar-heatmap-floating"
import { useLike } from "@/hooks/use-like"

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

  function LikeCountDisplay({ id }: { id: string }) {
    const { likeCount } = useLike(id);
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
    <div className="flex flex-wrap gap-2">
      <Tag
        tag="all"
        onClick={() => handleTagClick(null)}
        interactive={true}
        className={selectedTag === null ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200' : ''}
      />
      {allTags.map(({ tag }) => (
        <Tag
          key={tag}
          tag={tag}
          onClick={() => handleTagClick(tag)}
          interactive={true}
          className={selectedTag === tag ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200' : ''}
        />
      ))}
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
                <LikeCountDisplay id={post.slug} />
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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Header isHome={true} />

      <main className="min-h-[200px]">
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
      <Footer />
    </div>
  )
}