import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Fallbacks
    const hasTitle = searchParams.has("title")
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "Vivek's Log"
      
    const date = searchParams.get("date") || "Software Engineer"
    
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "80px",
            backgroundColor: "#09090b", // zinc-950
            backgroundImage: "radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              maxWidth: "80%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                color: "#a1a1aa", // zinc-400
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: "-0.05em",
              }}
            >
              <span>{date}</span>
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-0.05em",
              }}
            >
              {title}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              position: "absolute",
              bottom: "80px",
              left: "80px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "24px",
                backgroundColor: "white",
                color: "black",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              V
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ color: "white", fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
                Vivek Verma
              </div>
              <div style={{ color: "#a1a1aa", fontSize: 20 }}>
                blogsbyvivek.vercel.app
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
