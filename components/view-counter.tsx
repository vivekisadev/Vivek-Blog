"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // Fetch and increment on load
    const incrementView = async () => {
      try {
        const res = await fetch(`/api/views/${slug}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (res.ok) {
          const data = await res.json()
          setViews(data.count)
        }
      } catch (error) {
        console.error("Failed to fetch views", error)
      }
    }
    
    incrementView()
  }, [slug])

  if (views === null) {
    return null // or a loading skeleton
  }

  return (
    <div className="flex items-center gap-1.5" title={`${views} views`}>
      <Eye className="w-4 h-4" />
      <span>{views} {views === 1 ? 'view' : 'views'}</span>
    </div>
  )
}
