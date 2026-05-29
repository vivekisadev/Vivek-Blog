import { useEffect, useRef } from "react"
import { format } from "date-fns"
import mediumZoom from 'medium-zoom'
import Link from 'next/link'
import type { Note } from "@/types/note"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Github, Linkedin, Instagram, MapPin, Link as LinkIcon } from "lucide-react"
import { AdminEditButton } from "@/components/admin-edit-button"

function UserHoverCard({ children }: { children: React.ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80">
        <div className="flex justify-between space-x-4">
          <img
            src="/viveklogo.jpg"
            alt="Vivek's avatar"
            className="w-12 h-12 rounded-full object-cover border-[1px] border-zinc-100 dark:border-zinc-800"
          />
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Vivek</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Software Engineer building things for the web. Love, code, and write.
            </p>
            <div className="flex items-center pt-2 gap-3 text-zinc-500 dark:text-zinc-400">
              <a href="https://thisisvivek.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100" title="Portfolio">
                <LinkIcon className="w-4 h-4" />
              </a>
              <a href="https://github.com/vivekisadev" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/vivekverma16/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/iamvivek1602/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <div className="flex items-center gap-1 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
              <MapPin className="w-3 h-3" />
              <span>Earth</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export function NoteCard({ note, isLast }: { note: Note; isLast?: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    const zoom = mediumZoom(contentRef.current.querySelectorAll('img:not(.media-popup-trigger img)'), {
      margin: 24,
      background: 'rgba(9, 9, 11, 0.9)',
    })
    
    // Media popup trigger cards for notes
    const mediaPopups = contentRef.current.querySelectorAll('.media-popup')
    mediaPopups.forEach((el) => {
      const element = el as HTMLElement
      const type = (element.dataset.type || 'iframe') as "video" | "iframe" | "image"
      const src = element.dataset.src || ''
      const title = element.dataset.title || element.textContent || 'Media'

      // Don't re-process already hydrated elements
      if (element.dataset.hydrated === 'true') return
      element.dataset.hydrated = 'true'

      // Build the trigger card
      element.className = 'media-popup-trigger'
      element.setAttribute('role', 'button')
      element.setAttribute('tabindex', '0')
      element.style.cursor = 'pointer'

      // Icon based on type
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

    return () => { zoom.detach() }
  }, [note.content])

  return (
    <div className="group relative pb-6">
      {!isLast && (
        <div className="absolute left-5 top-0 w-px bottom-[-12px] bg-zinc-200 dark:bg-zinc-700" />
      )}
      

      <div className="relative flex items-stretch gap-3">
        <UserHoverCard>
          <Link href="/about" className="relative cursor-pointer shrink-0">
            <img
              src="/viveklogo.jpg"
              alt="Vivek's avatar"
              className="w-10 h-10 rounded-full object-cover border-[1px] border-zinc-100 dark:border-zinc-800 shadow-sm hover:ring-2 hover:ring-zinc-200 dark:hover:ring-zinc-700 transition-all"
            />
          </Link>
        </UserHoverCard>
        

        <div className="flex-1 -mt-1">
          <div className="flex items-baseline gap-2">
            <UserHoverCard>
              <Link href="/about" className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:underline decoration-zinc-400 underline-offset-2">
                Vivek
              </Link>
            </UserHoverCard>
            <time className="text-xs text-zinc-400 dark:text-zinc-500 font-mono tabular-nums">
              {format(new Date(note.date), "yyyy/MM/dd")}
            </time>
            <AdminEditButton type="note" id={note.id} />
          </div>
          
          <div 
            ref={contentRef}
            className="mt-1 text-sm sm:text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 prose prose-sm prose-zinc dark:prose-invert max-w-none [&>p]:m-0 [&>p]:mb-2 [&>p]:text-sm sm:[&>p]:text-[15px] [&>img]:rounded-xl [&>img]:my-2 [&>img]:max-w-full [&>img]:h-auto [&>img]:cursor-zoom-in"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      </div>
    </div>
  )
}