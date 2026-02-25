import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { Users, Bell, CreditCard, Calendar } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardCard } from "@/components/portal/dashboard-card"
import { ChildCard } from "@/components/portal/child-card"
import { NotificationsList } from "@/components/portal/notifications-list"
import { EventsWidget } from "@/components/portal/events-widget"

export const metadata: Metadata = {
  title: "Parent Dashboard",
  description: "Monitor your children's academic progress",
}

async function getParentData(userId: string) {
  const parent = await prisma.parent.findUnique({
    where: { userId },
    include: {
      children: {
        include: {
          student: {
            include: {
              attendance: {
                where: {
                  date: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                  },
                },
              },
              fees: {
                where: {
                  status: { in: ["PENDING", "OVERDUE", "PARTIAL"] },
                },
              },
            },
          },
        },
      },
    },
  })

  return parent
}

async function getParentNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return notifications
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

export default async function ParentDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "PARENT") {
    redirect("/login")
  }

  const userId = (session.user as any).id as string
  const [parent, notifications, events] = await Promise.all([
    getParentData(userId),
    getParentNotifications(userId),
    getUpcomingEvents(),
  ])

  if (!parent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Parent Profile Not Found</h2>
          <p className="text-muted-foreground mt-2">
            Please contact the administrator.
          </p>
        </div>
      </div>
    )
  }

  // Calculate stats for children
  const childrenData = parent.children.map((pc) => {
    const student = pc.student
    const totalAttendance = student.attendance.length
    const presentDays = student.attendance.filter((a) => a.status === "PRESENT").length
    const attendanceRate = totalAttendance > 0 ? Math.round((presentDays / totalAttendance) * 100) : 0

    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      gradeLevel: student.gradeLevel,
      rollNumber: student.rollNumber,
      profileImage: student.profileImage,
      attendanceRate,
      pendingFees: student.fees.length,
    }
  })

  const totalPendingFees = childrenData.reduce((sum, child) => sum + child.pendingFees, 0)
  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {parent.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Monitor your children's academic progress
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Children"
          value={childrenData.length.toString()}
          description="Enrolled students"
          icon={Users}
        />
        <DashboardCard
          title="Notifications"
          value={unreadNotifications.toString()}
          description={unreadNotifications > 0 ? "Unread messages" : "All caught up"}
          icon={Bell}
        />
        <DashboardCard
          title="Pending Fees"
          value={totalPendingFees.toString()}
          description={totalPendingFees > 0 ? "Payments due" : "All cleared"}
          icon={CreditCard}
        />
        <DashboardCard
          title="Upcoming Events"
          value={events.length.toString()}
          description="School events"
          icon={Calendar}
        />
      </div>

      {/* Children Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Children</h2>
        {childrenData.length === 0 ? (
          <p className="text-muted-foreground">No children linked to your account.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {childrenData.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        )}
      </div>

      {/* Notifications and Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <NotificationsList
          notifications={notifications.map((n) => ({
            ...n,
            type: n.type as "INFO" | "WARNING" | "SUCCESS" | "FEE" | "GRADE" | "ATTENDANCE",
          }))}
        />
        <EventsWidget events={events} />
      </div>
    </div>
  )
}
