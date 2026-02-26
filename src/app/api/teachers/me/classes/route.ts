import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// T100: GET /api/teachers/me/classes - Get all classes assigned to teacher
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id: string; role: string }

    if (user.role !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get teacher record
    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    // Get all classes assigned to this teacher
    const classes = await prisma.class.findMany({
      where: { teacherId: teacher.id },
      select: {
        id: true,
        name: true,
        grade: true,
        section: true,
        subject: true,
        academicYear: true,
        _count: {
          select: {
            grades: true,
            attendance: true,
          },
        },
      },
      orderBy: [{ grade: "asc" }, { section: "asc" }],
    })

    // Get student count per class (via attendance or grades relations)
    const classesWithStudentCount = await Promise.all(
      classes.map(async (cls) => {
        const studentCount = await prisma.attendance.groupBy({
          by: ["studentId"],
          where: { classId: cls.id },
        })

        return {
          ...cls,
          studentCount: studentCount.length,
          gradeCount: cls._count.grades,
          attendanceCount: cls._count.attendance,
          _count: undefined,
        }
      })
    )

    return NextResponse.json({ classes: classesWithStudentCount })
  } catch (error) {
    console.error("Error fetching teacher classes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
