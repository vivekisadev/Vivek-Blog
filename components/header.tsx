"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ScrollProgress } from "@/components/scroll-progress"

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const showBackButton = !isHome
  
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    // Check initial scroll position
    handleScroll()
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Placeholder to prevent layout shift when header becomes fixed/shrinks */}
      <div className="h-[88px] w-full shrink-0" aria-hidden="true" />
      <div className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-out border-b ${
        isScrolled 
          ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-zinc-200/50 dark:border-zinc-800/50 shadow-sm py-3" 
          : "bg-white/0 dark:bg-zinc-900/0 border-transparent py-6"
      }`}>
        <div className="max-w-5xl mx-auto px-4">
          <header className="flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap w-full">
            {showBackButton && (
              <Link 
                href="/" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100/80 dark:bg-zinc-700/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300/50 dark:hover:border-zinc-500/50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)] text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            
            <Link href="/" className="flex items-center gap-3 shrink-0 group mr-auto">
              <Image
                src="/viveklogo.jpg"
                alt="Vivek's avatar"
                width={40}
                height={40}
                className="rounded-full object-cover shrink-0 w-10 h-10 aspect-square"
                priority={true}
              />
              <h1 className="hidden sm:block text-xl font-medium tracking-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors whitespace-nowrap shrink-0">
                Vivek's Blog
              </h1>
            </Link>
            
            <HeaderNav />
          </header>
        </div>
        {pathname?.startsWith('/posts/') && <ScrollProgress />}
      </div>
    </>
  )
}