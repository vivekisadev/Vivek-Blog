import { Layout } from "@/components/layout"
import { NotesPagination } from "@/components/notes-pagination"
import { getPaginatedNotesAction } from "@/app/actions/notes"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getAllPosts } from "@/app/lib/posts"

export const dynamic = 'force-static'
export const revalidate = false 

export async function generateStaticParams() {
  const { totalPages } = await getPaginatedNotesAction(1, 7)
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString()
  }))
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: { page?: string }
}) {
  const currentPage = Number(searchParams?.page) || 1
  const { notes, total, totalPages } = await getPaginatedNotesAction(currentPage, 7)
  const posts = await getAllPosts()

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Header showBackButton={true} title="essay" />

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