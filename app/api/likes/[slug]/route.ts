import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug
    
    const likeCount = await prisma.likeCount.findUnique({
      where: { slug }
    })
    
    return NextResponse.json({ count: likeCount?.count || 0 })
  } catch (error) {
    console.error("Error fetching like count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug
    
    const newLikeCount = await prisma.likeCount.upsert({
      where: { slug },
      update: { count: { increment: 1 } },
      create: { slug, count: 1 }
    })
    
    return NextResponse.json({ count: newLikeCount.count })
  } catch (error) {
    console.error("Error incrementing like count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug
    
    const currentLike = await prisma.likeCount.findUnique({ where: { slug } })
    if (!currentLike || currentLike.count <= 0) {
      return NextResponse.json({ count: 0 })
    }

    const newLikeCount = await prisma.likeCount.update({
      where: { slug },
      data: { count: { decrement: 1 } }
    })
    
    return NextResponse.json({ count: newLikeCount.count })
  } catch (error) {
    console.error("Error decrementing like count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}
