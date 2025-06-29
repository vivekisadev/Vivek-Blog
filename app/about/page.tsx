import { Metadata } from 'next'
import { AboutContent } from "@/components/about-content"
import { getAllPosts } from "@/app/lib/posts"
import { getPaginatedNotesAction } from "@/app/actions/notes"
import { getCachedData } from '@/lib/cache'


export const dynamic = 'force-static'
export const revalidate = false 
export const metadata: Metadata = {
  title: 'About',
  description: "Vivek's Personal Introduction and Contact Information",
  openGraph: {
    title: 'About | Vivek Blog',
    description: "Vivek's Personal Introduction and Contact Information",
  },
} 

async function getStats() {
  return getCachedData('about-stats', async () => {
    const posts = await getAllPosts()
    
    const { total: notesTotal } = await getPaginatedNotesAction(1, 1)
    
    const tags = new Set<string>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach((tag: string) => tags.add(tag))
      }
    })

    return {
      posts: posts.length,
      notes: notesTotal,
      tags: tags.size
    }
  }, 24 * 60 * 60 * 1000) 
}

export default async function AboutPage() {
  const stats = await getStats()
  return <AboutContent initialStats={stats} />
}

