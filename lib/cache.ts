import fs from "fs"
import path from "path"
import matter from "gray-matter"

const cache = new Map<string, any>();

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, {
    data,
    timestamp: now
  });

  return data;
}

export function clearCache(key: string) {
  cache.delete(key);
}

export function clearAllCache() {
  cache.clear();
}

export async function preloadData() {
  return Promise.all([
  ])
} 

const postsDirectory = path.join(process.cwd(), "content/posts")

export function getAllPostsMeta() {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const matterResult = matter(fileContents)
      return {
        id,
        slug: id,
        title: matterResult.data.title || "无标题",
        date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : new Date().toISOString(),
        tags: matterResult.data.tags || [],
      }
    })
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return posts
}

export function getTagsFromPosts(posts) {
  const tagCounts = {}
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
}

export function getAllNotesMeta() {
  const notesDirectory = path.join(process.cwd(), "content/notes");
  if (!fs.existsSync(notesDirectory)) return [];
  const fileNames = fs.readdirSync(notesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(notesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);
      return {
        id: fileName.replace(/\.md$/, ""),
        content: matterResult.content,
        date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : new Date().toISOString(),
      };
    });
}