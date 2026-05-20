"use server"

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"
import { Note } from "@/types/note"
import prisma from "@/lib/prisma"

let notesCache: {
  notes: Note[];
  lastUpdated: number;
} | null = null;

const CACHE_DURATION = 24 * 60 * 60 * 1000 

async function initNotesCache() {
  if (notesCache && Date.now() - notesCache.lastUpdated < CACHE_DURATION) {
    return notesCache.notes;
  }

  const notesDirectory = path.join(process.cwd(), "content/notes")
  const allNotes: Note[] = []

  // 1. Read from local files
  if (fs.existsSync(notesDirectory)) {
    const fileNames = fs.readdirSync(notesDirectory)

    const fileNotes = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map(async (fileName) => {
          const fullPath = path.join(notesDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")
          const matterResult = matter(fileContents)
          
          const id = fileName.replace(/\.md$/, "")

          const processedContent = await remark()
            .use(remarkGfm)
            .use(html, { sanitize: false })
            .process(matterResult.content)

          return {
            id,
            content: processedContent.toString(),
            date: matterResult.data.date || new Date().toISOString(),
          }
        })
    )
    allNotes.push(...fileNotes)
  }

  // 2. Read from Database (Prisma)
  try {
    const dbNotes = await prisma.note.findMany()

    const dbNotesProcessed = await Promise.all(
      dbNotes.map(async (dbNote: any) => {
        const processedContent = await remark()
          .use(remarkGfm)
          .use(html, { sanitize: false })
          .process(dbNote.content)

        return {
          id: dbNote.id.toString(),
          content: processedContent.toString(),
          date: dbNote.createdAt.toISOString(),
          isFromDb: true
        }
      })
    )
    allNotes.push(...dbNotesProcessed)
  } catch (e) {
    console.error('Error fetching notes from database:', e)
  }
  
  allNotes.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1))

  notesCache = {
    notes: allNotes,
    lastUpdated: Date.now()
  }

  return allNotes
}

export async function getPaginatedNotesAction(page: number = 1, pageSize: number = 10) {
  const allNotes = await initNotesCache()
  const start = (page - 1) * pageSize
  const paginatedNotes = allNotes.slice(start, start + pageSize)

  return {
    notes: paginatedNotes,
    total: allNotes.length,
    totalPages: Math.ceil(allNotes.length / pageSize)
  }
}
