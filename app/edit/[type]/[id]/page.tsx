import { getRawContent, updateContent } from '@/app/actions/content'
import { Footer } from '@/components/footer'
import { Layout } from '@/components/layout'
import { AdminGate } from '@/components/admin-gate'
import { ContentForm } from '@/components/content-form'
import { notFound } from 'next/navigation'

export default async function EditContent({ params }: { params: Promise<{ type: string, id: string }> }) {
  const resolvedParams = await params
  const { type, id } = resolvedParams

  if (type !== 'post' && type !== 'note') {
    notFound()
  }

  const rawContent = await getRawContent(type, id)

  if (!rawContent) {
    notFound()
  }

  return (
    <AdminGate>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <main className="mt-12 mb-20">
            <ContentForm 
              initialData={{
                id: rawContent.id,
                type: rawContent.type as 'post' | 'note',
                title: 'title' in rawContent ? rawContent.title : undefined,
                tags: 'tags' in rawContent ? rawContent.tags : undefined,
                content: rawContent.content,
                date: rawContent.date
              }} 
              onSubmitAction={updateContent} 
              isEditMode={true} 
            />
          </main>
          <Footer />
        </div>
      </Layout>
    </AdminGate>
  )
}
