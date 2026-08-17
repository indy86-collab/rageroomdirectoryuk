import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

/**
 * Dynamic Open Graph image endpoint.
 *
 * Usage:
 *   /api/og?title=Best%20Rage%20Rooms%20in%20London&subtitle=Top%2010%20Venues%20Ranked&badge=Guide
 *
 * Query params (all optional):
 *   - title:    main headline (max ~80 chars)
 *   - subtitle: secondary line (location / description)
 *   - badge:    small pill text (e.g. "Guide", "City", "Venue")
 *   - price:    pill on the right (e.g. "From £35")
 *
 * Output: 1200x630 PNG, on-brand dark + orange visual.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get("title") || "RageRoom Directory").slice(0, 120)
  const subtitle = (searchParams.get("subtitle") || "UK's largest rage room directory").slice(0, 160)
  const badge = (searchParams.get("badge") || "").slice(0, 40)
  const price = (searchParams.get("price") || "").slice(0, 40)

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(249,115,22,0.25), transparent 50%), radial-gradient(circle at 85% 85%, rgba(234,88,12,0.15), transparent 55%)",
          padding: "70px 80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        {/* Grid texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(0deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* Top row: logo + optional badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                backgroundColor: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: -0.5,
                color: "#0a0a0a",
              }}
            >
              RRD
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
                RAGE ROOM
              </div>
              <div style={{ fontSize: 18, color: "#a3a3a3", marginTop: 4 }}>
                DIRECTORY.CO.UK
              </div>
            </div>
          </div>

          {badge && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 22px",
                borderRadius: 999,
                border: "2px solid #f97316",
                color: "#f97316",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? 66 : 84,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: "#ffffff",
              maxWidth: "92%",
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                marginTop: 28,
                fontSize: 32,
                fontWeight: 500,
                color: "#d4d4d8",
                lineHeight: 1.25,
                maxWidth: "88%",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Bottom row: site URL + price pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 22,
              fontWeight: 600,
              color: "#a3a3a3",
              letterSpacing: 0.5,
            }}
          >
            rageroomdirectory.co.uk
          </div>

          {price && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 26px",
                borderRadius: 12,
                backgroundColor: "#f97316",
                color: "#0a0a0a",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              {price}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
