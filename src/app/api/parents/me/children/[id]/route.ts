import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// T088: GET /api/parents/me/children/[id] - Get specific child details
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
      select: {
        relationship: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gradeLevel: true,
            rollNumber: true,
            dateOfBirth: true,
            phone: true,
            address: true,
            profileImage: true,
            createdAt: true,
            user: {
              select: { email: true },
            },
          },
        },
      },
    })

    if (!parentStudent) {
      return NextResponse.json(
        { error: "Child not found or not linked to parent" },
        { status: 404 }
      )
    }

    const { student, relationship } = parentStudent

    return NextResponse.json({
      ...student,
      email: student.user.email,
      relationship,
      user: undefined,
    })
  } catch (error) {
    console.error("Error fetching child:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
