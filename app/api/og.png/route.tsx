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
          }}
        >
          {/* Top Section (Text on left, Avatar on right) */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Left side content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "75%",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  color: "#656d76", // GitHub grey
                  marginBottom: 24,
                  display: "flex",
                }}
              >
                blogsbyvivek / post
              </div>
              
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  color: "#24292f", // GitHub dark text
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  display: "flex",
                }}
              >
                {title}
              </div>
              
              {searchParams.has("excerpt") && (
                <div
                  style={{
                    fontSize: 32,
                    color: "#656d76",
                    marginTop: 24,
                    lineHeight: 1.4,
                    display: "flex",
                  }}
                >
                  {searchParams.get("excerpt")}
                </div>
              )}
              
              <div
                style={{
                  fontSize: 24,
                  color: "#0969da", // GitHub blue link
                  marginTop: 24,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Read full at the link below
                <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
                  <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z" />
                </svg>
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
            
            {/* Right side: Identicon */}
            <div
              style={{
                display: "flex",
                overflow: "hidden",
                borderRadius: "50%",
                width: "140px",
                height: "140px",
                backgroundColor: "#f4f5f6",
                border: "1px solid #e1e4e8",
              }}
            >
              <svg viewBox="0 0 5 5" width="140" height="140">
                <rect x="0" y="0" width="5" height="5" fill="#f4f5f6" />
                <rect x="1" y="0" width="1" height="5" fill="#a3d242" />
                <rect x="3" y="0" width="1" height="5" fill="#a3d242" />
                <rect x="0" y="1" width="5" height="1" fill="#a3d242" />
                <rect x="0" y="3" width="5" height="1" fill="#a3d242" />
                <rect x="2" y="2" width="1" height="1" fill="#a3d242" />
              </svg>
            </div>
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
              marginTop: "auto",
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
                  backgroundColor: "#a3d242",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <svg viewBox="0 0 5 5" width="40" height="40">
                  <rect x="0" y="0" width="5" height="5" fill="#f4f5f6" />
                  <rect x="1" y="0" width="1" height="5" fill="#a3d242" />
                  <rect x="3" y="0" width="1" height="5" fill="#a3d242" />
                  <rect x="0" y="1" width="5" height="1" fill="#a3d242" />
                  <rect x="0" y="3" width="5" height="1" fill="#a3d242" />
                  <rect x="2" y="2" width="1" height="1" fill="#a3d242" />
                </svg>
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
                <span>published on {date || 'June 6, 2026'}</span>
              </div>
            </div>
            
            {/* GitHub Logo */}
            <div style={{ display: "flex" }}>
              <svg viewBox="0 0 16 16" width="32" height="32" fill="#656d76">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
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
