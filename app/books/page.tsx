"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import InteractiveBook, { type BookPage } from "@/components/ui/interactive-book";
import { getBooks, type BookData, type BookPageData } from "@/app/actions/books";
import { BookOpen } from "lucide-react";

/**
 * Auto-pagination: converts BookPageData[] into a flat stream of content sides,
 * then pairs them into physical pages (front + back) so there are never blank pages.
 */
const CHARS_PER_SIDE = 900;

interface ContentSide {
  text: string;
  chapterTitle?: string;
  isFirstOfChapter: boolean;
}

function splitTextIntoChunks(text: string, limit: number): string[] {
  if (!text?.trim()) return [];
  if (text.length <= limit) return [text];

  const chunks: string[] = [];
  const paragraphs = text.split("\n\n");
  let current = "";

  for (const para of paragraphs) {
    const candidate = current ? current + "\n\n" + para : para;
    if (candidate.length <= limit) {
      current = candidate;
    } else {
      if (current) chunks.push(current);
      if (para.length > limit) {
        const sentences = para.split(/(?<=\.\s)/);
        current = "";
        for (const sentence of sentences) {
          const next = current ? current + sentence : sentence;
          if (next.length <= limit) {
            current = next;
          } else {
            if (current) chunks.push(current);
            current = sentence;
          }
        }
      } else {
        current = para;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function shortLabel(title: string): string {
  return title.replace(/^(chapter\s+\d+[:\s]*)/i, "").trim() || title;
}

/**
 * Strategy: merge all text (front + back) within each chapter into one
 * continuous stream, split it into page-sized chunks, then pair
 * chunks into physical pages. No wasted space between subtopics.
 */
function paginateBookPages(rawPages: BookPageData[]): BookPage[] {
  // Step 1: Flatten into a stream of content sides
  const sides: ContentSide[] = [];

  for (const raw of rawPages) {
    // Merge front + back into one continuous chapter text
    const merged = [raw.content, raw.backContent]
      .filter((t) => t?.trim())
      .join("\n\n");

    const chunks = splitTextIntoChunks(merged, CHARS_PER_SIDE);

    for (let i = 0; i < chunks.length; i++) {
      sides.push({
        text: chunks[i],
        chapterTitle: raw.title,
        isFirstOfChapter: i === 0,
      });
    }
  }

  // Step 2: Pair sides into physical pages (front=right, back=left)
  const result: BookPage[] = [];

  for (let i = 0; i < sides.length; i += 2) {
    const front = sides[i];
    const back = i + 1 < sides.length ? sides[i + 1] : undefined;

    result.push({
      pageNumber: result.length + 1,
      title: front.isFirstOfChapter ? front.chapterTitle : undefined,
      content: (
        <>
          {!front.isFirstOfChapter && front.chapterTitle && (
            <p className="text-[9px] uppercase tracking-[0.15em] text-stone-400 mb-2 font-sans">
              {shortLabel(front.chapterTitle)}
            </p>
          )}
          <TextContent text={front.text} />
        </>
      ),
      backContent: back ? (
        <>
          {back.isFirstOfChapter && back.chapterTitle ? (
            <h4 className="text-[13px] font-bold text-center mb-3 text-stone-900 tracking-tight leading-tight font-serif">
              {back.chapterTitle}
            </h4>
          ) : back.chapterTitle ? (
            <p className="text-[9px] uppercase tracking-[0.15em] text-stone-400 mb-2 font-sans">
              {shortLabel(back.chapterTitle)}
            </p>
          ) : null}
          <TextContent text={back.text} />
        </>
      ) : undefined,
    });
  }

  return result;
}

export default function BooksPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Header showBackButton={true} title="Library" />

        <main className="mt-12 mb-24">
          <header className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
              My Library
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Interactive collections of my findings and deep dives into
              various technical topics.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-6 h-6 border-2 border-zinc-300 border-t-zinc-800 rounded-full" />
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400">
                Coming soon — stay tuned.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center mt-16">
              {books.map((book) => (
                <InteractiveBook
                  key={book.id}
                  bookTitle={book.title}
                  bookAuthor={book.author}
                  pages={paginateBookPages(book.pages)}
                />
              ))}
            </div>
          )}

        </main>

        <Footer />
      </div>
    </Layout>
  );
}

/** Renders plain text with paragraphs and bullet points */
function TextContent({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let currentList: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={key++} className="mb-2">
          {currentParagraph.join(" ")}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc pl-4 space-y-1 my-2">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      flushParagraph();
    } else if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
      flushParagraph();
      currentList.push(trimmed.replace(/^[•\-]\s*/, ""));
    } else {
      flushList();
      currentParagraph.push(trimmed);
    }
  }

  flushList();
  flushParagraph();

  return <div className="space-y-1 text-justify">{elements}</div>;
}
