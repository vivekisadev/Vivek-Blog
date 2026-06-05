"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gradient-to-r from-zinc-800 to-zinc-400 dark:from-zinc-200 dark:to-zinc-500 origin-left z-50"
      style={{ scaleX }}
    />
  )
}
