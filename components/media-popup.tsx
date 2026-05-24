"use client"

import { useState, useEffect } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MediaPopupProps {
  type: "video" | "iframe" | "image"
  src: string
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MediaPopup({ type, src, title, open, onOpenChange }: MediaPopupProps) {
  const [iframeLoading, setIframeLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setIframeLoading(true)
    }
  }, [open, src])

  // Normalize YouTube URLs to embed format
  const getEmbedSrc = (url: string): string => {
    if (type !== "video") return url

    // youtube.com/watch?v=ID → youtube.com/embed/ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`
    }
    // Already an embed URL, add autoplay
    if (url.includes("/embed/")) {
      const separator = url.includes("?") ? "&" : "?"
      return url.includes("autoplay") ? url : `${url}${separator}autoplay=1`
    }
    return url
  }

  const maxWidthClass =
    type === "image" ? "max-w-5xl" : type === "iframe" ? "max-w-6xl" : "max-w-4xl"

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className={`fixed left-1/2 top-1/2 z-[101] w-[95vw] ${maxWidthClass} -translate-x-1/2 -translate-y-1/2 outline-none`}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 backdrop-blur-sm rounded-t-xl border border-zinc-700/50 border-b-0">
                  <DialogPrimitive.Title className="text-sm font-medium text-zinc-200 truncate pr-4">
                    {title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all duration-150">
                    <X className="w-4 h-4" />
                  </DialogPrimitive.Close>
                </div>

                {/* Content */}
                <div className="relative bg-zinc-950 rounded-b-xl border border-zinc-700/50 border-t-0 overflow-hidden">
                  {type === "video" && (
                    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                      {iframeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                        </div>
                      )}
                      <iframe
                        src={getEmbedSrc(src)}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        onLoad={() => setIframeLoading(false)}
                      />
                    </div>
                  )}

                  {type === "iframe" && (
                    <div className="relative w-full" style={{ height: "75vh" }}>
                      {iframeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                            <span className="text-xs text-zinc-500">Loading simulation...</span>
                          </div>
                        </div>
                      )}
                      <iframe
                        src={src}
                        className="w-full h-full"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        allow="accelerometer; gyroscope"
                        onLoad={() => setIframeLoading(false)}
                      />
                    </div>
                  )}

                  {type === "image" && (
                    <div className="flex items-center justify-center p-4 max-h-[80vh] overflow-auto">
                      <img
                        src={src}
                        alt={title}
                        className="max-w-full max-h-[75vh] object-contain rounded-lg"
                        onLoad={() => setIframeLoading(false)}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
