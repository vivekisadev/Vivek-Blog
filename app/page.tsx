import { Metadata } from 'next'
import { Suspense } from 'react'
import { HomeContent } from "@/components/home-content"
import { getAllPostsMeta, getTagsFromPosts, getAllNotesMeta } from "@/lib/cache"
import Loading from '@/app/loading'

export const metadata: Metadata = {
  title: "Vivek's Blog",
  description: 'love, code, and write.',
  openGraph: {
    title: "Vivek's Blog",
    description: 'Love, code, and write.',
  },
}

export const dynamic = 'force-static'
export const revalidate = 3600

const PAGE_SIZE = 10

export async function generateStaticParams() {
  const posts = getAllPostsMeta()
  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }))
}

async function getInitialData() {
  try {
    const posts = getAllPostsMeta()
    const notes = getAllNotesMeta()
    const tags = getTagsFromPosts(posts).map(t => ({ tag: t.tag, count: Number(t.count) }))
    const totalPages = Math.ceil(posts.length / PAGE_SIZE)
    const paginatedPosts = posts.slice(0, PAGE_SIZE)
    return { posts: paginatedPosts, allPosts: posts, notes, tags, currentPage: 1, totalPages }
  } catch (error) {
    console.error('Error fetching initial data:', error)
    return { posts: [], allPosts: [], notes: [], tags: [], currentPage: 1, totalPages: 0 }
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

