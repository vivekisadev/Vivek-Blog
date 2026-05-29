"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Footer } from "@/components/footer"
import TextReveal from "@/components/forgeui/text-reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, MessageSquare } from "lucide-react"

type Message = {
  id: number
  name: string
  message: string
  createdAt: string
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch("/api/guestbook")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data)
        setFetching(false)
      })
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      })

      if (!res.ok) throw new Error("Failed to post message")

      const newMessage = await res.json()
      setMessages([newMessage, ...messages])
      setName("")
      setMessage("")
      toast.success("Message posted successfully!")
    } catch (error) {
      toast.error("Failed to post message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        
        <main className="mt-12 md:mt-24">
          <div className="mb-12">
            <TextReveal
              staggerDelay={0.05}
              text="Guestbook"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4"
            />
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Leave a message for future visitors. A thought, a quote, or just hello!
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-12 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              className="bg-white dark:bg-zinc-900"
            />
            <Textarea
              placeholder="Your Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={500}
              className="bg-white dark:bg-zinc-900 min-h-[100px]"
            />
            <Button type="submit" disabled={loading} className="self-end mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sign Guestbook
            </Button>
          </form>

          <div className="flex flex-col gap-6">
            {fetching ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-zinc-500 text-center">No messages yet. Be the first!</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex flex-col gap-2 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                  <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{msg.message}</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{msg.name}</span>
                    <span>•</span>
                    <time>{new Date(msg.createdAt).toLocaleDateString()}</time>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
        
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    </Layout>
  )
}
