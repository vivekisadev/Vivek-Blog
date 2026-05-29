"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const showBackButton = !isHome

  return (
    <header className="flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap px-2 py-2 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
      {showBackButton && (
        <Link 
          href="/" 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100/80 dark:bg-zinc-700/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300/50 dark:hover:border-zinc-500/50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)] text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-300 ease-out shrink-0"
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
          className="w-10 h-10 rounded-full object-cover shrink-0"
          priority={true}
        />
        <h1 
          className="text-xl font-medium tracking-tight group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors whitespace-nowrap shrink-0"
        >
          Vivek's Blog
        </h1>
      </Link>
      
      <HeaderNav />
    </header>
  )
}