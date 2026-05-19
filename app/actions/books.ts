"use server";

import fs from "fs";
import path from "path";

export interface BookPageData {
  pageNumber: number;
  title: string;
  content: string;       // plain text (rendered directly, not markdown)
  backContent: string;   // plain text for back of page
}

export interface BookData {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  pages: BookPageData[];
}

const BOOKS_DIR = path.join(process.cwd(), "content/books");

function ensureDir() {
  if (!fs.existsSync(BOOKS_DIR)) {
    fs.mkdirSync(BOOKS_DIR, { recursive: true });
  }
}

function bookPath(id: string) {
  return path.join(BOOKS_DIR, `${id}.json`);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── READ ────────────────────────────────────────────────────

export async function getBooks(): Promise<BookData[]> {
  ensureDir();
  const files = fs.readdirSync(BOOKS_DIR).filter((f) => f.endsWith(".json"));
  const books: BookData[] = files.map((f) => {
    const raw = fs.readFileSync(path.join(BOOKS_DIR, f), "utf-8");
    return JSON.parse(raw);
  });
  books.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return books;
}

export async function getBook(id: string): Promise<BookData | null> {
  ensureDir();
  const fp = bookPath(id);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

// ─── CREATE ──────────────────────────────────────────────────

export async function createBook(
  title: string,
  author: string
): Promise<{ success: boolean; message: string; id?: string }> {
  ensureDir();
  const id = slugify(title) || `book-${Date.now()}`;
  const fp = bookPath(id);
  if (fs.existsSync(fp)) {
    return { success: false, message: "A book with this title already exists." };
  }

  const book: BookData = {
    id,
    title,
    author,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: [],
  };
  fs.writeFileSync(fp, JSON.stringify(book, null, 2), "utf-8");
  return { success: true, message: "Book created!", id };
}

// ─── UPDATE BOOK META ────────────────────────────────────────

export async function updateBookMeta(
  id: string,
  title: string,
  author: string
): Promise<{ success: boolean; message: string }> {
  const book = await getBook(id);
  if (!book) return { success: false, message: "Book not found." };

  book.title = title;
  book.author = author;
  book.updatedAt = new Date().toISOString();
  fs.writeFileSync(bookPath(id), JSON.stringify(book, null, 2), "utf-8");
  return { success: true, message: "Book updated." };
}

// ─── ADD PAGE ────────────────────────────────────────────────

export async function addPage(
  bookId: string,
  title: string,
  content: string,
  backContent: string,
  position?: number // optional: insert at position, otherwise append
): Promise<{ success: boolean; message: string }> {
  const book = await getBook(bookId);
  if (!book) return { success: false, message: "Book not found." };

  const newPage: BookPageData = {
    pageNumber: 0, // will be recalculated
    title,
    content,
    backContent,
  };

  if (position !== undefined && position >= 0 && position <= book.pages.length) {
    book.pages.splice(position, 0, newPage);
  } else {
    book.pages.push(newPage);
  }

  // Recalculate page numbers
  book.pages.forEach((p, i) => (p.pageNumber = i + 1));
  book.updatedAt = new Date().toISOString();
  fs.writeFileSync(bookPath(bookId), JSON.stringify(book, null, 2), "utf-8");
  return { success: true, message: "Page added!" };
}

// ─── UPDATE PAGE ─────────────────────────────────────────────

export async function updatePage(
  bookId: string,
  pageNumber: number,
  title: string,
  content: string,
  backContent: string
): Promise<{ success: boolean; message: string }> {
  const book = await getBook(bookId);
  if (!book) return { success: false, message: "Book not found." };

  const page = book.pages.find((p) => p.pageNumber === pageNumber);
  if (!page) return { success: false, message: "Page not found." };

  page.title = title;
  page.content = content;
  page.backContent = backContent;
  book.updatedAt = new Date().toISOString();
  fs.writeFileSync(bookPath(bookId), JSON.stringify(book, null, 2), "utf-8");
  return { success: true, message: "Page updated." };
}

// ─── DELETE PAGE ─────────────────────────────────────────────

export async function deletePage(
  bookId: string,
  pageNumber: number
): Promise<{ success: boolean; message: string }> {
  const book = await getBook(bookId);
  if (!book) return { success: false, message: "Book not found." };

  book.pages = book.pages.filter((p) => p.pageNumber !== pageNumber);
  book.pages.forEach((p, i) => (p.pageNumber = i + 1));
  book.updatedAt = new Date().toISOString();
  fs.writeFileSync(bookPath(bookId), JSON.stringify(book, null, 2), "utf-8");
  return { success: true, message: "Page deleted." };
}

// ─── DELETE BOOK ─────────────────────────────────────────────

export async function deleteBook(
  id: string
): Promise<{ success: boolean; message: string }> {
  const fp = bookPath(id);
  if (!fs.existsSync(fp)) return { success: false, message: "Book not found." };
  fs.unlinkSync(fp);
  return { success: true, message: "Book deleted." };
}

// ─── MOVE PAGE (REORDER) ─────────────────────────────────────

export async function movePage(
  bookId: string,
  fromIndex: number,
  toIndex: number
): Promise<{ success: boolean; message: string }> {
  const book = await getBook(bookId);
  if (!book) return { success: false, message: "Book not found." };

  if (
    fromIndex < 0 ||
    fromIndex >= book.pages.length ||
    toIndex < 0 ||
    toIndex >= book.pages.length
  ) {
    return { success: false, message: "Invalid position." };
  }

  // Remove from old position and insert at new position
  const [moved] = book.pages.splice(fromIndex, 1);
  book.pages.splice(toIndex, 0, moved);

  // Recalculate page numbers and update chapter/section numbers in titles
  book.pages.forEach((p, i) => {
    p.pageNumber = i + 1;
    // Update "Chapter X:", "X.", or "Section X:" prefixes to match new position
    p.title = p.title
      .replace(/^(Chapter\s+)\d+/i, `$1${i + 1}`)
      .replace(/^\d+\./, `${i + 1}.`);
  });
  book.updatedAt = new Date().toISOString();
  fs.writeFileSync(bookPath(bookId), JSON.stringify(book, null, 2), "utf-8");
  return { success: true, message: "Page moved." };
}
