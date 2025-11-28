import { NextRequest, NextResponse } from "next/server"

// Lazy load Prisma to avoid build-time initialization
function getPrisma() {
  return require("@/lib/prisma").prisma
}

// Lazy load auth functions to avoid build-time initialization
async function requireAdmin() {
  const { requireAdmin: reqAdmin } = await import("@/lib/auth")
  return reqAdmin()
}

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const runtime = 'nodejs'
export const revalidate = 0

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    // Ensure user is admin
    const { requireAdmin: reqAdmin } = await import("@/lib/auth")
    await reqAdmin()
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const listingId = id

    // Check if listing exists
    const prisma = getPrisma()
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    // Validate required fields if provided
    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json(
        { error: "Name cannot be empty" },
        { status: 400 }
      )
    }
    if (body.description !== undefined && !body.description.trim()) {
      return NextResponse.json(
        { error: "Description cannot be empty" },
        { status: 400 }
      )
    }
    if (body.city !== undefined && !body.city.trim()) {
      return NextResponse.json(
        { error: "City cannot be empty" },
        { status: 400 }
      )
    }
    if (body.postcode !== undefined && !body.postcode.trim()) {
      return NextResponse.json(
        { error: "Postcode cannot be empty" },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.description !== undefined)
      updateData.description = body.description.trim()
    if (body.city !== undefined) updateData.city = body.city.trim()
    if (body.region !== undefined) updateData.region = body.region.trim()
    if (body.postcode !== undefined) updateData.postcode = body.postcode.trim()
    if (body.website !== undefined)
      updateData.website = body.website?.trim() || null
    if (body.phone !== undefined) updateData.phone = body.phone?.trim() || null
    if (body.price !== undefined)
      updateData.price = body.price ? parseFloat(body.price) : null
    if (body.image !== undefined) updateData.image = body.image?.trim() || null
    if (body.verified !== undefined) updateData.verified = body.verified === true
    if (body.location !== undefined) updateData.location = body.location

    // Update listing
    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: updateData,
    })

    return NextResponse.json(
      { message: "Listing updated successfully", listing },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating listing:", error)
    return NextResponse.json(
      { error: error.message || "An error occurred while updating the listing" },
      { status: 500 }
    )
  }
}



