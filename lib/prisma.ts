import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

declare global {
  var prisma: undefined | PrismaClient
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = globalThis.prisma ?? new PrismaClient({ adapter })

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
