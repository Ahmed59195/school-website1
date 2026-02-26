import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// T149: GET /api/staff - Get staff directory
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const department = searchParams.get("department")
    const search = searchParams.get("search")

    const where: any = {
      isPublic: true,
    }

    if (department) {
      where.department = department
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { designation: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ]
    }

    const staff = await prisma.staff.findMany({
      where,
      orderBy: [{ department: "asc" }, { order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        designation: true,
        bio: true,
        image: true,
        phone: true,
      },
    })

    // Get unique departments
    const departments = await prisma.staff.findMany({
      where: { isPublic: true },
      select: { department: true },
      distinct: ["department"],
    })

    return NextResponse.json({
      staff,
      departments: departments.map((d) => d.department).sort(),
    })
  } catch (error) {
    console.error("Error fetching staff:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
