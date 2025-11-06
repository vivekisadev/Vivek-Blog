import { useState, useEffect } from 'react'

interface UseShareOptions {
  url: string
  title?: string
  text?: string
}

interface ShareResult {
  isSupported: boolean
  share: () => Promise<void>
  copyToClipboard: () => Promise<void>
}

export function useShare({ url, title, text }: UseShareOptions): ShareResult {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported(!!navigator.share)
  }, [])

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          text: text || '',
          url: url,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      console.warn('Web Share API not supported. Falling back to copy to clipboard.')
      await copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      // Optionally, you can add a toast notification here for "Link copied!"
      console.log('Link copied to clipboard:', url)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  return {
    isSupported,
    share,
    copyToClipboard,
  }
}