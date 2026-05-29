import { Skeleton } from "@/components/ui/skeleton"
import { Layout } from "@/components/layout"
import { ScrollProgress } from "@/components/scroll-progress"
import { Footer } from "@/components/footer"

export default function Loading() {
  return (
    <Layout>
      <ScrollProgress />
      <div className="max-w-7xl mx-auto px-4 xl:px-8 flex gap-12 justify-center">
        <div className="flex-1 w-full max-w-3xl py-6 min-w-0">
          
          <article className="mt-8">
          <header className="mb-12 flex flex-col items-center">
            {/* Title Skeleton */}
            <Skeleton className="h-10 sm:h-14 w-[80%] max-w-lg mb-6 rounded-md" />
            
            {/* Meta (Date and Reading Time) Skeleton */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Bullet */}
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            
            {/* Tags Skeleton */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex gap-2">
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-14 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16 rounded-md" /> {/* Like/Share button */}
            </div>
          </header>
          
          {/* Divider */}
          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />
          
          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-[95%] rounded-md" />
              <Skeleton className="h-5 w-[90%] rounded-md" />
              <Skeleton className="h-5 w-[80%] rounded-md" />
            </div>
            
            {/* Mock Image or Code Block */}
            <Skeleton className="h-48 sm:h-64 w-full rounded-xl my-8" />
            
            <div className="space-y-3">
              <Skeleton className="h-5 w-[85%] rounded-md" />
              <Skeleton className="h-5 w-[98%] rounded-md" />
              <Skeleton className="h-5 w-[92%] rounded-md" />
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-5 w-[90%] rounded-md" />
              <Skeleton className="h-5 w-[85%] rounded-md" />
              <Skeleton className="h-5 w-[75%] rounded-md" />
            </div>
          </div>
        </article>
        
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Footer />
        </div>
      </div>
      </div>
    </Layout>
  )
}
