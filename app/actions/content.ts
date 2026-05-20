"use server"

import fs from 'fs/promises'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'

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

/**
 * Placeholder for notifying subscribers about new content.
 * You can integrate Resend, SendGrid, or any other email service here.
 */
async function notifySubscribers(type: 'post' | 'note', title?: string, date?: string) {
  try {
    const isReadOnly = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    let subscriberEmails: string[] = []

    if (isReadOnly) {
      const subscribers = await prisma.subscriber.findMany({
        select: { email: true }
      })
      subscriberEmails = subscribers.map(s => s.email)
    } else {
      const subscribersFile = path.join(process.cwd(), 'content', 'subscribers.json')
      try {
        const data = await fs.readFile(subscribersFile, 'utf-8')
        subscriberEmails = JSON.parse(data)
      } catch (e) {
        // No subscribers yet
      }
    }

    if (subscriberEmails.length === 0) return

    const displayTitle = title || (type === 'note' ? 'New Daily Update' : 'New Post');
    const displayDate = date || new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourblog.com';

    console.log(`[Notification] Notifying ${subscriberEmails.length} subscribers about new ${type}: ${displayTitle}`);
    
    // Initialize Resend with the API key from environment variables
    const resend = new Resend(process.env.RESEND_API_KEY || process.env.resend_api_key);
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; }
            .header { border-bottom: 2px solid #0070f3; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0070f3; margin: 0; }
            .meta { color: #666; font-size: 14px; margin-top: 5px; }
            .content { margin-bottom: 30px; }
            .type-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; background: ${type === 'post' ? '#0070f3' : '#10b981'}; color: white; }
            .button { display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eaeaea; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="type-badge">${type === 'post' ? 'Blog Post' : 'Daily Note'}</div>
              <h1 class="title">${displayTitle}</h1>
              <div class="meta">Published on ${displayDate}</div>
            </div>
            <div class="content">
              <p>Hello! A new ${type === 'post' ? 'article' : 'daily update'} has just been published on my blog.</p>
              <p>Click the button below to read the full update:</p>
              <a href="${appUrl}" class="button">Read on Blog</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} My Blog. All rights reserved.</p>
              <p>You received this because you subscribed to my updates.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Blog Updates <onboarding@resend.dev>',
      to: subscriberEmails,
      subject: `New ${type === 'post' ? 'Post' : 'Note'}: ${displayTitle}`,
      html: emailHtml
    });

  } catch (error) {
    console.error('Failed to notify subscribers:', error)
  }
}

export async function createContent(formData: FormData) {
  try {
    const type = formData.get('type') as 'post' | 'note'
    const date = formData.get('date') as string || new Date().toISOString().split('T')[0]
    const content = formData.get('content') as string
    
    // Check if we are in a read-only environment or if we should prefer DB
    const isReadOnly = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

    if (type === 'post') {
      const title = formData.get('title') as string
      const tagsStr = formData.get('tags') as string
      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : []
      const initials = getTitleInitials(title)
      const slug = `${date}_${initials}`.toLowerCase().replace(/[^a-z0-9]+/g, '_')

      if (isReadOnly) {
        // Save to Database
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
      if (isReadOnly) {
        // Save to Database
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
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content)
  return processedContent.toString()
}
