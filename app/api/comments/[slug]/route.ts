import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug
    
    const comments = await prisma.comment.findMany({
      where: { slug },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug
    const { name, message } = await request.json()
    
    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 })
    }
    
    const newComment = await prisma.comment.create({
      data: {
        slug,
        name,
        message,
      }
    })
    
    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 })
  }
}
