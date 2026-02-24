import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { applicationSchema } from "@/lib/validations/application"

function generateApplicationNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `AN-${year}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = applicationSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.flatten()
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errors.fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Generate a unique application number
    let applicationNumber = generateApplicationNumber()
    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
      const existing = await prisma.application.findUnique({
        where: { applicationNumber },
      })
      if (!existing) break
      applicationNumber = generateApplicationNumber()
      attempts++
    }

    // Parse the guardian name into first and last names
    const guardianNameParts = data.guardianName.trim().split(" ")
    const guardianFirstName = guardianNameParts[0]
    const guardianLastName = guardianNameParts.slice(1).join(" ") || guardianNameParts[0]

    // Create the application
    const application = await prisma.application.create({
      data: {
        applicationNumber,
        status: "PENDING",
        gradeApplying: data.gradeApplying,
        academicYear: "2025-2026",
        // Student data
        studentFirstName: data.firstName,
        studentLastName: data.lastName,
        studentDob: new Date(data.dateOfBirth),
        studentGender: data.gender,
        previousSchool: data.previousSchool,
        // Guardian data
        guardianFirstName,
        guardianLastName,
        guardianEmail: data.guardianEmail,
        guardianPhone: data.guardianPhone,
        guardianRelation: data.relationship,
        guardianOccupation: data.guardianOccupation,
        guardianAddress: `${data.address}, ${data.city}`,
        // Documents as JSON
        documents: {
          birthCertificate: data.birthCertificate,
          previousReportCard: data.previousReportCard,
          guardianCnicCopy: data.guardianCnicCopy,
          photographs: data.photographs,
          additionalDocuments: data.additionalDocuments,
          cnic: data.guardianCnic,
          emergencyContact: {
            name: data.emergencyContactName,
            phone: data.emergencyContactPhone,
          },
          medicalConditions: data.medicalConditions,
        },
      },
    })

    // In a real application, you would send a confirmation email here
    // using SendGrid or another email service

    return NextResponse.json({
      success: true,
      applicationNumber: application.applicationNumber,
      message: "Application submitted successfully",
    })
  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    )
  }
}
