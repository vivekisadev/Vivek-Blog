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
  } catch (err) {
    return { success: false, message: 'Failed to save image' }
  }
}
