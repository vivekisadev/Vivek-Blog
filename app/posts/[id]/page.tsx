import { getPostById } from "@/app/lib/posts"
import { formatDate } from "@/app/lib/utils"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { Layout } from "@/components/layout"
import { Tags } from "@/components/tag"
import { MarkdownContent } from "@/components/markdown-content"
import { Metadata } from 'next'
import { LikeShareButtons } from "@/components/like-share-buttons"
import { Clock, Calendar, MessageCircle } from "lucide-react"
import TextReveal from '@/components/forgeui/text-reveal'
import { ViewCounter } from "@/components/view-counter"
import prisma from "@/lib/prisma"
import { AdminControls } from "@/components/admin-controls"
import { Comments } from "@/components/comments"


import { TableOfContents } from "@/components/table-of-contents"

export const dynamic = 'force-static'
export const revalidate = false 

export { generateMetadata } from "@/app/lib/posts"

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
    const readingTime = post.readingTime || 1
    
    const [viewCount, likeCount, commentCount] = await Promise.all([
      prisma.viewCount.findUnique({ where: { slug: id } }),
      prisma.likeCount.findUnique({ where: { slug: id } }),
      prisma.comment.count({ where: { slug: id } })
    ])
    
    const initialViews = viewCount?.count || 0
    const initialLikes = likeCount?.count || 0

    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 xl:px-8 flex gap-12 justify-center">
          <div className="flex-1 w-full max-w-3xl py-6 min-w-0">
            
          <article className="mt-8">
            <header className="mb-12 text-center">
              <div className="mb-6 flex justify-center flex-col items-center gap-4">
                <TextReveal
                  staggerDelay={0.05}
                  text={post.title}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-normal text-zinc-800 dark:text-zinc-200 leading-snug"
                />
                <AdminControls type="post" id={id} />
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
                <ViewCounter slug={id} increment={true} initialViews={initialViews} />
                <span>•</span>
                <div className="flex items-center gap-1.5" title={`${commentCount} comments`}>
                  <MessageCircle className="w-4 h-4" />
                  <span>{commentCount}</span>
                </div>
                <span>•</span>
                <LikeShareButtons 
                  id={post.id} 
                  title={post.title} 
                  excerpt={post.excerpt || ""} 
                  initialLikes={initialLikes} 
                  date={new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  readingTime={readingTime}
                />
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex justify-center mt-3">
                  <Tags tags={post.tags} interactive={false} />
                </div>
              )}
            </header>
            
            <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />
            
            <MarkdownContent content={post.contentHtml} />
            
            <Comments slug={post.id} />
          </article>
          
          <div className="mt-16">
            <Footer />
          </div>
          </div>
          <TableOfContents />
        </div>
      </Layout>
    )
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }
}

