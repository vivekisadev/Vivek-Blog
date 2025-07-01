"use server"

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { Note } from "@/types/note";

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
  
  if (!fs.existsSync(notesDirectory)) {
    fs.mkdirSync(notesDirectory, { recursive: true })
    notesCache = { notes: [], lastUpdated: Date.now() }
    return []
  }

  const fileNames = fs.readdirSync(notesDirectory)

  const allNotes = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(notesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const matterResult = matter(fileContents)
      
      const id = fileName.replace(/\.md$/, "")

      return {
        id,
        content: matterResult.content,
        date: matterResult.data.date || new Date().toISOString(),
      }
    })
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1))

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
