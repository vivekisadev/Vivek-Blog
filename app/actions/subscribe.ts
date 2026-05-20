"use server"

import fs from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'
import { sendWelcomeEmail, useDatabase } from '@/lib/notifications'

export async function subscribeUser(formData: FormData) {
  const email = ((formData.get('email') as string) || '').trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Invalid email address' }
  }

  if (useDatabase) {
    try {
      // Basic check for prisma instance
      if (!prisma) {
        throw new Error('Database connection is not available');
      }

      const existing = await prisma.subscriber.findUnique({
        where: { email }
      })

      if (existing) {
        return { success: true, message: 'Already subscribed!' }
      }

      await prisma.subscriber.create({
        data: { email }
      })

      // Send welcome email asynchronously
      sendWelcomeEmail(email).catch(err => {
        console.error('Failed to send welcome email:', err);
      })

      return { success: true, message: 'Successfully subscribed!' }
    } catch (e: any) {
      console.error('Error in subscribeUser (DB):', e)
      return { 
        success: false, 
        message: e?.message?.includes('P2021') 
          ? 'Database table "Subscriber" not found. Please run npx prisma db push.'
          : 'Could not save subscription to database' 
      }
    }
  }

  const subscribersFile = path.join(process.cwd(), 'content', 'subscribers.json')
  
  let subscribers: string[] = []
  try {
    const data = await fs.readFile(subscribersFile, 'utf-8')
    subscribers = JSON.parse(data)
  } catch (e) {
    // File doesn't exist or is empty
  }
  
  if (subscribers.includes(email)) {
    return { success: true, message: 'Already subscribed!' }
  }
  
  subscribers.push(email)
  
  try {
    await fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2))
    sendWelcomeEmail(email).catch(console.error)
    return { success: true, message: 'Successfully subscribed!' }
  } catch (err) {
    return { success: false, message: 'Could not save subscription' }
  }
}
