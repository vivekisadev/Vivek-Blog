import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"

const postsDirectory = path.join(process.cwd(), "content/posts")

try {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
} catch (error) {
  console.error("Unable to create posts directory:", error)
}

export function getAllPosts() {
  try {
    const fileNames = fs.readdirSync(postsDirectory)

    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".md")) 
      .map((fileName) => {
       
        const id = fileName.replace(/\.md$/, "")


        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")


        const matterResult = matter(fileContents)

        // 合并数据
        return {
          id,
          title: matterResult.data.title || "No Title",
          date: matterResult.data.date || new Date().toISOString(),
          excerpt: matterResult.data.excerpt || "",
          tags: matterResult.data.tags || [],
          content: matterResult.content,
        }
      })

    // 按日期排序（最新的在前）
    return allPostsData.sort((a, b) => {
      if (new Date(a.date) < new Date(b.date)) {
        return 1
      } else {
        return -1
      }
    })
  } catch (error) {
    console.error("Obtaining all posts failed:", error)
    return []
  }
}

// 获取所有博客文章ID
export function getAllPostIds() {
  try {
    const fileNames = fs.readdirSync(postsDirectory)

    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        return {
          params: {
            id: fileName.replace(/\.md$/, ""),
          },
        }
      })
  } catch (error) {
    console.error("Obtaining all post IDs failed:", error)
    return []
  }
}

// 根据ID获取博客文章
export async function getPostById(id: string) {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    // 使用gray-matter解析元数据
    const matterResult = matter(fileContents)

    // 使用remark将Markdown转换为HTML
    const processedContent = await remark().use(remarkGfm).use(html).process(matterResult.content)
    const contentHtml = processedContent.toString()

    // 合并数据
    return {
      id,
      title: matterResult.data.title || "No Title",
      date: matterResult.data.date || new Date().toISOString(),
      contentHtml,
      tags: matterResult.data.tags || [],
      ...matterResult.data,
    }
  } catch (error) {
    console.error(`Getting blog posts ${id} failure:`, error)
    return null
  }
}

// 获取按年份分组的博客文章
export function getPostsByYear() {
  const posts = getAllPosts()
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

export function getPaginatedPosts(page: number = 1, pageSize: number = 5) {
  const posts = getAllPosts();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    posts: posts.slice(start, end),
    total: posts.length,
    currentPage: page,
    totalPages: Math.ceil(posts.length / pageSize)
  };
}

export function getAllTags() {
  const posts = getAllPosts()
  const tagCounts: Record<string, number> = {}

  posts.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag: string | number) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

