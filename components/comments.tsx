"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, MessageCircle } from "lucide-react"

type Comment = {
  id: number
  name: string
  message: string
  createdAt: string
}

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch(`/api/comments/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : [])
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [slug])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      })

      if (!res.ok) throw new Error("Failed to post comment")

      const newComment = await res.json()
      setComments([newComment, ...comments])
      setName("")
      setMessage("")
      toast.success("Comment posted successfully!")
    } catch (error) {
      toast.error("Failed to post comment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-8 text-zinc-900 dark:text-zinc-100">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-xl font-bold">Comments ({comments.length})</h3>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 mb-10 bg-zinc-50 dark:bg-zinc-900/50 p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={50}
          className="bg-white dark:bg-zinc-900"
        />
        <Textarea
          placeholder="Join the discussion..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={500}
          className="bg-white dark:bg-zinc-900 min-h-[100px]"
        />
        <Button type="submit" disabled={loading} className="self-end mt-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Post Comment
        </Button>
      </form>

      <div className="flex flex-col gap-6">
        {fetching ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-zinc-500 text-center py-8 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-2 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{comment.name}</span>
                <time className="text-xs text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</time>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
