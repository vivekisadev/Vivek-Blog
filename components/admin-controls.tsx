"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { deleteContent } from "@/app/actions/content"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function AdminControls({ type, id }: { type: 'post' | 'note', id: string }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(sessionStorage.getItem("admin-authenticated") === "true")
    }
  }, [])

  if (!isAdmin) return null

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      setIsDeleting(true)
      try {
        const res = await deleteContent(id, type)
        if (res.success) {
          toast.success("Deleted successfully")
          if (type === 'post') {
            router.push('/')
            router.refresh()
          } else {
            router.push('/notes')
            router.refresh()
          }
        } else {
          toast.error(res.message || "Failed to delete")
        }
      } catch (err: any) {
        toast.error("An error occurred")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link 
        href={`/edit/${type}/${id}`} 
        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  )
}
