import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// T136: GET /api/events - Get events with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const upcoming = searchParams.get("upcoming") === "true"
    const category = searchParams.get("category")
    const month = searchParams.get("month")
    const year = searchParams.get("year")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: any = {
      isPublic: true,
    }

    if (upcoming) {
      where.startDate = { gte: new Date() }
    }

    if (category) {
      where.category = category
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      where.startDate = {
        gte: startDate,
        lte: endDate,
      }
    } else if (year) {
      const startDate = new Date(parseInt(year), 0, 1)
      const endDate = new Date(parseInt(year), 11, 31)
      where.startDate = {
        gte: startDate,
        lte: endDate,
      }
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startDate: upcoming ? "asc" : "desc" },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    // Get unique categories
    const categories = await prisma.event.findMany({
      where: { isPublic: true },
      select: { category: true },
      distinct: ["category"],
    })

    return NextResponse.json({
      events,
      categories: categories.map((c) => c.category).filter(Boolean),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
