import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const simulation = await prisma.simulation.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!simulation) {
      return new NextResponse('Simulation not found', { status: 404 })
    }

    return new NextResponse(simulation.content, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error fetching simulation:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
