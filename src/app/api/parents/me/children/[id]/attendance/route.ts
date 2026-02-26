import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// T089: GET /api/parents/me/children/[id]/attendance - Get child's attendance
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id: string; role: string }

    if (user.role !== "PARENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id: childId } = await params

    // Get parent record
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 })
    }

    // Verify parent-child relationship
    const parentStudent = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId: parent.id,
          studentId: childId,
        },
      },
    })

    if (!parentStudent) {
      return NextResponse.json(
        { error: "Child not found or not linked to parent" },
        { status: 404 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {}
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      dateFilter.gte = startDate
      dateFilter.lte = endDate
    } else if (year) {
      const startDate = new Date(parseInt(year), 0, 1)
      const endDate = new Date(parseInt(year), 11, 31)
      dateFilter.gte = startDate
      dateFilter.lte = endDate
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: childId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        status: true,
        remarks: true,
        class: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
      },
    })

    // Calculate summary
    const summary = {
      total: attendance.length,
      present: attendance.filter((a) => a.status === "PRESENT").length,
      absent: attendance.filter((a) => a.status === "ABSENT").length,
      late: attendance.filter((a) => a.status === "LATE").length,
      excused: attendance.filter((a) => a.status === "EXCUSED").length,
    }

    return NextResponse.json({
      records: attendance,
      summary,
    })
  } catch (error) {
    console.error("Error fetching child attendance:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
