import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug
    
    const viewCount = await prisma.viewCount.findUnique({
      where: { slug }
    })
    
    return NextResponse.json({ count: viewCount?.count || 0 })
  } catch (error) {
    console.error("Error fetching view count:", error)
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
    
    const newViewCount = await prisma.viewCount.upsert({
      where: { slug },
      update: { count: { increment: 1 } },
      create: { slug, count: 1 }
    })
    
    return NextResponse.json({ count: newViewCount.count })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}
