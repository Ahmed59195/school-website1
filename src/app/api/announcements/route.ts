import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    })

    const formattedAnnouncements = announcements.map((a) => ({
      id: a.id,
      title: a.title,
      href: `/news#announcement-${a.id}`,
    }))

    return NextResponse.json({ announcements: formattedAnnouncements })
  } catch (error) {
    console.error("Failed to fetch announcements:", error)
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    )
  }
}
