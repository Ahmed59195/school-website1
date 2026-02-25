import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { Users, FileText, CreditCard, Calendar } from "lucide-react"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardCard } from "@/components/portal/dashboard-card"
import { UserStats } from "@/components/portal/user-stats"
import { ApplicationsTable } from "@/components/portal/applications-table"
import { FeeSummary } from "@/components/portal/fee-summary"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage school operations",
}

async function getAdminStats() {
  const [
    totalUsers,
    studentCount,
    teacherCount,
    parentCount,
    adminCount,
    pendingApplications,
    recentApplications,
    feeStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: "PARENT" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.fee.aggregate({
      _sum: {
        amount: true,
        paidAmount: true,
      },
    }),
  ])

  // Calculate fee stats
  const totalFees = feeStats._sum.amount || 0
  const totalPaid = feeStats._sum.paidAmount || 0
  const totalPending = totalFees - totalPaid

  const overdueCount = await prisma.fee.aggregate({
    where: {
      status: "OVERDUE",
    },
    _sum: {
      amount: true,
      paidAmount: true,
    },
  })

  const totalOverdue = (overdueCount._sum.amount || 0) - (overdueCount._sum.paidAmount || 0)
  const collectionRate = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0

  return {
    totalUsers,
    studentCount,
    teacherCount,
    parentCount,
    adminCount,
    pendingApplications,
    recentApplications,
    feeStats: {
      totalCollected: totalPaid,
      totalPending,
      totalOverdue,
      collectionRate,
    },
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage school operations and monitor key metrics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          description="All registered users"
          icon={Users}
        />
        <DashboardCard
          title="Pending Applications"
          value={stats.pendingApplications.toString()}
          description={stats.pendingApplications > 0 ? "Awaiting review" : "All reviewed"}
          icon={FileText}
        />
        <DashboardCard
          title="Total Students"
          value={stats.studentCount.toString()}
          description="Enrolled students"
          icon={Users}
        />
        <DashboardCard
          title="Collection Rate"
          value={`${stats.feeStats.collectionRate}%`}
          description="Fee collection progress"
          icon={CreditCard}
        />
      </div>

      {/* User Stats and Fee Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UserStats
          totalUsers={stats.totalUsers}
          students={stats.studentCount}
          teachers={stats.teacherCount}
          parents={stats.parentCount}
          admins={stats.adminCount}
        />
        <FeeSummary
          totalCollected={stats.feeStats.totalCollected}
          totalPending={stats.feeStats.totalPending}
          totalOverdue={stats.feeStats.totalOverdue}
          collectionRate={stats.feeStats.collectionRate}
        />
      </div>

      {/* Recent Applications */}
      <ApplicationsTable
        applications={stats.recentApplications.map((app) => ({
          id: app.id,
          applicationNumber: app.applicationNumber,
          studentFirstName: app.studentFirstName,
          studentLastName: app.studentLastName,
          gradeApplying: app.gradeApplying,
          guardianEmail: app.guardianEmail,
          status: app.status as "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | "WAITLISTED",
          createdAt: app.createdAt,
        }))}
      />
    </div>
  )
}
