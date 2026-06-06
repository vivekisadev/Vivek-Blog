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
      : "Vivek's Blog"
      
    const date = searchParams.get("date") || ""
    const readingTime = searchParams.get("readingTime") || ""
    
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            backgroundColor: "#ffffff",
            padding: "60px",
            fontFamily: "Inter, sans-serif",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top Row: Repo/Blog name and Large Icon */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: 32,
                color: "#656d76", // GitHub grey
                display: "flex",
              }}
            >
              vivekisadev / blog
            </div>
            
            {/* Big Avatar/Logo on top right */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                backgroundColor: "#f6f8fa", // Light GitHub grey
                border: "1px solid #d0d7de",
                color: "#24292f",
                fontSize: 64,
                fontWeight: 800,
              }}
            >
              V
            </div>
          </div>

          {/* Title Area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "-80px", // Pull it up a bit since the right icon is tall
              maxWidth: "85%",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "#24292f", // GitHub dark text
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>
            
            {/* Metadata (Comments / Reading Time) */}
            {readingTime && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "32px",
                  color: "#656d76",
                  fontSize: 28,
                }}
              >
                <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
                  <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-4a.75.75 0 0 1 .75.75v3.5l2.06 1.03a.75.75 0 1 1-.67 1.34l-2.5-1.25a.75.75 0 0 1-.33-.67v-4A.75.75 0 0 1 8 4Z" />
                </svg>
                <span>{readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid #d0d7de",
              paddingTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#24292f",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                V
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: "#656d76",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontWeight: 600, color: "#24292f" }}>Vivek Verma</span>
                <span>published on {date}</span>
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
