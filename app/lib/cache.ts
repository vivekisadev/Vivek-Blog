import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/posts")

// 缓存数据结构
interface CacheData {
  posts: any[]
  tags: { tag: string; count: number }[]
  postsByYear: Record<string, any[]>
  lastUpdated: number
}

// 缓存实例
let cache: CacheData | null = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24小时缓存

// 初始化缓存
export async function initCache() {
  if (cache) return cache

  try {
    const fileNames = await fs.promises.readdir(postsDirectory)
    const posts: any[] = []
    const tagCounts: Record<string, number> = {}
    const postsByYear: Record<string, any[]> = {}

    // 使用 Promise.all 并行处理文件读取
    await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map(async (fileName) => {
          const id = fileName.replace(/\.md$/, "")
          const fullPath = path.join(postsDirectory, fileName)
          const fileContents = await fs.promises.readFile(fullPath, "utf8")
          const matterResult = matter(fileContents)

          const post = {
            id,
            title: matterResult.data.title || "无标题",
            date: matterResult.data.date || new Date().toISOString(),
            excerpt: matterResult.data.excerpt || "",
            tags: matterResult.data.tags || [],
          }

          posts.push(post)

          // 统计标签
          post.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
          })

          // 按年份分组
          const year = new Date(post.date).getFullYear().toString()
          if (!postsByYear[year]) {
            postsByYear[year] = []
          }
          postsByYear[year].push(post)
        })
    )

    // 按日期排序
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // 按年份排序文章
    Object.keys(postsByYear).forEach((year) => {
      postsByYear[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })

    // 转换标签统计
    const tags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    cache = {
      posts,
      tags,
      postsByYear,
      lastUpdated: Date.now(),
    }

    return cache
  } catch (error) {
    console.error('Error initializing cache:', error)
    throw error
  }
}

// 获取缓存数据
export async function getCache() {
  if (!cache || Date.now() - cache.lastUpdated > CACHE_DURATION) {
    return await initCache()
  }
  return cache
}

// 获取分页文章
export async function getPaginatedPosts(page: number = 1, pageSize: number = 10, tag?: string | null) {
  const cache = await getCache()
  let filteredPosts = cache.posts

  if (tag) {
    filteredPosts = filteredPosts.filter(post => post.tags && post.tags.includes(tag))
  }

  const start = (page - 1) * pageSize
  const paginatedPosts = filteredPosts.slice(start, start + pageSize)

  return {
    posts: paginatedPosts,
    total: filteredPosts.length,
    totalPages: Math.ceil(filteredPosts.length / pageSize)
  }
}

// 获取所有标签
export async function getAllTags() {
  const cache = await getCache()
  // 保证每次返回都排序，防止缓存被污染或外部修改
  return [...cache.tags].sort((a, b) => b.count - a.count)
}

// 获取按年份分组的文章
export async function getPostsByYear(tag?: string | null) {
  const cache = await getCache()
  if (!tag) {
    return cache.postsByYear
  }

  const filteredPostsByYear: Record<string, any[]> = {}
  Object.entries(cache.postsByYear).forEach(([year, posts]) => {
    const filteredPosts = posts.filter(post => post.tags && post.tags.includes(tag))
    if (filteredPosts.length > 0) {
      filteredPostsByYear[year] = filteredPosts
    }
  })

  return filteredPostsByYear
}

// 预加载数据
export async function preloadData() {
  try {
    await initCache()
  } catch (error) {
    console.error('Error preloading data:', error)
  }
} 