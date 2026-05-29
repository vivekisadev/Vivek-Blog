"use server"

import fs from 'fs/promises'
import path from 'path'

export async function uploadImage(formData: FormData) {
  const file = formData.get('image') as File
  if (!file) {
    return { success: false, message: 'No file provided' }
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Check if we are on Vercel or in production (read-only filesystem)
  const isReadOnly = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

  if (isReadOnly) {
    // Fallback: Return as data URL if small enough, or just error with instruction
    // Note: Data URLs are not great for large images, but it's a way to "make it work"
    // without external storage setup.
    if (file.size < 500000) { // 500KB limit for data URL
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`
      return {
        success: true,
        url: dataUrl,
        message: 'Image uploaded as data URL (Fallback)'
      }
    }

    return { 
      success: false, 
      message: 'Server file system is read-only. For production, please configure Vercel Blob or an external storage service. (Image too large for fallback)' 
    }
  }

  // Ensure public/images directory exists
  const imagesDir = path.join(process.cwd(), 'public', 'images')
  try {
    await fs.access(imagesDir)
  } catch {
    await fs.mkdir(imagesDir, { recursive: true })
  }

  // Create a safe unique filename
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath = path.join(imagesDir, filename)

  try {
    await fs.writeFile(filePath, buffer)
    return { 
      success: true, 
      url: `/images/${filename}`,
      message: 'Image uploaded successfully' 
    }
  } catch (err: any) {
    if (err?.code === 'EROFS') {
      return { success: false, message: 'Server file system is read-only. Please use a writable storage service.' }
    }
    return { success: false, message: 'Failed to save image: ' + err.message }
  }
}

import prisma from '@/lib/prisma'

export async function uploadSimulationToDb(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    return { success: false, message: 'No file provided' }
  }

  const bytes = await file.arrayBuffer()
  const content = new TextDecoder().decode(bytes)

  try {
    const simulation = await prisma.simulation.create({
      data: {
        name: file.name,
        content: content,
      }
    })
    return {
      success: true,
      id: simulation.id,
      message: 'Simulation uploaded to DB successfully'
    }
  } catch (err: any) {
    return { success: false, message: 'Failed to save simulation to DB: ' + err.message }
  }
}
