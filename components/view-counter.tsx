"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export function ViewCounter({ slug, increment = false }: { slug: string; increment?: boolean }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const res = await fetch(`/api/views/${slug}`, {
          method: increment ? "POST" : "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })
        if (res.ok) {
          const data = await res.json()
          setViews(data.count)
        }
      } catch (error) {
        console.error("Failed to fetch views", error)
      }
    }
    
    fetchViews()
  }, [slug, increment])

  if (views === null) {
    return <div className="flex items-center gap-1.5 opacity-0"><Eye className="w-4 h-4" /><span>0 views</span></div> // placeholder to prevent layout shift
  }

  return (
    <div className="flex items-center gap-1.5" title={`${views} views`}>
      <Eye className="w-4 h-4" />
      <span>{views} {views === 1 ? 'view' : 'views'}</span>
    </div>
  )
}
