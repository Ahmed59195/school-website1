import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// T087: GET /api/parents/me/children - Get all children linked to parent
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id: string; role: string }

    if (user.role !== "PARENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get parent record
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 })
    }

    // Get all children linked to this parent
    const children = await prisma.parentStudent.findMany({
      where: { parentId: parent.id },
      select: {
        relationship: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gradeLevel: true,
            rollNumber: true,
            profileImage: true,
            attendance: {
              where: {
                date: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
              },
              select: { status: true },
            },
            fees: {
              where: {
                status: { in: ["PENDING", "OVERDUE", "PARTIAL"] },
              },
              select: { amount: true, paidAmount: true },
            },
          },
        },
      },
    })

    // Transform data with summary stats
    const childrenWithStats = children.map(({ student, relationship }) => {
      const attendanceStats = {
        present: student.attendance.filter((a) => a.status === "PRESENT").length,
        absent: student.attendance.filter((a) => a.status === "ABSENT").length,
        late: student.attendance.filter((a) => a.status === "LATE").length,
        total: student.attendance.length,
      }

      const pendingFees = student.fees.reduce(
        (sum, f) => sum + (f.amount - f.paidAmount),
        0
      )

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        gradeLevel: student.gradeLevel,
        rollNumber: student.rollNumber,
        profileImage: student.profileImage,
        relationship,
        attendanceThisMonth: attendanceStats,
        pendingFees,
      }
    })

    return NextResponse.json({ children: childrenWithStats })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
