import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations/contact"
import { sendEmail } from "@/lib/email"

// T144: POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = contactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = result.data

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: "NEW",
      },
    })

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@alnooracademy.edu.pk"
    try {
      await sendEmail({
        to: adminEmail,
        subject: `New Contact Form: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
            <h2 style="color: #1e40af;">New Contact Form Submission</h2>
            <table style="width: 100%; max-width: 500px; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>Name</strong></td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>Email</strong></td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>Phone</strong></td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${phone}</td>
              </tr>
              ` : ""}
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;"><strong>Subject</strong></td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${subject}</td>
              </tr>
            </table>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 5px;">
              <strong>Message:</strong>
              <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
            </div>
            <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">
              Submitted on ${new Date().toLocaleString()} | Contact ID: ${contact.id}
            </p>
          </body>
          </html>
        `,
      })
    } catch (emailError) {
      // Log but don't fail the request if email fails
      console.error("Failed to send admin notification email:", emailError)
    }

    return NextResponse.json({
      message: "Contact form submitted successfully",
      id: contact.id,
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
