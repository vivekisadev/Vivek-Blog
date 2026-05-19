'use client'

import { useEffect, useRef, useState } from 'react'
import type { InfiniteScrollProps } from '@/types/infinite-scroll'

export function InfiniteScroll({
  loadMore,
  hasMore,
  loading,
  threshold = 0.8,
  className,
  children,
}: React.PropsWithChildren<InfiniteScrollProps>) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const currentLoadingRef = loadingRef.current

    if (!currentLoadingRef) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setShouldLoad(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold,
      }
    )

    observerRef.current.observe(currentLoadingRef)

    return () => {
      if (observerRef.current && currentLoadingRef) {
        observerRef.current.unobserve(currentLoadingRef)
      }
    }
  }, [threshold])

  useEffect(() => {
    const handleLoadMore = async () => {
      if (shouldLoad && hasMore && !loading) {
        await loadMore()
        setShouldLoad(false)
      }
    }

    handleLoadMore()
  }, [shouldLoad, hasMore, loading, loadMore])

  return (
    <div className={className}>
      {children}
      <div ref={loadingRef} className="h-10 w-full flex items-center justify-center">
        {loading && hasMore && (
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 rounded-full border-2 border-zinc-300 border-t-zinc-800 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}