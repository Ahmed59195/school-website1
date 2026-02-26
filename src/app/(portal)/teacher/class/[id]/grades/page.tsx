import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { GradeEntryForm } from "@/components/forms/grade-entry-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const classRecord = await prisma.class.findUnique({
    where: { id },
    select: { name: true, subject: true },
  })

  return {
    title: classRecord ? `Grades - ${classRecord.name}` : "Enter Grades",
    description: "Enter grades for your class",
  }
}

async function getClassData(teacherId: string, classId: string) {
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

  return {
    class: classRecord,
    students,
  }
}

export default async function GradesPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "TEACHER") {
    redirect("/login")
  }

  const userId = (session.user as any).id as string
  const { id: classId } = await params

  // Get teacher record
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (!teacher) {
    redirect("/login")
  }

  const data = await getClassData(teacher.id, classId)

  if (!data) {
    notFound()
  }

  const { class: classRecord, students } = data

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

      {/* Grade Entry Form */}
      <GradeEntryForm
        classId={classId}
        className={classRecord.name}
        subject={classRecord.subject}
        students={students}
      />
    </div>
  )
}
