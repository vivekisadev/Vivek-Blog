import { cn } from "@/lib/utils"
import type { TagProps, TagsProps } from '@/types/tag'

export function Tag({ tag, onClick, className, interactive = false }: TagProps) {
  const baseClasses = cn(
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-normal",
    "bg-zinc-100 dark:bg-zinc-800",
    "text-zinc-600 dark:text-zinc-300",
    "hover:bg-zinc-200 dark:hover:bg-zinc-700",
    "transition-colors duration-200",
    "border border-zinc-200/50 dark:border-zinc-700/50",
    "hover:border-zinc-400/70 dark:hover:border-zinc-500/70",
    "hover:shadow-sm dark:hover:shadow-zinc-800/50",
    className
  )

  const selectedClasses = cn(
    "bg-zinc-200 dark:bg-zinc-700",
    "text-zinc-800 dark:text-zinc-200",
    "border border-zinc-400/70 dark:border-zinc-500/70",
    "shadow-sm dark:shadow-zinc-800/50",
    "hover:bg-zinc-300 dark:hover:bg-zinc-600",
    "hover:border-zinc-500/70 dark:hover:border-zinc-400/70"
  )

  if (interactive) {
    return (
      <button
        onClick={onClick}
        className={cn(baseClasses, className?.includes('bg-zinc-200') && selectedClasses)}
      >
        {tag}
      </button>
    )
  }

  return (
    <span className={baseClasses}>
      {tag}
    </span>
  )
}

export function Tags({ tags, className, onTagClick, interactive = false }: TagsProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Tag 
          key={tag} 
          tag={tag} 
          onClick={() => onTagClick?.(tag)}
          interactive={interactive}
        />
      ))}
    </div>
  )
}