import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FeeStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id: string; role: string }

    if (user.role !== "STUDENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get student ID from user ID
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") as FeeStatus | null

    const fees = await prisma.fee.findMany({
      where: {
        studentId: student.id,
        ...(status && { status }),
      },
      orderBy: { dueDate: "desc" },
      select: {
        id: true,
        description: true,
        amount: true,
        paidAmount: true,
        dueDate: true,
        paidAt: true,
        status: true,
        term: true,
        stripePaymentId: true,
        createdAt: true,
      },
    })

    // Calculate summary
    const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0)
    const totalPaid = fees.reduce((sum, f) => sum + f.paidAmount, 0)
    const totalPending = totalAmount - totalPaid
    const overdueCount = fees.filter((f) => f.status === "OVERDUE").length

    return NextResponse.json({
      fees,
      summary: {
        totalAmount,
        totalPaid,
        totalPending,
        overdueCount,
        pendingCount: fees.filter((f) => f.status === "PENDING" || f.status === "PARTIAL").length,
        paidCount: fees.filter((f) => f.status === "PAID").length,
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
