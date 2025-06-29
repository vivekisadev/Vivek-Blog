"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaginationButtonsProps } from '@/types/pagination'

export function PaginationButtons({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationButtonsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100/80 dark:bg-zinc-700/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300/50 dark:hover:border-zinc-500/50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)] text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-300 ease-out group disabled:bg-zinc-200 disabled:dark:bg-zinc-800 disabled:border-zinc-300 disabled:dark:border-zinc-700 disabled:text-zinc-400 disabled:dark:text-zinc-500 disabled:shadow-none disabled:hover:bg-zinc-200 disabled:dark:hover:bg-zinc-800 disabled:hover:text-zinc-400 disabled:dark:hover:text-zinc-500"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-3">
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          const shouldShow = 
            pageNumber === 1 || 
            pageNumber === totalPages || 
            Math.abs(pageNumber - currentPage) <= 1;
          
          if (!shouldShow) {
            if ((pageNumber === 2 && currentPage > 3) || 
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)) {
              return (
                <span 
                  key={`ellipsis-${pageNumber}`}
                  className="flex h-8 w-8 items-center justify-center text-xs text-zinc-400 dark:text-zinc-500"
                >
                  •••
                </span>
              );
            }
            return null;
          }
          
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                "w-10 h-10 p-0 rounded-full flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-700/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300/50 dark:hover:border-zinc-500/50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)] text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-300 ease-out text-xs font-medium",
                currentPage === pageNumber
                  ? "!bg-zinc-900 !text-white !hover:bg-zinc-800 dark:!bg-zinc-50 dark:!text-zinc-900 dark:!hover:bg-zinc-200 shadow-sm"
                  : ""
              )}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100/80 dark:bg-zinc-700/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-200/50 dark:border-zinc-600/50 hover:border-zinc-300/50 dark:hover:border-zinc-500/50 shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.2)] hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_0_rgb(0,0,0,0.2)] text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 transition-all duration-300 ease-out group disabled:bg-zinc-200 disabled:dark:bg-zinc-800 disabled:border-zinc-300 disabled:dark:border-zinc-700 disabled:text-zinc-400 disabled:dark:text-zinc-500 disabled:shadow-none disabled:hover:bg-zinc-200 disabled:dark:hover:bg-zinc-800 disabled:hover:text-zinc-400 disabled:dark:hover:text-zinc-500"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}