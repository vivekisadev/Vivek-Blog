"use server"

import fs from 'fs/promises'
import path from 'path'
import { remark } from 'remark'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import prisma from '@/lib/prisma'
import { notifySubscribers, useDatabase as useDatabaseNotifications } from '@/lib/notifications'

function getTitleInitials(title: string) {
  const initials = title
    .trim()
    .split(/\s+/)
    .map(word => word.replace(/[^A-Za-z0-9]/g, ''))
    .filter(Boolean)
    .map(word => word[0].toUpperCase())
    .join('')

  return initials || title.toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

async function ensureUniqueFilename(directory: string, baseName: string) {
  let filename = `${baseName}.md`
  let count = 1

  while (true) {
    try {
      await fs.access(path.join(directory, filename))
      filename = `${baseName}_${count}`.concat('.md')
      count += 1
    } catch {
      return filename
    }
  }
}

export async function createContent(formData: FormData) {
  try {
    const type = formData.get('type') as 'post' | 'note'
    const date = formData.get('date') as string || new Date().toISOString().split('T')[0]
    const content = formData.get('content') as string
    
    const useDatabase = useDatabaseNotifications

    if (type === 'post') {
      const title = formData.get('title') as string
      const tagsStr = formData.get('tags') as string
      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : []
      const initials = getTitleInitials(title)
      const slug = `${date}_${initials}`.toLowerCase().replace(/[^a-z0-9]+/g, '_')

      if (useDatabase) {
        const post = await prisma.post.create({
          data: {
            title,
            content,
            tags,
            slug,
            published: true,
            createdAt: new Date(date),
          }
        })
        
        // Notify subscribers asynchronously
        notifySubscribers('post', title, date).catch(console.error)
        
        return { success: true, message: `Post created in database: ${post.slug}` }
      }

      // Local file system logic
      const contentDir = path.join(process.cwd(), 'content')
      const postsDir = path.join(contentDir, 'posts')
      try { await fs.access(postsDir) } catch { await fs.mkdir(postsDir, { recursive: true }) }

      const filename = await ensureUniqueFilename(postsDir, slug)
      
      let md = `---\n`
      md += `title: "${title.replace(/"/g, '\\"')}"\n`
      md += `date: "${date}"\n`
      md += `tags: ${JSON.stringify(tags)}\n`
      md += `---\n\n`
      md += content
      
      await fs.writeFile(path.join(postsDir, filename), md, 'utf-8')
      
      // Notify subscribers asynchronously
      notifySubscribers('post', title, date).catch(console.error)

      return { success: true, message: `Post created: ${filename}` }
    } else if (type === 'note') {
      if (useDatabase) {
        const note = await prisma.note.create({
          data: {
            content,
            createdAt: new Date(date),
          }
        })
        
        // Notify subscribers asynchronously
        notifySubscribers('note', undefined, date).catch(console.error)

        return { success: true, message: `Note created in database: ${note.id}` }
      }

      // Local file system logic
      const contentDir = path.join(process.cwd(), 'content')
      const notesDir = path.join(contentDir, 'notes')
      try { await fs.access(notesDir) } catch { await fs.mkdir(notesDir, { recursive: true }) }
      
      const files = await fs.readdir(notesDir)
      let maxId = -1
      for (const f of files) {
        if (f.endsWith('.md')) {
          const id = parseInt(f.replace('.md', ''), 10)
          if (!isNaN(id) && id > maxId) maxId = id
        }
      }
      const newId = maxId + 1
      
      let md = `---\n`
      md += `date: "${date}"\n`
      md += `---\n\n`
      md += content
      
      await fs.writeFile(path.join(notesDir, `${newId}.md`), md, 'utf-8')
      
      // Notify subscribers asynchronously
      notifySubscribers('note', undefined, date).catch(console.error)

      return { success: true, message: `Note created: ${newId}.md` }
    }
    
    return { success: false, message: 'Invalid type' }
  } catch (error: any) {
    console.error('Error in createContent:', error)

    if (error?.code === 'EROFS' || /read-only file system/i.test(error?.message)) {
      return {
        success: false,
        message: 'Unable to save post because the server file system is read-only. Create posts locally or use a writable backend/storage service.',
      }
    }

    return { success: false, message: error.message || 'Unknown server error' }
  }
}

export async function getAvailableTags() {
  try {
    // Standard categories for autocomplete
    return [
      'React', 'Next.js', 'Frontend', 'Backend', 'Node.js', 
      'DevOps', 'AI', 'Machine Learning', 'Security', 'Web', 'TypeScript'
    ]
  } catch {
    return []
  }
}

export async function parseMarkdown(content: string): Promise<string> {
  const processedContent = await remark()
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(content)
  return processedContent.toString()
}

import matter from "gray-matter"

export async function getRawContent(type: 'post' | 'note', id: string) {
  if (type === 'post') {
    // 1. Try DB first
    const dbPost = await prisma.post.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: isNaN(parseInt(id)) ? -1 : parseInt(id) }
        ]
      }
    })
    if (dbPost) {
      return { id: dbPost.slug || dbPost.id.toString(), type: 'post', title: dbPost.title, tags: dbPost.tags?.join(', ') || '', content: dbPost.content, date: dbPost.createdAt.toISOString().split('T')[0] }
    }
    // 2. Try FS
    const fullPath = path.join(process.cwd(), "content/posts", `${id}.md`)
    try {
      const fileContents = await fs.readFile(fullPath, "utf8")
      const matterResult = matter(fileContents)
      return { id, type: 'post', title: matterResult.data.title || '', tags: (matterResult.data.tags || []).join(', '), content: matterResult.content, date: matterResult.data.date || '' }
    } catch { return null }
  } else {
    // Note
    const dbNote = await prisma.note.findFirst({ where: { id: isNaN(parseInt(id)) ? -1 : parseInt(id) } })
    if (dbNote) {
      return { id: dbNote.id.toString(), type: 'note', content: dbNote.content, date: dbNote.createdAt.toISOString().split('T')[0] }
    }
    const fullPath = path.join(process.cwd(), "content/notes", `${id}.md`)
    try {
      const fileContents = await fs.readFile(fullPath, "utf8")
      const matterResult = matter(fileContents)
      return { id, type: 'note', content: matterResult.content, date: matterResult.data.date || '' }
    } catch { return null }
  }
}

