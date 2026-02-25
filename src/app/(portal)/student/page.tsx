import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import {
  GraduationCap,
  UserCheck,
  CreditCard,
  BookOpen,
} from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardCard } from "@/components/portal/dashboard-card"
import { AttendanceSummary } from "@/components/portal/attendance-summary"
import { GradesTable } from "@/components/portal/grades-table"
import { EventsWidget } from "@/components/portal/events-widget"
import { FeesWidget } from "@/components/portal/fees-widget"

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "View your attendance, grades, and upcoming events",
}

async function getStudentData(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      grades: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { class: true },
      },
      fees: {
        orderBy: { dueDate: "asc" },
        where: {
          OR: [
            { status: "PENDING" },
            { status: "OVERDUE" },
            { status: "PARTIAL" },
          ],
        },
        take: 3,
      },
      attendance: {
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), 0, 1), // This year
          },
        },
      },
    },
  })

  return student
}

async function getUpcomingEvents() {
  const events = await prisma.event.findMany({
    where: {
      startDate: { gte: new Date() },
      isPublic: true,
    },
    orderBy: { startDate: "asc" },
    take: 3,
  })

  return events
}

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "STUDENT") {
    redirect("/login")
  }

  const userId = (session.user as any).id as string
  const [student, events] = await Promise.all([
    getStudentData(userId),
    getUpcomingEvents(),
  ])

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Student Profile Not Found</h2>
          <p className="text-muted-foreground mt-2">
            Please contact the administrator.
          </p>
        </div>
      </div>
    )
  }

  // Calculate attendance stats
  const attendanceStats = {
    present: student.attendance.filter((a) => a.status === "PRESENT").length,
    absent: student.attendance.filter((a) => a.status === "ABSENT").length,
    late: student.attendance.filter((a) => a.status === "LATE").length,
    excused: student.attendance.filter((a) => a.status === "EXCUSED").length,
    total: student.attendance.length,
  }

  // Format grades for the table
  const recentGrades = student.grades.map((grade) => ({
    id: grade.id,
    subject: grade.subject,
    assessmentName: grade.assessmentName,
    score: grade.score,
    maxScore: grade.maxScore,
    grade: grade.grade || "-",
    term: grade.term,
  }))

  // Format fees
  const pendingFees = student.fees.map((fee) => ({
    id: fee.id,
    description: fee.description,
    amount: fee.amount,
    dueDate: fee.dueDate,
    status: fee.status as "PENDING" | "PAID" | "OVERDUE" | "PARTIAL",
    paidAmount: fee.paidAmount,
  }))

  // Calculate GPA (simplified)
  const avgScore = student.grades.length > 0
    ? Math.round(
        student.grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
          student.grades.length
      )
    : 0

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {student.firstName}!
        </h1>
        <p className="text-muted-foreground">
          {student.gradeLevel} | Roll No: {student.rollNumber}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Attendance Rate"
          value={`${attendanceStats.total > 0 ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0}%`}
          description={`${attendanceStats.present} of ${attendanceStats.total} days`}
          icon={UserCheck}
        />
        <DashboardCard
          title="Average Score"
          value={`${avgScore}%`}
          description="Across all subjects"
          icon={GraduationCap}
        />
        <DashboardCard
          title="Pending Fees"
          value={pendingFees.length.toString()}
          description={pendingFees.length > 0 ? "Payments due" : "All cleared"}
          icon={CreditCard}
        />
        <DashboardCard
          title="Total Subjects"
          value={new Set(student.grades.map((g) => g.subject)).size.toString()}
          description="This term"
          icon={BookOpen}
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance Summary */}
        <AttendanceSummary data={attendanceStats} />

        {/* Upcoming Events */}
        <EventsWidget events={events} />
      </div>

      {/* Grades and Fees */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Grades */}
        <GradesTable grades={recentGrades} />

        {/* Fee Status */}
        <FeesWidget fees={pendingFees} />
      </div>
    </div>
  )
}
