"use client"

import Link from "next/link"
import { Layout } from "@/components/layout"
import { motion, useAnimationControls } from "framer-motion"
import { useEffect, useState } from "react"

export default function NotFound() {
  const controls = useAnimationControls()
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    controls.start({
      opacity: [0, 1],
      scale: [0.9, 1],
      transition: { duration: 0.5 }
    })
  }, [controls])

  const glowVariants = {
    hover: {
      boxShadow: "0 0 20px rgba(161, 161, 170, 0.3)",
      scale: 1.02,
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }

  const numberVariants = {
    initial: { y: 0 },
    hover: { y: [0, -10, 0], transition: { duration: 2, repeat: Infinity } }
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-5"
            initial={{ backgroundPosition: "0% 0%" }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              background: "radial-gradient(circle at center, currentColor 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          className="text-center space-y-8 relative z-10"
        >
          <motion.div
            className="relative"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.div
              className="flex justify-center items-center gap-2"
              variants={numberVariants}
              animate={isHovered ? "hover" : "initial"}
            >
              <motion.span className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-zinc-300 to-zinc-100 dark:from-zinc-700 dark:to-zinc-800" style={{ textShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                4
              </motion.span>
              <motion.span className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-zinc-300 to-zinc-100 dark:from-zinc-700 dark:to-zinc-800" style={{ textShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                0
              </motion.span>
              <motion.span className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-zinc-300 to-zinc-100 dark:from-zinc-700 dark:to-zinc-800" style={{ textShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                4
              </motion.span>
            </motion.div>
            <motion.p 
              className="absolute inset-0 flex items-center justify-center text-xl font-medium text-zinc-800 dark:text-zinc-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Page Not Found
            </motion.p>
          </motion.div>
          
          <motion.p 
            className="text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            this page does not exist or has been moved. Please check the URL or return to the homepage.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.div
              variants={glowVariants}
              whileHover="hover"
              whileTap="tap"
              className="inline-block"
            >
              <Link 
                href="/"
                className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-200 text-white dark:text-zinc-800 transition-all duration-300"
              >
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
} 