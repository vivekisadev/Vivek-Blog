"use client"

import { createContent } from '@/app/actions/content'
import { Footer } from '@/components/footer'
import { Layout } from '@/components/layout'
import { AdminGate } from '@/components/admin-gate'
import { ContentForm } from '@/components/content-form'

export default function CreateContent() {
  return (
    <AdminGate>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <main className="mt-12 mb-20">
            <ContentForm onSubmitAction={createContent} />
          </main>
          <Footer />
        </div>
      </Layout>
    </AdminGate>
  )
}
