import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// T150: GET /api/staff/[id] - Get single staff member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const staff = await prisma.staff.findUnique({
      where: { id, isPublic: true },
    })

    if (!staff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
    }

    // Get colleagues from same department
    const colleagues = await prisma.staff.findMany({
      where: {
        isPublic: true,
        department: staff.department,
        id: { not: staff.id },
      },
      orderBy: { order: "asc" },
      take: 4,
      select: {
        id: true,
        name: true,
        designation: true,
        image: true,
      },
    })

    return NextResponse.json({ staff, colleagues })
  } catch (error) {
    console.error("Error fetching staff member:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
