"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  getBooks,
  getBook,
  createBook,
  addPage,
  updatePage,
  deletePage,
  movePage,
  type BookData,
  type BookPageData,
} from "@/app/actions/books";
import {
  Plus,
  BookOpen,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Trash2,
  Save,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AdminGate } from "@/components/admin-gate";

type View = "list" | "pages" | "edit-page";

export default function BookEditorPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [view, setView] = useState<View>("list");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New book form
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [showNewBookForm, setShowNewBookForm] = useState(false);

  // Page editor
  const [editingPage, setEditingPage] = useState<BookPageData | null>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [insertPosition, setInsertPosition] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const data = await getBooks();
    setBooks(data);
    setLoading(false);
  };

  const handleCreateBook = async () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a book title");
      return;
    }
    setSaving(true);
    const res = await createBook(newTitle.trim(), newAuthor.trim() || "Vivek");
    if (res.success) {
      toast.success(res.message);
      setNewTitle("");
      setNewAuthor("");
      setShowNewBookForm(false);
      await loadBooks();
    } else {
      toast.error(res.message);
    }
    setSaving(false);
  };

  const handleSelectBook = async (bookId: string) => {
    const book = await getBook(bookId);
    if (book) {
      setSelectedBook(book);
      setView("pages");
    }
  };

  const handleAddPage = (position?: number) => {
    setEditingPage(null);
    setPageTitle("");
    setPageContent("");
    setInsertPosition(position);
    setView("edit-page");
  };

  const handleEditPage = (page: BookPageData) => {
    setEditingPage(page);
    setPageTitle(page.title);
    // Merge existing front+back for editing in one field
    const merged = [page.content, page.backContent].filter(t => t?.trim()).join("\n\n");
    setPageContent(merged);
    setInsertPosition(undefined);
    setView("edit-page");
  };

  const handleSavePage = async () => {
    if (!selectedBook) return;
    if (!pageTitle.trim() && !pageContent.trim()) {
      toast.error("Please enter at least a title or content");
      return;
    }

    setSaving(true);

    if (editingPage) {
      // Update existing page
      const res = await updatePage(
        selectedBook.id,
        editingPage.pageNumber,
        pageTitle,
        pageContent,
        ""
      );
      if (res.success) {
        toast.success("Page updated!");
      } else {
        toast.error(res.message);
      }
    } else {
      // Add new page
      const res = await addPage(
        selectedBook.id,
        pageTitle,
        pageContent,
        "",
        insertPosition
      );
      if (res.success) {
        toast.success("Page added!");
      } else {
        toast.error(res.message);
      }
    }

    // Refresh book data
    const updated = await getBook(selectedBook.id);
    if (updated) setSelectedBook(updated);
    setView("pages");
    setSaving(false);
  };

  const handleDeletePage = async (pageNumber: number) => {
    if (!selectedBook) return;
    if (!confirm("Delete this page?")) return;

    const res = await deletePage(selectedBook.id, pageNumber);
    if (res.success) {
      toast.success("Page deleted");
      const updated = await getBook(selectedBook.id);
      if (updated) setSelectedBook(updated);
    } else {
      toast.error(res.message);
    }
  };

  const handleMovePage = async (fromIdx: number, toIdx: number) => {
    if (!selectedBook) return;
    const res = await movePage(selectedBook.id, fromIdx, toIdx);
    if (res.success) {
      const updated = await getBook(selectedBook.id);
      if (updated) setSelectedBook(updated);
    } else {
      toast.error(res.message);
    }
  };

  const goBack = () => {
    if (view === "edit-page") {
      setView("pages");
    } else if (view === "pages") {
      setSelectedBook(null);
      setView("list");
      loadBooks();
    }
  };

  return (
    <AdminGate>
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Header showBackButton={true} title="Book Editor" />

        <main className="mt-12 mb-20">
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              {view === "list" && "Your Books"}
              {view === "pages" && selectedBook?.title}
              {view === "edit-page" &&
                (editingPage ? "Edit Page" : "New Page")}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {view === "list" && "Create and manage your interactive books."}
              {view === "pages" &&
                `${selectedBook?.pages.length || 0} pages · Each page has a front and back side.`}
              {view === "edit-page" &&
                "Write the content for the front and back of this page."}
            </p>
          </header>

          {/* Back button for nested views */}
          {view !== "list" && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              {view === "edit-page" ? "Back to Pages" : "Back to Books"}
            </button>
          )}

          {/* ─── BOOK LIST VIEW ─── */}
          {view === "list" && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full" />
                </div>
              ) : (
                <>
                  {books.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleSelectBook(book.id)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 rounded-md bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center shadow-md">
                          <BookOpen size={14} className="text-zinc-300" />
                        </div>
                        <div>
                          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                            {book.title}
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {book.pages.length} pages · by {book.author}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors"
                      />
                    </button>
                  ))}

                  {/* New book form */}
                  <AnimatePresence>
                    {showNewBookForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 bg-zinc-50 dark:bg-zinc-900/50">
                          <div className="space-y-2">
                            <Label className="text-zinc-700 dark:text-zinc-300">
                              Book Title
                            </Label>
                            <Input
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              placeholder="e.g. System Design Patterns"
                              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-zinc-700 dark:text-zinc-300">
                              Author
                            </Label>
                            <Input
                              value={newAuthor}
                              onChange={(e) => setNewAuthor(e.target.value)}
                              placeholder="Vivek"
                              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowNewBookForm(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleCreateBook}
                              disabled={saving}
                              className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                            >
                              {saving ? "Creating..." : "Create Book"}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setShowNewBookForm(!showNewBookForm)}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-sm font-medium"
                  >
                    <Plus size={16} /> New Book
                  </button>
                </>
              )}
            </div>
          )}

          {/* ─── PAGES LIST VIEW ─── */}
          {view === "pages" && selectedBook && (
            <div className="space-y-3">
              {selectedBook.pages.map((page, idx) => (
                <div key={page.pageNumber}>
                  {/* Insert before button */}
                  <button
                    onClick={() => handleAddPage(idx)}
                    className="w-full flex items-center justify-center gap-1 py-1 text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors opacity-0 hover:opacity-100"
                  >
                    <Plus size={10} /> Insert page here
                  </button>

                  <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                    {/* Move up/down */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => handleMovePage(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMovePage(idx, idx + 1)}
                        disabled={idx === selectedBook.pages.length - 1}
                        className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          p.{page.pageNumber}
                        </span>
                        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {page.title || "Untitled"}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 truncate">
                        {page.content.substring(0, 80)}...
                      </p>
                    </div>
                    <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditPage(page)}
                        className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.pageNumber)}
                        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add page at end */}
              <button
                onClick={() => handleAddPage()}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-sm font-medium"
              >
                <Plus size={16} /> Add New Page
              </button>
            </div>
          )}

          {/* ─── PAGE EDITOR VIEW ─── */}
          {view === "edit-page" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-zinc-700 dark:text-zinc-300">
                  Page Title
                </Label>
                <Input
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="e.g. Chapter 3: Load Balancing"
                  className="h-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-700 dark:text-zinc-300">
                  Content
                </Label>
                <p className="text-xs text-zinc-400">
                  Write the chapter content. Use blank lines to separate
                  paragraphs. Start lines with "• " or "- " for bullets.
                  Content will auto-fill across pages.
                </p>
                <Textarea
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  placeholder="Write your content here..."
                  rows={16}
                  className="font-mono text-sm leading-relaxed resize-y bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 p-4"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                <Button variant="outline" onClick={goBack}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePage}
                  disabled={saving}
                  className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save size={14} />
                      {editingPage ? "Update Page" : "Add Page"}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </Layout>
    </AdminGate>
  );
}
