import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// T104: GET & POST /api/teachers/me/classes/[id]/grades - Get or enter grades for a class
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
      select: { id: true, teacherId: true, name: true, subject: true, grade: true },
    })

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    if (classRecord.teacherId !== teacher.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const term = searchParams.get("term")
    const assessmentName = searchParams.get("assessment")

    const grades = await prisma.grade.findMany({
      where: {
        classId,
        ...(term && { term }),
        ...(assessmentName && { assessmentName }),
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            profileImage: true,
          },
        },
      },
      orderBy: [{ term: "desc" }, { assessmentName: "asc" }, { student: { rollNumber: "asc" } }],
    })

    // Group by assessment
    const groupedByAssessment = grades.reduce(
      (acc, grade) => {
        const key = `${grade.term}-${grade.assessmentName}`
        if (!acc[key]) {
          acc[key] = {
            term: grade.term,
            assessmentName: grade.assessmentName,
            maxScore: grade.maxScore,
            year: grade.year,
            grades: [],
          }
        }
        acc[key].grades.push(grade)
        return acc
      },
      {} as Record<string, { term: string; assessmentName: string; maxScore: number; year: number; grades: typeof grades }>
    )

    // Calculate statistics
    const stats = Object.values(groupedByAssessment).map((assessment) => {
      const scores = assessment.grades.map((g) => g.score)
      return {
        term: assessment.term,
        assessmentName: assessment.assessmentName,
        maxScore: assessment.maxScore,
        studentCount: assessment.grades.length,
        average: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
        highest: scores.length > 0 ? Math.max(...scores) : 0,
        lowest: scores.length > 0 ? Math.min(...scores) : 0,
      }
    })

    return NextResponse.json({
      class: classRecord,
      assessments: Object.values(groupedByAssessment),
      stats,
      total: grades.length,
    })
  } catch (error) {
    console.error("Error fetching class grades:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
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
      select: { id: true, teacherId: true, subject: true },
    })

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    if (classRecord.teacherId !== teacher.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { assessmentName, maxScore, term, year, records } = body as {
      assessmentName: string
      maxScore: number
      term: string
      year: number
      records: Array<{ studentId: string; score: number; grade: string; remarks?: string }>
    }

    if (!assessmentName || !maxScore || !term || !year || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    // Create grade records
    const createPromises = records.map((record) =>
      prisma.grade.create({
        data: {
          studentId: record.studentId,
          classId,
          subject: classRecord.subject,
          assessmentName,
          score: record.score,
          maxScore,
          grade: record.grade,
          term,
          year,
          remarks: record.remarks,
        },
      })
    )

    const results = await Promise.all(createPromises)

    // Create notifications for students and parents
    const students = await prisma.student.findMany({
      where: { id: { in: records.map((r) => r.studentId) } },
      include: {
        user: true,
        parentLinks: {
          include: {
            parent: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })

    const notificationPromises: Promise<any>[] = []

    students.forEach((student) => {
      const record = records.find((r) => r.studentId === student.id)
      if (!record) return

      // Notify student
      notificationPromises.push(
        prisma.notification.create({
          data: {
            userId: student.userId,
            title: "New Grade Posted",
            message: `Your grade for ${assessmentName} in ${classRecord.subject} has been posted: ${record.grade}`,
            type: "GRADE",
          },
        })
      )

      // Notify parents
      student.parentLinks.forEach((link) => {
        notificationPromises.push(
          prisma.notification.create({
            data: {
              userId: link.parent.userId,
              title: "Grade Update",
              message: `${student.firstName}'s grade for ${assessmentName} in ${classRecord.subject}: ${record.grade}`,
              type: "GRADE",
            },
          })
        )
      })
    })

    await Promise.all(notificationPromises)

    return NextResponse.json({
      message: "Grades saved successfully",
      count: results.length,
    })
  } catch (error) {
    console.error("Error saving grades:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
