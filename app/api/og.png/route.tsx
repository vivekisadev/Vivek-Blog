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
            padding: "80px",
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
                paddingRight: "40px",
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
                  fontSize: title.length > 70 ? 48 : title.length > 45 ? 56 : 72,
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
                  display: "flex",
                  alignItems: "center",
                  gap: "32px",
                  marginTop: 32,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    color: "#0969da", // GitHub blue link
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
                
                {/* Metadata (Reading Time) */}
                {readingTime && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#656d76",
                      fontSize: 24,
                    }}
                  >
                    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
                      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-4a.75.75 0 0 1 .75.75v3.5l2.06 1.03a.75.75 0 1 1-.67 1.34l-2.5-1.25a.75.75 0 0 1-.33-.67v-4A.75.75 0 0 1 8 4Z" />
                    </svg>
                    <span>{readingTime} min read</span>
                  </div>
                )}
              </div>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={new URL("/viveklogo.jpg", req.url).toString()}
                alt="Vivek Logo"
                style={{ width: "140px", height: "140px", objectFit: "cover" }}
              />
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
              paddingTop: "32px",
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
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#f4f5f6",
                  border: "1px solid #e1e4e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={new URL("/viveklogo.jpg", req.url).toString()}
                  alt="Vivek Logo"
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
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
