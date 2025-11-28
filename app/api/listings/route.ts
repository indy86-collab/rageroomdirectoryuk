import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin()
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description || !body.city || !body.postcode) {
      return NextResponse.json(
        { error: "Name, description, city, and postcode are required" },
        { status: 400 }
      )
    }

    // Get current admin user
    const { getCurrentUser } = await import("@/lib/auth")
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Prepare location data
    const location = body.location || { lat: 0, lng: 0 }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        name: body.name.trim(),
        description: body.description.trim(),
        city: body.city.trim(),
        region: body.region?.trim() || "",
        postcode: body.postcode.trim(),
        website: body.website || null,
        phone: body.phone || null,
        price: body.price ? parseFloat(body.price) : null,
        image: body.image || null,
        verified: body.verified === true,
        location: location,
        ownerId: user.id,
      },
    })

    return NextResponse.json(
      { message: "Listing created successfully", listing },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating listing:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while creating the listing" },
      { status: 500 }
    )
  }
}



