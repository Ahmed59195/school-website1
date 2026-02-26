import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

// T117: GET /api/admin/users - Get all users with filtering
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
    const role = searchParams.get("role") as Role | null
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const where: any = {}

    if (role) {
      where.role = role
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { student: { firstName: { contains: search, mode: "insensitive" } } },
        { student: { lastName: { contains: search, mode: "insensitive" } } },
        { parent: { firstName: { contains: search, mode: "insensitive" } } },
        { parent: { lastName: { contains: search, mode: "insensitive" } } },
        { teacher: { firstName: { contains: search, mode: "insensitive" } } },
        { teacher: { lastName: { contains: search, mode: "insensitive" } } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          student: {
            select: {
              firstName: true,
              lastName: true,
              gradeLevel: true,
              profileImage: true,
            },
          },
          parent: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          teacher: {
            select: {
              firstName: true,
              lastName: true,
              subject: true,
              profileImage: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    // Get role counts
    const roleCounts = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
    })

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      roleCounts: roleCounts.reduce(
        (acc, item) => {
          acc[item.role] = item._count
          return acc
        },
        {} as Record<string, number>
      ),
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
