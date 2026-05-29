import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const messages = await prisma.guestbookMessage.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { name, message } = await req.json()

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 })
    }

    const newMessage = await prisma.guestbookMessage.create({
      data: {
        name: name.slice(0, 50),
        message: message.slice(0, 500),
      },
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