export async function updateContent(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const type = formData.get('type') as 'post' | 'note'
    const date = formData.get('date') as string || new Date().toISOString().split('T')[0]
    const content = formData.get('content') as string

    if (!id) throw new Error("ID is required for update")

    if (type === 'post') {
      const title = formData.get('title') as string
      const tagsStr = formData.get('tags') as string
      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : []

      // Try update DB
      const dbPost = await prisma.post.findFirst({
        where: {
          OR: [
            { slug: id },
            { id: isNaN(parseInt(id)) ? -1 : parseInt(id) }
          ]
        }
      })

      if (dbPost) {
        await prisma.post.update({
          where: { id: dbPost.id },
          data: { title, content, tags, createdAt: new Date(date) }
        })
        return { success: true, message: `Post updated in DB: ${id}` }
      }

      // Try update FS
      const postsDir = path.join(process.cwd(), 'content/posts')
      let md = `---\n`
      md += `title: "${title.replace(/"/g, '\\"')}"\n`
      md += `date: "${date}"\n`
      md += `tags: ${JSON.stringify(tags)}\n`
      md += `---\n\n`
      md += content
      await fs.writeFile(path.join(postsDir, `${id}.md`), md, 'utf-8')
      return { success: true, message: `Post updated in FS: ${id}` }

    } else if (type === 'note') {
      const dbNote = await prisma.note.findFirst({ where: { id: isNaN(parseInt(id)) ? -1 : parseInt(id) } })
      if (dbNote) {
        await prisma.note.update({
          where: { id: dbNote.id },
          data: { content, createdAt: new Date(date) }
        })
        return { success: true, message: `Note updated in DB: ${id}` }
      }

      const notesDir = path.join(process.cwd(), 'content/notes')
      let md = `---\n`
      md += `date: "${date}"\n`
      md += `---\n\n`
      md += content
      await fs.writeFile(path.join(notesDir, `${id}.md`), md, 'utf-8')
      return { success: true, message: `Note updated in FS: ${id}` }
    }
    return { success: false, message: 'Invalid type' }
  } catch (error: any) {
    return { success: false, message: error.message || 'Unknown server error' }
  }
}

export async function deleteContent(id: string, type: 'post' | 'note') {
  try {
    if (type === 'post') {
      // Try delete from DB
      const dbPost = await prisma.post.findFirst({
        where: {
          OR: [
            { slug: id },
            { id: isNaN(parseInt(id)) ? -1 : parseInt(id) }
          ]
        }
      })
      if (dbPost) {
        await prisma.post.delete({ where: { id: dbPost.id } })
        try {
          await prisma.viewCount.deleteMany({ where: { slug: dbPost.slug } })
          await prisma.likeCount.deleteMany({ where: { slug: dbPost.slug } })
        } catch (e) {} 
        return { success: true, message: `Post deleted from DB` }
      }

      // Try delete from FS
      const fullPath = path.join(process.cwd(), "content/posts", `${id}.md`)
      try {
        await fs.unlink(fullPath)
        return { success: true, message: `Post deleted from FS` }
      } catch (e) {
        return { success: false, message: `Post not found` }
      }
    } else {
      // Note
      const dbNote = await prisma.note.findFirst({ where: { id: isNaN(parseInt(id)) ? -1 : parseInt(id) } })
      if (dbNote) {
        await prisma.note.delete({ where: { id: dbNote.id } })
        return { success: true, message: `Note deleted from DB` }
      }
      
      const fullPath = path.join(process.cwd(), "content/notes", `${id}.md`)
      try {
        await fs.unlink(fullPath)
        return { success: true, message: `Note deleted from FS` }
      } catch (e) {
        return { success: false, message: `Note not found` }
      }
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Unknown server error' }
  }
}
