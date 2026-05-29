"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Pencil } from "lucide-react"

export function AdminEditButton({ type, id }: { type: 'post' | 'note', id: string }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(sessionStorage.getItem("admin-authenticated") === "true")
    }
  }, [])

  if (!isAdmin) return null

  return (
    <Link 
      href={`/edit/${type}/${id}`} 
      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
    >
      <Pencil className="w-3.5 h-3.5" />
      Edit
    </Link>
  )
}
