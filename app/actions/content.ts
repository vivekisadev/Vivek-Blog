"use server"

import fs from 'fs/promises'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

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
    
    const contentDir = path.join(process.cwd(), 'content')
    
    if (type === 'post') {
      const postsDir = path.join(contentDir, 'posts')
      try { await fs.access(postsDir) } catch { await fs.mkdir(postsDir, { recursive: true }) }

      const title = formData.get('title') as string
      const tagsStr = formData.get('tags') as string
      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : []
      const initials = getTitleInitials(title)
      const filename = await ensureUniqueFilename(postsDir, `${date}_${initials}`)
      
      let md = `---\n`
      md += `title: "${title.replace(/"/g, '\\"')}"\n`
      md += `date: "${date}"\n`
      md += `tags: ${JSON.stringify(tags)}\n`
      md += `---\n\n`
      md += content
      
      await fs.writeFile(path.join(postsDir, filename), md, 'utf-8')
      return { success: true, message: `Post created: ${filename}` }
    } else if (type === 'note') {
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
  const postsDir = path.join(process.cwd(), 'content', 'posts')
  try {
    const files = await fs.readdir(postsDir)
    const tagsSet = new Set<string>()
    // For autocomplete, we'll just return standard categories for now to keep it clean,
    // or we can parse the files. Returning standard is safer and faster.
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
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content)
  return processedContent.toString()
}
