import { Metadata } from 'next'
import { Suspense } from 'react'
import { HomeContent } from "@/components/home-content"
import { getAllPostsMeta, getTagsFromPosts, getAllNotesMeta } from "@/lib/cache"
import Loading from '@/app/loading'
import prisma from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Vivek's Blog",
  description: 'love, code, and write.',
  openGraph: {
    title: "Vivek's Blog",
    description: 'Love, code, and write.',
  },
}

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

const PAGE_SIZE = 10

export async function generateStaticParams() {
  const posts = await getAllPostsMeta()
  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }))
}

async function getInitialData() {
  try {
    const posts = await getAllPostsMeta()
    const notes = await getAllNotesMeta()
    
    const [viewCounts, likeCounts] = await Promise.all([
      prisma.viewCount.findMany(),
      prisma.likeCount.findMany()
    ])
    
    const stats: Record<string, { views: number; likes: number }> = {}
    posts.forEach(post => {
      stats[post.slug] = { views: 0, likes: 0 }
    })
    viewCounts.forEach((vc: any) => {
      if (stats[vc.slug]) stats[vc.slug].views = vc.count
      else stats[vc.slug] = { views: vc.count, likes: 0 }
    })
    likeCounts.forEach((lc: any) => {
      if (stats[lc.slug]) stats[lc.slug].likes = lc.count
      else stats[lc.slug] = { views: 0, likes: lc.count }
    })

    const tags = getTagsFromPosts(posts).map(t => ({ tag: t.tag, count: Number(t.count) }))
    const totalPages = Math.ceil(posts.length / PAGE_SIZE)
    const paginatedPosts = posts.slice(0, PAGE_SIZE)
    return { posts: paginatedPosts, allPosts: posts, notes, tags, currentPage: 1, totalPages, stats }
  } catch (error) {
    console.error('Error fetching initial data:', error)
    return { posts: [], allPosts: [], notes: [], tags: [], currentPage: 1, totalPages: 0, stats: {} }
  }
}

export default async function Home() {
  const initialData = await getInitialData()
  
  return (
    <Suspense fallback={<Loading />}>
      <HomeContent initialData={initialData} />
    </Suspense>
  )
}

