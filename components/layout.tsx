"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { BackToTop } from "./back-to-top"

/**
 * Secret sequences:
 *   Type "vvcc" → navigates to /create
 *   Type "vvbb" → navigates to /books/edit
 * 
 * Characters must be typed within 2 seconds of each other.
 * Works from any page. No modifier keys needed.
 */

const SEQUENCES: Record<string, string> = {
  "vvcc": "/create",
  "vvbb": "/books/edit",
}

const MAX_GAP_MS = 2000
const MAX_SEQ_LEN = Math.max(...Object.keys(SEQUENCES).map(k => k.length))

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const bufferRef = useRef("")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      // Only track single lowercase letter keys
      if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return

      // Reset timer
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        bufferRef.current = ""
      }, MAX_GAP_MS)

      bufferRef.current += e.key.toLowerCase()

      // Keep buffer trimmed
      if (bufferRef.current.length > MAX_SEQ_LEN) {
        bufferRef.current = bufferRef.current.slice(-MAX_SEQ_LEN)
      }

      // Check for matches
      for (const [seq, path] of Object.entries(SEQUENCES)) {
        if (bufferRef.current.endsWith(seq)) {
          bufferRef.current = ""
          if (timerRef.current) clearTimeout(timerRef.current)
          router.push(path)
          return
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [router])

  return (
    <>
      {children}
      <BackToTop />
    </>
  )
} 