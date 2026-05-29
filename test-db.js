import { PrismaClient } from './lib/generated/prisma/client/index.js'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function test() {
  try {
    const res = await prisma.subscriber.create({
      data: { email: 'test@example.com' }
    })
    console.log("Success:", res)
  } catch (e) {
    console.error("Error:", e)
  }
}
test()
