import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// T101: GET /api/teachers/me/classes/[id]/students - Get students in a class
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

    if (user.role !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id: classId } = await params

    // Get teacher record
    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    // Verify teacher owns this class
    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
      select: { id: true, teacherId: true, name: true, grade: true, section: true, subject: true },
    })

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    if (classRecord.teacherId !== teacher.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get unique students from attendance or grades for this class
    // In a real app, you'd have a ClassStudent junction table
    // For now, we'll get students from attendance records
    const studentIds = await prisma.attendance.findMany({
      where: { classId },
      select: { studentId: true },
      distinct: ["studentId"],
    })

    // If no attendance records, try grades
    let allStudentIds = studentIds.map((s) => s.studentId)
    if (allStudentIds.length === 0) {
      const gradeStudentIds = await prisma.grade.findMany({
        where: { classId },
        select: { studentId: true },
        distinct: ["studentId"],
      })
      allStudentIds = gradeStudentIds.map((s) => s.studentId)
    }

    // If still empty, get all students in this grade level
    let students
    if (allStudentIds.length === 0) {
      students = await prisma.student.findMany({
        where: { gradeLevel: classRecord.grade },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          profileImage: true,
          gradeLevel: true,
        },
        orderBy: { rollNumber: "asc" },
      })
    } else {
      students = await prisma.student.findMany({
        where: { id: { in: allStudentIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          profileImage: true,
          gradeLevel: true,
        },
        orderBy: { rollNumber: "asc" },
      })
    }

    return NextResponse.json({
      class: classRecord,
      students,
    })
  } catch (error) {
    console.error("Error fetching class students:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
