import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const category = searchParams.get("category")

    const skip = (page - 1) * limit

    const where = {
      published: true,
      ...(category && { category }),
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip,
        select: {
          id: true,
          title: true,
          excerpt: true,
          category: true,
          publishedAt: true,
          coverImage: true,
          slug: true,
        },
      }),
      prisma.news.count({ where }),
    ])

    // Map coverImage to imageUrl for frontend compatibility
    const formattedNews = news.map((item) => ({
      ...item,
      imageUrl: item.coverImage,
    }))

    return NextResponse.json({
      news: formattedNews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Failed to fetch news:", error)
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    )
  }
}
