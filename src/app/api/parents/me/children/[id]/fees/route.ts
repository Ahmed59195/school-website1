import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FeeStatus } from "@prisma/client"

// T091: GET /api/parents/me/children/[id]/fees - Get child's fees
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id: string; role: string }

    if (user.role !== "PARENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id: childId } = await params

    // Get parent record
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 })
    }

    // Verify parent-child relationship
    const parentStudent = await prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId: parent.id,
          studentId: childId,
        },
      },
    })

    if (!parentStudent) {
      return NextResponse.json(
        { error: "Child not found or not linked to parent" },
        { status: 404 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") as FeeStatus | null

    const fees = await prisma.fee.findMany({
      where: {
        studentId: childId,
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
        stripeSessionId: true,
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
    console.error("Error fetching child fees:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
