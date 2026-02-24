import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "6", 10)

    const testimonials = await prisma.testimonial.findMany({
      where: {
        isActive: true,
      },
      orderBy: { order: "asc" },
      take: limit,
      select: {
        id: true,
        content: true,
        name: true,
        role: true,
        image: true,
      },
    })

    // Map to frontend expected format
    const formattedTestimonials = testimonials.map((t) => ({
      id: t.id,
      content: t.content,
      authorName: t.name,
      authorRole: t.role,
      authorImage: t.image,
    }))

    return NextResponse.json({ testimonials: formattedTestimonials })
  } catch (error) {
    console.error("Failed to fetch testimonials:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}
