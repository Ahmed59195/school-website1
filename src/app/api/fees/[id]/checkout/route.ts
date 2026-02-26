import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const feeId = id

    // Get the fee record
    const fee = await prisma.fee.findUnique({
      where: { id: feeId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!fee) {
      return NextResponse.json({ error: "Fee not found" }, { status: 404 })
    }

    // Check authorization - user must be the student or parent
    const userRole = (session.user as { role?: string }).role
    const userId = (session.user as { id?: string }).id

    if (userRole === "STUDENT") {
      if (fee.student.userId !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    } else if (userRole === "PARENT") {
      // Check if this parent is linked to the student
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: {
          children: {
            where: { studentId: fee.studentId },
          },
        },
      })

      if (!parent || parent.children.length === 0) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    } else if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if fee is already paid
    if (fee.status === "PAID") {
      return NextResponse.json(
        { error: "Fee has already been paid" },
        { status: 400 }
      )
    }

    // Calculate remaining amount
    const remainingAmount = fee.amount - fee.paidAmount

    if (remainingAmount <= 0) {
      return NextResponse.json(
        { error: "No remaining balance to pay" },
        { status: 400 }
      )
    }

    // Get the base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      feeId: fee.id,
      studentName: `${fee.student.firstName} ${fee.student.lastName}`,
      feeDescription: fee.description,
      amount: remainingAmount,
      studentId: fee.studentId,
      successUrl: `${baseUrl}/portal/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/portal/payment/cancelled?fee_id=${fee.id}`,
    })

    // Update fee with Stripe session ID
    await prisma.fee.update({
      where: { id: feeId },
      data: {
        stripeSessionId: checkoutSession.id,
      },
    })

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
