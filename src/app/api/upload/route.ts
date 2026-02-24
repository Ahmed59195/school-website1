import { NextRequest, NextResponse } from "next/server"
import { generateSignedUploadParams, uploadToCloudinary } from "@/lib/cloudinary"

/**
 * GET /api/upload
 * Generate signed upload parameters for client-side Cloudinary uploads
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get("folder") || "applications"

    // Validate folder name to prevent directory traversal
    const allowedFolders = ["applications", "documents", "photos", "avatars"]
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { error: "Invalid folder specified" },
        { status: 400 }
      )
    }

    const uploadParams = generateSignedUploadParams(folder)

    return NextResponse.json(uploadParams)
  } catch (error) {
    console.error("Failed to generate upload params:", error)
    return NextResponse.json(
      { error: "Failed to generate upload parameters" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/upload
 * Handle server-side file uploads (for smaller files or when client-side upload isn't suitable)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "applications"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Please upload images, PDFs, or Word documents." },
        { status: 400 }
      )
    }

    // Validate folder
    const allowedFolders = ["applications", "documents", "photos", "avatars"]
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { error: "Invalid folder specified" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine resource type
    const resourceType = file.type.startsWith("image/") ? "image" : "raw"

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, {
      folder,
      resourceType: resourceType as "image" | "raw",
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    })
  } catch (error) {
    console.error("Upload failed:", error)
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
