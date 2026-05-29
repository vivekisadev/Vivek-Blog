import { getAllPosts } from "@/app/lib/posts"

export async function GET() {
  const posts = await getAllPosts()
  const site_url = "https://blogsbyvivek.vercel.app"

  const feedItems = posts.map((post) => {
    return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${site_url}/posts/${post.id}</link>
        <guid>${site_url}/posts/${post.id}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt || post.contentHtml.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}]]></description>
      </item>
    `
  }).join("")

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Vivek's Blog</title>
        <link>${site_url}</link>
        <description>Love, code, and write.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${feedItems}
      </channel>
    </rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  })
}
