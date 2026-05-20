"use server"

import fs from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'

export async function subscribeUser(formData: FormData) {
  const email = formData.get('email') as string
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Invalid email address' }
  }

  // Check if we are in a read-only environment or if we should prefer DB
  const isReadOnly = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

  if (isReadOnly) {
    try {
      const existing = await prisma.subscriber.findUnique({
        where: { email }
      })
      if (existing) {
        return { success: true, message: 'Already subscribed!' }
      }
      await prisma.subscriber.create({
        data: { email }
      })
      return { success: true, message: 'Successfully subscribed!' }
    } catch (e) {
      console.error('Error in subscribeUser (DB):', e)
      return { success: false, message: 'Could not save subscription to database' }
    }
  }

  const subscribersFile = path.join(process.cwd(), 'content', 'subscribers.json')
  
  let subscribers = []
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
    return { success: true, message: 'Successfully subscribed!' }
  } catch (err) {
    return { success: false, message: 'Could not save subscription' }
  }
}
