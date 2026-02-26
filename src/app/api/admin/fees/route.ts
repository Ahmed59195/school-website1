import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FeeStatus } from "@prisma/client"

// T118: GET /api/admin/fees - Get all fees with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id: string; role: string }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") as FeeStatus | null
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { student: { firstName: { contains: search, mode: "insensitive" } } },
        { student: { lastName: { contains: search, mode: "insensitive" } } },
        { student: { rollNumber: { contains: search, mode: "insensitive" } } },
      ]
    }

    const [fees, total] = await Promise.all([
      prisma.fee.findMany({
        where,
        orderBy: { dueDate: "desc" },
        skip,
        take: limit,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              rollNumber: true,
              gradeLevel: true,
            },
          },
        },
      }),
      prisma.fee.count({ where }),
    ])

    // Get aggregate stats
    const [statusCounts, totals] = await Promise.all([
      prisma.fee.groupBy({
        by: ["status"],
        _count: true,
        _sum: { amount: true, paidAmount: true },
      }),
      prisma.fee.aggregate({
        _sum: { amount: true, paidAmount: true },
      }),
    ])

    return NextResponse.json({
      fees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalAmount: totals._sum.amount || 0,
        collectedAmount: totals._sum.paidAmount || 0,
        pendingAmount: (totals._sum.amount || 0) - (totals._sum.paidAmount || 0),
        byStatus: statusCounts.reduce(
          (acc, item) => {
            acc[item.status] = {
              count: item._count,
              amount: item._sum.amount || 0,
              paid: item._sum.paidAmount || 0,
            }
            return acc
          },
          {} as Record<string, { count: number; amount: number; paid: number }>
        ),
      },
    })
  } catch (error) {
    console.error("Error fetching fees:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
