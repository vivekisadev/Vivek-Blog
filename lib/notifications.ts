import fs from 'fs/promises'
import path from 'path'
import { Resend } from 'resend'
import prisma from '@/lib/prisma'

const resendApiKey = process.env.RESEND_API_KEY || process.env.resend_api_key
const resendFrom = process.env.RESEND_FROM_EMAIL || 'Blog Updates <onboarding@resend.dev>'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://blogsbyvivek.vercel.app'

export const useDatabase = Boolean(process.env.DATABASE_URL)

async function readLocalSubscriberEmails(): Promise<string[]> {
  const subscribersFile = path.join(process.cwd(), 'content', 'subscribers.json')
  try {
    const data = await fs.readFile(subscribersFile, 'utf-8')
    const subscribers = JSON.parse(data)
    return Array.isArray(subscribers) ? subscribers.map(email => String(email).trim().toLowerCase()) : []
  } catch {
    return []
  }
}

export async function getSubscriberEmails(): Promise<string[]> {
  if (useDatabase) {
    try {
      const subscribers = await prisma.subscriber.findMany({ select: { email: true } })
      return subscribers.map(({ email }: { email: string }) => email.trim().toLowerCase())
    } catch (error) {
      console.error('Failed to read subscribers from database:', error)
      return []
    }
  }

  return readLocalSubscriberEmails()
}

function createResendClient() {
  if (!resendApiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable')
  }
  return new Resend(resendApiKey)
}

async function sendEmail(to: string | string[], subject: string, html: string) {
  if (!resendApiKey) {
    console.warn('Skipping email send because RESEND_API_KEY is not configured.')
    return
  }

  const resend = createResendClient()
  await resend.emails.send({
    from: resendFrom,
    to,
    subject,
    html,
  })
}

export async function notifySubscribers(type: 'post' | 'note', title?: string, date?: string) {
  try {
    const subscriberEmails = await getSubscriberEmails()
    if (subscriberEmails.length === 0) return

    const displayTitle = title || (type === 'note' ? 'New Daily Update' : 'New Post')
    const displayDate = date || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .wrapper { background-color: #f4f7f6; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, ${type === 'post' ? '#0070f3, #00a3ff' : '#10b981, #34d399'}); padding: 40px 30px; text-align: center; color: white; }
            .type-badge { display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.3); }
            .title { font-size: 28px; font-weight: 800; margin: 0; line-height: 1.2; }
            .meta { font-size: 14px; opacity: 0.9; margin-top: 10px; font-weight: 500; }
            .body { padding: 40px 30px; text-align: center; }
            .message { font-size: 16px; color: #4b5563; margin-bottom: 30px; }
            .button { display: inline-block; padding: 16px 32px; background-color: ${type === 'post' ? '#0070f3' : '#10b981'}; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; transition: transform 0.2s; }
            .footer { padding: 30px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
            .footer p { margin: 5px 0; }
            .brand { font-weight: 700; color: #374151; font-size: 16px; margin-bottom: 15px; display: block; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <span class="type-badge">${type === 'post' ? 'New Article' : 'Daily Insight'}</span>
                <h1 class="title">${displayTitle}</h1>
                <div class="meta">${displayDate}</div>
              </div>
              <div class="body">
                <p class="message">
                  Hello! I've just shared a new ${type === 'post' ? 'post' : 'update'} on my blog. 
                  Check out the latest thoughts and insights directly on the site.
                </p>
                <a href="${appUrl}" class="button">Read Full ${type === 'post' ? 'Post' : 'Update'}</a>
              </div>
              <div class="footer">
                <span class="brand">Vivek's Blog</span>
                <p>&copy; ${new Date().getFullYear()} Vivek. All rights reserved.</p>
                <p>You're receiving this because you subscribed to my newsletter.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail(
      subscriberEmails,
      `New ${type === 'post' ? 'Post' : 'Note'}: ${displayTitle}`,
      emailHtml
    )
  } catch (error) {
    console.error('Failed to notify subscribers:', error)
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    if (!email) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; }
            .header { border-bottom: 2px solid #0070f3; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0070f3; margin: 0; }
            .content { margin-bottom: 30px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eaeaea; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Thanks for subscribing!</h1>
            </div>
            <div class="content">
              <p>You're now subscribed and will receive updates whenever I publish a new post or note.</p>
              <p>Stay tuned — the next update will be sent to this address.</p>
              <a href="${appUrl}" class="button">Visit the blog</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} My Blog. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    await sendEmail(email, 'Welcome to the blog newsletter!', html)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}
