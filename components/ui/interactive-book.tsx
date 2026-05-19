"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { RefreshCcw, X, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

export interface BookPage {
  title?: string;
  content: React.ReactNode;
  backContent?: React.ReactNode;
  pageNumber: number;
}

export interface InteractiveBookProps {
  bookTitle?: string;
  bookAuthor?: string;
  pages: BookPage[];
  className?: string;
}

// Desktop dimensions (used as base, scaled for mobile)
const BOOK_W_DESKTOP = 380;
const BOOK_H_DESKTOP = 540;
const SHELF_W_DESKTOP = 190;
const SHELF_H_DESKTOP = 270;

function useBookDimensions() {
  const [dims, setDims] = useState({
    bookW: BOOK_W_DESKTOP,
    bookH: BOOK_H_DESKTOP,
    shelfW: SHELF_W_DESKTOP,
    shelfH: SHELF_H_DESKTOP,
    shelfScale: SHELF_W_DESKTOP / BOOK_W_DESKTOP,
    isMobile: false,
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) {
        // Mobile: smaller book
        const bookW = Math.min(300, w - 40);
        const bookH = Math.round(bookW * (540 / 380));
        const shelfW = Math.min(140, (w - 48) / 2);
        const shelfH = Math.round(shelfW * (270 / 190));
        setDims({
          bookW, bookH, shelfW, shelfH,
          shelfScale: shelfW / bookW,
          isMobile: true,
        });
      } else {
        setDims({
          bookW: BOOK_W_DESKTOP,
          bookH: BOOK_H_DESKTOP,
          shelfW: SHELF_W_DESKTOP,
          shelfH: SHELF_H_DESKTOP,
          shelfScale: SHELF_W_DESKTOP / BOOK_W_DESKTOP,
          isMobile: false,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return dims;
}

export default function InteractiveBook({
  bookTitle = "Book Title",
  bookAuthor = "Author Name",
  pages,
  className,
}: InteractiveBookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(-1);
  const [isHovering, setIsHovering] = useState(false);
  const [mobileToast, setMobileToast] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { bookW, bookH, shelfW, shelfH, shelfScale, isMobile } = useBookDimensions();

  const handleOpenBook = () => {
    if (isMobile) {
      setMobileToast(true);
      setTimeout(() => setMobileToast(false), 2500);
      return;
    }
    setIsOpen(true);
  };

  const handleCloseBook = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(false);
    setCurrentPageIndex(-1);
  };

  const nextPage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const prevPage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentPageIndex >= 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const restartBook = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPageIndex(-1);
  };

  // Keyboard navigation and scroll lock
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
      if (e.key === "Escape") handleCloseBook();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentPageIndex]);

  return (
    <>
      {/* Dark overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-md"
            onClick={handleCloseBook}
          />
        )}
      </AnimatePresence>

      {/* Close button */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            key="close-btn"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            onClick={handleCloseBook}
            className="fixed top-6 right-6 z-[1001] p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white transition-all hover:scale-110 shadow-2xl cursor-pointer"
          >
            <X size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/*
        Wrapper: takes up shelf-sized space in the grid.
        The book inside is rendered at full BOOK_W × BOOK_H and
        CSS-scaled down. When opened it goes fixed + scale(1).
      */}
      <div
        ref={wrapperRef}
        className={cn("relative", className)}
        style={{ width: shelfW, height: shelfH + 24 }}
      >
        <motion.div
          className="origin-top-left perspective-[1800px]"
          style={{ width: bookW, height: bookH }}
          initial={false}
          animate={
            isOpen
              ? {
                  position: "fixed" as any,
                  top: "50%",
                  left: "50%",
                  x: isMobile ? "-50%" : "-30%",
                  y: "-50%",
                  scale: 1,
                  zIndex: 999,
                }
              : {
                  position: "relative" as any,
                  top: "0%",
                  left: "0%",
                  x: "0%",
                  y: "0%",
                  scale: shelfScale,
                  zIndex: 10,
                }
          }
          transition={{
            duration: 0.7,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          {/* ============ FRONT COVER ============ */}
          <motion.div
            className="absolute inset-0 w-full h-full origin-left"
            initial={{ rotateY: 0, zIndex: 100 }}
            animate={{
              rotateY: isOpen ? -180 : isHovering ? -12 : 0,
              zIndex: isOpen ? 0 : 100,
            }}
            transition={{
              rotateY: { duration: 1.2, ease: [0.25, 0, 0, 1] },
              zIndex: { delay: isOpen ? 0.6 : 0.4 },
            }}
            style={{ transformStyle: "preserve-3d" }}
            onClick={!isOpen ? handleOpenBook : undefined}
            onHoverStart={() => !isOpen && setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 w-full h-full backface-hidden rounded-r-xl rounded-l-md shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] border border-zinc-700/60 cursor-pointer overflow-hidden group bg-zinc-900"
              style={{ transform: "translateZ(0.5px)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-950" />
              <div className="absolute inset-[14px] border border-zinc-600/20 rounded-r-lg rounded-l-sm" />
              <div className="absolute inset-[18px] border border-zinc-600/10 rounded-r-lg rounded-l-sm" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center z-10">
                <h1 className="text-xl font-serif text-zinc-100/90 tracking-[0.2em] mb-6 leading-snug uppercase font-light">
                  {bookTitle}
                </h1>
                <div className="w-10 h-[1px] bg-zinc-500/40 mb-5" />
                <p className="text-[9px] font-sans tracking-[0.3em] text-zinc-400/80 uppercase">
                  {bookAuthor}
                </p>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/50 via-white/[0.03] to-transparent" />
              <div className="absolute left-[10px] top-0 bottom-0 w-[1px] bg-black/30" />
            </div>

            {/* Back face (inner cover) */}
            <div
              className="absolute inset-0 w-full h-full backface-hidden rounded-l-xl rounded-r-md bg-[#faf8f4] flex flex-col p-8 border-l border-stone-300 shadow-inner cursor-pointer"
              style={{ transform: "rotateY(180deg) translateZ(0.5px)" }}
              onClick={(e) => {
                e.stopPropagation();
                prevPage();
              }}
            >
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <h2 className="text-xl font-serif text-stone-800 mb-3 tracking-wide">
                  {bookTitle}
                </h2>
                <div className="w-8 h-[1px] bg-stone-300 mb-3" />
                <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em]">
                  Interactive Edition
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============ PAGES STACK ============ */}
          <div
            className="absolute inset-0 w-full h-full z-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {pages.map((page, index) => {
              const isFlipped = index <= currentPageIndex;
              return (
                <motion.div
                  key={index}
                  className="absolute inset-0 w-full h-full origin-left bg-[#faf8f4] rounded-r-xl rounded-l-md shadow-sm border border-stone-200/60"
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{ rotateY: 0, zIndex: pages.length - index }}
                  animate={{
                    rotateY: isFlipped ? -180 : 0,
                    zIndex: isFlipped ? index + 1 : pages.length - index,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.645, 0.045, 0.355, 1],
                  }}
                >
                  {/* Right page (front face) */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-r-xl rounded-l-md px-7 py-5 flex flex-col bg-[#faf8f4] cursor-pointer hover:bg-[#f8f6f1] transition-colors"
                    style={{ transform: "translateZ(0.5px)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      nextPage();
                    }}
                  >
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[10px] text-stone-400 text-right mb-2 font-sans tracking-wider">
                        {page.pageNumber * 2 - 1}
                      </div>
                      <div className="font-serif select-none text-stone-800">
                        {page.title && (
                          <h3 className="text-[15px] font-bold text-center mb-3 text-stone-900 tracking-tight leading-tight">
                            {page.title}
                          </h3>
                        )}
                        <div className="text-[12.5px] leading-[1.7] text-stone-800 [&_strong]:text-stone-900 [&_li]:text-stone-800 [&_h4]:text-stone-900">
                          {page.content}
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/[0.04] to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#faf8f4] to-transparent pointer-events-none" />
                  </div>

                  {/* Left page (back face) */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-l-xl rounded-r-md bg-[#faf8f4] border-l border-stone-200 overflow-hidden px-7 py-5 flex flex-col cursor-pointer hover:bg-[#f8f6f1] transition-colors"
                    style={{ transform: "rotateY(180deg) translateZ(0.5px)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      prevPage();
                    }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/[0.04] to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#faf8f4] to-transparent pointer-events-none" />
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[10px] text-stone-400 text-left mb-2 font-sans tracking-wider">
                        {page.pageNumber * 2}
                      </div>
                      <div className="font-serif select-none text-stone-800 h-full">
                        {page.backContent ? (
                          <div className="text-[12.5px] leading-[1.7] text-stone-800 [&_strong]:text-stone-900 [&_li]:text-stone-800 [&_h4]:text-stone-900">
                            {page.backContent}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Back cover */}
            <div
              className="absolute inset-0 w-full h-full bg-[#faf8f4] rounded-r-xl rounded-l-md shadow-xl border border-stone-300"
              style={{ transform: "translateZ(-1px)", zIndex: -1 }}
            >
              <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center opacity-50">
                <p className="font-serif text-stone-500 italic text-sm">
                  The End
                </p>
                <button
                  onClick={restartBook}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-xs text-stone-600 cursor-pointer"
                >
                  <RefreshCcw size={12} /> Read Again
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shelf hint */}
        {!isOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -bottom-1 left-0 right-0 text-center text-[10px] text-zinc-500 dark:text-zinc-400 tracking-widest uppercase"
          >
            Click to read
          </motion.p>
        )}

        {/* Mobile toast */}
        <AnimatePresence>
          {mobileToast && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-medium shadow-lg z-50"
            >
              Available on desktop
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
