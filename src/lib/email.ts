import sgMail from "@sendgrid/mail"

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

export interface ApplicationEmailData {
  studentName: string
  guardianName: string
  guardianEmail: string
  gradeApplying: string
  applicationId: string
  submittedAt: Date
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@alnooracademy.edu.pk"
const SCHOOL_NAME = "Al-Noor Academy"

/**
 * Send a generic email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid API key not configured. Email not sent.")
    return false
  }

  try {
    await sgMail.send({
      to: options.to,
      from: FROM_EMAIL,
      subject: options.subject,
      text: options.text || options.html || "",
      html: options.html,
    })
    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

/**
 * Send application confirmation email to parent/guardian
 */
export async function sendApplicationConfirmation(data: ApplicationEmailData): Promise<boolean> {
  const subject = `Application Received - ${SCHOOL_NAME}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1e40af; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">${SCHOOL_NAME}</h1>
      </div>

      <div style="padding: 30px; background-color: #f9fafb;">
        <h2 style="color: #1e40af;">Application Received</h2>

        <p>Dear ${data.guardianName},</p>

        <p>Thank you for submitting an admission application for <strong>${data.studentName}</strong> to ${SCHOOL_NAME}. We have successfully received your application.</p>

        <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Application Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Application ID:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.applicationId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Student Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.studentName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Grade Applying For:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.gradeApplying}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Submitted On:</strong></td>
              <td style="padding: 8px 0;">${data.submittedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #374151;">What Happens Next?</h3>
        <ol style="padding-left: 20px;">
          <li style="margin-bottom: 10px;">Our admissions team will review your application within 5-7 business days.</li>
          <li style="margin-bottom: 10px;">You will receive an email with the status of your application.</li>
          <li style="margin-bottom: 10px;">If shortlisted, we will contact you to schedule an entrance assessment and interview.</li>
        </ol>

        <p>If you have any questions, please don't hesitate to contact our admissions office:</p>
        <ul style="list-style: none; padding: 0;">
          <li>📧 Email: admissions@alnooracademy.edu.pk</li>
          <li>📞 Phone: +92 42 1234 5678</li>
        </ul>

        <p>Best regards,<br><strong>Admissions Office</strong><br>${SCHOOL_NAME}</p>
      </div>

      <div style="background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;">© ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">123 Education Street, Lahore, Pakistan</p>
      </div>
    </body>
    </html>
  `

  const text = `
Application Received - ${SCHOOL_NAME}

Dear ${data.guardianName},

Thank you for submitting an admission application for ${data.studentName} to ${SCHOOL_NAME}. We have successfully received your application.

Application Details:
- Application ID: ${data.applicationId}
- Student Name: ${data.studentName}
- Grade Applying For: ${data.gradeApplying}
- Submitted On: ${data.submittedAt.toLocaleDateString()}

What Happens Next?
1. Our admissions team will review your application within 5-7 business days.
2. You will receive an email with the status of your application.
3. If shortlisted, we will contact you to schedule an entrance assessment and interview.

If you have any questions, please contact our admissions office:
Email: admissions@alnooracademy.edu.pk
Phone: +92 42 1234 5678

Best regards,
Admissions Office
${SCHOOL_NAME}
  `

  return sendEmail({
    to: data.guardianEmail,
    subject,
    text,
    html,
  })
}

/**
 * Send notification to admin about new application
 */
export async function sendAdminApplicationNotification(data: ApplicationEmailData): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@alnooracademy.edu.pk"
  const subject = `New Application: ${data.studentName} - Grade ${data.gradeApplying}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <h2>New Admission Application Received</h2>

      <table style="width: 100%; max-width: 400px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Application ID</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.applicationId}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Student Name</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.studentName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Grade</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.gradeApplying}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Guardian</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.guardianName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Guardian Email</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.guardianEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${data.submittedAt.toLocaleString()}</td>
        </tr>
      </table>

      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/applications/${data.applicationId}"
           style="background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Application
        </a>
      </p>
    </body>
    </html>
  `

  return sendEmail({
    to: adminEmail,
    subject,
    html,
  })
}
