"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  quality?: number
  sizes?: string
}

const globalImageLoadedMap = new Map<string, boolean>();

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) {
  const isAvatar = src === "/cat.jpg";
  const [isLoading, setIsLoading] = useState(isAvatar ? !globalImageLoadedMap.get(src) : true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isAvatar && globalImageLoadedMap.get(src)) {
      setIsLoading(false);
      setIsError(false);
    } else {
      setIsLoading(true);
      setIsError(false);
    }
  }, [src, isAvatar]);

  const handleLoad = () => {
    setIsLoading(false);
    if (isAvatar) globalImageLoadedMap.set(src, true);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div
          className={cn(
            isAvatar
              ? "absolute inset-0 flex items-center justify-center"
              : "absolute inset-0",
            "z-10"
          )}
        >
          {isAvatar ? (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900 animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-zinc-300/60 to-zinc-100/60 dark:from-zinc-700/60 dark:to-zinc-900/60 animate-shimmer" />
            </div>
          ) : (
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900 animate-pulse" />
          )}
        </div>
      )}

      {/* Error placeholder */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 z-10">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      )}

      {/* Main image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-all duration-700 ease-in-out",
          isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
          isError && "hidden"
        )}
        {...props}
      />
      {/* shimmer 动画样式 */}
      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .animate-shimmer {
          animation: shimmer 1.2s infinite;
        }
      `}</style>
    </div>
  )
} 