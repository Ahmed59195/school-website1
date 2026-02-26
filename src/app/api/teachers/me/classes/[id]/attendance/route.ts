import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AttendanceStatus } from "@prisma/client"

// T102: GET /api/teachers/me/classes/[id]/attendance - Get attendance for a class
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
      select: { id: true, teacherId: true, name: true, subject: true },
    })

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    if (classRecord.teacherId !== teacher.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const dateStr = searchParams.get("date")

    // Build date filter
    let dateFilter: { gte?: Date; lte?: Date } = {}
    if (dateStr) {
      const date = new Date(dateStr)
      dateFilter = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      }
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        classId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
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
      orderBy: [{ date: "desc" }, { student: { rollNumber: "asc" } }],
    })

    // Group by date
    const groupedByDate = attendance.reduce(
      (acc, record) => {
        const dateKey = record.date.toISOString().split("T")[0]
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(record)
        return acc
      },
      {} as Record<string, typeof attendance>
    )

    return NextResponse.json({
      class: classRecord,
      attendance: groupedByDate,
      total: attendance.length,
    })
  } catch (error) {
    console.error("Error fetching class attendance:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// T103: POST /api/teachers/me/classes/[id]/attendance - Mark attendance for a class
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
      select: { id: true, teacherId: true },
    })

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    if (classRecord.teacherId !== teacher.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { date, records } = body as {
      date: string
      records: Array<{ studentId: string; status: AttendanceStatus; remarks?: string }>
    }

    if (!date || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    // Upsert attendance records
    const upsertPromises = records.map((record) =>
      prisma.attendance.upsert({
        where: {
          studentId_classId_date: {
            studentId: record.studentId,
            classId,
            date: attendanceDate,
          },
        },
        create: {
          studentId: record.studentId,
          classId,
          date: attendanceDate,
          status: record.status,
          remarks: record.remarks,
        },
        update: {
          status: record.status,
          remarks: record.remarks,
        },
      })
    )

    const results = await Promise.all(upsertPromises)

    // Create notifications for absent students
    const absentRecords = records.filter((r) => r.status === "ABSENT")
    if (absentRecords.length > 0) {
      const students = await prisma.student.findMany({
        where: { id: { in: absentRecords.map((r) => r.studentId) } },
        include: {
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

      const notificationPromises = students.flatMap((student) =>
        student.parentLinks.map((link) =>
          prisma.notification.create({
            data: {
              userId: link.parent.userId,
              title: "Attendance Alert",
              message: `${student.firstName} ${student.lastName} was marked absent on ${attendanceDate.toLocaleDateString()}`,
              type: "ATTENDANCE",
            },
          })
        )
      )

      await Promise.all(notificationPromises)
    }

    return NextResponse.json({
      message: "Attendance saved successfully",
      count: results.length,
    })
  } catch (error) {
    console.error("Error saving attendance:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
