import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import rehypePrettyCode from "rehype-pretty-code"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

const prettyCodeOptions: any = {
  theme: 'one-dark-pro',
  keepBackground: false,
}
import { Metadata } from "next"
import prisma from "@/lib/prisma"

const postsDirectory = path.join(process.cwd(), "content/posts")

try {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
} catch (error) {
  console.error("Unable to create posts directory:", error)
}

export interface PostData {
  id: string
  title: string
  date: string
  contentHtml: string
  tags?: string[]
  excerpt?: string
  readingTime?: number
}

export async function getAllPosts() {
  try {
    const fileNames = fs.existsSync(postsDirectory) ? fs.readdirSync(postsDirectory) : []
    const postMap = new Map<string, any>()

    const localPosts = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const id = fileName.replace(/\.md$/, "")
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const matterResult = matter(fileContents)

        return {
          id,
          title: matterResult.data.title || "No Title",
          date: matterResult.data.date || new Date().toISOString(),
          excerpt: matterResult.data.excerpt || "",
          tags: matterResult.data.tags || [],
          content: matterResult.content,
        }
      })

    localPosts.forEach((post) => postMap.set(post.id, post))

    try {
      const dbPosts = await prisma.post.findMany({ where: { published: true } })
      dbPosts.forEach((dbPost) => {
        const id = dbPost.slug || dbPost.id.toString()
        if (!postMap.has(id)) {
          postMap.set(id, {
            id,
            title: dbPost.title,
            date: dbPost.createdAt.toISOString(),
            excerpt: dbPost.content.substring(0, 150) + '...',
            tags: dbPost.tags || [],
            content: dbPost.content,
          })
        }
      })
    } catch (error) {
      console.error('Error fetching posts from database:', error)
    }

    const allPostsData = Array.from(postMap.values())
    return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Obtaining all posts failed:", error)
    return []
  }
}

export async function getAllPostIds() {
  try {
    const fileNames = fs.existsSync(postsDirectory) ? fs.readdirSync(postsDirectory) : []
    const ids = new Set<string>()

    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .forEach((fileName) => ids.add(fileName.replace(/\.md$/, "")))

    try {
      const dbPosts = await prisma.post.findMany({ where: { published: true } })
      dbPosts.forEach((dbPost) => {
        ids.add(dbPost.slug || dbPost.id.toString())
      })
    } catch (error) {
      console.error('Error fetching DB post ids:', error)
    }

    return Array.from(ids).map((id) => ({ params: { id } }))
  } catch (error) {
    console.error("Obtaining all post IDs failed:", error)
    return []
  }
}

export async function getPostById(id: string) {
  try {
    // 1. Try local file system
    const fullPath = path.join(postsDirectory, `${id}.md`)
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const matterResult = matter(fileContents)

      const processedContent = await remark()
        .use(remarkMath)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeKatex)
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(rehypePrettyCode, prettyCodeOptions)
        .use(rehypeStringify)
        .process(matterResult.content)
      const contentHtml = processedContent.toString()

      return {
        id,
        title: matterResult.data.title || "No Title",
        date: matterResult.data.date || new Date().toISOString(),
        contentHtml,
        tags: matterResult.data.tags || [],
        excerpt: matterResult.data.excerpt || "",
        readingTime: Math.max(1, Math.ceil(matterResult.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length / 200)),
        ...matterResult.data,
      } as PostData
    }

    // 2. Try database
    const dbPost = await prisma.post.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: isNaN(parseInt(id)) ? -1 : parseInt(id) }
        ]
      }
    })

      if (dbPost) {
        const processedContent = await remark()
          .use(remarkMath)
          .use(remarkGfm)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeKatex)
          .use(rehypeRaw)
          .use(rehypeSlug)
          .use(rehypePrettyCode, prettyCodeOptions)
          .use(rehypeStringify)
          .process(dbPost.content)
      const contentHtml = processedContent.toString()

      return {
        id: dbPost.slug || dbPost.id.toString(),
        title: dbPost.title,
        date: dbPost.createdAt.toISOString(),
        contentHtml,
        tags: dbPost.tags || [],
        excerpt: dbPost.content.substring(0, 150) + '...',
        readingTime: Math.max(1, Math.ceil(dbPost.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length / 200)),
      } as PostData
    }

    return null
  } catch (error) {
    console.error(`Getting blog posts ${id} failure:`, error)
    return null
  }
}

export async function getPostsByYear() {
  const posts = await getAllPosts()
  const postsByYear: Record<string, typeof posts> = {}

  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString()
    if (!postsByYear[year]) {
      postsByYear[year] = []
    }
    postsByYear[year].push(post)
  })

  return postsByYear
}

export async function getPaginatedPosts(page: number = 1, pageSize: number = 5) {
  const posts = await getAllPosts();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    posts: posts.slice(start, end),
    total: posts.length,
    currentPage: page,
    totalPages: Math.ceil(posts.length / pageSize)
  };
}

export async function getAllTags() {
  const posts = await getAllPosts()
  const tagCounts: Record<string, number> = {}

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag: string | number) => {
        const tagStr = String(tag).trim()
        if (tagStr) {
          tagCounts[tagStr] = (tagCounts[tagStr] || 0) + 1
        }
      })
    }
  })

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export async function generateStaticParams() {
  const posts = await getAllPostIds()
  return posts.map((post) => ({
    id: post.params.id,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params)
  const post = await getPostById(resolvedParams.id)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const description = post.contentHtml.replace(/<[^>]*>/g, '').slice(0, 200)
  const url = `https://blogsbyvivek.vercel.app/posts/${resolvedParams.id}`

  return {
    title: post.title,
    description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Vivek'],
      tags: post.tags,
      url,
      siteName: 'Vivek Blog',
      locale: 'en',
      images: [
        {
          url: `https://blogsbyvivek.vercel.app/api/og?title=${encodeURIComponent(post.title)}&date=${encodeURIComponent(new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [`https://blogsbyvivek.vercel.app/api/og?title=${encodeURIComponent(post.title)}&date=${encodeURIComponent(new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}`],
    },
  }
}

