import fs from "fs"
import path from "path"
import matter from "gray-matter"
import prisma from "@/lib/prisma"

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

const TAG_CATEGORIES: Record<string, string> = {
  // Frontend
  'React': 'Frontend', 'Next.js': 'Frontend', 'Svelte': 'Frontend', 'CSS': 'Frontend', 'Tailwind': 'Frontend', 'Frontend': 'Frontend', 'Design': 'Frontend', 'Layout': 'Frontend', 'Framer Motion': 'Frontend', 'Animation': 'Frontend', 'Web': 'Frontend',
  // Backend & DevOps
  'Node.js': 'Backend', 'Bun': 'Backend', 'Deno': 'Backend', 'Database': 'Backend', 'MongoDB': 'Backend', 'PostgreSQL': 'Backend', 'Redis': 'Backend', 'Backend': 'Backend', 'API': 'Backend', 'Runtime': 'Backend',
  'DevOps': 'DevOps', 'Docker': 'DevOps', 'Kubernetes': 'DevOps', 'Deployment': 'DevOps', 'Git': 'DevOps', 'Vercel': 'DevOps', 'Netlify': 'DevOps', 'Cloudflare': 'DevOps', 'Containers': 'DevOps', 'Cloud': 'DevOps',
  // AI
  'AI': 'AI & ML', 'LLM': 'AI & ML', 'Agents': 'AI & ML', 'Claude': 'AI & ML', 'GPT': 'AI & ML', 'Gemini': 'AI & ML', 'Llama': 'AI & ML', 'Machine Learning': 'AI & ML', 'ML': 'AI & ML', 'Fine-tuning': 'AI & ML', 'Cursor': 'AI & ML', 'Copilot': 'AI & ML', 'AI Assistants': 'AI & ML',
  // Hardware
  'RAM': 'Hardware', 'Hardware': 'Hardware', 'DDR5': 'Hardware', 'DDR6': 'Hardware', 'Market': 'Hardware', 'Memory': 'Hardware',
  // Security
  'Cybersecurity': 'Security', 'Security': 'Security', 'Hacking': 'Security', 'OWASP': 'Security', 'Zero-Day': 'Security', 'XSS': 'Security', 'Pentesting': 'Security', 'Defense': 'Security',
  // Languages
  'JavaScript': 'Languages', 'TypeScript': 'Languages', 'Rust': 'Languages', 'Go': 'Languages', 'WASM': 'Languages', 'WebAssembly': 'Languages',
  // Dev Life
  'Career': 'Dev Life', 'Productivity': 'Dev Life', 'Memes': 'Dev Life', 'Humor': 'Dev Life', 'Dev': 'Dev Life', 'Software': 'Dev Life', 'Goals': 'Dev Life', 'History': 'Dev Life'
};

export async function getAllPostsMeta() {
  const fileNames = fs.existsSync(postsDirectory) ? fs.readdirSync(postsDirectory) : []
  const postMap = new Map<string, any>()

  return await getCachedData('all-posts-meta', async () => {
    const localPosts = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const id = fileName.replace(/\.md$/, "")
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, "utf8")
        const matterResult = matter(fileContents)
        
        let rawTags = matterResult.data.tags || []
        const categorizedTags = new Set<string>()
        
        rawTags.forEach((tag: string) => {
          const category = TAG_CATEGORIES[tag] ||
                           Object.entries(TAG_CATEGORIES).find(([k]) => k.toLowerCase() === tag.toLowerCase())?.[1] ||
                           'Other'
          categorizedTags.add(category)
        })

        const plainText = matterResult.content.replace(/<[^>]*>?/gm, '')
        const wordCount = plainText.split(/\s+/).length
        const readingTime = Math.max(1, Math.ceil(wordCount / 200))

        return {
          id,
          slug: id,
          title: matterResult.data.title || "无标题",
          date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : new Date().toISOString(),
          tags: Array.from(categorizedTags),
          readingTime,
        }
      })

    localPosts.forEach((post) => {
      postMap.set(post.id, post)
    })

    try {
      const dbPosts = await prisma.post.findMany({ where: { published: true } })
      dbPosts.forEach((dbPost) => {
        const id = dbPost.slug || dbPost.id.toString()
        if (!postMap.has(id)) {
          const rawTags = dbPost.tags || []
          const categorizedTags = new Set<string>()
          rawTags.forEach((tag: string) => {
            const category = TAG_CATEGORIES[tag] ||
                             Object.entries(TAG_CATEGORIES).find(([k]) => k.toLowerCase() === tag.toLowerCase())?.[1] ||
                             'Other'
            categorizedTags.add(category)
          })

          postMap.set(id, {
            id,
            slug: id,
            title: dbPost.title,
            date: dbPost.createdAt.toISOString(),
            tags: Array.from(categorizedTags),
            readingTime: Math.max(1, Math.ceil(dbPost.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length / 200)),
          })
        }
      })
    } catch (error) {
      console.error('Error fetching posts from database:', error)
    }

    const posts = Array.from(postMap.values())
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return posts
  }, 60000); // 1 minute TTL instead of 0
}

export function getTagsFromPosts(posts: any[]) {
  const tagCounts: Record<string, number> = {}
  posts.forEach((post: any) => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count: Number(count) }))
    .sort((a, b) => b.count - a.count)
}

export async function getAllNotesMeta() {
  const notesDirectory = path.join(process.cwd(), "content/notes");
  const notes: any[] = [];

  return await getCachedData('all-notes-meta', async () => {
    if (fs.existsSync(notesDirectory)) {
      const fileNames = fs.readdirSync(notesDirectory);
      fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .forEach((fileName) => {
          const fullPath = path.join(notesDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, "utf8");
          const matterResult = matter(fileContents);
          notes.push({
            id: fileName.replace(/\.md$/, ""),
            content: matterResult.content,
            date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : new Date().toISOString(),
          });
        });
    }

    try {
      const dbNotes = await (prisma as any).note?.findMany?.();
      if (Array.isArray(dbNotes)) {
        dbNotes.forEach((dbNote: any) => {
          notes.push({
            id: dbNote.id.toString(),
            content: dbNote.content,
            date: dbNote.createdAt.toISOString(),
            isFromDb: true,
          });
        });
      }
    } catch (error) {
      console.error('Error fetching notes from database:', error);
    }

    notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return notes;
  }, 60000); // 1 minute TTL instead of 0
}
