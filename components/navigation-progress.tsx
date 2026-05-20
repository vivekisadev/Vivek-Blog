"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

/**
 * A slim progress bar at the top of the viewport that shows during navigation.
 * Gives instant visual feedback so page transitions feel fast.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevPath = useRef(pathname)

  useEffect(() => {
    // When path changes, complete the bar
    if (prevPath.current !== pathname) {
      setProgress(100)
      setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 200)
    }
    prevPath.current = pathname
  }, [pathname, searchParams])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) return
      if (href === pathname) return

      // Start progress bar
      setProgress(15)
      setVisible(true)

      // Animate progress
      let p = 15
      timerRef.current = setInterval(() => {
        p += Math.random() * 12
        if (p > 90) p = 90
        setProgress(p)
      }, 150)
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [pathname])

  // Clear interval when progress hits 100
  useEffect(() => {
    if (progress >= 100 && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [progress])

  if (!visible && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none"
      style={{ opacity: visible || progress > 0 ? 1 : 0 }}
    >
      <div
        className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
