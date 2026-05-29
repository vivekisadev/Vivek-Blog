"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createRoot, Root } from "react-dom/client"
import katex from 'katex'
// @ts-ignore: Allow importing CSS file without type declarations
import 'katex/dist/katex.min.css'
import mediumZoom from 'medium-zoom'
import type { MarkdownContentProps } from '@/types/markdown'
import { ScrollReveal } from '@/components/scroll-reveal'
import { MediaPopup } from '@/components/media-popup'

export function MarkdownContent({ content }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Removed flawed client-side math regex that breaks HTML.
  // Math parsing should be done via remark-math on the server.
  const processContent = (content: string): string => {
    return content
  }

  useEffect(() => {
    // Code block copy buttons
    const codeBlocks = document.querySelectorAll('pre')
    
    codeBlocks.forEach((pre) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'relative mb-6 group'
      
      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'absolute right-3 top-3 flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200'
      
      const copyButton = document.createElement('button')
      copyButton.className = 'p-1.5 rounded-md bg-black hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-100'
      copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
      
      const successButton = document.createElement('button')
      successButton.className = 'p-1.5 rounded-md bg-black hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-100 hidden'
      successButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
      
      copyButton.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || ''
        try {
          await navigator.clipboard.writeText(code)
          
          copyButton.style.display = 'none'
          successButton.style.display = 'block'
          
          setTimeout(() => {
            copyButton.style.display = 'block'
            successButton.style.display = 'none'
          }, 2000)
        } catch (err) {
          console.error('Failed to copy code:', err)
        }
      })
      
      buttonContainer.appendChild(copyButton)
      buttonContainer.appendChild(successButton)
      
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)
      wrapper.appendChild(buttonContainer)
    })

    // 1. Zoom handles standard images
    if (!contentRef.current) return
    const zoom = mediumZoom(contentRef.current.querySelectorAll('img:not(.media-popup-trigger img)'), {
      margin: 24,
      background: 'rgba(9, 9, 11, 0.9)',
    })

    // 2. Hydrate media popups
    const mediaPopups = contentRef.current.querySelectorAll('.media-popup')
    mediaPopups.forEach((el) => {
      const element = el as HTMLElement
      const type = (element.dataset.type || 'iframe') as "video" | "iframe" | "image"
      const src = element.dataset.src || ''
      const title = element.dataset.title || element.textContent || 'Media'

      if (element.dataset.hydrated === 'true') return
      element.dataset.hydrated = 'true'

      element.className = 'media-popup-trigger'
      element.setAttribute('role', 'button')
      element.setAttribute('tabindex', '0')
      element.style.cursor = 'pointer'

      const iconSvg =
        type === 'video'
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="media-popup-icon media-popup-icon--video"><polygon points="6 3 20 12 6 21 6 3"/></svg>'
          : type === 'image'
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="media-popup-icon media-popup-icon--image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="media-popup-icon media-popup-icon--iframe"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>'

      const originalText = element.textContent || title
      element.innerHTML = `
        <span class="media-popup-trigger__icon">${iconSvg}</span>
        <span class="media-popup-trigger__content">
          <span class="media-popup-trigger__label">${originalText}</span>
          <span class="media-popup-trigger__hint">Click to open</span>
        </span>
        <span class="media-popup-trigger__arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
        </span>
      `

      const openPopup = () => {
        if ((window as any).__openMediaPopup) {
          (window as any).__openMediaPopup(type, src, title)
        }
      }

      element.addEventListener('click', openPopup)
      element.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
          e.preventDefault()
          openPopup()
        }
      })
    })

    // 3. Intercept standard anchor tags to open external links in media popup
    const links = contentRef.current.querySelectorAll('a:not(.media-popup-trigger)')
    links.forEach((a) => {
      const href = a.getAttribute('href')
      if (!href) return
      
      // Only intercept external links
      if (href.startsWith('http') && !href.includes(window.location.host)) {
        a.addEventListener('click', (e) => {
          e.preventDefault()
          
          let type: "video" | "iframe" | "image" = "iframe"
          if (href.includes('youtube.com') || href.includes('youtu.be')) type = "video"
          else if (href.match(/\.(jpeg|jpg|gif|png)$/i)) type = "image"
          
          if ((window as any).__openMediaPopup) {
            (window as any).__openMediaPopup(type, href, a.textContent || 'Link')
          }
        })
      }
    })

    return () => {
      zoom.detach()
      const wrappers = document.querySelectorAll('div.relative.mb-6.group')
      wrappers.forEach(wrapper => {
        const pre = wrapper.querySelector('pre')
        if (pre) {
          wrapper.parentNode?.insertBefore(pre, wrapper)
        }
        wrapper.remove()
      })
    }
  }, [content])

  return (
    <ScrollReveal yOffset={30} delay={0.2}>
      <div 
        className="prose prose-zinc dark:prose-invert prose-sm max-w-none dark:text-zinc-200 prose-img:rounded-xl prose-img:shadow-md prose-img:cursor-zoom-in prose-a:text-blue-500 hover:prose-a:text-blue-600 transition-colors"
        dangerouslySetInnerHTML={{ __html: processContent(content) }}
      />
    </ScrollReveal>
  )
}