const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const post = await prisma.post.findUnique({
    where: { slug: '2026_05_29_jm1cedmki2' }
  })
  if (!post) {
    console.log("Post not found.")
    return
  }
  const snippet = post.content.substring(post.content.indexOf('Open Promises Simulation') - 100, post.content.indexOf('Open Promises Simulation') + 200)
  console.log("MARKDOWN AROUND LINK:\n" + snippet)
}
main().finally(() => prisma.$disconnect())
