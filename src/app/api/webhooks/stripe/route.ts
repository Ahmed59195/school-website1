import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { constructWebhookEvent } from "@/lib/stripe"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature" },
        { status: 400 }
      )
    }

    // Construct and verify the webhook event
    const event = await constructWebhookEvent(body, signature)

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as {
          id: string
          metadata?: {
            feeId?: string
            studentId?: string
          }
          payment_status: string
          amount_total?: number | null
          payment_intent?: string | null
        }

        if (session.payment_status === "paid") {
          const feeId = session.metadata?.feeId
          const studentId = session.metadata?.studentId

          if (feeId) {
            // Update the fee status
            const fee = await prisma.fee.update({
              where: { id: feeId },
              data: {
                status: "PAID",
                paidAmount: session.amount_total
                  ? session.amount_total / 100
                  : 0,
                paidAt: new Date(),
                stripePaymentId:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : null,
              },
              include: {
                student: {
                  include: {
                    user: true,
                    parentLinks: {
                      include: {
                        parent: {
                          include: {
                            user: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            })

            // Create notification for the student
            if (fee.student.userId) {
              await prisma.notification.create({
                data: {
                  userId: fee.student.userId,
                  title: "Payment Successful",
                  message: `Your payment of PKR ${fee.paidAmount.toLocaleString()} for ${fee.description} has been received.`,
                  type: "SUCCESS",
                  link: "/portal/student",
                },
              })
            }

            // Create notifications for parents
            for (const parentStudent of fee.student.parentLinks) {
              if (parentStudent.parent.userId) {
                await prisma.notification.create({
                  data: {
                    userId: parentStudent.parent.userId,
                    title: "Payment Successful",
                    message: `Payment of PKR ${fee.paidAmount.toLocaleString()} for ${fee.student.firstName}'s ${fee.description} has been received.`,
                    type: "SUCCESS",
                    link: "/portal/parent",
                  },
                })
              }
            }

            // Send confirmation email to student
            if (fee.student.user?.email) {
              try {
                await sendEmail({
                  to: fee.student.user.email,
                  subject: "Payment Confirmation - Al-Noor Academy",
                  html: `
                    <h2>Payment Confirmation</h2>
                    <p>Dear ${fee.student.firstName} ${fee.student.lastName},</p>
                    <p>We have received your payment successfully.</p>
                    <p><strong>Details:</strong></p>
                    <ul>
                      <li>Description: ${fee.description}</li>
                      <li>Amount: PKR ${fee.paidAmount.toLocaleString()}</li>
                      <li>Date: ${new Date().toLocaleDateString()}</li>
                    </ul>
                    <p>Thank you for your payment.</p>
                    <p>Best regards,<br>Al-Noor Academy</p>
                  `,
                })
              } catch (emailError) {
                console.error("Failed to send confirmation email:", emailError)
              }
            }
          }
        }
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object as {
          metadata?: {
            feeId?: string
          }
        }
        const feeId = session.metadata?.feeId

        if (feeId) {
          // Clear the Stripe session ID
          await prisma.fee.update({
            where: { id: feeId },
            data: {
              stripeSessionId: null,
            },
          })
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as {
          metadata?: {
            feeId?: string
            studentId?: string
          }
        }

        const studentId = paymentIntent.metadata?.studentId

        if (studentId) {
          const student = await prisma.student.findUnique({
            where: { id: studentId },
          })

          if (student?.userId) {
            await prisma.notification.create({
              data: {
                userId: student.userId,
                title: "Payment Failed",
                message:
                  "Your payment could not be processed. Please try again.",
                type: "WARNING",
                link: "/portal/student",
              },
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    )
  }
}

// In Next.js App Router, body parsing is handled differently
// The route handler already reads the body as text using request.text()
// No additional configuration is needed
