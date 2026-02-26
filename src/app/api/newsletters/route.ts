import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// T137: GET /api/newsletters - Get newsletters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const [newsletters, total] = await Promise.all([
      prisma.newsletter.findMany({
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.newsletter.count(),
    ])

    return NextResponse.json({
      newsletters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching newsletters:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
