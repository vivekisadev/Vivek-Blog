"use client"

import { useState, useEffect } from "react"
import { MediaPopup } from "./media-popup"

export function MediaPopupProvider() {
  const [popupState, setPopupState] = useState<{
    open: boolean
    type: "video" | "iframe" | "image"
    src: string
    title: string
  }>({
    open: false,
    type: "iframe",
    src: "",
    title: "",
  })

  useEffect(() => {
    // Register the global open function
    ;(window as any).__openMediaPopup = (
      type: "video" | "iframe" | "image",
      src: string,
      title: string
    ) => {
      setPopupState({ open: true, type, src, title })
    }

    return () => {
      delete (window as any).__openMediaPopup
    }
  }, [])

  return (
    <MediaPopup
      type={popupState.type}
      src={popupState.src}
      title={popupState.title}
      open={popupState.open}
      onOpenChange={(open) => setPopupState((prev) => ({ ...prev, open }))}
    />
  )
}
