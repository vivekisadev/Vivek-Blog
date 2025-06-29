import { Metadata } from 'next'
import { Suspense } from "react"
import { ArchiveContent } from "@/components/archive-content"
import { getPostsByYearAction, getAllTagsAction } from "@/app/actions/posts"

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Stuff you might find interesting about Vivek',
  openGraph: {
    title: 'Archive | Vivek Blog',
    description: 'Stuff you might find interesting about Vivek',
  },
}

export const dynamic = 'force-static'
export const revalidate = false


async function getInitialData() {
  try {
    const [postsByYear, tags] = await Promise.all([
      getPostsByYearAction(null),
      getAllTagsAction()
    ])
    return { postsByYear, tags }
  } catch (error) {
    console.error('Error fetching initial data:', error)
    return { postsByYear: {}, tags: [] }
  }
}

export default async function Archive() {
  const initialData = await getInitialData()
  return (
    <Suspense>
      <ArchiveContent initialData={initialData} />
    </Suspense>
  )
}

