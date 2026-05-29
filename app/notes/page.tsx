import { Layout } from "@/components/layout"
import { NotesPagination } from "@/components/notes-pagination"
import { getPaginatedNotesAction } from "@/app/actions/notes"
import { Footer } from "@/components/footer"
import { getAllPosts } from "@/app/lib/posts"

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

export async function generateStaticParams() {
  const { totalPages } = await getPaginatedNotesAction(1, 7)
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString()
  }))
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>
}) {
  const resolvedParams = await searchParams
  const currentPage = Number(resolvedParams?.page) || 1
  const { notes, total, totalPages } = await getPaginatedNotesAction(currentPage, 7)
  const posts = await getAllPosts()

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <main>
          <NotesPagination 
            initialNotes={notes}
            initialTotal={total}
            initialPage={currentPage}
            totalPages={totalPages}
          />
        </main>

        <Footer />
      </div>
    </Layout>
  )
}