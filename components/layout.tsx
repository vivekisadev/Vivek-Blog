"use client"

import { BackToTop } from "./back-to-top"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  )
} 