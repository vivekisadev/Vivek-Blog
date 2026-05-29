export default function Loading() {
  return (
    <div className="flex items-center justify-center py-32 bg-transparent">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-200 border-t-zinc-800 dark:border-zinc-700 dark:border-t-zinc-300"></div>
      </div>
    </div>
  )
} 