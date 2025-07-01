import { NextResponse } from 'next/server'
import { getAllPosts } from '@/app/lib/posts'
import { getPaginatedNotesAction } from '@/app/actions/notes'

export async function GET() {
  try {
    const posts = await getAllPosts()
    
    const { total: notesTotal } = await getPaginatedNotesAction(1, 1)
    
    const tags = new Set<string>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach((tag: string) => tags.add(tag))
      }
    })

    return NextResponse.json({
      posts: posts.length,
      notes: notesTotal,
      tags: tags.size
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 
