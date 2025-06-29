"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { PostsData } from "@/types/post"
import Link from "next/link"
import { getPaginatedPostsAction, getAllTagsAction } from "@/app/actions/posts"
import { formatDate } from "@/app/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { PaginationButtons } from "@/components/pagination-buttons"
import { Tag } from "@/components/tag"
import { Header } from "@/components/header"
import type { HomeContentProps } from "@/types/home"
import { articleStyles } from "@/styles/article"

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

function usePosts(initialPosts: PostsData, selectedTag: string | null) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsData, setPostsData] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
    if (selectedTag === null) {
      setPostsData(initialPosts);
    }
  }, [selectedTag, initialPosts]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (currentPage === 1 && selectedTag === null) {
        setPostsData(initialPosts);
        setLoading(false);
        return;
      }

      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const posts = await getPaginatedPostsAction(currentPage, 10, selectedTag);
        if (isMounted) {
          setPostsData(posts as PostsData);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
          setError('The loading article failed, please try again later');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentPage, selectedTag, initialPosts]);

  const handlePageChange = useCallback((page: number) => {
    if (page === 1 && selectedTag === null) {
      setPostsData(initialPosts);
      setCurrentPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTag, initialPosts]);

  return {
    currentPage,
    postsData,
    loading,
    error,
    handlePageChange
  };
}

export function HomeContent({ initialData }: HomeContentProps) {
  const { allTags, selectedTag, handleTagClick } = useTags(initialData.tags);
  const { currentPage, postsData, loading, error, handlePageChange } = usePosts(initialData.posts, selectedTag);

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
          {Array.from({ length: 10 }).map((_, index) => (
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
      ) : postsData.posts.length > 0 ? (
        postsData.posts.map((post) => (
          <article
            key={post.id}
            className={articleStyles.baseClass}
          >
            <Link href={`/posts/${post.id}`} className="group block">
              <h2 className="text-base font-normal text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-300">
                {post.title}
              </h2>
              <time className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 block">
                {formatDate(post.date)}
              </time>
            </Link>
          </article>
        ))
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          No article yet.
        </p>
      )}
    </div>
  ), [loading, error, postsData.posts]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Header isHome={true} />

      <main className="min-h-[200px]">
        <div className="mb-8">
          {allTags.length > 0 && tagElements}
        </div>

        <div className="min-h-[100px]">
          {postElements}
        </div>

        {!loading && !error && postsData.totalPages > 1 && (
          <div className="mt-4">
            <PaginationButtons 
              key={currentPage + '-' + postsData.totalPages}
              currentPage={currentPage} 
              totalPages={postsData.totalPages} 
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