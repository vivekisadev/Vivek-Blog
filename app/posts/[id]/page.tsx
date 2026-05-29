import { getPostById } from "@/app/lib/posts"
import { formatDate } from "@/app/lib/utils"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { Layout } from "@/components/layout"
import { Tags } from "@/components/tag"
import { Header } from "@/components/header"
import { MarkdownContent } from "@/components/markdown-content"
import { Metadata } from 'next'
import { LikeShareButtons } from "@/components/like-share-buttons"
import { ScrollProgress } from "@/components/scroll-progress"
import { Clock, Calendar } from "lucide-react"
import TextReveal from '@/components/forgeui/text-reveal'
import { ViewCounter } from "@/components/view-counter"


export const dynamic = 'force-static'
export const revalidate = false 



export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams?.id
  
  if (!id) {
    notFound()
  }

  try {
    const post = await getPostById(id)

    if (!post) {
      notFound()
    }

    const postUrl = `https://blogsbyvivek.vercel.app/posts/${id}`
    const plainText = post.contentHtml.replace(/<[^>]*>?/gm, '')
    const wordCount = plainText.split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    return (
      <Layout>
        <ScrollProgress />
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Header showBackButton={true} />

          <article className="mt-12">
            <header className="mb-12 text-center">
              <div className="mb-6 flex justify-center">
                <TextReveal
                  staggerDelay={0.05}
                  text={post.title}
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight"
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time>{formatDate(post.date)}</time>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
                <span>•</span>
                <ViewCounter slug={id} increment={true} />
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-col items-center gap-6 mt-6">
                  <Tags tags={post.tags} interactive={false} />
                  <LikeShareButtons id={post.id} title={post.title} excerpt={post.excerpt || ""} />
                </div>
              )}
            </header>
            
            <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />
            
            <MarkdownContent content={post.contentHtml} />
          </article>
          
          <div className="mt-16">
            <Footer />
          </div>
        </div>
      </Layout>
    )
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }
}

