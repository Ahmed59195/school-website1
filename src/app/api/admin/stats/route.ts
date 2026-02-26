import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// T113: GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id: string; role: string }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get counts
    const [
      totalStudents,
      totalParents,
      totalTeachers,
      totalUsers,
      pendingApplications,
      totalApplications,
      pendingFees,
      totalFees,
      newContacts,
      totalNews,
      totalEvents,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.parent.count(),
      prisma.teacher.count(),
      prisma.user.count(),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count(),
      prisma.fee.count({ where: { status: { in: ["PENDING", "OVERDUE"] } } }),
      prisma.fee.count(),
      prisma.contact.count({ where: { status: "NEW" } }),
      prisma.news.count({ where: { published: true } }),
      prisma.event.count({ where: { startDate: { gte: new Date() } } }),
    ])

    // Get fee amounts
    const feeStats = await prisma.fee.aggregate({
      _sum: {
        amount: true,
        paidAmount: true,
      },
    })

    // Get recent activity
    const recentApplications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        applicationNumber: true,
        studentFirstName: true,
        studentLastName: true,
        status: true,
        createdAt: true,
      },
    })

    const recentContacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    })

    // Get monthly registrations (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRegistrations = await prisma.user.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      _count: true,
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        parents: totalParents,
        teachers: totalTeachers,
        admins: totalUsers - totalStudents - totalParents - totalTeachers,
      },
      applications: {
        total: totalApplications,
        pending: pendingApplications,
        recent: recentApplications,
      },
      fees: {
        total: totalFees,
        pending: pendingFees,
        totalAmount: feeStats._sum.amount || 0,
        collectedAmount: feeStats._sum.paidAmount || 0,
        pendingAmount: (feeStats._sum.amount || 0) - (feeStats._sum.paidAmount || 0),
      },
      contacts: {
        new: newContacts,
        recent: recentContacts,
      },
      content: {
        news: totalNews,
        upcomingEvents: totalEvents,
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
