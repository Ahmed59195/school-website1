import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// T090: GET /api/parents/me/children/[id]/grades - Get child's grades
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
    const term = searchParams.get("term")
    const subject = searchParams.get("subject")

    const grades = await prisma.grade.findMany({
      where: {
        studentId: childId,
        ...(term && { term }),
        ...(subject && { subject }),
      },
      orderBy: [{ term: "desc" }, { subject: "asc" }],
      select: {
        id: true,
        subject: true,
        assessmentName: true,
        score: true,
        maxScore: true,
        grade: true,
        term: true,
        year: true,
        remarks: true,
        createdAt: true,
        class: {
          select: {
            id: true,
            name: true,
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    // Calculate GPA if available
    const gradePoints: Record<string, number> = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      F: 0.0,
    }

    const gradesWithPoints = grades.filter((g) => g.grade && gradePoints[g.grade])
    const gpa =
      gradesWithPoints.length > 0
        ? gradesWithPoints.reduce((sum, g) => sum + (gradePoints[g.grade] || 0), 0) /
          gradesWithPoints.length
        : null

    // Group by subject for summary
    const subjectSummary = grades.reduce(
      (acc, g) => {
        if (!acc[g.subject]) {
          acc[g.subject] = { total: 0, count: 0, latestGrade: g.grade }
        }
        acc[g.subject].total += (g.score / g.maxScore) * 100
        acc[g.subject].count += 1
        return acc
      },
      {} as Record<string, { total: number; count: number; latestGrade: string | null }>
    )

    const averageBySubject = Object.entries(subjectSummary).map(([subject, data]) => ({
      subject,
      average: Math.round(data.total / data.count),
      latestGrade: data.latestGrade,
    }))

    return NextResponse.json({
      grades,
      summary: {
        gpa: gpa ? Math.round(gpa * 100) / 100 : null,
        totalAssessments: grades.length,
        averageBySubject,
      },
    })
  } catch (error) {
    console.error("Error fetching child grades:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
