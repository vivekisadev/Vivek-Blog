"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>("")

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

  if (headings.length === 0) return null

  return (
    <div className="hidden xl:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto w-64 text-sm self-start">
      <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">On this page</p>
      <div className="flex flex-col gap-3 border-l border-zinc-200 dark:border-zinc-800">
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
