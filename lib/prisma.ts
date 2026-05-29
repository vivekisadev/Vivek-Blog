import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

declare global {
  var prismaInstance: undefined | PrismaClient
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // Wait 10s for Neon cold start
  idleTimeoutMillis: 30000,
  max: 15,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
})
const adapter = new PrismaPg(pool)
const prisma = globalThis.prismaInstance ?? new PrismaClient({ adapter })

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaInstance = prisma
