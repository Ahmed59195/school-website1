import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Users, ClipboardCheck, GraduationCap, Calendar } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

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
    title: classRecord ? `${classRecord.name} - ${classRecord.subject}` : "Class Details",
    description: "Manage your class, attendance, and grades",
  }
}

async function getClassData(teacherId: string, classId: string) {
  const classRecord = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      teacher: {
        select: { id: true, firstName: true, lastName: true },
      },
      _count: {
        select: { grades: true, attendance: true },
      },
    },
  })

  if (!classRecord || classRecord.teacherId !== teacherId) {
    return null
  }

  // Get students in this class (from attendance records or by grade level)
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

  // Get recent attendance dates
  const recentAttendance = await prisma.attendance.findMany({
    where: { classId },
    orderBy: { date: "desc" },
    take: 5,
    distinct: ["date"],
    select: {
      date: true,
    },
  })

  // Get recent grades
  const recentGrades = await prisma.grade.findMany({
    where: { classId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      assessmentName: true,
      term: true,
      createdAt: true,
    },
    distinct: ["assessmentName"],
  })

  return {
    class: classRecord,
    students,
    recentAttendance,
    recentGrades,
  }
}

export default async function ClassDetailPage({ params }: PageProps) {
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

  const { class: classRecord, students, recentAttendance, recentGrades } = data

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/teacher">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Class Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{classRecord.name}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary">{classRecord.subject}</Badge>
                <Badge variant="outline">Grade {classRecord.grade}</Badge>
                <Badge variant="outline">Section {classRecord.section}</Badge>
                <Badge variant="outline">{classRecord.academicYear}</Badge>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/teacher/class/${classId}/attendance`}>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Mark Attendance
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/teacher/class/${classId}/grades`}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Enter Grades
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled in class</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classRecord._count.attendance}</div>
            <p className="text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Grade Entries</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classRecord._count.grades}</div>
            <p className="text-xs text-muted-foreground">Total entries</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Class Roster
            </CardTitle>
            <CardDescription>{students.length} students</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No students enrolled
              </p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.profileImage || ""} />
                      <AvatarFallback>
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Roll: {student.rollNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAttendance.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No attendance records yet
                </p>
              ) : (
                <div className="space-y-2">
                  {recentAttendance.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <span className="font-medium">
                        {format(new Date(record.date), "EEEE, MMM d, yyyy")}
                      </span>
                      <Badge variant="secondary">Recorded</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Recent Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentGrades.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No assessments graded yet
                </p>
              ) : (
                <div className="space-y-2">
                  {recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div>
                        <p className="font-medium">{grade.assessmentName}</p>
                        <p className="text-sm text-muted-foreground">{grade.term}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(grade.createdAt), "MMM d")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
