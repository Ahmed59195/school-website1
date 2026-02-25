import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { BookOpen, Users, ClipboardList, GraduationCap } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardCard } from "@/components/portal/dashboard-card"
import { ClassList } from "@/components/portal/class-list"
import { EventsWidget } from "@/components/portal/events-widget"

export const metadata: Metadata = {
  title: "Teacher Dashboard",
  description: "Manage your classes, attendance, and grades",
}

async function getTeacherData(userId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    include: {
      classes: {
        include: {
          _count: {
            select: { grades: true },
          },
        },
      },
    },
  })

  return teacher
}

async function getClassStudentCounts(classIds: string[]) {
  // Get unique students per class from grades
  const counts: Record<string, number> = {}
  for (const classId of classIds) {
    const studentCount = await prisma.grade.findMany({
      where: { classId },
      distinct: ["studentId"],
      select: { studentId: true },
    })
    counts[classId] = studentCount.length
  }
  return counts
}

async function getUpcomingEvents() {
  const events = await prisma.event.findMany({
    where: {
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: "asc" },
    take: 3,
  })

  return events
}

async function getTodayAttendanceCount(teacherId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const count = await prisma.attendance.count({
    where: {
      class: { teacherId },
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  })

  return count
}

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "TEACHER") {
    redirect("/login")
  }

  const userId = (session.user as any).id as string
  const teacher = await getTeacherData(userId)

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Teacher Profile Not Found</h2>
          <p className="text-muted-foreground mt-2">
            Please contact the administrator.
          </p>
        </div>
      </div>
    )
  }

  const classIds = teacher.classes.map((c) => c.id)
  const [studentCounts, events, todayAttendance] = await Promise.all([
    getClassStudentCounts(classIds),
    getUpcomingEvents(),
    getTodayAttendanceCount(teacher.id),
  ])

  // Format classes for the list
  const classesData = teacher.classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    grade: cls.grade,
    section: cls.section,
    subject: cls.subject,
    studentCount: studentCounts[cls.id] || 0,
  }))

  const totalStudents = Object.values(studentCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {teacher.firstName}!
        </h1>
        <p className="text-muted-foreground">
          {teacher.subject} Teacher
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="My Classes"
          value={teacher.classes.length.toString()}
          description="Assigned classes"
          icon={BookOpen}
        />
        <DashboardCard
          title="Total Students"
          value={totalStudents.toString()}
          description="Across all classes"
          icon={Users}
        />
        <DashboardCard
          title="Today's Attendance"
          value={todayAttendance.toString()}
          description="Records marked today"
          icon={ClipboardList}
        />
        <DashboardCard
          title="Upcoming Events"
          value={events.length.toString()}
          description="School events"
          icon={GraduationCap}
        />
      </div>

      {/* Classes and Events */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClassList classes={classesData} />
        </div>
        <div>
          <EventsWidget events={events} />
        </div>
      </div>
    </div>
  )
}
