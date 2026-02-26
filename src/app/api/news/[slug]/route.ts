import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// T135: GET /api/news/[slug] - Get single news article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const news = await prisma.news.findUnique({
      where: { slug, published: true },
    })

    if (!news) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Get related articles (same category, excluding current)
    const related = await prisma.news.findMany({
      where: {
        published: true,
        category: news.category,
        id: { not: news.id },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    })

    return NextResponse.json({ article: news, related })
  } catch (error) {
    console.error("Error fetching news article:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
