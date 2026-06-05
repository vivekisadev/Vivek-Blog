"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

export function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Small delay to ensure markdown is rendered
    setTimeout(() => {
      const elements = Array.from(document.querySelectorAll("article h2, article h3"))
        .filter((element) => element.id)
        .map((element) => ({
          id: element.id,
          text: element.textContent || "",
          level: Number(element.tagName.charAt(1)),
        }))
      
      setHeadings(elements)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { rootMargin: "0% 0% -80% 0%" }
      )

      elements.forEach((heading) => {
        const el = document.getElementById(heading.id)
        if (el) observer.observe(el)
      })
    }, 100)
  }, [])

  useEffect(() => {
    if (activeId && scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`a[href="#${activeId}"]`) as HTMLElement
      if (activeElement) {
        scrollContainerRef.current.scrollTo({
          top: Math.max(0, activeElement.offsetTop - 16),
          behavior: 'smooth'
        })
      }
    }
  }, [activeId])

  if (headings.length === 0) return null

  return (
    <div className="hidden xl:flex flex-col sticky top-28 w-64 text-sm self-start max-h-[calc(100vh-10rem)]">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 shrink-0">On this page</p>
      <div 
        ref={scrollContainerRef}
        className="flex flex-col gap-3 border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto no-scrollbar pb-8 relative"
      >
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "block -ml-px border-l-2 pl-4 py-1 hover:border-zinc-500 dark:hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors",
              heading.level === 3 && "ml-2",
              activeId === heading.id
                ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-medium"
                : "border-transparent text-zinc-500 dark:text-zinc-400"
            )}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </div>
  )
}
