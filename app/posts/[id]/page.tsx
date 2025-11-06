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


export const dynamic = 'force-static'
export const revalidate = false 



export default async function Post({ params }: { params: { id: string } }) {
  if (!params || typeof params !== 'object' || !('id' in params)) {
    notFound()
  }
  
  const resolvedParams = await Promise.resolve(params)
  const id = resolvedParams.id
  
  if (!id) {
    notFound()
  }

  try {
    const post = await getPostById(id)

    if (!post) {
      notFound()
    }

    const postUrl = `https://www.jimmy-blog.top/posts/${id}`

    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Header showBackButton={true} />

          <article>
            <header className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <time className="block text-xs text-zinc-400 dark:text-zinc-500">{formatDate(post.date)}</time>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center space-x-4 mt-2">
                  <Tags tags={post.tags} interactive={false} />
                  <LikeShareButtons id={post.id} title={post.title} excerpt={post.excerpt || ""} />
                </div>
              )}
            </header>
            <MarkdownContent content={post.contentHtml} />
          </article>
          <Footer />
        </div>
      </Layout>
    )
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }
}

