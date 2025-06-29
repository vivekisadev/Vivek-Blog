"use server"

import { getPaginatedPosts, getAllTags, getPostsByYear } from "@/app/lib/cache"

export async function getPaginatedPostsAction(page: number = 1, pageSize: number = 10, tag?: string | null) {
  try {
    const result = await getPaginatedPosts(page, pageSize, tag)
    return result
  } catch (error) {
    console.error('Error in getPaginatedPostsAction:', error)
    return {
      posts: [],
      total: 0,
      totalPages: 0
    }
  }
}

export async function getAllTagsAction() {
  try {
    const tags = await getAllTags()
    return [...tags].sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error in getAllTagsAction:', error)
    return []
  }
}

export async function getPostsByYearAction(tag?: string | null) {
  try {
    const posts = await getPostsByYear(tag)
    return posts
  } catch (error) {
    console.error('Error in getPostsByYearAction:', error)
    return {}
  }
}