import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { AttendanceForm } from "@/components/forms/attendance-form"

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ date?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const classRecord = await prisma.class.findUnique({
    where: { id },
    select: { name: true, subject: true },
  })

  return {
    title: classRecord ? `Attendance - ${classRecord.name}` : "Mark Attendance",
    description: "Mark attendance for your class",
  }
}

async function getClassData(teacherId: string, classId: string, date: Date) {
  const classRecord = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      name: true,
      grade: true,
      section: true,
      subject: true,
      teacherId: true,
    },
  })

  if (!classRecord || classRecord.teacherId !== teacherId) {
    return null
  }

  // Get students in this class
  const studentIds = await prisma.attendance.findMany({
    where: { classId },
    select: { studentId: true },
    distinct: ["studentId"],
  })

  let students
  if (studentIds.length > 0) {
    students = await prisma.student.findMany({
      where: { id: { in: studentIds.map((s) => s.studentId) } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rollNumber: true,
        profileImage: true,
      },
      orderBy: { rollNumber: "asc" },
    })
  } else {
    // Fallback to students in this grade level
    students = await prisma.student.findMany({
      where: { gradeLevel: classRecord.grade },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        rollNumber: true,
        profileImage: true,
      },
      orderBy: { rollNumber: "asc" },
    })
  }

  // Get existing attendance for this date
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const existingAttendance = await prisma.attendance.findMany({
    where: {
      classId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    select: {
      studentId: true,
      status: true,
    },
  })

  return {
    class: classRecord,
    students,
    existingAttendance,
  }
}

export default async function AttendancePage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "TEACHER") {
    redirect("/login")
  }

  const userId = (session.user as any).id as string
  const { id: classId } = await params
  const { date: dateStr } = await searchParams

  // Get teacher record
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!teacher) {
    redirect("/login")
  }

  const selectedDate = dateStr ? new Date(dateStr) : new Date()
  const data = await getClassData(teacher.id, classId, selectedDate)

  if (!data) {
    notFound()
  }

  const { class: classRecord, students, existingAttendance } = data

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/teacher/class/${classId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Class
          </Link>
        </Button>
      </div>

      {/* Attendance Form */}
      <AttendanceForm
        classId={classId}
        className={`${classRecord.name} - ${classRecord.subject}`}
        date={selectedDate}
        students={students}
        existingAttendance={existingAttendance}
      />
    </div>
  )
}
